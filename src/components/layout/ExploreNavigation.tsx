'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
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
  { label: 'Careers', href: '/careers', detail: 'Join our operational, engineering and technical team' },
  { label: 'Contact', href: '/contact-us', detail: 'Get in touch with our team' },
  { label: 'Log a Job', href: '/clients/log-a-job', detail: 'Multimodal AI-assisted job logging & triage' },
  { label: 'Legal Centre', href: '/legal', detail: 'Privacy, terms and governance' },
];

const LOBBY_CATEGORY_LINKS = [
  { label: 'The Lobby Homepage', href: '/lobby', detail: 'The daily briefing room for facilities professionals' },
  { label: 'The Week That Matters', href: '/lobby#week-that-matters', detail: 'Priority FM analysis and regulatory developments' },
  { label: 'Compliance Watch', href: '/lobby#compliance-watch', detail: 'Statutory mandates translated into operational directives' },
  { label: 'The Engineer’s Note', href: '/lobby#engineers-note', detail: 'Field diagnostics and technical observations' },
  { label: 'FM Toolkit', href: '/lobby#toolkit', detail: 'Calculators, schedules, and RFP specification builders' },
  { label: 'The Lobby Archive', href: '/lobby/archive', detail: 'Browse all historical briefings and intelligence articles' },
];

type PrimaryCategory = {
  id?: string;
  label: string;
  href: string;
  columns?: Array<{ heading: string; links: Array<{ label: string; href: string; detail?: string }> }>;
  feature?: { eyebrow: string; title: string; body: string; href: string; cta: string; imageKey: string };
};

const CATEGORIES: PrimaryCategory[] = [
  {
    id: 'lobby',
    label: 'The Lobby',
    href: '/lobby',
    columns: [{ heading: 'Editorial & Intelligence', links: LOBBY_CATEGORY_LINKS }],
    feature: {
      eyebrow: 'Daily Intelligence',
      title: 'Know what’s changed. Understand what matters.',
      body: 'The briefing room for UK facilities management professionals: regulatory updates, engineering diagnostics, and compliance analysis.',
      href: '/lobby',
      cta: 'Enter The Lobby',
      imageKey: 'client-review',
    },
  },
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
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset to first category / collapsed mobile state when opening
  useEffect(() => {
    if (open) {
      setActiveId(getCategoryId(CATEGORIES[0]));
      setMobileExpandedId(null);
      // Slight delay so the opening animation completes before focusing
      setTimeout(() => closeButtonRef.current?.focus(), 150);
    }
  }, [open]);

  // Scroll lock
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
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

  const activeCategory = CATEGORIES.find((c) => getCategoryId(c) === activeId) ?? CATEGORIES[0];

  const toggleMobileCategory = (id: string) => {
    setMobileExpandedId((curr) => (curr === id ? null : id));
  };

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
      style={{ height: '100dvh' }}
    >
      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 sm:px-8 lg:px-10 h-[72px] border-b border-white/[0.08] bg-brand-void/90 backdrop-blur-md">
        {/* Logo wordmark */}
        <Link
          href="/"
          onClick={onClose}
          className="text-[19px] font-extralight tracking-[0.08em] text-white focus-visible:ring-1 focus-visible:ring-brand-pink"
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
          className="group flex items-center gap-2 text-brand-mist/70 hover:text-white transition-colors duration-200 py-2 px-1 focus-visible:ring-1 focus-visible:ring-brand-pink rounded-sm"
        >
          <span className="text-xs font-light tracking-widest uppercase hidden sm:block">Close</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 bg-white/[0.03] group-hover:border-white/30 group-hover:bg-white/[0.08] transition-all">
            <X className="h-4 w-4" />
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE ACCORDION DRAWER (< lg)                                         */}
      {/* ========================================================================= */}
      <div
        className={`lg:hidden absolute inset-0 pt-[72px] overflow-y-auto overscroll-contain transition-all duration-300 ease-brand ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        <div className="px-5 py-6 space-y-2 pb-28">
          {/* Main Accordion Items */}
          <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {CATEGORIES.map((cat) => {
              const id = getCategoryId(cat);
              const isExpanded = mobileExpandedId === id;

              return (
                <div key={id} className="py-1">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleMobileCategory(id)}
                      aria-expanded={isExpanded}
                      aria-controls={`mobile-nav-${id}`}
                      tabIndex={open ? 0 : -1}
                      className="flex-1 flex items-center justify-between py-3.5 pr-2 text-left group focus-visible:outline-none"
                    >
                      <span className="text-lg font-light tracking-tight text-white group-hover:text-brand-pink-light transition-colors">
                        {cat.label}
                      </span>
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-sm border border-white/10 text-brand-mist/60 group-hover:text-white transition-transform duration-300 ${
                          isExpanded ? 'rotate-90 bg-white/[0.08] text-white border-brand-pink/40' : ''
                        }`}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </div>

                  {/* Expanded Sub-category content */}
                  {isExpanded && (
                    <div id={`mobile-nav-${id}`} className="pt-2 pb-5 pl-2 pr-1 space-y-5 animate-rise">
                      {/* Direct All Category Link */}
                      <div>
                        <Link
                          href={cat.href}
                          onClick={onClose}
                          tabIndex={open ? 0 : -1}
                          className="inline-flex items-center gap-2 text-sm font-normal text-brand-pink-light hover:text-white py-1.5 transition-colors"
                        >
                          <span>{cat.label === 'Locations' ? 'View National Map & Locations' : cat.label === 'Company' ? 'About EntireFM Overview' : `All ${cat.label} Overview`}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      {/* Columns / Sub-links */}
                      {cat.columns?.map((col) => (
                        <div key={col.heading} className="space-y-2">
                          <p className="text-[10px] font-normal uppercase tracking-wider text-brand-mist/45">
                            {col.heading}
                          </p>
                          <div className="space-y-1">
                            {col.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                tabIndex={open ? 0 : -1}
                                className="block py-2 px-3 rounded-sm bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/15 transition-all"
                              >
                                <div className="flex items-center justify-between text-sm font-light text-brand-mist/90">
                                  <span>{link.label}</span>
                                  <ArrowUpRight className="h-3.5 w-3.5 text-brand-electric-bright shrink-0 opacity-70" />
                                </div>
                                {link.detail && (
                                  <p className="text-[11.5px] font-light text-brand-mist/50 mt-0.5 leading-snug line-clamp-1">
                                    {link.detail}
                                  </p>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Access Portal & Contact Buttons */}
          <div className="pt-6 space-y-3">
            <p className="text-[10.5px] font-normal uppercase tracking-widest text-brand-mist/40 px-1">
              Direct Access &amp; Portals
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                href="/client-portal"
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className="flex items-center justify-between p-3.5 rounded-sm bg-brand-carbon border border-brand-edge-dark hover:border-brand-electric/60 transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-brand-pink-light font-normal">Client Portal</span>
                  <span className="text-sm font-light text-white">EntireCAFM Console</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-brand-electric-bright group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                href="/supplier-portal"
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className="flex items-center justify-between p-3.5 rounded-sm bg-brand-carbon border border-brand-edge-dark hover:border-brand-electric/60 transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-brand-mist/60 font-normal">Supply Chain</span>
                  <span className="text-sm font-light text-white">Supplier Portal</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-brand-electric-bright group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                href="/login"
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className="flex items-center justify-center p-3 rounded-sm bg-white/[0.04] border border-white/10 text-xs font-light text-white hover:bg-white/[0.08] transition-all"
              >
                Portal Login
              </Link>
              <Link
                href="/contact-us"
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className="btn-hero-pink py-3 text-xs justify-center"
              >
                Request Proposal
              </Link>
            </div>

            {/* Log a Job Multimodal AI CTA below Contact */}
            <Link
              href="/clients/log-a-job"
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="flex items-center justify-between p-3.5 rounded-sm bg-brand-electric/15 border border-brand-electric/40 text-white hover:bg-brand-electric/25 hover:border-brand-electric transition-all group"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-brand-electric-bright font-medium">Multimodal AI Helpdesk</span>
                  <span className="rounded bg-brand-electric px-1.5 py-0.5 text-[9px] uppercase font-bold text-white tracking-wider">AI</span>
                </div>
                <span className="text-sm font-light text-white mt-0.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-electric-bright shrink-0" />
                  Log a Job
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-brand-electric-bright group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP TWO-PANE NAVIGATION (≥ lg)                                     */}
      {/* ========================================================================= */}
      <div
        className={`hidden lg:flex absolute inset-0 pt-[72px] transition-all duration-300 ease-brand ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        {/* LEFT — Primary category list */}
        <nav
          aria-label="Main categories"
          className="shrink-0 w-[260px] xl:w-[300px] border-r border-white/[0.06] overflow-y-auto py-8 xl:py-10"
        >
          <ul className="space-y-1 px-6 xl:px-10">
            {CATEGORIES.map((cat) => {
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
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                        isActive ? 'bg-brand-pink scale-125' : 'bg-transparent group-hover:bg-white/30'
                      }`}
                    />
                  </button>
                </li>
              );
            })}

            {/* Direct Main Navigation Items: Client Portal, About, Contact & Log a Job CTA */}
            <li className="pt-4 mt-3 border-t border-white/[0.06]">
              <ul className="space-y-1">
                {SECONDARY_NAV.filter(l => !CATEGORIES.some(c => c.href === l.href)).map((link) => {
                  const isLogAJob = link.href === '/clients/log-a-job';
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        tabIndex={open ? 0 : -1}
                        className={`group w-full flex items-center justify-between py-2.5 px-4 rounded-sm text-left transition-all duration-200 ${
                          isLogAJob
                            ? 'bg-brand-electric/15 border border-brand-electric/40 text-brand-electric-bright hover:bg-brand-electric/25 hover:border-brand-electric hover:text-white shadow-sm shadow-brand-electric/20 mt-2'
                            : 'text-brand-mist/70 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className={`text-sm tracking-tight flex items-center gap-2 ${isLogAJob ? 'font-medium text-white' : 'font-light text-brand-mist/70 group-hover:text-white transition-colors'}`}>
                          {isLogAJob && <Sparkles className="h-3.5 w-3.5 text-brand-electric-bright shrink-0" />}
                          <span>{link.label}</span>
                          {isLogAJob && (
                            <span className="rounded bg-brand-electric px-1.5 py-0.2 text-[9px] uppercase font-bold text-white tracking-wider">
                              AI
                            </span>
                          )}
                        </span>
                        {link.href === '/client-portal' ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-brand-mist/40 group-hover:text-white transition-colors" />
                        ) : isLogAJob ? (
                          <ArrowRight className="h-3.5 w-3.5 text-brand-electric-bright group-hover:translate-x-0.5 transition-transform" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-brand-mist/40 group-hover:text-white transition-colors" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>

        {/* RIGHT — Sub-navigation panel */}
        <div className="flex-1 relative overflow-hidden min-w-0">
          {CATEGORIES.map((cat) => {
            const id = getCategoryId(cat);
            const isActive = id === activeId;
            const image = cat.feature ? IMAGES[cat.feature.imageKey] : null;

            return (
              <div
                key={id}
                id={`explore-panel-${id}`}
                role="region"
                aria-label={cat.label}
                className={`absolute inset-0 transition-all duration-300 ease-brand overflow-y-auto ${
                  isActive
                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                    : 'opacity-0 translate-x-2 pointer-events-none'
                }`}
              >
                <div className="h-full flex flex-col xl:flex-row">
                  {/* Sub-nav link columns */}
                  <div className="flex-1 py-10 px-8 xl:px-14">
                    {/* Category header */}
                    <div className="mb-8">
                      <span className="text-[10.5px] font-normal uppercase tracking-[0.18em] text-brand-pink block mb-2">
                        {cat.label}
                      </span>
                      <Link
                        href={cat.href}
                        onClick={onClose}
                        tabIndex={isActive && open ? 0 : -1}
                        className="group inline-flex items-center gap-2 text-2xl xl:text-3xl font-light tracking-tight text-white hover:text-brand-mist transition-colors"
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
                            ? 'grid-cols-2 xl:grid-cols-3'
                            : cat.columns.length === 2
                            ? 'grid-cols-2'
                            : 'grid-cols-2'
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
