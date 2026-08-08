import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react'

import { categories } from '@/lib/news-data'

const websiteUrl = 'https://www.downundervoices.com'

const informationLinks = [
  { label: 'About', href: '/about' },
  { label: 'Submit a Story', href: '/submit' },
  { label: 'Contact', href: '/contact' },
  { label: 'Latest News', href: '/latest' },
  { label: 'Advertise', href: '/advertise' },
]

const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Editorial Policy', href: '/editorial-policy' },
  { label: 'Corrections', href: '/corrections' },
  { label: 'Copyright', href: '/copyright' },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: Instagram,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    icon: Linkedin,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/',
    icon: Youtube,
  },
]

const qrCodeUrl =
  `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    websiteUrl,
  )}`

export function SiteFooter() {
  const footerCategories = categories
    .filter(
      (category) =>
        category.slug !== 'editorial-view',
    )
    .map((category) => ({
      href: `/category/${category.slug}`,
      label: category.name,
    }))

  return (
    <footer className="mt-16 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="inline-flex flex-col"
            >
              <span className="font-serif text-2xl font-black tracking-tight">
                DOWNUNDER
              </span>

              <span className="font-serif text-2xl font-black tracking-tight text-red-500">
                VOICES
              </span>

              <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Australia · New Zealand · World
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
              Independent journalism covering Australia,
              New Zealand and the world, with a focus on
              social issues, small business, community
              voices and stories that matter to everyday
              people.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-slate-700 text-slate-200 transition hover:border-red-600 hover:bg-red-700 hover:text-white"
                  >
                    <Icon className="size-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-red-400">
              News Sections
            </h2>

            <ul className="mt-5 space-y-3 text-sm">
              {footerCategories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-slate-300 transition hover:text-white"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/category/editorial-view"
                  className="text-slate-300 transition hover:text-white"
                >
                  Opinion
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-red-400">
              Information
            </h2>

            <ul className="mt-5 space-y-3 text-sm">
              {informationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-sm font-black uppercase tracking-[0.16em] text-red-400">
              Legal
            </h2>

            <ul className="mt-5 space-y-3 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-red-400">
              Read on Mobile
            </h2>

            <div className="mt-5 rounded-xl border border-slate-700 bg-white p-4">
              <img
                src={qrCodeUrl}
                alt="QR code linking to Downunder Voices"
                width={190}
                height={190}
                loading="lazy"
                className="mx-auto h-auto w-full max-w-[190px] rounded-md"
              />

              <p className="mt-4 text-center text-sm font-bold text-slate-950">
                Scan to open Downunder Voices
              </p>

              <p className="mt-2 text-center text-xs leading-5 text-slate-600">
                Read the latest stories on your phone.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs leading-6 text-slate-400">
            <strong className="text-slate-200">
              Editorial note:
            </strong>{' '}
            Summaries and community commentary do not
            replace original reporting. Readers should
            follow source links for complete reports and
            official statements where applicable.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Downunder Voices.
            All rights reserved.
          </p>

          <p>
            Giving Communities a Voice. Holding Power
            Accountable.
          </p>
        </div>
      </div>
    </footer>
  )
}
