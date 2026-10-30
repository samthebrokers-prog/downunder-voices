import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { runElectionArticles } from '@/lib/election-articles'

export const maxDuration = 300

// Lets a signed-in admin generate the day's election articles on demand.
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const result = await runElectionArticles(1)
    return NextResponse.json({ ok: true, result })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Election article generation failed' }, { status: 500 })
  }
}
