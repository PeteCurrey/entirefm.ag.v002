'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Briefcase,
  Mic,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export interface EngineerJobItem {
  id: string;
  linkHref: string;
  reference: string;
  title: string;
  status: string;
  priority?: string;
  siteName: string;
  location: string;
  date: string | null;
  time: string | null;
  siteId?: string;
  workOrderId?: string;
}

interface Props {
  initialItems: EngineerJobItem[];
}

export function EngineerJobsClient({ initialItems }: Props) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'SCHEDULED' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // Filter by tab
      if (activeFilter === 'ACTIVE') {
        const isActive =
          item.status === 'IN_PROGRESS' ||
          item.status === 'TRAVELLING' ||
          item.status === 'ARRIVED' ||
          item.status === 'IN_FLIGHT';
        if (!isActive) return false;
      } else if (activeFilter === 'SCHEDULED') {
        const isScheduled =
          item.status === 'SCHEDULED' ||
          item.status === 'ASSIGNED' ||
          item.status === 'ACKNOWLEDGED' ||
          item.status === 'OPEN';
        if (!isScheduled) return false;
      } else if (activeFilter === 'COMPLETED') {
        const isCompleted =
          item.status === 'COMPLETED' ||
          item.status === 'SUBMITTED' ||
          item.status === 'VALIDATED' ||
          item.status === 'CLOSED';
        if (!isCompleted) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = item.reference.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSite = item.siteName.toLowerCase().includes(q);
        const matchesLocation = item.location.toLowerCase().includes(q);
        return matchesRef || matchesTitle || matchesSite || matchesLocation;
      }

      return true;
    });
  }, [initialItems, activeFilter, searchQuery]);

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-12">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-brand-mist/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs by site, reference or title..."
          className="w-full bg-brand-carbon border border-brand-edge-dark text-white rounded-xl pl-10 pr-4 py-3 text-xs placeholder-brand-mist/40 focus:outline-none focus:border-brand-electric transition-colors"
          style={{ minHeight: '48px' }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-brand-carbon border border-brand-edge-dark rounded-xl p-1 gap-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`flex-1 py-2 rounded-lg font-medium transition-all text-center ${
            activeFilter === 'ALL'
              ? 'bg-brand-electric text-white font-bold shadow-sm'
              : 'text-brand-mist/70 hover:text-white'
          }`}
        >
          All ({initialItems.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('ACTIVE')}
          className={`flex-1 py-2 rounded-lg font-medium transition-all text-center ${
            activeFilter === 'ACTIVE'
              ? 'bg-brand-electric text-white font-bold shadow-sm'
              : 'text-brand-mist/70 hover:text-white'
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('SCHEDULED')}
          className={`flex-1 py-2 rounded-lg font-medium transition-all text-center ${
            activeFilter === 'SCHEDULED'
              ? 'bg-brand-electric text-white font-bold shadow-sm'
              : 'text-brand-mist/70 hover:text-white'
          }`}
        >
          Scheduled
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('COMPLETED')}
          className={`flex-1 py-2 rounded-lg font-medium transition-all text-center ${
            activeFilter === 'COMPLETED'
              ? 'bg-brand-electric text-white font-bold shadow-sm'
              : 'text-brand-mist/70 hover:text-white'
          }`}
        >
          Done
        </button>
      </div>

      {/* Job Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-8 text-center space-y-2">
          <Briefcase className="w-8 h-8 text-brand-mist/40 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Matching Jobs</h3>
          <p className="text-xs text-brand-mist/60 leading-relaxed max-w-xs mx-auto">
            {searchQuery ? 'No jobs match your current search criteria.' : 'No jobs found in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-brand-carbon border border-brand-edge-dark hover:border-brand-electric/50 rounded-2xl p-4 space-y-3 transition-all shadow-md group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-brand-electric-bright font-bold">
                      {item.reference}
                    </span>
                    <span className="text-brand-mist/40 text-xs">&bull;</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.status === 'IN_PROGRESS' || item.status === 'TRAVELLING' || item.status === 'ARRIVED'
                          ? 'bg-brand-electric/20 text-brand-electric-bright border-brand-electric/40'
                          : item.status === 'COMPLETED' || item.status === 'SUBMITTED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-brand-void text-brand-mist border-brand-edge-dark'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-electric-bright transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs text-brand-mist/80 flex items-center gap-1.5 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-electric-bright shrink-0" />
                    <span>{item.siteName}</span>
                    {item.location && <span className="text-brand-mist/50">({item.location})</span>}
                  </div>
                </div>

                {item.priority && (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase shrink-0 border ${
                      item.priority === 'P1_CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : item.priority === 'P2_HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-brand-void text-brand-mist border-brand-edge-dark'
                    }`}
                  >
                    {item.priority}
                  </span>
                )}
              </div>

              {/* Schedule and Action Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-brand-edge-dark text-xs">
                <div className="flex items-center gap-3 text-brand-mist/60 text-[11px]">
                  {item.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-mist/50" />
                      {item.date}
                    </span>
                  )}
                  {item.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-mist/50" />
                      {item.time}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/engineer/talk?workOrderId=${encodeURIComponent(
                      item.workOrderId || item.id
                    )}&workOrderNumber=${encodeURIComponent(item.reference)}&siteName=${encodeURIComponent(
                      item.siteName
                    )}`}
                    className="bg-brand-void hover:bg-brand-electric/15 border border-brand-edge-dark hover:border-brand-electric/30 text-brand-mist hover:text-brand-electric-bright px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    title="Talk to Quote for this job"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Quote</span>
                  </Link>

                  <Link
                    href={item.linkHref}
                    className="bg-brand-electric hover:bg-brand-indigo text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <span>Open</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
