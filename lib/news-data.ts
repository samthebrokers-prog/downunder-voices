export type CategorySlug =
  | 'nz-pacific'
  | 'australia'
  | 'politics'
  | 'business'
  | 'community'
  | 'sports'
  | 'editorial-view'

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
    slug: 'editorial-view',
    name: 'Editorial View',
    description:
      'Editorials and commentary on the issues shaping our communities.',
  },
]
