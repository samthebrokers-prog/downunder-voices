import type { Story } from '@/lib/news-data'

/**
 * Downunder Voices' own work (editorials, originals, cartoons, bylined
 * pieces) versus short summaries of other outlets' reporting.
 *
 * AdSense (Aug 2026) rejected the site for "low value content". Summary pages
 * stay on the site for readers, but are hidden from Google (noindex + left out
 * of the sitemaps) so the site is judged on its original work.
 * Same rule as the "Downunder Voices Original" badge on story cards.
 */
export function isOriginalStory(story: Pick<Story, 'author' | 'sourceName' | 'sourceUrl' | 'category'>) {
  const source = `${story.sourceName ?? ''} ${story.sourceUrl ?? ''}`.toLowerCase()
  return (
    Boolean(story.author?.trim()) ||
    story.category === 'editorial-view' ||
    source.includes('downunder voices') ||
    source.includes('downundervoices.com') ||
    !story.sourceUrl
  )
}
