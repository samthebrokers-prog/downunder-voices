import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'

import { LiveElectionBanner } from '@/components/live-election-banner'
import { MainHeader } from '@/components/main-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const siteUrl = 'https://www.downundervoices.com'

const productionReady = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      'Downunder Voices — Independent News from Australia, New Zealand & the World',
    template: '%s | Downunder Voices',
  },

  description:
    'Downunder Voices is an independent news and opinion platform covering Australia, New Zealand and the world, with reporting on politics, business, community, sport, cost of living and global affairs.',

  keywords: [
    'Australia news',
    'New Zealand news',
    'world news',
    'independent news',
    'community news',
    'business news',
    'politics',
    'cost of living',
    'sport',
    'opinion',
  ],

  robots: productionReady
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
      },

  openGraph: {
    title: 'Downunder Voices',
    description:
      'Independent voices from Australia, New Zealand & the World.',
    url: siteUrl,
    siteName: 'Downunder Voices',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Downunder Voices',
    description:
      'Independent voices from Australia, New Zealand & the World.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4637457052016842"
          crossOrigin="anonymous"
        />
      </head>

      <body>
        <MainHeader />
        <LiveElectionBanner />

        <main>{children}</main>

        <SiteFooter />

        <Analytics />
      </body>
    </html>
  )
}
