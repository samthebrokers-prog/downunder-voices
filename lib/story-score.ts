import type { CategorySlug } from '@/lib/news-data'

type StoryScoreInput = {
  title: string
  summary?: string
  category: CategorySlug
  sourceName?: string
  publishedAt?: string
}

const VERY_HIGH_INTEREST_TERMS = [
  'protest','protests','public anger','outrage','backlash','controversy','scandal','corruption','corrupt','misconduct','abuse of power','conflict of interest','resign','resignation','racism','racist','discrimination','migrant exploitation','worker exploitation','underpaid','underpayment','wage theft','human trafficking','modern slavery','cost of living','housing crisis','rent crisis','homelessness','mortgage stress','poverty','food bank','food insecurity','inequality','court','trial','charged','arrested','investigation','fraud','scam','murder','assault','sexual assault','celebrity','hollywood','viral',
]

const HIGH_INTEREST_TERMS = [
  'breaking','exclusive','emergency','crisis','major','historic','record','warning','alert','election','by-election','byelection','polls','polling','vote','voters','candidate','prime minister','premier','president','government','minister','parliament','opposition','policy','immigration','refugee','deportation','visa','war','attack','earthquake','tsunami','cyclone','flood','fire','wildfire','plane crash','aviation','interest rate','inflation','housing','mortgage','rent','petrol','supermarket','jobs','unemployment','tax','artificial intelligence','openai','social media','technology','china','trump','ukraine','russia','israel','gaza','iran','actor','actress','singer','movie','film','music','rugby','cricket','football','tennis','olympics',
]

const BREAKING_PUBLIC_INTEREST_TERMS = [
  'election','by-election','byelection','polls','polling','vote','voters','candidate','results','count','counting','winner','wins','government','parliament','prime minister','premier','minister','resign','resignation','court','charged','arrested','police','murder','emergency','warning','alert','earthquake','tsunami','cyclone','flood','wildfire','bushfire','missing','interest rate','cost of living','housing crisis','strike','outage',
]

const COMMUNITY_IMPACT_TERMS = ['family','families','children','students','workers','employees','community','communities','migrants','immigrants','asian','pacific','maori','aboriginal','indigenous','young people','elderly','disabled','small business','small businesses','households','tenants','homeowners']
const POLITICAL_ACCOUNTABILITY_TERMS = ['government decision','government policy','minister','prime minister','premier','parliament','senate','mp','politician','public money','taxpayer','inquiry','royal commission','ombudsman','watchdog','audit','investigation','conflict of interest','misconduct','corruption','scandal','resignation','election','by-election','byelection']
const HUMAN_INTEREST_TERMS = ['survivor','family','community','hero','volunteer','rescue','missing','found','reunited','heartbreaking','emotional','inspiring','extraordinary','remarkable','viral']
const TRADE_TERMS = ['customs','border force','biosecurity','freight','shipping','container','cargo','port','supply chain','import','export','tariff','trade agreement','air cargo','sea freight']
const LOW_VALUE_TERMS = ['earnings call','quarterly earnings','stock price','share price','analyst rating','price target','dividend','investor relations','sponsored','press release only','corporate announcement','market update','investor presentation','annual general meeting','agm','results presentation','broker recommendation']
const VERY_LOW_VALUE_TERMS = ['promotional offer','product launch','brand partnership','advertorial','sponsored content','marketing campaign']

const CATEGORY_BASE_SCORE: Record<CategorySlug, number> = {
  world: 62,
  australia: 82,
  'new-zealand': 82,
  'trade-logistics': 68,
  'social-issues': 78,
  'small-business': 66,
  community: 65,
  sports: 63,
  entertainment: 70,
  politics: 80,
  business: 60,
  'nz-pacific': 76,
  'editorial-view': 50,
}

function containsAny(text: string, terms: string[]): boolean { return terms.some((term) => text.includes(term)) }
function countMatches(text: string, terms: string[]): number { return terms.reduce((count, term) => text.includes(term) ? count + 1 : count, 0) }
function ageHours(publishedAt?: string): number | null {
  if (!publishedAt) return null
  const published = new Date(publishedAt)
  if (Number.isNaN(published.valueOf())) return null
  return (Date.now() - published.getTime()) / (1000 * 60 * 60)
}
function freshnessScore(publishedAt?: string): number {
  const age = ageHours(publishedAt)
  if (age === null) return 0
  if (age <= 2) return 22
  if (age <= 6) return 19
  if (age <= 12) return 16
  if (age <= 24) return 13
  if (age <= 48) return 6
  if (age <= 72) return 2
  return -8
}

export function scoreStory({ title, summary = '', category, sourceName = '', publishedAt }: StoryScoreInput): number {
  const text = `${title} ${summary} ${sourceName}`.toLowerCase()
  let score = CATEGORY_BASE_SCORE[category] ?? 50
  const veryHighMatches = countMatches(text, VERY_HIGH_INTEREST_TERMS)
  const highMatches = countMatches(text, HIGH_INTEREST_TERMS)
  const communityMatches = countMatches(text, COMMUNITY_IMPACT_TERMS)
  const accountabilityMatches = countMatches(text, POLITICAL_ACCOUNTABILITY_TERMS)
  const humanInterestMatches = countMatches(text, HUMAN_INTEREST_TERMS)
  const age = ageHours(publishedAt)
  const local = category === 'australia' || category === 'new-zealand' || category === 'politics' || category === 'nz-pacific'
  const breakingPublicInterest = containsAny(text, BREAKING_PUBLIC_INTEREST_TERMS)

  if (veryHighMatches > 0) score += Math.min(28, veryHighMatches * 8)
  if (highMatches > 0) score += Math.min(18, highMatches * 4)
  score += communityMatches >= 2 ? 8 : communityMatches === 1 ? 4 : 0
  score += accountabilityMatches >= 2 ? 12 : accountabilityMatches === 1 ? 6 : 0
  score += humanInterestMatches >= 2 ? 8 : humanInterestMatches === 1 ? 4 : 0

  // Editorial rule: a fresh AU/NZ public-interest event should beat routine world news.
  if (local && breakingPublicInterest && age !== null && age <= 24) score += 28
  else if (local && breakingPublicInterest && age !== null && age <= 48) score += 16
  if (local && age !== null && age <= 24) score += 8

  if (category === 'social-issues' && veryHighMatches > 0) score += 8
  if (local && (accountabilityMatches > 0 || communityMatches > 0 || veryHighMatches > 0)) score += 6
  if (category === 'trade-logistics' && containsAny(text, TRADE_TERMS)) score += 8
  if (containsAny(text, LOW_VALUE_TERMS)) score -= 35
  if (containsAny(text, VERY_LOW_VALUE_TERMS)) score -= 50
  score += freshnessScore(publishedAt)
  if (title.length >= 35) score += 3
  if (summary.length >= 120) score += 3
  if (veryHighMatches >= 2 && communityMatches >= 1) score += 6
  if (accountabilityMatches >= 1 && communityMatches >= 1) score += 6
  return Math.max(0, Math.min(140, score))
}

export function sortStoriesByScore<T extends StoryScoreInput>(stories: T[]): T[] {
  return [...stories].sort((a, b) => {
    const scoreDiff = scoreStory(b) - scoreStory(a)
    if (scoreDiff !== 0) return scoreDiff
    return new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
  })
}
