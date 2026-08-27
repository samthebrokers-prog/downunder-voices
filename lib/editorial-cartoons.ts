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
    date: '27 August 2026',
    image:
      '/editorial-cartoons/2026-08-27-wa-gst-border-line.jpg',
    alt: 'Black-and-white editorial cartoon of an anthropomorphic map of Western Australia and a Productivity Commission report arguing across the WA border over a GST money sack',
    headline: "Crossing the line, Western Australian style",
    summary:
      'The Productivity Commission said the WA premier crossed a line by calling its members “east coast clowns” during the GST carve-up dispute. In the west, however, every line in this argument seems to lead straight back to the state border.',
    sourceUrl:
      'https://www.abc.net.au/news/2026-08-26/productivity-commission-hits-back-criticism-over-gst/107078924',
    sourceLabel:
      'ABC News — Productivity Commission responds to GST criticism',
  },
  {
    date: '26 August 2026',
    image:
      '/editorial-cartoons/2026-08-26-tiny-collectibles-big-competition.jpg',
    alt: 'Black-and-white editorial cartoon of a supermarket executive examining a tiny generic collectible figure beside a large profit report',
    headline: 'Two centimetres of serious competition',
    summary:
      'Coles said supermarket sales growth temporarily moderated during a competitor’s collectibles campaign, before recovering when it ended. The same annual result reported a statutory profit of $1.09 billion — proof that even a tiny plastic rival can make a very large boardroom impression.',
    sourceUrl:
      'https://www.theguardian.com/australia-news/live/2026/aug/25/australia-news-live-sydney-trains-delays-cancellations-albanese-gst-wa-one-nation-coalition-secret-harbour-election-tax-reform-royal-commission-antisemitism-icac-victorian-rail-loop-alan-jones-trial-ntwnfb',
    sourceLabel:
      'Guardian Australia — Coles full-year results',
  },
  {
    date: '25 August 2026',
    image:
      '/editorial-cartoons/2026-08-25-army-helicopter-alarm-clock.jpg',
    alt: 'Black-and-white editorial cartoon of a sleepy Sydney resident calling a low-flying training helicopter the new alarm clock',
    headline: "Sydney's new alarm clock has excellent range",
    summary:
      'The Australian Army advised residents across Greater Sydney and the Hunter Valley that low-flying helicopters may be seen and heard during day-and-night training beginning on 24 August. For one sleepy suburb, the morning alarm suddenly came with rotor blades.',
    sourceUrl:
      'https://www.army.gov.au/news-and-events/noise-and-training-notices/2026-08-24/australian-army-aviation-training-activity',
    sourceLabel:
      'Australian Army — Aviation training activity',
  },
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
