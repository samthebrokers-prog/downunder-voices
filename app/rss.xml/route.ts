const siteUrl = 'https://www.downundervoices.com'

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export const dynamic = 'force-dynamic'

export async function GET() {
  const stories = [
    {
      title: 'Downunder Voices',
      description:
        'Independent community news and voices from New Zealand, Australia and the Pacific.',
      slug: '',
      publishedAt: new Date().toISOString(),
    },
  ]

  const items = stories
    .map((story) => {
      const link = story.slug
        ? `${siteUrl}/story/${story.slug}`
        : siteUrl

      return `
        <item>
          <title>${escapeXml(story.title)}</title>
          <link>${link}</link>
          <guid isPermaLink="true">${link}</guid>
          <description>${escapeXml(story.description)}</description>
          <pubDate>${new Date(story.publishedAt).toUTCString()}</pubDate>
        </item>
      `
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Downunder Voices</title>
    <link>${siteUrl}</link>
    <description>
      Independent community news and voices from New Zealand, Australia and the Pacific.
    </description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
    },
  })
}
