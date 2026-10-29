import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'About Downunder Voices',
  description: 'About Downunder Voices, an independent news and community platform covering Australia, New Zealand and the world.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="border-b-2 border-primary pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">About Downunder Voices</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight sm:text-5xl">Giving communities a voice. Holding power accountable.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Downunder Voices is a free independent news and community website for readers in Australia, New Zealand and beyond. We bring together stories that matter to everyday people, including housing, cost of living, small business, community, trade, politics, sport and culture.</p>
      </section>

      <section className="grid gap-8 py-10 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-bold">What you’ll find here</h2>
          <p className="mt-4 leading-7 text-muted-foreground">We publish original Downunder Voices commentary, editorials and our Cartoon of the Day, alongside concise coverage of important reporting from other publishers and official organisations.</p>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold">How we work</h2>
          <p className="mt-4 leading-7 text-muted-foreground">When a story is based on another publisher’s reporting, we identify the source and provide a link to the original report. Our own work is identified as Downunder Voices original content or carries an author or editorial byline.</p>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-secondary/60 p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold">Original work matters</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">Our aim is not simply to repeat the news. Downunder Voices adds community perspective, practical context and independent opinion, while making it easy for readers to reach the original source when we summarise outside reporting.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/downunder-original" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Downunder Originals <ArrowRight className="size-4" /></Link>
          <Link href="/cartoon-of-the-day" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted">Cartoon of the Day <ArrowRight className="size-4" /></Link>
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-6">
          <h2 className="font-serif text-2xl font-bold">Corrections & accountability</h2>
          <p className="mt-4 leading-7 text-muted-foreground">We welcome corrections and feedback. If we identify a material error, we review it and make an appropriate correction.</p>
          <Link href="/corrections" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Corrections policy <ArrowRight className="size-4" /></Link>
        </div>
        <div className="rounded-lg border border-border p-6">
          <h2 className="font-serif text-2xl font-bold">Tell us what matters</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Community stories, informed opinion and local issues are welcome. Readers can submit a story, suggest a topic or contact us directly.</p>
          <div className="mt-5 flex gap-4"><Link href="/submit" className="font-semibold text-primary">Submit a Story</Link><Link href="/contact" className="font-semibold text-primary">Contact us</Link></div>
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-border p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold">Acknowledgement of Country</h2>
        <p className="mt-4 leading-7 text-muted-foreground">Downunder Voices acknowledges the Aboriginal and Torres Strait Islander peoples as the First Peoples of Australia and recognises their continuing connection to land, waters, culture and community. We pay our respects to Elders past and present.</p>
        <p className="mt-4 leading-7 text-muted-foreground">In Aotearoa New Zealand, we recognise Māori as tangata whenua and acknowledge the enduring importance of whakapapa, whenua, language and culture.</p>
      </section>

      <section className="mt-10 border-t border-border pt-8">
        <p className="leading-7 text-muted-foreground">For more detail on sourcing, opinion, corrections and editorial standards, read our <Link href="/editorial-policy" className="font-semibold text-primary">Editorial Policy</Link>.</p>
      </section>
    </main>
  )
}
