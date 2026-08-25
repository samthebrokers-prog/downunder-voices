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
  name?: string
  post_id?: string
  access_token?: string
  data?: Array<{
    id?: string
    name?: string
    access_token?: string
  }>
  error?: {
    message?: string
    type?: string
    code?: number
  }
}

type FacebookCredentialType = 'page' | 'user'

type ResolvedFacebookPageToken = {
  ok: boolean
  accessToken?: string
  credentialType?: FacebookCredentialType
  pageName?: string | null
  error?: string
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.downundervoices.com'

const configuredGraphApiVersion =
  process.env.FACEBOOK_GRAPH_API_VERSION?.trim() || ''

const GRAPH_API_VERSION = /^v\d+\.\d+$/.test(
  configuredGraphApiVersion,
)
  ? configuredGraphApiVersion
  : 'v26.0'

const FACEBOOK_TOKEN_CACHE_MS = 15 * 60 * 1000

let resolvedFacebookPageTokenCache:
  | {
      sourceToken: string
      pageId: string
      expiresAt: number
      result: ResolvedFacebookPageToken
    }
  | undefined

function facebookCredential() {
  const userAccessToken =
    process.env.FACEBOOK_USER_ACCESS_TOKEN?.trim() || ''
  const pageAccessToken =
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim() || ''

  if (userAccessToken) {
    return {
      accessToken: userAccessToken,
      source: 'FACEBOOK_USER_ACCESS_TOKEN' as const,
    }
  }

  if (pageAccessToken) {
    return {
      accessToken: pageAccessToken,
      source: 'FACEBOOK_PAGE_ACCESS_TOKEN' as const,
    }
  }

  return {
    accessToken: '',
    source: null,
  }
}

async function getFacebookData(
  path: string,
  accessToken: string,
  fields: string,
): Promise<{
  ok: boolean
  data: FacebookApiData
  status: number
  error?: string
}> {
  try {
    const endpoint = new URL(
      'https://graph.facebook.com/' +
        GRAPH_API_VERSION +
        '/' +
        path.replace(/^\//, ''),
    )

    endpoint.searchParams.set('fields', fields)

    if (path === 'me/accounts') {
      endpoint.searchParams.set('limit', '100')
    }

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })

    const data = (await response.json()) as FacebookApiData

    return {
      ok: response.ok,
      data,
      status: response.status,
      error:
        data.error?.message ||
        (!response.ok
          ? 'Facebook returned HTTP ' + response.status
          : undefined),
    }
  } catch (error) {
    return {
      ok: false,
      data: {},
      status: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown Facebook connection error',
    }
  }
}

async function resolveFacebookPageToken(
  pageId: string,
  sourceToken: string,
): Promise<ResolvedFacebookPageToken> {
  if (
    resolvedFacebookPageTokenCache &&
    resolvedFacebookPageTokenCache.sourceToken === sourceToken &&
    resolvedFacebookPageTokenCache.pageId === pageId &&
    resolvedFacebookPageTokenCache.expiresAt > Date.now()
  ) {
    return resolvedFacebookPageTokenCache.result
  }

  const identity = await getFacebookData(
    'me',
    sourceToken,
    'id,name',
  )

  if (!identity.ok || !identity.data.id) {
    return {
      ok: false,
      error:
        identity.error ||
        'Facebook could not identify the configured access token.',
    }
  }

  let result: ResolvedFacebookPageToken

  if (identity.data.id === pageId) {
    result = {
      ok: true,
      accessToken: sourceToken,
      credentialType: 'page',
      pageName: identity.data.name || null,
    }
  } else {
    const accounts = await getFacebookData(
      'me/accounts',
      sourceToken,
      'id,name,access_token',
    )

    if (!accounts.ok) {
      return {
        ok: false,
        credentialType: 'user',
        error:
          accounts.error ||
          'Facebook could not retrieve a Page token from the configured User token.',
      }
    }

    const page = accounts.data.data?.find(
      (account) => account.id === pageId,
    )

    if (!page?.access_token) {
      return {
        ok: false,
        credentialType: 'user',
        error:
          'The configured Facebook User token cannot access Page ' +
          pageId +
          '. Confirm pages_show_list, pages_read_engagement and pages_manage_posts permissions.',
      }
    }

    result = {
      ok: true,
      accessToken: page.access_token,
      credentialType: 'user',
      pageName: page.name || null,
    }
  }

  resolvedFacebookPageTokenCache = {
    sourceToken,
    pageId,
    expiresAt: Date.now() + FACEBOOK_TOKEN_CACHE_MS,
    result,
  }

  return result
}

export function facebookConfigurationSummary() {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim() || ''
  const credential = facebookCredential()

  return {
    configured: Boolean(pageId && credential.accessToken),
    pageId: pageId || null,
    pageIdPresent: Boolean(pageId),
    accessTokenPresent: Boolean(credential.accessToken),
    credentialSource: credential.source,
    graphApiVersion: GRAPH_API_VERSION,
  }
}

export async function verifyFacebookConnection() {
  const configuration = facebookConfigurationSummary()
  const credential = facebookCredential()

  if (!configuration.configured || !configuration.pageId) {
    return {
      ok: false,
      ...configuration,
      error: 'Facebook Page credentials are not configured.',
    }
  }

  try {
    const resolvedToken = await resolveFacebookPageToken(
      configuration.pageId,
      credential.accessToken,
    )

    if (!resolvedToken.ok || !resolvedToken.accessToken) {
      return {
        ok: false,
        ...configuration,
        credentialType: resolvedToken.credentialType || null,
        error: resolvedToken.error || 'Facebook Page token resolution failed.',
      }
    }

    const page = await getFacebookData(
      configuration.pageId,
      resolvedToken.accessToken,
      'id,name',
    )

    if (!page.ok || !page.data.id) {
      return {
        ok: false,
        ...configuration,
        credentialType: resolvedToken.credentialType || null,
        error:
          page.error ||
          'Facebook returned HTTP ' + page.status,
      }
    }

    return {
      ok: true,
      ...configuration,
      pageId: page.data.id,
      pageName: page.data.name || resolvedToken.pageName || null,
      credentialType: resolvedToken.credentialType || null,
      pageTokenResolved:
        resolvedToken.credentialType === 'user',
      error: null,
    }
  } catch (error) {
    return {
      ok: false,
      ...configuration,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown Facebook connection error',
    }
  }
}

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
    process.env.FACEBOOK_PAGE_ID?.trim()

  const credential = facebookCredential()

  if (!pageId || !credential.accessToken) {
    console.warn(
      'Facebook publishing skipped: FACEBOOK_PAGE_ID and a Facebook access token are required.',
    )

    return {
      ok: false,
      skipped: true,
    }
  }

  const resolvedToken = await resolveFacebookPageToken(
    pageId,
    credential.accessToken,
  )

  if (!resolvedToken.ok || !resolvedToken.accessToken) {
    return {
      ok: false,
      error:
        resolvedToken.error ||
        'Facebook Page token resolution failed.',
    }
  }

  const accessToken = resolvedToken.accessToken

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
   * Standard stories use a stable, branded image served by
   * Downunder Voices. Remote publisher images can reject
   * Meta's crawler or expire. Feature pages such as Cartoon
   * of the Day can explicitly supply their own site image by
   * also supplying linkUrl.
   */
  const publicImageUrl =
    linkUrl && imageUrl
      ? imageUrl.startsWith('http')
        ? imageUrl
        : siteUrl +
          (imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl)
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
      'https://graph.facebook.com/' +
        GRAPH_API_VERSION +
        '/' +
        pageId +
        '/photos',
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
      'https://graph.facebook.com/' +
        GRAPH_API_VERSION +
        '/' +
        pageId +
        '/feed',
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
