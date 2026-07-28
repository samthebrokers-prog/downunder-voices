'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type StoryImageProps = {
  src?: string | null
  alt: string
  sizes: string
  className?: string
  category?: string | null
}

type ImageGroup = {
  words: string[]
  images: string[]
}

const defaultImages = [
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1400&q=80',
]

const categoryImages: Record<string, string[]> = {
  politics: [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=80',
  ],

  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=80',
  ],

  australia: [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=1400&q=80',
  ],

  'nz-pacific': [
    'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1400&q=80',
  ],

  community: [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80',
  ],

  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1400&q=80',
  ],

  default: defaultImages,
}

const keywordGroups: ImageGroup[] = [
  {
    words: [
      'police',
      'officer',
      'constable',
      'crime',
      'arrest',
      'investigation',
      'shooting',
      'charged',
      'murder',
      'missing person',
      'emergency',
    ],
    images: [
      'https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1596394723269-b2cbca4e6313?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1567598508481-65985588e295?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'hospital',
      'doctor',
      'health',
      'medical',
      'medicine',
      'patient',
      'cancer',
      'vaccine',
      'nurse',
      'surgery',
      'disease',
    ],
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'court',
      'judge',
      'legal',
      'law',
      'lawsuit',
      'appeal',
      'trial',
      'settlement',
      'justice',
      'lawyer',
    ],
    images: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'parliament',
      'government',
      'minister',
      'premier',
      'election',
      'senator',
      'politics',
      'liberal',
      'labor',
      'labour',
      'one nation',
      'pauline hanson',
      'prime minister',
      'opposition',
      'cabinet',
    ],
    images: [
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'bank',
      'finance',
      'economy',
      'interest rate',
      'inflation',
      'market',
      'investment',
      'budget',
      'shares',
      'stock market',
      'cost of living',
      'mortgage',
      'tax',
    ],
    images: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'business',
      'company',
      'workplace',
      'employment',
      'jobs',
      'industry',
      'chief executive',
      'ceo',
      'retail',
      'sales',
      'corporate',
    ],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'construction',
      'housing',
      'building',
      'development',
      'road',
      'rail',
      'transport',
      'infrastructure',
      'project',
      'airport',
      'bridge',
    ],
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'oil',
      'gas',
      'refinery',
      'fuel',
      'energy',
      'petrol',
      'diesel',
      'mining',
      'coal',
      'resources',
    ],
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'school',
      'education',
      'student',
      'university',
      'teacher',
      'college',
      'training',
      'graduate',
    ],
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'weather',
      'flood',
      'storm',
      'cyclone',
      'rain',
      'fire',
      'bushfire',
      'climate',
      'environment',
      'earthquake',
    ],
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'rugby',
      'cricket',
      'football',
      'soccer',
      'tennis',
      'sport',
      'match',
      'team',
      'league',
      'final',
      'championship',
    ],
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'community',
      'family',
      'people',
      'migrant',
      'festival',
      'culture',
      'charity',
      'volunteer',
      'local',
    ],
    images: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'new zealand',
      'aotearoa',
      'auckland',
      'wellington',
      'christchurch',
      'queenstown',
      'māori',
      'maori',
    ],
    images: [
      'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1400&q=80',
    ],
  },

  {
    words: [
      'australia',
      'sydney',
      'melbourne',
      'perth',
      'brisbane',
      'adelaide',
      'canberra',
      'victoria',
      'queensland',
      'tasmania',
    ],
    images: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=1400&q=80',
    ],
  },
]

function normaliseCategory(category?: string | null) {
  const value = category?.toLowerCase().trim() || 'default'

  if (value.includes('politic')) return 'politics'
  if (value.includes('business')) return 'business'
  if (value.includes('australia')) return 'australia'
  if (value.includes('sport')) return 'sports'
  if (value.includes('community')) return 'community'

  if (
    value.includes('new-zealand') ||
    value.includes('new zealand') ||
    value.includes('nz') ||
    value.includes('pacific')
  ) {
    return 'nz-pacific'
  }

  return value
}

function hashText(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function selectFromImages(images: string[], title: string) {
  if (!images.length) {
    return defaultImages[0]
  }

  return images[hashText(title) % images.length]
}

function usableSource(value: string) {
  if (!value) return false

  const lower = value.toLowerCase().trim()

  const blockedImages = [
    'placeholder.svg',
    'placeholder.jpg',
    'placeholder.jpeg',
    'placeholder.png',
    'default-image',
    'default_image',
    'no-image',
    'no_image',
    'image-not-found',
    'spacer.gif',
    'blank.gif',
    '/politics.svg',
    '/business.svg',
    '/australia.svg',
    '/nz-pacific.svg',
    '/community.svg',
    '/sports.svg',
    '/default.svg',
  ]

  if (
    lower === 'null' ||
    lower === 'undefined' ||
    lower === '#' ||
    lower.startsWith('data:')
  ) {
    return false
  }

  if (
    !lower.startsWith('http://') &&
    !lower.startsWith('https://') &&
    !lower.startsWith('/')
  ) {
    return false
  }

  return !blockedImages.some((blocked) => lower.includes(blocked))
}

function selectFallbackPhoto(title: string, category?: string | null) {
  const normalisedTitle = title.toLowerCase().trim()

  const keywordMatch = keywordGroups.find(({ words }) =>
    words.some((word) => normalisedTitle.includes(word))
  )

  if (keywordMatch) {
    return selectFromImages(keywordMatch.images, normalisedTitle)
  }

  const categoryKey = normaliseCategory(category)
  const images =
    categoryImages[categoryKey] ||
    categoryImages.default ||
    defaultImages

  return selectFromImages(images, normalisedTitle)
}

export function StoryImage({
  src,
  alt,
  sizes,
  className = '',
  category,
}: StoryImageProps) {
  const fallback = useMemo(
    () => selectFallbackPhoto(alt, category),
    [alt, category]
  )

  const original = src?.trim() || ''

  const preferred = useMemo(
    () => (usableSource(original) ? original : fallback),
    [original, fallback]
  )

  const finalBackup = defaultImages[hashText(alt) % defaultImages.length]

  const [source, setSource] = useState(preferred)
  const [hasTriedFallback, setHasTriedFallback] = useState(false)

  useEffect(() => {
    setSource(preferred)
    setHasTriedFallback(false)
  }, [preferred])

  function handleImageError() {
    if (!hasTriedFallback && source !== fallback) {
      setHasTriedFallback(true)
      setSource(fallback)
      return
    }

    if (source !== finalBackup) {
      setSource(finalBackup)
    }
  }

  return (
    <Image
      src={source}
      alt={alt}
      fill
      unoptimized
      sizes={sizes}
      className={className}
      onError={handleImageError}
    />
  )
}
