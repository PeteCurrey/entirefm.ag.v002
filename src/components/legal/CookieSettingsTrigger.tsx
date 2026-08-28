'use client';

import React from 'react';

interface CookieSettingsTriggerProps {
  className?: string;
  label?: string;
}

export function CookieSettingsTrigger({
  className = 'text-[12px] text-brand-mist/40 transition-colors hover:text-brand-mist/80',
  label = 'Cookie preferences',
}: CookieSettingsTriggerProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('efm-open-cookie-settings'));
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {label}
    </button>
  );
}
