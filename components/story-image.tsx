"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type StoryImageProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  category?: string | null;
  imageIndex?: number;
};

const categoryFallbacks: Record<string, string> = {
  australia: "/news/editorial-australia-public-affairs-2026.jpg",
  "new-zealand": "/news/editorial-new-zealand-community-2026.jpg",
  "nz-pacific": "/news/editorial-new-zealand-community-2026.jpg",
  "trade-logistics": "/news/editorial-trade-logistics-2026.jpg",
  business: "/news/editorial-cost-of-living-2026.jpg",
  "small-business": "/news/editorial-cost-of-living-2026.jpg",
  "social-issues": "/news/editorial-cost-of-living-2026.jpg",
  politics: "/news/editorial-australia-public-affairs-2026.jpg",
  community: "/news/editorial-new-zealand-community-2026.jpg",
};

const defaultFallback = "/news/editorial-australia-public-affairs-2026.jpg";

function normaliseCategory(category?: string | null) {
  return category?.toLowerCase().trim() || "default";
}

function usableSource(value: string) {
  if (!value) return false;
  const lower = value.toLowerCase().trim();
  const blockedImages = [
    "placeholder.svg",
    "placeholder.jpg",
    "placeholder.jpeg",
    "placeholder.png",
    "default-image",
    "default_image",
    "no-image",
    "no_image",
    "image-not-found",
    "spacer.gif",
    "blank.gif",
  ];

  if (lower === "null" || lower === "undefined" || lower === "#" || lower.startsWith("data:")) return false;
  if (!lower.startsWith("http://") && !lower.startsWith("https://") && !lower.startsWith("/")) return false;
  return !blockedImages.some((blocked) => lower.includes(blocked));
}

function selectFallback(category?: string | null) {
  const key = normaliseCategory(category);
  return categoryFallbacks[key] || defaultFallback;
}

export function StoryImage({
  src,
  alt,
  sizes,
  className = "",
  category,
}: StoryImageProps) {
  const fallback = useMemo(() => selectFallback(category), [category]);
  const original = src?.trim() || "";
  const preferred = useMemo(() => (usableSource(original) ? original : fallback), [original, fallback]);
  const [source, setSource] = useState(preferred);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  useEffect(() => {
    setSource(preferred);
    setHasTriedFallback(false);
  }, [preferred]);

  function handleImageError() {
    if (!hasTriedFallback && source !== fallback) {
      setHasTriedFallback(true);
      setSource(fallback);
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
  );
}
