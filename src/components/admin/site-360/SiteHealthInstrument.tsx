'use client';

import React from 'react';
import { Asset } from '@/server/estate';
import { WorkOrder } from '@/server/work';
import { ComplianceObligation } from '@/server/compliance';
import { ShieldCheck, Activity, Clock, Wrench } from 'lucide-react';

interface SiteHealthInstrumentProps {
  assets?: Asset[];
  workOrders?: WorkOrder[];
  complianceObligations?: ComplianceObligation[];
}

export function SiteHealthInstrument({
  assets = [],
  workOrders = [],
  complianceObligations = [],
}: SiteHealthInstrumentProps) {
  // Compute compliance assurance
  const validCompliance = complianceObligations.filter((c) => c.status === 'COMPLIANT').length;
  const complianceScore =
    complianceObligations.length > 0
      ? Math.round((validCompliance / complianceObligations.length) * 100)
      : 100;

  // Compute asset reliability
  const inServiceAssets = assets.filter((a) => a.status === 'IN_SERVICE').length;
  const assetScore =
    assets.length > 0 ? Math.round((inServiceAssets / assets.length) * 100) : 100;

  // Compute work order completion rate
  const completedJobs = workOrders.filter(
    (w) => w.status === 'COMPLETED' || w.status === 'CLOSED'
  ).length;
  const workScore =
    workOrders.length > 0 ? Math.round((completedJobs / workOrders.length) * 100) : 100;

  const dimensions = [
    {
      label: 'Compliance Assurance',
      value: complianceScore,
      count: `${validCompliance}/${complianceObligations.length || 0}`,
      status: complianceScore >= 95 ? 'NOMINAL' : 'ATTENTION',
      color: complianceScore >= 95 ? 'bg-[#15803D]' : 'bg-[#B45309]',
    },
    {
      label: 'Asset Operational State',
      value: assetScore,
      count: `${inServiceAssets}/${assets.length || 0}`,
      status: assetScore >= 90 ? 'NOMINAL' : 'ATTENTION',
      color: assetScore >= 90 ? 'bg-[#15803D]' : 'bg-[#FF6B24]',
    },
    {
      label: 'Work Order Resolution',
      value: workScore,
      count: `${completedJobs}/${workOrders.length || 0}`,
      status: workScore >= 80 ? 'NOMINAL' : 'ATTENTION',
      color: workScore >= 80 ? 'bg-[#15803D]' : 'bg-[#FF6B24]',
    },
  ];

  const aggregateScore = Math.round(
    (complianceScore + assetScore + workScore) / 3
  );

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-3">
        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
            SITE HEALTH TELEMETRY MATRIX
          </h3>
          <p className="text-[11.5px] text-[#686866]">
            Calculated directly from live site obligations, assets, and service records
          </p>
        </div>
        <span
          className={`font-mono text-[10px] px-2 py-0.5 rounded-[4px] font-semibold border ${
            aggregateScore >= 90
              ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
              : 'bg-[#FFF7ED] border-[#FED7AA] text-[#C2410C]'
          }`}
        >
          {aggregateScore}% AGGREGATE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
        {dimensions.map((dim) => (
          <div
            key={dim.label}
            className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 space-y-2"
          >
            <div className="flex items-center justify-between text-[10px] text-[#686866] uppercase">
              <span className="truncate pr-1">{dim.label}</span>
              <span className="font-semibold text-[#101010]">{dim.value}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#E4E4E1] overflow-hidden">
              <div
                style={{ width: `${dim.value}%` }}
                className={`h-full ${dim.color} rounded-full`}
              />
            </div>
            <div className="text-[10px] text-[#9B9B97] text-right">
              {dim.count} tracked units
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
