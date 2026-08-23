type FacebookPostInput = {
  title: string
  slug: string
  summary?: string
  imageUrl?: string | null
}

type FacebookPostResult = {
  ok: boolean
  id?: string
  skipped?: boolean
  error?: string
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.downundervoices.com'

export async function publishStoryToFacebook({
  title,
  slug,
  summary = '',
  imageUrl,
}: FacebookPostInput): Promise<FacebookPostResult> {
  const pageId =
    process.env.FACEBOOK_PAGE_ID

  const accessToken =
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN

  if (!pageId || !accessToken) {
    console.warn(
      'Facebook publishing skipped: FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN is missing.',
    )

    return {
      ok: false,
      skipped: true,
    }
  }

  const cleanTitle =
    title
      .replace(/\s+/g, ' ')
      .trim()

  const cleanSummary =
    summary
      .replace(/\s+/g, ' ')
      .trim()

  const shortSummary =
    cleanSummary.length > 220
      ? `${cleanSummary.slice(0, 219).trim()}…`
      : cleanSummary

  const storyUrl =
    `${SITE_URL.replace(/\/$/, '')}/story/${encodeURIComponent(slug)}`

  const publicImageUrl =
    imageUrl?.startsWith('http://') ||
    imageUrl?.startsWith('https://')
      ? imageUrl
      : `${SITE_URL.replace(/\/$/, '')}/api/social-image/${encodeURIComponent(slug)}`

  const message = [
    cleanTitle,
    shortSummary,
    `Read more: ${storyUrl}`,
  ]
    .filter(Boolean)
    .join('\n\n')

  try {
    const response =
      await fetch(
        `https://graph.facebook.com/v26.0/${pageId}/photos`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded',
          },

          body:
            new URLSearchParams({
              message,
              url: publicImageUrl,
              access_token:
                accessToken,
            }),

          cache: 'no-store',

          signal:
            AbortSignal.timeout(
              20000,
            ),
        },
      )

    const data =
      (await response.json()) as {
        id?: string

        error?: {
          message?: string
          type?: string
          code?: number
        }
      }

    if (!response.ok) {
      const errorMessage =
        data.error?.message ||
        `Facebook returned HTTP ${response.status}`

      console.error(
        'Facebook publishing failed:',
        errorMessage,
      )

      return {
        ok: false,
        error: errorMessage,
      }
    }

    console.log(
      `Facebook post created: ${data.id ?? 'unknown id'} — ${cleanTitle}`,
    )

    return {
      ok: true,
      id: data.id,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown Facebook publishing error'

    console.error(
      'Facebook publishing failed:',
      errorMessage,
    )

    return {
      ok: false,
      error: errorMessage,
    }
  }
}
