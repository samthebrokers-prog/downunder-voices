import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import {
  databaseConfigurationSummary,
  dbRequest,
  isDatabaseConfigured,
} from '@/lib/db'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const configuration = databaseConfigurationSummary()
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, configuration, error: 'Database is not configured' },
      { status: 503 },
    )
  }

  try {
    const rows = await dbRequest<Array<{ id: string }>>('stories', {
      query: '?select=id&limit=1',
    })
    return NextResponse.json({ ok: true, configuration, rows: rows.length })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configuration,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    )
  }
}
