'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { categories } from '@/lib/news-data'

const navLinks = [
  ...categories.map((c) => ({
    href: `/category/${c.slug}`,
    label: c.name === "Sam's View" ? 'Opinion' : c.name,
  })),
  { href: '/submit', label: 'Submit Your Story' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
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
    <header className="border-b border-border bg-background">
      {/* Top strip */}
      <div className="border-b border-border bg-secondary">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline" suppressHydrationWarning>
            {today}
          </span>

          <span className="font-medium uppercase tracking-wide">
            NZ &middot; Australia &middot; Pacific
          </span>
        </div>
      </div>

      {/* Masthead */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-5">
        <Link href="/" className="group flex shrink-0 flex-col">
          <span className="font-serif text-3xl font-bold leading-none tracking-tight text-foreground sm:text-4xl">
            Downunder <span className="text-primary">Voices</span>
          </span>

          <span className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Community News &amp; Views
          </span>
        </Link>

        <p className="hidden max-w-xl text-right text-xs leading-relaxed text-muted-foreground lg:block">
          Downunder Voices acknowledges the Traditional Custodians of Country
          throughout Australia and recognises their continuing connection to
          land, waters and community. We pay our respects to Aboriginal and
          Torres Strait Islander peoples and to Elders past and present.
        </p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium lg:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
          Menu
        </button>
      </div>

      {/* Primary navigation */}
      <nav
        aria-label="Primary"
        className="hidden border-t border-border bg-foreground lg:block"
      >
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 px-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-block py-3 text-sm font-medium text-background/80 transition-colors hover:text-background"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile navigation */}
      {open && (
        <nav
          aria-label="Mobile"
          className="border-t border-border bg-background lg:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border py-3 text-sm font-medium text-foreground last:border-b-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
