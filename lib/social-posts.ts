// "From Facebook & YouTube" — public posts and videos on the NZ Government
// (National, ACT, NZ First). Add new items at the TOP (newest first).
// Only PUBLIC posts/videos. Prefer MPs, parties, unions, journalists and named
// public figures. No unproven accusations of crimes. Keep each note factual.
export type SocialPost = {
  platform: 'facebook' | 'youtube'
  url: string
  added: string
  note?: string
}

export const SOCIAL_POSTS: SocialPost[] = [
  { platform: 'youtube', url: 'https://www.youtube.com/shorts/RouX3mSNLyY', added: '2026-11-10', note: 'Prime Minister Christopher Luxon calls the 2026 result "an MMP special" and says the election is too close to call. (RNZ)' },
  { platform: 'facebook', url: 'https://www.facebook.com/reel/2177779609483942/', added: '2026-11-09', note: 'Labour leader Chris Hipkins says power bills are up 25% in three years under Christopher Luxon, and families hit hardest are locked out of cheaper solar power.' },
  { platform: 'facebook', url: 'https://www.facebook.com/reel/1840632030286280/', added: '2026-11-09', note: 'The Green Party says 2026 is its biggest result in New Zealand history, with special votes still being counted.' },
  { platform: 'youtube', url: 'https://www.youtube.com/watch?v=U95Owqy4np0', added: '2026-11-10', note: 'ACT leader David Seymour tells supporters on election night that ACT has had a record result. (RNZ)' },
  { platform: 'youtube', url: 'https://www.youtube.com/watch?v=bW0d1OsbVF0', added: '2026-11-10', note: 'Opportunity Party leader Qiulae Wong says her party is likely to make history by entering Parliament. (RNZ)' },
  { platform: 'facebook', url: 'https://www.facebook.com/reel/2357480045066993/', added: '2026-11-09', note: 'Chris Hipkins on the cost of living, which he calls the issue the National-led government failed to get under control.' },
  { platform: 'facebook', url: 'https://www.facebook.com/chrishipkinsmp/posts/pfbid02U579kEi7jLGnDmymQ4Gw83bp3Soc1sDdP7t6qJDMtoWzwyHR265RYuYz6ptXFsFSl', added: '2026-11-09', note: 'Chris Hipkins makes the case for three free GP visits a year to ease pressure on families and the health system.' },
  // { platform: 'facebook', url: 'https://www.facebook.com/…/posts/…', added: '2026-11-09', note: '…' },
  // { platform: 'youtube', url: 'https://www.youtube.com/watch?v=VIDEOID', added: '2026-11-09', note: '…' },
]

export function youtubeId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

export function embedUrl(post: SocialPost, width = 500) {
  if (post.platform === 'youtube') {
    const id = youtubeId(post.url)
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  const kind = /\/(videos|reel)\//.test(post.url) ? 'video' : 'post'
  return `https://www.facebook.com/plugins/${kind}.php?href=${encodeURIComponent(post.url)}&show_text=true&width=${width}`
}
