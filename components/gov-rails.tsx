// Side rails shown only on wide screens: quick links to official government
// agency sites in Australia (left) and New Zealand (right). Text only, no agency
// logos, so nobody mistakes them for official government pages.
const AU = [
  { name: 'Services Australia (Centrelink)', tip: 'Payments, Medicare & Centrelink updates', url: 'https://www.servicesaustralia.gov.au/' },
  { name: 'Australian Taxation Office', tip: 'Tax time, deadlines & news', url: 'https://www.ato.gov.au/' },
  { name: 'Fair Work Ombudsman', tip: 'Pay rates & work rights', url: 'https://www.fairwork.gov.au/' },
  { name: 'Australian Border Force', tip: 'Travel & import updates', url: 'https://www.abf.gov.au/' },
  { name: 'Home Affairs (Visas)', tip: 'Visas & citizenship', url: 'https://immi.homeaffairs.gov.au/' },
  { name: 'myGov', tip: 'Sign in to Centrelink, Medicare & ATO', url: 'https://my.gov.au/' },
]
const NZ = [
  { name: 'Inland Revenue (IRD)', tip: 'Tax, KiwiSaver & Working for Families', url: 'https://www.ird.govt.nz/' },
  { name: 'Work and Income', tip: 'Benefits, NZ Super & hardship help', url: 'https://www.workandincome.govt.nz/' },
  { name: 'Immigration New Zealand', tip: 'Visa changes & news', url: 'https://www.immigration.govt.nz/' },
  { name: 'New Zealand Customs', tip: 'Travel & import updates', url: 'https://www.customs.govt.nz/' },
]
function Rail({ title, flag, items, side }: { title: string; flag: string; items: typeof AU; side: 'left' | 'right' }) {
  return (
    <aside aria-label={title} className="fixed top-[200px] z-10 hidden w-[200px] min-[1720px]:block" style={side === 'left' ? { left: 'calc((100vw - 80rem) / 2 - 220px)' } : { right: 'calc((100vw - 80rem) / 2 - 220px)' }}>
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
        <div className="bg-neutral-900 px-4 py-3 text-white"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">Government updates</p><p className="mt-1 font-serif text-lg font-black">{flag} {title}</p></div>
        <ul className="divide-y divide-slate-200">
          {items.map(i => <li key={i.url}><a href={i.url} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 hover:bg-slate-50"><span className="block text-sm font-bold leading-snug text-slate-950">{i.name}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{i.tip} ↗</span></a></li>)}
        </ul>
        <p className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-[10px] leading-4 text-slate-500">Links to official sites. Downunder Voices is independent and not part of any government.</p>
      </div>
    </aside>
  )
}
export function GovRails() {
  return <><Rail title="Australia" flag="🇦🇺" items={AU} side="left"/><Rail title="New Zealand" flag="🇳🇿" items={NZ} side="right"/></>
}
