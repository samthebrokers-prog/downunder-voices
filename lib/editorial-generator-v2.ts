import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import { uniqueSlug } from '@/lib/slug'
import { publishStoryToFacebook } from '@/lib/facebook'

type Region = 'Australia' | 'New Zealand' | 'World'

type Story = {
  id: string
  title: string
  summary: string
  category: string
  source_name: string
  source_url: string
  image_url: string | null
  import_method: string | null
  published_at: string | null
  created_at: string
  status: 'draft' | 'published' | 'archived'
}

type Candidate = {
  title: string
  summary: string
  communityAngle: string
  sourceUrl: string
  region: Region
}

export type EditorialGenerationResult = {
  created: number
  targetToday: number
  titles: string[]
}

const AU_PATTERN = /\b(australia|australian|nsw|new south wales|victoria|queensland|western australia|south australia|tasmania|act|northern territory|sydney|melbourne|brisbane|perth|adelaide|hobart|darwin|canberra)\b/i
const NZ_PATTERN = /\b(new zealand|aotearoa|auckland|wellington|christchurch|hamilton|tauranga|dunedin|queenstown|rotorua|palmerston north|napier|nelson|invercargill|māori|maori)\b/i
const PUBLIC_INTEREST_PATTERN = /\b(cost of living|inflation|rent|housing|mortgage|interest rate|wage|salary|job|employment|unemployment|tax|pension|benefit|health|hospital|education|school|university|migration|immigration|migrant|refugee|racism|discrimination|poverty|inequality|crime|justice|court|government|minister|parliament|election|policy|climate|energy|electricity|fuel|trade|tariff|war|conflict|human rights|technology|artificial intelligence|ai|environment|fishing|farming|animal welfare)\b/i
const WORLD_AFFECTS_HOME_PATTERN = /\b(global economy|world economy|oil|fuel|energy|interest rates|trade|tariff|shipping|supply chain|war|conflict|climate|technology|artificial intelligence|ai|cyber|markets|migration|pandemic|health emergency|food prices|commodity|china|united states|usa|europe|asia)\b/i

function regionOf(story: Story): Region {
  const text = `${story.title} ${story.summary} ${story.category}`
  if (AU_PATTERN.test(text)) return 'Australia'
  if (NZ_PATTERN.test(text)) return 'New Zealand'
  return 'World'
}

function sourceScore(story: Story): number {
  const text = `${story.title} ${story.summary}`
  const region = regionOf(story)
  let score = 0
  if (region === 'Australia') score += 30
  if (region === 'New Zealand') score += 28
  if (PUBLIC_INTEREST_PATTERN.test(text)) score += 16
  if (region === 'World' && WORLD_AFFECTS_HOME_PATTERN.test(text)) score += 9
  if (/\b(celebrity|horoscope|lottery|recipe|fashion|movie review)\b/i.test(text)) score -= 20
  const ageHours = Math.max(0, (Date.now() - new Date(story.published_at || story.created_at).getTime()) / 36e5)
  score += Math.max(0, 12 - Math.floor(ageHours / 4))
  return score
}

function extractText(data: {
  output_text?: string
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>
}): string {
  return data.output_text ?? data.output?.flatMap(item => item.content ?? []).find(item => item.type === 'output_text')?.text ?? ''
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

async function generateCandidates(news: Story[], previous: Story[]): Promise<Candidate[]> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is missing.')

  const material = news.map((story, index) => [
    `STORY ${index + 1}`,
    `Region: ${regionOf(story)}`,
    `Title: ${story.title}`,
    `Source: ${story.source_name}`,
    `Source URL: ${story.source_url}`,
    `Facts: ${story.summary}`,
  ].join('\n')).join('\n\n')

  const previousTitles = previous.slice(0, 50).map(story => `- ${story.title}`).join('\n') || '- none'

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      instructions: `You are the senior editorial writer for Downunder Voices. Produce exactly THREE genuinely different editorial candidates from the supplied verified news material. Australia and New Zealand are the home markets and must have clear priority. Prefer Australian and New Zealand issues whenever they are substantial. Use a World story only when it is globally significant or has a clear likely consequence for Australia or New Zealand, such as trade, fuel, markets, migration, war, climate, technology, shipping or public health. Do not force Pacific/community coverage. Each article must be an original 450-750 word newspaper-style editorial, written in natural Australian/New Zealand English, with a measured but clear editorial view. Use only facts supplied below. Do not invent quotes, figures, names, dates or claims. Do not copy source sentences. Explain why the issue matters to ordinary readers. Avoid clickbait and AI-style filler. Never tell readers how to vote. The title must be under 100 characters. sourceUrl must exactly match one supplied Source URL. region must be Australia, New Zealand or World. Return JSON only.`,
      input: `RECENT VERIFIED NEWS\n\n${material}\n\nRECENT DOWNUNDER VOICES EDITORIALS TO AVOID REPEATING\n\n${previousTitles}`,
      text: {
        format: {
          type: 'json_schema',
          name: 'dv_editorial_candidates',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              editorials: {
                type: 'array', minItems: 3, maxItems: 3,
                items: {
                  type: 'object', additionalProperties: false,
                  properties: {
                    title: { type: 'string' },
                    summary: { type: 'string' },
                    communityAngle: { type: 'string' },
                    sourceUrl: { type: 'string' },
                    region: { type: 'string', enum: ['Australia', 'New Zealand', 'World'] },
                  },
                  required: ['title', 'summary', 'communityAngle', 'sourceUrl', 'region'],
                },
              },
            },
            required: ['editorials'],
          },
        },
      },
      max_output_tokens: 6500,
    }),
    signal: AbortSignal.timeout(90000),
    cache: 'no-store',
  })

  if (!response.ok) throw new Error(`OpenAI editorial generator failed with ${response.status}: ${await response.text()}`)
  const raw = extractText(await response.json())
  if (!raw.trim()) throw new Error('OpenAI returned no editorial content.')
  const parsed = JSON.parse(raw) as { editorials?: Candidate[] }
  if (!Array.isArray(parsed.editorials)) return []

  const validUrls = new Set(news.map(story => story.source_url))
  return parsed.editorials.filter(item => item.title && item.summary && validUrls.has(item.sourceUrl))
}

async function publish(candidate: Candidate, source: Story, createdTitles: string[]): Promise<boolean> {
  if (createdTitles.some(title => similar(title, candidate.title))) return false

  const existing = await dbRequest<Array<{ id: string; title: string }>>('stories', {
    query: `?select=id,title&status=neq.archived&order=created_at.desc&limit=120`,
  })
  if (existing.some(story => similar(story.title, candidate.title))) return false

  const slug = uniqueSlug(candidate.title, `${candidate.sourceUrl}-${Date.now()}`)
  const imageUrl = source.image_url || null

  await dbRequest('stories', {
    method: 'POST',
    body: {
      slug,
      title: candidate.title.slice(0, 220),
      category: 'social-issues',
      summary: candidate.summary.slice(0, 9000),
      source_name: source.source_name || 'Downunder Voices Editorial',
      source_url: source.source_url,
      image_url: imageUrl,
      community_angle: candidate.communityAngle.slice(0, 1200),
      author: 'From the Editor — Downunder Voices',
      status: 'published',
      published_at: new Date().toISOString(),
      import_method: 'automated-editorial',
    },
  })

  const facebook = await publishStoryToFacebook({
    title: candidate.title,
    slug,
    summary: candidate.summary,
    imageUrl: imageUrl || undefined,
  })
  if (!facebook.ok) console.error(`Editorial published but Facebook delivery failed: ${candidate.title}`)
  return true
}

export async function runEditorialGeneratorV2(): Promise<EditorialGenerationResult> {
  if (!isDatabaseConfigured()) throw new Error('Database is not configured.')

  const now = new Date()
  const weekend = now.getUTCDay() === 0 || now.getUTCDay() === 6
  const targetToday = weekend ? 6 : 4
  const maxThisRun = weekend ? 3 : 2

  const recent = await dbRequest<Story[]>('stories', {
    query: '?select=id,title,summary,category,source_name,source_url,image_url,import_method,published_at,created_at,status&status=neq.archived&order=created_at.desc&limit=300',
  })

  const start = new Date(now)
  start.setUTCHours(0, 0, 0, 0)

  const previous = recent.filter(story => story.import_method === 'automated-editorial' && story.status === 'published')
  const publishedToday = previous.filter(story => story.published_at && new Date(story.published_at).getTime() >= start.getTime())
  const remaining = Math.max(0, targetToday - publishedToday.length)
  if (!remaining) return { created: 0, targetToday, titles: [] }

  const news = recent
    .filter(story => story.import_method !== 'automated-editorial' && story.status === 'published' && story.title && story.summary && story.source_url)
    .filter(story => {
      const age = Date.now() - new Date(story.published_at || story.created_at).getTime()
      return age <= 72 * 60 * 60 * 1000
    })
    .sort((a, b) => sourceScore(b) - sourceScore(a))

  const au = news.filter(story => regionOf(story) === 'Australia').slice(0, 24)
  const nz = news.filter(story => regionOf(story) === 'New Zealand').slice(0, 20)
  const world = news.filter(story => regionOf(story) === 'World' && WORLD_AFFECTS_HOME_PATTERN.test(`${story.title} ${story.summary}`)).slice(0, 12)
  const selected = [...au, ...nz, ...world].sort((a, b) => sourceScore(b) - sourceScore(a)).slice(0, 60)

  if (selected.length < 4) throw new Error('Not enough strong recent AU/NZ-relevant news to create editorials.')

  const candidates = await generateCandidates(selected, previous)
  const limit = Math.min(remaining, maxThisRun)
  const createdTitles: string[] = []

  for (const candidate of candidates) {
    if (createdTitles.length >= limit) break
    const source = selected.find(story => story.source_url === candidate.sourceUrl)
    if (!source) continue
    if (candidate.region === 'World' && !WORLD_AFFECTS_HOME_PATTERN.test(`${source.title} ${source.summary}`)) continue
    if (await publish(candidate, source, createdTitles)) createdTitles.push(candidate.title)
  }

  return { created: createdTitles.length, targetToday, titles: createdTitles }
}
