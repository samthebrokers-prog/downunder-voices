import { NextResponse } from 'next/server'
import { runNewsImport } from '@/lib/importer'
import { runEditorialGeneratorV2 } from '@/lib/editorial-generator-v2'
import { recoverFreshAutoPublishDrafts } from '@/lib/live-news-recovery'

export const maxDuration = 300

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')

  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const results = await runNewsImport()
    const recovery = await recoverFreshAutoPublishDrafts()

    let editorialRecovery:
      | Awaited<ReturnType<typeof runEditorialGeneratorV2>>
      | { error: string }

    try {
      editorialRecovery = await runEditorialGeneratorV2()
    } catch (error) {
      editorialRecovery = {
        error:
          error instanceof Error
            ? error.message
            : 'Editorial recovery failed',
      }
    }

    return NextResponse.json({
      ok: true,
      results,
      recovery,
      editorialRecovery,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 },
    )
  }
}
