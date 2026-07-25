import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const siteUrl = 'https://downundervoices.com'
const productionReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Downunder Voices — Community News for New Zealand, Australia & the Pacific',
    template: '%s | Downunder Voices',
  },
  description:
    'Downunder Voices is a community news and opinion platform covering New Zealand, Australia and Pacific communities — migrants, small business, sport, cost of living, politics and community voices.',
  keywords: [
    'New Zealand news',
    'Australia news',
    'Pacific news',
    'community news',
    'migrants',
    'small business',
    'cost of living',
    'politics',
  ],
  robots: productionReady ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: 'Downunder Voices',
    description:
      'Community news and voices from New Zealand, Australia and the Pacific.',
    url: siteUrl,
    siteName: 'Downunder Voices',
    type: 'website',
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
    <html
      lang="en"
      className="bg-background"
    >
      <body className="font-sans antialiased flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
