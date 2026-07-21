import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { dbRequest } from '@/lib/db'
import { categories } from '@/lib/news-data'
import { uniqueSlug } from '@/lib/slug'
import { cleanMultiline, cleanText, validHttpUrl } from '@/lib/validation'

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const body = await request.json()
  const title = cleanText(body.title, 220)
  const category = cleanText(body.category, 40)
  const summary = cleanMultiline(body.summary, 1200)
  const sourceName = cleanText(body.sourceName, 160)
  const sourceUrl = cleanText(body.sourceUrl, 1000)
  const imageUrl = cleanText(body.imageUrl, 1000)
  const communityAngle = cleanMultiline(body.communityAngle, 1200)
  const author = cleanText(body.author, 120)
  const status = body.status === 'published' ? 'published' : 'draft'

  if (!title || !summary || !sourceName || !validHttpUrl(sourceUrl) || !categories.some((c) => c.slug === category)) {
    return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 })
  }
  const rows = await dbRequest<Array<{ id: string }>>('stories', {
    method: 'POST',
    body: {
      slug: uniqueSlug(title, sourceUrl || `${title}-${Date.now()}`),
      title,
      category,
      summary,
      source_name: sourceName,
      source_url: sourceUrl || 'https://downundervoices.com',
      image_url: imageUrl || null,
      community_angle: communityAngle || null,
      author: author || null,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
      import_method: 'manual',
    },
    prefer: 'return=representation',
  })
  return NextResponse.json({ ok: true, id: rows[0]?.id })
}
