/**
 * Downunder Voices Radio — server-side broadcast content (cost-controlled).
 *
 * THE RULE: research once → write once → voice once → cache → broadcast the
 * same file to every listener. Listeners never cause any AI cost.
 *
 * Hourly news (:50 build, airs :00)
 *   - Each news story is written and voiced ONCE and saved as its own clip.
 *     The clip is reused in every bulletin until the story is updated (its
 *     text changes) or replaced by newer stories. Only new stories cost money.
 *   - Station pieces (news opening with the time, section links, closing,
 *     sponsor lines) are voiced once and reused for good.
 *   - A web search for major breaking news missing from the website runs a
 *     few times a day, not every hour. Major events still reach the bulletin
 *     within the hour because the website imports news every hour.
 *
 * Programmes (:20 build, airs :30)
 *   - A growing library. A small number of genuinely new programmes are made
 *     each day; the other half-hours replay library programmes, with rules
 *     that avoid obvious repetition. Topical shows expire after a few days.
 *
 * Spending: every paid call passes through lib/radio-budget.ts. If a cap is
 * reached, new generation stops, but the station keeps broadcasting cached
 * news (while still current), library programmes and station material.
 */
import { dbRequest } from '@/lib/db'
import { getRadioVoice, type RadioPresenter } from '@/lib/radio-voices'
import {
  canSpend,
  estimateSpeechUsd,
  PRICES,
  recordFailure,
  recordSpend,
  releaseLock,
  takeLock,
  type SpendKind,
} from '@/lib/radio-budget'
import {
  deleteObjects,
  getBytes,
  getJson,
  joinMp3,
  listObjects,
  publicUrl,
  putJson,
  putObject,
  sha,
} from '@/lib/radio-storage'
import { HOUSE_SPONSOR_PROMO, sponsorFor } from '@/lib/radio-sponsors'

export type BroadcastKind = 'news' | 'programme'

type Story = {
  title: string
  summary: string | null
  category: string
  published_at: string
}

const KEEP_AIR_FILES = 6
const TTS_CHUNK = 3500

/** The hourly newsreader keeps one voice so reused story clips always match. */
const NEWS_PRESENTER: RadioPresenter = process.env.DV_RADIO_NEWS_PRESENTER === 'male' ? 'male' : 'female'
const STATION_PRESENTER: RadioPresenter = NEWS_PRESENTER

/* ------------------------------------------------------------------ */
/* Time helpers                                                        */
/* ------------------------------------------------------------------ */

function sydneyParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '0'
  return { date: `${get('year')}-${get('month')}-${get('day')}`, hour: Number(get('hour')) }
}

function spokenTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-AU', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true })
    .format(date)
    .replace(':00', '')
    .replace(/\s?am/i, ' a.m.')
    .replace(/\s?pm/i, ' p.m.')
}

function nextAt(minute: number, now = new Date()) {
  const next = new Date(now)
  next.setUTCMinutes(minute, 0, 0)
  if (next <= now) next.setUTCHours(next.getUTCHours() + 1)
  return next
}

function stamp(date: Date) {
  // e.g. 20261031T0100Z — names sort in time order
  return date.toISOString().slice(0, 16).replace(/[^0-9T]/g, '') + 'Z'
}

const hoursAgo = (iso: string) => (Date.now() - Date.parse(iso)) / 3_600_000

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

function factSheet(stories: Story[]) {
  return stories
    .map((s, i) => `${i + 1}. [${s.category}] ${clean(s.title)} — ${clean(s.summary || s.title).slice(0, 900)}`)
    .join('\n')
}

/* ------------------------------------------------------------------ */
/* OpenAI (every call is costed and capped)                            */
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

type WriterOptions = {
  kind: SpendKind
  note: string
  research?: boolean
  maxSearches?: number
  maxOutputTokens?: number
  schema?: { name: string; schema: Record<string, unknown> }
}

async function callWriter(instructions: string, input: string, opts: WriterOptions) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.DV_RADIO_SCRIPT_MODEL || 'gpt-5-mini',
      reasoning: { effort: process.env.DV_RADIO_REASONING || 'low' },
      instructions,
      input,
      max_output_tokens: opts.maxOutputTokens ?? 6000,
      ...(opts.research
        ? { tools: [{ type: 'web_search' }], max_tool_calls: opts.maxSearches ?? 3 }
        : {}),
      ...(opts.schema
        ? { text: { format: { type: 'json_schema', name: opts.schema.name, schema: opts.schema.schema, strict: true } } }
        : {}),
    }),
  })

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300)
    await recordFailure(opts.kind, `writer ${response.status}: ${detail}`)
    throw new Error(`Script writing failed (${response.status}): ${detail}`)
  }

  const data = (await response.json()) as {
    output_text?: string
    output?: { type: string; content?: { type: string; text?: string }[] }[]
    usage?: { input_tokens?: number; output_tokens?: number; input_tokens_details?: { cached_tokens?: number } }
  }

  const searches = (data.output || []).filter((item) => item.type === 'web_search_call').length
  const cachedIn = data.usage?.input_tokens_details?.cached_tokens || 0
  const freshIn = Math.max(0, (data.usage?.input_tokens || 0) - cachedIn)
  const usd =
    freshIn * PRICES.inputPerToken +
    cachedIn * PRICES.cachedInputPerToken +
    (data.usage?.output_tokens || 0) * PRICES.outputPerToken +
    searches * PRICES.webSearchCall
  await recordSpend(opts.kind, usd, `${opts.note}${searches ? ` (${searches} searches)` : ''}`)

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

async function speak(script: string, presenter: RadioPresenter, kind: SpendKind, note: string) {
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
      const detail = (await response.text()).slice(0, 300)
      await recordFailure(kind, `speech ${response.status}: ${detail}`)
      throw new Error(`Speech failed (${response.status}): ${detail}`)
    }
    parts.push(new Uint8Array(await response.arrayBuffer()))
    await recordSpend(kind, estimateSpeechUsd(chunk.length), `voice: ${note}`)
  }
  return joinMp3(parts)
}

/* ------------------------------------------------------------------ */
/* Cached station clips (time calls, links, closings, sponsor lines)    */
/* ------------------------------------------------------------------ */

const STATION_INDEX = 'state/station-clips.json'
type StationIndex = Record<string, { file: string; text: string }>

/** Audio for a fixed line, voiced once ever and reused. Null if not affordable. */
async function stationClip(text: string, kind: SpendKind): Promise<Uint8Array | null> {
  const key = await sha(`${STATION_PRESENTER}|${text}`)
  const file = `clips/station/${key}.mp3`
  const index = await getJson<StationIndex>(STATION_INDEX, {})
  if (index[key]) {
    try {
      return await getBytes(file)
    } catch {
      /* fall through and re-create */
    }
  }
  const usd = estimateSpeechUsd(text.length)
  if (!(await canSpend(kind, usd)).ok) return null
  const audio = await speak(text, STATION_PRESENTER, kind, `station line "${text.slice(0, 40)}"`)
  await putObject(file, audio, 'audio/mpeg')
  const fresh = await getJson<StationIndex>(STATION_INDEX, {})
  fresh[key] = { file, text }
  await putJson(STATION_INDEX, fresh)
  return audio
}

/* ------------------------------------------------------------------ */
/* Public: what AzuraCast plays                                        */
/* ------------------------------------------------------------------ */

async function publishAirFile(kind: BroadcastKind, airTime: Date, audio: Uint8Array) {
  const url = await putObject(`${kind}/${stamp(airTime)}.mp3`, audio, 'audio/mpeg')
  try {
    const old = (await listObjects(kind)).slice(KEEP_AIR_FILES)
    await deleteObjects(old.map((o) => `${kind}/${o.name}`))
  } catch (error) {
    console.error('Radio storage clean-up failed:', error)
  }
  return url
}

/** Public URL of the newest air file of this kind, or null if none yet. */
export async function latestBroadcastUrl(kind: BroadcastKind) {
  const [newest] = await listObjects(kind)
  if (!newest) return null
  return publicUrl(`${kind}/${newest.name}`)
}

/* ------------------------------------------------------------------ */
/* Hourly news                                                         */
/* ------------------------------------------------------------------ */

const NEWS_INDEX = 'state/news-clips.json'
const BREAKING_PATH = 'state/breaking.json'

type NewsClip = { file: string; title: string; category: string; publishedAt: string; createdAt: string; chars: number }
type NewsIndex = Record<string, NewsClip>
type Breaking = { key: string; category: string; title: string; script: string; createdAt: string }

type Candidate = { key: string; category: string; title: string; publishedAt: string; story?: Story; script?: string }

/** Sydney hours when we also search the web for major breaking news. */
const BREAKING_CHECK_HOURS = (process.env.DV_RADIO_BREAKING_HOURS || '6,12,17,21')
  .split(',')
  .map(Number)
  .filter((n) => Number.isFinite(n))

const SECTIONS = [
  { name: 'australia', categories: ['australia'], count: 3, link: '' },
  { name: 'new-zealand', categories: ['new-zealand'], count: 3, link: 'In New Zealand.' },
  { name: 'world', categories: ['world'], count: 2, link: 'Around the world.' },
  { name: 'extra', categories: ['business', 'sports', 'sport'], count: 1, link: 'In business and sport.' },
]

async function storyKey(story: Story) {
  return sha(`${NEWS_PRESENTER}|${story.category}|${clean(story.title)}|${clean(story.summary || '').slice(0, 400)}`)
}

/** A few times a day: look for a major breaking story the website hasn't got yet. */
async function breakingCheck(haveTitles: string[]): Promise<Breaking[]> {
  if (!(await canSpend('news', 0.05)).ok) return []
  const instructions = `
You are the duty editor for Downunder Voices Radio (Australia and New Zealand).
Use web search to check whether there is any MAJOR breaking news from the last 6 hours in Australia or New Zealand (or a very major world event) that is NOT already in the list supplied. Major means: a significant disaster or emergency, a death toll, a change of government or leader, a major court ruling, a major economic decision, or similar.
Only include an item if it is reported by a reputable outlet (for example ABC, RNZ, SBS, Stuff, NZ Herald, 1News, Reuters, AP, BBC, or an official government, police or emergency-service statement).
Return at most two items. If nothing major is missing, return an empty list. Most of the time the list should be empty.
For each item write a 50 to 75 word spoken news item that attributes the source in speech ("RNZ reports...", "according to the ABC...") and reports only what that source confirms.
${EDITORIAL_RULES}
`.trim()
  const schema = {
    name: 'breaking',
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['category', 'title', 'script'],
            properties: {
              category: { type: 'string', enum: ['australia', 'new-zealand', 'world'] },
              title: { type: 'string' },
              script: { type: 'string' },
            },
          },
        },
      },
    },
  }
  try {
    const raw = await callWriter(instructions, `ALREADY IN THE BULLETIN:\n${haveTitles.join('\n') || 'nothing'}`, {
      kind: 'news',
      note: 'breaking-news check',
      research: true,
      maxSearches: 2,
      maxOutputTokens: 4000,
      schema,
    })
    const parsed = JSON.parse(raw) as { items: { category: string; title: string; script: string }[] }
    const out: Breaking[] = []
    for (const item of (parsed.items || []).slice(0, 2)) {
      const script = speakable(item.script)
      if (script.length < 120) continue
      out.push({
        key: await sha(`${NEWS_PRESENTER}|breaking|${clean(item.title)}`),
        category: item.category,
        title: clean(item.title),
        script,
        createdAt: new Date().toISOString(),
      })
    }
    return out
  } catch (error) {
    console.error('Breaking-news check failed:', error)
    return []
  }
}

/** Write spoken scripts for new stories in ONE cheap call (no web search). */
async function writeStoryScripts(stories: Candidate[]) {
  const scripts = new Map<string, string>()
  if (!stories.length) return scripts
  const instructions = `
You write individual news items for the hourly bulletin on Downunder Voices Radio, an independent station for Australia and New Zealand.
For EACH story supplied, write one self-contained spoken news item of 55 to 75 words (about 25 to 30 seconds).
- Each item must make sense on its own and be reusable in later bulletins over the next few hours: do not say "this morning", "tonight", "earlier today" or the time.
- Do not begin with section links like "In New Zealand" or "Overseas" — the bulletin adds those.
- Lead with the most important fact. Name places clearly.
${EDITORIAL_RULES}
Return one entry per story, using the story's id exactly as given.
`.trim()
  const input = stories
    .map((c) => `id: ${c.key}\n[${c.category}] ${clean(c.story?.title || c.title)} — ${clean(c.story?.summary || c.title).slice(0, 900)}`)
    .join('\n\n')
  const schema = {
    name: 'news_items',
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['id', 'script'],
            properties: { id: { type: 'string' }, script: { type: 'string' } },
          },
        },
      },
    },
  }
  try {
    const raw = await callWriter(instructions, input, {
      kind: 'news',
      note: `story scripts x${stories.length}`,
      maxOutputTokens: 5000,
      schema,
    })
    const parsed = JSON.parse(raw) as { items: { id: string; script: string }[] }
    for (const item of parsed.items || []) {
      const script = speakable(item.script || '')
      if (script.length >= 120) scripts.set(item.id, script)
    }
  } catch (error) {
    console.error('Story script writing failed, using plain reads:', error)
  }
  // Anything missing falls back to a plain read of the headline and summary (no cost).
  for (const c of stories) {
    if (!scripts.has(c.key)) {
      const summary = clean(c.story?.summary || '').slice(0, 320)
      scripts.set(c.key, `${clean(c.story?.title || c.title)}. ${summary}`.trim())
    }
  }
  return scripts
}

export async function produceNewsBulletin(now = new Date(), options: { forceBreakingCheck?: boolean } = {}) {
  if (!(await takeLock('news'))) return { kind: 'news' as const, skipped: 'another news run is in progress' }
  try {
    return await buildNews(now, options)
  } finally {
    await releaseLock('news')
  }
}

async function buildNews(now: Date, options: { forceBreakingCheck?: boolean }) {
  const airTime = nextAt(0, now)
  const { hour } = sydneyParts(airTime)
  const overnight = hour >= 0 && hour < 6
  const maxAgeHours = overnight ? 20 : 14
  /** New stories we may voice this hour (each costs ~US$0.007). */
  const newAllowance = Number(process.env.DV_RADIO_NEW_STORIES_PER_HOUR) || (overnight ? 1 : 3)

  const [stories, index, savedBreaking] = await Promise.all([
    latestStories(80),
    getJson<NewsIndex>(NEWS_INDEX, {}),
    getJson<Breaking[]>(BREAKING_PATH, []),
  ])

  // Candidates per section, newest first, only while still current.
  const candidates: Record<string, Candidate[]> = {}
  for (const section of SECTIONS) {
    const list: Candidate[] = []
    for (const story of stories) {
      if (!section.categories.includes(story.category)) continue
      if (hoursAgo(story.published_at) > maxAgeHours) continue
      list.push({ key: await storyKey(story), category: story.category, title: story.title, publishedAt: story.published_at, story })
    }
    candidates[section.name] = list
  }

  // Breaking items found by the web check stay on air for up to 6 hours.
  let breaking = savedBreaking.filter((b) => hoursAgo(b.createdAt) < 6)
  const doCheck = options.forceBreakingCheck || BREAKING_CHECK_HOURS.includes(hour)
  let checked = false
  if (doCheck) {
    const titles = Object.values(candidates).flat().slice(0, 30).map((c) => clean(c.title))
    const found = await breakingCheck([...titles, ...breaking.map((b) => b.title)])
    checked = true
    if (found.length) breaking = [...found, ...breaking].slice(0, 3)
  }
  for (const b of breaking) {
    const section = SECTIONS.find((s) => s.categories.includes(b.category)) || SECTIONS[0]
    candidates[section.name] = [
      { key: b.key, category: b.category, title: b.title, publishedAt: b.createdAt, script: b.script },
      ...candidates[section.name],
    ]
  }
  await putJson(BREAKING_PATH, breaking)

  // Choose stories: cached clips are free; new ones only within the allowance and budget.
  // While the cache is warming up (or after a quiet spell), allow enough new
  // stories for a proper bulletin of at least six items.
  const cachedAvailable = SECTIONS.reduce(
    (n, s) => n + Math.min(s.count, candidates[s.name].filter((c) => index[c.key]).length),
    0,
  )
  let allowance = newAllowance + Math.max(0, 6 - cachedAvailable)
  const chosen: Record<string, Candidate[]> = {}
  const toVoice: Candidate[] = []
  for (const section of SECTIONS) {
    const picked: Candidate[] = []
    const seenTitles = new Set<string>()
    for (const c of candidates[section.name]) {
      if (picked.length >= section.count) break
      const t = clean(c.title).toLowerCase()
      if (seenTitles.has(t)) continue
      const isBreaking = Boolean(c.script)
      if (index[c.key]) {
        picked.push(c)
        seenTitles.add(t)
        continue
      }
      // Breaking items are always allowed (if the budget allows); others use the hourly allowance.
      if (!isBreaking && allowance <= 0) continue
      const cost = estimateSpeechUsd(500) + 0.002
      if (!(await canSpend('news', cost)).ok) continue
      if (!isBreaking) allowance -= 1
      picked.push(c)
      seenTitles.add(t)
      toVoice.push(c)
    }
    chosen[section.name] = picked
  }

  // Write and voice the new stories only.
  const scripts = await writeStoryScripts(toVoice.filter((c) => !c.script))
  const voiced: string[] = []
  for (const c of toVoice) {
    const script = c.script || scripts.get(c.key)
    if (!script) continue
    try {
      if (!(await canSpend('news', estimateSpeechUsd(script.length))).ok) throw new Error('budget')
      const audio = await speak(script, NEWS_PRESENTER, 'news', `story "${c.title.slice(0, 50)}"`)
      const file = `clips/news/${c.key}.mp3`
      await putObject(file, audio, 'audio/mpeg')
      index[c.key] = { file, title: clean(c.title), category: c.category, publishedAt: c.publishedAt, createdAt: new Date().toISOString(), chars: script.length }
      voiced.push(c.title)
    } catch (error) {
      console.error('Story voicing skipped:', error)
      for (const section of SECTIONS) chosen[section.name] = chosen[section.name].filter((x) => x.key !== c.key)
    }
  }

  // Tidy the clip cache: forget clips older than 3 days.
  const expired = Object.entries(index).filter(([, v]) => hoursAgo(v.createdAt) > 72)
  for (const [k] of expired) delete index[k]
  await putJson(NEWS_INDEX, index)
  try {
    await deleteObjects(expired.map(([, v]) => v.file))
  } catch {
    /* harmless */
  }

  const total = Object.values(chosen).reduce((n, list) => n + list.length, 0)
  if (total < 3) {
    // Too little current news: skip this bulletin. AzuraCast simply continues normal programming.
    return { kind: 'news' as const, airTime: airTime.toISOString(), skipped: 'not enough current stories', voicedNew: voiced.length, breakingChecked: checked }
  }

  // Assemble the bulletin from cached pieces.
  const sydney = spokenTime(airTime, 'Australia/Sydney')
  const auckland = spokenTime(airTime, 'Pacific/Auckland')
  const parts: Uint8Array[] = []
  const add = (clip: Uint8Array | null) => {
    if (clip) parts.push(clip)
  }
  add(await stationClip(`Downunder Voices News at ${sydney} in Sydney, ${auckland} in Auckland.`, 'news'))
  const newsSponsor = sponsorFor('News', airTime)
  if (newsSponsor) add(await stationClip(newsSponsor.line, 'news'))
  let first = true
  for (const section of SECTIONS) {
    const list = chosen[section.name]
    if (!list.length) continue
    if (!first && section.link) add(await stationClip(section.link, 'news'))
    first = false
    for (const c of list) add(await getBytes(index[c.key].file))
  }
  add(await stationClip("That's the news. This is Downunder Voices Radio.", 'news'))

  const audio = joinMp3(parts)
  const url = await publishAirFile('news', airTime, audio)
  return {
    kind: 'news' as const,
    airTime: airTime.toISOString(),
    stories: total,
    voicedNew: voiced.length,
    reusedFromCache: total - voiced.length,
    breakingChecked: checked,
    breakingOnAir: breaking.length,
    bytes: audio.length,
    url,
  }
}

/* ------------------------------------------------------------------ */
/* Programme engine (built at :20, broadcast at :30)                   */
/* ------------------------------------------------------------------ */

type Show = {
  name: string
  /** Website story categories for news-led shows. Empty = researched feature. */
  categories: string[]
  brief: string
  careful?: boolean
  /** Days the programme stays suitable for replay. */
  shelfDays: number
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

const EVERGREEN = 365
const TOPICAL = 3

const SHOWS: Show[] = [
  { name: 'Australia Today', shelfDays: 1, categories: ['australia'], brief: 'A closer look at two or three Australian stories behind today’s headlines: what happened, why it matters, who is affected. You may use web search for the latest verified developments.' },
  { name: 'New Zealand Today', shelfDays: 1, categories: ['new-zealand'], brief: 'A closer look at two or three New Zealand stories: what happened, why it matters, who is affected. You may use web search for the latest verified developments.' },
  { name: 'World Briefing', shelfDays: 1, categories: ['world'], brief: 'Important overseas developments explained for listeners in Australia and New Zealand, including any local connection the facts support.' },
  { name: 'Business and Cost of Living', shelfDays: TOPICAL, categories: ['business'], brief: 'Money, prices, jobs, interest rates and business news affecting households in Australia and New Zealand.' },
  { name: 'Sport Downunder', shelfDays: TOPICAL, categories: ['sports', 'sport'], brief: 'A sport feature: the stories people across Australia and New Zealand are talking about, or a memorable moment from our sporting history.' },
  { name: 'Mysteries Downunder', shelfDays: EVERGREEN, categories: [], careful: true, brief: 'One well-documented Australian mystery, unexplained event or enduring puzzle.' },
  { name: 'Mysteries of New Zealand', shelfDays: EVERGREEN, categories: [], careful: true, brief: 'One well-documented New Zealand mystery, legend or unexplained event.' },
  { name: 'Crime Files', shelfDays: EVERGREEN, categories: [], careful: true, brief: 'One famous historical criminal case from Australia or New Zealand that is long concluded: what happened, the investigation, the outcome, and what it changed.' },
  { name: 'Unsolved', shelfDays: EVERGREEN, categories: [], careful: true, brief: 'One long-standing unsolved Australian or New Zealand case, handled responsibly: established facts only, theories clearly labelled, respect for victims. Mention that anyone with information can contact police or Crime Stoppers.' },
  { name: 'Strange Australia', shelfDays: EVERGREEN, categories: [], brief: 'One genuinely strange but well-documented true story, creature or place from Australia.' },
  { name: 'Strange But True', shelfDays: EVERGREEN, categories: [], brief: 'One genuinely strange but well-documented true story from Australia, New Zealand or the Pacific.' },
  { name: 'Forgotten Australia', shelfDays: EVERGREEN, categories: [], brief: 'One forgotten or little-known Australian story, place or person worth remembering.' },
  { name: 'Forgotten New Zealand', shelfDays: EVERGREEN, categories: [], brief: 'One forgotten or little-known New Zealand story, place or person worth remembering.' },
  { name: 'History Downunder', shelfDays: EVERGREEN, categories: [], brief: 'One important event from Australian or New Zealand history, told vividly and accurately.' },
  { name: 'Remarkable Lives', shelfDays: EVERGREEN, categories: [], brief: 'A short biography of one remarkable Australian, New Zealander or Pacific Islander, past or present.' },
  { name: 'Science and Discovery', shelfDays: EVERGREEN, categories: [], brief: 'One discovery, invention or piece of science, ideally with an Australian or New Zealand connection.' },
  { name: 'Tech and Tomorrow', shelfDays: 60, categories: [], brief: 'Technology, AI, cybersecurity or innovation changing everyday life, explained simply, with practical takeaways.' },
  { name: 'Space Downunder', shelfDays: 90, categories: [], brief: 'Space and astronomy: a mission, discovery, or what to look for in southern skies, with Australian and New Zealand connections where possible. Avoid dates that will soon be out of date.' },
  { name: 'Unusual Places', shelfDays: EVERGREEN, categories: [], brief: 'One unusual, remarkable or little-known place in Australia, New Zealand or the Pacific.' },
  { name: 'Travel Downunder', shelfDays: EVERGREEN, categories: [], brief: 'An audio postcard about one destination in Australia or New Zealand. No prices, opening hours or bookings, as these change.' },
  { name: 'Pacific Stories', shelfDays: EVERGREEN, categories: [], brief: 'A story from the Pacific Islands: history, culture, people, environment or connections with Australia and New Zealand.' },
  { name: 'Culture and Entertainment', shelfDays: 60, categories: [], brief: 'Arts, music, film, books or culture with an Australian or New Zealand angle; warm and conversational.' },
  { name: 'Disasters and Survival', shelfDays: EVERGREEN, categories: [], careful: true, brief: 'One major historical disaster or remarkable survival story, told seriously and respectfully.' },
  { name: 'Consumer Watch', shelfDays: 60, categories: [], brief: 'A practical public-interest feature for Australian and New Zealand households: consumer rights, scams to watch for, saving money, using public services. General information only, not personal financial advice.' },
  { name: 'Around the World', shelfDays: 90, categories: [], brief: 'One interesting, uplifting or surprising international story listeners in Australia and New Zealand would enjoy.' },
]

const POLITICAL_HICCUPS: Show = {
  name: 'Political Hiccups',
  shelfDays: TOPICAL,
  categories: ['australia', 'new-zealand', 'world'],
  brief: 'Our signature show: a short, factual, politically independent and occasionally light-hearted look at genuine political contradictions, backflips and unusual moments in Australian and New Zealand politics. Use web search to verify each example from reputable reporting or official records. Apply exactly the same standard to government and opposition and across parties — aim for balance across the programme. Humour must be gentle and aimed at the contradiction, never at people suffering, and never about death, disaster or tragedy. Never invent or paraphrase as a quotation; only quote words you have verified, and attribute them.',
}

const ALL_SHOWS = [...SHOWS, POLITICAL_HICCUPS]

/**
 * Sydney hours at which a NEW programme may be made (one per slot, so the
 * count passed by now is the day's quota). While the library is small we
 * make a few extra each day — the daily spending limit still applies.
 */
const NEW_PROGRAMME_HOURS = (process.env.DV_RADIO_NEW_PROGRAMME_HOURS || '6,15').split(',').map(Number)
const SEED_PROGRAMME_HOURS = [6, 9, 12, 15, 18, 21]
const SEED_TARGET = Number(process.env.DV_RADIO_LIBRARY_SEED_TARGET) || 30

const LIBRARY = 'state/programme-library.json'
const HISTORY_PATH = 'state/programme-history.json'

type LibraryItem = {
  id: string
  show: string
  subject: string
  sources: string
  file: string
  createdAt: string
  createdSydneyDate: string
  expiresAt: string
  plays: number
  lastPlayed: string | null
}
type History = { show: string; subject: string; airTime: string; replay?: boolean }[]

function chooseShowToMake(library: LibraryItem[], forceShow?: string) {
  if (forceShow) {
    const forced = ALL_SHOWS.find((s) => s.name.toLowerCase() === forceShow.toLowerCase())
    if (forced) return forced
  }
  const lastMade = new Map<string, number>()
  library.forEach((item) => lastMade.set(item.show, Date.parse(item.createdAt)))
  // Political Hiccups: made about every second day.
  const hiccups = lastMade.get(POLITICAL_HICCUPS.name) ?? 0
  if (Date.now() - hiccups > 44 * 3_600_000) return POLITICAL_HICCUPS
  // Otherwise the show made least recently. Evergreen shows first while the library is small.
  const evergreenFirst = library.length < SEED_TARGET
  const score = (show: Show) =>
    (lastMade.get(show.name) ?? 0) + (evergreenFirst && show.shelfDays < 30 ? 10 * 86_400_000 : 0)
  return [...SHOWS].sort((a, b) => score(a) - score(b))[0]
}

async function makeProgramme(show: Show, airTime: Date, library: LibraryItem[]): Promise<{ item: LibraryItem; audio: Uint8Array }> {
  const recentSubjects = library.slice(-200).map((h) => h.subject).filter(Boolean)

  let material = ''
  if (show.categories.length) {
    const stories = await latestStories(80)
    const selected = stories
      .filter((s) => show.categories.includes(s.category))
      .slice(0, show === POLITICAL_HICCUPS ? 10 : 5)
    material = selected.length ? `DOWNUNDER VOICES STORIES (starting points):\n${factSheet(selected)}` : ''
  }

  const timeless = show.shelfDays >= 30
  const instructions = `
You research and write "${show.name}", a programme on Downunder Voices Radio, an independent digital station for Australia and New Zealand.
Brief: ${show.brief}
${RESEARCH_RULES}
${show.careful ? CAREFUL_RULES : ''}
${timeless ? 'This programme will be replayed over the coming months, so it must not sound dated: do not say "today", "this week", "recently" or mention the current date.' : ''}
Do NOT repeat any of these subjects already covered: ${recentSubjects.length ? recentSubjects.join('; ') : 'none yet'}.
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

  const input = material || 'Choose a specific subject that fits the brief and has not been covered already, research it, then write the script.'

  const raw = await callWriter(instructions, input, {
    kind: 'programme',
    note: `programme script: ${show.name}`,
    research: true,
    maxSearches: 3,
    maxOutputTokens: 8000,
  })
  const subject = clean(raw.match(/SUBJECT:\s*(.+)/i)?.[1] || show.name).slice(0, 160)
  const sources = clean(raw.match(/SOURCES:\s*([\s\S]*?)\n\s*SCRIPT:/i)?.[1] || '').slice(0, 1000)
  const body = raw.split(/SCRIPT:\s*/i)[1] ?? raw
  const script = speakable(body)
  if (script.length < 800) {
    await recordFailure('programme', `script too short for ${show.name}`)
    throw new Error(`Programme script came back too short (${script.length} characters)`)
  }
  if (!(await canSpend('programme', estimateSpeechUsd(script.length))).ok) throw new Error('Programme voice not affordable today')

  const presenter: RadioPresenter = library.length % 2 === 0 ? 'male' : 'female'
  const audio = await speak(script, presenter, 'programme', show.name)
  const id = `${stamp(airTime)}-${await sha(`${show.name}|${subject}`)}`
  const file = `library/${id}.mp3`
  await putObject(file, audio, 'audio/mpeg')

  const created = new Date()
  const item: LibraryItem = {
    id,
    show: show.name,
    subject,
    sources,
    file,
    createdAt: created.toISOString(),
    createdSydneyDate: sydneyParts(created).date,
    expiresAt: new Date(created.getTime() + show.shelfDays * 86_400_000).toISOString(),
    plays: 0,
    lastPlayed: null,
  }
  return { item, audio }
}

/** Pick a library programme to replay without obvious repetition. */
function chooseReplay(library: LibraryItem[], history: History) {
  const now = Date.now()
  const recentShows = history.slice(-3).map((h) => h.show)
  const candidates = library.filter((item) => {
    if (Date.parse(item.expiresAt) < now) return false
    const ageDays = (now - Date.parse(item.createdAt)) / 86_400_000
    // Newer programmes may repeat at a different time of day; older ones rest for a week.
    const gapHours = ageDays < 3 ? 10 : 7 * 24
    if (item.lastPlayed && now - Date.parse(item.lastPlayed) < gapHours * 3_600_000) return false
    return true
  })
  if (!candidates.length) return null
  const notSameShow = candidates.filter((c) => !recentShows.includes(c.show))
  const pool = notSameShow.length ? notSameShow : candidates
  return pool.sort(
    (a, b) => a.plays - b.plays || Date.parse(a.lastPlayed || '1970-01-01') - Date.parse(b.lastPlayed || '1970-01-01'),
  )[0]
}

/** First run only: bring the last few programmes already made into the library. */
async function migrateExisting(library: LibraryItem[]) {
  if (library.length) return library
  const history = await getJson<History>(HISTORY_PATH, [])
  const files = await listObjects('programme').catch(() => [])
  for (const f of files) {
    const entry = history.find((h) => `${stamp(new Date(h.airTime))}.mp3` === f.name)
    const show = ALL_SHOWS.find((s) => s.name === entry?.show)
    if (!entry || !show) continue
    const id = `${f.name.replace('.mp3', '')}-${await sha(`${show.name}|${entry.subject}`)}`
    try {
      const audio = await getBytes(`programme/${f.name}`)
      await putObject(`library/${id}.mp3`, audio, 'audio/mpeg')
      const created = new Date(entry.airTime)
      library.push({
        id,
        show: show.name,
        subject: entry.subject,
        sources: '',
        file: `library/${id}.mp3`,
        createdAt: created.toISOString(),
        createdSydneyDate: sydneyParts(created).date,
        expiresAt: new Date(created.getTime() + show.shelfDays * 86_400_000).toISOString(),
        plays: 1,
        lastPlayed: created.toISOString(),
      })
    } catch (error) {
      console.error('Could not move programme into library:', error)
    }
  }
  return library
}

export async function produceProgramme(now = new Date(), forceShow?: string) {
  if (!(await takeLock('programme'))) return { kind: 'programme' as const, skipped: 'another programme run is in progress' }
  try {
    return await buildProgramme(now, forceShow)
  } finally {
    await releaseLock('programme')
  }
}

async function buildProgramme(now: Date, forceShow?: string) {
  const airTime = nextAt(30, now)
  const { date: sydneyDate, hour } = sydneyParts(airTime)
  let library = await getJson<LibraryItem[]>(LIBRARY, [])
  library = await migrateExisting(library)
  const history = await getJson<History>(HISTORY_PATH, [])

  // How many new programmes are due by now today?
  const slots = library.length < SEED_TARGET ? SEED_PROGRAMME_HOURS : NEW_PROGRAMME_HOURS
  const due = slots.filter((h) => h <= hour).length
  const madeToday = library.filter((i) => i.createdSydneyDate === sydneyDate).length
  const wantNew = Boolean(forceShow) || madeToday < due || library.length === 0

  let airing: LibraryItem | null = null
  let audio: Uint8Array | null = null
  let made = false
  let note = ''

  if (wantNew) {
    const check = await canSpend('programme', 0.1)
    if (check.ok) {
      try {
        const show = chooseShowToMake(library, forceShow)
        const result = await makeProgramme(show, airTime, library)
        library.push(result.item)
        airing = result.item
        audio = result.audio
        made = true
      } catch (error) {
        note = `new programme failed: ${error instanceof Error ? error.message : error}`
        console.error(note)
      }
    } else {
      note = `no new programme: ${check.reason}`
    }
  }

  if (!airing) {
    airing = chooseReplay(library, history)
    if (airing) {
      try {
        audio = await getBytes(airing.file)
      } catch (error) {
        console.error('Library file missing:', error)
        library = library.filter((i) => i.id !== airing!.id)
        airing = null
      }
    }
  }

  // Drop expired programmes from the library (and storage).
  const expired = library.filter((i) => Date.parse(i.expiresAt) < Date.now() && i.id !== airing?.id)
  if (expired.length) {
    library = library.filter((i) => !expired.includes(i))
    try {
      await deleteObjects(expired.map((i) => i.file))
    } catch {
      /* harmless */
    }
  }

  if (!airing || !audio) {
    await putJson(LIBRARY, library)
    // Nothing suitable: skip this half-hour. AzuraCast continues normal programming.
    return { kind: 'programme' as const, airTime: airTime.toISOString(), skipped: 'no suitable programme this half-hour', note, library: library.length }
  }

  // Sponsorship slot: a sponsor line before the programme, or occasionally our own promo after it.
  const parts: Uint8Array[] = []
  const sponsor = sponsorFor(airing.show, airTime)
  if (sponsor) {
    const clip = await stationClip(sponsor.line, 'programme').catch(() => null)
    if (clip) parts.push(clip)
  }
  parts.push(audio)
  if (!sponsor && airTime.getUTCHours() % 4 === 0) {
    const promo = await stationClip(HOUSE_SPONSOR_PROMO, 'programme').catch(() => null)
    if (promo) parts.push(promo)
  }

  const url = await publishAirFile('programme', airTime, joinMp3(parts))

  airing.plays += 1
  airing.lastPlayed = airTime.toISOString()
  await putJson(LIBRARY, library)
  try {
    await putJson(HISTORY_PATH, [...history, { show: airing.show, subject: airing.subject, airTime: airTime.toISOString(), replay: !made }].slice(-400))
  } catch (error) {
    console.error('Could not record programme history:', error)
  }

  return {
    kind: 'programme' as const,
    airTime: airTime.toISOString(),
    show: airing.show,
    subject: airing.subject,
    newlyMade: made,
    sponsored: Boolean(sponsor),
    library: library.length,
    note,
    url,
  }
}

/* ------------------------------------------------------------------ */
/* Status (for the owner)                                              */
/* ------------------------------------------------------------------ */

export async function radioStatus() {
  const [library, index] = await Promise.all([
    getJson<LibraryItem[]>(LIBRARY, []),
    getJson<NewsIndex>(NEWS_INDEX, {}),
  ])
  const live = library.filter((i) => Date.parse(i.expiresAt) > Date.now())
  const byShow: Record<string, number> = {}
  for (const i of live) byShow[i.show] = (byShow[i.show] || 0) + 1
  return {
    programmeLibrary: live.length,
    programmesByShow: byShow,
    newestProgrammes: live.slice(-5).map((i) => ({ show: i.show, subject: i.subject, plays: i.plays })),
    cachedNewsStories: Object.keys(index).length,
  }
}
