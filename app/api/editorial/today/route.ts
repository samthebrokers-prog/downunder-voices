import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

export const runtime = 'nodejs'
export const revalidate = 600

type Editorial = { title: string; summary: string | null; slug: string; image_url: string | null; published_at: string }

function sydneyDate(iso: string | Date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date(iso))
}

// "Editorial of the Day" for the homepage banner: the first editorial
// published today (Sydney time), so it stays up for the whole day. Falls
// back to the most recent editorial if none has been written yet today.
export async function GET() {
  try {
    const rows = await dbRequest<Editorial[]>('stories', {
      query:
        '?select=title,summary,slug,image_url,published_at&status=eq.published&import_method=eq.automated-editorial&published_at=not.is.null&order=published_at.desc&limit=12',
    })
    const today = sydneyDate(new Date())
    const todays = rows.filter((r) => sydneyDate(r.published_at) === today)
    const pick = todays.length ? todays[todays.length - 1] : rows[0]
    if (!pick) return NextResponse.json({ editorial: null })
    return NextResponse.json(
      { editorial: { ...pick, isToday: todays.length > 0 } },
      { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
    )
  } catch (error) {
    console.error('Editorial of the day failed:', error)
    return NextResponse.json({ editorial: null }, { status: 500 })
  }
}
