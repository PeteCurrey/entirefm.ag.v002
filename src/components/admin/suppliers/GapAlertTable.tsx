'use client';

import React from 'react';
import Link from 'next/link';
import { SupplyChainGapAlert } from '@/server/suppliers/types';
import { AlertCircle, AlertTriangle, ArrowRight, UserPlus } from 'lucide-react';

export function GapAlertTable({ gaps }: { gaps: SupplyChainGapAlert[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
            Supply Chain Vulnerabilities &amp; Deficits
          </h3>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Deterministically generated alerts where actual approved supplier depth falls below operational targets.
          </p>
        </div>
        <span className="text-xs font-light px-2 py-0.5 rounded bg-rose-100 text-rose-800">
          {gaps.length} Active Gaps
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-normal uppercase text-[10.5px]">
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Deficit Type</th>
              <th className="py-2.5 px-3">Service Discipline</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Current / Target</th>
              <th className="py-2.5 px-3">Operational Rationale</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {gaps.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 text-xs font-light">
                  No active supply chain deficits detected. All regional targets are fulfilled.
                </td>
              </tr>
            ) : (
              gaps.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3">
                    <span className={`inline-block text-[10.5px] font-light px-2 py-0.5 rounded ${
                      g.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : g.severity === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'
                    }`}>
                      {g.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-light text-slate-800">
                    {g.gap_type.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-3 font-light text-slate-900">
                    {g.service_name}
                  </td>
                  <td className="py-3 px-3 font-normal text-slate-700">
                    {g.location}
                  </td>
                  <td className="py-3 px-3 font-normal">
                    <span className="font-light text-slate-900">{g.approved_count}</span> / {g.target_approved}
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-sm leading-relaxed">
                    {g.description}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/admin/suppliers/targets?service=${g.service_slug}&location=${g.location}`}
                      className="btn-primary text-[10.5px] py-1 px-2.5 inline-flex items-center gap-1"
                    >
                      <UserPlus className="h-3 w-3" /> Target Partner
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
