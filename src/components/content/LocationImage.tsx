/**
 * LOCATION IMAGE
 * ==============
 * Renders a curated city image with the alt text recorded alongside it in
 * src/config/location-images.json.
 *
 * Alt text comes from the manifest rather than being generated from the city
 * name, because "Facilities management in Manchester" describes nothing that
 * is actually in the picture. The manifest entry says what the image shows,
 * which is what alt text is for — and it means a wrong image produces a
 * visibly wrong description rather than a plausible one.
 *
 * Renders nothing when the city has no verified photography (currently Leeds
 * and Lincoln), rather than falling back to another city's image.
 */

import React from 'react';
import Image from 'next/image';
import locationImages from '@/config/location-images.json';

type ImageManifest = {
  cities: Record<string, { city: string; images: Array<{ src: string; alt: string }> }>;
};

const IMAGES = locationImages as ImageManifest;

/** Look up the recorded alt text for a manifest image path. */
export function altForImage(src: string | undefined): string | null {
  if (!src) return null;
  for (const entry of Object.values(IMAGES.cities)) {
    const hit = entry.images.find((i) => i.src === src);
    if (hit) return hit.alt;
  }
  return null;
}

interface LocationImageProps {
  src?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function LocationImage({
  src,
  priority = false,
  className = '',
  sizes = '(max-width: 1024px) 100vw, 40vw',
}: LocationImageProps) {
  const alt = altForImage(src);

  // No verified image for this city — show nothing rather than another city's.
  if (!src || !alt) return null;

  return (
    <figure className={`relative overflow-hidden rounded-sm ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        priority={priority}
        sizes={sizes}
        className="w-full h-full object-cover"
      />
    </figure>
  );
}
