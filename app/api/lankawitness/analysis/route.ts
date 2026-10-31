import { NextResponse } from 'next/server'
import { releaseLock, takeLock } from '@/lib/radio-budget'
import { produceLankaAnalysis, readLankaAnalysis } from '@/lib/lankawitness-analysis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

// Public read of the Lanka Witness daily analyses (lankawitness.com reads
// this). ?slug=… returns one article. Until three analyses exist (to fill the
// homepage's top three), a read may make one more — at most three ever, so
// this cannot run up costs. After that only the daily schedule makes new ones.
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug')
  let file = await readLankaAnalysis()
  if (!slug && file.items.length < 3 && (await takeLock('lankawitness', 15))) {
    try {
      await produceLankaAnalysis({ force: true })
      file = await readLankaAnalysis()
    } catch (error) {
      console.error('Lanka Witness first analysis failed:', error)
    } finally {
      await releaseLock('lankawitness')
    }
  }
  const headers = { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600', 'Access-Control-Allow-Origin': '*' }
  if (slug) {
    const item = file.items.find((i) => i.slug === slug)
    return item ? NextResponse.json(item, { headers }) : NextResponse.json({ error: 'Not found' }, { status: 404, headers })
  }
  // The list leaves out article bodies to stay small.
  const items = file.items.map(({ paragraphs: _p, sources: _s, governmentPosition: _g, ...rest }) => rest)
  return NextResponse.json({ updatedAt: file.updatedAt, items }, { headers })
}
