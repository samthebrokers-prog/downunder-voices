import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'About Us',
  description:
    'Learn about Downunder Voices, an independent community news platform serving New Zealand, Australia and the Pacific.',
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
          Downunder Voices is an independent digital news and community
          platform serving readers across Aotearoa New Zealand, Australia and
          the Pacific. We publish news, community stories, business updates,
          informed opinion and public-interest information relevant to everyday
          people.
        </p>
      </section>

      <section className="grid gap-8 py-10 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-bold">Our purpose</h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Our purpose is to provide clear, accessible and useful information
            about the issues affecting local communities, migrants, families,
            workers and small businesses. Our coverage includes politics,
            business, community affairs, sport, culture, cost of living and
            developments affecting life across the region.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold">
            Our editorial approach
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            We aim to report fairly, distinguish news from opinion and identify
            original sources clearly. Articles may be prepared from official
            statements, public records, direct community contributions and
            independently produced reporting. Where another publisher is the
            original source, we provide attribution and encourage readers to
            consult that source for the full report.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-secondary/60 p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold">
          Communities we serve
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Downunder Voices is created for people across New Zealand, Australia
          and the wider Pacific, including migrant communities, regional
          communities, local organisations, independent businesses and readers
          seeking practical and relevant news.
        </p>

        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          We welcome community announcements, local achievements, informed
          opinion, business developments and stories that may not receive
          sufficient attention elsewhere.
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
          Downunder Voices acknowledges Aboriginal and Torres Strait Islander
          peoples as the First Peoples of Australia and recognises their
          continuing connection to land, waters, culture and community. We pay
          our respects to Elders past and present.
        </p>

        <p className="mt-4 leading-7 text-muted-foreground">
          In Aotearoa New Zealand, we recognise Māori as tangata whenua and
          acknowledge the enduring importance of whakapapa, whenua, language,
          culture and partnership.
        </p>

        <p className="mt-4 leading-7 text-muted-foreground">
          We also acknowledge the histories, cultures and communities of the
          Pacific and the many people from across the world who now call this
          region home.
        </p>
      </section>

      <section className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-bold">
            Corrections and accountability
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Accuracy matters to us. We welcome corrections, clarifications and
            constructive feedback. Where a material error is confirmed, we
            will review the article and publish an appropriate correction or
            clarification.
          </p>

          <Link
            href="/corrections"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Read our corrections policy
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold">
            Transparency and independence
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Downunder Voices operates independently. Advertising, sponsorship
            or commercial relationships do not determine our editorial
            conclusions. Sponsored or promotional material will be identified
            clearly where applicable.
          </p>

          <Link
            href="/editorial-policy"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Read our editorial policy
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
