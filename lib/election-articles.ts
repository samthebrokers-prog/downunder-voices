import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import { uniqueSlug } from '@/lib/slug'
import { publishStoryToFacebook } from '@/lib/facebook'

/*
 * Daily election opinion: three original Downunder Voices articles a day on
 * the New Zealand and Australian elections, written from the publication's
 * stated editorial line (supportive of NZ Labour and Australian Labor),
 * clearly labelled as opinion, built only from verified imported news.
 */

type Race = 'nz' | 'au'

type Story = {
  id: string
  title: string
  summary: string
  category: string
  source_name: string
  source_url: string
  import_method: string | null
  published_at: string | null
  created_at: string
  status: string
}

type Article = {
  title: string
  body: string
  whyItMatters: string
  sourceUrl: string
}

export type ElectionArticleResult = {
  created: number
  targetToday: number
  titles: string[]
  skipped?: string
}

const DAILY_TARGET = 3
const IMPORT_METHOD = 'automated-election-opinion'

const NZ_ELECTION_DAY = '2026-11-07' // NZ general election (Electoral Commission)
const VIC_ELECTION_DAY = '2026-11-28' // Victorian state election

const NZ_PATTERN = /\b(new zealand|aotearoa|nz|hipkins|luxon|national party|nz labour|labour party|greens|green party|act party|seymour|nz first|winston peters|te pāti māori|te pati maori|opportunity party|electoral commission|beehive|wellington)\b/i
const AU_PATTERN = /\b(australia|australian|albanese|dutton|ley|labor|coalition|liberal|nationals|victoria|victorian|carroll|jess wilson|spring street|vec|aec|canberra|melbourne|teal|one nation)\b/i
const ELECTION_PATTERN = /\b(election|elections|poll|polls|polling|campaign|vote|votes|voters|voting|enrol|enrolment|ballot|candidate|candidates|electorate|seat|seats|coalition talks|manifesto|policy launch|debate|leader|leaders|prime minister|premier|labour|labor|national|liberal|greens|parliament|by-election|budget|cost of living|housing|health)\b/i

function regionOf(story: Story): Race | null {
  const text = `${story.title} ${story.summary}`
  if (story.category === 'new-zealand' || NZ_PATTERN.test(text)) return 'nz'
  if (story.category === 'australia' || AU_PATTERN.test(text)) return 'au'
  return null
}

function electionScore(story: Story): number {
  const text = `${story.title} ${story.summary}`
  let score = 0
  const hits = text.match(new RegExp(ELECTION_PATTERN.source, 'gi'))
  score += Math.min(12, (hits?.length ?? 0) * 2)
  if (/\b(election|poll|campaign|vote|voting|enrol)/i.test(story.title)) score += 10
  const ageHours = Math.max(0, (Date.now() - new Date(story.published_at || story.created_at).getTime()) / 36e5)
  score += Math.max(0, 10 - Math.floor(ageHours / 6))
  return score
}

function nzDate(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland' }).format(d)
}

function perthDate(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Perth' }).format(d)
}

function startOfPerthDay(): number {
  const today = perthDate()
  // Perth is UTC+8 all year (no daylight saving).
  return new Date(`${today}T00:00:00+08:00`).getTime()
}

/*
 * NZ law bans election campaigning, including publishing material intended to
 * influence voters, on election day until polls close at 7pm NZ time.
 */
function nzElectionDayBlackout(now = new Date()): boolean {
  if (nzDate(now) !== NZ_ELECTION_DAY) return false
  const hour = Number(new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', hour: 'numeric', hourCycle: 'h23' }).format(now))
  return hour < 19
}

function vicElectionDayBlackout(now = new Date()): boolean {
  const melbourne = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Melbourne' }).format(now)
  return melbourne === VIC_ELECTION_DAY
}

function words(value: string): Set<string> {
  return new Set(value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(word => word.length >= 5))
}

function similar(a: string, b: string): boolean {
  const aa = words(a)
  const bb = words(b)
  if (!aa.size || !bb.size) return false
  let overlap = 0
  aa.forEach(word => { if (bb.has(word)) overlap += 1 })
  return overlap / Math.min(aa.size, bb.size) >= 0.6
}

function extractText(data: {
  output_text?: string
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>
}): string {
  return data.output_text ?? data.output?.flatMap(item => item.content ?? []).find(item => item.type === 'output_text')?.text ?? ''
}

function raceBrief(race: Race): string {
  if (race === 'nz') {
    return `RACE: New Zealand general election, election day Saturday ${NZ_ELECTION_DAY}. Main contest: Labour (leader Chris Hipkins) against the National-led government (Prime Minister Christopher Luxon). Write as an advocate for Labour's case to New Zealand voters.`
  }
  return `RACE: Australian politics and elections — chiefly the Victorian state election on Saturday ${VIC_ELECTION_DAY} (Labor government led by Premier Ben Carroll against the Liberal-led opposition under Jess Wilson), and federal politics under the Albanese Labor government where the supplied news is federal. Write as an advocate for Labor's case to Australian voters.`
}

async function writeArticle(race: Race, news: Story[], previousTitles: string[]): Promise<Article | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is missing.')

  const material = news.map((story, index) => [
    `STORY ${index + 1}`,
    `Title: ${story.title}`,
    `Source: ${story.source_name}`,
    `Source URL: ${story.source_url}`,
    `Facts: ${story.summary}`,
  ].join('\n')).join('\n\n')

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      instructions: [
        'You write signed opinion columns for Downunder Voices, an independent Australia/New Zealand news site.',
        'Downunder Voices openly takes a centre-left editorial line: it supports the New Zealand Labour Party and the Australian Labor Party. This is an OPINION piece written from that stated perspective, and it must read as clearly labelled opinion, not as a news report.',
        'Write ONE original 500-750 word opinion article about the race described below, in natural Australian/New Zealand English.',
        'Make a persuasive, good-faith argument for Labour/Labor based on policy and record: cost of living, wages and workers, housing, health, education, fairness and public services — whichever the supplied news actually supports.',
        'Rules that must never be broken:',
        '- Use ONLY facts contained in the supplied news. Never invent quotes, poll numbers, figures, dates, names, promises or events.',
        '- Criticise opponents on their policies, decisions and public record only. No personal attacks, insults, rumours or claims about private lives.',
        '- Do not misstate how, when or where to vote, and do not discourage anyone from voting.',
        '- Be honest about Labour/Labor weaknesses where the facts raise them, and answer them; credibility matters more than cheerleading.',
        '- Do not copy sentences from the sources. No clickbait, no AI filler phrases.',
        'Pick the single strongest, freshest election angle from the material, and avoid repeating the angles of recent Downunder Voices articles listed below.',
        'title: under 95 characters, sharp and specific. body: the full article as plain paragraphs separated by blank lines, no headings. whyItMatters: 2-3 sentences on what this means for ordinary households. sourceUrl: must exactly equal the Source URL of the main story you relied on.',
        'Return JSON only.',
      ].join('\n'),
      input: `${raceBrief(race)}\n\nVERIFIED NEWS MATERIAL\n\n${material}\n\nRECENT DOWNUNDER VOICES ELECTION ARTICLES (do not repeat)\n\n${previousTitles.slice(0, 30).map(t => `- ${t}`).join('\n') || '- none'}`,
      text: {
        format: {
          type: 'json_schema',
          name: 'dv_election_opinion',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              title: { type: 'string' },
              body: { type: 'string' },
              whyItMatters: { type: 'string' },
              sourceUrl: { type: 'string' },
            },
            required: ['title', 'body', 'whyItMatters', 'sourceUrl'],
          },
        },
      },
      max_output_tokens: 5000,
    }),
    signal: AbortSignal.timeout(100000),
    cache: 'no-store',
  })

  if (!response.ok) throw new Error(`OpenAI election writer failed with ${response.status}: ${await response.text()}`)
  const raw = extractText(await response.json())
  if (!raw.trim()) return null
  const article = JSON.parse(raw) as Article
  if (!article.title || !article.body || article.body.length < 1200) return null
  if (!news.some(story => story.source_url === article.sourceUrl)) return null
  return article
}

export async function runElectionArticles(maxThisRun = 1): Promise<ElectionArticleResult> {
  if (!isDatabaseConfigured()) throw new Error('Database is not configured.')

  const recent = await dbRequest<Story[]>('stories', {
    query: '?select=id,title,summary,category,source_name,source_url,import_method,published_at,created_at,status&status=neq.archived&order=created_at.desc&limit=400',
  })

  const ours = recent.filter(story => story.import_method === IMPORT_METHOD)
  const todayStart = startOfPerthDay()
  const ourToday = ours.filter(story => new Date(story.published_at || story.created_at).getTime() >= todayStart)
  const remaining = Math.max(0, DAILY_TARGET - ourToday.length)
  if (!remaining) return { created: 0, targetToday: DAILY_TARGET, titles: [] }

  const news = recent
    .filter(story => story.status === 'published' && story.import_method !== IMPORT_METHOD && story.import_method !== 'automated-editorial')
    .filter(story => story.title && story.summary && story.source_url)
    .filter(story => Date.now() - new Date(story.published_at || story.created_at).getTime() <= 96 * 36e5)
    .filter(story => ELECTION_PATTERN.test(`${story.title} ${story.summary}`))

  const byRace: Record<Race, Story[]> = { nz: [], au: [] }
  for (const story of news) {
    const race = regionOf(story)
    if (race) byRace[race].push(story)
  }
  byRace.nz.sort((a, b) => electionScore(b) - electionScore(a))
  byRace.au.sort((a, b) => electionScore(b) - electionScore(a))

  // NZ first (election is sooner), then Australia, then whichever has more fresh material.
  const nzAfterElection = nzDate() > NZ_ELECTION_DAY
  const rotation: Race[] = nzAfterElection ? ['au', 'nz', 'au'] : ['nz', 'au', 'nz']
  const created: string[] = []
  const skippedReasons: string[] = []

  for (let slot = ourToday.length; slot < DAILY_TARGET && created.length < Math.min(remaining, maxThisRun); slot++) {
    let race = rotation[slot] ?? 'nz'
    if ((race === 'nz' && nzElectionDayBlackout()) || (race === 'au' && vicElectionDayBlackout())) { race = race === 'nz' ? 'au' : 'nz' }
    if ((race === 'nz' && nzElectionDayBlackout()) || (race === 'au' && vicElectionDayBlackout())) { skippedReasons.push('election-day blackout'); break }
    if (byRace[race].length < 3) race = race === 'nz' ? 'au' : 'nz'
    const material = byRace[race].slice(0, 18)
    if (material.length < 3) { skippedReasons.push(`not enough recent ${race.toUpperCase()} election news`); continue }

    const previousTitles = [...created, ...ours.map(story => story.title)]
    const article = await writeArticle(race, material, previousTitles)
    if (!article) { skippedReasons.push('writer returned nothing usable'); continue }
    if (previousTitles.some(title => similar(title, article.title))) { skippedReasons.push('duplicate angle'); continue }

    const source = material.find(story => story.source_url === article.sourceUrl)!
    const slug = uniqueSlug(article.title, `${article.sourceUrl}-${Date.now()}`)
    const imageUrl = `/api/election-image/${encodeURIComponent(slug)}?race=${race}`
    const label = race === 'nz' ? 'NZ Election 2026' : 'Australian Politics'

    await dbRequest('stories', {
      method: 'POST',
      body: {
        slug,
        title: article.title.slice(0, 220),
        category: 'editorial-view',
        summary: `${article.body.trim()}\n\n— Opinion. This article reflects the editorial view of Downunder Voices, which supports ${race === 'nz' ? 'New Zealand Labour' : 'Australian Labor'}. ${label}.`.slice(0, 9000),
        source_name: `Downunder Voices Opinion — based on reporting by ${source.source_name}`,
        source_url: source.source_url,
        image_url: imageUrl,
        community_angle: article.whyItMatters.slice(0, 1200),
        author: 'Downunder Voices Election Desk — Opinion',
        status: 'published',
        published_at: new Date().toISOString(),
        import_method: IMPORT_METHOD,
      },
    })

    const facebook = await publishStoryToFacebook({
      title: `OPINION | ${article.title}`,
      slug,
      summary: article.whyItMatters,
    })
    if (!facebook.ok) console.error(`Election article published but Facebook delivery failed: ${article.title}`)

    created.push(article.title)
  }

  return { created: created.length, targetToday: DAILY_TARGET, titles: created, skipped: skippedReasons.join('; ') || undefined }
}
