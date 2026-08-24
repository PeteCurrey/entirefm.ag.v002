'use client';

import React from 'react';
import Image from 'next/image';
import { Site } from '@/server/estate';
import { ChevronLeft, ChevronRight, Building2, MapPin } from 'lucide-react';

export interface SiteCarouselItem extends Site {
  heroImageUrl?: string;
  openJobsCount?: number;
  healthStatus?: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

interface SiteCarouselSelectorProps {
  sites: SiteCarouselItem[];
  selectedSiteId: string;
  onSelectSite: (siteId: string) => void;
}

export function SiteCarouselSelector({
  sites,
  selectedSiteId,
  onSelectSite,
}: SiteCarouselSelectorProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative rounded-[14px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between px-2 pb-2 border-b border-[#E4E4E1] mb-2 font-mono text-[10.5px] uppercase tracking-wider text-[#686866]">
        <span>ESTATE PORTFOLIO SELECTOR · RAPID DOCK</span>
        <span>{sites.length} PROPERTIES REGISTERED</span>
      </div>

      <div className="relative flex items-center">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#E4E4E1] bg-[#FFFFFF] shadow-md hover:bg-[#F5F5F3] text-[#101010]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Horizontal Strip */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 overflow-x-auto py-1 px-2 cafm-scroll w-full scroll-smooth"
        >
          {sites.map((site) => {
            const isSelected = site.id === selectedSiteId;

            return (
              <button
                key={site.id}
                onClick={() => onSelectSite(site.id)}
                className={`group relative flex items-center gap-3 rounded-[10px] border p-2 text-left shrink-0 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#FF6B24] bg-[#FFF7ED] ring-2 ring-[#FF6B24] shadow-sm'
                    : 'border-[#E4E4E1] bg-[#FFFFFF] hover:border-[#D1D1CD] hover:bg-[#F5F5F3]'
                }`}
                style={{ width: '220px' }}
              >
                {/* Thumbnail Image */}
                <div className="relative h-12 w-12 rounded-[6px] overflow-hidden bg-[#F0F0EE] shrink-0 border border-[#E4E4E1]">
                  <Image
                    src={site.heroImageUrl || '/images/EntireFM 01.png'}
                    alt={site.name}
                    fill
                    className="object-cover"
                  />
                  <div
                    className={`absolute top-1 right-1 h-2 w-2 rounded-full ${
                      site.healthStatus === 'CRITICAL'
                        ? 'bg-[#DC2626]'
                        : site.healthStatus === 'WARNING'
                        ? 'bg-[#D97706]'
                        : 'bg-[#16A34A]'
                    }`}
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] text-[#FF6B24] font-semibold truncate">
                    {site.site_code}
                  </div>
                  <div className="font-medium text-[12px] text-[#101010] truncate">
                    {site.name}
                  </div>
                  <div className="text-[10.5px] text-[#686866] truncate mt-0.5 flex items-center gap-1">
                    <span>{site.city}</span>
                    <span className="text-[#9B9B97]">·</span>
                    <span className="font-mono text-[10px]">
                      {site.openJobsCount || 0} jobs
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#E4E4E1] bg-[#FFFFFF] shadow-md hover:bg-[#F5F5F3] text-[#101010]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
