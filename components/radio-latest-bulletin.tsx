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

  async function playNewsSting() {
    const ctx = await getAudioContext(); if (!ctx || !activeRef.current) return
    const master = ctx.createGain(); master.gain.setValueAtTime(0.0001, ctx.currentTime); master.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.035); master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.45); master.connect(ctx.destination)
    const notes = [98, 146.83, 196, 293.66]
    notes.forEach((frequency, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = i < 2 ? 'sawtooth' : 'square'; osc.frequency.setValueAtTime(frequency, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(frequency * (i === 3 ? 1.5 : 1.12), ctx.currentTime + 1.1)
      gain.gain.setValueAtTime(0.0001, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(i === 0 ? 0.22 : 0.09, ctx.currentTime + 0.025 + i * 0.035); gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.25)
      osc.connect(gain); gain.connect(master); osc.start(ctx.currentTime + i * 0.035); osc.stop(ctx.currentTime + 1.35)
    })
    const hit = ctx.createOscillator(); const hitGain = ctx.createGain(); hit.type = 'sine'; hit.frequency.setValueAtTime(90, ctx.currentTime); hit.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + 0.32); hitGain.gain.setValueAtTime(0.7, ctx.currentTime); hitGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.42); hit.connect(hitGain); hitGain.connect(master); hit.start(); hit.stop(ctx.currentTime + 0.45)
    await new Promise(resolve => window.setTimeout(resolve, 1500))
    try { master.disconnect() } catch {}
  }

  function stopRadio() {
    activeRef.current = false; continuousRef.current = false
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setPlaying(false); setContinuous(false); setNowPlaying('Latest News')
  }

  useEffect(() => () => {
    activeRef.current = false; continuousRef.current = false
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    const ctx = audioContextRef.current; if (ctx && ctx.state !== 'closed') void ctx.close()
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

  function speakSegments(segments: Segment[], onComplete?: () => void) {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') throw new Error('Please open Downunder Voices Radio in Chrome, Edge or Safari.')
    window.speechSynthesis.cancel(); activeRef.current = true; setPlaying(true)
    const voices = window.speechSynthesis.getVoices()
    const regional = voices.filter(v => /^en-(AU|NZ)$/i.test(v.lang)); const english = voices.filter(v => /^en-/i.test(v.lang)); const candidates = regional.length ? regional : english
    const next = (i: number) => {
      if (!activeRef.current) return
      if (i >= segments.length) { activeRef.current = false; onComplete?.(); return }
      const segment = segments[i]; const u = new SpeechSynthesisUtterance(segment.script)
      u.voice = candidates[(segment.presenter === 'male' ? 1 : 0) % Math.max(candidates.length, 1)] || null
      u.lang = u.voice?.lang || 'en-AU'; u.rate = 1.02; u.pitch = segment.presenter === 'male' ? 0.92 : 1; u.volume = 1
      u.onend = () => {
        if (!activeRef.current) return
        if (i < segments.length - 1) void playNewsSting().then(() => next(i + 1))
        else next(i + 1)
      }
      u.onerror = () => { activeRef.current = false; setPlaying(false); setError('The radio was interrupted. Please press Play to try again.') }
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
      })
    } catch (err) { setPlaying(false); setContinuous(false); continuousRef.current = false; setError(err instanceof Error ? err.message : 'The radio is not available yet.') }
  }

  async function playLatest(keepListening = false) {
    setError(''); setLoading(true)
    try {
      await getAudioContext()
      continuousRef.current = keepListening; setContinuous(keepListening)
      if (keepListening) { await runContinuousCycle(); return }
      setNowPlaying('Latest News'); const latest = await getLatestBulletin()
      const segments = latest.segments?.length ? latest.segments : [{ presenter: 'female' as Presenter, script: latest.script }]
      speakSegments(segments, () => setPlaying(false))
    } catch (err) { setPlaying(false); setContinuous(false); setError(err instanceof Error ? err.message : 'The latest bulletin is not available yet.') }
    finally { setLoading(false) }
  }

  return <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl">
    <div className="border-b border-slate-800 bg-gradient-to-r from-red-800 to-red-700 px-6 py-3"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em]"><span className="size-2.5 animate-pulse rounded-full bg-white" />Downunder Voices Radio</div><div className="flex items-center gap-2 text-xs font-semibold text-red-100"><Clock3 className="size-4" /> Updated hourly</div></div></div>
    <div className="p-6 sm:p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-red-300">Now playing: {nowPlaying}</p><h2 className="mt-2 font-serif text-3xl font-black">Fresh news. Fresh programmes.</h2><p className="mt-3 leading-7 text-slate-300">Headlines are delivered cleanly, with short tense, dramatic news stings between stories for a faster broadcast feel.</p>{bulletin ? <p className="mt-2 text-xs text-slate-500">Latest bulletin prepared from {bulletin.storyCount} current stories at {new Date(bulletin.generatedAt).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}.</p> : null}</div>
    <div className="flex flex-col gap-3 sm:min-w-52"><button type="button" onClick={() => playing ? stopRadio() : void playLatest(false)} disabled={loading} className="flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 font-black text-slate-950 transition hover:bg-red-100 disabled:opacity-60">{loading ? <Loader2 className="size-5 animate-spin" /> : playing ? <Pause className="size-5" /> : <Play className="size-5" />}{loading ? 'Preparing' : playing ? 'Stop radio' : 'Play latest news'}</button>{!playing ? <button type="button" onClick={() => void playLatest(true)} disabled={loading} className="flex items-center justify-center gap-2 rounded-full border border-slate-600 px-5 py-3 text-sm font-black text-white transition hover:border-red-400 hover:text-red-200 disabled:opacity-60"><Radio className="size-4" /> Start continuous radio</button> : continuous ? <p className="text-center text-xs font-bold uppercase tracking-wider text-red-300">Continuous radio on</p> : null}</div></div>
    <div className="mt-6 border-t border-slate-800 pt-5 text-right text-xs text-slate-500">Current-news bulletins, dynamically generated spoken-word programmes and original dramatic news stings.</div>{error ? <p role="alert" className="mt-4 rounded-md bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-950">{error}</p> : null}</div>
  </div>
}
