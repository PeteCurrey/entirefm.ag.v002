'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Search,
  Plus,
  Building2,
  MapPin,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { Portfolio } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/admin/ui/Button';

interface Props {
  initialPortfolios: Portfolio[];
}

export function PortfoliosPageClient({ initialPortfolios }: Props) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPortfolios = useMemo(() => {
    return portfolios.filter(
      (p) =>
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [portfolios, searchQuery]);

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="Estate Hierarchy"
        title="Managed Portfolios"
        description="Regional and divisional property groupings across client corporate accounts."
        action={
          <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
            New Portfolio
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-3 bg-[#FFFFFF] p-3 rounded-[10px] border border-[#E4E4E1]">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9B9B97]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search portfolios by name or code..."
            className="w-full rounded-[6px] border border-[#E4E4E1] bg-[#FAFAF8] pl-9 pr-3 py-1.5 text-[12.5px] text-[#101010] placeholder-[#9B9B97] focus:border-[#EA580C] focus:bg-[#FFFFFF] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortfolios.map((p) => (
          <div
            key={p.id}
            className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 space-y-3 shadow-xs hover:border-[#EA580C] transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] bg-[#FAFAF8] px-2 py-0.5 rounded border border-[#E4E4E1] uppercase tracking-wider text-[#686866] font-bold">
                  {p.code}
                </span>
                <h3 className="text-base font-light text-[#101010] mt-2">{p.name}</h3>
              </div>
              <FolderTree className="h-4 w-4 text-[#9B9B97]" />
            </div>

            <p className="text-xs text-[#686866] line-clamp-2">
              {p.description || 'Regional facilities cluster grouping.'}
            </p>

            <div className="pt-3 border-t border-[#E4E4E1] flex items-center justify-between">
              <span className="font-normal text-[11px] text-[#9B9B97]">
                Created {new Date(p.created_at).toLocaleDateString('en-GB')}
              </span>
              <Link
                href={`/admin/estate/sites?portfolioId=${p.id}`}
                className="text-[11.5px] font-medium text-[#EA580C] inline-flex items-center gap-1 hover:underline"
              >
                <span>View Sites</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
