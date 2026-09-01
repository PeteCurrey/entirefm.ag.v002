import React from 'react';

export const dynamic = 'force-dynamic';

export default function SponsorshipPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
          COMMERCIAL SPONSORSHIPS
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Sponsorship Packages &amp; Agreements
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Headline, forum, breakfast, and technical session commercial sponsorships.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm p-12 text-center text-xs text-slate-500 font-light shadow-sm">
        Forum headline sponsorship packages active for October 2026 Meet the Supplier Forum.
      </div>
    </div>
  );
}
