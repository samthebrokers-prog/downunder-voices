// Live "Government updates" headlines for the homepage side rails.
// Each agency gets its latest 1–2 news headlines. We try the agency's own RSS
// feed first (when it has one) and then a Google News search for that agency.
// Results are cached for 6 hours, so the boxes refresh several times a day
// with no AI or API cost. If every source fails, the box simply shows the
// agency's normal description and link, so nothing ever breaks.

export type GovHeadline = { title: string; link: string; source: string; publishedAt: string }

export type GovAgency = {
  name: string
  tip: string
  url: string
  // Words that must appear in a Google News headline for it to count, so we
  // only show stories that are really about this agency.
  keywords: RegExp
  // Google News search (without the time window), e.g. '"Inland Revenue"'.
  query: string
  country: 'AU' | 'NZ'
  // Optional official RSS feeds, tried first.
  feeds?: string[]
}

const SIX_HOURS = 6 * 60 * 60
const MAX_AGE_DAYS = 30

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#8217;|&rsquo;/gi, '’')
    .replace(/&#8216;|&lsquo;/gi, '‘')
    .replace(/&#8211;|&ndash;/gi, '–')
    .replace(/&#8212;|&mdash;/gi, '—')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
}

function clean(value: string) {
  return decode(decode(value)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))
  return match?.[1] ? clean(match[1]) : ''
}

function hostLabel(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

async function readFeed(url: string, defaultSource: string): Promise<GovHeadline[]> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'DownunderVoicesBot/1.0 (+https://downundervoices.com)' },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: SIX_HOURS },
  })
  if (!response.ok) throw new Error(`Feed returned ${response.status}`)
  const xml = await response.text()
  const blocks = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(m => m[1])
  const atom = blocks.length ? [] : [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map(m => m[1])
  return [...blocks, ...atom]
    .map(block => {
      let title = tag(block, 'title')
      let link = tag(block, 'link')
      if (!link || link.includes('<')) link = block.match(/<link\b[^>]*href=["']([^"']+)["']/i)?.[1] ?? ''
      let source = tag(block, 'source') || defaultSource
      // Google News titles end with " - Publisher"; keep the headline clean.
      if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3)).trim()
      const rawDate = tag(block, 'pubDate') || tag(block, 'published') || tag(block, 'updated') || tag(block, 'dc:date')
      const date = rawDate ? new Date(rawDate) : null
      return {
        title,
        link: decode(link).trim(),
        source,
        publishedAt: date && !Number.isNaN(date.valueOf()) ? date.toISOString() : '',
      }
    })
    .filter(item => item.title && /^https?:\/\//i.test(item.link))
}

function isRecent(item: GovHeadline) {
  if (!item.publishedAt) return true
  return Date.now() - new Date(item.publishedAt).valueOf() < MAX_AGE_DAYS * 24 * 60 * 60 * 1000
}

function newestFirst(a: GovHeadline, b: GovHeadline) {
  return (b.publishedAt ? new Date(b.publishedAt).valueOf() : 0) - (a.publishedAt ? new Date(a.publishedAt).valueOf() : 0)
}

function googleNewsUrl(agency: GovAgency) {
  const region = agency.country === 'AU' ? { hl: 'en-AU', gl: 'AU', ceid: 'AU:en' } : { hl: 'en-NZ', gl: 'NZ', ceid: 'NZ:en' }
  const q = encodeURIComponent(`${agency.query} when:14d`)
  return `https://news.google.com/rss/search?q=${q}&hl=${region.hl}&gl=${region.gl}&ceid=${region.ceid}`
}

export async function latestForAgency(agency: GovAgency, limit = 2): Promise<GovHeadline[]> {
  // 1. The agency's own feed(s).
  for (const feed of agency.feeds ?? []) {
    try {
      const items = (await readFeed(feed, agency.name)).filter(isRecent).sort(newestFirst)
      if (items.length) return items.slice(0, limit)
    } catch {
      // try the next source
    }
  }
  // 2. Google News, headlines that actually mention the agency.
  try {
    const seen = new Set<string>()
    const items = (await readFeed(googleNewsUrl(agency), ''))
      .filter(item => agency.keywords.test(item.title))
      .filter(isRecent)
      .filter(item => {
        const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').slice(0, 60)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .map(item => ({ ...item, source: item.source || hostLabel(item.link) }))
      .sort(newestFirst)
    return items.slice(0, limit)
  } catch {
    return []
  }
}

export const AU_AGENCIES: GovAgency[] = [
  {
    name: 'Services Australia (Centrelink)', tip: 'Payments, Medicare & Centrelink updates', url: 'https://www.servicesaustralia.gov.au/', country: 'AU',
    query: '"Services Australia" OR Centrelink', keywords: /services australia|centrelink|medicare/i,
  },
  {
    name: 'Australian Taxation Office', tip: 'Tax time, deadlines & news', url: 'https://www.ato.gov.au/', country: 'AU',
    feeds: ['https://www.ato.gov.au/rss.aspx?category=1837', 'https://www.ato.gov.au/rss/all-new-information.xml'],
    query: '"Australian Taxation Office" OR ATO tax', keywords: /\bATO\b|taxation office|tax office/i,
  },
  {
    name: 'Fair Work Ombudsman', tip: 'Pay rates & work rights', url: 'https://www.fairwork.gov.au/', country: 'AU',
    query: '"Fair Work Ombudsman" OR "Fair Work Commission"', keywords: /fair work/i,
  },
  {
    name: 'Australian Border Force', tip: 'Travel & import updates', url: 'https://www.abf.gov.au/', country: 'AU',
    query: '"Australian Border Force"', keywords: /border force|\bABF\b/i,
  },
  {
    name: 'Home Affairs (Visas)', tip: 'Visas & citizenship', url: 'https://immi.homeaffairs.gov.au/', country: 'AU',
    query: '"Home Affairs" visa OR citizenship Australia', keywords: /visa|citizenship|home affairs|migration/i,
  },
]

export const NZ_AGENCIES: GovAgency[] = [
  {
    name: 'Inland Revenue (IRD)', tip: 'Tax, KiwiSaver & Working for Families', url: 'https://www.ird.govt.nz/', country: 'NZ',
    query: '"Inland Revenue" OR IRD New Zealand', keywords: /inland revenue|\bIRD\b|kiwisaver/i,
  },
  {
    name: 'Work and Income', tip: 'Benefits, NZ Super & hardship help', url: 'https://www.workandincome.govt.nz/', country: 'NZ',
    query: '"Work and Income" OR "Ministry of Social Development" OR "NZ Super"', keywords: /work and income|social development|\bMSD\b|nz super|superannuation|benefit/i,
  },
  {
    name: 'Immigration New Zealand', tip: 'Visa changes & news', url: 'https://www.immigration.govt.nz/', country: 'NZ',
    query: '"Immigration New Zealand" OR "Immigration NZ" visa', keywords: /immigration|visa|residence|residency/i,
  },
  {
    name: 'New Zealand Customs', tip: 'Travel & import updates', url: 'https://www.customs.govt.nz/', country: 'NZ',
    query: '"New Zealand Customs" OR "NZ Customs" OR "Customs Service"', keywords: /customs/i,
  },
]
