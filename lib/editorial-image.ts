// Every "From the Editor" editorial always has a picture: our own illustration
// drawn by /api/editorial-image/[slug] (owner rule, Nov 2026).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.downundervoices.com').replace(/\/$/, '')

export function editorialImageUrl(slug: string): string {
  return `${SITE_URL}/api/editorial-image/${encodeURIComponent(slug)}`
}
