'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock3, Loader2, Pause, Play, Radio } from 'lucide-react'

type Presenter = 'female' | 'male'
type Segment = { presenter: Presenter; script: string }
type Bulletin = { script: string; segments?: Segment[]; storyCount: number; generatedAt: string }

const programmes: Segment[] = [
  { presenter: 'male', script: 'History in 15. Today, a short journey through the stories that shaped Australia and New Zealand. From migration and trade to democratic reform, our region has repeatedly been changed by ordinary people responding to extraordinary circumstances. Downunder Voices Radio will expand this programme with carefully sourced episodes about the people, places and events behind the headlines.' },
  { presenter: 'female', script: 'Strange Australia. Australia is full of remarkable places, unusual events and true stories that sound almost impossible. This programme explores those stories carefully, separating documented fact from folklore, and always pointing listeners toward the history behind the mystery.' },
  { presenter: 'male', script: 'Mysteries of New Zealand. From remote landscapes to long-running historical questions, Aotearoa New Zealand has many stories that still invite investigation. We will examine established mysteries and unexplained events responsibly, making a clear distinction between evidence, theory and legend.' },
  { presenter: 'female', script: 'Science and Space. Discovery changes quickly. This programme explains important developments in science, medicine, technology, climate and space in plain language, focusing on what has actually been established and why it matters to people in Australia and New Zealand.' },
  { presenter: 'male', script: 'Disaster and Survival. Behind every major emergency are decisions, warnings, rescues and acts of courage. Downunder Voices looks back at documented disasters and survival stories to understand what happened, what was learned, and how communities responded.' },
  { presenter: 'female', script: 'Crime Files and Unsolved. This programme examines historic crimes and established cold cases using responsible public information. We avoid sensational claims, respect victims and families, and distinguish confirmed facts from unanswered questions.' },
]

export default function RadioLatestBulletin() {
  const activeRef = useRef(false)
  const continuousRef = useRef(false)
  const programmeRef = useRef(0)
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [continuous, setContinuous] = useState(false)
  const [error, setError] = useState('')
  const [bulletin, setBulletin] = useState<Bulletin | null>(null)

  function stopRadio() {
    activeRef.current = false
    continuousRef.current = false
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setPlaying(false)
    setContinuous(false)
  }

  useEffect(() => () => {
    activeRef.current = false
    continuousRef.current = false
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  async function getLatestBulletin() {
    const response = await fetch('/api/radio/latest-bulletin', { cache: 'no-store' })
    if (!response.ok) throw new Error('The latest bulletin is not available yet.')
    const body = (await response.json()) as Bulletin
    setBulletin(body)
    return body
  }

  function speakSegments(segments: Segment[], onComplete?: () => void) {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') throw new Error('Please open Downunder Voices Radio in Chrome, Edge or Safari.')
    window.speechSynthesis.cancel()
    activeRef.current = true
    setPlaying(true)
    const voices = window.speechSynthesis.getVoices()
    const regional = voices.filter(v => /^en-(AU|NZ)$/i.test(v.lang))
    const english = voices.filter(v => /^en-/i.test(v.lang))
    const candidates = regional.length ? regional : english
    const next = (i: number) => {
      if (!activeRef.current) return
      if (i >= segments.length) { activeRef.current = false; onComplete?.(); return }
      const segment = segments[i]
      const u = new SpeechSynthesisUtterance(segment.script)
      u.voice = candidates[(segment.presenter === 'male' ? 1 : 0) % Math.max(candidates.length, 1)] || null
      u.lang = u.voice?.lang || 'en-AU'; u.rate = 0.96; u.pitch = segment.presenter === 'male' ? 0.92 : 1
      u.onend = () => next(i + 1)
      u.onerror = () => { activeRef.current = false; setPlaying(false); setError('The radio was interrupted. Please press Play to try again.') }
      window.speechSynthesis.speak(u)
    }
    next(0)
  }

  async function runContinuousCycle() {
    if (!continuousRef.current) return
    try {
      const latest = await getLatestBulletin()
      const news = latest.segments?.length ? latest.segments : [{ presenter: 'female' as Presenter, script: latest.script }]
      const programme = programmes[programmeRef.current % programmes.length]
      programmeRef.current += 1
      speakSegments([...news, programme], () => {
        setPlaying(false)
        if (continuousRef.current) window.setTimeout(() => void runContinuousCycle(), 2000)
      })
    } catch (err) {
      setPlaying(false); setContinuous(false); continuousRef.current = false
      setError(err instanceof Error ? err.message : 'The radio is not available yet.')
    }
  }

  async function playLatest(keepListening = false) {
    setError(''); setLoading(true)
    try {
      continuousRef.current = keepListening; setContinuous(keepListening)
      if (keepListening) { await runContinuousCycle(); return }
      const latest = await getLatestBulletin()
      const segments = latest.segments?.length ? latest.segments : [{ presenter: 'female' as Presenter, script: latest.script }]
      speakSegments(segments, () => setPlaying(false))
    } catch (err) {
      setPlaying(false); setContinuous(false); setError(err instanceof Error ? err.message : 'The latest bulletin is not available yet.')
    } finally { setLoading(false) }
  }

  return <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl">
    <div className="border-b border-slate-800 bg-gradient-to-r from-red-800 to-red-700 px-6 py-3"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em]"><span className="size-2.5 animate-pulse rounded-full bg-white" />Downunder Voices Radio</div><div className="flex items-center gap-2 text-xs font-semibold text-red-100"><Clock3 className="size-4" /> Updated hourly</div></div></div>
    <div className="p-6 sm:p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-red-300">24/7 pilot broadcast</p><h2 className="mt-2 font-serif text-3xl font-black">News every hour. Programmes all day.</h2><p className="mt-3 leading-7 text-slate-300">Play the latest headlines, or start continuous radio for news followed by rotating Downunder Voices talk programmes.</p>{bulletin ? <p className="mt-2 text-xs text-slate-500">Prepared from {bulletin.storyCount} current stories at {new Date(bulletin.generatedAt).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}.</p> : null}</div>
    <div className="flex flex-col gap-3 sm:min-w-52"><button type="button" onClick={() => playing ? stopRadio() : void playLatest(false)} disabled={loading} className="flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 font-black text-slate-950 transition hover:bg-red-100 disabled:opacity-60">{loading ? <Loader2 className="size-5 animate-spin" /> : playing ? <Pause className="size-5" /> : <Play className="size-5" />}{loading ? 'Preparing' : playing ? 'Stop radio' : 'Play latest news'}</button>{!playing ? <button type="button" onClick={() => void playLatest(true)} disabled={loading} className="flex items-center justify-center gap-2 rounded-full border border-slate-600 px-5 py-3 text-sm font-black text-white transition hover:border-red-400 hover:text-red-200 disabled:opacity-60"><Radio className="size-4" /> Start continuous radio</button> : continuous ? <p className="text-center text-xs font-bold uppercase tracking-wider text-red-300">Continuous radio on</p> : null}</div></div>
    <div className="mt-6 border-t border-slate-800 pt-5 text-right text-xs text-slate-500">Pilot: hourly current news plus rotating original spoken-word programmes. No commercial music.</div>{error ? <p role="alert" className="mt-4 rounded-md bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-950">{error}</p> : null}</div>
  </div>
}
