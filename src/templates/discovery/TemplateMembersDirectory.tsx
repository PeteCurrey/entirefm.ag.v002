'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  Users,
  Search,
  MessageSquare,
  ShieldCheck,
  Building2,
  Award,
  Filter,
  CheckCircle2,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { MemberAvatar } from '@/components/member/MemberAvatar';
import type { DirectoryMemberEntry } from '@/server/member/types';

const CERTIFICATION_OPTIONS = [
  { value: '', label: 'All Certifications' },
  { value: 'compliance-lead', label: 'Compliance Lead' },
  { value: 'ppm-specialist', label: 'PPM Specialist' },
  { value: 'mobilisation-lead', label: 'Mobilisation Lead' },
];

const SECTOR_OPTIONS = [
  { value: '', label: 'All Sectors' },
  { value: 'Commercial Offices', label: 'Commercial Offices' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Industrial & Logistics', label: 'Industrial & Logistics' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Education', label: 'Education' },
];

const REGION_OPTIONS = [
  { value: '', label: 'All Regions' },
  { value: 'London', label: 'London & South East' },
  { value: 'Midlands', label: 'Midlands' },
  { value: 'North West', label: 'North West' },
  { value: 'Yorkshire', label: 'Yorkshire' },
  { value: 'Scotland', label: 'Scotland' },
];

export function TemplateMembersDirectory() {
  const [members, setMembers] = useState<DirectoryMemberEntry[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCertification, setSelectedCertification] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDirectory() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (selectedCertification) params.set('certification', selectedCertification);
        if (selectedSector) params.set('sector', selectedSector);
        if (selectedLocation) params.set('location', selectedLocation);

        const res = await fetch(`/api/academy/directory?${params.toString()}`);
        const data = await res.json();
        setMembers(data.members || []);
      } catch (err) {
        console.error('Error loading member directory:', err);
      } finally {
        setLoading(false);
      }
    }
    const timeout = setTimeout(loadDirectory, 150);
    return () => clearTimeout(timeout);
  }, [search, selectedCertification, selectedSector, selectedLocation]);

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30 mb-3">
              <Users className="w-3.5 h-3.5" />
              Verified Community Network
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              FM Practitioner Directory
            </h1>
            <p className="mt-2 text-base sm:text-lg text-brand-silver max-w-2xl">
              Connect directly with verified UK facilities managers, hard FM engineers, compliance directors, and specialist contractors holding certified accreditations.
            </p>

            {/* Filter Bar */}
            <div className="mt-8 space-y-4 max-w-4xl">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-silver" />
                <input
                  type="text"
                  placeholder="Search by name, company, job title or engineering discipline..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-graphite/60 border border-white/10 rounded-xl text-sm text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Certification Filter */}
                <div className="relative">
                  <select
                    value={selectedCertification}
                    onChange={(e) => setSelectedCertification(e.target.value)}
                    className="w-full px-3.5 py-2 bg-brand-graphite/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-electric appearance-none cursor-pointer"
                  >
                    {CERTIFICATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-brand-void text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sector Filter */}
                <div className="relative">
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-3.5 py-2 bg-brand-graphite/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-electric appearance-none cursor-pointer"
                  >
                    {SECTOR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-brand-void text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Region Filter */}
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3.5 py-2 bg-brand-graphite/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-electric appearance-none cursor-pointer"
                  >
                    {REGION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-brand-void text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Directory Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-8">
            <span className="text-xs text-brand-silver font-medium">
              Showing <strong className="text-white font-semibold">{members.length}</strong> verified practitioners (Opted-in)
            </span>
            {(selectedCertification || selectedSector || selectedLocation || search) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCertification('');
                  setSelectedSector('');
                  setSelectedLocation('');
                }}
                className="text-xs text-brand-electric hover:underline font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-brand-silver text-sm">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-brand-electric border-t-transparent rounded-full mb-3" />
              <p>Searching practitioner directory...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-20 bg-brand-graphite/10 border border-white/5 rounded-2xl max-w-lg mx-auto p-8 space-y-3">
              <ShieldCheck className="w-10 h-10 text-brand-silver/40 mx-auto" />
              <h3 className="text-base font-semibold text-white">No verified practitioners found</h3>
              <p className="text-xs text-brand-silver leading-relaxed">
                No opted-in members match your search criteria. Members must explicitly opt-in via their account settings to appear in directory results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((mem) => (
                <div
                  key={mem.id}
                  className="bg-brand-graphite/20 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-brand-electric/40 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <MemberAvatar
                        name={mem.displayName}
                        avatarUrl={mem.avatarUrl}
                        size="lg"
                        theme="dark"
                      />
                      {mem.location && (
                        <span className="flex items-center gap-1 text-[11px] text-brand-silver/80">
                          <MapPin className="w-3 h-3 text-brand-silver/60" />
                          {mem.location}
                        </span>
                      )}
                    </div>

                    <div>
                      <Link
                        href={`/lobby/members/${mem.username}`}
                        className="text-base font-bold text-white group-hover:text-brand-electric transition-colors block"
                      >
                        {mem.displayName}
                      </Link>
                      {mem.headline && (
                        <p className="text-xs text-brand-silver line-clamp-2 mt-0.5">{mem.headline}</p>
                      )}
                      {(mem.company || mem.jobTitle) && (
                        <p className="text-[11px] text-brand-mist font-medium mt-1">
                          {[mem.jobTitle, mem.company].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>

                    {/* Verified Academy Certifications */}
                    {mem.certifications && mem.certifications.length > 0 && (
                      <div className="pt-1 space-y-1.5">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-400/90 block">
                          Verified Accreditations
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {mem.certifications.map((c) => (
                            <Link
                              key={c.publicCertId}
                              href={`/academy/verify/${c.publicCertId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/10 text-[10px] font-medium text-amber-300 border border-amber-400/20 hover:bg-amber-400/20 transition-colors"
                              title={`Verified ${c.targetRole} - Click to verify credential`}
                            >
                              <CheckCircle2 className="w-3 h-3 text-amber-400" />
                              <span>{c.targetRole}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sector / Discipline Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {mem.sectors?.slice(0, 2).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-brand-mist border border-white/5">
                          {s}
                        </span>
                      ))}
                      {mem.disciplines?.slice(0, 2).map((d) => (
                        <span key={d} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-brand-silver">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Signals */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {mem.acceptedSolutionsCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          {mem.acceptedSolutionsCount} Solved
                        </span>
                      ) : (
                        <span className="text-brand-silver flex items-center gap-1 text-[11px]">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          {mem.reputationScore} Rep
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/lobby/members/${mem.username}`}
                        className="text-xs text-brand-mist hover:text-white font-medium"
                      >
                        Profile
                      </Link>
                      <Link
                        href={`/lobby/messages?to=${mem.id}`}
                        className="px-3 py-1 rounded-lg bg-brand-electric/15 hover:bg-brand-electric text-brand-electric hover:text-white font-semibold transition-colors flex items-center gap-1 text-xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Message
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

