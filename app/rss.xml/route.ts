import { getPublishedStories } from '@/lib/story-service'

const siteUrl = 'https://www.downundervoices.com'

export const dynamic = 'force-dynamic'
export const revalidate = 300

function escapeXml(value: string | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getStoryDate(story: {
  publishedAt?: string
  importedAt?: string
  date?: string
}): Date {
  const value =
    story.publishedAt ||
    story.importedAt ||
    story.date ||
    new Date().toISOString()

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? new Date() : date
}

function getPublicImageUrl(
  image: string | null | undefined,
): string | null {
  if (!image || image.startsWith('data:')) {
    return null
  }

  if (
    image.startsWith('https://') ||
    image.startsWith('http://')
  ) {
    return image
  }

  return `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`
}

export async function GET() {
  const allStories = await getPublishedStories(50)

  const stories = allStories
    .filter((story) => story.category !== 'editorial-view')
    .sort(
      (a, b) =>
        getStoryDate(b).getTime() -
        getStoryDate(a).getTime(),
    )

  const items = stories
    .map((story) => {
      const slug = story.slug || story.id
      const link = `${siteUrl}/story/${encodeURIComponent(slug)}`
      const publishedDate = getStoryDate(story)

      const imageUrl = getPublicImageUrl(story.image)

      const imageXml = imageUrl
        ? `
    <media:content
      url="${escapeXml(imageUrl)}"
      medium="image"
    />
    <media:thumbnail
      url="${escapeXml(imageUrl)}"
    />
    <enclosure
      url="${escapeXml(imageUrl)}"
      type="image/jpeg"
      length="0"
    />`
        : ''

      return `
  <item>
    <title>${escapeXml(story.title)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <description>${escapeXml(story.summary)}</description>
    <category>${escapeXml(story.category)}</category>
    <pubDate>${publishedDate.toUTCString()}</pubDate>
    <author>${escapeXml(
      story.author || 'Downunder Voices',
    )}</author>
    <source url="${escapeXml(
      story.sourceUrl,
    )}">${escapeXml(story.sourceName)}</source>
    ${imageXml}
  </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss
  version="2.0"
  xmlns:media="http://search.yahoo.com/mrss/"
>
  <channel>
    <title>Downunder Voices</title>
    <link>${siteUrl}</link>
    <description>
      News, community voices and opinion from Australia,
      New Zealand and the Pacific.
    </description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

${items}

  </channel>
</rss>`

  return new Response(rss, {
    status: 200,
    headers: {
      'Content-Type':
        'application/rss+xml; charset=utf-8',
      'Cache-Control':
        'public, s-maxage=300, stale-while-revalidate=900',
    },
  })
}
