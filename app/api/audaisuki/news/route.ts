import { NextResponse } from 'next/server'
import { takeLock, releaseLock } from '@/lib/radio-budget'
import { produceAudaisukiNews, readAudaisukiNews } from '@/lib/audaisuki-news'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

// Public read of the Japanese news file used by AU大好き (Audaisuki).
// If the file has never been created, it is created once here (first run
// only); after that it is refreshed only by the scheduled job.
export async function GET() {
  let file = await readAudaisukiNews()
  if (!file.updatedAt && (await takeLock('audaisuki', 15))) {
    try {
      await produceAudaisukiNews()
      file = await readAudaisukiNews()
    } catch (error) {
      console.error('Audaisuki first run failed:', error)
    } finally {
      await releaseLock('audaisuki')
    }
  }
  return NextResponse.json(file, {
    headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600', 'Access-Control-Allow-Origin': '*' },
  })
}
