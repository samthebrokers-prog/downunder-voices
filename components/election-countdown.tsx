'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

export function ElectionCountdown({ targetIso, label }: { targetIso: string; label: string }) {
  const router = useRouter()
  const target = new Date(targetIso).getTime()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const tick = window.setInterval(() => setNow(Date.now()), 1000)
    // Pull fresh updates from the server every 5 minutes while the page is open.
    const refresh = window.setInterval(() => router.refresh(), 5 * 60 * 1000)
    return () => {
      window.clearInterval(tick)
      window.clearInterval(refresh)
    }
  }, [router])

  const p = parts(now === null ? 0 : target - now)
  const done = now !== null && now >= target

  return (
    <div className="rounded-xl bg-neutral-900 p-5 text-white">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-400">
        {done ? 'Official result due now' : 'Countdown to the official result'}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        {(['days', 'hours', 'minutes', 'seconds'] as const).map((k) => (
          <div key={k} className="rounded-lg bg-neutral-800 py-3">
            <div className="font-serif text-3xl font-black tabular-nums sm:text-4xl">
              {now === null ? '–' : String(p[k]).padStart(2, '0')}
            </div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-neutral-400">{k}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-neutral-300">{label}</p>
    </div>
  )
}
