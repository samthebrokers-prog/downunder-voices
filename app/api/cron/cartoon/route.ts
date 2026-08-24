import { NextResponse } from 'next/server'
import { currentCartoon } from '@/lib/editorial-cartoons'
import { publishStoryToFacebook } from '@/lib/facebook'

export const maxDuration = 60

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.downundervoices.com'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')

  if (
    !process.env.CRON_SECRET ||
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: 'Unauthorised' },
      { status: 401 },
    )
  }

  const perthDate = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Perth',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  if (currentCartoon.date !== perthDate) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: 'The cartoon has not been updated for today.',
      currentCartoonDate: currentCartoon.date,
      perthDate,
    })
  }

  const result = await publishStoryToFacebook({
    title: `Cartoon of the Day: ${currentCartoon.headline}`,
    slug: 'cartoon-of-the-day',
    summary: currentCartoon.summary,
    imageUrl: currentCartoon.image,
    linkUrl:
      SITE_URL.replace(/\/$/, '') +
      '/cartoon-of-the-day',
  })

  return NextResponse.json(
    {
      ok: result.ok,
      skipped: result.skipped ?? false,
      facebookPostId: result.id ?? null,
      error: result.error ?? null,
    },
    { status: result.ok ? 200 : 500 },
  )
}
