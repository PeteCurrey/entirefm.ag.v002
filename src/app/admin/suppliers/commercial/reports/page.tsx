import React from 'react';
import { getCommercialDashboardMetrics } from '@/server/partner-network/store';

export const dynamic = 'force-dynamic';

export default async function CommercialReportsPage() {
  const metrics = await getCommercialDashboardMetrics();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
          FINANCIAL INTELLIGENCE
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Partner Network Commercial Reports
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Recurring revenue analytics, collection ratios, event yields, and industry partner contract values.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-3">
          <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">Revenue Stream Breakdown</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Supplier Memberships (ARR)</span>
              <span className="font-light text-slate-900">£{metrics.annualRecurringRevenueGbp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Industry &amp; OEM Packages</span>
              <span className="font-light text-slate-900">£{metrics.industryPartnerRevenueYtdGbp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Event Tickets &amp; Forums</span>
              <span className="font-light text-slate-900">£{metrics.eventRevenueYtdGbp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Event Sponsorships</span>
              <span className="font-light text-slate-900">£{metrics.sponsorshipRevenueYtdGbp.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-3">
          <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">Collection &amp; Receivables Health</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Outstanding Invoices</span>
              <span className="font-light text-slate-900">£{metrics.outstandingInvoicesValueGbp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Overdue Total</span>
              <span className="font-light text-rose-600">£{metrics.overdueInvoicesValueGbp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Active Paying Suppliers</span>
              <span className="font-light text-emerald-600">{metrics.activePayingSuppliers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
