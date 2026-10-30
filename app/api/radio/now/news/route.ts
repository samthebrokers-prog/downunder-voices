import { NextResponse } from 'next/server'
import { latestBroadcastUrl } from '@/lib/radio-broadcast'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// The radio server (AzuraCast) asks this address for the current news
// audio. It points to the single cached file — no audio is generated here.
export async function GET() {
  try {
    const url = await latestBroadcastUrl('news')
    if (!url) return NextResponse.json({ error: 'No news audio yet' }, { status: 404 })

    // File names are their air time, e.g. 20261031T0100Z.mp3.
    const match = url.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})Z\.mp3$/)
    if (match) {
      const [, y, mo, d, h, mi] = match
      const airTime = Date.UTC(+y, +mo - 1, +d, +h, +mi)
      const ageMinutes = (Date.now() - airTime) / 60_000
      // Don't replay an old file if a scheduled run was missed.
      if (ageMinutes > 20 || ageMinutes < -15) {
        return NextResponse.json({ error: 'No current news audio' }, { status: 404 })
      }
    }

    return NextResponse.redirect(url, { status: 302, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Radio news lookup failed:', error)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
}
