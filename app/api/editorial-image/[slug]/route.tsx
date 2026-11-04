import { ImageResponse } from 'next/og'
import { getStoryBySlug } from '@/lib/story-service'

export const runtime = 'edge'

type RouteContext = { params: Promise<{ slug: string }> }

/*
 * Original Downunder Voices artwork for every "From the Editor" editorial.
 * Owner rule (Nov 2026): an editorial must ALWAYS have a picture, and it is
 * always our own illustration, never another outlet's photo. The drawing and
 * colours are picked from the editorial's topic so each one looks different.
 */

type Motif = 'house' | 'money' | 'health' | 'school' | 'vote' | 'ship' | 'power' | 'justice' | 'globe' | 'council'

const MOTIFS: Array<[Motif, RegExp]> = [
  ['council', /\b(council|rates|ratepayer|mayor|local government)\b/i],
  ['house', /\b(housing|house|home|rent|renters|mortgage|property|landlord|tenant)\b/i],
  ['health', /\b(health|hospital|doctor|nurse|gp|medical|patients?|mental health|pharmac)\b/i],
  ['school', /\b(school|education|teacher|students?|university|tertiary|childcare)\b/i],
  ['vote', /\b(election|vote|voters|ballot|candidate|campaign|parliament|mp|labour|national|liberal|greens|coalition)\b/i],
  ['ship', /\b(trade|tariff|shipping|port|export|import|freight|customs|supply chain)\b/i],
  ['power', /\b(energy|electricity|power|fuel|petrol|climate|emissions|gas)\b/i],
  ['justice', /\b(court|justice|police|crime|law|judge|prison|sentenc)\b/i],
  ['money', /\b(cost of living|inflation|wage|budget|tax|price|prices|spending|interest rate|economy|jobs|benefit|pension)\b/i],
]

const THEMES = [
  { bg1: '#3f0d0d', bg2: '#111827', accent: '#dc2626' },
  { bg1: '#0b1a33', bg2: '#1e293b', accent: '#ef4444' },
  { bg1: '#1c1917', bg2: '#44403c', accent: '#f97316' },
  { bg1: '#052e2b', bg2: '#0f172a', accent: '#f59e0b' },
  { bg1: '#1e1b4b', bg2: '#0f172a', accent: '#e11d48' },
]

function hash(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

function pickMotif(text: string, slug: string): Motif {
  const found = MOTIFS.find(([, pattern]) => pattern.test(text))
  if (found) return found[0]
  const spare: Motif[] = ['globe', 'money', 'council', 'vote']
  return spare[hash(slug) % spare.length]
}

function regionTag(text: string) {
  if (/\b(new zealand|aotearoa|auckland|wellington|christchurch|nz)\b/i.test(text)) return 'Aotearoa New Zealand'
  if (/\b(australia|australian|sydney|melbourne|brisbane|perth|adelaide|canberra|nsw|victoria|queensland)\b/i.test(text)) return 'Australia'
  return 'Australia · New Zealand · World'
}

function Drawing({ motif, accent }: { motif: Motif; accent: string }) {
  const paper = '#f8fafc'
  const ink = '#0f172a'
  const grey = '#94a3b8'
  switch (motif) {
    case 'house':
      return (
        <svg width="380" height="380" viewBox="0 0 380 380">
          <path d="M60 190 L190 80 L320 190 Z" fill={accent} />
          <rect x="90" y="185" width="200" height="140" fill={paper} />
          <rect x="165" y="245" width="50" height="80" fill={ink} />
          <rect x="108" y="210" width="40" height="36" fill={grey} />
          <rect x="232" y="210" width="40" height="36" fill={grey} />
          <rect x="250" y="95" width="26" height="60" fill={paper} />
          <text x="300" y="80" fontSize="64" fontWeight="700" fill={paper} fontFamily="Arial">$</text>
        </svg>
      )
    case 'money':
      return (
        <svg width="380" height="380" viewBox="0 0 380 380">
          <rect x="70" y="250" width="240" height="70" rx="10" fill={paper} />
          <rect x="70" y="210" width="240" height="40" rx="8" fill={grey} />
          <path d="M80 110 L150 160 L210 120 L300 70" fill="none" stroke={accent} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M268 64 L306 66 L300 102" fill="none" stroke={accent} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="190" cy="285" r="24" fill="none" stroke={ink} strokeWidth="6" />
          <text x="179" y="297" fontSize="34" fontWeight="700" fill={ink} fontFamily="Arial">$</text>
        </svg>
      )
    case 'health':
      return (
        <svg width="380" height="380" viewBox="0 0 380 380">
          <rect x="70" y="130" width="240" height="190" rx="10" fill={paper} />
          <rect x="160" y="60" width="60" height="70" fill={paper} />
          <rect x="172" y="160" width="36" height="110" rx="4" fill={accent} />
          <rect x="135" y="197" width="110" height="36" rx="4" fill={accent} />
          <rect x="95" y="285" width="190" height="10" rx="5" fill={grey} />
        </svg>
      )
    case 'school':
      return (
        <svg width="380" height="380" viewBox="0 0 380 380">
          <path d="M40 150 L190 80 L340 150 L190 220 Z" fill={paper} />
          <path d="M100 180 L100 260 Q190 310 280 260 L280 180 L190 222 Z" fill={grey} />
          <path d="M320 160 L320 260" stroke={accent} strokeWidth="10" strokeLinecap="round" />
          <circle cx="320" cy="270" r="16" fill={accent} />
        </svg>
      )
    case 'vote':
      return (
        <svg width="380" height="380" viewBox="0 0 380 380">
          <rect x="70" y="170" width="240" height="160" rx="14" fill={paper} />
          <rect x="70" y="170" width="240" height="40" rx="14" fill={accent} />
          <rect x="140" y="182" width="100" height="12" rx="6" fill={ink} />
          <g transform="rotate(-8 190 120)">
            <rect x="130" y="50" width="120" height="140" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="4" />
            <path d="M154 94 L163 103 L182 76" fill="none" stroke={accent} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="186" y="86" width="48" height="8" rx="4" fill={grey} />
            <rect x="150" y="130" width="84" height="8" rx="4" fill={grey} />
          </g>
        </svg>
      )
    case 'ship':
      return (
        <svg width="380" height="380" viewBox="0 0 380 380">
          <rect x="110" y="150" width="60" height="50" fill={accent} />
          <rect x="175" y="150" width="60" height="50" fill={paper} />
          <rect x="240" y="150" width="50" height="50" fill={grey} />
          <rect x="140" y="98" width="60" height="50" fill={paper} />
          <rect x="205" y="98" width="60" height="50" fill={accent} />
          <path d="M50 205 L330 205 L295 280 L85 280 Z" fill={ink} stroke={paper} strokeWidth="5" />
          <path d="M30 310 Q70 290 110 310 T190 310 T270 310 T350 310" fill="none" stroke={paper} strokeWidth="8" strokeLinecap="round" />
        </svg>
      )
    case 'power':
      return (
        <svg width="380" height="380" viewBox="0 0 380 380">
          <circle cx="190" cy="190" r="130" fill={paper} />
          <path d="M210 70 L130 205 L188 205 L165 315 L255 165 L198 165 Z" fill={accent} />
        </svg>
      )
    case 'justice':
      return (
        <svg width="380" height="380" viewBox="0 0 380 380">
          <rect x="182" y="70" width="16" height="230" fill={paper} />
          <rect x="120" y="300" width="140" height="22" rx="6" fill={paper} />
          <rect x="80" y="100" width="220" height="12" rx="6" fill={paper} />
          <path d="M95 112 L60 200 L130 200 Z" fill="none" stroke={paper} strokeWidth="5" />
          <path d="M285 112 L250 200 L320 200 Z" fill="none" stroke={paper} strokeWidth="5" />
          <path d="M55 200 Q95 240 135 200 Z" fill={accent} />
          <path d="M245 200 Q285 240 325 200 Z" fill={accent} />
        </svg>
      )
    case 'council':
      return (
        <svg width="380" height="380" viewBox="0 0 380 380">
          <path d="M60 140 L190 70 L320 140 Z" fill={paper} />
          <rect x="70" y="140" width="240" height="18" fill={grey} />
          <rect x="90" y="165" width="26" height="120" fill={paper} />
          <rect x="145" y="165" width="26" height="120" fill={paper} />
          <rect x="209" y="165" width="26" height="120" fill={paper} />
          <rect x="264" y="165" width="26" height="120" fill={paper} />
          <rect x="60" y="290" width="260" height="24" fill={paper} />
          <rect x="230" y="40" width="110" height="64" rx="8" fill={accent} />
          <text x="246" y="84" fontSize="30" fontWeight="700" fill="#ffffff" fontFamily="Arial">RATES</text>
        </svg>
      )
    default:
      return (
        <svg width="380" height="380" viewBox="0 0 380 380">
          <circle cx="190" cy="190" r="130" fill="none" stroke={paper} strokeWidth="8" />
          <ellipse cx="190" cy="190" rx="60" ry="130" fill="none" stroke={paper} strokeWidth="6" />
          <path d="M60 190 L320 190 M80 125 L300 125 M80 255 L300 255" stroke={paper} strokeWidth="6" />
          <circle cx="262" cy="262" r="26" fill={accent} />
        </svg>
      )
  }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params
  const story = await getStoryBySlug(slug).catch(() => null)
  const title = story?.title || 'From the Editor'
  const text = `${title} ${(story?.summary || '').slice(0, 600)}`
  const motif = pickMotif(text, slug)
  const theme = THEMES[hash(slug) % THEMES.length]
  const tag = regionTag(text)

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${theme.bg1} 0%, ${theme.bg2} 100%)`, color: 'white', fontFamily: 'Georgia, serif' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 14, display: 'flex', background: theme.accent }} />
        <div style={{ position: 'absolute', right: -140, top: -140, width: 560, height: 560, borderRadius: 9999, display: 'flex', background: theme.accent, opacity: 0.14 }} />
        <div style={{ position: 'absolute', right: 50, top: 125, display: 'flex' }}>
          <Drawing motif={motif} accent={theme.accent} />
        </div>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'Arial, sans-serif', fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>
            <span style={{ background: theme.accent, padding: '10px 20px', borderRadius: 6 }}>FROM THE EDITOR</span>
          </div>
          <div style={{ display: 'flex', maxWidth: 680, fontSize: title.length > 80 ? 44 : 54, lineHeight: 1.12, fontWeight: 700 }}>{title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: 'Arial, sans-serif', fontSize: 25, fontWeight: 700 }}>
            <span>DOWNUNDER VOICES</span>
            <span style={{ opacity: 0.85 }}>{tag}</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
  )
}
