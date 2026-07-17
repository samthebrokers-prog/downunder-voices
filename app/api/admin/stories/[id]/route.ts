import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { dbRequest } from '@/lib/db'
import { categories } from '@/lib/news-data'
import { cleanMultiline, cleanText, validHttpUrl } from '@/lib/validation'

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await context.params
  const body = await request.json()
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.status !== undefined) {
    if (!['draft', 'published', 'archived'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    update.status = body.status
    if (body.status === 'published') update.published_at = new Date().toISOString()
  }

  if (body.title !== undefined) {
    const title = cleanText(body.title, 220)
    const category = cleanText(body.category, 40)
    const summary = cleanMultiline(body.summary, 1200)
    const sourceName = cleanText(body.sourceName, 160)
    const sourceUrl = cleanText(body.sourceUrl, 1000)
    const imageUrl = cleanText(body.imageUrl, 1000)
    const communityAngle = cleanMultiline(body.communityAngle, 1200)
    const author = cleanText(body.author, 120)

    if (!title || !summary || !sourceName || !validHttpUrl(sourceUrl) || !categories.some((c) => c.slug === category)) {
      return NextResponse.json({ error: 'Please complete the required fields correctly.' }, { status: 400 })
    }
    Object.assign(update, {
      title,
      category,
      summary,
      source_name: sourceName,
      source_url: sourceUrl || 'https://downundervoices.com',
      image_url: imageUrl || null,
      community_angle: communityAngle || null,
      author: author || null,
    })
  }

  await dbRequest('stories', {
    method: 'PATCH',
    query: `?id=eq.${encodeURIComponent(id)}`,
    body: update,
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await context.params
  await dbRequest('stories', { method: 'DELETE', query: `?id=eq.${encodeURIComponent(id)}` })
  return NextResponse.json({ ok: true })
}
