import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { runNewsImport } from '@/lib/importer'

export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const results = await runNewsImport()
    return NextResponse.json({ ok: true, results })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 },
    )
  }
}
