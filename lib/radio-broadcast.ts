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
- Use ONLY the facts supplied, plus (only where explicitly allowed below) facts verified by web search from reputable sources. Never guess or add unverified facts, numbers, names or events.
- Never invent quotations. Do not put words in anyone's mouth.
- Politically independent: apply the same standard to every party, government and opposition alike.
- Never make light of death, disaster, violence or personal tragedy.
- Write for the ear: short sentences, plain words, no headings, no bullet points, no URLs, no stage directions, no sound-effect notes.
- Australian/New Zealand English spelling.
- Output only the words the presenter will read aloud.
`.trim()

async function callWriter(instructions: string, input: string, research = false) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.DV_RADIO_SCRIPT_MODEL || 'gpt-5-mini',
      instructions,
      input,
      ...(research ? { tools: [{ type: 'web_search' }] } : {}),
    }),
  })

  if (!response.ok) {
    throw new Error(`Script writing failed (${response.status}): ${(await response.text()).slice(0, 300)}`)
  }

  const data = (await response.json()) as {
    output_text?: string
    output?: { type: string; content?: { type: string; text?: string }[] }[]
  }

  return (
    data.output_text ||
    (data.output || [])
      .filter((item) => item.type === 'message')
      .flatMap((item) => item.content || [])
      .filter((c) => c.type === 'output_text' && c.text)
      .map((c) => c.text)
      .join('\n')
  )
}

function speakable(text: string) {
  return clean(
    text
      .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '$1') // markdown links -> link text
      .replace(/\(\s*\[?[a-z0-9.-]+\.[a-z]{2,}[^)]*\)/gi, ' ') // (example.com) citations
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/[*#_`>]/g, ' '),
  )
}

async function writeScript(instructions: string, input: string, research = false) {
  const script = speakable(await callWriter(instructions, input, research))
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
BREAKING NEWS CHECK: The supplied Downunder Voices stories are your main source. You may ALSO use web search to check for any MAJOR breaking story in Australia or New Zealand (or a very major world event) from the last 6 hours that is missing from the supplied list. Include at most two such items, only if reported by a reputable outlet (for example ABC, RNZ, SBS, Stuff, NZ Herald, 1News, Reuters, AP, BBC, or official government or police statements), and attribute them in speech ("RNZ reports...", "according to the ABC..."). Report only what those outlets confirm. If nothing major is missing, add nothing.
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
    script = await writeScript(instructions, input, true)
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
/* Programme engine (broadcast at half past each hour)                 */
/* ------------------------------------------------------------------ */
/*
 * News-led shows use Downunder Voices stories plus verified web research.
 * Feature shows are researched from reliable public sources — they do not
 * depend on the website at all. Each programme is researched and written
 * once, voiced once, cached, then broadcast to every listener.
 */

type Show = {
  name: string
  /** Website story categories for news-led shows. Empty = researched feature. */
  categories: string[]
  brief: string
  careful?: boolean
}

const RESEARCH_RULES = `
RESEARCH: Use web search. Rely on reliable public sources: government and parliamentary records, courts, museums, national libraries and archives (e.g. Trove, Te Ara, Papers Past, DigitalNZ, National Archives), universities, scientific bodies, and established news organisations. Check each key fact against at least two sources where possible. If a detail cannot be confirmed, leave it out.
Write an ORIGINAL script in your own words. Do not copy sentences from sources.
Clearly separate established facts from claims, legends and theories ("It is believed...", "One theory is...", "Locals say...").
`.trim()

const CAREFUL_RULES = `
EXTRA CARE (crime, mysteries, disasters):
- Prefer historical or long-concluded cases. Do not cover ongoing investigations or cases before the courts.
- Never name or hint at a living private person as responsible unless they were convicted; for allegations say "alleged" and name only what courts or police have made public.
- Describe convictions accurately; mention acquittals, appeals or doubts where they exist.
- Treat victims and families with dignity. No graphic detail, no sensationalism, no jokes.
- For disasters, focus on what happened, the human response, and what changed afterwards.
`.trim()

const SHOWS: Show[] = [
  { name: 'Australia Today', categories: ['australia'], brief: 'A closer look at two or three Australian stories behind today’s headlines: what happened, why it matters, who is affected. You may use web search for the latest verified developments.' },
  { name: 'New Zealand Today', categories: ['new-zealand'], brief: 'A closer look at two or three New Zealand stories: what happened, why it matters, who is affected. You may use web search for the latest verified developments.' },
  { name: 'World Briefing', categories: ['world'], brief: 'Important overseas developments explained for listeners in Australia and New Zealand, including any local connection the facts support.' },
  { name: 'Business and Cost of Living', categories: ['business'], brief: 'Money, prices, jobs, interest rates and business news affecting households in Australia and New Zealand.' },
  { name: 'Sport Downunder', categories: ['sports', 'sport'], brief: 'A sport feature: the stories people across Australia and New Zealand are talking about, or a memorable moment from our sporting history.' },
  { name: 'Mysteries Downunder', categories: [], careful: true, brief: 'One well-documented Australian mystery, unexplained event or enduring puzzle.' },
  { name: 'Mysteries of New Zealand', categories: [], careful: true, brief: 'One well-documented New Zealand mystery, legend or unexplained event.' },
  { name: 'Crime Files', categories: [], careful: true, brief: 'One famous historical criminal case from Australia or New Zealand that is long concluded: what happened, the investigation, the outcome, and what it changed.' },
  { name: 'Unsolved', categories: [], careful: true, brief: 'One long-standing unsolved Australian or New Zealand case, handled responsibly: established facts only, theories clearly labelled, respect for victims. Mention that anyone with information can contact police or Crime Stoppers.' },
  { name: 'Strange But True', categories: [], brief: 'One genuinely strange but well-documented true story from Australia, New Zealand or the Pacific.' },
  { name: 'Forgotten Australia', categories: [], brief: 'One forgotten or little-known Australian story, place or person worth remembering.' },
  { name: 'Forgotten New Zealand', categories: [], brief: 'One forgotten or little-known New Zealand story, place or person worth remembering.' },
  { name: 'History Downunder', categories: [], brief: 'One important event from Australian or New Zealand history, told vividly and accurately.' },
  { name: 'Remarkable Lives', categories: [], brief: 'A short biography of one remarkable Australian, New Zealander or Pacific Islander, past or present.' },
  { name: 'Science and Discovery', categories: [], brief: 'One discovery, invention or piece of science, ideally with an Australian or New Zealand connection.' },
  { name: 'Tech and Tomorrow', categories: [], brief: 'Technology, AI, cybersecurity or innovation changing everyday life, explained simply, with practical takeaways.' },
  { name: 'Space Downunder', categories: [], brief: 'Space and astronomy: a mission, discovery, or what to see in southern skies, with Australian and New Zealand connections where possible.' },
  { name: 'Unusual Places', categories: [], brief: 'One unusual, remarkable or little-known place in Australia, New Zealand or the Pacific.' },
  { name: 'Travel Downunder', categories: [], brief: 'An audio postcard about one destination in Australia or New Zealand. No prices, opening hours or bookings, as these change.' },
  { name: 'Pacific Stories', categories: [], brief: 'A story from the Pacific Islands: history, culture, people, environment or connections with Australia and New Zealand.' },
  { name: 'Culture and Entertainment', categories: [], brief: 'Arts, music, film, books or culture with an Australian or New Zealand angle; warm and conversational.' },
  { name: 'Disasters and Survival', categories: [], careful: true, brief: 'One major historical disaster or remarkable survival story, told seriously and respectfully.' },
  { name: 'Consumer Watch', categories: [], brief: 'A practical public-interest feature for Australian and New Zealand households: consumer rights, scams to watch for, saving money, using public services. General information only, not personal financial advice.' },
  { name: 'Around the World', categories: [], brief: 'One interesting, uplifting or surprising international story listeners in Australia and New Zealand would enjoy.' },
]

const POLITICAL_HICCUPS: Show = {
  name: 'Political Hiccups',
  categories: ['australia', 'new-zealand', 'world'],
  brief: 'Our signature show: a short, factual, politically independent and occasionally light-hearted look at genuine political contradictions, backflips and unusual moments in Australian and New Zealand politics. Use web search to verify each example from reputable reporting or official records. Apply exactly the same standard to government and opposition and across parties — aim for balance across the programme. Humour must be gentle and aimed at the contradiction, never at people suffering, and never about death, disaster or tragedy. Never invent or paraphrase as a quotation; only quote words you have verified, and attribute them.',
}

/** Sydney hours when Political Hiccups airs — a signature show, not every slot. */
const HICCUPS_HOURS = [8, 18]

const HISTORY_PATH = 'state/programme-history.json'
type History = { show: string; subject: string; airTime: string }[]

async function readHistory(): Promise<History> {
  try {
    const response = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${HISTORY_PATH}`, {
      headers: storageHeaders(),
      cache: 'no-store',
    })
    if (!response.ok) return []
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function writeHistory(history: History) {
  await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${HISTORY_PATH}`, {
    method: 'POST',
    headers: storageHeaders({ 'Content-Type': 'application/json', 'x-upsert': 'true', 'cache-control': 'max-age=0' }),
    body: JSON.stringify(history.slice(-400)),
  })
}

/** Pick the show for this half-hour: Political Hiccups twice a day, otherwise the least recently aired show. */
function chooseShow(airTime: Date, history: History, forceShow?: string) {
  if (forceShow) {
    const forced = [...SHOWS, POLITICAL_HICCUPS].find((s) => s.name.toLowerCase() === forceShow.toLowerCase())
    if (forced) return forced
  }
  if (HICCUPS_HOURS.includes(sydneyHour(airTime))) return POLITICAL_HICCUPS

  const lastAired = new Map<string, number>()
  history.forEach((entry, index) => lastAired.set(entry.show, index))
  // News-led shows are useful more often: they count as "older" by a few slots.
  const score = (show: Show) => (lastAired.get(show.name) ?? -1000) - (show.categories.length ? 6 : 0)
  return [...SHOWS].sort((a, b) => score(a) - score(b))[0]
}

function nextHalfPast(now = new Date()) {
  const next = new Date(now)
  next.setUTCMinutes(30, 0, 0)
  if (next <= now) next.setUTCHours(next.getUTCHours() + 1)
  return next
}

export async function produceProgramme(now = new Date(), forceShow?: string) {
  const airTime = nextHalfPast(now)
  const history = await readHistory()
  const show = chooseShow(airTime, history, forceShow)

  const recentSubjects = history
    .slice(-150)
    .map((h) => h.subject)
    .filter(Boolean)

  let material = ''
  if (show.categories.length) {
    const stories = await latestStories(80)
    const selected = stories
      .filter((s) => show.categories.includes(s.category))
      .slice(0, show === POLITICAL_HICCUPS ? 10 : 5)
    material = selected.length ? `DOWNUNDER VOICES STORIES (starting points):\n${factSheet(selected)}` : ''
  }

  const instructions = `
You research and write "${show.name}", a programme on Downunder Voices Radio, an independent digital station for Australia and New Zealand.
Brief: ${show.brief}
${RESEARCH_RULES}
${show.careful ? CAREFUL_RULES : ''}
Do NOT repeat any of these recently covered subjects: ${recentSubjects.length ? recentSubjects.join('; ') : 'none yet'}.
Length of the script: 450 to 550 words (about three and a half minutes read aloud). One presenter, warm and conversational, with a clear beginning, middle and end.
The script must open with: "This is ${show.name}, on Downunder Voices Radio."
The script must close with: "That's ${show.name}. Stay with Downunder Voices Radio. News is at the top of the hour."
- Never invent quotations. Politically independent.
- Write for the ear: short sentences, plain words, no headings, no lists, no URLs, no citations read aloud, no stage directions.
- Australian/New Zealand English spelling.

OUTPUT FORMAT — exactly three parts:
SUBJECT: <a short name for the specific subject you chose>
SOURCES: <the main sources you relied on, separated by semicolons>
SCRIPT:
<the words the presenter reads aloud, nothing else>
`.trim()

  const input = material || 'Choose a specific subject that fits the brief and has not been covered recently, research it, then write the script.'

  const raw = await callWriter(instructions, input, true)
  const subject = clean(raw.match(/SUBJECT:\s*(.+)/i)?.[1] || show.name).slice(0, 160)
  const sources = clean(raw.match(/SOURCES:\s*([\s\S]*?)\n\s*SCRIPT:/i)?.[1] || '').slice(0, 1000)
  const body = raw.split(/SCRIPT:\s*/i)[1] ?? raw
  const script = speakable(body)
  if (script.length < 800) throw new Error(`Programme script came back too short (${script.length} characters)`)

  const presenter: RadioPresenter = airTime.getUTCHours() % 2 === 0 ? 'male' : 'female'
  const audio = await speak(script, presenter)
  const url = await upload('programme', `${stamp(airTime)}.mp3`, audio)

  try {
    await writeHistory([...history, { show: show.name, subject, airTime: airTime.toISOString() }])
  } catch (error) {
    console.error('Could not record programme history:', error)
  }

  return { kind: 'programme' as const, show: show.name, subject, sources, airTime: airTime.toISOString(), presenter, words: script.split(' ').length, bytes: audio.length, url }
}
