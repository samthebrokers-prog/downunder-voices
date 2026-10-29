'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock3, Loader2, Pause, Play, Radio } from 'lucide-react'

type Presenter = 'female' | 'male'
type Segment = { presenter: Presenter; script: string }
type Bulletin = { script: string; segments?: Segment[]; storyCount: number; generatedAt: string }
type Programme = { name: string; presenter: Presenter; script: string; storyCount: number; generatedAt: string }

export default function RadioLatestBulletin() {
  const activeRef = useRef(false)
  const continuousRef = useRef(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const newsBedRef = useRef<HTMLAudioElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [continuous, setContinuous] = useState(false)
  const [error, setError] = useState('')
  const [bulletin, setBulletin] = useState<Bulletin | null>(null)
  const [nowPlaying, setNowPlaying] = useState('Latest News')

  async function getAudioContext() {
    if (typeof window === 'undefined') return null
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return null
    let ctx = audioContextRef.current
    if (!ctx || ctx.state === 'closed') { ctx = new AudioCtx(); audioContextRef.current = ctx }
    if (ctx.state === 'suspended') await ctx.resume()
    return ctx
  }

  function startNewsBed() {
    const bed = newsBedRef.current
    if (!bed) return
    bed.currentTime = 0
    bed.volume = 0.11
    void bed.play().catch(() => {})
  }

  function stopNewsBed() {
    const bed = newsBedRef.current
    if (!bed) return
    bed.pause()
    bed.currentTime = 0
  }

  async function playNewsSting() {
    const ctx = await getAudioContext(); if (!ctx || !activeRef.current) return
    const start = ctx.currentTime + 0.01
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, start)
    master.gain.exponentialRampToValueAtTime(0.32, start + 0.035)
    master.gain.setValueAtTime(0.32, start + 0.72)
    master.gain.exponentialRampToValueAtTime(0.0001, start + 1.32)
    master.connect(ctx.destination)
    const notes = [146.83, 220, 293.66, 440]
    notes.forEach((frequency, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain()
      osc.type = i === 0 ? 'triangle' : 'sawtooth'
      osc.frequency.setValueAtTime(frequency, start)
      osc.frequency.linearRampToValueAtTime(frequency * 1.06, start + 0.9)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(i === 0 ? 0.20 : 0.07, start + 0.025 + i * 0.018)
      gain.gain.setValueAtTime(i === 0 ? 0.20 : 0.07, start + 0.48)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.18)
      osc.connect(gain); gain.connect(master); osc.start(start + i * 0.018); osc.stop(start + 1.25)
    })
    ;[0, 0.62].forEach((offset, i) => {
      const hit = ctx.createOscillator(); const hitGain = ctx.createGain()
      hit.type = 'sine'; hit.frequency.setValueAtTime(i === 0 ? 92 : 76, start + offset)
      hit.frequency.exponentialRampToValueAtTime(48, start + offset + 0.22)
      hitGain.gain.setValueAtTime(i === 0 ? 0.38 : 0.25, start + offset)
      hitGain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.28)
      hit.connect(hitGain); hitGain.connect(master); hit.start(start + offset); hit.stop(start + offset + 0.3)
    })
    await new Promise(resolve => window.setTimeout(resolve, 1380))
    try { master.disconnect() } catch {}
  }

  function stopRadio() {
    activeRef.current = false; continuousRef.current = false
    stopNewsBed()
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setPlaying(false); setContinuous(false); setNowPlaying('Latest News')
  }

  useEffect(() => {
    const bed = new Audio('/audio/breaking_news_tense.mp3')
    bed.loop = true
    bed.preload = 'auto'
    bed.volume = 0.11
    newsBedRef.current = bed
    return () => {
      activeRef.current = false; continuousRef.current = false
      bed.pause(); bed.currentTime = 0; newsBedRef.current = null
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      const ctx = audioContextRef.current; if (ctx && ctx.state !== 'closed') void ctx.close()
    }
  }, [])

  async function getLatestBulletin() {
    const response = await fetch('/api/radio/latest-bulletin', { cache: 'no-store' })
    if (!response.ok) throw new Error('The latest bulletin is not available yet.')
    const body = (await response.json()) as Bulletin; setBulletin(body); return body
  }

  async function getProgramme() {
    const response = await fetch(`/api/radio/programme?t=${Date.now()}`, { cache: 'no-store' })
    if (!response.ok) throw new Error('The current programme is not available yet.')
    return (await response.json()) as Programme
  }

  function speakSegments(segments: Segment[], onComplete?: () => void, withNewsBed = false) {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') throw new Error('Please open Downunder Voices Radio in Chrome, Edge or Safari.')
    window.speechSynthesis.cancel(); activeRef.current = true; setPlaying(true)
    if (withNewsBed) startNewsBed(); else stopNewsBed()
    const voices = window.speechSynthesis.getVoices()
    const regional = voices.filter(v => /^en-(AU|NZ)$/i.test(v.lang)); const english = voices.filter(v => /^en-/i.test(v.lang)); const candidates = regional.length ? regional : english
    const next = (i: number) => {
      if (!activeRef.current) { if (withNewsBed) stopNewsBed(); return }
      if (i >= segments.length) { if (withNewsBed) stopNewsBed(); activeRef.current = false; onComplete?.(); return }
      const segment = segments[i]; const u = new SpeechSynthesisUtterance(segment.script)
      u.voice = candidates[(segment.presenter === 'male' ? 1 : 0) % Math.max(candidates.length, 1)] || null
      u.lang = u.voice?.lang || 'en-AU'; u.rate = 1.02; u.pitch = segment.presenter === 'male' ? 0.92 : 1; u.volume = 1
      u.onend = () => {
        if (!activeRef.current) { if (withNewsBed) stopNewsBed(); return }
        if (i < segments.length - 1) void playNewsSting().then(() => next(i + 1))
        else next(i + 1)
      }
      u.onerror = () => { if (withNewsBed) stopNewsBed(); activeRef.current = false; setPlaying(false); setError('The radio was interrupted. Please press Play to try again.') }
      window.speechSynthesis.speak(u)
    }; next(0)
  }

  async function runContinuousCycle() {
    if (!continuousRef.current) return
    try {
      setNowPlaying('Latest News')
      const latest = await getLatestBulletin()
      const news = latest.segments?.length ? latest.segments : [{ presenter: 'female' as Presenter, script: latest.script }]
      speakSegments(news, async () => {
        if (!continuousRef.current) return
        try {
          const programme = await getProgramme(); setNowPlaying(programme.name); activeRef.current = true; await playNewsSting()
          speakSegments([{ presenter: programme.presenter, script: programme.script }], () => {
            setPlaying(false)
            if (continuousRef.current) window.setTimeout(() => void runContinuousCycle(), 1800)
          })
        } catch (err) { setError(err instanceof Error ? err.message : 'Programme unavailable.'); setPlaying(false) }
      }, true)
    } catch (err) { stopNewsBed(); setPlaying(false); setContinuous(false); continuousRef.current = false; setError(err instanceof Error ? err.message : 'The radio is not available yet.') }
  }

  async function playLatest(keepListening = false) {
    setError(''); setLoading(true)
    try {
      await getAudioContext()
      continuousRef.current = keepListening; setContinuous(keepListening)
      if (keepListening) { await runContinuousCycle(); return }
      setNowPlaying('Latest News'); const latest = await getLatestBulletin()
      const segments = latest.segments?.length ? latest.segments : [{ presenter: 'female' as Presenter, script: latest.script }]
      speakSegments(segments, () => setPlaying(false), true)
    } catch (err) { stopNewsBed(); setPlaying(false); setContinuous(false); setError(err instanceof Error ? err.message : 'The latest bulletin is not available yet.') }
    finally { setLoading(false) }
  }

  return <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl">
    <div className="border-b border-slate-800 bg-gradient-to-r from-red-800 to-red-700 px-6 py-3"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em]"><span className="size-2.5 animate-pulse rounded-full bg-white" />Downunder Voices Radio</div><div className="flex items-center gap-2 text-xs font-semibold text-red-100"><Clock3 className="size-4" /> Updated hourly</div></div></div>
    <div className="p-6 sm:p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-red-300">Now playing: {nowPlaying}</p><h2 className="mt-2 font-serif text-3xl font-black">Fresh news. Fresh programmes.</h2><p className="mt-3 leading-7 text-slate-300">Headlines are delivered with a low, tense background bed and short dramatic news stings between stories for a faster broadcast feel.</p>{bulletin ? <p className="mt-2 text-xs text-slate-500">Latest bulletin prepared from {bulletin.storyCount} current stories at {new Date(bulletin.generatedAt).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}.</p> : null}</div>
    <div className="flex flex-col gap-3 sm:min-w-52"><button type="button" onClick={() => playing ? stopRadio() : void playLatest(false)} disabled={loading} className="flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 font-black text-slate-950 transition hover:bg-red-100 disabled:opacity-60">{loading ? <Loader2 className="size-5 animate-spin" /> : playing ? <Pause className="size-5" /> : <Play className="size-5" />}{loading ? 'Preparing' : playing ? 'Stop radio' : 'Play latest news'}</button>{!playing ? <button type="button" onClick={() => void playLatest(true)} disabled={loading} className="flex items-center justify-center gap-2 rounded-full border border-slate-600 px-5 py-3 text-sm font-black text-white transition hover:border-red-400 hover:text-red-200 disabled:opacity-60"><Radio className="size-4" /> Start continuous radio</button> : continuous ? <p className="text-center text-xs font-bold uppercase tracking-wider text-red-300">Continuous radio on</p> : null}</div></div>
    <div className="mt-6 border-t border-slate-800 pt-5 text-right text-xs text-slate-500">Current-news bulletins, dynamically generated spoken-word programmes and original dramatic news stings.</div>{error ? <p role="alert" className="mt-4 rounded-md bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-950">{error}</p> : null}</div>
  </div>
}
