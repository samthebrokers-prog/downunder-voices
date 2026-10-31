import { NextResponse } from 'next/server'
import { produceLankaAnalysis } from '@/lib/lankawitness-analysis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

// Once a day (vercel.json): one new Lanka Witness accountability analysis.
export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  try {
    return NextResponse.json(await produceLankaAnalysis())
  } catch (error) {
    console.error('Lanka Witness analysis failed:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'failed' }, { status: 500 })
  }
}
