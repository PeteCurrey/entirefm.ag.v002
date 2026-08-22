import React from 'react';
import Image from 'next/image';
import { BRAND_ICONS } from '@/config/brand-assets';

export type BrandIconKey = keyof typeof BRAND_ICONS;

interface BrandIconProps {
  name: BrandIconKey;
  size?: number;
  className?: string;
}

export function BrandIcon({ name, size = 48, className = '' }: BrandIconProps) {
  const icon = BRAND_ICONS[name];
  if (!icon) return null;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={icon.src}
        alt={icon.alt}
        width={size}
        height={size}
        className="object-contain drop-shadow-md"
      />
    </div>
  );
}
