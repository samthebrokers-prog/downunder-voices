/**
 * Downunder Voices Radio — sponsorship slots.
 *
 * To add a sponsor, add one line below and redeploy. Nothing else in the
 * broadcast system changes. The sponsor line is voiced ONCE, cached, and
 * played with every airing of that programme (or after the news intro).
 *
 * Keep sponsor lines short (one sentence, under about 20 words), factual
 * and tasteful — no prices, no "best", no claims we cannot check.
 *
 *   show: the programme name exactly as on air, or 'News' for the hourly news
 *   line: the words read on air
 *   until: optional last day of the sponsorship (YYYY-MM-DD)
 *
 * Example (not active):
 *   { show: 'Strange But True', line: 'Strange But True is brought to you by Example Travel, helping Kiwis and Aussies explore since 1998.', until: '2027-06-30' },
 */
export type Sponsorship = { show: string; line: string; until?: string }

export const SPONSORSHIPS: Sponsorship[] = []

/**
 * Until a programme has a sponsor, the station occasionally plays this
 * short message instead (about one programme in four).
 */
export const HOUSE_SPONSOR_PROMO =
  'Downunder Voices Radio is independent, and made in Australia and New Zealand. If your business would like to support a programme like this one, visit downundervoices dot com slash sponsor.'

export function sponsorFor(show: string, now = new Date()) {
  const day = now.toISOString().slice(0, 10)
  return SPONSORSHIPS.find(
    (s) => s.show.toLowerCase() === show.toLowerCase() && (!s.until || s.until >= day),
  )
}
