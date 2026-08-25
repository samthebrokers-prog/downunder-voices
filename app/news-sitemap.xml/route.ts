import { getPublishedStories } from '@/lib/story-service'

const siteUrl = 'https://www.downundervoices.com'

export const dynamic = 'force-dynamic'
export const revalidate = 900

function escapeXml(value: string | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function publicationDate(story: {
  publishedAt?: string
  date: string
}): Date {
  const date = new Date(story.publishedAt || story.date)

  return Number.isNaN(date.getTime()) ? new Date() : date
}

export async function GET() {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000
  const stories = (await getPublishedStories(500))
    .filter((story) => publicationDate(story).getTime() >= cutoff)
    .slice(0, 1000)

  const urls = stories
    .map((story) => {
      const slug = story.slug ?? story.id
      const storyUrl = `${siteUrl}/story/${encodeURIComponent(slug)}`
      const publishedAt = publicationDate(story).toISOString()

      return `
  <url>
    <loc>${escapeXml(storyUrl)}</loc>
    <news:news>
      <news:publication>
        <news:name>Downunder Voices</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publishedAt}</news:publication_date>
      <news:title>${escapeXml(story.title)}</news:title>
    </news:news>
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>
${urls}
</urlset>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control':
        'public, s-maxage=900, stale-while-revalidate=1800',
    },
  })
}
