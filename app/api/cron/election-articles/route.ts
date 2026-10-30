import { NextResponse } from 'next/server'
import { runElectionArticles } from '@/lib/election-articles'

export const maxDuration = 300

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')

  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    // Normally one article per run; the evening catch-up run may write two if earlier runs failed.
    const perthHour = Number(new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Perth', hour: 'numeric', hourCycle: 'h23' }).format(new Date()))
    const result = await runElectionArticles(perthHour >= 20 ? 2 : 1)
    return NextResponse.json({ ok: true, result })
  } catch (error) {
    console.error('Election article generation failed:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Election article generation failed' }, { status: 500 })
  }
}
