import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Mail,
  Share2,
} from 'lucide-react'

import { StoryCard } from '@/components/story-card'
import { StoryImage } from '@/components/story-image'
import {
  formatDate,
  getCategoryName,
} from '@/lib/news-data'
import {
  getPublishedStories,
  getStoryBySlug,
} from '@/lib/story-service'

export const revalidate = 300

const siteUrl = 'https://www.downundervoices.com'

function getSocialImageUrl(
  image: string | null | undefined,
  slug: string,
): string {
  if (!image || image.startsWith('data:')) {
    return `${siteUrl}/api/social-image/${encodeURIComponent(slug)}`
  }

  if (
    image.startsWith('https://') ||
    image.startsWith('http://')
  ) {
    return image
  }

  return `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`
}

function getDisplayCategoryName(
  category: Parameters<typeof getCategoryName>[0],
): string {
  if (category === 'editorial-view') {
    return 'Editorial'
  }

  return getCategoryName(category)
}

function isGenuineExternalSource(
  sourceUrl: string | null | undefined,
): boolean {
  if (!sourceUrl) {
    return false
  }

  try {
    const url = new URL(sourceUrl)

    const hostname = url.hostname
      .toLowerCase()
      .replace(/^www\./, '')

    const fullUrl = sourceUrl.toLowerCase()

    if (
      hostname === 'downundervoices.com' ||
      hostname.endsWith('.downundervoices.com')
    ) {
      return false
    }

    if (
      hostname === 'bing.com' ||
      hostname.endsWith('.bing.com')
    ) {
      return false
    }

    if (hostname === 'news.google.com') {
      return false
    }

    if (
      fullUrl.includes('format=rss') ||
      fullUrl.includes('rss.xml') ||
      fullUrl.includes('/rss') ||
      fullUrl.includes('/feed') ||
      fullUrl.includes('output=rss')
    ) {
      return false
    }

    if (
      url.pathname.toLowerCase().includes('/search') &&
      url.search
    ) {
      return false
    }

    return (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    )
  } catch {
    return false
  }
}

function getSourceDisplayName(
  sourceName: string | null | undefined,
  sourceUrl: string | null | undefined,
): string {
  const cleanedName =
    sourceName?.trim() || ''

  if (
    cleanedName &&
    !/^https?:\/\//i.test(cleanedName)
  ) {
    return cleanedName
  }

  if (sourceUrl) {
    try {
      return new URL(sourceUrl).hostname
        .replace(/^www\./, '')
    } catch {
      return 'Original publisher'
    }
  }

  return 'Original publisher'
}

type StoryPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await getStoryBySlug(slug)

  if (!story) {
    return {
      title: 'Story not found',
    }
  }

  const storyUrl =
    `${siteUrl}/story/${story.slug ?? story.id}`

  const description =
    story.summary ||
    `Read the latest coverage from ${getDisplayCategoryName(
      story.category,
    )}.`

  const socialImage =
    getSocialImageUrl(
      story.image,
      story.slug ?? story.id,
    )

  return {
    title: story.title,
    description,

    alternates: {
      canonical: storyUrl,
    },

    openGraph: {
      type: 'article',
      siteName: 'Downunder Voices',
      locale: 'en_NZ',
      url: storyUrl,
      title: story.title,
      description,
      publishedTime: story.date,
      authors: story.author
        ? [story.author]
        : undefined,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description,
      images: [
        {
          url: socialImage,
          alt: story.title,
        },
      ],
    },
  }
}

export default async function StoryPage({
  params,
}: StoryPageProps) {
  const { slug } = await params
  const story = await getStoryBySlug(slug)

  if (!story) {
    notFound()
  }

  const allStories =
    await getPublishedStories(100)

  const relatedStories = allStories
    .filter(
      (candidate) =>
        candidate.id !== story.id &&
        candidate.category === story.category &&
        candidate.category !== 'editorial-view',
    )
    .slice(0, 3)

  const latestStories = allStories
    .filter(
      (candidate) =>
        candidate.id !== story.id &&
        candidate.category !== 'editorial-view' &&
        !relatedStories.some(
          (relatedStory) =>
            relatedStory.id === candidate.id,
        ),
    )
    .slice(0, 4)

  const storyUrl =
    `${siteUrl}/story/${story.slug ?? story.id}`

  const encodedStoryUrl =
    encodeURIComponent(storyUrl)

  const encodedTitle =
    encodeURIComponent(story.title)

  const facebookShareUrl =
    `https://www.facebook.com/sharer/sharer.php?u=${encodedStoryUrl}`

  const emailShareUrl =
    `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(
      `Read this story from Downunder Voices:\n\n${storyUrl}`,
    )}`

  const hasGenuineOriginalSource =
    isGenuineExternalSource(
      story.sourceUrl,
    )

  const sourceDisplayName =
    getSourceDisplayName(
      story.sourceName,
      story.sourceUrl,
    )

  return (
    <main>
      <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/category/${story.category}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to{' '}
            {getDisplayCategoryName(
              story.category,
            )}
          </Link>

          <header className="mt-6 border-b border-border pb-7">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/category/${story.category}`}
                className="rounded-sm bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground"
              >
                {getDisplayCategoryName(
                  story.category,
                )}
              </Link>

              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {formatDate(story.date)}
              </p>
            </div>

            <h1 className="mt-5 max-w-5xl text-balance font-serif text-4xl font-black leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
              {story.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                {story.author ? (
                  <p className="text-sm font-semibold text-foreground">
                    By {story.author}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-foreground">
                    Downunder Voices Newsroom
                  </p>
                )}

                {hasGenuineOriginalSource && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Source reporting:{' '}
                    {sourceDisplayName}
                  </p>
                )}
              </div>

              <div
                className="flex flex-wrap items-center gap-2"
                aria-label="Share this story"
              >
                <span className="mr-1 hidden items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:inline-flex">
                  <Share2 className="size-4" />
                  Share
                </span>

                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:bg-muted"
                >
                  <Facebook className="size-4" />
                  Facebook
                </a>

                <a
                  href={emailShareUrl}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:bg-muted"
                >
                  <Mail className="size-4" />
                  Email
                </a>
              </div>
            </div>
          </header>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
            <StoryImage
              src={story.image}
              alt={story.title}
              sizes="(max-width: 1100px) 100vw, 1100px"
              className="object-cover"
              category={story.category}
            />
          </div>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">
              {story.summary && (
                <p className="font-serif text-xl font-medium leading-9 text-foreground/90 sm:text-2xl sm:leading-10">
                  {story.summary}
                </p>
              )}

              {story.communityAngle && (
                <section className="mt-9 rounded-lg border border-border border-l-4 border-l-primary bg-secondary/70 p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                    Downunder Voices perspective
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-black">
                    Why this matters
                  </h2>

                  <p className="mt-3 text-base leading-8 text-foreground/80">
                    {story.communityAngle}
                  </p>
                </section>
              )}

              <section className="mt-9 border-t border-border pt-7">
                <h2 className="font-serif text-xl font-bold">
                  About this report
                </h2>

                {hasGenuineOriginalSource ? (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Downunder Voices provides an
                    independently written summary and
                    community perspective based on
                    information published by the original
                    source. The original publisher remains
                    responsible for its reporting.
                  </p>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    This article contains independently
                    written commentary and community
                    perspective from Downunder Voices.
                  </p>
                )}
              </section>

              <section className="mt-9 rounded-xl bg-slate-950 p-6 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-400">
                  Join our community
                </p>

                <h2 className="mt-3 font-serif text-2xl font-black sm:text-3xl">
                  Follow Downunder Voices
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Join thousands of readers following news
                  and community stories from Australia,
                  New Zealand and the Pacific.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/downundervoices"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
                  >
                    <Facebook className="size-4" />
                    Follow on Facebook
                  </a>

                  <Link
                    href="/submit"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Submit your story
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </section>
            </div>

            <aside className="h-fit space-y-5 lg:sticky lg:top-24">
              {hasGenuineOriginalSource && (
                <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Original reporting
                  </p>

                  <p className="mt-3 font-serif text-xl font-bold">
                    {sourceDisplayName}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Visit the original publisher for the
                    complete report and further updates.
                  </p>

                  <a
                    href={story.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Read original source
                    <ArrowUpRight className="size-4" />
                  </a>
                </section>
              )}

              <section className="rounded-xl border border-border bg-secondary/70 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Downunder Voices
                </p>

                <h2 className="mt-2 font-serif text-xl font-bold">
                  Your community. Your voice.
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Independent coverage connecting
                  Australia, New Zealand and Pacific
                  communities.
                </p>

                <Link
                  href="/latest"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  Read the latest news
                  <ArrowRight className="size-4" />
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </article>

      {relatedStories.length > 0 && (
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <SectionHeading
              title={`More from ${getDisplayCategoryName(
                story.category,
              )}`}
              href={`/category/${story.category}`}
              linkText="View category"
            />

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {relatedStories.map(
                (relatedStory) => (
                  <StoryCard
                    key={relatedStory.id}
                    story={relatedStory}
                  />
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {latestStories.length > 0 && (
        <section>
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <SectionHeading
              title="Read Next"
              href="/latest"
              linkText="View latest"
            />

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {latestStories.map(
                (latestStory) => (
                  <StoryCard
                    key={latestStory.id}
                    story={latestStory}
                  />
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

type SectionHeadingProps = {
  title: string
  href: string
  linkText: string
}

function SectionHeading({
  title,
  href,
  linkText,
}: SectionHeadingProps) {
  return (
    <div className="mb-7">
      <div className="h-1 w-16 bg-red-700" />

      <div className="flex items-end justify-between gap-4 border-b border-border py-3">
        <h2 className="font-serif text-2xl font-black sm:text-3xl">
          {title}
        </h2>

        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-red-700 hover:underline"
        >
          {linkText}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
