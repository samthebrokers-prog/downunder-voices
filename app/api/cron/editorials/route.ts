import { NextResponse } from 'next/server'
import { runEditorialGenerator } from '@/lib/editorial-generator'

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
    const result = await runEditorialGenerator()

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
