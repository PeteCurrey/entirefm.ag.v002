import React from 'react';
import { listPerformanceReviews } from '@/server/suppliers/performance-store';
import { Award, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PerformanceReviewsPage() {
  const reviews = await listPerformanceReviews();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
          STRATEGIC PARTNER REVIEWS
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Quarterly Business Reviews (QBRs) &amp; Audits
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Formal executive supplier reviews, tier elevation recommendations, and strategic growth agendas.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-slate-500 text-xs font-sans">
            No formal QBR records on file.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 font-normal text-xs">
            {reviews.map((r) => (
              <div key={r.id} className="py-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-light text-slate-900 font-sans text-sm">{r.review_period} Review (Supplier: {r.supplier_id})</span>
                  <span className="text-emerald-800 bg-emerald-100 font-light px-2 py-0.5 rounded text-[10px]">
                    {r.relationship_tier_recommendation}
                  </span>
                </div>
                <div className="text-slate-500">Conducted by: {r.reviewer_name} ({r.reviewer_role})</div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 font-sans">
                  <div><strong>Strengths: </strong>{r.strengths.join(', ')}</div>
                  <div><strong>Decisions: </strong>{r.decisions.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
