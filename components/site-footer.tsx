import Link from 'next/link'
import { categories } from '@/lib/news-data'

const websiteUrl = 'https://www.downundervoices.com'

const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Editorial Policy', href: '/editorial-policy' },
  { label: 'Corrections', href: '/corrections' },
  { label: 'Copyright', href: '/copyright' },
  { label: 'Advertise', href: '/advertise' },
]

const informationLinks = [
  { label: 'About', href: '/about' },
  { label: 'Submit a Story', href: '/submit' },
  { label: 'Contact', href: '/contact' },
  { label: 'Latest News', href: '/latest' },
]

const socialLinks = [
  {
    label: 'Facebook',
    symbol: 'f',
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      websiteUrl,
    )}`,
  },
  {
    label: 'X',
    symbol: 'X',
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      websiteUrl,
    )}&text=${encodeURIComponent(
      'Downunder Voices — New Zealand, Australia and Pacific news',
    )}`,
  },
  {
    label: 'LinkedIn',
    symbol: 'in',
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      websiteUrl,
    )}`,
  },
  {
    label: 'WhatsApp',
    symbol: '◉',
    href: `https://wa.me/?text=${encodeURIComponent(
      `Downunder Voices — ${websiteUrl}`,
    )}`,
  },
]

const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
  websiteUrl,
)}`

export function SiteFooter() {
  const footerCategories = categories
    .filter((category) => category.slug !== 'editorial-view')
    .map((category) => ({
      href: `/category/${category.slug}`,
      label: category.name === "Sam's View" ? 'Opinion' : category.name,
    }))

  return (
    <footer className="mt-16 border-t-4 border-red-700 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block">
              <span className="block font-serif text-2xl font-black tracking-tight sm:text-3xl">
                DOWNUNDER
                <span className="ml-2 text-red-500">VOICES</span>
              </span>

              <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                New Zealand · Australia · Pacific
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
              Independent news, community stories and diverse views from
              across New Zealand, Australia and the Pacific.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share Downunder Voices on ${social.label}`}
                  title={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-slate-700 text-xs font-black text-white transition hover:border-red-600 hover:bg-red-700"
                >
                  {social.symbol}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-400">
              News Sections
            </h2>

            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
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
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-400">
              Information
            </h2>

            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
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
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-400">
              Scan and Read
            </h2>

            <div className="mt-5 flex max-w-xs items-center gap-4 rounded-xl border border-slate-700 bg-white p-3">
              <img
                src={qrCodeUrl}
                alt="QR code linking to Downunder Voices"
                width={112}
                height={112}
                loading="lazy"
                className="size-28 rounded-md"
              />

              <div className="text-slate-950">
                <p className="text-sm font-bold">Take us with you</p>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Scan this QR code to open Downunder Voices on your phone.
                </p>
              </div>
            </div>

            <a
              href={websiteUrl}
              className="mt-4 inline-block break-all text-xs text-slate-400 transition hover:text-white"
            >
              downundervoices.com
            </a>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-slate-700 bg-slate-900 p-5">
          <p className="text-xs leading-6 text-slate-400">
            <strong className="text-slate-200">Editorial note:</strong>{' '}
            Summaries and community commentary do not replace original
            reporting. Readers should follow the source link for the
            publisher&apos;s complete report and official statements.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Downunder Voices. All rights reserved.
          </p>

          <p>Independent voices. Connected communities.</p>
        </div>
      </div>
    </footer>
  )
}
