import { NextResponse } from 'next/server'
import { currentCartoon, cartoonShareImage } from '@/lib/editorial-cartoons'
import { publishPhotoToFacebook } from '@/lib/facebook'

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

  // A full PICTURE post (not a link card) with a question to invite comments.
  const pageUrl = SITE_URL.replace(/\/$/, '') + '/cartoon-of-the-day'
  const message = [
    `Cartoon of the Day: ${currentCartoon.headline}`,
    currentCartoon.question ||
      'What do you think? Tell us in the comments.',
    `More cartoons: ${pageUrl}`,
  ].join('\n\n')

  const result = await publishPhotoToFacebook({
    imageUrl: cartoonShareImage(currentCartoon),
    message,
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
