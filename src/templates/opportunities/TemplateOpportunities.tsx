'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import {
  Briefcase,
  TrendingUp,
  Clock,
  MapPin,
  ExternalLink,
  Search,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Bookmark,
  Bell,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { ProcurementOpportunity, FMTradeCategory } from '@/server/intelligence/types';

export function TemplateOpportunities() {
  const [tenders, setTenders] = useState<ProcurementOpportunity[]>([]);
  const [awards, setAwards] = useState<ProcurementOpportunity[]>([]);
  const [counts, setCounts] = useState<{ activeTenders: number; contractAwards: number; closingSoon: number }>({
    activeTenders: 0,
    contractAwards: 0,
    closingSoon: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'closing_soon' | 'frameworks' | 'awards'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/lobby/intelligence/opportunities?view=${activeTab === 'awards' ? 'awards' : 'all'}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setTenders(json.tenders || []);
          setAwards(json.awards || []);
          if (json.counts) setCounts(json.counts);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTab]);

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Disciplines' },
    { key: 'procurement-contracts', label: 'Total Facilities Management' },
    { key: 'mechanical', label: 'M&E Maintenance' },
    { key: 'hvac', label: 'HVAC & Refrigeration' },
    { key: 'electrical', label: 'Electrical & Fixed Wire (BS 7671)' },
    { key: 'water-hygiene', label: 'Water Hygiene & ACOP L8' },
    { key: 'fire-safety', label: 'Fire & Life Safety' },
    { key: 'energy-sustainability', label: 'Energy & Decarbonisation' },
  ];

  const regions = [
    { key: 'all', label: 'All UK Regions' },
    { key: 'London', label: 'London' },
    { key: 'South East', label: 'South East' },
    { key: 'Midlands', label: 'Midlands' },
    { key: 'North West', label: 'North West' },
    { key: 'United Kingdom', label: 'National Frameworks' },
  ];

  // Lead featured opportunity
  const featuredOpportunity = tenders.find((t) => t.isEditoriallyFeatured) || tenders[0];

  // Filtered lists
  const displayTenders = tenders.filter((item) => {
    if (activeTab === 'closing_soon' && item.status !== 'closing_soon') return false;
    if (selectedCategory !== 'all' && item.serviceCategory !== selectedCategory) return false;
    if (selectedRegion !== 'all' && !item.buyerRegion.toLowerCase().includes(selectedRegion.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.buyerName.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const closingSoonTenders = tenders.filter((t) => t.status === 'closing_soon').slice(0, 3);
  const featuredAward = awards.find((a) => a.isEditoriallyFeatured) || awards[0];
  const recentAwards = awards.filter((a) => a.id !== featuredAward?.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ─── 1. MASTHEAD HEADER (LIGHT / ARCHITECTURAL / WORK SANS EXTRALIGHT) ─── */}
      <header className="border-b border-neutral-200/80 bg-white pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Top Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                FM Commercial Intelligence Desk
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-extralight text-neutral-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified OCDS Pipeline · Contracts Finder &amp; Find a Tender</span>
            </div>
          </div>

          {/* Title & Standfirst */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-neutral-900 leading-[1.08]">
                Public &amp; Commercial <br className="hidden sm:inline" />
                FM Opportunities
              </h1>

              <p className="text-lg sm:text-xl font-extralight text-neutral-700 leading-relaxed">
                FM contracts, frameworks, and public procurement worth knowing about. Filtered exclusively for facilities, estates, and building services.
              </p>
            </div>

            {/* Member Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/member/profile"
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light tracking-wide rounded-[4px] inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Configure tender alerts</span>
              </Link>
            </div>
          </div>

          {/* Navigation & Search Bar */}
          <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by buyer, service, or location (e.g. M&E London)..."
                className="w-full pl-10 pr-4 py-2 text-xs font-light text-neutral-900 placeholder:text-neutral-400 bg-neutral-50/80 border border-neutral-200 focus:border-neutral-900 rounded-[4px] focus:outline-none transition-colors"
              />
            </div>

            {/* Text-Led Filter Tabs */}
            <div className="flex items-center gap-6 text-xs font-light overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-1 transition-colors border-b-2 ${
                  activeTab === 'all'
                    ? 'border-neutral-900 text-neutral-900 font-normal'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Open Notices ({counts.activeTenders})
              </button>
              <button
                onClick={() => setActiveTab('closing_soon')}
                className={`pb-1 transition-colors border-b-2 ${
                  activeTab === 'closing_soon'
                    ? 'border-neutral-900 text-neutral-900 font-normal'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Closing Soon ({counts.closingSoon})
              </button>
              <button
                onClick={() => setActiveTab('awards')}
                className={`pb-1 transition-colors border-b-2 ${
                  activeTab === 'awards'
                    ? 'border-neutral-900 text-neutral-900 font-normal'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Who Won What ({counts.contractAwards})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN PROCUREMENT BODY ─── */}
      <main className="space-y-16 sm:space-y-24 py-12 sm:py-16">
        
        {/* ─── 2. NOTABLE OPPORTUNITY (Dominant Lead Feature) ─── */}
        {featuredOpportunity && activeTab !== 'awards' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                  Strategic Procurement
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  Opportunity Worth a Look
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500 hidden sm:inline">
                High-value strategic contract notice
              </span>
            </div>

            <article className="group bg-[#07090E] text-white rounded-[6px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
              
              {/* Left Photographic Plate (Col 5) */}
              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[380px] overflow-hidden bg-neutral-950">
                <Image
                  src="/images/editorial/commercial-building-envelope.jpg"
                  alt={featuredOpportunity.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-102 brightness-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-[3px] border border-white/10">
                    {featuredOpportunity.estimatedValue?.isFormatted || 'Value on Application'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 z-10 text-xs font-extralight text-neutral-300">
                  <span>{featuredOpportunity.buyerRegion} · {featuredOpportunity.contractDurationMonths ? `${featuredOpportunity.contractDurationMonths / 12} Years` : 'Multi-Year'}</span>
                </div>
              </div>

              {/* Right Opportunity Details (Col 7) */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  
                  {/* Buyer & Deadline Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extralight text-neutral-400">
                    <span className="text-brand-electric-bright font-normal">{featuredOpportunity.buyerName}</span>
                    <span>
                      Closes {featuredOpportunity.closingDate ? new Date(featuredOpportunity.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBC'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl sm:text-3xl font-extralight text-white leading-snug tracking-tight">
                    {featuredOpportunity.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-extralight text-neutral-300 leading-relaxed">
                    {featuredOpportunity.description}
                  </p>

                  {/* Why it Matters */}
                  <div className="border-l-2 border-brand-electric pl-3 py-0.5 mt-3">
                    <p className="text-xs font-light text-neutral-300 leading-relaxed">
                      <strong className="text-white font-normal">Why it matters:</strong> {featuredOpportunity.whyItMattersForFM}
                    </p>
                  </div>
                </div>

                {/* Footer CTAs */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                  <span className="text-xs font-extralight text-neutral-400">
                    Source: <span className="text-white">{featuredOpportunity.source}</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSave(featuredOpportunity.id)}
                      className={`p-2 rounded-[4px] border transition-colors ${
                        savedIds.has(featuredOpportunity.id)
                          ? 'border-brand-electric text-brand-electric bg-brand-electric/10'
                          : 'border-white/20 text-neutral-400 hover:text-white'
                      }`}
                      title="Save opportunity"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <a
                      href={featuredOpportunity.officialNoticeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-brand-electric hover:bg-blue-600 text-white text-xs font-light rounded-[4px] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>View official notice</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ─── 3. CLOSING SOON (Time-Sensitive Opportunities) ─── */}
        {closingSoonTenders.length > 0 && activeTab === 'all' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-700 font-light">
                  Time-Sensitive
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  Closing Soon
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500">
                Tender submission deadlines approaching
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {closingSoonTenders.map((tender) => (
                <div
                  key={tender.id}
                  className="p-6 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] uppercase text-brand-electric">{tender.serviceCategory}</span>
                      <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-[2px] font-light text-[10px]">
                        Closes {tender.closingDate ? new Date(tender.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Soon'}
                      </span>
                    </div>

                    <h4 className="text-base font-light text-neutral-900 leading-snug">
                      {tender.title}
                    </h4>

                    <p className="text-xs font-extralight text-neutral-600 line-clamp-2 leading-relaxed">
                      {tender.description}
                    </p>

                    <div className="pt-2 text-xs font-extralight text-neutral-500 border-t border-neutral-100">
                      <div>Buyer: <span className="text-neutral-800 font-light">{tender.buyerName}</span></div>
                      <div>Value: <span className="text-neutral-800 font-light">{tender.estimatedValue?.isFormatted || 'Value on Application'}</span></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-extralight">{tender.buyerRegion}</span>
                    <a
                      href={tender.officialNoticeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-electric hover:underline inline-flex items-center gap-1 font-light"
                    >
                      <span>Official notice</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 4. LATEST OPPORTUNITIES & FILTER BAR (Open Editorial Index) ─── */}
        {activeTab !== 'awards' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                  Procurement Stream
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  Latest FM Opportunities
                </h2>
              </div>

              {/* Discipline & Region Dropdowns */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs font-light bg-white border border-neutral-300 rounded-[4px] text-neutral-700 focus:outline-none focus:border-neutral-900"
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-1.5 text-xs font-light bg-white border border-neutral-300 rounded-[4px] text-neutral-700 focus:outline-none focus:border-neutral-900"
                >
                  {regions.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-neutral-400 font-light text-xs">
                Loading live procurement opportunities...
              </div>
            ) : displayTenders.length > 0 ? (
              <div className="divide-y divide-neutral-200 bg-white border border-neutral-200/90 rounded-[6px] px-6 sm:px-8 shadow-2xs">
                {displayTenders.map((tender) => (
                  <article key={tender.id} className="py-6 first:pt-6 last:pb-6 group space-y-2.5">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-light">
                          <span className="text-brand-electric font-mono text-[10px] uppercase tracking-wider">
                            {tender.serviceCategory}
                          </span>
                          <span className="text-neutral-300">·</span>
                          <span className="text-neutral-500">
                            {tender.buyerRegion}
                          </span>
                          {tender.status === 'closing_soon' && (
                            <>
                              <span className="text-neutral-300">·</span>
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-[2px] text-[10px]">
                                Closing Soon
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-lg font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                          <a href={tender.officialNoticeUrl} target="_blank" rel="noopener noreferrer">
                            {tender.title}
                          </a>
                        </h3>

                        <p className="text-xs sm:text-sm font-extralight text-neutral-600 line-clamp-2 leading-relaxed max-w-4xl">
                          {tender.description}
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-extralight text-neutral-500">
                          <div>Buyer: <span className="text-neutral-800 font-light">{tender.buyerName}</span></div>
                          <div>Value: <span className="text-neutral-800 font-light">{tender.estimatedValue?.isFormatted || 'Value on Application'}</span></div>
                          <div>
                            Deadline:{' '}
                            <span className="text-neutral-800 font-light">
                              {tender.closingDate ? new Date(tender.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBC'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
                        <button
                          onClick={() => toggleSave(tender.id)}
                          className={`p-2 rounded-[4px] border transition-colors ${
                            savedIds.has(tender.id)
                              ? 'border-brand-electric text-brand-electric bg-brand-electric/10'
                              : 'border-neutral-200 text-neutral-400 hover:text-neutral-800'
                          }`}
                          title="Save opportunity"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={tender.officialNoticeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-light rounded-[4px] inline-flex items-center gap-1.5 transition-colors"
                        >
                          <span>Official notice</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-neutral-400 font-light text-xs bg-white border border-neutral-200/80 rounded-[6px] space-y-2">
                <p>No procurement opportunities found matching this filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedRegion('all');
                    setSearchQuery('');
                  }}
                  className="text-brand-electric hover:underline text-xs"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* ─── 5. WHO WON WHAT (Market Awards Intelligence) ─── */}
        {(activeTab === 'all' || activeTab === 'awards') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                  Market Awards Wire
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  Who Won What
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500">
                Verified public sector contract awards
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Featured Award */}
              {featuredAward && (
                <div className="lg:col-span-6 p-6 sm:p-8 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs space-y-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-extralight text-neutral-500">
                      <span className="font-mono text-[10px] uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[2px]">
                        Featured Major Award
                      </span>
                      <span>{featuredAward.awardDetails?.awardedDate || '27 Aug 2026'}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-brand-electric">
                        {featuredAward.awardDetails?.supplierName || 'Mitie Group PLC'}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-light text-neutral-900 leading-snug">
                        {featuredAward.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-xs font-light">
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block tracking-wider">Buyer</span>
                        <span className="text-neutral-800">{featuredAward.buyerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block tracking-wider">Contract Value</span>
                        <span className="text-neutral-800 font-medium text-emerald-700">{featuredAward.estimatedValue?.isFormatted || '£48,000,000'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block tracking-wider">Region</span>
                        <span className="text-neutral-800">{featuredAward.buyerRegion}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block tracking-wider">Term</span>
                        <span className="text-neutral-800">{featuredAward.awardDetails?.contractPeriodYears ? `${featuredAward.awardDetails.contractPeriodYears} Years` : '5 Years'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-extralight">Source: Contracts Finder</span>
                    <a
                      href={featuredAward.officialNoticeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-electric hover:underline inline-flex items-center gap-1 font-light"
                    >
                      <span>Official award notice</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Smaller Award Rows */}
              <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                {recentAwards.map((award) => (
                  <div
                    key={award.id}
                    className="p-5 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs space-y-2 flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-brand-electric">
                        {award.awardDetails?.supplierName || 'Verified Contractor'}
                      </div>
                      <h4 className="text-sm font-light text-neutral-900 leading-snug">
                        {award.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs font-extralight text-neutral-500 pt-2 border-t border-neutral-100">
                      <span>{award.buyerName} · {award.buyerRegion}</span>
                      <span className="font-mono text-[11px] text-neutral-800 font-medium">{award.estimatedValue?.isFormatted || 'Awarded'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 6. ASK THE LOBBY INTEGRATION (Natural Language Procurement) ─── */}
        <section className="bg-[#0B1220] text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-electric/10 border border-brand-electric/20 text-brand-electric mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-extralight tracking-tight text-white">
                Natural-Language Procurement Search
              </h3>
              <p className="text-xs sm:text-sm font-extralight text-neutral-300 max-w-lg mx-auto leading-relaxed">
                Query EntireFM&apos;s verified public procurement database using conversational criteria.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/lobby/ask?q=Show%20me%20hard%20FM%20contracts%20in%20London%20closing%20in%20the%20next%2030%20days"
                className="px-4 py-2 rounded-[4px] bg-white/10 hover:bg-white/15 text-white text-xs font-light border border-white/10 transition-colors"
              >
                &ldquo;Show me hard FM contracts in London closing in the next 30 days&rdquo; &rarr;
              </Link>

              <Link
                href="/lobby/ask?q=Who%20has%20won%20major%20NHS%20FM%20contracts%20recently"
                className="px-4 py-2 rounded-[4px] bg-white/10 hover:bg-white/15 text-white text-xs font-light border border-white/10 transition-colors"
              >
                &ldquo;Who has won major NHS FM contracts recently?&rdquo; &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
