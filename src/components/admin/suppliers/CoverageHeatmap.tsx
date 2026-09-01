'use client';

import React from 'react';
import Link from 'next/link';
import { SupplierOrganisationRecord, CoverageTarget } from '@/server/suppliers/types';
import { DEFAULT_COVERAGE_TARGETS } from '@/server/suppliers/gap-engine';

const CITIES = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Sheffield'];
const SERVICES = [
  { slug: 'hvac', name: 'HVAC & Chillers' },
  { slug: 'electrical', name: 'Electrical Systems' },
  { slug: 'drainage', name: 'Commercial Drainage' },
  { slug: 'fire-life-safety', name: 'Fire & Life Safety' },
  { slug: 'rope-access', name: 'Specialist Rope Access' },
];

export function CoverageHeatmap({ suppliers }: { suppliers: SupplierOrganisationRecord[] }) {
  const getCellCount = (serviceSlug: string, city: string) => {
    return suppliers.filter((s) => {
      const isApproved = s.relationship_level === 'APPROVED_SUPPLIER' || s.relationship_level === 'PREFERRED_SUPPLIER' || s.relationship_level === 'STRATEGIC_PARTNER';
      if (!isApproved) return false;
      const hasService = s.services.some((srv) => srv.service_slug === serviceSlug || srv.service_slug.includes(serviceSlug));
      const hasCity = s.is_national || s.headquarters_city.toLowerCase() === city.toLowerCase() || s.coverage.some((c) => c.boundary_value.toLowerCase().includes(city.toLowerCase()));
      return hasService && hasCity;
    }).length;
  };

  const getTarget = (serviceSlug: string, city: string) => {
    const tgt = DEFAULT_COVERAGE_TARGETS.find((t) => t.service_slug === serviceSlug && t.region_or_city.toLowerCase() === city.toLowerCase());
    return tgt?.min_approved_suppliers || 3;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
        <div>
          <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
            Geographic Coverage Matrix (Service &times; City)
          </h3>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Verified approved suppliers compared against minimum required coverage thresholds.
          </p>
        </div>
        <Link href="/admin/suppliers/gaps" className="text-xs text-brand-pink font-light underline">
          View Gap Alerts
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-normal uppercase text-[10.5px]">
              <th className="py-3 px-4 text-left">Service Discipline</th>
              {CITIES.map((c) => (
                <th key={c} className="py-3 px-4">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {SERVICES.map((srv) => (
              <tr key={srv.slug} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 text-left font-light text-slate-900">
                  {srv.name}
                </td>
                {CITIES.map((city) => {
                  const count = getCellCount(srv.slug, city);
                  const target = getTarget(srv.slug, city);
                  const isZero = count === 0;
                  const isSingle = count === 1 && target > 1;
                  const isHealthy = count >= target;

                  return (
                    <td key={city} className="py-3 px-4 font-normal">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-normal ${
                        isZero
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isSingle
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : isHealthy
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {count} <span className="text-[10px] font-normal text-slate-500">/ {target}</span>
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] font-normal text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Healthy Coverage
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Single Dependency
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Zero Approved
          </span>
        </div>
        <span>Thresholds: Configurable in Settings</span>
      </div>
    </div>
  );
}
