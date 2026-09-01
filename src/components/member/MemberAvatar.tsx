'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | number;

interface MemberAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: AvatarSize;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  priority?: boolean;
  border?: boolean;
}

const SIZE_MAP: Record<string, { px: number; textSize: string; containerClass: string }> = {
  xs: { px: 20, textSize: 'text-[9px]', containerClass: 'w-5 h-5' },
  sm: { px: 28, textSize: 'text-[11px]', containerClass: 'w-7 h-7' },
  md: { px: 36, textSize: 'text-xs', containerClass: 'w-9 h-9' },
  lg: { px: 48, textSize: 'text-sm', containerClass: 'w-12 h-12' },
  xl: { px: 64, textSize: 'text-lg', containerClass: 'w-16 h-16' },
  '2xl': { px: 96, textSize: 'text-2xl', containerClass: 'w-24 h-24' },
  '3xl': { px: 112, textSize: 'text-3xl', containerClass: 'w-28 h-28' },
};

/**
 * Computes initials from a display name or full name.
 * e.g. "Pete Currey" -> "PC", "Marcus" -> "M"
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return 'EM';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'EM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Canonical Member Avatar Component for EntireFM & The Lobby.
 * Renders verified profile picture or falls back gracefully to
 * premium EntireFM brand initials.
 */
export function MemberAvatar({
  name,
  avatarUrl,
  size = 'md',
  className = '',
  theme = 'auto',
  priority = false,
  border = true,
}: MemberAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Reset error state whenever the source URL changes so a freshly uploaded
  // avatar always gets a clean render attempt instead of staying on initials.
  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const isNumeric = typeof size === 'number';
  const sizeConfig = !isNumeric ? SIZE_MAP[size] || SIZE_MAP.md : null;
  const dimensionPx = isNumeric ? size : sizeConfig!.px;
  const textSizeClass = isNumeric
    ? size >= 80
      ? 'text-2xl'
      : size >= 48
      ? 'text-sm'
      : 'text-xs'
    : sizeConfig!.textSize;

  const initials = getInitials(name);

  // Border styling
  const borderClass = border
    ? theme === 'dark'
      ? 'border border-white/15'
      : theme === 'light'
      ? 'border border-neutral-200'
      : 'border border-neutral-200 dark:border-white/15'
    : '';

  // Has valid image
  const hasImage = Boolean(avatarUrl) && !imageError;

  return (
    <div
      style={isNumeric ? { width: dimensionPx, height: dimensionPx } : undefined}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden select-none ${
        !isNumeric ? sizeConfig!.containerClass : ''
      } ${borderClass} ${className}`}
      aria-label={name ? `${name}'s profile avatar` : 'Member avatar'}
    >
      {hasImage ? (
        <Image
          src={avatarUrl!}
          alt={name ? `${name}` : 'Member avatar'}
          width={dimensionPx}
          height={dimensionPx}
          priority={priority}
          unoptimized={
            avatarUrl?.startsWith('data:') ||
            avatarUrl?.includes('localhost') ||
            avatarUrl?.startsWith('/api/')
          }
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-extralight uppercase tracking-wider transition-colors ${
            theme === 'dark'
              ? 'bg-[#121826] text-white'
              : theme === 'light'
              ? 'bg-[#121826] text-white shadow-inner'
              : 'bg-[#121826] text-white'
          } ${textSizeClass}`}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
