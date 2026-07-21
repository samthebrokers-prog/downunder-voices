import type { Metadata } from 'next'
import { Mail, MessageSquare, Newspaper } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Downunder Voices — send us a tip, a question or feedback.',
}

const channels = [
  {
    icon: Mail,
    title: 'General enquiries',
    detail: 'Use the secure form on this page.',
  },
  {
    icon: Newspaper,
    title: 'News tips',
    detail: 'Send your tip through the form or Submit Your Story page.',
  },
  {
    icon: MessageSquare,
    title: 'Feedback',
    detail: 'We read every message and reply as soon as we can.',
  },
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="border-b-2 border-primary pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Get In Touch
        </p>
        <h1 className="mt-1 font-serif text-4xl font-bold text-foreground text-balance">
          Contact Us
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          Have a tip, a question, or feedback? We would love to hear from you.
          Reach out using the details below or send us a message.
        </p>
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-5">
        <div className="space-y-4 md:col-span-2">
          {channels.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.title}
                className="flex gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {c.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.detail}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="md:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
