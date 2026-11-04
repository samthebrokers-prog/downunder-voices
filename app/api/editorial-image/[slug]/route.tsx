import { ImageResponse } from 'next/og'
import { getStoryBySlug } from '@/lib/story-service'

export const runtime = 'edge'

type RouteContext = { params: Promise<{ slug: string }> }

/*
 * Picture for every "From the Editor" editorial (owner rule, Nov 2026: an
 * editorial must ALWAYS have a picture, and it is our own artwork, never
 * another outlet's photo). Owner feedback 4 Nov 2026: cartoon clip-art looked
 * like "a day care school notice", so this is a plain, serious newspaper
 * opinion-column panel: dark ground, red quotation mark, topic and region.
 * The headline is not repeated here because it already sits beside/below it.
 */

const TOPICS: Array<[string, RegExp]> = [
  ['Councils & Rates', /\b(council|councillors?|rates|ratepayers?|mayor|local government)\b/i],
  ['Housing', /\b(housing|house prices|homes?|rent|renters|mortgage|property|landlords?|tenants?)\b/i],
  ['Health', /\b(health|hospitals?|doctors?|nurses?|gp|medical|patients?|mental health|pharmac)\b/i],
  ['Education', /\b(schools?|education|teachers?|students?|university|tertiary|childcare)\b/i],
  ['Politics', /\b(election|vote|voters|ballot|candidates?|campaign|parliament|mp|minister|government)\b/i],
  ['Trade', /\b(trade|tariffs?|shipping|ports?|exports?|imports?|freight|customs|supply chain)\b/i],
  ['Energy & Climate', /\b(energy|electricity|power prices|fuel|petrol|climate|emissions|gas)\b/i],
  ['Justice', /\b(court|justice|police|crime|judge|prison|sentenc\w*)\b/i],
  ['Jobs & Economy', /\b(jobs|unemployment|labour market|wages?|workers|economy|recession)\b/i],
  ['Cost of Living', /\b(cost of living|inflation|prices|budget|tax|spending|interest rates?|benefits?|pension)\b/i],
  ['Environment', /\b(environment|wildlife|conservation|farmers?|farming|dingoes|cane toads?|biosecurity)\b/i],
  ['Technology', /\b(technology|cyber|artificial intelligence|ai|data|online|social media)\b/i],
]

// Search words for a real photo for each topic.
const PHOTO_QUERIES: Record<string, string> = {
  'Councils & Rates': 'town hall',
  Housing: 'suburban houses street',
  Health: 'hospital ward',
  Education: 'school classroom',
  Politics: 'parliament building',
  Trade: 'container port ship',
  'Energy & Climate': 'power lines electricity',
  Justice: 'courthouse',
  'Jobs & Economy': 'factory workers',
  'Cost of Living': 'supermarket aisle',
  Environment: 'australian outback farm',
  Technology: 'computer server room',
}
const REGION_QUERIES: Record<string, string> = {
  'New Zealand': 'auckland skyline',
  Australia: 'sydney skyline',
  World: 'city skyline night',
}

function hash(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

// Owner request (4 Nov 2026): editorials need real pictures. Pick a real
// photo from Wikimedia Commons that matches the topic. Only public-domain /
// CC0 photos are used, so no credit line is legally needed (credit is still
// given in the site footer). No account or key is needed. Different
// editorials on the same topic get different photos. Returns null if nothing
// suitable is found, and the plain opinion panel is shown instead.
async function commonsPhoto(query: string, slug: string): Promise<string | null> {
  try {
    const api = new URL('https://commons.wikimedia.org/w/api.php')
    api.search = new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrsearch: `${query} filetype:bitmap`,
      gsrnamespace: '6',
      gsrlimit: '40',
      prop: 'imageinfo',
      iiprop: 'url|size|mime|extmetadata',
      iiurlwidth: '1200',
      origin: '*',
    }).toString()
    const res = await fetch(api.toString(), {
      headers: { 'Api-User-Agent': 'DownunderVoices/1.0 (https://www.downundervoices.com)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    type Info = { thumburl?: string; width?: number; height?: number; mime?: string; extmetadata?: Record<string, { value?: string }> }
    const data = (await res.json()) as { query?: { pages?: Record<string, { title?: string; imageinfo?: Info[] }> } }
    const photos = Object.values(data.query?.pages ?? {})
      .map((page) => page.imageinfo?.[0])
      .filter((info): info is Info => {
        if (!info?.thumburl || info.mime !== 'image/jpeg') return false
        if (!info.width || !info.height || info.width < 1200 || info.width < info.height * 1.25) return false
        const licence = `${info.extmetadata?.LicenseShortName?.value ?? ''} ${info.extmetadata?.License?.value ?? ''}`.toLowerCase()
        return /public domain|\bpd\b|cc0|pd-/.test(licence)
      })
    if (!photos.length) return null
    return photos[hash(slug) % photos.length].thumburl ?? null
  } catch {
    return null
  }
}

function topicOf(text: string) {
  return TOPICS.find(([, pattern]) => pattern.test(text))?.[0] ?? 'Commentary'
}

function regionOf(text: string) {
  if (/\b(new zealand|aotearoa|auckland|wellington|christchurch|dunedin|hamilton|tauranga|nz)\b/i.test(text)) return 'New Zealand'
  if (/\b(australia|australian|sydney|melbourne|brisbane|perth|adelaide|canberra|hobart|darwin|nsw|victoria|queensland|tasmania)\b/i.test(text)) return 'Australia'
  return 'World'
}

// A proper newspaper serif (Playfair Display). If it can't be loaded the
// picture still renders in the default font.
async function loadSerif(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&text=${encodeURIComponent(text)}`)).text()
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
    if (!url) return null
    const res = await fetch(url)
    return res.ok ? await res.arrayBuffer() : null
  } catch {
    return null
  }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params
  const story = await getStoryBySlug(slug).catch(() => null)
  const text = `${story?.title || ''} ${(story?.summary || '').slice(0, 600)}`
  const topic = topicOf(text)
  const region = regionOf(text)

  const photo = (await commonsPhoto(PHOTO_QUERIES[topic] ?? REGION_QUERIES[region], slug))
    ?? (PHOTO_QUERIES[topic] ? await commonsPhoto(REGION_QUERIES[region], slug) : null)
  if (photo) {
    return new Response(null, {
      status: 302,
      headers: { Location: photo, 'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=2592000' },
    })
  }

  // No photo available: plain newspaper opinion panel instead.

  const serifText = `“${topic}Downunder Voices`
  const serif = await loadSerif(serifText)
  const serifFamily = serif ? 'Playfair' : 'serif'

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#15171a', color: '#f5f1e8' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 14, height: '100%', display: 'flex', background: '#b91c1c' }} />
        <div style={{ position: 'absolute', left: 150, right: 150, top: 120, height: 2, display: 'flex', background: '#3a3d42' }} />
        <div style={{ position: 'absolute', left: 150, right: 150, bottom: 120, height: 2, display: 'flex', background: '#3a3d42' }} />

        <div style={{ position: 'absolute', right: 150, top: 64, display: 'flex', fontFamily: 'sans-serif', fontSize: 22, letterSpacing: 4, color: '#9ca3af' }}>
          FROM THE EDITOR
        </div>

        <div style={{ position: 'absolute', left: 135, top: 105, display: 'flex', fontFamily: serifFamily, fontSize: 420, lineHeight: 1, color: '#b91c1c' }}>
          “
        </div>

        <div style={{ position: 'absolute', left: 470, right: 150, top: 210, bottom: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', fontFamily: serifFamily, fontSize: topic.length > 14 ? 76 : 92, fontWeight: 700, lineHeight: 1.05 }}>{topic}</div>
          <div style={{ display: 'flex', marginTop: 26, width: 90, height: 4, background: '#dc2626' }} />
          <div style={{ display: 'flex', marginTop: 24, fontFamily: 'sans-serif', fontSize: 28, letterSpacing: 5, color: '#d1d5db' }}>{region.toUpperCase()}</div>
        </div>

        <div style={{ position: 'absolute', left: 150, bottom: 54, display: 'flex', fontFamily: serifFamily, fontSize: 34, fontWeight: 700 }}>
          Downunder Voices
        </div>
        <div style={{ position: 'absolute', right: 150, bottom: 60, display: 'flex', fontFamily: 'sans-serif', fontSize: 18, letterSpacing: 3, color: '#9ca3af' }}>
          AUSTRALIA · NEW ZEALAND · WORLD
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: serif ? [{ name: 'Playfair', data: serif, weight: 700, style: 'normal' }] : undefined,
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    },
  )
}
