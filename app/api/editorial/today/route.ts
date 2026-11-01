import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

export const runtime = 'nodejs'
export const revalidate = 600

type Editorial = { title: string; summary: string | null; slug: string; image_url: string | null; published_at: string }

function sydneyDate(iso: string | Date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date(iso))
}

// Homepage editorial slider.
// Slide 1 is the Editorial of the Day: the first editorial of the newest
// day (Sydney time) that has one, so it stays first for that whole day.
// The other slides are the latest editorials that have a picture.
export async function GET() {
  try {
    const rows = await dbRequest<Editorial[]>('stories', {
      query:
        '?select=title,summary,slug,image_url,published_at&status=eq.published&import_method=eq.automated-editorial&published_at=not.is.null&order=published_at.desc&limit=30',
    })
    if (!rows.length) return NextResponse.json({ editorial: null, editorials: [] })

    const latestDay = sydneyDate(rows[0].published_at)
    const sameDay = rows.filter((r) => sydneyDate(r.published_at) === latestDay)
    const lead = sameDay[sameDay.length - 1]
    const isToday = latestDay >= sydneyDate(new Date())

    const others = rows.filter((r) => r.slug !== lead.slug && r.image_url).slice(0, 6)
    const editorials = [{ ...lead, isToday }, ...others.map((r) => ({ ...r, isToday: false }))]

    return NextResponse.json(
      { editorial: editorials[0], editorials },
      { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
    )
  } catch (error) {
    console.error('Editorial of the day failed:', error)
    return NextResponse.json({ editorial: null, editorials: [] }, { status: 500 })
  }
}
