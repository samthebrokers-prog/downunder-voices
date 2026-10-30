'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Radio, Volume2 } from 'lucide-react'

// ONE station, ONE live stream. Every listener joins the same broadcast
// already in progress — nothing is generated in the listener's browser.
export const RADIO_STREAM_URL = 'https://radio.downundervoices.com/listen/downundervoices/radio.mp3'
const NOW_PLAYING_URL = 'https://radio.downundervoices.com/api/nowplaying/downundervoices'

type NowPlaying = {
  now_playing?: { song?: { title?: string; artist?: string }; playlist?: string }
  is_online?: boolean
}

function describe(data: NowPlaying | null) {
  if (!data) return 'Downunder Voices Radio'
  if (data.is_online === false) return 'Station is restarting — please try again shortly'
  const title = data.now_playing?.song?.title?.trim()
  if (!title || /pulse|night desk|deadline|bed/i.test(title)) return 'Downunder Voices Radio · Australia · New Zealand · World'
  return title
}

export default function LiveRadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [volume, setVolume] = useState(0.9)
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await fetch(NOW_PLAYING_URL, { cache: 'no-store' })
        if (response.ok && !cancelled) setNowPlaying(await response.json())
      } catch {
        /* the player still works without the title */
      }
    }
    load()
    const timer = setInterval(load, 20_000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    setError('')

    if (playing) {
      audio.pause()
      // Drop the connection so the next Play joins the live broadcast, not a buffered past.
      audio.removeAttribute('src')
      audio.load()
      setPlaying(false)
      return
    }

    try {
      setLoading(true)
      audio.src = `${RADIO_STREAM_URL}?t=${Date.now()}`
      await audio.play()
      setPlaying(true)
    } catch {
      setError('The live stream could not start. Please press Listen Live again.')
      setPlaying(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-white shadow-lg sm:p-8">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-red-300">
        <span className={`size-2.5 rounded-full ${playing ? 'animate-pulse bg-red-500' : 'bg-red-700'}`} />
        On air now
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={toggle}
          disabled={loading}
          aria-label={playing ? 'Stop listening' : 'Listen live'}
          className="inline-flex items-center justify-center gap-3 rounded-full bg-red-700 px-7 py-4 text-lg font-black uppercase tracking-wide text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-70"
        >
          {playing ? <Pause className="size-6" /> : <Play className="size-6" />}
          {loading ? 'Connecting…' : playing ? 'Stop' : 'Listen Live'}
        </button>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            <Radio className="size-4" /> Downunder Voices Radio
          </p>
          <p className="mt-1 truncate text-lg font-semibold text-slate-100">{describe(nowPlaying)}</p>
          <p className="mt-1 text-sm text-slate-400">News at the top of every hour · Programmes at half past</p>
        </div>
      </div>

      <label className="mt-6 flex max-w-xs items-center gap-3 text-sm text-slate-300">
        <Volume2 className="size-4 shrink-0" />
        <span className="sr-only">Volume</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="w-full accent-red-600"
        />
      </label>

      {error && <p className="mt-4 text-sm font-semibold text-red-300">{error}</p>}

      <audio
        ref={audioRef}
        preload="none"
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onError={() => {
          if (!audioRef.current?.getAttribute('src')) return // stopped on purpose
          if (playing) setError('The stream was interrupted. Press Listen Live to reconnect.')
          setPlaying(false)
          setLoading(false)
        }}
      />
    </div>
  )
}
