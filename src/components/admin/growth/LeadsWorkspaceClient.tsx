'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ExtendedLead } from '@/server/growth/types';
import { StatusDot } from '@/components/admin/DataTable';
import { Search, ArrowRight } from 'lucide-react';

interface LeadsWorkspaceClientProps {
  initialLeads: ExtendedLead[];
  totalCount: number;
}

export function LeadsWorkspaceClient({ initialLeads, totalCount }: LeadsWorkspaceClientProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  // Compute status counts
  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: 0, NEW: 0, QUALIFIED: 0, PROPOSAL: 0, WON: 0, SPAM: 0 };
    initialLeads.forEach((l) => {
      const s = (l.qualification_status || 'NEW').toUpperCase();
      const isSpam = s === 'SPAM' || l.spam_status === 'SPAM_SUSPECTED' || Boolean(l.is_spam);

      if (isSpam) {
        map.SPAM = (map.SPAM || 0) + 1;
      } else {
        map.ALL += 1;
        if (s === 'NEW') map.NEW = (map.NEW || 0) + 1;
        else if (s === 'QUALIFIED') map.QUALIFIED = (map.QUALIFIED || 0) + 1;
        else if (s === 'PROPOSAL' || s === 'OPPORTUNITY') map.PROPOSAL = (map.PROPOSAL || 0) + 1;
        else if (s === 'WON') map.WON = (map.WON || 0) + 1;
      }
    });
    return map;
  }, [initialLeads]);

  // Unique services
  const services = useMemo(() => {
    const set = new Set<string>();
    initialLeads.forEach((l) => {
      if (l.service) set.add(l.service);
    });
    return Array.from(set);
  }, [initialLeads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return initialLeads.filter((l) => {
      const status = (l.qualification_status || 'NEW').toUpperCase();
      const isSpam = status === 'SPAM' || l.spam_status === 'SPAM_SUSPECTED' || Boolean(l.is_spam);

      // Tab filter
      if (activeTab === 'SPAM') {
        if (!isSpam) return false;
      } else {
        // Standard commercial tabs exclude quarantined spam
        if (isSpam) return false;
        if (activeTab === 'NEW' && status !== 'NEW') return false;
        if (activeTab === 'QUALIFIED' && status !== 'QUALIFIED') return false;
        if (activeTab === 'PROPOSAL' && status !== 'PROPOSAL' && status !== 'OPPORTUNITY') return false;
        if (activeTab === 'WON' && status !== 'WON') return false;
      }

      // Service filter
      if (serviceFilter !== 'ALL' && l.service !== serviceFilter) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = l.name?.toLowerCase().includes(q);
        const matchesCompany = l.company?.toLowerCase().includes(q);
        const matchesEmail = l.email?.toLowerCase().includes(q);
        const matchesLocation = l.location?.toLowerCase().includes(q);
        const matchesService = l.service?.toLowerCase().includes(q);
        const matchesRef = l.enquiry_id?.toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesEmail && !matchesLocation && !matchesService && !matchesRef) {
          return false;
        }
      }

      return true;
    });
  }, [initialLeads, activeTab, serviceFilter, search]);

  const filterTabs = [
    { id: 'ALL', label: 'Commercial Inbound', count: counts.ALL },
    { id: 'NEW', label: 'New', count: counts.NEW },
    { id: 'QUALIFIED', label: 'Qualified', count: counts.QUALIFIED },
    { id: 'PROPOSAL', label: 'Proposal / Opportunity', count: counts.PROPOSAL },
    { id: 'WON', label: 'Won Commercial', count: counts.WON },
    { id: 'SPAM', label: 'Quarantine / Spam', count: counts.SPAM },
  ];

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E5] pb-5">
        <div>
          <div className="text-[10.5px] font-normal uppercase tracking-wider text-[#EA580C]">
            COMMERCIAL PIPELINE &amp; QUALIFICATION
          </div>
          <h1 className="text-2xl font-extralight text-[#111111] tracking-tight mt-0.5">
            Inbound Leads
          </h1>
          <p className="text-[13px] text-[#6D6D68] mt-0.5">
            Track, qualify, and convert inbound commercial estate opportunities with multi-touch attribution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/growth"
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] px-3 py-1.5 text-[12px] font-normal text-[#6D6D68] hover:border-[#D4D4D0] hover:text-[#111111] transition-all"
          >
            ← Growth Overview
          </Link>
        </div>
      </div>

      {/* Filter Tabs Strip & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-normal transition-colors ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#6D6D68] hover:text-[#111111] hover:bg-[#FAFAF8]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-normal px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#E8E8E5] text-[#6D6D68]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Service Filter */}
        <div className="flex items-center gap-2.5">
          {services.length > 0 && (
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] px-2.5 py-1.5 text-[12px] text-[#111111] focus:border-[#EA580C] focus:outline-none"
            >
              <option value="ALL">All Services</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9A9A95]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads, companies…"
              className="w-full rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] pl-9 pr-3 py-1.5 text-[12px] text-[#111111] placeholder-[#9A9A95] focus:border-[#EA580C] focus:outline-none"
            />
          </div>

          <span className="font-normal text-[11.5px] text-[#9A9A95] whitespace-nowrap">
            {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'}
          </span>
        </div>
      </div>

      {/* Enterprise Data Table */}
      {filteredLeads.length === 0 ? (
        <div className="rounded-[8px] border border-dashed border-[#E8E8E5] bg-[#FFFFFF] p-12 text-center">
          <div className="font-normal text-[11px] text-[#9A9A95] uppercase">No matching inbound records</div>
          <p className="text-[12.5px] text-[#6D6D68] mt-1 max-w-sm mx-auto">
            Submissions via geographic, service, and interactive tool pages will populate here with multi-touch attribution.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] shadow-xs">
          <table className="w-full min-w-[55rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] bg-[#FAFAF8] text-[11px] font-normal text-[#6D6D68] uppercase tracking-wider">
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4">Contact / Company</th>
                <th className="py-3 px-4">Requirement</th>
                <th className="py-3 px-4">First Touch &amp; Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {filteredLeads.map((l) => {
                const status = (l.qualification_status || 'NEW').toUpperCase();
                const statusType: 'new' | 'active' | 'warning' | 'neutral' | 'completed' =
                  status === 'QUALIFIED' || status === 'WON'
                    ? 'active'
                    : status === 'OPPORTUNITY' || status === 'PROPOSAL'
                    ? 'warning'
                    : status === 'NEW'
                    ? 'new'
                    : 'neutral';

                return (
                  <tr
                    key={l.id || l.enquiry_id}
                    className="hover:bg-[#FAFAF8] transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-normal text-[11.5px] text-[#6D6D68] whitespace-nowrap">
                      {new Date(l.received_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-light text-[13.5px] text-[#111111] group-hover:text-[#EA580C] transition-colors">
                        {l.name}
                      </div>
                      <div className="text-[11.5px] text-[#6D6D68]">
                        {l.company ? `${l.company} · ` : ''}{l.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#111111] font-normal">
                        {l.service || 'Planned PPM & Facilities Management'}
                      </div>
                      <div className="text-[11.5px] text-[#6D6D68]">
                        {l.location || 'United Kingdom'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-normal text-[11px] text-[#6D6D68] truncate max-w-xs">
                        {l.first_touch_url || l.landing_page || '/'}
                      </div>
                      <div className="text-[10.5px] text-[#9A9A95] font-normal mt-0.5">
                        {l.marketing_channel || 'ORGANIC_SEARCH'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <StatusDot
                          status={statusType}
                          label={
                            <span className="font-medium text-[11px] uppercase tracking-wider text-[#111111]">
                              {status}
                            </span>
                          }
                        />
                        {typeof l.spam_score === 'number' && l.spam_score > 0 && (
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              l.spam_score >= 65
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Risk: {l.spam_score}/100
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/growth/leads/${l.id}`}
                        className="inline-flex items-center gap-1 text-[12px] font-normal text-[#EA580C] hover:text-[#C2410C] hover:underline"
                      >
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
