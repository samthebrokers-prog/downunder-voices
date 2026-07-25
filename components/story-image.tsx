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

const fallbackImages: Record<string, string> = {
  politics: '/politics.svg',
  business: '/business.svg',
  australia: '/australia.svg',
  'nz-pacific': '/nz-pacific.svg',
  community: '/community.svg',
  sports: '/sports.svg',
}

function usableSource(value: string) {
  const lower = value.toLowerCase()
  return Boolean(value) &&
    !lower.includes('placeholder.svg') &&
    !lower.includes('placeholder.jpg') &&
    !lower.includes('placeholder.jpeg') &&
    !lower.includes('placeholder.png') &&
    lower !== 'null' &&
    lower !== 'undefined'
}

export function StoryImage({ src, alt, sizes, className = '', category }: StoryImageProps) {
  const fallback = useMemo(
    () => fallbackImages[category || ''] || '/default.svg',
    [category],
  )
  const original = src?.trim() || ''
  const preferred = usableSource(original) ? original : fallback
  const [source, setSource] = useState(preferred)

  useEffect(() => setSource(preferred), [preferred])

  return (
    <Image
      src={source}
      alt={alt}
      fill
      unoptimized
      className={className}
      sizes={sizes}
      onError={() => setSource(fallback)}
    />
  )
}
