import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { StoryImage } from '@/components/story-image'
import {
  type Story,
  getCategoryName,
  formatDate,
} from '@/lib/news-data'

function CategoryTag({
  category,
}: {
  category: Story['category']
}) {
  return (
    <span className="inline-flex rounded-sm bg-primary px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
      {getCategoryName(category)}
    </span>
  )
}

export function StoryCard({
  story,
  variant = 'default',
}: {
  story: Story
  variant?: 'default' | 'compact' | 'feature'
}) {
  const href = `/story/${story.slug ?? story.id}`

  if (variant === 'compact') {
    return (
      <article className="group flex gap-4 border-b border-border pb-4 last:border-b-0">
        <Link
          href={href}
          className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-28"
          aria-label={story.title}
        >
          <StoryImage
            src={story.image}
            alt={story.title}
            sizes="112px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            category={story.category}
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <Link
            href={`/category/${story.category}`}
            className="self-start"
          >
            <CategoryTag category={story.category} />
          </Link>

          <h3 className="mt-2 line-clamp-3 font-serif text-base font-semibold leading-snug">
            <Link
              href={href}
              className="transition-colors hover:text-primary"
            >
              {story.title}
            </Link>
          </h3>

          <p className="mt-auto pt-2 text-right text-[0.7rem] uppercase tracking-wide text-muted-foreground">
            {formatDate(story.date)}
          </p>
        </div>
      </article>
    )
  }

  const feature = variant === 'feature'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`relative w-full overflow-hidden bg-muted ${
          feature ? 'aspect-[16/9]' : 'aspect-[3/2]'
        }`}
      >
        <StoryImage
          src={story.image}
          alt={story.title}
          sizes={
            feature
              ? '(max-width: 768px) 100vw, 66vw'
              : '(max-width: 768px) 100vw, 33vw'
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          category={story.category}
        />

        <Link
          href={href}
          className="absolute inset-0 z-10"
          aria-label={story.title}
        />

        <Link
          href={`/category/${story.category}`}
          className="absolute left-3 top-3 z-30"
        >
          <CategoryTag category={story.category} />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-20 sm:px-5 sm:pb-5">
          <h3
            className={`line-clamp-4 font-serif font-bold leading-tight text-white drop-shadow-lg ${
              feature
                ? 'text-2xl sm:text-3xl lg:text-4xl'
                : 'text-xl sm:text-[1.35rem]'
            }`}
          >
            {story.title}
          </h3>

          <div className="mt-3 flex items-end justify-between gap-3">
            {story.author ? (
              <p className="line-clamp-1 text-xs text-white/90">
                By {story.author}
              </p>
            ) : (
              <span />
            )}

            <p className="shrink-0 text-right text-[0.68rem] font-medium uppercase tracking-wide text-white/90">
              {formatDate(story.date)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {story.summary && (
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {story.summary}
          </p>
        )}

        {story.communityAngle && (
          <div className="mt-4 rounded-md border-l-2 border-accent bg-secondary p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Community Angle
            </p>

            <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-foreground/80">
              {story.communityAngle}
            </p>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="line-clamp-1 text-xs text-muted-foreground">
            Source: {story.sourceName}
          </span>

          <a
            href={story.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Original source
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </article>
  )
}
