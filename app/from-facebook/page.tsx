import type { Metadata } from 'next'
import { SocialVoices } from '@/components/social-voices'

export const metadata: Metadata = {
  title: 'Voices on the Government — From Facebook & YouTube | Downunder Voices',
  description: 'Public Facebook posts and YouTube videos about the New Zealand National, ACT and NZ First government, shared for discussion.',
}

export default function FromFacebookPage() {
  return <main className="mx-auto max-w-7xl px-4 py-6 pb-16 sm:px-6 lg:px-8"><SocialVoices showLink={false}/></main>
}
