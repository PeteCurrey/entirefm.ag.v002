'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  Briefcase,
  MapPin,
  Building2,
  ShieldCheck,
  Search,
  Filter,
  Bookmark,
  PlusCircle,
  Clock,
  Banknote,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import type { JobListing } from '@/server/jobs/types';

interface Props {
  initialJobs: JobListing[];
  total: number;
}

export function TemplateJobsDirectory({ initialJobs, total: initialTotal }: Props) {
  const [jobs, setJobs] = useState<JobListing[]>(initialJobs);
  const [total, setTotal] = useState(initialTotal);
  const [searchQuery, setSearchQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('all');
  const [locationTypeFilter, setLocationTypeFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const disciplines = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'Hard FM & M&E', label: 'Hard FM & M&E' },
    { id: 'Building Safety & Compliance', label: 'Building Safety & Compliance' },
    { id: 'HVAC & Refrigeration', label: 'HVAC & Refrigeration' },
    { id: 'CAFM & Technology', label: 'CAFM & Technology' },
    { id: 'Contract & Commercial Management', label: 'Contract Management' },
    { id: 'Energy & Sustainability', label: 'Sustainability' },
  ];

  useEffect(() => {
    async function fetchFilteredJobs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (disciplineFilter !== 'all') params.set('discipline', disciplineFilter);
        if (locationTypeFilter !== 'all') params.set('locationType', locationTypeFilter);
        if (verifiedOnly) params.set('verifiedOnly', 'true');

        const res = await fetch(`/api/lobby/jobs?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchFilteredJobs, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, disciplineFilter, locationTypeFilter, verifiedOnly]);

  const handleSaveToggle = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/lobby/jobs/${jobId}/save`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, isSaved: data.saved } : j))
        );
      }
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const formatSalary = (job: JobListing) => {
    if (!job.salaryMin && !job.salaryMax) return 'Competitive salary';
    const sym = job.salaryCurrency === 'GBP' ? '£' : job.salaryCurrency;
    const period =
      job.salaryPeriod === 'per_annum'
        ? '/yr'
        : job.salaryPeriod === 'per_day'
        ? '/day'
        : '/hr';
    if (job.salaryMin && job.salaryMax) {
      return `${sym}${job.salaryMin.toLocaleString()} – ${sym}${job.salaryMax.toLocaleString()}${period}`;
    }
    return `${sym}${(job.salaryMin || job.salaryMax)?.toLocaleString()}${period}`;
  };

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Header Hero */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/40 to-brand-void py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30 mb-3">
                  <Briefcase className="w-3.5 h-3.5" />
                  FM Opportunities
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  Facilities Management Jobs Board
                </h1>
                <p className="mt-2 text-base sm:text-lg text-brand-silver max-w-2xl">
                  Roles across UK commercial estates, M&E maintenance, statutory compliance, and operational leadership.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/lobby/jobs/post"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-electric hover:bg-brand-electric-hover text-white font-medium text-sm transition shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Post a Role
                </Link>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-3 bg-brand-charcoal/80 p-3 rounded-xl border border-white/10 backdrop-blur-md">
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-brand-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by job title, skill, employer, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-void/80 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-brand-slate focus:outline-none focus:border-brand-electric transition"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={disciplineFilter}
                  onChange={(e) => setDisciplineFilter(e.target.value)}
                  className="w-full bg-brand-void/80 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-brand-mist focus:outline-none focus:border-brand-electric transition"
                >
                  {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={locationTypeFilter}
                  onChange={(e) => setLocationTypeFilter(e.target.value)}
                  className="w-full bg-brand-void/80 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-brand-mist focus:outline-none focus:border-brand-electric transition"
                >
                  <option value="all">All Locations</option>
                  <option value="on_site">On-Site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                  <option value="mobile_field">Mobile / Field</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-brand-silver hover:text-white transition px-2 py-1">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded border-white/20 bg-brand-void text-brand-electric focus:ring-brand-electric"
                  />
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Employers</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Listings Section */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs uppercase tracking-wider text-brand-silver">
                Showing <span className="text-white font-semibold">{jobs.length}</span> of {total} listings
              </p>
            </div>

            {loading ? (
              <div className="py-20 text-center text-brand-silver">
                <div className="w-8 h-8 border-2 border-brand-electric border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm">Retrieving active FM roles...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-20 text-center rounded-xl border border-white/5 bg-brand-charcoal/30">
                <Briefcase className="w-10 h-10 text-brand-slate mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white">No listings match your search</h3>
                <p className="text-sm text-brand-silver mt-1 max-w-md mx-auto">
                  Try broadening your search term or clearing discipline and location filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setDisciplineFilter('all');
                    setLocationTypeFilter('all');
                    setVerifiedOnly(false);
                  }}
                  className="mt-4 text-xs text-brand-electric hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/lobby/jobs/${job.slug || job.id}`}
                    className="block group rounded-xl border border-white/10 hover:border-brand-electric/50 bg-brand-charcoal/40 hover:bg-brand-charcoal/80 p-5 transition duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-medium text-white group-hover:text-brand-electric transition">
                            {job.title}
                          </h2>

                          {job.isEntireFMVerifiedEmployer && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verified EntireFM Contractor
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-brand-silver">
                          <span className="flex items-center gap-1 text-white/90">
                            <Building2 className="w-3.5 h-3.5 text-brand-slate" />
                            {job.employerName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-slate" />
                            {job.location} ({job.locationType.replace('_', ' ')})
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <Banknote className="w-3.5 h-3.5" />
                            {formatSalary(job)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-brand-slate" />
                            {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>

                        <p className="text-sm text-brand-silver/90 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {job.disciplineTags.slice(0, 4).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[11px] bg-brand-void/80 text-brand-mist border border-white/5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center lg:flex-col lg:items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5 shrink-0">
                        <button
                          onClick={(e) => handleSaveToggle(job.id, e)}
                          title={job.isSaved ? 'Remove from saved' : 'Save job'}
                          className={`p-2 rounded-lg border transition ${
                            job.isSaved
                              ? 'bg-brand-electric/20 border-brand-electric text-brand-electric'
                              : 'border-white/10 hover:border-white/20 text-brand-silver hover:text-white'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>

                        <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-electric group-hover:translate-x-0.5 transition">
                          View role
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
