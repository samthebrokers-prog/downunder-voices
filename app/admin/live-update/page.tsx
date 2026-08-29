'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LiveUpdatePage() {
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('Ready to check all configured news sources.')

  async function runLiveUpdate() {
    if (working) return

    setWorking(true)
    setMessage('Checking all news sources now…')

    try {
      const response = await fetch('/api/admin/import', {
        method: 'POST',
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        setMessage(result.error || 'Live update failed.')
        return
      }

      const rows = Array.isArray(result.results) ? result.results : []
      const imported = rows.reduce(
        (sum: number, row: { imported?: number }) =>
          sum + (row.imported || 0),
        0,
      )
      const skipped = rows.reduce(
        (sum: number, row: { skipped?: number }) =>
          sum + (row.skipped || 0),
        0,
      )

      setMessage(
        imported > 0
          ? `LIVE UPDATE COMPLETE — ${imported} new stor${imported === 1 ? 'y' : 'ies'} added. ${skipped} already-seen items skipped.`
          : `LIVE UPDATE COMPLETE — no new stories found. ${skipped} already-seen items skipped.`,
      )
    } catch {
      setMessage('Live update failed. Please try again.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-red-700/30 bg-card p-6 shadow-sm sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
              Downunder Voices newsroom
            </p>
            <h1 className="mt-2 font-serif text-3xl font-black sm:text-4xl">
              Live News Update
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Use this when a major story is developing. It immediately checks all configured news sources instead of waiting for the scheduled import.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded border px-3 py-2 text-sm font-semibold hover:bg-secondary"
          >
            Back to dashboard
          </Link>
        </div>

        <button
          type="button"
          onClick={runLiveUpdate}
          disabled={working}
          className="mt-8 w-full rounded-xl bg-red-700 px-6 py-5 text-lg font-black uppercase tracking-[0.08em] text-white shadow-md transition hover:bg-red-800 disabled:cursor-wait disabled:opacity-60 sm:text-xl"
        >
          {working ? '● LIVE UPDATE RUNNING…' : '● LIVE UPDATE NOW'}
        </button>

        <div
          aria-live="polite"
          className="mt-5 rounded-lg border bg-secondary/40 p-4 text-sm font-semibold"
        >
          {message}
        </div>

        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          The update uses the existing protected Downunder Voices importer. Only new items are added; duplicate items are skipped by the importer.
        </p>
      </div>
    </main>
  )
}
