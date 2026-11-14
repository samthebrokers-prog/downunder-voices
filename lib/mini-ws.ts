/**
 * A tiny WebSocket client (no extra packages) used only by the free radio voice.
 * Supports wss:// and ws://, custom headers, text/binary messages and fragmentation.
 */
import { randomBytes, createHash } from 'node:crypto'
import * as net from 'node:net'
import * as tls from 'node:tls'

export type MiniWsHandlers = {
  onOpen: (send: (text: string) => void) => void
  onMessage: (data: Buffer, isBinary: boolean) => void
  onError: (err: Error) => void
  onClose: () => void
}

export function connectMiniWs(urlString: string, headers: Record<string, string>, h: MiniWsHandlers) {
  const url = new URL(urlString)
  const secure = url.protocol === 'wss:'
  const port = Number(url.port) || (secure ? 443 : 80)
  const key = randomBytes(16).toString('base64')
  const socket: net.Socket = secure
    ? tls.connect({ host: url.hostname, port, servername: url.hostname })
    : net.connect({ host: url.hostname, port })

  let open = false
  let closed = false
  let buf = Buffer.alloc(0)
  let fragments: Buffer[] = []
  let fragBinary = false

  const close = () => {
    if (closed) return
    closed = true
    socket.destroy()
    h.onClose()
  }

  const sendFrame = (opcode: number, payload: Buffer) => {
    const mask = randomBytes(4)
    let header: Buffer
    if (payload.length < 126) {
      header = Buffer.from([0x80 | opcode, 0x80 | payload.length])
    } else if (payload.length < 65536) {
      header = Buffer.alloc(4)
      header[0] = 0x80 | opcode
      header[1] = 0x80 | 126
      header.writeUInt16BE(payload.length, 2)
    } else {
      header = Buffer.alloc(10)
      header[0] = 0x80 | opcode
      header[1] = 0x80 | 127
      header.writeBigUInt64BE(BigInt(payload.length), 2)
    }
    const masked = Buffer.alloc(payload.length)
    for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ mask[i % 4]
    socket.write(Buffer.concat([header, mask, masked]))
  }

  const parseFrames = () => {
    while (buf.length >= 2) {
      const fin = (buf[0] & 0x80) !== 0
      const opcode = buf[0] & 0x0f
      let len = buf[1] & 0x7f
      let offset = 2
      if (len === 126) {
        if (buf.length < 4) return
        len = buf.readUInt16BE(2)
        offset = 4
      } else if (len === 127) {
        if (buf.length < 10) return
        len = Number(buf.readBigUInt64BE(2))
        offset = 10
      }
      const masked = (buf[1] & 0x80) !== 0
      const maskKey = masked ? buf.subarray(offset, offset + 4) : null
      if (masked) offset += 4
      if (buf.length < offset + len) return
      let payload = Buffer.from(buf.subarray(offset, offset + len))
      if (maskKey) for (let i = 0; i < payload.length; i++) payload[i] ^= maskKey[i % 4]
      buf = buf.subarray(offset + len)

      if (opcode === 0x8) {
        close()
        return
      }
      if (opcode === 0x9) {
        sendFrame(0xa, payload)
        continue
      }
      if (opcode === 0xa) continue
      if (opcode === 0x1 || opcode === 0x2) {
        fragBinary = opcode === 0x2
        fragments = [payload]
      } else if (opcode === 0x0) {
        fragments.push(payload)
      }
      if (fin && (opcode === 0x0 || opcode === 0x1 || opcode === 0x2)) {
        payload = Buffer.concat(fragments)
        fragments = []
        h.onMessage(payload, fragBinary)
      }
    }
  }

  socket.on(secure ? 'secureConnect' : 'connect', () => {
    const lines = [
      `GET ${url.pathname}${url.search} HTTP/1.1`,
      `Host: ${url.host}`,
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Key: ${key}`,
      'Sec-WebSocket-Version: 13',
      ...Object.entries(headers).map(([k, v]) => `${k}: ${v}`),
    ]
    socket.write(lines.join('\r\n') + '\r\n\r\n')
  })

  socket.on('data', (chunk: Buffer) => {
    buf = Buffer.concat([buf, chunk])
    if (!open) {
      const end = buf.indexOf('\r\n\r\n')
      if (end < 0) return
      const head = buf.subarray(0, end).toString('latin1')
      buf = buf.subarray(end + 4)
      const status = Number(head.split(' ')[1])
      const accept = createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64')
      if (status !== 101 || !head.toLowerCase().includes(accept.toLowerCase())) {
        h.onError(new Error(`WebSocket refused (${status || 'no status'})`))
        close()
        return
      }
      open = true
      h.onOpen((text) => sendFrame(0x1, Buffer.from(text, 'utf8')))
    }
    parseFrames()
  })
  socket.on('error', (err) => {
    h.onError(err)
    close()
  })
  socket.on('close', close)

  return {
    close: () => {
      if (!closed && open) {
        try {
          sendFrame(0x8, Buffer.alloc(0))
        } catch {
          /* ignore */
        }
      }
      close()
    },
  }
}
