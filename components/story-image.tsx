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

const neutralFallback = "/news/downunder-voices-news-fallback.svg";

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

export function StoryImage({
  src,
  alt,
  sizes,
  className = "",
}: StoryImageProps) {
  const original = src?.trim() || "";
  const preferred = useMemo(() => (usableSource(original) ? original : neutralFallback), [original]);
  const [source, setSource] = useState(preferred);

  useEffect(() => {
    setSource(preferred);
  }, [preferred]);

  return (
    <Image
      src={source}
      alt={alt}
      fill
      unoptimized
      sizes={sizes}
      className={className}
      onError={() => setSource(neutralFallback)}
    />
  );
}
