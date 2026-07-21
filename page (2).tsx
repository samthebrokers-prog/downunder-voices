import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Downunder Voices is a community news and opinion platform for New Zealand, Australia and Pacific communities.',
}

const values = [
  {
    title: 'Community first',
    body: 'We put the people of our neighbourhoods at the centre of every story — migrants, small business owners, volunteers and families.',
  },
  {
    title: 'Honest commentary',
    body: 'We summarise and add a community angle, and we always point you back to the original reporting so you can judge for yourself.',
  },
  {
    title: 'Across the region',
    body: 'From Aotearoa New Zealand to Australia and the wider Pacific, we cover the issues that connect us on both sides of the Tasman.',
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="border-b-2 border-primary pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Our Story
        </p>

        <h1 className="mt-1 font-serif text-4xl font-bold text-foreground text-balance">
          About Downunder Voices
        </h1>
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              Downunder Voices is a community news and opinion platform for New
              Zealand, Australia and Pacific communities. We exist to amplify
              the stories that big headlines often overlook — the local hero,
              the struggling small business, the volunteer keeping a food bank
              stocked, and the family navigating the cost of living.
            </p>

            <p>
              We cover politics, business, sport, community and the everyday
              issues shaping life across the region. Alongside the news, our{' '}
              <span className="font-semibold text-primary">
                Editorial View
              </span>{' '}
              section offers honest commentary designed to encourage informed
              discussion.
            </p>

            <p>
              We believe journalism is stronger when the community helps tell
              it. That is why anyone can submit a story, and why every summary
              links back to the original source.
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border">
            <Image
              src="/news/community-hub.png"
              alt="Community members gathering together"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="border-b-2 border-primary pb-2 font-serif text-2xl font-bold text-foreground">
          What we stand for
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-lg border border-border bg-card p-5"
            >
              <h3 className="font-serif text-lg font-bold text-foreground">
                {value.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
