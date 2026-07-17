// Downunder Voices fallback content.
// These stories keep the design visible before the database is connected.
// They are demonstration placeholders and must be replaced with verified reporting before launch.

export type CategorySlug =
  | 'nz-pacific'
  | 'australia'
  | 'politics'
  | 'business'
  | 'community'
  | 'sports'
  | 'sams-view'

export interface Category {
  slug: CategorySlug
  name: string
  description: string
}

export interface Story {
  id: string
  slug?: string
  title: string
  category: CategorySlug
  date: string
  summary: string
  sourceName: string
  sourceUrl: string
  image: string
  communityAngle: string
  author?: string
  status?: 'draft' | 'published' | 'archived'
  publishedAt?: string
  importedAt?: string
}

export const categories: Category[] = [
  {
    slug: 'nz-pacific',
    name: 'New Zealand & Pacific',
    description:
      'News and voices from across Aotearoa New Zealand and our Pacific neighbours.',
  },
  {
    slug: 'australia',
    name: 'Australia',
    description:
      'Stories that matter to communities right across Australia.',
  },
  {
    slug: 'politics',
    name: 'Politics',
    description:
      'Policy and decisions shaping everyday life on both sides of the Tasman.',
  },
  {
    slug: 'business',
    name: 'Business',
    description:
      'Small business, jobs, migrants and the economy that touches us all.',
  },
  {
    slug: 'community',
    name: 'Community',
    description:
      'The people, volunteers and local groups holding our neighbourhoods together.',
  },
  {
    slug: 'sports',
    name: 'Sports',
    description:
      'Grassroots and community sport across New Zealand, Australia and the Pacific.',
  },
  {
    slug: 'sams-view',
    name: "Sam's View",
    description:
      'Opinion and commentary on the issues shaping our communities.',
  },
]

export const stories: Story[] = [
  // ---------------------------------------------------------------- NZ & Pacific
  {
    id: 'nz-housing-first-home',
    title:
      'Auckland Council Unveils Plan to Ease Housing Crunch for First-Home Buyers',
    category: 'nz-pacific',
    date: '2026-07-02',
    summary:
      'A new package of zoning changes and shared-equity support aims to help first-home buyers into the market as Auckland prices remain stubbornly high.',
    sourceName: 'RNZ',
    sourceUrl: 'https://www.rnz.co.nz/',
    image: '/news/nz-housing.png',
    communityAngle:
      'For many migrant and young families, home ownership feels out of reach. These changes could open real pathways for the households we hear from every week.',
  },
  {
    id: 'pacific-language-weeks',
    title: 'Pacific Language Weeks Draw Record Turnout Across New Zealand',
    category: 'nz-pacific',
    date: '2026-07-01',
    summary:
      'Schools, churches and community groups celebrated Pacific Language Weeks with the biggest participation on record, keeping heritage languages alive.',
    sourceName: 'Pacific Media Network',
    sourceUrl: 'https://pmn.co.nz/',
    image: '/news/pacific-language.png',
    communityAngle:
      'Language is identity. When Samoan, Tongan and Fijian voices are celebrated in public life, our whole community feels seen.',
  },

  // ---------------------------------------------------------------- Australia
  {
    id: 'au-small-business-rents',
    title: 'Sydney Small Businesses Push Back on Rising Commercial Rents',
    category: 'australia',
    date: '2026-07-02',
    summary:
      'Shopkeepers along key Sydney strips are calling for rent relief as commercial leases climb faster than foot traffic recovers.',
    sourceName: 'ABC News',
    sourceUrl: 'https://www.abc.net.au/news',
    image: '/news/au-smallbiz.png',
    communityAngle:
      'Family-run and migrant-owned shops are the heart of our high streets. Their survival keeps neighbourhoods connected and jobs local.',
  },
  {
    id: 'au-queensland-floods',
    title: 'Queensland Floods Recovery: Communities Rebuild Street by Street',
    category: 'australia',
    date: '2026-06-30',
    summary:
      'Weeks after the floodwaters receded, volunteers and neighbours are still working together to clean homes and restore local services.',
    sourceName: 'The Guardian Australia',
    sourceUrl: 'https://www.theguardian.com/au',
    image: '/news/au-floods.png',
    communityAngle:
      'Disasters test us, but they also show what community really means. We are sharing the stories of the volunteers doing the quiet work.',
  },

  // ---------------------------------------------------------------- Politics
  {
    id: 'politics-transtasman',
    title: 'Cross-Tasman Leaders Meet to Discuss Migration and Trade',
    category: 'politics',
    date: '2026-07-01',
    summary:
      'Leaders from New Zealand and Australia met this week to talk migration settings, worker mobility and closer economic ties.',
    sourceName: 'Stuff',
    sourceUrl: 'https://www.stuff.co.nz/',
    image: '/news/politics-leaders.png',
    communityAngle:
      'Migration rules decide whether families can stay together across the Tasman. These talks matter to the people living that reality.',
  },
  {
    id: 'politics-cost-of-living-package',
    title: 'Debate Heats Up Over Cost-of-Living Relief Package',
    category: 'politics',
    date: '2026-06-29',
    summary:
      'Politicians are trading blows over the size and targeting of a new cost-of-living package as households feel the pinch of prices and rents.',
    sourceName: 'The Sydney Morning Herald',
    sourceUrl: 'https://www.smh.com.au/',
    image: '/news/politics-costofliving.png',
    communityAngle:
      'Behind the political noise are real budgets under strain. We ask what any relief actually means at the kitchen table.',
  },

  // ---------------------------------------------------------------- Business
  {
    id: 'business-migrant-cafes',
    title: 'Migrant-Owned Cafés Fuel Growth in Regional Towns',
    category: 'business',
    date: '2026-07-02',
    summary:
      'New research shows migrant-owned hospitality businesses are driving jobs and revitalising main streets in regional communities.',
    sourceName: 'ABC Rural',
    sourceUrl: 'https://www.abc.net.au/news/rural',
    image: '/news/business-cafe.png',
    communityAngle:
      'Newcomers are not just filling jobs — they are creating them. Their cafés and shops are becoming the new town square.',
  },
  {
    id: 'business-reserve-bank-rates',
    title: 'Reserve Bank Holds Rates as Households Feel the Squeeze',
    category: 'business',
    date: '2026-06-28',
    summary:
      'The central bank held the official cash rate steady, saying inflation is easing but warning that many households remain under pressure.',
    sourceName: 'Reuters',
    sourceUrl: 'https://www.reuters.com/',
    image: '/news/business-rates.png',
    communityAngle:
      'Interest rate decisions ripple straight into mortgages and rents. We translate what the announcement means for ordinary borrowers.',
  },

  // ---------------------------------------------------------------- Community
  {
    id: 'community-food-banks',
    title: 'Volunteers Rally to Keep Local Food Banks Stocked This Winter',
    category: 'community',
    date: '2026-07-01',
    summary:
      'Community food banks are reporting rising demand this winter, and volunteers are stepping up to keep shelves full for struggling families.',
    sourceName: 'Community Scoop',
    sourceUrl: 'https://community.scoop.co.nz/',
    image: '/news/community-foodbank.png',
    communityAngle:
      'No family should go hungry. We are highlighting the local drives and how readers can help their own neighbourhoods.',
  },
  {
    id: 'community-melbourne-hub',
    title: 'New Community Hub Brings Migrant Families Together in Melbourne',
    category: 'community',
    date: '2026-06-27',
    summary:
      'A new multicultural community hub has opened in Melbourne, offering English classes, job support and a welcoming space for new arrivals.',
    sourceName: 'SBS News',
    sourceUrl: 'https://www.sbs.com.au/news',
    image: '/news/community-hub.png',
    communityAngle:
      'Settling in a new country is hard. Spaces like this turn isolation into belonging — exactly the stories we exist to tell.',
  },

  // ---------------------------------------------------------------- Sports
  {
    id: 'sports-rugby-grassroots',
    title: 'Grassroots Rugby Clubs See Membership Surge Across the Region',
    category: 'sports',
    date: '2026-07-02',
    summary:
      'Community rugby clubs are reporting a jump in junior and senior sign-ups, giving volunteers hope for the grassroots game.',
    sourceName: 'NZ Herald',
    sourceUrl: 'https://www.nzherald.co.nz/',
    image: '/news/sports-rugby.png',
    communityAngle:
      'Local clubs are where kids find belonging and mentors. A healthy club is a healthy neighbourhood.',
  },
  {
    id: 'sports-netball-final',
    title: 'Local Netball Final Draws Biggest Crowd in a Decade',
    category: 'sports',
    date: '2026-06-29',
    summary:
      'A packed grandstand cheered on the regional netball final, celebrating the players and the volunteers who keep the competition running.',
    sourceName: 'ABC Sport',
    sourceUrl: 'https://www.abc.net.au/news/sport',
    image: '/news/sports-netball.png',
    communityAngle:
      'Women’s community sport often goes uncovered. We are proud to put these players and their supporters front and centre.',
  },

  // ---------------------------------------------------------------- Sam's View
  {
    id: 'sams-view-community-voices',
    title: "Sam's View: Why Community Voices Matter More Than Ever",
    category: 'sams-view',
    date: '2026-07-02',
    summary:
      'In a noisy media landscape, the quiet, honest voices of ordinary communities are the ones we should be listening to hardest.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/news/sams-view-voices.png',
    communityAngle:
      'This column is opinion. It is here to spark conversation and give a platform to the people the big headlines often overlook.',
    author: 'Sam',
  },
  {
    id: 'sams-view-cost-of-living',
    title: "Sam's View: The Real Cost of Living Isn't Just About Money",
    category: 'sams-view',
    date: '2026-06-28',
    summary:
      'When we only measure the cost of living in dollars, we miss the toll on time, community and peace of mind. Here is why that matters.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/news/sams-view-costofliving.png',
    communityAngle:
      'An honest take on what families are really carrying right now — and why community connection is part of the answer.',
    author: 'Sam',
  },
]

// ----------------------------------------------------------------------------
// Helpers used across the site
// ----------------------------------------------------------------------------

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getStoriesByCategory(slug: CategorySlug): Story[] {
  return stories
    .filter((s) => s.category === slug)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getAllStoriesSorted(): Story[] {
  return [...stories].sort((a, b) => b.date.localeCompare(a.date))
}

// A mixed, de-duplicated latest feed for the homepage.
// Ensures we don't show the same category (e.g. sports) over and over at the top.
export function getMixedLatest(limit?: number): Story[] {
  const sorted = getAllStoriesSorted()
  const seenFirstPass = new Set<CategorySlug>()
  const primary: Story[] = []
  const rest: Story[] = []

  for (const story of sorted) {
    if (!seenFirstPass.has(story.category)) {
      seenFirstPass.add(story.category)
      primary.push(story)
    } else {
      rest.push(story)
    }
  }

  const mixed = [...primary, ...rest]
  return typeof limit === 'number' ? mixed.slice(0, limit) : mixed
}

export function getCategoryName(slug: CategorySlug): string {
  return getCategory(slug)?.name ?? slug
}

export function formatDate(iso: string): string {
  const date = new Date(iso + 'T00:00:00')
  return date.toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}  {
    id: 'sams-view-cost-of-living',
    title: "Sam's View: The Real Cost of Living Isn't Just About Money",
    category: 'sams-view',
    date: '2026-06-28',
    summary:
      'When we only measure the cost of living in dollars, we miss the toll on time, community and peace of mind. Here is why that matters.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/news/sams-view-costofliving.png',
    communityAngle:
      'An honest take on what families are really carrying right now — and why community connection is part of the answer.',
    author: 'Sam',
  },

  {
    id: 'pauline-hanson-white-australia-policy',
    title:
      'Pauline Hanson Criticised After Linking Migration Problems to End of White Australia Policy',
    category: 'politics',
    date: '2026-07-18',
    summary:
      'One Nation leader Pauline Hanson has faced criticism after linking Australia’s migration problems to the end of the White Australia policy and making unsupported claims about Muslim participation in the NDIS.',
    sourceName: 'ABC News',
    sourceUrl:
      'https://www.abc.net.au/news/2026-07-17/pauline-hanson-tommy-robinson-podcast/106926030',
    image: '/news/politics-leaders.png',
    communityAngle:
      'Australia should be able to debate immigration, housing and public spending openly. However, serious claims about migrant or religious communities must be supported by reliable evidence, not fear or division.',
    author: 'Sam',
    status: 'published',
    publishedAt: '2026-07-18',
  },
]
