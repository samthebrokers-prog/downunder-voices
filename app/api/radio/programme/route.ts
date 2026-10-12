import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Story = { title: string; summary: string | null; category: string; published_at: string }

const shows = [
  { name: 'Australia Today', categories: ['australia'], intro: 'A closer look at the Australian stories behind today’s headlines.' },
  { name: 'New Zealand Today', categories: ['new-zealand'], intro: 'The people, decisions and events shaping Aotearoa New Zealand today.' },
  { name: 'World Briefing', categories: ['world'], intro: 'Important developments overseas, explained for listeners in Australia and New Zealand.' },
  { name: 'Business & Cost of Living', categories: ['business'], intro: 'Money, business, jobs and the cost-of-living issues affecting households and communities.' },
  { name: 'Sport Downunder', categories: ['sports', 'sport'], intro: 'The sporting stories people across Australia and New Zealand are talking about.' },
]

function clean(value: string) { return value.replace(/\s+/g, ' ').trim() }
function shorten(value: string, max = 900) {
  const text = clean(value)
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '))
  return (stop > max * 0.55 ? cut.slice(0, stop + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`).trim()
}

export async function GET() {
  try {
    const stories = await dbRequest<Story[]>('stories', { query: '?select=title,summary,category,published_at&status=eq.published&published_at=not.is.null&order=published_at.desc&limit=60' })
    const hour = new Date().getUTCHours()
    const show = shows[hour % shows.length]
    let selected = stories.filter(s => show.categories.includes(s.category)).slice(0, 5)
    if (selected.length < 3) selected = stories.slice(0, 5)

    const body = selected.map((story, i) => {
      const summary = shorten(story.summary || story.title)
      return `${i === 0 ? 'Our first story' : i === selected.length - 1 ? 'Finally' : 'Next'}, ${clean(story.title)}. ${summary}`
    })

    const script = [
      `You’re listening to ${show.name} on Downunder Voices Radio. ${show.intro}`,
      ...body,
      `That’s ${show.name} for now. Downunder Voices Radio will return to the latest news and more programmes throughout the day.`
    ].join('\n\n')

    return NextResponse.json({
      name: show.name,
      presenter: hour % 2 === 0 ? 'female' : 'male',
      script,
      storyCount: selected.length,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Radio programme error:', error)
    return NextResponse.json({ error: 'Programme is not available yet.' }, { status: 500 })
  }
}
