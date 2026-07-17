import type { MetadataRoute } from 'next'
import { categories } from '@/lib/news-data'
import { getPublishedStories } from '@/lib/story-service'
import { isDatabaseConfigured } from '@/lib/db'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base='https://downundervoices.com'; const stories=isDatabaseConfigured()?await getPublishedStories(500):[]; return [{url:base,lastModified:new Date(),changeFrequency:'daily',priority:1},...categories.map(c=>({url:`${base}/category/${c.slug}`,changeFrequency:'daily' as const,priority:.8})),...['about','contact','submit','privacy','terms','editorial-policy','corrections','copyright','advertise'].map(p=>({url:`${base}/${p}`,changeFrequency:'monthly' as const,priority:.4})),...stories.map(s=>({url:`${base}/story/${s.slug??s.id}`,lastModified:new Date(s.publishedAt??s.date),changeFrequency:'weekly' as const,priority:.7}))] }
