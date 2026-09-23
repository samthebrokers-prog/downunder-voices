import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

const stories = [
  {
    slug: 'nz-election-2026-supermarket-competition-labour-national-plans',
    title: 'NZ Election 2026: Labour and National Put Supermarket Competition in the Spotlight',
    category: 'new-zealand',
    summary: 'Supermarket competition has moved into the centre of the 2026 election campaign, with both Labour and National proposing structural changes aimed at increasing competition. Labour says it would require Woolworths and Foodstuffs to separate their retail chains from wholesale operations, while National has said it would pursue a breakup of Foodstuffs that separates New World and Four Square from Pak’nSave. The proposals differ in design, and their eventual effect would depend on implementation, regulation and the response of supermarket operators.',
    source_name: '1News',
    source_url: 'https://www.1news.co.nz/2026/09/20/its-breakup-season-labour-national-clash-on-tearing-up-grocery-duopoly/',
    community_angle: 'Food prices and household budgets are a direct concern for voters. Downunder Voices will follow the parties’ supermarket proposals, including what each plan would change, how quickly changes could occur and what independent competition analysis says about likely effects.',
  },
  {
    slug: 'nz-election-2026-parliament-final-days-campaign-fulltime',
    title: 'NZ Election 2026: Parliament Reaches Final Days as Campaign Moves Into Full Swing',
    category: 'new-zealand',
    summary: 'New Zealand’s election campaign is entering a new phase as Parliament reaches the end of its final sitting week before the November general election. Party announcements have accelerated across issues including supermarkets, healthcare and small business, while MPs prepare to move from parliamentary business into full-time campaigning. Downunder Voices will track policy announcements and campaign claims against primary documents and reliable reporting.',
    source_name: '1News',
    source_url: 'https://www.1news.co.nz/2026/09/21/watch-live-pms-final-post-cabinet-briefing-before-the-election/',
    community_angle: 'For voters, the shift into full-time campaigning means more promises, advertising and competing claims. Our election coverage will separate confirmed policy from campaign rhetoric and clearly attribute claims to the party or organisation making them.',
  },
  {
    slug: 'nz-election-2026-national-crime-ad-footage-dates',
    title: 'NZ Election 2026: Questions Raised Over Footage Used in National Crime Advertisement',
    category: 'new-zealand',
    summary: 'A National Party campaign advertisement criticising Labour over crime has come under scrutiny after 1News checked the dates of footage used in the video. The broadcaster reported that at least five of 15 crime and disorder clips it examined were filmed after the current coalition government took office in November 2023. A National Party spokesperson said the footage reflected what the party described as the reality of Labour’s period in government. Two clips could not be dated by 1News.',
    source_name: '1News',
    source_url: 'https://www.1news.co.nz/2026/09/22/nationals-anti-labour-crime-ad-uses-footage-from-governments-own-term/',
    community_angle: 'Campaign advertising should be read carefully regardless of which party produces it. Downunder Voices will distinguish verified dates and events from political claims, and give parties’ responses where relevant.',
  },
]

export async function GET() {
  try {
    const now = new Date().toISOString()
    const results = []

    for (const story of stories) {
      const existing = await dbRequest<Array<{ id: string; slug: string }>>('stories', {
        query: `?select=id,slug&slug=eq.${encodeURIComponent(story.slug)}&limit=1`,
      })

      if (existing[0]) {
        results.push({ slug: story.slug, existing: true, id: existing[0].id })
        continue
      }

      const rows = await dbRequest<Array<{ id: string; slug: string }>>('stories', {
        method: 'POST',
        body: {
          ...story,
          image_url: null,
          author: 'Downunder Voices Election Desk',
          status: 'published',
          published_at: now,
          import_method: 'manual-editorial',
        },
        prefer: 'return=representation',
      })

      results.push({ slug: story.slug, created: true, id: rows[0]?.id })
    }

    return NextResponse.json({ ok: true, results })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Election seed failed' },
      { status: 500 },
    )
  }
}
