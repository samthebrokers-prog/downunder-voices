'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

type StoryImageProps = {
  src?: string | null
  alt: string
  sizes: string
  className?: string
  category?: string | null
}

const fallbackImages: Record<string, string> = {
  politics: '/fallback/politics.svg',
  business: '/fallback/business.svg',
  australia: '/fallback/australia.svg',
  'nz-pacific': '/fallback/nz-pacific.svg',
  community: '/fallback/community.svg',
  sports: '/fallback/sports.svg',
}

export function StoryImage({
  src,
  alt,
  sizes,
  className = '',
  category,
}: StoryImageProps) {
  const fallback = useMemo(() => {
    if (!category) return '/fallback/default.svg'
    return fallbackImages[category] || '/fallback/default.svg'
  }, [category])

  const [source, setSource] = useState(src?.trim() || fallback)

  return (
    <Image
      src={source}
      alt={alt}
      fill
      unoptimized
      className={className}
      sizes={sizes}
      onError={() => {
        if (source !== fallback) {
          setSource(fallback)
        }
      }}
    />
  )
}
