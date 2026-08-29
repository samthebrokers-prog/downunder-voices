import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { runNewsImport } from '@/lib/importer'
import { recoverFreshAutoPublishDrafts } from '@/lib/live-news-recovery'

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const results = await runNewsImport()
    const recovery = await recoverFreshAutoPublishDrafts()

    return NextResponse.json({
      ok: true,
      results,
      recovery,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 },
    )
  }
}
