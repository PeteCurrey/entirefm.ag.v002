'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ArrowRight, ChevronRight, Filter, ShieldCheck, Wrench, Sparkles, SlidersHorizontal } from 'lucide-react';
import { CURATED_SERVICES, CuratedService, ServiceFamilyId } from '@/config/services-taxonomy';

type FilterCategory = 'all' | ServiceFamilyId;

const FILTER_TABS: Array<{ id: FilterCategory; label: string }> = [
  { id: 'all', label: 'All Services' },
  { id: 'hard-fm', label: 'Hard FM' },
  { id: 'compliance', label: 'Compliance & PPM' },
  { id: 'soft-fm', label: 'Soft FM' },
  { id: 'specialist', label: 'Specialist Access' },
  { id: 'drone', label: 'Drone Services' },
];

export function CuratedServiceDirectory() {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    return CURATED_SERVICES.filter((svc) => {
      // Category match
      const matchesCategory = selectedFilter === 'all' || svc.family === selectedFilter;
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        svc.title.toLowerCase().includes(query) ||
        svc.shortDescription.toLowerCase().includes(query) ||
        svc.categoryLabel.toLowerCase().includes(query) ||
        svc.capabilities.some(c => c.toLowerCase().includes(query)) ||
        svc.complianceTags.some(t => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  const activeHoveredService = hoveredServiceId 
    ? CURATED_SERVICES.find(s => s.id === hoveredServiceId) 
    : filteredServices[0] || CURATED_SERVICES[0];

  return (
    <section id="service-directory" className="relative bg-white py-20 sm:py-28 border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              COMMERCIAL SERVICE DIRECTORY
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
            All commercial services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Search our complete directory of Hard FM engineering, 52-week PPM schedules, statutory safety testing, Soft FM, high-level access, and drone services.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FAF9FB] border border-slate-200 rounded-sm p-4 sm:p-5 mb-10 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              {FILTER_TABS.map((tab) => {
                const isActive = selectedFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id)}
                    className={`whitespace-nowrap px-3.5 py-2 text-xs font-normal rounded-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Instant Search Input */}
            <div className="relative min-w-[280px] sm:min-w-[340px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services, disciplines, or compliance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-pink focus:border-brand-pink text-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Active Result Count */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-light pt-2 border-t border-slate-200/60">
            <span>
              Showing <strong className="font-normal text-slate-900">{filteredServices.length}</strong> of {CURATED_SERVICES.length} commercial service lines
            </span>
            {searchQuery && (
              <span className="text-brand-pink font-mono">
                Filtered by &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
        </div>

        {/* Directory Layout: Table Index + Live Desktop Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Service Rows List */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm overflow-hidden shadow-xs divide-y divide-slate-200">
            {filteredServices.length > 0 ? (
              filteredServices.map((svc) => (
                <Link
                  key={svc.id}
                  href={svc.slug}
                  onMouseEnter={() => setHoveredServiceId(svc.id)}
                  className="p-5 sm:px-6 sm:py-5 hover:bg-[#FAF9FB] transition-colors duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group block"
                >
                  <div className="space-y-1 sm:max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400 group-hover:text-brand-pink transition-colors">
                        {svc.number}
                      </span>
                      <h3 className="text-base font-normal text-slate-900 group-hover:text-brand-pink transition-colors">
                        {svc.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-1">
                      {svc.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <span className="text-[10.5px] font-mono uppercase bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xs border border-slate-200">
                      {svc.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-normal text-slate-500 group-hover:text-brand-pink transition-colors">
                      <span className="hidden sm:inline">Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-pink" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 font-light space-y-3">
                <p>No services matched your query &quot;{searchQuery}&quot;.</p>
                <button
                  onClick={() => { setSelectedFilter('all'); setSearchQuery(''); }}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* Sticky Desktop Preview Panel */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28 bg-[#FAF9FB] border border-slate-200 rounded-sm p-6 space-y-5 shadow-sm">
            {activeHoveredService ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="relative aspect-[16/10] rounded-sm overflow-hidden border border-slate-200">
                  <Image
                    key={activeHoveredService.image}
                    src={activeHoveredService.image}
                    alt={activeHoveredService.imageAlt}
                    fill
                    sizes="30vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-mono uppercase bg-brand-pink text-white px-2 py-0.5 rounded-xs">
                      {activeHoveredService.categoryLabel}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    SERVICE {activeHoveredService.number}
                  </span>
                  <h4 className="text-lg font-normal text-slate-900 mt-0.5">
                    {activeHoveredService.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-light mt-2 leading-relaxed">
                    {activeHoveredService.shortDescription}
                  </p>
                </div>

                {/* Capabilities Preview */}
                <div className="space-y-1.5 pt-3 border-t border-slate-200">
                  <span className="text-[10.5px] font-mono uppercase text-slate-400 block font-light">
                    Deliverables Include:
                  </span>
                  {activeHoveredService.capabilities.slice(0, 3).map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-pink shrink-0" />
                      <span className="truncate">{cap}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href={activeHoveredService.slug}
                    className="btn-primary w-full text-xs py-2.5 text-center justify-center inline-flex items-center gap-1.5"
                  >
                    <span>View Full Service Scope</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-10 font-light">
                Hover over any service in the list to view specifications.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
