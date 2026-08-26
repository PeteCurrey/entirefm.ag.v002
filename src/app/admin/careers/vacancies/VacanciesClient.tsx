'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  PlusCircle,
  Search,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
} from 'lucide-react';
import { Vacancy, VacancyStatus } from '@/server/careers/types';

interface VacanciesClientProps {
  initialVacancies: Vacancy[];
  applicantCounts: Record<string, number>;
}

export function VacanciesClient({ initialVacancies, applicantCounts }: VacanciesClientProps) {
  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacancies);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const router = useRouter();

  const filtered = vacancies.filter((v) => {
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        v.title.toLowerCase().includes(q) ||
        v.reference.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDuplicate = async (id: string) => {
    setIsProcessing(id);
    try {
      const res = await fetch('/api/careers/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate', id }),
      });
      const data = await res.json();
      if (data.vacancy) {
        setVacancies((prev) => [data.vacancy, ...prev]);
        router.refresh();
      }
    } catch (err) {
      console.error('Error duplicating vacancy:', err);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleStatusToggle = async (id: string, newStatus: VacancyStatus) => {
    setIsProcessing(id);
    try {
      const res = await fetch('/api/careers/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data: { status: newStatus } }),
      });
      const data = await res.json();
      if (data.vacancy) {
        setVacancies((prev) => prev.map((v) => (v.id === id ? data.vacancy : v)));
        router.refresh();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {['ALL', 'ACTIVE', 'DRAFT', 'CLOSED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                statusFilter === st
                  ? 'bg-[#111111] text-white font-normal'
                  : 'bg-white text-[#6D6D68] hover:text-[#111111] border border-[#E8E8E5]'
              }`}
            >
              {st === 'ALL' ? 'All Roles' : st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64 relative">
          <Search className="w-3.5 h-3.5 text-[#6D6D68] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vacancies..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>
      </div>

      {/* Vacancies Table */}
      <div className="border border-[#E8E8E5] rounded bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8E8E5] bg-[#F9F9F8] text-[11px] font-medium text-[#6D6D68] uppercase tracking-wider">
              <th className="py-3 px-4">Role &amp; Reference</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-center">Applicants</th>
              <th className="py-3 px-4">Closing Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E8E5] text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#6D6D68]">
                  No vacancies found matching current filters.
                </td>
              </tr>
            ) : (
              filtered.map((v) => {
                const count = applicantCounts[v.id] || 0;
                return (
                  <tr key={v.id} className="hover:bg-[#F9F9F8] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-normal text-[#111111]">{v.title}</div>
                      <div className="text-[11px] font-mono text-[#8C8C85]">{v.reference}</div>
                    </td>
                    <td className="py-3 px-4 text-[#555550]">{v.department}</td>
                    <td className="py-3 px-4 text-[#555550]">{v.location}</td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/admin/careers/applications?vacancyId=${v.id}`}
                        className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#F4F4F2] text-[#111111] hover:bg-[#EAEAE6] text-xs font-normal"
                      >
                        {count} candidates
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[#555550]">{v.closingDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] uppercase font-normal px-2 py-0.5 rounded ${
                          v.status === 'ACTIVE'
                            ? 'bg-[#ECFDF5] text-[#065F46]'
                            : v.status === 'DRAFT'
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : 'bg-[#F3F4F6] text-[#4B5563]'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/admin/careers/vacancies/${v.id}/edit`}
                          className="p-1.5 rounded hover:bg-[#EAEAE6] text-[#111111]"
                          title="Edit Vacancy"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(v.id)}
                          disabled={isProcessing === v.id}
                          className="p-1.5 rounded hover:bg-[#EAEAE6] text-[#6D6D68]"
                          title="Duplicate Vacancy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {v.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleStatusToggle(v.id, 'CLOSED')}
                            disabled={isProcessing === v.id}
                            className="px-2 py-1 text-[10px] rounded border border-[#E8E8E5] text-[#6D6D68] hover:bg-[#F4F4F2]"
                          >
                            Close
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusToggle(v.id, 'ACTIVE')}
                            disabled={isProcessing === v.id}
                            className="px-2 py-1 text-[10px] rounded bg-[#111111] text-white hover:bg-[#222222]"
                          >
                            Publish
                          </button>
                        )}
                        <Link
                          href={`/careers/${v.slug}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-[#EAEAE6] text-[#6D6D68]"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
