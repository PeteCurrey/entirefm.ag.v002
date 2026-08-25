'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SupplierOrganisationRecord } from '@/server/suppliers/types';
import { ShieldCheck, Award, AlertCircle, ArrowUpRight, Search } from 'lucide-react';

const CITIES = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Sheffield'];
const CORE_SERVICES = [
  { slug: 'hvac', name: 'HVAC & Chillers' },
  { slug: 'electrical', name: 'Electrical Systems' },
  { slug: 'drainage', name: 'Commercial Drainage' },
  { slug: 'fire-life-safety', name: 'Fire & Life Safety' },
  { slug: 'rope-access', name: 'Specialist Rope Access' },
  { slug: 'cleaning', name: 'Commercial Cleaning' },
  { slug: 'bms', name: 'BMS & Smart Controls' },
];

export function LandscapeMatrixView({ suppliers }: { suppliers: SupplierOrganisationRecord[] }) {
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = suppliers.filter((s) => {
    if (selectedService !== 'all' && !s.services.some((srv) => srv.service_slug === selectedService)) return false;
    if (selectedCity !== 'all' && !s.is_national && s.headquarters_city !== selectedCity && !s.coverage.some((c) => c.boundary_value === selectedCity)) return false;
    if (search && !s.legal_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-slate-400"
            />
          </div>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none"
          >
            <option value="all">All Disciplines</option>
            {CORE_SERVICES.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none"
          >
            <option value="all">All Geographies</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filtered.length} suppliers
        </span>
      </div>

      {/* Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono uppercase text-[10.5px]">
                <th className="py-3 px-4">Organisation</th>
                <th className="py-3 px-4">Supplier Type</th>
                <th className="py-3 px-4">Relationship Tier</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">Headquarters</th>
                <th className="py-3 px-4">Services</th>
                <th className="py-3 px-4 text-center">24/7</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs font-light">
                    No supplier records match the selected filters.
                    <div className="mt-2">
                      <Link href="/admin/suppliers/targets" className="text-brand-pink font-semibold underline">
                        View Target Partners Queue
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{s.legal_name}</div>
                      {s.trading_name && (
                        <span className="text-[10.5px] text-slate-400 font-mono">t/a {s.trading_name}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {s.supplier_types.join(', ').replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block text-[10.5px] font-mono px-2 py-0.5 rounded bg-slate-900 text-white font-medium">
                        {s.relationship_level.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[10.5px] font-mono px-2 py-0.5 rounded ${
                        s.compliance_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.compliance_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {s.headquarters_city} {s.is_national && <span className="text-brand-pink font-bold">(UK National)</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {s.services.map((srv, idx) => (
                          <span key={idx} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {srv.service_name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {s.emergency_24_7 ? (
                        <span className="text-emerald-600">YES</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/suppliers/${s.id}`}
                        className="text-[11px] font-mono text-slate-700 hover:text-brand-pink underline inline-flex items-center gap-1"
                      >
                        Profile <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
