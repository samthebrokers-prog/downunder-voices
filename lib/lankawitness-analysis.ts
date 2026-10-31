/**
 * Lanka Witness — one original accountability analysis per day.
 *
 * Owner's brief (1 Nov 2026): the top three stories on lankawitness.com must
 * change automatically and hold the ruling party (NPP/JVP government) to
 * account — cost of living, promises versus delivery, accountability for
 * the JVP's documented past violence, governance and rights. Tough and
 * critical, but evidence-based: every factual claim comes from reputable
 * sources found by web search and the sources are listed under the article.
 *
 * Runs once a day from the Downunder Voices backend (which holds the AI key
 * and the shared spending guard in lib/radio-budget.ts) and saves a public
 * JSON file that Lanka Witness reads. Cost: about US$0.03–0.05 per article, three a day (~US$3–4 a month).
 */
import { canSpend, PRICES, recordFailure, recordSpend } from '@/lib/radio-budget'
import { getJson, putJson } from '@/lib/radio-storage'

const FILE = 'lankawitness/analysis.json'
const KEEP = 90

export type LwSource = { title: string; publisher: string; url: string }
export type LwAnalysis = {
  slug: string
  title: string
  dek: string
  kicker: string
  angle: string
  image: string
  imageAlt: string
  paragraphs: string[]
  governmentPosition: string
  sources: LwSource[]
  publishedAt: string
}
export type LwAnalysisFile = { updatedAt: string; items: LwAnalysis[] }

const IMG = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, '_'))}?width=1280`

const ANGLES = [
  {
    key: 'cost-of-living',
    kicker: 'COST OF LIVING • ACCOUNTABILITY',
    brief:
      'The cost of living in Sri Lanka right now: prices of food, fuel, electricity, medicine, taxes and wages, and what the NPP government promised versus what households are experiencing. Use the latest official figures (Department of Census and Statistics, Central Bank) and reputable reporting.',
    images: [
      ['Bags of Spices in Market - Pettah District - Colombo - Sri Lanka (13995169756).jpg', 'Market stall in Pettah, Colombo'],
      ['Pettah Floating Market Colombo, Sri Lanka.jpg', 'Pettah Floating Market, Colombo'],
      ['Bus on Colombo road.jpg', 'A bus on a Colombo road'],
      ['Tea Plantation Workers in Sri Lanka 2.jpg', 'Tea plantation workers in Sri Lanka'],
      ['Farmers in a Paddy field.jpg', 'Farmers in a paddy field'],
    ],
  },
  {
    key: 'promise-audit',
    kicker: 'PROMISE AUDIT • GOVERNMENT',
    brief:
      'Test one or two specific promises from the NPP / President Anura Kumara Dissanayake 2024 election campaign or manifesto against what has actually been delivered, with dates and documented evidence. Pick promises that are currently in the news.',
    images: [
      ['New Sri Lankan Parliament in Kotte.jpg', 'Parliament of Sri Lanka, Sri Jayawardenepura Kotte'],
      ['Old Parliament - the national Presidential Secretariat.- Sri Lanka.jpg', 'Presidential Secretariat (old Parliament), Colombo'],
      ['Colombo Lotus Tower seen Galle Road.jpg', 'Lotus Tower seen from Galle Road, Colombo'],
    ],
  },
  {
    key: 'jvp-history',
    kicker: 'HISTORY • ACCOUNTABILITY',
    brief:
      'Accountability for the JVP’s documented political violence during the 1971 insurrection and the 1987–89 insurrection (killings of political opponents, public servants, trade unionists and civilians, as recorded by commissions of inquiry, courts and reputable historians), connected to a current news development. Ask what the JVP-led government has acknowledged, what victims’ families are still asking for, and how this compares with the accountability the government demands from others. Also acknowledge, where relevant and documented, the state’s own violence against JVP suspects in the same period, so the piece is fair.',
    images: [
      ['CPA_IMG_0032_(17254408155).jpg', 'JVP public protest in Colombo'],
      ['Old parliament,Colombo Sri Lanka.jpg', 'Old Parliament building, Colombo'],
    ],
  },
  {
    key: 'governance',
    kicker: 'GOVERNANCE • TRANSPARENCY',
    brief:
      'Governance and transparency under the current NPP government: appointments, procurement, use of state resources, treatment of critics, independence of institutions, anti-corruption claims versus practice. Use a current, documented news development.',
    images: [
      ['President of Sri Lanka Mr. Anura Kumara Dissanayake in India.jpg', 'President Anura Kumara Dissanayake'],
      ['Old Parliament - the national Presidential Secretariat.- Sri Lanka.jpg', 'Presidential Secretariat (old Parliament), Colombo'],
      ['New Sri Lankan Parliament in Kotte.jpg', 'Parliament of Sri Lanka, Sri Jayawardenepura Kotte'],
    ],
  },
  {
    key: 'rights',
    kicker: 'RIGHTS • RULE OF LAW',
    brief:
      'Human rights and the rule of law under the current government: the Prevention of Terrorism Act and its replacement, police conduct and custodial deaths, media freedom, minority rights, and the government’s response to UN Human Rights Council scrutiny. Use a current documented development.',
    images: [
      ['Colombo_skyline.jpg', 'Colombo skyline'],
      ['Jaffna Town - Hospital Road1.jpg', 'Hospital Road, Jaffna'],
      ['Sri Lankan Police Convoy.jpg', 'Sri Lanka Police convoy'],
    ],
  },
  {
    key: 'economy',
    kicker: 'ECONOMY • WHO PAYS',
    brief:
      'The economy and who carries the burden: IMF programme reviews, taxes, debt restructuring, state enterprises, jobs and migration of skilled workers, set against the government’s claims of recovery. Use current official data and reputable reporting.',
    images: [
      ['Central Bank of Sri Lanka Building.jpg', 'Central Bank of Sri Lanka building, Colombo'],
      ['An ariel view of the Port of Colombo from the Lotus Tower.jpg', 'Port of Colombo from the Lotus Tower'],
      ['KelanitissaPowerStation-Colombo-Aug2010.jpg', 'Kelanitissa Power Station, Colombo'],
      ['Tea Plantation Workers in Sri Lanka 2.jpg', 'Tea plantation workers in Sri Lanka'],
    ],
  },
]

/** Starting leads from the owner's research (1 Nov 2026). Always re-verified. */
const STORY_LEADS = [
  'Carnegie Endowment (Oct 2026): beyond keeping the IMF programme and tightening some anti-corruption rules, much of the broader reform agenda has stalled.',
  'Transparency International Sri Lanka: delays in the Public Procurement Law, competitive procurement and state-owned-enterprise governance; the revised Governance Action Plan due Feb 2026 was still unpublished in March.',
  'The US$2.5 million Treasury debt-payment cyber-fraud: Parliament\'s Committee on Public Finance (COPF) found systemic failures in internal controls, IT and cybersecurity.',
  'Coal procurement: National Audit Office found irregularities in procurement, pricing and coal quality; the government acknowledged substandard coal was bought and the energy minister resigned.',
  'Abolishing the executive presidency: an NPP campaign promise; in June 2026 a minister said it remained a promise but was not currently a priority.',
  'Prevention of Terrorism Act and accountability for past abuses: Human Rights Watch (Sept 2026) says the government has not used its mandate to repeal the PTA or advance accountability (an advocacy assessment; present it as HRW\'s view).',
  'Budget 2026: Verité Research found 29 proposals without disclosed fiscal costs and weak disclosure, while noting more realistic revenue estimates and compliance with fiscal limits.',
  'IMF (2026): about one quarter of the population below the poverty line, reserves around halfway to targets, weak private investment and electricity-sector risks — alongside a strong programme-performance record.',
]

const INSTRUCTIONS = `
You are a senior editor at Lanka Witness, an independent Australian-based publication on Sri Lanka read by the Sri Lankan diaspora, UN bodies, human rights commissions and foreign governments.
Write ONE original accountability analysis (about 650–850 words) on the angle given, tied to news from the last 7 days that you find with web search.

Editorial line: hold the government in power (the NPP / JVP-led government) firmly to account. Be direct and critical where the evidence supports it. This is accountability journalism, not propaganda.
The most credible criticism is not "the government has achieved nothing" — supporters can easily disprove that. It is this: Sri Lankans gave the NPP an extraordinary mandate because it promised to govern differently ("system change"). Economic stabilisation has continued, but many of the structural changes that were meant to set it apart — procurement reform, institutional accountability, constitutional reform (including abolishing the executive presidency), human-rights reform (including repealing the Prevention of Terrorism Act) and stronger public-finance controls — remain incomplete, while serious administrative failures have happened on its watch.
Structure each piece around: what was promised → what actually happened → the evidence → the government's explanation → why it matters for ordinary Sri Lankans. Acknowledge genuine achievements briefly where relevant (for example the IMF's assessment of programme performance); it makes the criticism harder to dismiss.

Non-negotiable standards (this protects the publication legally and with advertisers):
- Every factual claim must come from a reputable source you actually found (official statistics, courts, Parliament, commissions, UN, major Sri Lankan and international media). List them in "sources" with their real URLs. Never invent a source, figure, date or URL.
- Never invent or paraphrase a quotation. Only quote words that appear in a source, and attribute them.
- No personal insults, no mockery of appearance, family or religion. Criticise decisions, records and conduct.
- Do not state as fact that a named living person committed a crime unless a court has found so; otherwise say what is alleged, by whom, and the person's response.
- Historical violence must be described as documented (commissions, courts, reputable historians), with care for victims.
- Fill "governmentPosition" with the government's stated position or defence on the issue, fairly and briefly (from a source). The article text must also mention it.
- Distinguish clearly between established fact and analysis or opinion.
- No hate speech, no incitement, nothing that could endanger a person.
- International English, clear and readable for a global audience. No markdown, no headings inside paragraphs, no URLs inside the paragraphs.
- Choose a sharp but accurate headline (max 90 characters) and a one-sentence dek (max 160 characters). Do not repeat a subject from the recent titles listed.
`.trim()

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'dek', 'paragraphs', 'governmentPosition', 'sources'],
  properties: {
    title: { type: 'string' },
    dek: { type: 'string' },
    paragraphs: { type: 'array', items: { type: 'string' } },
    governmentPosition: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'publisher', 'url'],
        properties: { title: { type: 'string' }, publisher: { type: 'string' }, url: { type: 'string' } },
      },
    },
  },
}

export async function readLankaAnalysis() {
  return getJson<LwAnalysisFile>(FILE, { updatedAt: '', items: [] })
}

function slugify(title: string, date: string) {
  const base = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 70)
    .replace(/-+$/, '')
  return `${base}-${date.replace(/-/g, '')}`
}

/** Makes today's analysis, unless one was made in the last 20 hours. */
export async function produceLankaAnalysis(options: { force?: boolean } = {}) {
  const existing = await readLankaAnalysis()
  const newest = existing.items[0]
  // Three a day (owner, 1 Nov 2026): skip only if one was made in the last 5 hours.
  if (!options.force && newest && Date.now() - Date.parse(newest.publishedAt) < 5 * 3_600_000) {
    return { ok: true, skipped: 'made one recently', newest: newest.title }
  }

  const check = await canSpend('news', 0.08)
  if (!check.ok) return { ok: false, skipped: check.reason }

  // The angle used longest ago (never-used first), so consecutive articles differ.
  const lastUsed = (key: string) => {
    const i = existing.items.findIndex((it) => it.angle === key)
    return i === -1 ? Infinity : i
  }
  const angle = [...ANGLES].sort((x, y) => lastUsed(y.key) - lastUsed(x.key))[0]
  // A picture not used in the last 12 articles where possible.
  const recentImages = new Set(existing.items.slice(0, 12).map((it) => it.image))
  const [imageFile, imageAlt] = angle.images.map(([f, alt]) => [IMG(f), alt] as const).find(([u]) => !recentImages.has(u)) ??
    [IMG(angle.images[0][0]), angle.images[0][1]]
  const recent = existing.items.slice(0, 25).map((i) => `- ${i.title}`).join('\n')
  const leads = STORY_LEADS.map((l) => `- ${l}`).join('\n')
  const today = new Date().toISOString().slice(0, 10)

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.DV_RADIO_SCRIPT_MODEL || 'gpt-5-mini',
      reasoning: { effort: 'medium' },
      instructions: INSTRUCTIONS,
      input: `Today is ${today}.\nAngle: ${angle.brief}\n\nKnown story leads you may develop if relevant to the angle and still newsworthy — re-check every fact with web search and use the newest developments:\n${leads}\n\nRecent Lanka Witness titles (do not repeat these subjects):\n${recent || '- none yet'}`,
      tools: [{ type: 'web_search' }],
      max_tool_calls: 5,
      max_output_tokens: 9000,
      text: { format: { type: 'json_schema', name: 'lanka_analysis', schema: SCHEMA, strict: true } },
    }),
  })
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300)
    await recordFailure('news', `lankawitness ${response.status}: ${detail}`)
    throw new Error(`Lanka Witness analysis failed (${response.status})`)
  }
  const data = (await response.json()) as {
    output_text?: string
    output?: { type: string; content?: { type: string; text?: string }[] }[]
    usage?: { input_tokens?: number; output_tokens?: number; input_tokens_details?: { cached_tokens?: number } }
  }
  const searches = (data.output || []).filter((o) => o.type === 'web_search_call').length
  const cachedIn = data.usage?.input_tokens_details?.cached_tokens || 0
  const freshIn = Math.max(0, (data.usage?.input_tokens || 0) - cachedIn)
  await recordSpend(
    'news',
    freshIn * PRICES.inputPerToken +
      cachedIn * PRICES.cachedInputPerToken +
      (data.usage?.output_tokens || 0) * PRICES.outputPerToken +
      searches * PRICES.webSearchCall,
    `Lanka Witness analysis (${angle.key}, ${searches} searches)`,
  )
  const text =
    data.output_text ||
    (data.output || [])
      .filter((o) => o.type === 'message')
      .flatMap((o) => o.content || [])
      .map((c) => c.text || '')
      .join('')
  const parsed = JSON.parse(text) as {
    title: string
    dek: string
    paragraphs: string[]
    governmentPosition: string
    sources: LwSource[]
  }

  // Quality gate: no article without real sources and real substance.
  const sources = (parsed.sources || [])
    .map((s) => ({ ...s, url: cleanUrl(s.url) }))
    .filter((s) => /^https?:\/\/[^\s]+\.[a-z]{2,}/i.test(s.url))
    .slice(0, 12)
  const paragraphs = (parsed.paragraphs || []).map(cleanParagraph).filter((p) => p.length > 40)
  if (sources.length < 3 || paragraphs.length < 5 || !parsed.title?.trim()) {
    await recordFailure('news', `lankawitness quality gate: ${sources.length} sources, ${paragraphs.length} paragraphs`)
    return { ok: false, skipped: 'quality gate: not enough sources or substance' }
  }

  const item: LwAnalysis = {
    slug: slugify(parsed.title, today),
    title: parsed.title.trim().slice(0, 120),
    dek: (parsed.dek || '').trim().slice(0, 220),
    kicker: angle.kicker,
    angle: angle.key,
    image: imageFile,
    imageAlt,
    paragraphs,
    governmentPosition: (parsed.governmentPosition || '').trim(),
    sources,
    publishedAt: new Date().toISOString(),
  }
  const items = [item, ...existing.items.filter((i) => i.slug !== item.slug)].slice(0, KEEP)
  await putJson(FILE, { updatedAt: item.publishedAt, items } satisfies LwAnalysisFile)
  return { ok: true, title: item.title, slug: item.slug, angle: angle.key, sources: sources.length }
}

/** Removes web-search citation tags like "([site.com](https://…))" from the text. */
function cleanParagraph(text: string) {
  return text
    .replace(/\s*\(\[[^\]]*\]\([^)]*\)\)/g, '')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanUrl(url: string) {
  try {
    const u = new URL(url.trim())
    for (const k of [...u.searchParams.keys()]) if (/^utm_/i.test(k)) u.searchParams.delete(k)
    return u.toString()
  } catch {
    return url.trim()
  }
}
