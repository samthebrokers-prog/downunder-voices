import { decodeNewsText } from '@/lib/decode-news-text'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { StoryImage } from '@/components/story-image'
import { type Story, formatDate, getCategoryName } from '@/lib/news-data'

function getDisplayCategoryName(category: Story['category']) {
  return category === 'editorial-view' ? 'Editorial' : getCategoryName(category)
}
function cleanSourceName(name?: string | null) {
  const value = (name || '').trim()
  if (!value || /^https?:\/\//i.test(value) || /rss\.xml/i.test(value)) return 'News source'
  return value
}
function CategoryTag({ category }: { category: Story['category'] }) {
  return <span className="inline-flex bg-red-700 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-wider text-white">{getDisplayCategoryName(category)}</span>
}

export function StoryCard({ story, variant = 'default', imageIndex }: { story: Story; variant?: 'default' | 'compact' | 'feature'; imageIndex?: number }) {
  const href = `/story/${story.slug ?? story.id}`
  const sourceName = cleanSourceName(story.sourceName)

  if (variant === 'compact') return <article className="group flex gap-4 border-b border-slate-200 pb-4"><Link href={href} className="relative aspect-square w-24 shrink-0 overflow-hidden bg-slate-100" aria-label={decodeNewsText(story.title)}><StoryImage src={story.image} alt={decodeNewsText(story.title)} sizes="96px" className="object-cover transition-transform duration-300 group-hover:scale-105" category={story.category} imageIndex={imageIndex}/></Link><div className="min-w-0"><Link href={`/category/${story.category}`} className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-red-700">{getDisplayCategoryName(story.category)}</Link><h3 className="mt-1 line-clamp-3 font-serif text-lg font-black leading-tight"><Link href={href} className="hover:text-red-700">{decodeNewsText(story.title)}</Link></h3><p className="mt-2 text-[0.68rem] font-semibold uppercase text-slate-500">{formatDate(story.date)}</p></div></article>

  if (variant === 'feature') return <article className="group grid overflow-hidden bg-white lg:grid-cols-[1.35fr_1fr]"><div className="relative aspect-[16/9] min-h-[260px] overflow-hidden bg-slate-200 lg:aspect-auto lg:min-h-[430px]"><StoryImage src={story.image} alt={decodeNewsText(story.title)} sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" category={story.category} imageIndex={imageIndex}/><Link href={href} className="absolute inset-0 z-10" aria-label={decodeNewsText(story.title)}/><Link href={`/category/${story.category}`} className="absolute left-5 top-5 z-20"><CategoryTag category={story.category}/></Link></div><div className="flex min-w-0 flex-col justify-center border-t border-slate-200 p-6 sm:p-8 lg:border-l lg:border-t-0"><p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">Top Story · {formatDate(story.date)}</p><h2 className="mt-4 break-words font-serif text-3xl font-black leading-[1.06] tracking-tight text-slate-950 sm:text-4xl lg:text-[2.65rem]"><Link href={href} className="hover:text-red-700">{decodeNewsText(story.title)}</Link></h2>{story.summary&&<p className="mt-5 line-clamp-4 text-base leading-7 text-slate-600">{decodeNewsText(story.summary)}</p>}<div className="mt-7 border-t border-slate-200 pt-5"><p className="text-xs text-slate-500">{story.author ? `By ${story.author}` : sourceName}</p><Link href={href} className="mt-4 inline-flex items-center gap-2 font-black text-red-700">Read full story <ArrowRight className="size-4"/></Link></div></div></article>

  return <article className="group flex h-full flex-col border-t-4 border-slate-950 bg-white pt-3"><div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100"><StoryImage src={story.image} alt={decodeNewsText(story.title)} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" category={story.category} imageIndex={imageIndex}/><Link href={href} className="absolute inset-0 z-10" aria-label={decodeNewsText(story.title)}/><Link href={`/category/${story.category}`} className="absolute left-3 top-3 z-20"><CategoryTag category={story.category}/></Link></div><div className="flex flex-1 flex-col py-4"><p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-slate-500">{formatDate(story.date)}</p><h3 className="mt-2 line-clamp-3 font-serif text-xl font-black leading-tight text-slate-950"><Link href={href} className="hover:text-red-700">{decodeNewsText(story.title)}</Link></h3>{story.summary&&<p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{decodeNewsText(story.summary)}</p>}<div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-4"><span className="min-w-0 line-clamp-1 text-xs font-semibold text-slate-500">{sourceName}</span>{story.sourceUrl&&<a href={story.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-red-700">Original <ArrowUpRight className="size-3.5"/></a>}</div></div></article>
}
