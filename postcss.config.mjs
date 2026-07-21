import type { Metadata } from 'next'
import { SubmitStoryForm } from '@/components/submit-story-form'

export const metadata: Metadata = {
  title: 'Submit Your Story',
  description:
    'Share your community story with Downunder Voices. Tell us what matters to your neighbourhood across New Zealand, Australia and the Pacific.',
}

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="border-b-2 border-primary pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Get Involved
        </p>
        <h1 className="mt-1 font-serif text-4xl font-bold text-foreground text-balance">
          Submit Your Story
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          Downunder Voices is powered by the community. If something is
          happening in your neighbourhood — a local hero, an issue that needs
          attention, or a celebration worth sharing — we would love to hear
          about it.
        </p>
      </header>

      <div className="mt-8">
        <SubmitStoryForm />
      </div>
    </div>
  )
}
