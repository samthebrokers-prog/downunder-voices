import type { Metadata } from 'next'
import { Mail, MessageSquare, Newspaper } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Downunder Voices with news tips, community stories, advertising enquiries or general feedback.',
}

const channels = [
  {
    icon: Mail,
    title: 'General enquiries',
    detail: 'Email us or use the secure contact form.',
  },
  {
    icon: Newspaper,
    title: 'News tips and stories',
    detail:
      'Send us community news, story ideas, photos or information through the form.',
  },
  {
    icon: MessageSquare,
    title: 'Feedback and corrections',
    detail:
      'Contact us about feedback, corrections or concerns regarding published content.',
  },
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b-4 border-red-700 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
          Get in touch
        </p>

        <h1 className="mt-2 font-serif text-4xl font-black text-foreground sm:text-5xl">
          Contact Downunder Voices
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          Have a news tip, community story, advertising enquiry or feedback?
          We would be pleased to hear from you.
        </p>
      </header>

      <div className="mt-10 grid gap-10 md:grid-cols-5">
        <div className="space-y-4 md:col-span-2">
          {channels.map((channel) => {
            const Icon = channel.icon

            return (
              <div
                key={channel.title}
                className="flex gap-4 rounded-lg border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-red-700 text-white">
                  <Icon className="size-5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    {channel.title}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {channel.detail}
                  </p>
                </div>
              </div>
            )
          })}

          <div className="rounded-lg border border-border bg-slate-950 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-400">
              Email
            </p>

            <a
              href="mailto:editor@downundervoices.com"
              className="mt-2 inline-block break-all text-sm font-semibold hover:underline"
            >
              editor@downundervoices.com
            </a>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Please include your name, contact details and enough information
              for us to understand your enquiry.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
