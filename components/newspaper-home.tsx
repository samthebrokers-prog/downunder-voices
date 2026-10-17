import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { StoryCard } from '@/components/story-card'

export function NewspaperHome({ lead, stories }: { lead: any; stories: any[] }) {
  if (!lead) return null
  const side = stories.slice(0, 4)
  return (
    <section className="border-b border-slate-300 pb-7">
      <div className="mb-4 flex items-end justify-between border-b-4 border-slate-950 pb-2">
        <div><p className="text-xs font-black uppercase tracking-[.2em] text-red-700">Downunder Voices News Desk</p><h2 className="font-serif text-2xl font-black sm:text-3xl">Top Stories</h2></div>
        <Link href="/latest" className="flex items-center gap-1 text-sm font-black text-red-700">Latest <ArrowRight className="size-4"/></Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.65fr_.85fr]">
        <div className="overflow-hidden border-b-2 border-slate-950 pb-4 lg:border-b-0 lg:border-r lg:pr-6"><StoryCard story={lead} variant="feature" /></div>
        <div className="divide-y divide-slate-300">
          {side.map((story, i) => <Link key={story.id} href={`/story/${story.slug ?? story.id}`} className="group block py-4 first:pt-0"><p className="text-[11px] font-black uppercase tracking-[.16em] text-red-700">{i===0?'Latest':'News'}</p><h3 className="mt-1 font-serif text-xl font-black leading-tight text-slate-950 group-hover:text-red-700">{story.title}</h3>{story.summary && <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{story.summary}</p>}</Link>)}
        </div>
      </div>
      <div className="mt-6 grid gap-4 border-t border-slate-300 pt-5 sm:grid-cols-2 lg:grid-cols-4">{stories.slice(4,8).map(story => <StoryCard key={story.id} story={story}/>)}</div>
    </section>
  )
}
