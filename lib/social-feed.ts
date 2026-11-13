// "Voices on the Government" — fresh videos every 24 hours (owner request, 13 Nov 2026:
// "videos same old … there should be new and rotation", "updated every 24 hours").
// Reads the free public YouTube RSS feeds of mainstream NZ news outlets (no API key, no cost),
// keeps videos from the last 7 days about NZ politics, and mixes outlets so no single one dominates.
// If the feeds can't be reached, the hand-picked posts in lib/social-posts.ts are shown instead.
import type { SocialPost } from '@/lib/social-posts'

const CHANNELS: Array<[string, string]> = [
  ['RNZ', 'UCp4OXwfZE1SaCQ4jRAuaoXQ'],
  ['1News', 'UCxPAYgO8OpFev3PUTKbsxNw'],
  ['NZ Herald', 'UCG0xyRVgb5Yf1lvQxkRrYYQ'],
  ['Stuff', 'UCZgnsVbXJPZRg5kmtKyq6Ew'],
  ['Newsroom', 'UCDR2gVFmKy9xRU09ibm5S0A'],
  ['Newstalk ZB', 'UCgSIWmLRoSgFklpOr9rVjfg'],
  ['The Spinoff', 'UCprQWxc91NtC1Jx1iuEbC-Q'],
]

const POLITICS = /\b(election|elections|luxon|hipkins|swarbrick|davidson|seymour|peters|nz first|act party|labour|national party|greens?|green party|opportunity|qiulae|wong|te p[aā]ti m[aā]ori|waititi|ngarewa|special votes?|coalition|parliament|caretaker|overhang|mmp|prime minister|beehive|willis|bishop|minister)\b/i
const DAY = 24 * 60 * 60 * 1000

function decode(s: string) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

type FeedVideo = SocialPost & { published: number; channel: string }

async function channelVideos(name: string, id: string): Promise<FeedVideo[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`, { next: { revalidate: 86400 } })
    if (!res.ok) return []
    const xml = await res.text()
    const out: FeedVideo[] = []
    for (const entry of xml.split('<entry>').slice(1)) {
      const vid = entry.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1]
      const title = decode(entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? '')
      const published = Date.parse(entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? '')
      if (!vid || !title || !published) continue
      if (Date.now() - published > 7 * DAY || !POLITICS.test(title)) continue
      out.push({
        platform: 'youtube',
        url: `https://www.youtube.com/watch?v=${vid}`,
        added: new Date(published).toISOString().slice(0, 10),
        note: `${title.replace(/\s*\|\s*[^|]*$/, '').trim()} (${name})`,
        published,
        channel: name,
      })
    }
    return out.sort((a, b) => b.published - a.published)
  } catch {
    return []
  }
}

// Newest first, taking one video from each outlet in turn so the row mixes outlets.
export async function latestPoliticalVideos(max = 15): Promise<SocialPost[]> {
  const lists = (await Promise.all(CHANNELS.map(([n, id]) => channelVideos(n, id)))).filter(l => l.length)
  lists.sort((a, b) => b[0].published - a[0].published)
  const mixed: FeedVideo[] = []
  for (let round = 0; mixed.length < max && lists.some(l => l[round]); round++) {
    for (const l of lists) if (l[round] && mixed.length < max) mixed.push(l[round])
  }
  return mixed.map(({ platform, url, added, note }) => ({ platform, url, added, note }))
}
