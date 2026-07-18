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
  politics: '/politics.svg',
  business: '/business.svg',
  australia: '/australia.svg',
  'nz-pacific': '/nz-pacific.svg',
  community: '/community.svg',
  sports: '/sports.svg',
}

export function StoryImage({
  src,
  alt,
  sizes,
  className = '',
  category,
}: StoryImageProps) {
  const fallback = useMemo(() => {
    if (!category) return '/default.svg'
    return fallbackImages[category] || '/default.svg'
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
