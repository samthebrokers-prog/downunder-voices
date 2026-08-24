type FacebookPostInput = {
  title: string
  slug: string
  summary?: string
  imageUrl?: string | null
  linkUrl?: string | null
}

type FacebookPostResult = {
  ok: boolean
  id?: string
  skipped?: boolean
  error?: string
}

type FacebookApiData = {
  id?: string
  post_id?: string
  error?: {
    message?: string
    type?: string
    code?: number
  }
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.downundervoices.com'

async function sendFacebookRequest(
  endpoint: string,
  body: URLSearchParams,
): Promise<{
  ok: boolean
  id?: string
  error?: string
}> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded',
      },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    })

    const data =
      (await response.json()) as FacebookApiData

    if (!response.ok) {
      return {
        ok: false,
        error:
          data.error?.message ||
          'Facebook returned HTTP ' + response.status,
      }
    }

    return {
      ok: true,
      id: data.post_id || data.id,
    }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown Facebook publishing error',
    }
  }
}

export async function publishStoryToFacebook({
  title,
  slug,
  summary = '',
  imageUrl,
  linkUrl,
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
      ? cleanSummary.slice(0, 219).trim() + '…'
      : cleanSummary

  const siteUrl =
    SITE_URL.replace(/\/$/, '')

  const storyUrl =
    linkUrl ||
    siteUrl + '/story/' + encodeURIComponent(slug)

  /*
   * Always give Meta an image served by Downunder Voices itself.
   * Remote publisher images can reject Meta's crawler or expire.
   */
  const publicImageUrl = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : siteUrl + imageUrl
    : siteUrl +
      '/api/social-image/' +
      encodeURIComponent(slug)

  const message = [
    cleanTitle,
    shortSummary,
    'Read more: ' + storyUrl,
  ]
    .filter(Boolean)
    .join('\n\n')

  const photoResult =
    await sendFacebookRequest(
      'https://graph.facebook.com/v26.0/' + pageId + '/photos',
      new URLSearchParams({
        message,
        url: publicImageUrl,
        access_token: accessToken,
      }),
    )

  if (photoResult.ok) {
    console.log(
      'Facebook photo post created: ' +
        (photoResult.id ?? 'unknown id') +
        ' — ' +
        cleanTitle,
    )

    return photoResult
  }

  console.warn(
    'Facebook photo delivery failed; trying link-post fallback: ' +
      (photoResult.error ?? 'unknown error'),
  )

  const linkResult =
    await sendFacebookRequest(
      'https://graph.facebook.com/v26.0/' + pageId + '/feed',
      new URLSearchParams({
        message,
        link: storyUrl,
        access_token: accessToken,
      }),
    )

  if (linkResult.ok) {
    console.log(
      'Facebook link post created: ' +
        (linkResult.id ?? 'unknown id') +
        ' — ' +
        cleanTitle,
    )

    return linkResult
  }

  const combinedError =
    'Photo post failed: ' +
    (photoResult.error ?? 'unknown error') +
    '; link fallback failed: ' +
    (linkResult.error ?? 'unknown error')

  console.error(
    'Facebook publishing failed:',
    combinedError,
  )

  return {
    ok: false,
    error: combinedError,
  }
}
