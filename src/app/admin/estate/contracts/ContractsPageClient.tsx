'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Plus,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { Contract } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';

interface Props {
  initialContracts: Contract[];
}

export function ContractsPageClient({ initialContracts }: Props) {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contract_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.client_account?.name &&
          c.client_account.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'ALL' || c.contract_type === selectedType;
      const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [contracts, searchQuery, selectedType, selectedStatus]);

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="Estate Hierarchy"
        title="Contracts & Commercial SLAs"
        description="Active commercial terms, service level agreements, planned maintenance scopes, and rate card assignments."
        action={
          <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
            New Contract
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-3 rounded-[10px] border border-[#E4E4E1]">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9B9B97]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contracts by title, reference, or client..."
            className="w-full rounded-[6px] border border-[#E4E4E1] bg-[#FAFAF8] pl-9 pr-3 py-1.5 text-[12.5px] text-[#101010] placeholder-[#9B9B97] focus:border-[#EA580C] focus:bg-[#FFFFFF] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FAFAF8] p-1 rounded-[6px] border border-[#E4E4E1] text-[11.5px]">
            <span className="text-[#9B9B97] px-1 text-[11px] uppercase font-medium">Scope:</span>
            {['ALL', 'TOTAL_FM', 'HARD_FM', 'PPM_ONLY'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2 py-0.5 rounded-[4px] font-medium transition-all ${
                  selectedType === type
                    ? 'bg-[#FFFFFF] text-[#101010] shadow-xs border border-[#E4E4E1]'
                    : 'text-[#686866] hover:text-[#101010]'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredContracts.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#E4E4E1] bg-[#FFFFFF] p-12 text-center space-y-3">
          <FileText className="h-10 w-10 text-[#9B9B97] mx-auto" />
          <h3 className="text-base font-light text-[#101010]">No contracts found</h3>
          <p className="text-xs text-[#686866] max-w-sm mx-auto">
            No contracts match your search parameters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-xs">
          <table className="w-full min-w-[55rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E4E4E1] bg-[#FAFAF8] text-[11px] font-normal uppercase tracking-wider text-[#686866]">
                <th className="px-4 py-3">Contract Reference / Scope</th>
                <th className="px-4 py-3">Client Account</th>
                <th className="px-4 py-3">Term Dates</th>
                <th className="px-4 py-3">Annual Value</th>
                <th className="px-4 py-3">Billing Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E1]">
              {filteredContracts.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedContract(c)}
                  className="group hover:bg-[#FAFAF8] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-[#101010] group-hover:text-[#EA580C] transition-colors">
                      {c.name}
                    </div>
                    <div className="font-normal text-[11px] text-[#686866]">
                      Ref: {c.contract_reference} &bull; Type: <strong>{c.contract_type}</strong>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-[#101010]">
                      {c.client_account?.name || '—'}
                    </div>
                    <div className="font-normal text-[11px] text-[#686866]">
                      {c.client_account?.account_number}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-normal text-[11.5px] text-[#101010]">
                    {c.start_date} &rarr; {c.end_date}
                  </td>
                  <td className="px-4 py-3.5 text-[12px] font-medium text-[#101010]">
                    {c.annual_value_gbp ? `£${c.annual_value_gbp.toLocaleString()}/yr` : '—'}
                  </td>
                  <td className="px-4 py-3.5 font-normal text-[11px] text-[#686866]">
                    {c.billing_method.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10.5px] px-2 py-0.5 rounded font-medium inline-flex items-center gap-1 ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          c.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-amber-600'
                        }`}
                      />
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedContract(c);
                      }}
                      className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#EA580C] hover:underline"
                    >
                      <span>View</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
