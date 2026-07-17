'use client'

import Image from 'next/image'
import { useState } from 'react'

export function StoryImage({ src, alt, sizes, className = '' }: { src?: string; alt: string; sizes: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const source = failed || !src ? '/placeholder.svg' : src
  return <Image src={source} alt={alt} fill unoptimized className={className} sizes={sizes} onError={() => setFailed(true)} />
}
