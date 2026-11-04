import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'
import { editorialImageUrl } from '@/lib/editorial-image'

export const runtime = 'nodejs'
export const revalidate = 600

type Editorial = { title: string; summary: string | null; slug: string; image_url: string | null; published_at: string }

function sydneyDate(iso: string | Date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date(iso))
}

const COMMON = new Set(['This', 'That', 'There', 'These', 'Those', 'When', 'What', 'Where', 'While', 'Which', 'With', 'From', 'After', 'Before', 'Every', 'Downunder', 'Voices', 'Australia', 'Australian', 'Australians', 'Zealand', 'Government', 'Minister', 'Prime'])

// Names and places mentioned near the start of an editorial.
function names(e: Editorial): Set<string> {
  const text = `${e.title} ${(e.summary || '').slice(0, 400)}`
  return new Set((text.match(/\b[A-Z][a-z]{3,}\b/g) || []).filter((w) => !COMMON.has(w)))
}

// True when two editorials are about the same story (e.g. two pieces on the
// same candidate resigning): they share at least two names.
function sameTopic(a: Editorial, b: Editorial): boolean {
  const bb = names(b)
  let overlap = 0
  names(a).forEach((w) => { if (bb.has(w)) overlap += 1 })
  return overlap >= 2
}

// Homepage editorial slider.
// Slide 1 is the Editorial of the Day: the first editorial of the newest
// day (Sydney time) that has one, so it stays first for that whole day.
// Next come the Editorials of the Day from the previous few days, then the
// latest other editorials with a picture, skipping repeats of one story.
export async function GET() {
  try {
    const rows = await dbRequest<Editorial[]>('stories', {
      query:
        '?select=title,summary,slug,image_url,published_at&status=eq.published&import_method=eq.automated-editorial&published_at=not.is.null&order=published_at.desc&limit=30',
    })
    if (!rows.length) return NextResponse.json({ editorial: null, editorials: [] })
    // Every editorial always has a picture: fill any missing one with our illustration.
    for (const r of rows) if (!r.image_url) r.image_url = editorialImageUrl(r.slug)

    const latestDay = sydneyDate(rows[0].published_at)
    const sameDay = rows.filter((r) => sydneyDate(r.published_at) === latestDay)
    const lead = sameDay[sameDay.length - 1]
    const isToday = latestDay >= sydneyDate(new Date())

    const days = Array.from(new Set(rows.map((r) => sydneyDate(r.published_at)))).filter((d) => d !== latestDay).slice(0, 3)
    const pastLeads = days
      .map((d) => rows.filter((r) => sydneyDate(r.published_at) === d).pop())
      .filter((r): r is Editorial => Boolean(r && r.image_url))

    const picked: Editorial[] = [lead]
    for (const r of [...pastLeads, ...rows]) {
      if (picked.length >= 8) break
      if (!r.image_url || picked.some((p) => p.slug === r.slug || sameTopic(p, r))) continue
      picked.push(r)
    }
    const editorials = picked.map((r, i) => ({ ...r, isToday: i === 0 && isToday }))

    return NextResponse.json(
      { editorial: editorials[0], editorials },
      { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
    )
  } catch (error) {
    console.error('Editorial of the day failed:', error)
    return NextResponse.json({ editorial: null, editorials: [] }, { status: 500 })
  }
}
