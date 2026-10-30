import { NextResponse } from 'next/server'
import { CAPS, loadLedger } from '@/lib/radio-budget'
import { radioStatus } from '@/lib/radio-broadcast'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// A read-only summary of radio spending and the programme library.
// Makes no AI calls and costs nothing to view.
export async function GET() {
  try {
    const [ledger, status] = await Promise.all([loadLedger(), radioStatus()])
    const round = (n: number) => Math.round(n * 100) / 100
    return NextResponse.json(
      {
        spending: {
          todayUsd: round(ledger.daySpent),
          thisMonthUsd: round(ledger.monthSpent),
          monthlyCapUsd: CAPS.monthlyUsd,
          dailyCapUsd: CAPS.dailyUsd,
          failedCallsToday: ledger.failures,
          generationPausedToday: ledger.failures >= CAPS.failuresPerDay,
          lastDays: Object.fromEntries(Object.entries(ledger.days).slice(-14).map(([d, v]) => [d, round(v)])),
          recent: ledger.recent.slice(-12).map((e) => ({ at: e.at, kind: e.kind, usd: e.usd, note: e.note })),
        },
        ...status,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('Radio status failed:', error)
    return NextResponse.json({ error: 'Status unavailable' }, { status: 500 })
  }
}
