'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { categories } from '@/lib/news-data'

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
      <div className="border-b border-border bg-secondary/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <span>{today}</span>

          <Link
            href="/advertise"
            className="font-semibold text-primary hover:underline"
          >
            Advertise with us
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="block" onClick={() => setOpen(false)}>
          <span className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            Downunder Voices
          </span>

          <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
            New Zealand · Australia · Pacific
          </span>
        </Link>

        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-border lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <nav className="hidden border-t border-border lg:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-semibold transition-colors hover:text-primary"
          >
            Home
          </Link>

          <Link
            href="/latest"
            className="text-sm font-semibold transition-colors hover:text-primary"
          >
            Latest
          </Link>

          {navLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="text-sm font-semibold transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {open && (
        <nav className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="border-b border-border py-3 text-sm font-semibold"
            >
              Home
            </Link>

            <Link
              href="/latest"
              onClick={() => setOpen(false)}
              className="border-b border-border py-3 text-sm font-semibold"
            >
              Latest
            </Link>

            {navLinks.map((link) => (
              <Link
                key={`mobile-${link.href}-${link.label}`}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-sm font-semibold last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
