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

const categoryColours: Record<string, [string, string]> = {
  politics: ['#172554', '#3b82f6'],
  business: ['#064e3b', '#10b981'],
  australia: ['#7c2d12', '#f97316'],
  'nz-pacific': ['#164e63', '#06b6d4'],
  community: ['#581c87', '#a855f7'],
  sports: ['#14532d', '#22c55e'],
  default: ['#1e293b', '#64748b'],
}

function createFallback(category?: string | null) {
  const colours =
    categoryColours[category || 'default'] || categoryColours.default

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colours[0]}" />
          <stop offset="100%" stop-color="${colours[1]}" />
        </linearGradient>

        <radialGradient id="glow" cx="70%" cy="25%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#background)" />
      <rect width="1200" height="800" fill="url(#glow)" />

      <circle cx="1050" cy="90" r="250" fill="#ffffff" opacity="0.08" />
      <circle cx="110" cy="720" r="310" fill="#ffffff" opacity="0.06" />

      <path
        d="M0 600 C220 500 360 700 590 590 C820 480 970 540 1200 410 L1200 800 L0 800 Z"
        fill="#ffffff"
        opacity="0.08"
      />

      <path
        d="M0 690 C240 570 410 760 650 650 C880 545 1030 590 1200 510"
        fill="none"
        stroke="#ffffff"
        stroke-width="5"
        opacity="0.18"
      />
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

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

export function StoryImage({
  src,
  alt,
  sizes,
  className = '',
  category,
}: StoryImageProps) {
  const fallback = useMemo(() => createFallback(category), [category])

  const original = src?.trim() || ''
  const preferred = usableSource(original) ? original : fallback

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
      className={className}
      sizes={sizes}
      onError={() => setSource(fallback)}
    />
  )
}
