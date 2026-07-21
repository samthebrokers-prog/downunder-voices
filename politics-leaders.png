import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'downunder_admin'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

function secret() {
  return process.env.ADMIN_PASSWORD || ''
}

function signature(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createAdminToken() {
  const payload = String(Math.floor(Date.now() / 1000))
  return `${payload}.${signature(payload)}`
}

export function verifyAdminToken(token?: string) {
  if (!token || !secret()) return false
  const [payload, supplied] = token.split('.')
  if (!payload || !supplied) return false
  const expected = signature(payload)
  if (supplied.length !== expected.length) return false
  const valid = timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
  const age = Math.floor(Date.now() / 1000) - Number(payload)
  return valid && Number.isFinite(age) && age >= 0 && age <= MAX_AGE_SECONDS
}

export async function isAdmin() {
  const store = await cookies()
  return verifyAdminToken(store.get(COOKIE_NAME)?.value)
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
}
