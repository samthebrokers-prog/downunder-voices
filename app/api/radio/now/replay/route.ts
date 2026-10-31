import { NextResponse } from 'next/server'
import { nextReplayUrl } from '@/lib/radio-broadcast'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// The radio server asks this address at :15 and :45 for a replay from the
// programme library. Nothing is generated here — it points to a recorded file.
export async function GET() {
  try {
    const url = await nextReplayUrl()
    if (!url) return NextResponse.json({ error: 'No replay available' }, { status: 404 })
    return NextResponse.redirect(url, { status: 302, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Radio replay lookup failed:', error)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
}
