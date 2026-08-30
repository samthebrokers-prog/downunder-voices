'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock3, Loader2, Pause, Play } from 'lucide-react'

type Presenter = 'female' | 'male'

type Segment = {
  presenter: Presenter
  script: string
}

type Bulletin = {
  script: string
  segments?: Segment[]
  storyCount: number
  generatedAt: string
}

export default function RadioLatestBulletin() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [readyToPlay, setReadyToPlay] = useState(false)
  const [error, setError] = useState('')
  const [bulletin, setBulletin] = useState<Bulletin | null>(null)

  function clearAudio() {
    audioRef.current?.pause()
    audioRef.current = null
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = null
    setReadyToPlay(false)
  }

  useEffect(() => {
    return () => clearAudio()
  }, [])

  async function getLatestBulletin() {
    const response = await fetch('/api/radio/latest-bulletin', { cache: 'no-store' })
    if (!response.ok) {
      const body = await response.json().catch(() => null)
      throw new Error(body?.error || 'The latest bulletin is not available yet.')
    }
    const body = (await response.json()) as Bulletin
    setBulletin(body)
    return body
  }

  async function createAudioBlob(segment: Segment) {
    const response = await fetch('/api/radio/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(segment),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      throw new Error(body?.error || 'The latest bulletin is not available yet.')
    }

    return response.blob()
  }

  async function startPreparedAudio() {
    const audio = audioRef.current
    if (!audio) return
    setError('')
    try {
      await audio.play()
      setPlaying(true)
      setReadyToPlay(false)
    } catch {
      setPlaying(false)
      setReadyToPlay(true)
      setError('Audio is ready. Tap Play again to start listening.')
    }
  }

  async function togglePlay() {
    setError('')

    if (playing && audioRef.current) {
      audioRef.current.pause()
      setPlaying(false)
      setReadyToPlay(true)
      return
    }

    if (readyToPlay && audioRef.current) {
      await startPreparedAudio()
      return
    }

    try {
      setLoading(true)
      clearAudio()

      const latest = await getLatestBulletin()
      const segments = latest.segments?.length
        ? latest.segments
        : [{ presenter: 'female' as Presenter, script: latest.script }]

      const blobs = await Promise.all(segments.map(createAudioBlob))

      // Keep both presenters in one continuous audio stream. This avoids a new
      // play request when the voice changes, which iPhone and in-app browsers
      // can block after the original user tap has finished.
      const combinedBlob = new Blob(blobs, { type: 'audio/mpeg' })
      const url = URL.createObjectURL(combinedBlob)
      objectUrlRef.current = url

      const audio = new Audio(url)
      audioRef.current = audio
      audio.setAttribute('playsinline', 'true')
      audio.preload = 'auto'
      audio.onended = () => {
        setPlaying(false)
        setReadyToPlay(false)
      }
      audio.onerror = () => {
        setPlaying(false)
        setReadyToPlay(false)
        setError('The bulletin could not be played. Please try again, or open this page in Safari.')
      }

      try {
        await audio.play()
        setPlaying(true)
      } catch {
        // Safari and embedded iPhone browsers may require a second direct tap
        // after asynchronous speech generation has completed.
        setReadyToPlay(true)
        setError('Audio is ready. Tap Play again to start listening.')
      }
    } catch (err) {
      setPlaying(false)
      setReadyToPlay(false)
      setError(err instanceof Error ? err.message : 'The latest bulletin is not available yet.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl">
      <div className="border-b border-slate-800 bg-gradient-to-r from-red-800 to-red-700 px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em]">
            <span className="size-2.5 animate-pulse rounded-full bg-white" />
            Downunder Voices Radio
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-100">
            <Clock3 className="size-4" /> Latest news bulletin
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-300">Latest bulletin</p>
            <h2 className="mt-2 font-serif text-3xl font-black">Australia · New Zealand · World</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Fresh Downunder Voices stories, prepared as a short radio news bulletin when you press play.
            </p>
            {bulletin ? <p className="mt-2 text-xs text-slate-500">Prepared from {bulletin.storyCount} current stories.</p> : null}
          </div>

          <button
            type="button"
            onClick={togglePlay}
            disabled={loading}
            className="flex min-w-44 items-center justify-center gap-3 rounded-full bg-white px-6 py-4 font-black text-slate-950 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            {loading ? 'Preparing' : playing ? 'Pause bulletin' : readyToPlay ? 'Play now' : 'Play latest news'}
          </button>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-5 text-right text-xs text-slate-500">
          News first. Music comes after licensing.
        </div>

        {error ? <p className="mt-4 rounded-md bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-950">{error}</p> : null}
      </div>
    </div>
  )
}
