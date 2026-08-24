'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3 } from 'lucide-react';

export function AnalyticsTopNavButton() {
  const pathname = usePathname();
  const isActive = pathname?.startsWith('/admin/analytics');

  return (
    <Link
      href="/admin/analytics"
      className={`relative flex h-8 w-8 items-center justify-center rounded-[8px] border transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
        isActive
          ? 'border-[#FF3E9D] bg-[#FFF5F9] text-[#FF3E9D]'
          : 'border-[#E4E4E1] bg-[#F5F5F3] text-[#686866] hover:bg-white hover:text-[#101010] hover:border-[#D1D1CD]'
      }`}
      aria-label="Open website analytics"
      title="Website Analytics"
    >
      <BarChart3 className="h-4 w-4" />
    </Link>
  );
}
