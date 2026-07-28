'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { categories } from '@/lib/news-data'

const websiteUrl = 'https://www.downundervoices.com'
const shareText =
  'Downunder Voices — New Zealand, Australia and Pacific news'

const navLinks = [
  ...categories
    .filter((category) => category.slug !== 'editorial-view')
    .map((category) => ({
      href: `/category/${category.slug}`,
      label: category.name === "Sam's View" ? 'Opinion' : category.name,
    })),
  { href: '/submit', label: 'Submit Your Story' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  {
    label: 'Share on Facebook',
    symbol: 'f',
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      websiteUrl,
    )}`,
  },
  {
    label: 'Share on X',
    symbol: 'X',
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      websiteUrl,
    )}&text=${encodeURIComponent(shareText)}`,
  },
  {
    label: 'Share on LinkedIn',
    symbol: 'in',
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      websiteUrl,
    )}`,
  },
  {
    label: 'Share on WhatsApp',
    symbol: '◉',
    href: `https://wa.me/?text=${encodeURIComponent(
      `${shareText} ${websiteUrl}`,
    )}`,
  },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [today, setToday] = useState('')

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('en-NZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    )
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur">
      <div className="border-b border-border bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <span className="truncate text-slate-300">{today}</span>

          <div className="flex shrink-0 items-center gap-4">
            <span className="hidden text-slate-400 sm:inline">
              Independent voices across the region
            </span>

            <Link
              href="/advertise"
              className="font-bold text-white transition hover:text-red-400"
            >
              Advertise with us
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="min-w-0"
          onClick={() => setOpen(false)}
          aria-label="Downunder Voices homepage"
        >
          <span className="block font-serif text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
            DOWNUNDER
            <span className="ml-2 text-red-700">VOICES</span>
          </span>

          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground sm:text-xs">
            New Zealand · Australia · Pacific
          </span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/latest"
            aria-label="Search and browse latest news"
            title="Latest news"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-slate-700 transition hover:border-red-700 hover:bg-red-700 hover:text-white"
          >
            <Search className="size-4" />
          </Link>

          <div className="mx-1 h-6 w-px bg-border" />

          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-xs font-black text-slate-700 transition hover:border-red-700 hover:bg-red-700 hover:text-white"
            >
              {social.symbol}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border transition hover:bg-secondary lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <nav className="hidden border-t border-border bg-background lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-x-6 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="whitespace-nowrap text-sm font-bold transition-colors hover:text-red-700"
          >
            Home
          </Link>

          <Link
            href="/latest"
            className="whitespace-nowrap text-sm font-bold transition-colors hover:text-red-700"
          >
            Latest
          </Link>

          {navLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="whitespace-nowrap text-sm font-bold transition-colors hover:text-red-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {open && (
        <nav className="border-t border-border bg-background shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="border-b border-border py-3 text-sm font-bold"
            >
              Home
            </Link>

            <Link
              href="/latest"
              onClick={() => setOpen(false)}
              className="border-b border-border py-3 text-sm font-bold"
            >
              Latest
            </Link>

            {navLinks.map((link) => (
              <Link
                key={`mobile-${link.href}-${link.label}`}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-sm font-bold"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-3 py-5">
              {socialLinks.map((social) => (
                <a
                  key={`mobile-${social.label}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border text-xs font-black transition hover:border-red-700 hover:bg-red-700 hover:text-white"
                >
                  {social.symbol}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
