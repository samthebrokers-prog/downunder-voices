import { NextRequest, NextResponse } from 'next/server'
import { getRadioVoice, type RadioPresenter } from '@/lib/radio-voices'

export const runtime = 'nodejs'

const MAX_SCRIPT_LENGTH = 4096

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Radio voice service is not configured yet.' },
        { status: 503 },
      )
    }

    const body = await request.json()
    const script = typeof body?.script === 'string' ? body.script.trim() : ''
    const presenter: RadioPresenter = body?.presenter === 'male' ? 'male' : 'female'

    if (!script) {
      return NextResponse.json({ error: 'A bulletin script is required.' }, { status: 400 })
    }

    if (script.length > MAX_SCRIPT_LENGTH) {
      return NextResponse.json(
        { error: `Bulletin script must be ${MAX_SCRIPT_LENGTH} characters or fewer.` },
        { status: 400 },
      )
    }

    const profile = getRadioVoice(presenter)
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.DV_RADIO_TTS_MODEL || 'gpt-4o-mini-tts',
        voice: profile.voice,
        input: script,
        instructions: profile.instructions,
        response_format: 'mp3',
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error('Radio speech generation failed:', response.status, detail)
      return NextResponse.json({ error: 'Could not generate radio audio.' }, { status: 502 })
    }

    const audio = await response.arrayBuffer()
    return new NextResponse(audio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Radio speech route error:', error)
    return NextResponse.json({ error: 'Could not generate radio audio.' }, { status: 500 })
  }
}
