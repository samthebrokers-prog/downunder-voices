'use client'

import { useEffect, useRef, useState } from 'react'

// Christmas carols (instrumental, music only). Recordings by Kevin MacLeod,
// licensed CC BY 3.0 — the credit line below must stay while this is on the site.
// Plays only when a visitor taps the button. Remove this component after the holidays.
const CAROLS = [
  { title: 'Jingle Bells', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Jingle_Bells_%28ISRC_USUAN1100187%29.mp3' },
  { title: 'We Wish You a Merry Christmas', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/We_Wish_you_a_Merry_Christmas_%28ISRC_USUAN1100369%29.mp3' },
  { title: 'Silent Night', src: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Silent_Night_%28ISRC_USUAN1100075%29.mp3' },
]

export function ChristmasMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !playing) return
    audio.src = CAROLS[index].src
    audio.play().catch(() => setPlaying(false))
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }
    // Pause the live radio (or any other player) so two sounds don't clash.
    document.querySelectorAll('audio').forEach((other) => {
      if (other !== audio) other.pause()
    })
    if (!audio.src) audio.src = CAROLS[index].src
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }

  return (
    <section className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Christmas music">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-center text-white">
        <span className="font-serif text-base font-bold">🎄 Merry Christmas from Downunder Voices</span>
        <button
          type="button"
          onClick={toggle}
          className="rounded-full bg-white px-4 py-1.5 text-sm font-black text-neutral-950 transition hover:bg-neutral-200"
        >
          {playing ? `⏸ Pause · ${CAROLS[index].title}` : '🎄 Play Christmas music'}
        </button>
        <span className="text-[11px] text-neutral-400">Music: Kevin MacLeod (incompetech.com), licensed under CC BY 3.0</span>
        <audio
          ref={audioRef}
          preload="none"
          onEnded={() => setIndex((i) => (i + 1) % CAROLS.length)}
          onPause={() => {
            const audio = audioRef.current
            if (audio && !audio.ended) setPlaying(false)
          }}
          onPlay={() => setPlaying(true)}
        />
      </div>
    </section>
  )
}
