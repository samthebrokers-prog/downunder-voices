import { ImageResponse } from 'next/og'
import { getStoryBySlug } from '@/lib/story-service'

export const runtime = 'edge'

type RouteContext = { params: Promise<{ slug: string }> }

/*
 * Original Downunder Voices artwork for election opinion articles:
 * a ballot-box illustration with the headline. No third-party photos.
 */
export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params
  const race = new URL(request.url).searchParams.get('race') === 'au' ? 'au' : 'nz'
  const story = await getStoryBySlug(slug)
  const title = story?.title || 'Downunder Voices Opinion'

  const theme = race === 'nz'
    ? { bg1: '#0b1530', bg2: '#1e293b', accent: '#dc2626', label: 'NZ ELECTION 2026', tag: 'Aotearoa New Zealand' }
    : { bg1: '#1a0b0b', bg2: '#1f2937', accent: '#e11d48', label: 'AUSTRALIAN POLITICS', tag: 'Australia · Victoria votes 2026' }

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${theme.bg1} 0%, ${theme.bg2} 100%)`, color: 'white', fontFamily: 'Georgia, serif' }}>
        {/* Decorative stripes */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 14, display: 'flex', background: theme.accent }} />
        <div style={{ position: 'absolute', right: -120, top: -120, width: 520, height: 520, borderRadius: 9999, display: 'flex', background: theme.accent, opacity: 0.12 }} />

        {/* Ballot box illustration */}
        <svg width="360" height="360" viewBox="0 0 360 360" style={{ position: 'absolute', right: 70, top: 150 }}>
          <rect x="60" y="150" width="240" height="170" rx="14" fill="#f8fafc" opacity="0.95" />
          <rect x="60" y="150" width="240" height="40" rx="14" fill={theme.accent} />
          <rect x="130" y="162" width="100" height="12" rx="6" fill="#0f172a" />
          <g transform="rotate(-8 180 110)">
            <rect x="120" y="40" width="120" height="140" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="4" />
            <rect x="140" y="70" width="26" height="26" rx="4" fill="none" stroke="#0f172a" strokeWidth="5" />
            <path d="M144 84 L153 93 L172 66" fill="none" stroke={theme.accent} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="176" y="76" width="48" height="8" rx="4" fill="#94a3b8" />
            <rect x="140" y="118" width="26" height="26" rx="4" fill="none" stroke="#0f172a" strokeWidth="5" />
            <rect x="176" y="126" width="48" height="8" rx="4" fill="#94a3b8" />
          </g>
          <text x="180" y="275" textAnchor="middle" fontSize="44" fontWeight="700" fill="#0f172a" fontFamily="Arial">VOTE</text>
        </svg>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'Arial, sans-serif', fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>
            <span style={{ background: theme.accent, padding: '10px 20px', borderRadius: 6 }}>OPINION</span>
            <span style={{ opacity: 0.9 }}>{theme.label}</span>
          </div>
          <div style={{ display: 'flex', maxWidth: 700, fontSize: title.length > 80 ? 46 : 56, lineHeight: 1.12, fontWeight: 700 }}>{title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: 'Arial, sans-serif', fontSize: 25, fontWeight: 700 }}>
            <span>DOWNUNDER VOICES</span>
            <span style={{ opacity: 0.85 }}>{theme.tag}</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
  )
}
