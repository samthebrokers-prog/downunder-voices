import { ImageResponse } from 'next/og'
import { getCategoryName } from '@/lib/news-data'
import { getStoryBySlug } from '@/lib/story-service'

export const runtime = 'edge'

type RouteContext = {
  params: Promise<{ slug: string }>
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const { slug } = await params
  const story = await getStoryBySlug(slug)

  if (!story) {
    return new Response('Story not found', { status: 404 })
  }

  const category =
    story.category === 'editorial-view'
      ? 'Editorial'
      : getCategoryName(story.category)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '62px 72px',
          color: 'white',
          background:
            'linear-gradient(135deg, #111827 0%, #7f1d1d 58%, #b91c1c 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Arial, sans-serif',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              background: '#dc2626',
              padding: '12px 22px',
              borderRadius: 6,
            }}
          >
            {category}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            maxWidth: 1050,
            fontSize: story.title.length > 90 ? 48 : 58,
            lineHeight: 1.12,
            fontWeight: 700,
          }}
        >
          {story.title}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontFamily: 'Arial, sans-serif',
            fontSize: 27,
            fontWeight: 700,
          }}
        >
          <span>DOWNUNDER VOICES</span>
          <span style={{ opacity: 0.82 }}>
            Australia · New Zealand · Pacific · World
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control':
          'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  )
}
