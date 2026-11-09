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
  { platform: 'youtube', url: 'https://www.youtube.com/watch?v=U95Owqy4np0', added: '2026-11-10', note: 'ACT leader David Seymour tells supporters on election night that ACT has had a record result. (RNZ)' },
  { platform: 'youtube', url: 'https://www.youtube.com/watch?v=bW0d1OsbVF0', added: '2026-11-10', note: 'Opportunity Party leader Qiulae Wong says her party is likely to make history by entering Parliament. (RNZ)' },
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
