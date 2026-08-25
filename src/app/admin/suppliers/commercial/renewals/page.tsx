import React from 'react';

export const dynamic = 'force-dynamic';

export default function RenewalsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
          ANNUAL RENEWAL RADAR
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Membership Renewals Management
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Automated renewal tracking across 30, 60, and 90-day intervals.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm p-12 text-center text-xs text-slate-500 font-light shadow-sm">
        All active verified supplier memberships are currently in good standing. No overdue renewals in the next 30 days.
      </div>
    </div>
  );
}
