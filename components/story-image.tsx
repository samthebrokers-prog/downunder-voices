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

const fallbackPhotos: Record<string, string> = {
  politics:
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=80',

  business:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',

  australia:
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=80',

  'nz-pacific':
    'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1400&q=80',

  community:
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80',

  sports:
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80',

  default:
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=80',
}

const keywordPhotos: Array<{
  words: string[]
  image: string
}> = [
  {
    words: [
      'parliament',
      'government',
      'minister',
      'premier',
      'election',
      'senator',
      'liberal',
      'labor',
      'labour',
      'one nation',
      'pauline hanson',
      'daniel andrews',
      'jacinta allan',
    ],
    image:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'money',
      'bank',
      'finance',
      'economy',
      'interest rate',
      'inflation',
      'market',
      'investment',
      'budget',
    ],
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'infrastructure',
      'construction',
      'housing',
      'building',
      'development',
      'road',
      'rail',
      'transport',
    ],
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'business',
      'company',
      'workplace',
      'employment',
      'jobs',
      'industry',
    ],
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'court',
      'judge',
      'appeal',
      'legal',
      'law',
      'discrimination',
      'justice',
    ],
    image:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'police',
      'crime',
      'investigation',
      'arrest',
      'security',
      'emergency',
    ],
    image:
      'https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'climate',
      'environment',
      'weather',
      'flood',
      'storm',
      'fire',
      'cyclone',
    ],
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'health',
      'hospital',
      'doctor',
      'medical',
      'patient',
      'medicine',
    ],
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'school',
      'education',
      'student',
      'university',
      'teacher',
    ],
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'sport',
      'football',
      'soccer',
      'rugby',
      'cricket',
      'match',
      'team',
    ],
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'community',
      'family',
      'people',
      'migrant',
      'festival',
      'culture',
    ],
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80',
  },
  {
    words: [
      'new zealand',
      'aotearoa',
      'auckland',
      'wellington',
      'christchurch',
      'māori',
      'maori',
    ],
    image:
      'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1400&q=80',
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
    ],
    image:
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=80',
  },
]

function usableSource(value: string) {
  if (!value) return false

  const lower = value.toLowerCase().trim()

  const blockedImages = [
    'placeholder.svg',
    'placeholder.jpg',
    'placeholder.jpeg',
    'placeholder.png',
    '/politics.svg',
    '/business.svg',
    '/australia.svg',
    '/nz-pacific.svg',
    '/community.svg',
    '/sports.svg',
    '/default.svg',
  ]

  return (
    lower !== 'null' &&
    lower !== 'undefined' &&
    !blockedImages.some((blocked) => lower.includes(blocked))
  )
}

function selectFallbackPhoto(
  title: string,
  category?: string | null
) {
  const normalisedTitle = title.toLowerCase()

  const keywordMatch = keywordPhotos.find(({ words }) =>
    words.some((word) => normalisedTitle.includes(word))
  )

  if (keywordMatch) {
    return keywordMatch.image
  }

  return (
    fallbackPhotos[category || 'default'] ||
    fallbackPhotos.default
  )
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
  const preferred = usableSource(original)
    ? original
    : fallback

  const [source, setSource] = useState(preferred)

  useEffect(() => {
    setSource(preferred)
  }, [preferred])

  return (
    <Image
      src={source}
      alt={alt}
      fill
      unoptimized
      sizes={sizes}
      className={className}
      onError={() => {
        if (source !== fallback) {
          setSource(fallback)
        }
      }}
    />
  )
}
