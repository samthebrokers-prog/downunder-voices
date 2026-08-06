import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'
import { categories } from '@/lib/news-data'
import { uniqueSlug } from '@/lib/slug'
import {
  cleanMultiline,
  cleanText,
  validHttpUrl,
} from '@/lib/validation'

export async function POST(request: Request) {
  const auth = request.headers.get('authorization')
  const publishSecret = process.env.PUBLISH_SECRET

  if (
    !publishSecret ||
    auth !== `Bearer ${publishSecret}`
  ) {
    return NextResponse.json(
      { error: 'Unauthorised' },
      { status: 401 },
    )
  }

  try {
    const body = await request.json()

    const title = cleanText(body.title, 220)
    const category = cleanText(body.category, 40)
    const summary = cleanMultiline(body.summary, 1200)
    const sourceName = cleanText(
      body.sourceName || 'Downunder Voices',
      160,
    )
    const sourceUrl = cleanText(
      body.sourceUrl || 'https://downundervoices.com',
      1000,
    )
    const imageUrl = cleanText(body.imageUrl, 1000)
    const communityAngle = cleanMultiline(
      body.communityAngle,
      1200,
    )
    const author = cleanText(
      body.author || 'Downunder Voices Editorial',
      120,
    )

    const status =
      body.status === 'draft'
        ? 'draft'
        : 'published'

    if (!title || !summary) {
      return NextResponse.json(
        { error: 'Title and summary are required.' },
        { status: 400 },
      )
    }

    if (!categories.some((item) => item.slug === category)) {
      return NextResponse.json(
        { error: 'Invalid category.' },
        { status: 400 },
      )
    }

    if (!validHttpUrl(sourceUrl)) {
      return NextResponse.json(
        { error: 'Invalid source URL.' },
        { status: 400 },
      )
    }

    if (imageUrl && !validHttpUrl(imageUrl)) {
      return NextResponse.json(
        { error: 'Invalid image URL.' },
        { status: 400 },
      )
    }

    const rows = await dbRequest<Array<{ id: string; slug: string }>>(
      'stories',
      {
        method: 'POST',
        body: {
          slug: uniqueSlug(
            title,
            sourceUrl || `${title}-${Date.now()}`,
          ),
          title,
          category,
          summary,
          source_name: sourceName,
          source_url: sourceUrl,
          image_url: imageUrl || null,
          community_angle: communityAngle || null,
          author: author || null,
          status,
          published_at:
            status === 'published'
              ? new Date().toISOString()
              : null,
          import_method: 'automated-editorial',
        },
        prefer: 'return=representation',
      },
    )

    return NextResponse.json({
      ok: true,
      id: rows[0]?.id,
      slug: rows[0]?.slug,
      status,
    })
  } catch (error) {
    console.error('Publishing failed:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Publishing failed',
      },
      { status: 500 },
    )
  }
}
