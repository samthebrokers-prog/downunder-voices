import { NextResponse } from 'next/server'
import { produceNewsBulletin } from '@/lib/radio-broadcast'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

// Runs on the Vercel schedule in vercel.json. Generates the audio ONCE and
// stores it; the radio server plays that single file to every listener.
export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const result = await produceNewsBulletin()
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error('Radio news production failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Radio news failed' },
      { status: 500 },
    )
  }
}
