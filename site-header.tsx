import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StoryCard } from '@/components/story-card'
import { categories, getCategory, type CategorySlug } from '@/lib/news-data'
import { getStoriesByCategory } from '@/lib/story-service'

export const revalidate = 300
export function generateStaticParams() { return categories.map((c) => ({ slug: c.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const category = getCategory(slug); return category ? { title: category.name, description: category.description } : { title: 'Not Found' } }
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const category = getCategory(slug); if (!category) notFound(); const stories = await getStoriesByCategory(slug as CategorySlug); return <div className="mx-auto max-w-6xl px-4 py-10"><header className="border-b-2 border-primary pb-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Section</p><h1 className="mt-1 font-serif text-4xl font-bold text-balance">{category.name}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p></header>{stories.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{stories.map((story) => <StoryCard key={story.id} story={story} />)}</div> : <p className="mt-10 text-muted-foreground">No published stories in this section yet.</p>}</div> }
