import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'

import { StoryImage } from '@/components/story-image'
import {
  type Story,
  formatDate,
  getCategoryName,
} from '@/lib/news-data'

function getDisplayCategoryName(
  category: Story['category'],
) {
  if (category === 'editorial-view') {
    return 'Editorial'
  }

  return getCategoryName(category)
}

function CategoryTag({
  category,
}: {
  category: Story['category']
}) {
  return (
    <span className="inline-flex rounded-sm bg-primary px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
      {getDisplayCategoryName(category)}
    </span>
  )
}

export function StoryCard({
  story,
  variant = 'default',
  imageIndex,
}: {
  story: Story
  variant?: 'default' | 'compact' | 'feature'
  imageIndex?: number
}) {
  const href = `/story/${story.slug ?? story.id}`

  if (variant === 'compact') {
    return (
      <article className="group flex gap-4">
        <Link
          href={href}
          className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-muted sm:w-24"
          aria-label={story.title}
        >
          <StoryImage
            src={story.image}
            alt={story.title}
            sizes="96px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            category={story.category}
            imageIndex={imageIndex}
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <Link
            href={`/category/${story.category}`}
            className="self-start text-[0.65rem] font-bold uppercase tracking-[0.12em] text-primary hover:underline"
          >
            {getDisplayCategoryName(
              story.category,
            )}
          </Link>

          <h3 className="mt-1.5 line-clamp-3 font-serif text-base font-bold leading-snug">
            <Link
              href={href}
              className="transition-colors hover:text-primary"
            >
              {story.title}
            </Link>
          </h3>

          <p className="mt-auto pt-2 text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground">
            {formatDate(story.date)}
          </p>
        </div>
      </article>
    )
  }

  if (variant === 'feature') {
    return (
      <article className="group overflow-hidden bg-card">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <StoryImage
            src={story.image}
            alt={story.title}
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            category={story.category}
            imageIndex={imageIndex}
          />

          <Link
            href={href}
            className="absolute inset-0 z-10"
            aria-label={story.title}
          />

          <Link
            href={`/category/${story.category}`}
            className="absolute left-4 top-4 z-30"
          >
            <CategoryTag
              category={story.category}
            />
          </Link>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-5 pb-5 pt-28 sm:px-7 sm:pb-7">
            <h2 className="max-w-4xl font-serif text-2xl font-black leading-tight text-white drop-shadow-lg sm:text-3xl lg:text-4xl">
              {story.title}
            </h2>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/90">
              {story.author ? (
                <p className="font-medium">
                  By {story.author}
                </p>
              ) : (
                <p className="font-medium">
                  {story.sourceName}
                </p>
              )}

              <p className="font-semibold uppercase tracking-wide">
                {formatDate(story.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {story.summary && (
            <p className="line-clamp-3 text-base leading-7 text-muted-foreground">
              {story.summary}
            </p>
          )}

          {story.communityAngle && (
            <div className="mt-5 rounded-md border-l-4 border-accent bg-secondary p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-accent">
                Why this matters
              </p>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground/80">
                {story.communityAngle}
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Source: {story.sourceName}
            </span>

            <Link
              href={href}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              Continue reading
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <StoryImage
          src={story.image}
          alt={story.title}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          category={story.category}
          imageIndex={imageIndex}
        />

        <Link
          href={href}
          className="absolute inset-0 z-10"
          aria-label={story.title}
        />

        <Link
          href={`/category/${story.category}`}
          className="absolute left-3 top-3 z-20"
        >
          <CategoryTag
            category={story.category}
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {formatDate(story.date)}
        </p>

        <h3 className="mt-2 line-clamp-3 font-serif text-xl font-bold leading-snug text-foreground">
          <Link
            href={href}
            className="transition-colors hover:text-primary"
          >
            {story.title}
          </Link>
        </h3>

        {story.summary && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {story.summary}
          </p>
        )}

        {story.communityAngle && (
          <div className="mt-4 rounded-md border-l-2 border-accent bg-secondary p-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-wide text-accent">
              Community angle
            </p>

            <p className="mt-1 line-clamp-2 text-sm leading-6 text-foreground/80">
              {story.communityAngle}
            </p>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="min-w-0 line-clamp-1 text-xs text-muted-foreground">
            Source: {story.sourceName}
          </span>

          <a
            href={story.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            Original source
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </article>
  )
}
