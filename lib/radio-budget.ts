/**
 * Downunder Voices Radio — spending guard.
 *
 * Every paid OpenAI call made by the radio is costed and written to a
 * small ledger in storage. Before any new call we check the caps:
 *
 *   - Monthly cap (default US$18): when reached, ALL new AI generation stops
 *     until the next month. The station keeps playing cached material.
 *   - Daily cap (default US$0.70): news may use all of it; new programmes
 *     stop earlier so there is always money left for news on a busy day.
 *   - Failure breaker: after several failed paid calls in one day, new
 *     generation pauses for the rest of that day (stops retry loops).
 *   - Run locks: the same job cannot run twice at the same time.
 *
 * Reaching a cap never stops the station: only new AI generation stops.
 */
import { getJson, putJson } from '@/lib/radio-storage'

const num = (value: string | undefined, fallback: number) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export const CAPS = {
  monthlyUsd: num(process.env.DV_RADIO_MONTHLY_CAP_USD, 18),
  dailyUsd: num(process.env.DV_RADIO_DAILY_CAP_USD, 0.7),
  /** New programmes may only spend while the day is below this. */
  programmeDailyUsd: num(process.env.DV_RADIO_PROGRAMME_DAILY_CAP_USD, 0.45),
  failuresPerDay: num(process.env.DV_RADIO_MAX_FAILURES_PER_DAY, 5),
}

/** Published OpenAI prices (US$). Slightly rounded up to stay on the safe side. */
export const PRICES = {
  ttsPerMinute: 0.016, // gpt-4o-mini-tts, ~US$0.015/min
  charsPerMinute: 900, // typical spoken pace
  inputPerToken: 0.25 / 1e6, // gpt-5-mini
  cachedInputPerToken: 0.025 / 1e6,
  outputPerToken: 2 / 1e6,
  webSearchCall: 0.01,
}

export function estimateSpeechUsd(chars: number) {
  return (chars / PRICES.charsPerMinute) * PRICES.ttsPerMinute
}

type Entry = { at: string; kind: string; usd: number; note: string }

export type Ledger = {
  day: string // UTC date
  daySpent: number
  month: string // UTC year-month
  monthSpent: number
  failures: number
  calls: number
  recent: Entry[]
  days: Record<string, number> // last ~40 days, for the status page
}

const LEDGER = 'state/spend-ledger.json'

function today() {
  return new Date().toISOString().slice(0, 10)
}

let cached: Ledger | null = null

export async function loadLedger(): Promise<Ledger> {
  const data = await getJson<Ledger | null>(LEDGER, null)
  const day = today()
  const month = day.slice(0, 7)
  const ledger: Ledger = data && typeof data === 'object'
    ? { ...data, recent: data.recent || [], days: data.days || {} }
    : { day, daySpent: 0, month, monthSpent: 0, failures: 0, calls: 0, recent: [], days: {} }
  if (ledger.month !== month) {
    ledger.month = month
    ledger.monthSpent = 0
  }
  if (ledger.day !== day) {
    ledger.day = day
    ledger.daySpent = 0
    ledger.failures = 0
  }
  cached = ledger
  return ledger
}

async function current() {
  return cached ?? loadLedger()
}

async function save(ledger: Ledger) {
  const keys = Object.keys(ledger.days).sort()
  for (const k of keys.slice(0, Math.max(0, keys.length - 40))) delete ledger.days[k]
  ledger.recent = ledger.recent.slice(-60)
  await putJson(LEDGER, ledger)
}

export type SpendKind = 'news' | 'programme'

/** May we spend about `usd` more on this kind of work right now? */
export async function canSpend(kind: SpendKind, usd: number) {
  const ledger = await current()
  if (ledger.failures >= CAPS.failuresPerDay) {
    return { ok: false, reason: `paused for today after ${ledger.failures} failed calls` }
  }
  if (ledger.monthSpent + usd > CAPS.monthlyUsd) {
    return { ok: false, reason: `monthly cap US$${CAPS.monthlyUsd} reached` }
  }
  const dayLimit = kind === 'programme' ? CAPS.programmeDailyUsd : CAPS.dailyUsd
  if (ledger.daySpent + usd > dayLimit) {
    return { ok: false, reason: `daily ${kind} limit US$${dayLimit} reached` }
  }
  return { ok: true, reason: '' }
}

export async function recordSpend(kind: string, usd: number, note: string) {
  const ledger = await current()
  const amount = Math.round(usd * 100000) / 100000
  ledger.daySpent += amount
  ledger.monthSpent += amount
  ledger.calls += 1
  ledger.days[ledger.day] = (ledger.days[ledger.day] || 0) + amount
  ledger.recent.push({ at: new Date().toISOString(), kind, usd: amount, note: note.slice(0, 120) })
  try {
    await save(ledger)
  } catch (error) {
    console.error('Could not save radio spend ledger:', error)
  }
}

export async function recordFailure(kind: string, note: string) {
  const ledger = await current()
  ledger.failures += 1
  ledger.recent.push({ at: new Date().toISOString(), kind: `${kind}-failed`, usd: 0, note: note.slice(0, 120) })
  try {
    await save(ledger)
  } catch (error) {
    console.error('Could not save radio spend ledger:', error)
  }
}

/* ------------------------------------------------------------------ */
/* Run locks — stop the same job running twice at once                 */
/* ------------------------------------------------------------------ */

export async function takeLock(name: string, minutes = 8) {
  const path = `state/lock-${name}.json`
  const lock = await getJson<{ at: string } | null>(path, null)
  if (lock?.at && Date.now() - Date.parse(lock.at) < minutes * 60_000) return false
  await putJson(path, { at: new Date().toISOString() })
  return true
}

export async function releaseLock(name: string) {
  try {
    await putJson(`state/lock-${name}.json`, { at: '1970-01-01T00:00:00.000Z' })
  } catch {
    /* the lock simply expires */
  }
}
