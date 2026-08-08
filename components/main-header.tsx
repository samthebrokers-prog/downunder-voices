'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { categories } from '@/lib/news-data'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/latest', label: 'Latest' },

  ...categories
    .filter((category) => category.slug !== 'editorial-view')
    .map((category) => ({
      href: `/category/${category.slug}`,
      label: category.name === "Sam's View" ? 'Opinion' : category.name,
    })),

  { href: '/category/editorial-view', label: 'Opinion' },
  { href: '/submit', label: 'Submit Your Story' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function MainHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="flex flex-col"
            onClick={() => setOpen(false)}
          >
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Downunder Voices
            </span>

            <span className="mt-1 text-sm text-slate-500">
              Australia · New Zealand · World
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-700 hover:bg-slate-50 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="hidden border-t border-slate-100 lg:block">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="transition-colors hover:text-red-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {open && (
          <nav className="border-t border-slate-100 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-red-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
