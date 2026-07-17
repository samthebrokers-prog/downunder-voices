import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { dbRequest } from '@/lib/db'
import { categories } from '@/lib/news-data'
import { cleanText, validHttpUrl } from '@/lib/validation'

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const body = await request.json()
  const name = cleanText(body.name, 160)
  const feedUrl = cleanText(body.feedUrl, 1000)
  const siteUrl = cleanText(body.siteUrl, 1000)
  const defaultCategory = cleanText(body.defaultCategory, 40)
  const sourceType = body.sourceType === 'official' ? 'official' : 'commercial'
  if (!name || !validHttpUrl(feedUrl) || !categories.some((c) => c.slug === defaultCategory)) {
    return NextResponse.json({ error: 'Please enter a name, valid feed URL and category.' }, { status: 400 })
  }
  await dbRequest('news_sources', {
    method: 'POST',
    body: {
      name,
      feed_url: feedUrl,
      site_url: validHttpUrl(siteUrl) && siteUrl ? siteUrl : null,
      default_category: defaultCategory,
      source_type: sourceType,
      auto_publish: sourceType === 'official',
      active: true,
    },
  })
  return NextResponse.json({ ok: true })
}
