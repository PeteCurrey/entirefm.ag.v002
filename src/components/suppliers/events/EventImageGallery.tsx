'use client';

import React from 'react';
import Image from 'next/image';

interface GalleryItem {
  src: string;
  alt: string;
  title: string;
  category: string;
  aspectClass: string;
  gridSpan: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  {
    src: '/images/editorial/entirefm-client-review-1200w.webp',
    alt: 'Contractors and FM professionals networking during a technical industry session',
    title: 'Technical Review & Commercial Strategy',
    category: 'Industry Roundtable',
    aspectClass: 'aspect-[4/3] sm:aspect-[16/10]',
    gridSpan: 'lg:col-span-8 lg:row-span-2',
  },
  {
    src: '/images/editorial/entirefm-engineers-office-testing-1200w.webp',
    alt: 'Front-line engineers and specialists reviewing electrical schematics and technical data',
    title: 'Hands-on Engineering & Diagnostics',
    category: 'Supplier Academy',
    aspectClass: 'aspect-[4/3]',
    gridSpan: 'lg:col-span-4',
  },
  {
    src: '/images/editorial/entirefm-distribution-board-testing-1200w.webp',
    alt: 'Technical demonstration of commercial switchgear compliance and testing',
    title: 'Plantroom Equipment & Safety Standards',
    category: 'Technical Breakfast',
    aspectClass: 'aspect-[4/3]',
    gridSpan: 'lg:col-span-4',
  },
  {
    src: '/images/editorial/entirefm-reception-1200w.webp',
    alt: 'Delegates and contractors gathering in regional event venue reception',
    title: 'Regional Contractor Welcome & Registration',
    category: 'Supplier Breakfast',
    aspectClass: 'aspect-[4/3]',
    gridSpan: 'lg:col-span-4',
  },
  {
    src: '/images/editorial/entirefm-switchroom-survey-1200w.webp',
    alt: 'Engineers speaking directly with manufacturer representatives in live plant room environment',
    title: 'OEM Systems & Technology Briefing',
    category: 'Meet the Manufacturer',
    aspectClass: 'aspect-[4/3]',
    gridSpan: 'lg:col-span-4',
  },
  {
    src: '/images/editorial/entirefm-hvac-cassette-service-1200w.webp',
    alt: 'Specialist HVAC contractor demonstrating maintenance protocols',
    title: 'Practical Trade Competency & Methodologies',
    category: 'Technical Workshop',
    aspectClass: 'aspect-[4/3]',
    gridSpan: 'lg:col-span-4',
  },
];

export function EventImageGallery() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAFAF8] border-b border-[#E8E8E5]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
              PHOTO GALLERY &bull; THE PARTNER NETWORK
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
            Inside the EntireFM Network
          </h2>

          <p className="text-sm sm:text-base text-[#6D6D68] font-light leading-relaxed">
            The kind of conversations our network is built around: technical knowledge exchange, direct equipment inspection, commercial clarity, and face-to-face contractor relationships.
          </p>
        </div>

        {/* Editorial Asymmetrical Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          {GALLERY_IMAGES.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] shadow-xs ${item.gridSpan}`}
            >
              <div className={`relative w-full ${item.aspectClass} overflow-hidden`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {/* Subtle vignette scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFEDD5] mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold leading-tight text-white drop-shadow-sm">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subtext Disclaimer / Authenticity note */}
        <div className="mt-6 pt-4 border-t border-[#E8E8E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#9A9A95]">
          <span>Documenting ongoing supplier, engineering, and partner network activity across the UK.</span>
          <span className="font-medium text-[#6D6D68]">EntireFM UK Partner Network Programme</span>
        </div>
      </div>
    </section>
  );
}
