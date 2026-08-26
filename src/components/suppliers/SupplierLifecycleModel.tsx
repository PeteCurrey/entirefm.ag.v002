'use client';

import React from 'react';

export const STATUS_TIERS = [
  {
    status: 'APPLICATION',
    badge: 'STAGE 01',
    title: 'Initial Submission',
    desc: 'Company information, trade scope, and coverage areas submitted for qualification.',
  },
  {
    status: 'UNDER REVIEW',
    badge: 'STAGE 02',
    title: 'Compliance Audit',
    desc: 'Insurances, SSIP, trade tickets, and financial standing audited by our compliance desk.',
  },
  {
    status: 'CONDITIONALLY APPROVED',
    badge: 'STAGE 03',
    title: 'Provisional Approval',
    desc: 'Approved for minor non-critical works pending specific site inductions or ticket updates.',
  },
  {
    status: 'APPROVED',
    badge: 'STAGE 04',
    title: 'Active Network Partner',
    desc: 'Fully accredited and eligible for automated work order dispatch across client estates.',
  },
  {
    status: 'PREFERRED',
    badge: 'STAGE 05',
    title: 'Priority Dispatch Tier',
    desc: 'Demonstrated high SLA performance, fast attendance, and flawless reporting quality.',
  },
  {
    status: 'STRATEGIC PARTNER',
    badge: 'STAGE 06',
    title: 'Framework & National Partner',
    desc: 'Long-term joint venture collaboration, estate-wide exclusivity, and executive alignment.',
  },
];

export function SupplierLifecycleModel() {
  return (
    <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-12">
          <span className="eyebrow eyebrow-light">PERFORMANCE GOVERNANCE</span>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
            Supplier Lifecycle &amp; Progression Model
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-light">
            Approved status is actively performance-managed. High performers progress to preferred and strategic framework tiers with increased work volume.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATUS_TIERS.map((tier) => (
            <div
              key={tier.status}
              className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-light uppercase tracking-wider text-brand-pink font-light">
                  {tier.badge}
                </span>
                <span className="text-[10.5px] font-light px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {tier.status}
                </span>
              </div>
              <h3 className="text-sm font-normal text-slate-900">{tier.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
