'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight, ArrowUpRight } from 'lucide-react';
import { PRIMARY_NAV, SECONDARY_NAV } from '@/config/navigation';
import editorial from '@/config/location-images.json';

type EditorialManifest = {
  editorial: Record<string, { src: string; alt: string }>;
};
const IMAGES = (editorial as EditorialManifest).editorial ?? {};

// Extra top-level categories not in PRIMARY_NAV
const LOCATION_LINKS = [
  { label: 'London', href: '/facilities-management-london', detail: 'FM services across Greater London' },
  { label: 'Manchester', href: '/facilities-management-manchester', detail: 'North West coverage' },
  { label: 'Sheffield', href: '/facilities-management-sheffield', detail: 'South Yorkshire operations' },
  { label: 'Leeds', href: '/facilities-management-leeds', detail: 'West Yorkshire coverage' },
  { label: 'Birmingham', href: '/facilities-management-birmingham', detail: 'West Midlands operations' },
  { label: 'Bristol', href: '/facilities-management-bristol', detail: 'South West operations' },
  { label: 'All Locations', href: '/locations', detail: 'National coverage map & all regional pages' },
];

const COMPANY_LINKS = [
  { label: 'About EntireFM', href: '/about-entire-facilities-management', detail: 'Our story, values and leadership' },
  { label: 'Contact', href: '/contact-us', detail: 'Get in touch with our team' },
  { label: 'Careers', href: '/contact-us', detail: 'Join the EntireFM team' },
  { label: 'Legal Centre', href: '/legal', detail: 'Privacy, terms and governance' },
  { label: 'HTML Sitemap', href: '/html-sitemap', detail: 'Full site structure' },
];

type PrimaryCategory = {
  id?: string;
  label: string;
  href: string;
  columns?: Array<{ heading: string; links: Array<{ label: string; href: string; detail?: string }> }>;
  feature?: { eyebrow: string; title: string; body: string; href: string; cta: string; imageKey: string };
};

const CATEGORIES: PrimaryCategory[] = [
  ...(PRIMARY_NAV as PrimaryCategory[]),
  {
    id: 'locations',
    label: 'Locations',
    href: '/locations',
    columns: [{ heading: 'Nationwide Coverage', links: LOCATION_LINKS }],
    feature: {
      eyebrow: 'National Reach',
      title: 'Consistent standards. Local knowledge.',
      body: 'EntireFM operates across England and Wales with regional hubs in London, Manchester, Yorkshire, and the Midlands.',
      href: '/locations',
      cta: 'View all locations',
      imageKey: 'headquarters-exterior',
    },
  },
  {
    id: 'company',
    label: 'Company',
    href: '/about-entire-facilities-management',
    columns: [{ heading: 'About & Contact', links: COMPANY_LINKS }],
    feature: {
      eyebrow: 'EntireFM',
      title: 'Facilities Management. Evolved.',
      body: 'A technology-enabled FM operator committed to transparency, operational excellence and long-term client relationships.',
      href: '/about-entire-facilities-management',
      cta: 'About us',
      imageKey: 'totem-headquarters',
    },
  },
];

// Derive a stable key: use explicit id if set, otherwise lowercase label
function getCategoryId(cat: PrimaryCategory): string {
  return cat.id ?? cat.label.toLowerCase();
}

interface ExploreNavigationProps {
  open: boolean;
  onClose: () => void;
}

export function ExploreNavigation({ open, onClose }: ExploreNavigationProps) {
  const [activeId, setActiveId] = useState<string>(getCategoryId(CATEGORIES[0]));
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset to first category when opening
  useEffect(() => {
    if (open) {
      setActiveId(getCategoryId(CATEGORIES[0]));
      // Slight delay so the opening animation completes before focusing
      setTimeout(() => closeButtonRef.current?.focus(), 150);
    }
  }, [open]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const activeCategory = CATEGORIES.find((c, i) => getCategoryId(c) === activeId) ?? CATEGORIES[0];
  const activeImage = activeCategory.feature ? IMAGES[activeCategory.feature.imageKey] : null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation"
      aria-hidden={!open}
      className={`fixed inset-0 z-50 bg-brand-void transition-all duration-300 ease-brand ${
        open
          ? 'opacity-100 visible pointer-events-auto'
          : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      {/* Close button */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-6 sm:px-10 h-[72px] border-b border-white/[0.06]">
        {/* Logo wordmark */}
        <Link
          href="/"
          onClick={onClose}
          className="text-[19px] font-extralight tracking-[0.08em] text-white"
          tabIndex={open ? 0 : -1}
        >
          Entire<span className="font-bold text-hero-pink">FM</span>
        </Link>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
          aria-label="Close navigation"
          className="group flex items-center gap-2 text-brand-mist/60 hover:text-white transition-colors duration-200"
        >
          <span className="text-xs font-light tracking-wider hidden sm:block">CLOSE</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/15 group-hover:border-white/30 transition-colors">
            <X className="h-4 w-4" />
          </span>
        </button>
      </div>

      {/* Main content grid */}
      <div
        className={`absolute inset-0 pt-[72px] flex flex-col lg:flex-row transition-all duration-300 ease-brand ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        {/* LEFT — Primary category list */}
        <nav
          aria-label="Main categories"
          className="shrink-0 w-full lg:w-[260px] xl:w-[300px] border-r border-white/[0.06] overflow-y-auto py-8 lg:py-10"
        >
          <ul className="space-y-1 px-6 sm:px-8 lg:px-10">
            {CATEGORIES.map((cat, index) => {
              const id = getCategoryId(cat);
              const isActive = id === activeId;
              return (
                <li key={id}>
                  <button
                    type="button"
                    tabIndex={open ? 0 : -1}
                    onMouseEnter={() => setActiveId(id)}
                    onClick={() => setActiveId(id)}
                    className={`group w-full flex items-center justify-between py-3 px-4 rounded-sm text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-white/[0.06] text-white'
                        : 'text-brand-mist/70 hover:text-white hover:bg-white/[0.03]'
                    }`}
                    aria-expanded={isActive}
                    aria-controls={`explore-panel-${id}`}
                  >
                    <span className={`text-[15px] font-light tracking-tight ${isActive ? 'text-white' : ''}`}>
                      {cat.label}
                    </span>
                    <span
                      className={`h-1 w-1 rounded-full transition-all duration-200 ${
                        isActive ? 'bg-brand-pink scale-125' : 'bg-transparent group-hover:bg-white/30'
                      }`}
                    />
                  </button>
                </li>
              );
            })}

            {/* Secondary nav items */}
            <li className="pt-6 mt-2 border-t border-white/[0.06]">
              <ul className="space-y-1">
                {SECONDARY_NAV.filter(l => !CATEGORIES.some(c => c.href === l.href)).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      tabIndex={open ? 0 : -1}
                      className="block py-2 px-4 text-[13px] font-light text-brand-mist/55 hover:text-white transition-colors rounded-sm hover:bg-white/[0.03]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>

        {/* RIGHT — Sub-navigation panel */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {CATEGORIES.map((cat, index) => {
            const id = getCategoryId(cat);
            const isActive = id === activeId;
            const image = cat.feature ? IMAGES[cat.feature.imageKey] : null;

            return (
              <div
                key={id}
                id={`explore-panel-${id}`}
                role="region"
                aria-label={cat.label}
                className={`absolute inset-0 pt-[72px] lg:left-[260px] xl:left-[300px] transition-all duration-300 ease-brand overflow-y-auto ${
                  isActive
                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                    : 'opacity-0 translate-x-2 pointer-events-none'
                }`}
              >
                <div className="h-full flex flex-col xl:flex-row">
                  {/* Sub-nav link columns */}
                  <div className="flex-1 py-10 px-8 sm:px-12 xl:px-14">
                    {/* Category header */}
                    <div className="mb-8">
                      <span className="text-[10.5px] font-normal uppercase tracking-[0.18em] text-brand-pink block mb-2">
                        {cat.label}
                      </span>
                      <Link
                        href={cat.href}
                        onClick={onClose}
                        tabIndex={isActive && open ? 0 : -1}
                        className="group inline-flex items-center gap-2 text-2xl sm:text-3xl font-light tracking-tight text-white hover:text-brand-mist transition-colors"
                      >
                        {cat.label === 'Locations' ? 'Our Locations' :
                         cat.label === 'Company' ? 'About EntireFM' :
                         `All ${cat.label}`}
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    </div>

                    {/* Columns grid */}
                    {cat.columns && (
                      <div
                        className={`grid gap-8 xl:gap-10 ${
                          cat.columns.length >= 3
                            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                            : cat.columns.length === 2
                            ? 'grid-cols-1 sm:grid-cols-2'
                            : 'grid-cols-1 sm:grid-cols-2'
                        }`}
                      >
                        {cat.columns.map((column) => (
                          <div key={column.heading}>
                            <p className="text-[10.5px] font-normal uppercase tracking-[0.15em] text-brand-mist/50 mb-4">
                              {column.heading}
                            </p>
                            <ul className="space-y-1">
                              {column.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={onClose}
                                    tabIndex={isActive && open ? 0 : -1}
                                    className="group/link block py-2 px-3 -mx-3 rounded-sm hover:bg-white/[0.04] transition-colors duration-200"
                                  >
                                    <span className="flex items-center justify-between gap-2">
                                      <span className="text-[13.5px] font-light text-brand-mist group-hover/link:text-white transition-colors">
                                        {link.label}
                                      </span>
                                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-brand-electric-bright opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-250" />
                                    </span>
                                    {link.detail && (
                                      <span className="mt-0.5 block text-[11.5px] font-light leading-snug text-brand-silver group-hover/link:text-brand-mist/70 transition-colors">
                                        {link.detail}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Feature image plate */}
                  {cat.feature && (
                    <div className="shrink-0 xl:w-[320px] 2xl:w-[380px] hidden xl:block">
                      <div className="h-full relative overflow-hidden border-l border-white/[0.06]">
                        {image && (
                          <>
                            <Image
                              src={image.src}
                              alt={image.alt || ''}
                              fill
                              sizes="380px"
                              className="object-cover transition-transform duration-700 ease-brand scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-void via-brand-void/80 to-brand-void/25" />
                          </>
                        )}
                        {!image && (
                          <div className="absolute inset-0 bg-brand-carbon" />
                        )}
                        <div className="absolute bottom-0 inset-x-0 p-8">
                          <span className="text-[10px] font-normal uppercase tracking-[0.18em] text-brand-pink block mb-3">
                            {cat.feature.eyebrow}
                          </span>
                          <p className="text-[16px] font-light text-white leading-snug mb-2">
                            {cat.feature.title}
                          </p>
                          <p className="text-[12.5px] font-light text-brand-mist/65 leading-relaxed mb-5">
                            {cat.feature.body}
                          </p>
                          <Link
                            href={cat.feature.href}
                            onClick={onClose}
                            tabIndex={isActive && open ? 0 : -1}
                            className="inline-flex items-center gap-1.5 text-[12.5px] font-normal text-brand-electric-bright hover:underline"
                          >
                            {cat.feature.cta}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
