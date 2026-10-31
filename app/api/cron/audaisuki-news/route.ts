import { NextResponse } from 'next/server'
import { produceAudaisukiNews } from '@/lib/audaisuki-news'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

// Twice a day (vercel.json): writes Japanese summaries of new Australian
// stories for the AU大好き (Audaisuki) website.
export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  try {
    return NextResponse.json(await produceAudaisukiNews())
  } catch (error) {
    console.error('Audaisuki news failed:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'failed' }, { status: 500 })
  }
}
