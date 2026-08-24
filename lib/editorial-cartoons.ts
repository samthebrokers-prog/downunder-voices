export type EditorialCartoon = {
  date: string
  image: string
  alt: string
  headline: string
  summary: string
  sourceUrl: string
  sourceLabel: string
}

export const editorialCartoons: EditorialCartoon[] = [
  {
    date: '24 August 2026',
    image:
      '/editorial-cartoons/2026-08-24-heap-dangerous-ideas.jpg',
    alt: 'Black-and-white editorial cartoon of two visitors digging through a huge indoor dirt pile and finding a dangerous idea',
    headline: 'Careful what you dig up — it might require thinking',
    summary:
      'At Sydney’s HEAP installation, visitors stepped barefoot into a vast mound of earth and used trowels to uncover artworks. Finding the dangerous ideas was the easy part; deciding what to do with them may take a little longer.',
    sourceUrl:
      'https://festivalofdangerousideas.com/program/heap/',
    sourceLabel: 'Festival of Dangerous Ideas — HEAP',
  },
  {
    date: '23 August 2026',
    image:
      '/editorial-cartoons/2026-08-23-sydney-marathon.jpg',
    alt: "Editorial cartoon showing a Sydney Marathon runner surprised that the participation medal depicts Munich's Allianz Arena",
    headline: 'Sydney Marathon medal takes a wrong turn to Munich',
    summary:
      'Sydney Marathon organisers acknowledged an embarrassing medal-design error: Munich’s Allianz Arena appeared where runners expected a symbol of Sydney. Our runner may have crossed the finish line, but the medal apparently kept going.',
    sourceUrl:
      'https://www.theguardian.com/australia-news/live/2026/aug/23/australia-news-live-anthony-albanese-sydney-swans-police-investigation-alan-jones-antisemitism-inquiry-icac-nsw-liberals-ntwnfb',
    sourceLabel: 'Guardian Australia live news',
  },
]

export const currentCartoon = editorialCartoons[0]
export const archivedCartoons = editorialCartoons.slice(1)
