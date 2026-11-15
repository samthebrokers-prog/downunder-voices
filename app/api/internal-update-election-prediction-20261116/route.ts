import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'
import { DV_ORIGINALS } from '@/lib/dv-originals'

// One-off (16 Nov 2026): push the expanded election-prediction editorial
// (special-vote history 2017–2023) to the already-published story. Safe to call twice.
export const dynamic = 'force-dynamic'
const SLUG = 'nz-election-prediction-specials-hung-parliament-opportunity-decides-2026'

export async function GET() {
  const a = DV_ORIGINALS.find((x) => x.slug === SLUG)
  if (!a) return NextResponse.json({ ok: false, error: 'article not found' }, { status: 404 })
  try {
    await dbRequest('stories', {
      method: 'PATCH',
      query: `?slug=eq.${encodeURIComponent(SLUG)}`,
      body: { title: a.title, summary: a.summary, community_angle: a.body, image_url: a.imageUrl },
    })
    return NextResponse.json({ ok: true, updated: SLUG })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'update failed' }, { status: 500 })
  }
}
