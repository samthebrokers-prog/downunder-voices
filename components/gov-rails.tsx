// Side rails shown only on wide screens: the latest news headlines about key
// government agencies in Australia (left) and New Zealand (right), refreshed
// automatically several times a day (see lib/gov-updates.ts). Text only, no
// agency logos, so nobody mistakes them for official government pages.
import { AU_AGENCIES, NZ_AGENCIES, latestForAgency, type GovAgency, type GovHeadline } from '@/lib/gov-updates'

type AgencyWithNews = GovAgency & { news: GovHeadline[] }

function shortDate(iso: string, country: 'AU' | 'NZ') {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: country === 'AU' ? 'Australia/Sydney' : 'Pacific/Auckland' })
  } catch {
    return ''
  }
}

function Rail({ title, flag, items, side, extra }: { title: string; flag: string; items: AgencyWithNews[]; side: 'left' | 'right'; extra?: { label: string; url: string } }) {
  return (
    <aside aria-label={`Government updates — ${title}`} className="fixed top-[200px] z-10 hidden w-[200px] min-[1720px]:block" style={side === 'left' ? { left: 'calc((100vw - 80rem) / 2 - 220px)' } : { right: 'calc((100vw - 80rem) / 2 - 220px)' }}>
      <div className="flex max-h-[calc(100vh-220px)] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
        <div className="shrink-0 bg-neutral-900 px-4 py-3 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">Government updates</p>
          <p className="mt-1 font-serif text-lg font-black">{flag} {title}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-red-300">Latest news · updated daily</p>
        </div>
        <ul className="divide-y divide-slate-200 overflow-y-auto">
          {items.map(agency => (
            <li key={agency.url} className="px-4 py-3">
              <a href={agency.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-bold leading-snug text-slate-950 hover:underline">{agency.name} ↗</a>
              {agency.news.length ? (
                <ul className="mt-2 space-y-2">
                  {agency.news.map(item => (
                    <li key={item.link}>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="group block">
                        <span className="line-clamp-3 text-xs leading-[1.35rem] text-slate-700 group-hover:text-red-700 group-hover:underline">{item.title}</span>
                        <span className="mt-0.5 block text-[10px] leading-4 text-slate-400">{[item.source, shortDate(item.publishedAt, agency.country)].filter(Boolean).join(' · ')}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-0.5 text-xs leading-5 text-slate-500">{agency.tip}</p>
              )}
            </li>
          ))}
          {extra && (
            <li className="px-4 py-3">
              <a href={extra.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-bold leading-snug text-slate-950 hover:underline">{extra.label} ↗</a>
            </li>
          )}
        </ul>
        <p className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-2 text-[10px] leading-4 text-slate-500">Headlines link to official sites and news reports. Downunder Voices is independent and not part of any government.</p>
      </div>
    </aside>
  )
}

async function withNews(agencies: GovAgency[]): Promise<AgencyWithNews[]> {
  return Promise.all(agencies.map(async agency => ({ ...agency, news: await latestForAgency(agency, 2).catch(() => []) })))
}

export async function GovRails() {
  const [au, nz] = await Promise.all([withNews(AU_AGENCIES), withNews(NZ_AGENCIES)])
  return (
    <>
      <Rail title="Australia" flag="🇦🇺" items={au} side="left" extra={{ label: 'myGov sign in (Centrelink, Medicare & ATO)', url: 'https://my.gov.au/' }} />
      <Rail title="New Zealand" flag="🇳🇿" items={nz} side="right" />
    </>
  )
}
