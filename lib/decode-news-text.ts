/** Decode common RSS HTML entities without interpreting source markup as HTML. */
export function decodeNewsText(value: string): string {
  const named: Record<string, string> = { amp: '&', quot: '"', apos: "'", nbsp: ' ', hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—' }
  let result = value
  for (let pass = 0; pass < 2; pass++) {
    const next = result.replace(/&(#(?:x[0-9a-f]+|[0-9]+)|[a-z]+);/gi, (match, entity: string) => {
      if (entity[0] === '#') {
        const hex = entity[1]?.toLowerCase() === 'x'
        const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10)
        return Number.isInteger(code) && code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : match
      }
      return named[entity.toLowerCase()] ?? match
    })
    if (next === result) break
    result = next
  }
  return result
}
