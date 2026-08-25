'use client';

import React from 'react';
import { DollarSign, CreditCard, Calendar, Clock, AlertTriangle, Users } from 'lucide-react';
import { CommercialDashboardMetrics } from '@/server/partner-network/types';

export function CommercialMetricCards({ metrics }: { metrics: CommercialDashboardMetrics }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Annual Recurring Rev
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-mono font-bold text-slate-900">
            £{metrics.annualRecurringRevenueGbp.toLocaleString()}
          </span>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{metrics.activePayingSuppliers} Paying Members</span>
      </div>

      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Outstanding Invoices
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-mono font-bold text-slate-900">
            £{metrics.outstandingInvoicesValueGbp.toLocaleString()}
          </span>
          <CreditCard className="h-4 w-4 text-slate-500" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{metrics.outstandingInvoicesCount} Pending BACS/Stripe</span>
      </div>

      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Overdue Value
        </span>
        <div className="flex items-baseline justify-between">
          <span className={`text-xl font-mono font-bold ${metrics.overdueInvoicesValueGbp > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            £{metrics.overdueInvoicesValueGbp.toLocaleString()}
          </span>
          <AlertTriangle className="h-4 w-4 text-rose-500" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{metrics.overdueInvoicesCount} Overdue Invoices</span>
      </div>

      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Renewals Next 30 Days
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-mono font-bold text-slate-900">{metrics.membershipsDueRenewalCount}</span>
          <Calendar className="h-4 w-4 text-amber-500" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Upcoming Reminders</span>
      </div>

      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Event &amp; Sponsor YTD
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-mono font-bold text-slate-900">
            £{(metrics.eventRevenueYtdGbp + metrics.sponsorshipRevenueYtdGbp).toLocaleString()}
          </span>
          <Users className="h-4 w-4 text-brand-pink" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Forum &amp; Breakfasts</span>
      </div>

      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Industry Partners
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-mono font-bold text-slate-900">
            £{metrics.industryPartnerRevenueYtdGbp.toLocaleString()}
          </span>
          <Clock className="h-4 w-4 text-slate-400" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">OEM &amp; Tech Packages</span>
      </div>
    </div>
  );
}
