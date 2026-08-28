import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'
import { uniqueSlug } from '@/lib/slug'

const TOKEN = 'dv-28aug26-flood-afl-7f4c91'

const stories = [
  {
    title: 'Australians Caught in Nepal Flood Disaster as Desperate Search Continues',
    category: 'world',
    sourceName: 'Downunder Voices / Reuters',
    sourceUrl: 'https://www.reuters.com/business/environment/australia-dispatches-aid-nepal-39-citizens-missing-2026-08-27/',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/River%20in%20Rasuwa.JPG',
    communityAngle: 'Australian families are waiting for news as rescue teams search the Nepal–Tibet border disaster zone.',
    summary: `Families across Australia are waiting for news as rescuers battle devastated roads, communications failures and the continuing threat of flooding following the catastrophic disaster along the Nepal–Tibet border.\n\nThe scale of the disaster emerging from Nepal and neighbouring Tibet is difficult to comprehend. Entire communities have been hit by destructive flash flooding, with hundreds of people killed and large numbers still unaccounted for. Among those caught in the disaster are Australians travelling through one of the world's most spectacular — and now most dangerous — regions.\n\nAustralian authorities said 39 Australians were unaccounted for on Friday as families struggled to make contact. Foreign Minister Penny Wong acknowledged the difficulty authorities face in locating Australians when roads, telecommunications and other infrastructure have been destroyed. Australia has deployed additional consular personnel and announced $5 million in humanitarian assistance for affected communities.\n\nThe challenge facing rescuers goes far beyond finding tourists. Floodwaters and debris have devastated settlements, damaged roads and isolated communities. Thousands of rescuers are involved across affected areas, while authorities are also watching the possibility of further flooding.\n\nFor Australians with relatives travelling in Nepal or Tibet, every successful phone call or message now matters. Communications failures can mean people remain listed as unaccounted for even when they have survived, while other families continue an agonising wait for information.\n\nThe tragedy has another dimension that should not be ignored. The Himalayan region is particularly vulnerable to glacial hazards. Scientists have repeatedly warned that warming temperatures can increase instability in high-altitude environments, including risks associated with glaciers and glacial lakes.\n\nThat debate will continue. For now, however, the immediate priority is much simpler: finding people. Behind every number being reported from Nepal is a family waiting for a telephone to ring. For Australian families, that wait has brought a disaster thousands of kilometres away painfully close to home.\n\nDownunder Voices will continue updating this story as Australian authorities confirm the welfare of those reported missing.`,
  },
  {
    title: 'AFL Enters a New Era as Bulldogs and Magpies Fight for Survival',
    category: 'sports',
    sourceName: 'Downunder Voices / AFL',
    sourceUrl: 'https://www.afl.com.au/news/1592834/finals-fixture-full-wildcard-round-schedule-ticket-details-confirmed/',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Aussie%20rules%20wikipedia.jpg',
    communityAngle: 'The AFL’s first wildcard finals weekend changes the shape of the premiership race and puts immediate pressure on four clubs.',
    summary: `There is something different about AFL finals football in 2026 — and tonight at the MCG, the Western Bulldogs and Collingwood are experiencing it first-hand.\n\nFor the first time, the AFL finals series includes a wildcard round. It means September-style pressure has arrived early. Western Bulldogs and Collingwood entered Friday night's clash knowing there was no comfortable second chance waiting for the loser. This is finals football in its simplest form: win and continue the premiership campaign; lose and the season is over.\n\nThe introduction of the wildcard system represents one of the biggest structural changes to the AFL finals race in years. Instead of the traditional final eight immediately beginning the finals series, the expanded system gives teams finishing just outside the leading positions another route into September.\n\nSupporters will argue about whether that is good for football. Some traditionalists will inevitably question whether teams finishing further down the ladder deserve another opportunity. The AFL, however, has gained exactly what it wanted — more meaningful football at the end of the season and another weekend of matches carrying genuine consequences.\n\nAnd there are few clubs capable of turning that experiment into theatre quite like Collingwood. Put the Magpies into an elimination game at the MCG and the atmosphere changes immediately. Across the ground are the Western Bulldogs, carrying their own finals ambitions and enough midfield strength to make Collingwood work for every possession.\n\nFor supporters, that is ultimately what will determine whether the wildcard experiment succeeds. Not the terminology. Not the marketing. Not even the arguments about finals tradition. It will succeed if these matches feel important. The Bulldogs–Magpies battle certainly does.\n\nMelbourne and Carlton follow at the MCG on Saturday night, ensuring the historic wildcard weekend has another sudden-death contest to come.\n\nTwenty-four rounds of football can build a season. One bad night can now finish it. Welcome to AFL finals football in 2026.`,
  },
]

export async function GET(request: Request) {
  const url = new URL(request.url)
  if (url.searchParams.get('token') !== TOKEN) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const created: Array<{ title: string; slug: string }> = []

  for (const story of stories) {
    const existing = await dbRequest<Array<{ id: string; slug: string }>>('stories', {
      query: `?select=id,slug&title=eq.${encodeURIComponent(story.title)}&limit=1`,
    })
    if (existing.length) {
      created.push({ title: story.title, slug: existing[0].slug })
      continue
    }

    const slug = uniqueSlug(story.title, `${story.sourceUrl}-${Date.now()}`)
    await dbRequest('stories', {
      method: 'POST',
      body: {
        slug,
        title: story.title,
        category: story.category,
        summary: story.summary,
        source_name: story.sourceName,
        source_url: story.sourceUrl,
        image_url: story.imageUrl,
        community_angle: story.communityAngle,
        author: 'Downunder Voices Editorial Desk',
        status: 'published',
        published_at: new Date().toISOString(),
        import_method: 'manual-editorial',
      },
    })
    created.push({ title: story.title, slug })
  }

  return NextResponse.json({ ok: true, stories: created })
}
