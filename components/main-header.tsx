'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Menu, Search, X } from 'lucide-react'

const websiteUrl = 'https://www.downundervoices.com'
const shareText = 'Downunder Voices — Independent voices from Australia, New Zealand and the World'

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/latest', label: 'Latest' },
  { href: '/category/australia', label: 'Australia' },
  { href: '/category/new-zealand', label: 'New Zealand' },
  { href: '/category/world', label: 'World' },
  { href: '/category/entertainment', label: 'Entertainment' },
  { href: '/category/small-business', label: 'Business' },
  { href: '/category/sports', label: 'Sports' },
]

const moreLinks = [
  { href: '/category/social-issues', label: 'Social Issues' },
  { href: '/category/trade-logistics', label: 'Trade & Logistics' },
  { href: '/category/community', label: 'Community' },
  { href: '/category/editorial-view', label: 'Opinion' },
  { href: '/cartoon-of-the-day', label: 'Cartoon of the Day' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  { label: 'Share on Facebook', symbol: 'f', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}` },
  { label: 'Share on X', symbol: 'X', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent(shareText)}` },
  { label: 'Share on LinkedIn', symbol: 'in', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}` },
  { label: 'Share on WhatsApp', symbol: '◉', href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${websiteUrl}`)}` },
]

export function MainHeader() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [today, setToday] = useState('')

  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
  }, [])

  function closeMenus() { setOpen(false); setMoreOpen(false); setSearchOpen(false) }
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    closeMenus()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return <header className="sticky top-0 z-50 border-b border-slate-300 bg-white/95 backdrop-blur">
    <div className="border-b border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs sm:px-6 lg:px-8">
        <span className="truncate text-slate-300">{today}</span>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden text-slate-400 sm:inline">Independent Australian &amp; New Zealand news and opinion</span>
          <Link href="/weather" className="font-black text-sky-300 hover:text-white">☀ WEATHER</Link>
          <a href="https://www.fuelwatch.wa.gov.au/" target="_blank" rel="noopener noreferrer" className="hidden font-black text-amber-300 hover:text-white sm:inline">⛽ WA FUEL</a>
          <Link href="/radio" className="font-black text-red-400 hover:text-white">● RADIO</Link>
          <Link href="/advertise" className="font-bold hover:text-red-400">Advertise</Link>
        </div>
      </div>
    </div>

    <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
      <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMenus} aria-label="Downunder Voices homepage">
        <span className="flex size-11 shrink-0 items-center justify-center bg-red-700 font-serif text-lg font-black text-white sm:size-14 sm:text-xl">DV</span>
        <span className="min-w-0"><span className="block whitespace-nowrap font-serif text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-[2.65rem]">DOWNUNDER<span className="ml-2 text-red-700">VOICES</span></span><span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">Australia · New Zealand · World</span></span>
      </Link>
      <div className="flex items-center gap-2">
        <button type="button" aria-label="Search Downunder Voices" onClick={() => { setSearchOpen(v => !v); setOpen(false); setMoreOpen(false) }} className="inline-flex size-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:border-red-700 hover:text-red-700">{searchOpen ? <X className="size-4"/> : <Search className="size-4"/>}</button>
        <div className="hidden items-center gap-2 lg:flex"><div className="mx-1 h-6 w-px bg-slate-200"/>{socialLinks.map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="inline-flex size-8 items-center justify-center rounded-full border border-slate-300 text-xs font-black text-slate-700 hover:border-red-700 hover:text-red-700">{s.symbol}</a>)}</div>
        <button type="button" aria-label="Open navigation menu" onClick={() => { setOpen(v => !v); setSearchOpen(false); setMoreOpen(false) }} className="inline-flex size-11 items-center justify-center border border-slate-300 lg:hidden">{open ? <X className="size-5"/> : <Menu className="size-5"/>}</button>
      </div>
    </div>

    {searchOpen && <div className="border-t border-slate-200 bg-slate-50"><form onSubmit={submitSearch} className="mx-auto flex max-w-4xl gap-2 px-4 py-4 sm:px-6"><input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search news, topics or keywords..." autoFocus className="h-12 flex-1 border border-slate-300 bg-white px-4 outline-none focus:border-red-700"/><button type="submit" className="h-12 bg-red-700 px-5 text-sm font-bold text-white">Search</button></form></div>}

    <nav className="hidden border-t border-slate-200 bg-white lg:block"><div className="mx-auto flex max-w-7xl items-center gap-x-6 px-4 py-2.5 sm:px-6 lg:px-8">
      {mainLinks.map(l => <Link key={l.href} href={l.href} className="whitespace-nowrap text-sm font-bold hover:text-red-700">{l.label}</Link>)}
      <Link href="/radio" className="whitespace-nowrap text-sm font-black text-red-700">Radio</Link>
      <div className="relative ml-auto"><button type="button" onClick={() => setMoreOpen(v => !v)} onBlur={() => window.setTimeout(() => setMoreOpen(false), 150)} className="flex items-center gap-1 text-sm font-bold hover:text-red-700">More <ChevronDown className={`size-4 ${moreOpen ? 'rotate-180' : ''}`}/></button>{moreOpen && <div className="absolute right-0 top-full z-50 mt-3 w-56 border border-slate-200 bg-white py-2 shadow-xl">{moreLinks.map(l => <Link key={l.href} href={l.href} onClick={closeMenus} className="block px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 hover:text-red-700">{l.label}</Link>)}</div>}</div>
    </div></nav>

    {open && <nav className="border-t border-slate-200 bg-white shadow-lg lg:hidden"><div className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">{[...mainLinks, { href: '/weather', label: 'Weather' }, { href: '/radio', label: 'Radio' }, ...moreLinks].map(l => <Link key={`mobile-${l.href}`} href={l.href} onClick={closeMenus} className="border-b py-3 text-sm font-bold">{l.label}</Link>)}<a href="https://www.fuelwatch.wa.gov.au/" target="_blank" rel="noopener noreferrer" className="border-b py-3 text-sm font-bold">WA FuelWatch ↗</a></div></nav>}
  </header>
}
