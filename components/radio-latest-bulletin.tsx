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
  const activeRef = useRef(false)
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState('')
  const [bulletin, setBulletin] = useState<Bulletin | null>(null)

  function stopRadio() {
    activeRef.current = false
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setPlaying(false)
  }

  useEffect(() => {
    return () => {
      activeRef.current = false
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
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

  function startRadio(segments: Segment[]) {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      throw new Error('This browser cannot play the live bulletin. Please open Downunder Voices Radio in Chrome, Edge or Safari.')
    }

    window.speechSynthesis.cancel()
    activeRef.current = true
    setError('')
    setPlaying(true)

    const voices = window.speechSynthesis.getVoices()
    const regionalVoices = voices.filter((voice) => /^en-(AU|NZ)$/i.test(voice.lang))
    const englishVoices = voices.filter((voice) => /^en-/i.test(voice.lang))
    const candidates = regionalVoices.length ? regionalVoices : englishVoices

    const speakNext = (index: number) => {
      if (!activeRef.current) return
      if (index >= segments.length) {
        activeRef.current = false
        setPlaying(false)
        return
      }

      const segment = segments[index]
      const utterance = new SpeechSynthesisUtterance(segment.script)
      const voiceIndex = segment.presenter === 'male' ? 1 : 0
      utterance.voice = candidates[voiceIndex % Math.max(candidates.length, 1)] || null
      utterance.lang = utterance.voice?.lang || 'en-AU'
      utterance.rate = 0.96
      utterance.pitch = segment.presenter === 'male' ? 0.92 : 1
      utterance.onend = () => speakNext(index + 1)
      utterance.onerror = () => {
        activeRef.current = false
        setPlaying(false)
        setError('The live bulletin was interrupted. Please press Play to try again.')
      }
      window.speechSynthesis.speak(utterance)
    }

    speakNext(0)
  }

  async function togglePlay() {
    if (playing) {
      stopRadio()
      return
    }

    setError('')
    setLoading(true)

    try {
      const latest = await getLatestBulletin()
      const segments = latest.segments?.length
        ? latest.segments
        : [{ presenter: 'female' as Presenter, script: latest.script }]

      startRadio(segments)
    } catch (err) {
      setPlaying(false)
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
            <Clock3 className="size-4" /> Updated hourly
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-300">Live news bulletin</p>
            <h2 className="mt-2 font-serif text-3xl font-black">Australia · New Zealand · World</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Press Play for the latest Downunder Voices headlines. A new bulletin is prepared from the hourly news update.
            </p>
            {bulletin ? (
              <p className="mt-2 text-xs text-slate-500">
                Prepared from {bulletin.storyCount} current stories at {new Date(bulletin.generatedAt).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}.
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={togglePlay}
            disabled={loading}
            aria-label={playing ? 'Pause live news bulletin' : 'Play latest live news bulletin'}
            className="flex min-w-44 items-center justify-center gap-3 rounded-full bg-white px-6 py-4 font-black text-slate-950 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            {loading ? 'Preparing' : playing ? 'Pause bulletin' : 'Play latest news'}
          </button>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-5 text-right text-xs text-slate-500">
          Live news only. Music will be added after licensing approval.
        </div>

        {error ? <p role="alert" className="mt-4 rounded-md bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-950">{error}</p> : null}
      </div>
    </div>
  )
}
