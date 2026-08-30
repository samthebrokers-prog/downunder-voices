import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Story = {
  title: string
  summary: string | null
  category: string
  published_at: string
}

const PRIORITY = ['australia', 'new-zealand', 'world', 'business', 'sports']

function clean(text: string) {
  return text.replace(/\s+/g, ' ').replace(/\s+([,.!?])/g, '$1').trim()
}

function storyLine(story: Story) {
  const summary = clean(story.summary || '')
  const title = clean(story.title)
  if (!summary || summary.toLowerCase() === title.toLowerCase()) return `${title}.`
  return `${title}. ${summary}`
}

export async function GET() {
  try {
    const query =
      '?select=title,summary,category,published_at&status=eq.published&published_at=not.is.null&order=published_at.desc&limit=30'
    const stories = await dbRequest<Story[]>('stories', { query })

    const selected: Story[] = []
    for (const category of PRIORITY) {
      const story = stories.find(
        (item) => item.category === category && !selected.includes(item),
      )
      if (story) selected.push(story)
    }

    for (const story of stories) {
      if (selected.length >= 6) break
      if (!selected.includes(story)) selected.push(story)
    }

    // Separate each item into its own paragraph. The speech model treats these
    // paragraph breaks as natural on-air pauses instead of rushing headlines together.
    const script = [
      'This is Downunder Voices Radio. Here are the latest headlines from Australia, New Zealand and around the world.',
      ...selected.map(storyLine),
      'You are listening to Downunder Voices Radio. Australia, New Zealand and the world.',
    ].join('\n\n')

    return NextResponse.json({
      script: script.slice(0, 4000),
      storyCount: selected.length,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Latest radio bulletin error:', error)
    return NextResponse.json({ error: 'Latest bulletin is not available yet.' }, { status: 500 })
  }
}
