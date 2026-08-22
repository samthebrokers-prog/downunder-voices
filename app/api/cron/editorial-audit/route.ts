import { NextResponse } from 'next/server'
import { runEditorialAudit } from '@/lib/editorial-audit'

export const maxDuration = 300

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')

  if (
    !process.env.CRON_SECRET ||
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const audit = await runEditorialAudit()
    return NextResponse.json({ ok: audit.ok, audit })
  } catch (error) {
    console.error('Editorial audit failed:', error)
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Editorial audit failed',
      },
      { status: 500 },
    )
  }
}
