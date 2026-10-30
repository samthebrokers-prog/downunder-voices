/**
 * Downunder Voices Radio — server-side broadcast content.
 *
 * Vercel cron jobs call this to write the hourly news bulletin and the
 * programme for each hour. The finished MP3s are stored in Supabase
 * Storage (public bucket "radio"). The AzuraCast station on the radio
 * server fetches the newest file at the top of each hour (news) and at
 * half past (programme), so every listener hears the same broadcast.
 *
 * Nothing here runs in a listener's browser. The OpenAI key stays on the
 * server.
 */
import { dbRequest } from '@/lib/db'
import { getRadioVoice, type RadioPresenter } from '@/lib/radio-voices'

export type BroadcastKind = 'news' | 'programme'

type Story = {
  title: string
  summary: string | null
  category: string
  published_at: string
}

const BUCKET = 'radio'
const KEEP_FILES = 6
const TTS_CHUNK = 3500

/* ------------------------------------------------------------------ */
/* Environment                                                         */
/* ------------------------------------------------------------------ */

function cleanEnv(value?: string) {
  const trimmed = value?.trim() ?? ''
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

const supabaseUrl = cleanEnv(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
).replace(/\/$/, '')
const supabaseKey = cleanEnv(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
)

function storageHeaders(extra: Record<string, string> = {}) {
  const headers: Record<string, string> = { apikey: supabaseKey, ...extra }
  if (supabaseKey.startsWith('eyJ') && supabaseKey.split('.').length === 3) {
    headers.Authorization = `Bearer ${supabaseKey}`
  }
  return headers
}

/* ------------------------------------------------------------------ */
/* Time helpers                                                        */
/* ------------------------------------------------------------------ */

function sydneyHour(date: Date) {
  return Number(
    new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney',
      hour: 'numeric',
      hourCycle: 'h23',
    }).format(date),
  )
}

function spokenTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .replace(':00', '')
    .replace(/\s?am/i, ' a.m.')
    .replace(/\s?pm/i, ' p.m.')
}

/** The top of the next hour — the moment this bulletin will be broadcast. */
function nextTopOfHour(now = new Date()) {
  const next = new Date(now)
  next.setUTCMinutes(0, 0, 0)
  if (next <= now) next.setUTCHours(next.getUTCHours() + 1)
  return next
}

/* ------------------------------------------------------------------ */
/* Stories                                                             */
/* ------------------------------------------------------------------ */

function clean(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

async function latestStories(limit = 80) {
  return dbRequest<Story[]>('stories', {
    query: `?select=title,summary,category,published_at&status=eq.published&published_at=not.is.null&order=published_at.desc&limit=${limit}`,
  })
}

function pick(stories: Story[], categories: string[], count: number, used: Set<Story>) {
  const out: Story[] = []
  for (const story of stories) {
    if (out.length >= count) break
    if (used.has(story) || !categories.includes(story.category)) continue
    used.add(story)
    out.push(story)
  }
  return out
}

function factSheet(stories: Story[]) {
  return stories
    .map(
      (s, i) =>
        `${i + 1}. [${s.category}] ${clean(s.title)} — ${clean(s.summary || s.title).slice(0, 900)}`,
    )
    .join('\n')
}

/* ------------------------------------------------------------------ */
/* OpenAI                                                              */
/* ------------------------------------------------------------------ */

const EDITORIAL_RULES = `
- Use ONLY the facts supplied. Never add facts, numbers, names or events that are not in the supplied material.
- Never invent quotations. Do not put words in anyone's mouth.
- Politically independent: apply the same standard to every party, government and opposition alike.
- Never make light of death, disaster, violence or personal tragedy.
- Write for the ear: short sentences, plain words, no headings, no bullet points, no URLs, no stage directions, no sound-effect notes.
- Australian/New Zealand English spelling.
- Output only the words the presenter will read aloud.
`.trim()

async function writeScript(instructions: string, input: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.DV_RADIO_SCRIPT_MODEL || 'gpt-5-mini',
      instructions,
      input,
    }),
  })

  if (!response.ok) {
    throw new Error(`Script writing failed (${response.status}): ${(await response.text()).slice(0, 300)}`)
  }

  const data = (await response.json()) as {
    output_text?: string
    output?: { type: string; content?: { type: string; text?: string }[] }[]
  }

  const text =
    data.output_text ||
    (data.output || [])
      .flatMap((item) => item.content || [])
      .filter((c) => c.type === 'output_text' && c.text)
      .map((c) => c.text)
      .join('\n')

  const script = clean((text || '').replace(/[*#_`>]/g, ' ')).trim()
  if (script.length < 200) throw new Error('Script came back too short')
  return script
}

function splitForSpeech(script: string) {
  const sentences = script.match(/[^.!?]+[.!?]+["’”]?\s*|[^.!?]+$/g) || [script]
  const chunks: string[] = []
  let current = ''
  for (const sentence of sentences) {
    if ((current + sentence).length > TTS_CHUNK && current) {
      chunks.push(current.trim())
      current = ''
    }
    current += sentence
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

async function speak(script: string, presenter: RadioPresenter) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')
  const profile = getRadioVoice(presenter)

  const parts: Uint8Array[] = []
  for (const chunk of splitForSpeech(script)) {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.DV_RADIO_TTS_MODEL || 'gpt-4o-mini-tts',
        voice: profile.voice,
        input: chunk,
        instructions: profile.instructions,
        response_format: 'mp3',
      }),
    })
    if (!response.ok) {
      throw new Error(`Speech failed (${response.status}): ${(await response.text()).slice(0, 300)}`)
    }
    parts.push(new Uint8Array(await response.arrayBuffer()))
  }

  // MP3 frames can be joined end to end.
  const total = parts.reduce((n, p) => n + p.length, 0)
  const audio = new Uint8Array(total)
  let offset = 0
  for (const part of parts) {
    audio.set(part, offset)
    offset += part.length
  }
  return audio
}

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */

async function ensureBucket() {
  const check = await fetch(`${supabaseUrl}/storage/v1/bucket/${BUCKET}`, {
    headers: storageHeaders(),
    cache: 'no-store',
  })
  if (check.ok) return
  const create = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: 'POST',
    headers: storageHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  })
  if (!create.ok && create.status !== 409) {
    throw new Error(`Could not create radio storage (${create.status}): ${(await create.text()).slice(0, 200)}`)
  }
}

type StoredObject = { name: string; created_at: string }

async function listObjects(kind: BroadcastKind) {
  const response = await fetch(`${supabaseUrl}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST',
    headers: storageHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      prefix: `${kind}/`,
      limit: 100,
      sortBy: { column: 'name', order: 'desc' },
    }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Could not list radio files (${response.status})`)
  const items = (await response.json()) as StoredObject[]
  return items.filter((item) => item.name.endsWith('.mp3'))
}

async function upload(kind: BroadcastKind, fileName: string, audio: Uint8Array) {
  await ensureBucket()
  const path = `${kind}/${fileName}`
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: storageHeaders({
      'Content-Type': 'audio/mpeg',
      'x-upsert': 'true',
      'cache-control': 'max-age=31536000',
    }),
    body: audio.buffer as ArrayBuffer,
  })
  if (!response.ok) {
    throw new Error(`Could not save radio audio (${response.status}): ${(await response.text()).slice(0, 200)}`)
  }

  // Keep storage small: only the newest few files of each kind.
  try {
    const old = (await listObjects(kind)).slice(KEEP_FILES)
    if (old.length) {
      await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}`, {
        method: 'DELETE',
        headers: storageHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ prefixes: old.map((o) => `${kind}/${o.name}`) }),
      })
    }
  } catch (error) {
    console.error('Radio storage clean-up failed:', error)
  }

  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`
}

/** Public URL of the newest file of this kind, or null if none yet. */
export async function latestBroadcastUrl(kind: BroadcastKind) {
  const [newest] = await listObjects(kind)
  if (!newest) return null
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${kind}/${newest.name}`
}

function stamp(date: Date) {
  // e.g. 2026-10-31T0100Z — names sort in time order
  return date.toISOString().slice(0, 16).replace(/[^0-9T]/g, '') + 'Z'
}

/* ------------------------------------------------------------------ */
/* Hourly news bulletin                                                */
/* ------------------------------------------------------------------ */

export async function produceNewsBulletin(now = new Date()) {
  const airTime = nextTopOfHour(now)
  const stories = await latestStories(80)
  const used = new Set<Story>()

  // Priority: Australia, then New Zealand, then major world news.
  const australia = pick(stories, ['australia'], 5, used)
  const newZealand = pick(stories, ['new-zealand'], 4, used)
  const world = pick(stories, ['world'], 3, used)
  const extra = pick(stories, ['business', 'sports', 'sport'], 2, used)

  const sydney = spokenTime(airTime, 'Australia/Sydney')
  const auckland = spokenTime(airTime, 'Pacific/Auckland')

  const instructions = `
You write the hourly news bulletin for Downunder Voices Radio, an independent digital station for Australia and New Zealand.
Length: 650 to 750 words (about five minutes read aloud).
Order: Australian stories first, then New Zealand, then major world news, then short business and sport items if supplied.
Open exactly with: "Downunder Voices News at ${sydney} in Sydney, ${auckland} in Auckland."
Then give the stories. Use brief spoken links such as "In New Zealand," and "Overseas,".
Close exactly with: "That's the news. This is Downunder Voices Radio."
${EDITORIAL_RULES}
`.trim()

  const input = `
AUSTRALIA:
${factSheet(australia) || 'none'}

NEW ZEALAND:
${factSheet(newZealand) || 'none'}

WORLD:
${factSheet(world) || 'none'}

BUSINESS / SPORT:
${factSheet(extra) || 'none'}
`.trim()

  let script: string
  try {
    script = await writeScript(instructions, input)
  } catch (error) {
    console.error('Bulletin writer failed, using plain read:', error)
    const lines = [...australia, ...newZealand, ...world, ...extra].map(
      (s) => `${clean(s.title)}. ${clean(s.summary || '').slice(0, 300)}`,
    )
    script = [
      `Downunder Voices News at ${sydney} in Sydney, ${auckland} in Auckland.`,
      ...lines,
      `That's the news. This is Downunder Voices Radio.`,
    ].join(' ')
  }

  const presenter: RadioPresenter = airTime.getUTCHours() % 2 === 0 ? 'female' : 'male'
  const audio = await speak(script, presenter)
  const url = await upload('news', `${stamp(airTime)}.mp3`, audio)

  return { kind: 'news' as const, airTime: airTime.toISOString(), presenter, words: script.split(' ').length, bytes: audio.length, url }
}

/* ------------------------------------------------------------------ */
/* Programmes (broadcast at half past each hour)                        */
/* ------------------------------------------------------------------ */

type Show = {
  name: string
  categories: string[]
  brief: string
  evergreen?: boolean
}

const SHOWS: Show[] = [
  { name: 'Australia Today', categories: ['australia'], brief: 'A closer look at two or three of the Australian stories behind today’s headlines: what happened, why it matters, who is affected.' },
  { name: 'New Zealand Today', categories: ['new-zealand'], brief: 'A closer look at two or three New Zealand stories: what happened, why it matters, who is affected.' },
  { name: 'World Briefing', categories: ['world'], brief: 'Important overseas developments, explained for listeners in Australia and New Zealand, including any local connection where the facts support it.' },
  { name: 'Political Hiccups', categories: ['australia', 'new-zealand', 'world'], brief: 'A short, factual, politically independent and occasionally light-hearted look at genuine political contradictions, backflips and unusual moments found in the supplied stories. Apply exactly the same standard to government and opposition. Humour must be gentle and aimed at the contradiction, never at people suffering. If a supplied story involves death, disaster or tragedy, do not joke about it. Do not invent quotations; only describe what the supplied facts say. If the supplied stories contain no genuine contradiction, say so honestly and give a straight factual political round-up instead.' },
  { name: 'Business and Cost of Living', categories: ['business'], brief: 'Money, prices, jobs and business news that affects households in Australia and New Zealand.' },
  { name: 'Sport Downunder', categories: ['sports', 'sport'], brief: 'The sporting stories people across Australia and New Zealand are talking about.' },
  { name: 'Technology and Science', categories: ['technology', 'tech', 'science'], brief: 'Technology, science and ideas changing everyday life, explained simply.' },
  { name: 'Entertainment and Culture', categories: ['entertainment', 'culture'], brief: 'Entertainment, arts and culture stories, warm and conversational.' },
  { name: 'Public Interest', categories: ['australia', 'new-zealand', 'business'], brief: 'Stories that matter to ordinary people and communities: services, housing, health access, consumer rights.' },
  { name: 'History Downunder', categories: [], evergreen: true, brief: 'One well-documented event or person from Australian or New Zealand history. Use only widely established historical facts. Do not invent dates, numbers or quotations; if unsure of a detail, leave it out.' },
  { name: 'Strange Australia', categories: [], evergreen: true, brief: 'One well-known unusual place, creature, phenomenon or true oddity in Australia. Only widely documented facts; clearly label legends as legends.' },
  { name: 'Mysteries of New Zealand', categories: [], evergreen: true, brief: 'One well-known New Zealand mystery, legend or unusual natural feature. Only widely documented facts; clearly label legends and unproven theories as such. Do not speculate about unsolved crimes involving real victims.' },
  { name: 'Travel Downunder', categories: [], evergreen: true, brief: 'An appealing, practical audio postcard about one well-known destination in Australia or New Zealand. No prices, opening hours or bookings, as these change.' },
]

/** Which show airs at half past this Sydney hour. Political Hiccups airs a few times a day. */
function showForHour(airTime: Date) {
  const hour = sydneyHour(airTime)
  const dayIndex = Math.floor(airTime.getTime() / 86_400_000)
  if (hour === 8 || hour === 13 || hour === 18) {
    return SHOWS.find((s) => s.name === 'Political Hiccups')!
  }
  const rotation = SHOWS.filter((s) => s.name !== 'Political Hiccups')
  return rotation[(hour + dayIndex * 5) % rotation.length]
}

function nextHalfPast(now = new Date()) {
  const next = new Date(now)
  next.setUTCMinutes(30, 0, 0)
  if (next <= now) next.setUTCHours(next.getUTCHours() + 1)
  return next
}

export async function produceProgramme(now = new Date(), forceShow?: string) {
  const airTime = nextHalfPast(now)
  const show = (forceShow && SHOWS.find((s) => s.name.toLowerCase() === forceShow.toLowerCase())) || showForHour(airTime)

  let input = 'No news material: this is an evergreen feature.'
  if (!show.evergreen) {
    const stories = await latestStories(80)
    let selected = stories.filter((s) => show.categories.includes(s.category)).slice(0, show.name === 'Political Hiccups' ? 10 : 4)
    if (selected.length < 2) selected = stories.slice(0, 4)
    input = `STORIES:\n${factSheet(selected)}`
  }

  const instructions = `
You write "${show.name}", a programme on Downunder Voices Radio, an independent digital station for Australia and New Zealand.
Brief: ${show.brief}
Length: 450 to 550 words (about three and a half minutes read aloud). One presenter, warm and conversational.
Open with: "This is ${show.name}, on Downunder Voices Radio."
Close with: "That's ${show.name}. Stay with Downunder Voices Radio. News is at the top of the hour."
${EDITORIAL_RULES}
`.trim()

  const script = await writeScript(instructions, input)
  const presenter: RadioPresenter = airTime.getUTCHours() % 2 === 0 ? 'male' : 'female'
  const audio = await speak(script, presenter)
  const url = await upload('programme', `${stamp(airTime)}.mp3`, audio)

  return { kind: 'programme' as const, show: show.name, airTime: airTime.toISOString(), presenter, words: script.split(' ').length, bytes: audio.length, url }
}
