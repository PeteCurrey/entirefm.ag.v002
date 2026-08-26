'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  Clock,
  PoundSterling,
  Calendar,
  ArrowRight,
  Filter,
  Users,
  Search,
  Sparkles,
} from 'lucide-react';
import { Vacancy } from '@/server/careers/types';

interface CurrentOpportunitiesProps {
  initialVacancies: Vacancy[];
}

const DEPARTMENTS = ['ALL', 'Engineering', 'Operations', 'Projects', 'Technology', 'Commercial'];

export function CurrentOpportunities({ initialVacancies }: CurrentOpportunitiesProps) {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVacancies = useMemo(() => {
    return initialVacancies.filter((vac) => {
      if (selectedDept !== 'ALL' && vac.department.toLowerCase() !== selectedDept.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = vac.title.toLowerCase().includes(q);
        const locMatch = vac.location.toLowerCase().includes(q);
        const summaryMatch = vac.summary.toLowerCase().includes(q);
        return titleMatch || locMatch || summaryMatch;
      }
      return true;
    });
  }, [initialVacancies, selectedDept, searchQuery]);

  return (
    <section id="opportunities" className="bg-brand-graphite text-white py-20 lg:py-28 border-b border-brand-edge-dark relative">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
              <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
                CURRENT OPPORTUNITIES // LIVE VACANCIES
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
              Open roles across the UK.
            </h2>

            <p className="text-base sm:text-lg text-brand-mist/80 font-light leading-relaxed">
              Explore current engineering, operational, and digital vacancies. We review applications on a rolling basis.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full lg:w-72 relative">
            <Search className="w-4 h-4 text-brand-mist/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles or locations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-brand-carbon border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/40 focus:outline-none focus:border-brand-electric transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/[0.08]">
          <span className="text-xs font-normal uppercase tracking-wider text-brand-mist/50 mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Department:
          </span>
          {DEPARTMENTS.map((dept) => {
            const isActive = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-light transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-pink text-white font-normal shadow-sm'
                    : 'bg-white/[0.04] text-brand-mist/80 hover:bg-white/[0.08] hover:text-white border border-white/10'
                }`}
              >
                {dept === 'ALL' ? 'All Roles' : dept}
              </button>
            );
          })}
        </div>

        {/* Vacancies List */}
        {filteredVacancies.length === 0 ? (
          /* Empty State */
          <div className="rounded-sm border border-brand-edge-dark bg-brand-carbon/60 p-10 lg:p-14 text-center max-w-2xl mx-auto space-y-5">
            <div className="w-12 h-12 rounded-full bg-brand-electric/10 border border-brand-electric/30 flex items-center justify-center mx-auto text-brand-electric-bright">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-light text-white">No suitable live vacancy today?</h3>
              <p className="text-sm font-light text-brand-mist/70 max-w-md mx-auto">
                We frequently recruit for mobile engineers, helpdesk coordinators, and contract managers. Register your profile in our Talent Network to be notified of matching future openings.
              </p>
            </div>
            <div>
              <a
                href="#talent-network"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#talent-network')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-hero-pink text-xs py-3 px-6 inline-flex items-center gap-2"
              >
                <span>Join Our Talent Network</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="group rounded-sm border border-brand-edge-dark bg-brand-carbon p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 hover:border-brand-electric/50 hover:bg-brand-carbon/90 relative"
              >
                {vacancy.featured && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-brand-pink/10 border border-brand-pink/30 text-[10px] font-normal uppercase tracking-wider text-brand-pink-light">
                    <Sparkles className="w-3 h-3" /> Featured Role
                  </div>
                )}

                <div className="space-y-4">
                  {/* Eyebrow & Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-xs bg-white/10 text-brand-electric-bright">
                      {vacancy.department}
                    </span>
                    <span className="text-[10px] font-light uppercase tracking-wider px-2 py-0.5 rounded-xs bg-white/[0.04] text-brand-mist/70 border border-white/[0.06]">
                      {vacancy.workingArrangement}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white group-hover:text-brand-electric-bright transition-colors">
                    <Link href={`/careers/${vacancy.slug}`}>
                      {vacancy.title}
                    </Link>
                  </h3>

                  {/* Key Meta Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-light text-brand-mist/70 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-mist/50 shrink-0" />
                      <span className="truncate">{vacancy.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-brand-mist/50 shrink-0" />
                      <span>{vacancy.contractType}</span>
                    </div>
                    {vacancy.salaryVisible && vacancy.salaryGuide && (
                      <div className="flex items-center gap-2 sm:col-span-2 text-brand-pink-light/90">
                        <PoundSterling className="w-3.5 h-3.5 text-brand-pink shrink-0" />
                        <span className="truncate">{vacancy.salaryGuide}</span>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-sm font-light text-brand-mist/70 leading-relaxed line-clamp-3">
                    {vacancy.summary}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="text-[11px] font-light text-brand-mist/40 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Closes: {vacancy.closingDate}</span>
                  </div>

                  <Link
                    href={`/careers/${vacancy.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-normal text-brand-electric-bright group-hover:text-white transition-colors"
                  >
                    <span>View Role &amp; Apply</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
