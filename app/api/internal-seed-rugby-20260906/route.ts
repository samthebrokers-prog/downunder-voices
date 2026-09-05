import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

const slug = 'springboks-29-24-all-blacks-johannesburg-2026-highlights'

export async function GET() {
  try {
    const existing = await dbRequest<Array<{ id: string; slug: string }>>(
      'stories',
      {
        query: `?select=id,slug&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      },
    )

    if (existing[0]) {
      return NextResponse.json({ ok: true, existing: true, slug })
    }

    const now = new Date().toISOString()
    const rows = await dbRequest<Array<{ id: string; slug: string }>>(
      'stories',
      {
        method: 'POST',
        body: {
          slug,
          title: 'Springboks 29–24 All Blacks: South Africa Win Johannesburg Thriller',
          category: 'sports',
          summary: 'South Africa have beaten the All Blacks 29–24 in a pulsating third Test at FNB Stadium in Johannesburg, moving 2–1 ahead in the four-Test Rugby’s Greatest Rivalry series. The teams were locked 12–12 at halftime and scored four tries apiece. Ardie Savea crossed twice for New Zealand before leaving with a shoulder injury, while Will Jordan and Samisoni Taukei’aho also scored. South Africa answered through Kurt-Lee Arendse, Jesse Kriel and Malcolm Marx, plus a penalty try, before a late Sacha Feinberg-Mngomezulu penalty helped put the contest beyond New Zealand. The All Blacks struck again after the siren, but the Springboks held on in front of a huge Johannesburg crowd.',
          source_name: 'All Blacks — Official Match Centre',
          source_url: 'https://www.allblacks.com/matches/south-africa-new-zealand-05-09-2026/liveblog',
          image_url: null,
          community_angle: 'For New Zealand supporters, this was another reminder of how little separates rugby’s two great rivals. The All Blacks’ speed and attacking ambition caused South Africa serious problems, but the Springboks’ scrum, maul and second-half pressure changed the match. Savea’s injury was a major blow after his two tries. South Africa now lead the series 2–1, with the fourth and final Test in Baltimore on 12 September. Fans looking for video can also find authorised match highlights through official rugby and broadcast channels rather than unauthorised re-uploads.',
          author: 'Downunder Voices Sports Desk',
          status: 'published',
          published_at: now,
          import_method: 'manual-editorial',
        },
        prefer: 'return=representation',
      },
    )

    return NextResponse.json({ ok: true, created: true, id: rows[0]?.id, slug })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Seed failed' },
      { status: 500 },
    )
  }
}
