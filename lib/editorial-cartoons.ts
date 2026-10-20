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
    date: '21 October 2026',
    image: '/editorial-cartoons/2026-10-21-telethon-receipts.svg',
    alt: 'Downunder Voices black-and-white editorial cartoon celebrating Western Australia Telethon generosity while contrasting community fundraising with the public spotlight',
    headline: 'WA gave big. Who gets the glory?',
    summary: 'Telethon 2026 raised a record $101,277,705 for WA children. Our cartoon celebrates the result while giving the schools, families, volunteers and everyday donors their share of the spotlight.',
    sourceUrl: 'https://www.pm.gov.au/media/albanese-government-delivers-6-million-telethon',
    sourceLabel: 'Prime Minister of Australia — Albanese Government delivers $6 million to Telethon',
  },
  {
    date: '18 October 2026',
    image: '/editorial-cartoons/2026-10-18-wallabies-home-soil.svg',
    alt: 'Downunder Voices editorial cartoon showing dejected Wallabies and celebrating All Blacks after New Zealand defeated Australia 43-21 in Sydney',
    headline: 'Home soil. Home crowd. Same old Bledisloe pain.',
    summary: 'The Wallabies went down 43-21 to the All Blacks in Sydney after trailing 36-7 at half-time. On home soil, in front of their own crowd, Australia was left with the same painful question: what a shame.',
    sourceUrl: 'https://www.rugby.com.au/news/all-blacks-complete-bledisloe-cup-sweep-with-sydney-victory-over-wallabies-20261017',
    sourceLabel: 'Rugby Australia — All Blacks complete Bledisloe Cup sweep with Sydney victory over Wallabies',
  },
  {
    date: '17 October 2026',
    image: '/editorial-cartoons/2026-10-17-wallabies-home-soil.svg',
    alt: 'Editorial cartoon of a dejected Wallaby at home opposite a celebrating All Black after New Zealand defeated Australia 43-21 in Sydney',
    headline: 'Home soil. Home crowd. Same old Bledisloe pain.',
    summary: 'The Wallabies went down 43-21 to the All Blacks in Sydney after trailing 36-7 at half-time.',
    sourceUrl: 'https://www.rugby.com.au/news/all-blacks-complete-bledisloe-cup-sweep-with-sydney-victory-over-wallabies-20261017',
    sourceLabel: 'Rugby Australia',
  },
]

export const currentCartoon = editorialCartoons[0]
export const archivedCartoons = editorialCartoons.slice(1)
