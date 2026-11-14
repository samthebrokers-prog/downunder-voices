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
const WORLD = /\b(united states|usa|u\.s|america|american|americans|trump|white house|midterms?|congress|united kingdom|britain|british|england|london|europe|european|china|chinese|beijing|india|indian|japan|japanese|canada|canadian|germany|german|france|french|ukraine|ukrainian|russia|russian|kremlin|putin|middle east|israel|israeli|israelis|palestinian|palestinians|gaza|west bank|hebron|jerusalem|iran|iranian|iraq|syria|lebanon|africa|african|asia|fiji|tonga|samoa|vanuatu|solomon islands|papua new guinea|al jazeera|un security council|nato|argentina|argentine|milei|brazil|mexico|vatican|pope|pontiff|cop30|cop31|faa|federal aviation administration|washington|d\.c|new york|new orleans|california|texas|florida|chicago|haiti|spain|spanish|italy|italian|netherlands|dutch|norway|norwegian|(?<!south )wales|welsh|scotland|scottish|ireland|irish|korea|korean|taiwan|philippines|indonesia|indonesian|malaysia|singapore|thailand|vietnam|pakistan|bangladesh|sri lanka|nigeria|kenya|egypt|turkey|saudi|qatar|dubai|peru|chile|colombia|venezuela|cuba|greece|poland|sweden|denmark|finland|switzerland|austria|belgium|portugal)\b/i

const CELEBRITY = /\b(britney spears|kardashian|taylor swift|beyonc[ée]|kanye|justin bieber|selena gomez|pop star|popstar|hollywood|reality star|reality tv|red carpet)\b/i
const BUSINESS_WORDS = /\b(business|businesses|company|companies|economy|economic|industry|jobs|bank|banks|interest rates?|inflation|retail|retailer|profit|profits|investment|market|markets|shares|stores|trade|tariffs?)\b/i
const CONFLICT_WORDS = /\b(soldiers|troops|military|army|airstrikes?|strikes|raid|raids|war|ceasefire|journalist arrested|arrest|arrested|blindfolded)\b/i

const SPORT_TITLE = /\b(cricket|rugby|football|soccer|netball|nrl|afl|tennis|golf|olympics?|goalkeeper|striker|wicket|innings|ufc|mma|boxing|formula 1|f1|supercars|grand prix|all blacks|wallabies|matildas|socceroos|black caps|world cup|test match|nations championship|six nations|bledisloe|premier league|a-league|champions league)\b/i
const STRONG_SPORT = /\b(rugby|cricket|football|soccer|netball|nrl|afl|olympics?|tennis|golf|basketball|all blacks|wallabies|matildas|socceroos|black caps|a-league|premier league|world cup|grand slam|racing|motorsport|formula 1|f1|supercars|boxing|ufc|mma|goalkeeper|striker|midfielder|wicket|innings|test match|nations championship|six nations|rugby league|grand prix|la liga|serie a|bundesliga|champions league|socceroos|kiwis league|super rugby|black ferns|silver ferns|diamonds|wimbledon|bledisloe)\b/i
const FREIGHT_WORDS = /\b(freight|forwarder|forwarders|shipping|container|containers|cargo|logistics|supply chain|ports?|terminal|carriers?|dsv|kuehne|k\+n|maersk|msc|dhl)\b/i
const EARNINGS_WORDS = /\b(earnings|profit|profits|revenue|quarterly|q[1-4]|shares|shareholders|investors|analysts?|stock)\b/i

const REGIONAL = new Set<string>(['australia', 'new-zealand', 'nz-pacific', 'world'])

const US_UPPER = /\b(US|NY|UK|EU|UN)\b/

function regionOf(text: string): Region | null {
  const au = AU.test(text)
  const nz = NZ.test(text)
  const world = WORLD.test(text) || US_UPPER.test(text)
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

  // A clear sport headline belongs in Sports, wherever the feed filed it.
  if (category !== 'sports' && category !== 'editorial-view' && SPORT_TITLE.test(cleanTitle) && !FREIGHT_WORDS.test(cleanTitle)) return 'sports' as CategorySlug

  // A story filed under Sports with no sport in it at all moves to its region (e.g. a union inquiry).
  if (category === 'sports' && !STRONG_SPORT.test(fullText) && !FREIGHT_WORDS.test(fullText) && !EARNINGS_WORDS.test(fullText)) {
    const sportlessRegion = regionOf(cleanTitle) ?? regionOf(fullText)
    if (sportlessRegion) return sportlessRegion as CategorySlug
  }

  // A celebrity story belongs in Entertainment, not a news region.
  if (REGIONAL.has(category) && CELEBRITY.test(cleanTitle)) return 'entertainment' as CategorySlug

  // Overseas conflict news filed under Business moves to World.
  if ((category === 'small-business' || category === 'business') && !BUSINESS_WORDS.test(cleanTitle.replace(/west bank/gi, '')) && CONFLICT_WORDS.test(cleanTitle) && WORLD.test(fullText)) {
    return 'world' as CategorySlug
  }

  // Freight and company-earnings stories that only *sound* sporty ("earnings season champ", "beat to the punch") leave Sports.
  if (category === 'sports' && !STRONG_SPORT.test(fullText) && (FREIGHT_WORDS.test(fullText) || EARNINGS_WORDS.test(fullText))) {
    return (FREIGHT_WORDS.test(fullText) ? 'trade-logistics' : 'small-business') as CategorySlug
  }

  // A politics or world-affairs headline with no business word in it doesn't belong in Business.
  if ((category === 'small-business' || category === 'business') && !BUSINESS_WORDS.test(cleanTitle) && !FREIGHT_WORDS.test(cleanTitle)) {
    const titleRegion = regionOf(cleanTitle)
    if (titleRegion) return titleRegion as CategorySlug
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

const COMMON_WORDS = new Set(['australia', 'australian', 'zealand', 'government', 'says', 'said', 'police', 'after', 'with', 'from', 'over', 'into', 'their', 'what', 'when', 'will', 'this', 'that', 'have', 'about', 'more', 'live', 'breaking', 'news', 'latest', 'update', 'year', 'years', 'first', 'people'])

function stem(word: string): string {
  return word.replace(/(ings|ing|ed|es|s)$/, '')
}

function keyWords(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= 3 && !COMMON_WORDS.has(word))
      .map(stem),
  )
}

function similarTitles(a: string, b: string): boolean {
  const left = words(a)
  const right = words(b)
  if (!left.size || !right.size) return false
  let shared = 0
  for (const word of left) if (right.has(word)) shared += 1
  if (shared / Math.min(left.size, right.size) >= 0.75) return true
  // Same event from two outlets ("FAA grounds all flights" / "FAA issues ground stop for all flights").
  const keyLeft = keyWords(fixHeadline(a))
  const keyRight = keyWords(fixHeadline(b))
  let keyShared = 0
  for (const word of keyLeft) if (keyRight.has(word)) keyShared += 1
  return keyShared >= 3 && keyShared / Math.min(keyLeft.size, keyRight.size) >= 0.45
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

/* ---------- headline typos and messy feed text ---------- */

// Known typos copied from source headlines (owner request, 14 Nov 2026 health check).
const HEADLINE_FIXES: Array<[RegExp, string]> = [
  [/\b(grounds?|grounded|grounding|cancels?|cancelled|delays?|delayed) all fights\b/gi, '$1 all flights'],
  [/\bfights (grounded|cancelled|delayed|halted)\b/gi, 'flights $1'],
  [/\b(\d{1,2})\. (\d{2}\s?(am|pm))\b/gi, '$1.$2'],
]

export function fixHeadline(title: string): string {
  let fixed = title
  for (const [pattern, replacement] of HEADLINE_FIXES) fixed = fixed.replace(pattern, replacement)
  return fixed
}

/** Removes feed leftovers ("The post … appeared first on …", "Read more") and trims a summary cut off mid-sentence. */
export function cleanSummary(summary: string | null | undefined): string {
  let text = (summary ?? '').replace(/\s+/g, ' ').trim()
  if (!text) return ''
  text = text
    .replace(/\s*The post .{0,300}? appeared first on .{0,80}?(\.|$)/gi, ' ')
    .replace(/\s*(Continue reading|Read more|Read the full story|Click here to read).{0,60}$/i, '')
    .replace(/\s*\[(…|\.\.\.)\]\s*$/, '')
    .replace(/(\d{1,2})\. (\d{2}\s?(am|pm))\b/gi, '$1.$2')
    .trim()
  // Cut off mid-number ("$11.") or mid-sentence: keep only the complete sentences.
  const cutMidNumber = /[$€£]?\d[\d,]*\.$/.test(text)
  const endsCleanly = /[.!?"'’”)]$/.test(text) && !cutMidNumber
  if (!endsCleanly) {
    const body = cutMidNumber ? text.replace(/[$€£]?\d[\d,]*\.$/, '') : text
    const lastStop = Math.max(body.lastIndexOf('. '), body.lastIndexOf('! '), body.lastIndexOf('? '))
    text = lastStop > 60 ? body.slice(0, lastStop + 1) : body.replace(/[\s,;:–-]+$/, '') + '…'
  }
  return text
}
