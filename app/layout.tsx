import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'

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
      'Downunder Voices — Independent News Australia, New Zealand & World',
    template: '%s | Downunder Voices',
  },

  description:
    'Downunder Voices is a free independent news website covering Australia, New Zealand and the world, with breaking news, politics, business, community, sport, cost of living, opinion and global affairs.',

  keywords: [
    'Australian news website',
    'New Zealand news website',
    'Australia news',
    'New Zealand news',
    'world news',
    'independent news website',
    'free independent news',
    'online news Australia',
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
    title: 'Downunder Voices — Independent News Australia & New Zealand',
    description:
      'Free independent news and opinion from Australia, New Zealand and the world.',
    url: siteUrl,
    siteName: 'Downunder Voices',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Downunder Voices — Independent News Australia & New Zealand',
    description:
      'Free independent news and opinion from Australia, New Zealand and the world.',
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

        <main>{children}</main>

        <SiteFooter />

        <Analytics />
      </body>
    </html>
  )
}
