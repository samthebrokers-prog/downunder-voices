export function createSlug(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

export function uniqueSlug(title: string, sourceUrl: string) {
  let hash = 2166136261
  for (const char of sourceUrl) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return `${createSlug(title)}-${(hash >>> 0).toString(36).slice(0, 6)}`
}
