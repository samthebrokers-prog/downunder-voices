import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Retired: listeners no longer generate their own audio. Downunder Voices
// Radio is now one live stream (https://radio.downundervoices.com), and
// bulletins are produced once per hour on the server by
// /api/cron/radio-news. Keeping this closed stops anyone using the
// OpenAI key from a browser.
export async function POST() {
  return NextResponse.json(
    { error: 'This feature has moved to Downunder Voices Radio live.' },
    { status: 410 },
  )
}
