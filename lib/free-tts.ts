/**
 * Free text-to-speech for the radio news (owner decision, 14 Nov 2026).
 *
 * Used whenever OpenAI is switched off (lib/ai-switch.ts). Costs nothing:
 *  1. Microsoft Edge "Read aloud" neural voices (Australian voice by default).
 *  2. If that fails, Google Translate's speech voice as a backup.
 * Plain voice only — no background music is ever mixed in.
 */
import { createHash, randomUUID } from 'node:crypto'
import WebSocket from 'ws'

const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'
const EDGE_VERSION = '130.0.2849.68'
const EDGE_URL = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1'
const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/${EDGE_VERSION}`

/** Australian newsreader voices (change with DV_FREE_TTS_VOICE, e.g. en-AU-WilliamNeural or en-NZ-MollyNeural). */
export const FREE_VOICE = process.env.DV_FREE_TTS_VOICE || 'en-AU-NatashaNeural'
const RATE = process.env.DV_FREE_TTS_RATE || '+0%'

function secMsGec(nowMs = Date.now()) {
  let ticks = BigInt(Math.floor(nowMs / 1000)) + 11644473600n
  ticks -= ticks % 300n
  ticks *= 10000000n
  return createHash('sha256').update(`${ticks}${TRUSTED_CLIENT_TOKEN}`, 'ascii').digest('hex').toUpperCase()
}

function xmlEscape(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function voiceLongName(short: string) {
  const m = short.match(/^([a-z]{2}-[A-Z]{2})-(.+)$/)
  return m ? `Microsoft Server Speech Text to Speech Voice (${m[1]}, ${m[2]})` : short
}

function splitText(text: string, max: number) {
  const sentences = text.match(/[^.!?]+[.!?]+["’”]?\s*|[^.!?]+$/g) || [text]
  const out: string[] = []
  let cur = ''
  const push = () => {
    if (cur.trim()) out.push(cur.trim())
    cur = ''
  }
  for (const s of sentences) {
    if (s.length > max) {
      push()
      const words = s.split(/\s+/)
      for (const w of words) {
        if ((cur + ' ' + w).length > max) push()
        cur += (cur ? ' ' : '') + w
      }
      push()
      continue
    }
    if ((cur + s).length > max) push()
    cur += s
  }
  push()
  return out
}

/** One Edge request. Resolves with MP3 bytes. */
export function edgeSpeak(text: string, voice = FREE_VOICE, endpoint = EDGE_URL, timeoutMs = 45_000): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const connectionId = randomUUID().replace(/-/g, '')
    const url = `${endpoint}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${secMsGec()}&Sec-MS-GEC-Version=1-${EDGE_VERSION}&ConnectionId=${connectionId}`
    const ws = new WebSocket(url, {
      headers: {
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        'User-Agent': USER_AGENT,
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
    const audio: Buffer[] = []
    let done = false
    const finish = (err?: Error) => {
      if (done) return
      done = true
      clearTimeout(timer)
      try {
        ws.close()
      } catch {
        /* ignore */
      }
      if (err) return reject(err)
      const total = Buffer.concat(audio)
      if (!total.length) return reject(new Error('Edge TTS returned no audio'))
      resolve(new Uint8Array(total))
    }
    const timer = setTimeout(() => finish(new Error('Edge TTS timed out')), timeoutMs)

    ws.on('open', () => {
      const ts = new Date().toString()
      ws.send(
        `X-Timestamp:${ts}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
          '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n',
      )
      const ssml =
        `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>` +
        `<voice name='${voiceLongName(voice)}'><prosody pitch='+0Hz' rate='${RATE}' volume='+0%'>${xmlEscape(text)}</prosody></voice></speak>`
      ws.send(
        `X-RequestId:${randomUUID().replace(/-/g, '')}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${ts}Z\r\nPath:ssml\r\n\r\n${ssml}`,
      )
    })
    ws.on('message', (data: Buffer | ArrayBuffer | Buffer[], isBinary: boolean) => {
      const buf = Buffer.isBuffer(data) ? data : Array.isArray(data) ? Buffer.concat(data) : Buffer.from(data as ArrayBuffer)
      if (!isBinary) {
        if (buf.toString('utf8').includes('Path:turn.end')) finish()
        return
      }
      if (buf.length < 2) return
      const headerLen = buf.readUInt16BE(0)
      const header = buf.subarray(2, 2 + headerLen).toString('utf8')
      if (header.includes('Path:audio')) audio.push(buf.subarray(2 + headerLen))
    })
    ws.on('unexpected-response', (_req: unknown, res: { statusCode?: number }) => finish(new Error(`Edge TTS refused (${res.statusCode})`)))
    ws.on('error', (err: unknown) => finish(err instanceof Error ? err : new Error(String(err))))
    ws.on('close', () => finish(audio.length ? undefined : new Error('Edge TTS closed early')))
  })
}

/** Backup voice: Google Translate speech (max ~200 characters per request). */
async function googleSpeak(text: string): Promise<Uint8Array> {
  const parts: Uint8Array[] = []
  for (const chunk of splitText(text, 190)) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en-AU&q=${encodeURIComponent(chunk)}`
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Referer: 'https://translate.google.com/' } })
    if (!res.ok) throw new Error(`Google TTS failed (${res.status})`)
    parts.push(new Uint8Array(await res.arrayBuffer()))
  }
  return concat(parts)
}

function concat(parts: Uint8Array[]) {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
  let o = 0
  for (const p of parts) {
    out.set(p, o)
    o += p.length
  }
  return out
}

/** Speak any length of text for free. Throws only if both free voices fail. */
export async function freeSpeak(text: string): Promise<Uint8Array> {
  const parts: Uint8Array[] = []
  for (const chunk of splitText(text, 1500)) {
    try {
      parts.push(await edgeSpeak(chunk))
    } catch (edgeError) {
      console.error('Edge TTS failed, using Google backup:', edgeError)
      parts.push(await googleSpeak(chunk))
    }
  }
  return concat(parts)
}
