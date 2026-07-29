'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Story } from '@/lib/news-data'

type BreakingNewsTickerProps = {
  stories: Story[]
}

export function BreakingNewsTicker({
  stories,
}: BreakingNewsTickerProps) {
  if (!stories.length) {
    return null
  }

  const repeatedStories = [...stories, ...stories]

  return (
    <section
      aria-label="Breaking news"
      className="border-b border-red-900 bg-red-700 text-white"
    >
      <div className="mx-auto flex max-w-7xl items-stretch">
        <div className="relative z-20 flex shrink-0 items-center bg-red-900 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] sm:px-6">
          Breaking
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="breaking-news-track flex w-max items-center">
            {repeatedStories.map((story, index) => (
              <Link
                key={`${story.id}-${index}`}
                href={`/story/${story.slug ?? story.id}`}
                className="flex shrink-0 items-center gap-3 px-6 py-3 text-sm font-semibold transition hover:bg-red-800"
              >
                <span className="inline-block size-1.5 rounded-full bg-white" />

                <span className="whitespace-nowrap">
                  {story.title}
                </span>
              </Link>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-red-700 to-transparent" />

          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-red-700 to-transparent" />
        </div>

        <Link
          href="/latest"
          className="relative z-20 hidden shrink-0 items-center gap-2 border-l border-red-500 bg-red-700 px-5 py-3 text-xs font-bold uppercase tracking-wide transition hover:bg-red-800 sm:flex"
        >
          All News
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  )
}
