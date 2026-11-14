import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'
import { DV_ORIGINALS } from '@/lib/dv-originals'

// Inserts Downunder Voices original articles from lib/dv-originals.ts that are
// not in the database yet. Only adds; never edits or deletes. Safe to call repeatedly.
export const dynamic = 'force-dynamic'

export async function GET() {
  const created: string[] = []
  const existing: string[] = []
  const failed: { slug: string; error: string }[] = []

  // Only the newest entries need checking; older ones are already in the database.
  for (const a of DV_ORIGINALS.slice(0, 15)) {
    try {
      const found = await dbRequest<Array<{ id: string }>>('stories', {
        query: `?select=id&slug=eq.${encodeURIComponent(a.slug)}&limit=1`,
      })
      if (found[0]) {
        existing.push(a.slug)
        continue
      }
      await dbRequest('stories', {
        method: 'POST',
        body: {
          slug: a.slug,
          title: a.title,
          category: a.category,
          summary: a.summary,
          community_angle: a.body,
          image_url: a.imageUrl,
          source_name: 'Downunder Voices Original Analysis',
          source_url: `https://www.downundervoices.com/story/${a.slug}`, // column is NOT NULL
          author: a.author,
          status: 'published',
          published_at: a.publishedAt,
          import_method: 'manual',
        },
        prefer: 'return=minimal',
      })
      created.push(a.slug)
    } catch (error) {
      failed.push({ slug: a.slug, error: error instanceof Error ? error.message : 'insert failed' })
    }
  }

  return NextResponse.json({ ok: failed.length === 0, created, existing: existing.length, failed }, { status: failed.length ? 500 : 200 })
}
