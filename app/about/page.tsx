import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'About Us',
  description:
    'Learn about Downunder Voices, an independent community news platform for New Zealand, Australia and the Pacific.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="border-b-2 border-primary pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          About Downunder Voices
        </p>

        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          Independent news and community voices from across our region
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          Downunder Voices is an independent community news platform covering
          New Zealand, Australia and the Pacific. We focus on stories that
          matter to local communities, migrants, families, small businesses and
          people whose voices are often overlooked.
        </p>
      </section>

      <section className="grid gap-8 py-10 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-bold">
            Our purpose
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Our purpose is to provide clear, accessible and relevant news from
            across the region. We cover politics, business, community issues,
            sport, culture and developments affecting everyday life.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold">
            Our approach
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            We aim to present information fairly, identify original sources
            clearly and distinguish news reporting from opinion. Where a story
            comes from another publisher or official organisation, readers are
            encouraged to consult the original source for complete details.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-secondary/60 p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold">
          Communities we serve
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Downunder Voices is created for readers across Aotearoa New Zealand,
          Australia and the wider Pacific. We welcome community stories,
          informed opinion, local achievements, business developments and
          matters affecting diverse communities.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Submit your story
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Contact us
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-border p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold">
          Acknowledgement of Country
        </h2>

        <p className="mt-4 leading-7 text-muted-foreground">
          Downunder Voices acknowledges the Aboriginal and Torres Strait
          Islander peoples as the First Peoples of Australia and recognises
          their continuing connection to land, waters, culture and community.
          We pay our respects to Elders past and present.
        </p>

        <p className="mt-4 leading-7 text-muted-foreground">
          In Aotearoa New Zealand, we recognise Māori as tangata whenua and
          acknowledge the enduring importance of whakapapa, whenua, language
          and culture.
        </p>

        <p className="mt-4 leading-7 text-muted-foreground">
          We also acknowledge the rich histories, cultures and communities of
          the Pacific and the many people who now call this region home.
        </p>
      </section>

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-2xl font-bold">
          Editorial responsibility
        </h2>

        <p className="mt-4 leading-7 text-muted-foreground">
          We welcome corrections and feedback. Where an error is identified,
          we will review it and make an appropriate correction where necessary.
        </p>
      </section>
    </main>
  )
}
