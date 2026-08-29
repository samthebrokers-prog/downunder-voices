'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { categories } from '@/lib/news-data'
import { HeaderWeather } from '@/components/header-weather'

const websiteUrl = 'https://www.downundervoices.com'

const shareText =
  'Downunder Voices — Independent voices from Australia, New Zealand and the World'

const navLinks = [
  ...categories
    .filter(
      (category) =>
        category.slug !== 'editorial-view',
    )
    .map((category) => ({
      href: `/category/${category.slug}`,
      label:
        category.name === "Sam's View"
          ? 'Opinion'
          : category.name,
    })),
  { href: '/weather', label: 'Weather' },
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [today, setToday] = useState('')

  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-NZ', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }))
  }, [])

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    setOpen(false)
    setSearchOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  function closeMenus() {
    setOpen(false)
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur">
      <div className="border-b border-border bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <span className="truncate text-slate-300">{today}</span>
            <HeaderWeather />
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <span className="hidden text-slate-400 lg:inline">Independent voices from Australia, New Zealand &amp; the World</span>
            <Link href="/advertise" className="font-bold text-white transition hover:text-red-400">Advertise with us</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-4" onClick={closeMenus} aria-label="Downunder Voices homepage">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-red-700 font-serif text-xl font-black tracking-tight text-white shadow-sm sm:size-16 sm:text-2xl" aria-hidden="true">DV</span>
          <span className="min-w-0">
            <span className="block whitespace-nowrap font-serif text-2xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">DOWNUNDER<span className="ml-2 text-red-700">VOICES</span></span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.13em] text-muted-foreground sm:text-[11px] sm:tracking-[0.18em]">Australia · New Zealand · World</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button type="button" aria-label={searchOpen ? 'Close website search' : 'Search Downunder Voices'} aria-expanded={searchOpen} title="Search Downunder Voices" onClick={() => { setSearchOpen((current) => !current); setOpen(false) }} className="inline-flex size-10 items-center justify-center rounded-full border border-border text-slate-700 transition hover:border-red-700 hover:bg-red-700 hover:text-white">
            {searchOpen ? <X className="size-4" /> : <Search className="size-4" />}
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            <div className="mx-1 h-6 w-px bg-border" />
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label} className="inline-flex size-9 items-center justify-center rounded-full border border-border text-xs font-black text-slate-700 transition hover:border-red-700 hover:bg-red-700 hover:text-white">{social.symbol}</a>
            ))}
          </div>
          <button type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => { setOpen((current) => !current); setSearchOpen(false) }} className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border transition hover:bg-secondary lg:hidden">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-slate-50">
          <form onSubmit={submitSearch} className="mx-auto flex max-w-4xl gap-2 px-4 py-4 sm:px-6">
            <label htmlFor="site-search" className="sr-only">Search Downunder Voices</label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input id="site-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search news, topics, countries or keywords..." autoFocus className="h-12 w-full rounded-md border border-slate-300 bg-white pl-12 pr-4 text-base outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-700/20" />
            </div>
            <button type="submit" className="h-12 rounded-md bg-red-700 px-5 text-sm font-bold text-white transition hover:bg-red-800">Search</button>
          </form>
          <div className="mx-auto flex max-w-4xl flex-wrap gap-2 px-4 pb-4 sm:px-6">
            <span className="mr-1 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">Popular:</span>
            {['Immigration', 'Cost of living', 'Housing', 'Australia', 'New Zealand', 'World', 'Business', 'Entertainment', 'Artificial intelligence'].map((topic) => (
              <Link key={topic} href={`/search?q=${encodeURIComponent(topic)}`} onClick={closeMenus} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-red-700 hover:text-red-700">{topic}</Link>
            ))}
          </div>
        </div>
      )}

      <nav className="hidden border-t border-border bg-background lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-x-6 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="whitespace-nowrap text-sm font-bold transition-colors hover:text-red-700">Home</Link>
          <Link href="/latest" className="whitespace-nowrap text-sm font-bold transition-colors hover:text-red-700">Latest</Link>
          {navLinks.map((link) => <Link key={`${link.href}-${link.label}`} href={link.href} className="whitespace-nowrap text-sm font-bold transition-colors hover:text-red-700">{link.label}</Link>)}
        </div>
      </nav>

      {open && (
        <nav className="border-t border-border bg-background shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            <Link href="/" onClick={closeMenus} className="border-b border-border py-3 text-sm font-bold">Home</Link>
            <Link href="/latest" onClick={closeMenus} className="border-b border-border py-3 text-sm font-bold">Latest</Link>
            <button type="button" onClick={() => { setOpen(false); setSearchOpen(true) }} className="flex items-center gap-3 border-b border-border py-3 text-left text-sm font-bold"><Search className="size-4" />Search News</button>
            {navLinks.map((link) => <Link key={`mobile-${link.href}-${link.label}`} href={link.href} onClick={closeMenus} className="border-b border-border py-3 text-sm font-bold">{link.label}</Link>)}
            <div className="flex items-center gap-3 py-5">
              {socialLinks.map((social) => <a key={`mobile-${social.label}`} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="inline-flex size-10 items-center justify-center rounded-full border border-border text-xs font-black transition hover:border-red-700 hover:bg-red-700 hover:text-white">{social.symbol}</a>)}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
