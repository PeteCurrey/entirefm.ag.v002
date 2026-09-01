import React from 'react';
import { getCommercialDashboardMetrics } from '@/server/partner-network/store';

export const dynamic = 'force-dynamic';

export default async function PaymentsLedgerPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
          SETTLEMENTS &amp; RECONCILIATION
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Payments &amp; Settlement Ledger
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Track incoming Stripe card payments, manual BACS settlements, credit allocations, and refunds.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm p-12 text-center text-xs text-slate-500 font-light shadow-sm">
        Payment ledger active. Settle incoming corporate BACS receipts or process Stripe webhook settlements.
      </div>
    </div>
  );
}
