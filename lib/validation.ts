export function cleanText(value: unknown, max: number) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, max)
}

export function cleanMultiline(value: unknown, max: number) {
  return String(value ?? '').trim().replace(/\r/g, '').slice(0, max)
}

export function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validHttpUrl(value: string) {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
