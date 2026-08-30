import { NextResponse } from 'next/server'
import { runEditorialGeneratorV2 } from '@/lib/editorial-generator-v2'

export const maxDuration = 300

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

  try {
    const result = await runEditorialGeneratorV2()

    return NextResponse.json({
      ok: true,
      result,
    })
  } catch (error) {
    console.error('Editorial generation failed:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Editorial generation failed',
      },
      { status: 500 },
    )
  }
}
