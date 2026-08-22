import { NextResponse } from 'next/server'
import { runNewsImport } from '@/lib/importer'
import { runEditorialGenerator } from '@/lib/editorial-generator'

export const maxDuration = 300

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const results = await runNewsImport()

    let editorialRecovery:
      | Awaited<ReturnType<typeof runEditorialGenerator>>
      | { error: string }

    try {
      editorialRecovery = await runEditorialGenerator()
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
