import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SOCIAL_POSTS, embedUrl } from '@/lib/social-posts'

// Public Facebook posts and YouTube videos about the NZ Government. Hidden when empty.
export function SocialVoices({ limit, showLink = true }: { limit?: number; showLink?: boolean }) {
  const posts = (limit ? SOCIAL_POSTS.slice(0, limit) : SOCIAL_POSTS).filter(p => embedUrl(p))
  if (!posts.length) return null
  return (
    <section className="mt-12 rounded-xl border border-slate-300 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-900">From Facebook &amp; YouTube</p>
          <h2 className="mt-1 font-serif text-3xl font-black text-slate-950">Voices on the Government</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Videos of the Prime Minister, ACT and the Opportunity Party after the 2026 election, shared for discussion. Views are the authors&apos; own, not Downunder Voices&apos;.</p>
        </div>
        {showLink && <Link href="/from-facebook" className="inline-flex items-center gap-1 text-sm font-black text-neutral-900 hover:underline">See all <ArrowRight className="size-4"/></Link>}
      </div>
      <div className="mt-6 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(p => (
          <article key={p.url} className="flex flex-col gap-3">
            {p.platform === 'youtube'
              ? <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ aspectRatio: '16 / 9' }}><iframe src={embedUrl(p)!} title={p.note ?? 'YouTube video'} className="absolute inset-0 h-full w-full" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div>
              : <iframe src={embedUrl(p)!} title={p.note ?? 'Facebook post'} width="100%" height="560" className="w-full overflow-hidden rounded-lg border border-slate-200" style={{ border: 'none' }} loading="lazy" scrolling="no" allow="encrypted-media; picture-in-picture; web-share" allowFullScreen/>}
            {p.note && <p className="text-sm leading-6 text-slate-700">{p.note}</p>}
            <a href={p.url} target="_blank" rel="noopener noreferrer nofollow" className="text-xs font-bold text-slate-500 hover:underline">View on {p.platform === 'youtube' ? 'YouTube' : 'Facebook'} · added {p.added}</a>
          </article>
        ))}
      </div>
    </section>
  )
}
