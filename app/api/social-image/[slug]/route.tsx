import { ImageResponse } from 'next/og'
import { getCategoryName } from '@/lib/news-data'
import { getStoryBySlug } from '@/lib/story-service'

export const runtime = 'edge'

type RouteContext = {
  params: Promise<{ slug: string }>
}

export async function GET(
  request: Request,
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

  const imageUrl =
    story.image.startsWith('/')
      ? new URL(story.image, request.url).toString()
      : story.image

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflow: 'hidden',
          color: 'white',
          background: '#111827',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Every post uses its own story image. The dark overlay keeps
            headlines readable and preserves the Downunder Voices brand. */}
        <img
          src={imageUrl}
          alt=""
          width="1200"
          height="630"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            background:
              'linear-gradient(90deg, rgba(3, 7, 18, 0.94) 0%, rgba(17, 24, 39, 0.78) 52%, rgba(17, 24, 39, 0.20) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '62px 72px',
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
              maxWidth: 900,
              fontSize: story.title.length > 90 ? 48 : 58,
              lineHeight: 1.12,
              fontWeight: 700,
              textShadow: '0 3px 18px rgba(0, 0, 0, 0.88)',
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
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)',
            }}
          >
            <span>DOWNUNDER VOICES</span>
            <span style={{ opacity: 0.9 }}>
              Australia · New Zealand · World
            </span>
          </div>
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
