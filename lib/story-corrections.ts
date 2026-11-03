import type { CategorySlug } from '@/lib/news-data'

/*
 * Display-time corrections for imported feed stories (owner request, 3 Nov 2026 health check):
 *  1. Publishers saved with a generic name (e.g. ABC News saved as "Net") show their real name.
 *  2. Feed stories filed in the wrong region are moved to the right one
 *     (e.g. Mark Latham / WA minister stories filed under World, a celebrity story filed under NZ).
 *  3. Downunder Voices originals never show another outlet's photo — they use our own illustration.
 *  4. The same story imported twice (different headline, same photo or link) appears only once.
 * These run when stories are read, so stories already in the database are fixed too.
 */

const PUBLISHER_NAMES: Array<[RegExp, string]> = [
  [/(^|\.)abc\.net\.au$/i, 'ABC News'],
  [/(^|\.)rnz\.co\.nz$/i, 'RNZ'],
  [/(^|\.)sbs\.com\.au$/i, 'SBS News'],
  [/(^|\.)theguardian\.com$/i, 'The Guardian'],
  [/(^|\.)7news\.com\.au$/i, '7NEWS'],
  [/(^|\.)9news\.com\.au$/i, '9News'],
  [/(^|\.)nzherald\.co\.nz$/i, 'NZ Herald'],
  [/(^|\.)stuff\.co\.nz$/i, 'Stuff'],
  [/(^|\.)1news\.co\.nz$/i, '1News'],
  [/(^|\.)bbc\.(co\.uk|com)$/i, 'BBC'],
  [/(^|\.)aljazeera\.com$/i, 'Al Jazeera English'],
]

// Names that are clearly a fragment of a web address rather than a publisher.
const GENERIC_NAMES = new Set(['', 'net', 'com', 'au', 'nz', 'www', 'news', 'rss', 'feed', 'feeds', 'co'])

function hostOf(url?: string | null): string {
  if (!url) return ''
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

export function displaySourceName(sourceName: string | null | undefined, sourceUrl?: string | null): string {
  const name = (sourceName ?? '').trim()
  if (!GENERIC_NAMES.has(name.toLowerCase())) return name
  const host = hostOf(sourceUrl)
  for (const [pattern, publisher] of PUBLISHER_NAMES) if (pattern.test(host)) return publisher
  return name
}

/* ---------- region correction ---------- */

type Region = 'australia' | 'new-zealand' | 'world'

const AU = /\b(australia|australian|australians|aussie|canberra|sydney|melbourne|brisbane|perth|adelaide|hobart|darwin|gold coast|new south wales|nsw|queensland|qld|victoria|victorian|tasmania|tasmanian|western australia|wa minister|wa premier|wa government|wa police|wa's|south australia|northern territory|albanese|anthony albanese|sussan ley|peter dutton|pauline hanson|one nation|mark latham|helen haines|federal labor|labor government|coalition government|federal parliament|parliament house|centrelink|ndis|medicare|asx|rba|reserve bank of australia|afl|nrl)\b/i
const NZ = /\b(new zealand|new zealander|new zealanders|aotearoa|kiwi|kiwis|auckland|wellington|christchurch|hamilton|tauranga|dunedin|rotorua|invercargill|palmerston north|napier|nelson|queenstown|whangārei|whangarei|porirua|beehive|luxon|chris hipkins|te pāti māori|pharmac|rnz)\b/i
const WORLD = /\b(united states|usa|u\.s|america|american|americans|trump|white house|midterms?|congress|united kingdom|britain|british|england|london|europe|european|china|chinese|beijing|india|indian|japan|japanese|canada|canadian|germany|german|france|french|ukraine|ukrainian|russia|russian|kremlin|putin|middle east|israel|israeli|israelis|palestinian|palestinians|gaza|west bank|hebron|jerusalem|iran|iranian|iraq|syria|lebanon|africa|african|asia|fiji|tonga|samoa|vanuatu|solomon islands|papua new guinea|al jazeera|un security council|nato)\b/i

const CELEBRITY = /\b(britney spears|kardashian|taylor swift|beyonc[ée]|kanye|justin bieber|selena gomez|pop star|popstar|hollywood|reality star|reality tv|red carpet)\b/i
const BUSINESS_WORDS = /\b(business|businesses|company|companies|economy|economic|industry|jobs|bank|banks|interest rates?|inflation|retail|retailer|profit|profits|investment|market|markets|shares|stores|trade|tariffs?)\b/i
const CONFLICT_WORDS = /\b(soldiers|troops|military|army|airstrikes?|strikes|raid|raids|war|ceasefire|journalist arrested|arrest|arrested|blindfolded)\b/i

const REGIONAL = new Set<string>(['australia', 'new-zealand', 'nz-pacific', 'world'])

function regionOf(text: string): Region | null {
  const au = AU.test(text)
  const nz = NZ.test(text)
  const world = WORLD.test(text)
  const hits = [au, nz, world].filter(Boolean).length
  if (hits !== 1) return null
  return au ? 'australia' : nz ? 'new-zealand' : 'world'
}

function sameRegion(category: string, region: Region): boolean {
  if (region === 'new-zealand') return category === 'new-zealand' || category === 'nz-pacific'
  return category === region
}

export function correctFeedCategory(
  category: CategorySlug,
  title: string,
  summary: string,
  sourceUrl?: string | null,
): CategorySlug {
  const cleanTitle = (title ?? '').trim()
  const fullText = `${cleanTitle} ${summary ?? ''}`

  // A celebrity story belongs in Entertainment, not a news region.
  if (REGIONAL.has(category) && CELEBRITY.test(cleanTitle)) return 'entertainment' as CategorySlug

  // Overseas conflict news filed under Business moves to World.
  if ((category === 'small-business' || category === 'business') && !BUSINESS_WORDS.test(cleanTitle.replace(/west bank/gi, '')) && CONFLICT_WORDS.test(cleanTitle) && WORLD.test(fullText)) {
    return 'world' as CategorySlug
  }

  if (!REGIONAL.has(category)) return category

  const region = regionOf(cleanTitle) ?? regionOf(fullText)
  if (region) return sameRegion(category, region) ? category : (region as CategorySlug)

  // No place named at all: trust the publisher's home country over a "World" default.
  if (category === 'world' && !WORLD.test(fullText)) {
    const host = hostOf(sourceUrl)
    if (/\.au$/.test(host)) return 'australia' as CategorySlug
    if (/\.nz$/.test(host)) return 'new-zealand' as CategorySlug
  }
  return category
}

/* ---------- photos on our own originals ---------- */

const OWN_IMAGE_HOSTS = /(^|\.)(downundervoices\.com|wikimedia\.org|wikipedia\.org|unsplash\.com)$/i

/** True when an original Downunder Voices piece is carrying another news outlet's photo. */
export function isBorrowedImage(imageUrl: string | null | undefined): boolean {
  if (!imageUrl || imageUrl.startsWith('data:') || imageUrl.startsWith('/')) return false
  const host = hostOf(imageUrl)
  return !!host && !OWN_IMAGE_HOSTS.test(host)
}

/* ---------- duplicate stories ---------- */

function words(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3),
  )
}

function similarTitles(a: string, b: string): boolean {
  const left = words(a)
  const right = words(b)
  if (!left.size || !right.size) return false
  let shared = 0
  for (const word of left) if (right.has(word)) shared += 1
  return shared / Math.min(left.size, right.size) >= 0.75
}

/** Keeps the first copy of each story; later copies with the same photo, link or near-identical headline are dropped. */
export function removeDuplicateStories<T extends { title: string; image?: string; sourceUrl?: string }>(stories: T[]): T[] {
  const kept: T[] = []
  const seenImages = new Set<string>()
  const seenLinks = new Set<string>()
  for (const story of stories) {
    const image = story.image && !story.image.startsWith('data:') ? story.image.split('?')[0] : ''
    const link = story.sourceUrl ? story.sourceUrl.split('?')[0] : ''
    if (image && seenImages.has(image)) continue
    if (link && seenLinks.has(link)) continue
    if (kept.some((other) => similarTitles(other.title, story.title))) continue
    if (image) seenImages.add(image)
    if (link) seenLinks.add(link)
    kept.push(story)
  }
  return kept
}
