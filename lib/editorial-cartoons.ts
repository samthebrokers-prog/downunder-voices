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
    date: '17 October 2026',
    image: '/editorial-cartoons/2026-10-17-wallabies-home-soil.svg',
    alt: 'Editorial cartoon of a dejected Wallaby at home opposite a celebrating All Black after New Zealand defeated Australia 43-21 in Sydney',
    headline: 'Home soil. Home crowd. Same old Bledisloe pain.',
    summary: 'The Wallabies went down 43-21 to the All Blacks in Sydney after trailing 36-7 at half-time. On home soil, in front of their own crowd, Australia was left with the same painful question: what a shame.',
    sourceUrl: 'https://www.rugby.com.au/news/all-blacks-complete-bledisloe-cup-sweep-with-sydney-victory-over-wallabies-20261017',
    sourceLabel: 'Rugby Australia — All Blacks complete Bledisloe Cup sweep with Sydney victory over Wallabies',
  },
]

export const currentCartoon = editorialCartoons[0]
export const archivedCartoons = editorialCartoons.slice(1)
