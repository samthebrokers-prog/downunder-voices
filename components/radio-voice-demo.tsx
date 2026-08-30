'use client'

import { useRef, useState } from 'react'
import { Loader2, Pause, Play, Radio } from 'lucide-react'

type Presenter = 'female' | 'male'

const SAMPLE_SCRIPT =
  'This is Downunder Voices Radio. Here are the latest headlines from Australia, New Zealand and around the world. We are building a clear, independent news service for listeners across the region and beyond. More bulletins are coming soon.'

export default function RadioVoiceDemo() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const [loading, setLoading] = useState<Presenter | null>(null)
  const [playing, setPlaying] = useState<Presenter | null>(null)
  const [error, setError] = useState('')

  async function playVoice(presenter: Presenter) {
    setError('')

    if (playing === presenter && audioRef.current) {
      audioRef.current.pause()
      setPlaying(null)
      return
    }

    try {
      setLoading(presenter)

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }

      const response = await fetch('/api/radio/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presenter, script: SAMPLE_SCRIPT }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'The radio voice is not available yet.')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url

      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => setPlaying(null)
      audio.onerror = () => {
        setPlaying(null)
        setError('The audio could not be played. Please try again.')
      }

      await audio.play()
      setPlaying(presenter)
    } catch (err) {
      setPlaying(null)
      setError(err instanceof Error ? err.message : 'The radio voice is not available yet.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-100 p-2 text-red-700">
          <Radio className="size-5" />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-red-700">
            Presenter voice test
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Meet our two news voices</h2>
        </div>
      </div>

      <p className="mt-4 max-w-3xl leading-7 text-slate-600">
        These short samples use the same Downunder Voices bulletin script. We will only keep voices that sound natural, calm and credible on air.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(['female', 'male'] as Presenter[]).map((presenter) => {
          const isLoading = loading === presenter
          const isPlaying = playing === presenter
          const label = presenter === 'female' ? 'Female presenter' : 'Male presenter'

          return (
            <button
              key={presenter}
              type="button"
              onClick={() => playVoice(presenter)}
              disabled={loading !== null && !isLoading}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                <span className="block font-black text-slate-950">{label}</span>
                <span className="mt-1 block text-sm text-slate-500">Listen to sample bulletin</span>
              </span>
              <span className="ml-4 flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5 translate-x-px" />
                )}
              </span>
            </button>
          )
        })}
      </div>

      {error ? (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">{error}</p>
      ) : null}
    </div>
  )
}
