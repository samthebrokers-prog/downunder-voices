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

type Presenter = 'female' | 'male'

type Segment = {
  presenter: Presenter
  script: string
}

const PRIORITY = ['australia', 'new-zealand', 'world', 'business', 'sports']
const MAX_STORY_LENGTH = 850
const MAX_SEGMENT_LENGTH = 3800

function clean(text: string) {
  return text.replace(/\s+/g, ' ').replace(/\s+([,.!?])/g, '$1').trim()
}

function trimAtBoundary(text: string, maxLength: number) {
  const cleaned = clean(text)
  if (cleaned.length <= maxLength) return cleaned

  const candidate = cleaned.slice(0, maxLength - 1)
  const sentenceEnd = Math.max(
    candidate.lastIndexOf('. '),
    candidate.lastIndexOf('! '),
    candidate.lastIndexOf('? '),
  )

  if (sentenceEnd >= Math.floor(maxLength * 0.55)) {
    return candidate.slice(0, sentenceEnd + 1).trim()
  }

  const wordEnd = candidate.lastIndexOf(' ')
  return `${candidate.slice(0, wordEnd > 0 ? wordEnd : candidate.length).trim()}…`
}

function storyLine(story: Story) {
  const summary = clean(story.summary || '')
  const title = clean(story.title)
  const line = !summary || summary.toLowerCase() === title.toLowerCase()
    ? `${title}.`
    : `${title}. ${summary}`

  return trimAtBoundary(line, MAX_STORY_LENGTH)
}

function safeSegment(script: string) {
  return trimAtBoundary(script, MAX_SEGMENT_LENGTH)
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

    const lines = selected.map(storyLine)
    const midpoint = Math.ceil(lines.length / 2)
    const firstHalf = lines.slice(0, midpoint)
    const secondHalf = lines.slice(midpoint)

    const segments: Segment[] = []

    if (firstHalf.length) {
      segments.push({
        presenter: 'female',
        script: safeSegment([
          'This is Downunder Voices Radio. Here are the latest headlines from Australia, New Zealand and around the world.',
          ...firstHalf,
        ].join('\n\n')),
      })
    }

    if (secondHalf.length) {
      segments.push({
        presenter: 'male',
        script: safeSegment([
          ...secondHalf,
          'You are listening to Downunder Voices Radio. Australia, New Zealand and the world.',
        ].join('\n\n')),
      })
    }

    const script = segments.map((segment) => segment.script).join('\n\n')

    return NextResponse.json({
      script,
      segments,
      storyCount: selected.length,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Latest radio bulletin error:', error)
    return NextResponse.json({ error: 'Latest bulletin is not available yet.' }, { status: 500 })
  }
}
