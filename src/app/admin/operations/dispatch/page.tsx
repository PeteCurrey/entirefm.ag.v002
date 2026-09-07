import React from 'react';
import { listWorkOrders } from '@/server/work';
import { listProviders } from '@/server/supply-chain';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SLAPill } from '@/components/admin/SLAPill';

export const dynamic = 'force-dynamic';

export default async function DispatchPage() {
  const [unassignedJobs, providers] = await Promise.all([
    listWorkOrders({ status: 'ISSUED' }),
    listProviders(),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Operations"
        title="Dispatch & Resource Matching"
        description="Match unassigned work orders to certified supply-chain contractors based on trade, coverage, vetting, and performance ranking."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Unassigned Work Queue */}
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
            <h2 className="text-[12px] font-normal uppercase tracking-wider text-[#111111]">
              Unassigned Work Orders ({unassignedJobs.length})
            </h2>
            <span className="font-normal text-[11px] text-[#9A9A95]">Human-Operated Dispatch</span>
          </div>

          <div className="mt-4 space-y-3">
            {unassignedJobs.length > 0 ? (
              unassignedJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-lg border border-[#E8E8E5] bg-[#FAFAF8] p-4 transition hover:border-brand-electric/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-normal text-[11px] text-[#9A9A95]">
                          {job.work_order_number}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.2 font-normal text-[9px] ${
                            job.priority === 'P1_CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-[#F5F5F3] text-[#6D6D68]'
                          }`}
                        >
                          {job.priority}
                        </span>
                      </div>
                      <h3 className="mt-1 font-light text-[#111111]">{job.title}</h3>
                      <p className="text-[12px] text-[#6D6D68]">
                        {job.site?.name} · {job.site?.postcode}
                      </p>
                    </div>

                    <SLAPill resolutionDueAt={job.sla_resolution_due_at} />
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#E8E8E5] pt-3">
                    <span className="font-normal text-[11px] text-[#9A9A95]">
                      Type: {job.work_type}
                    </span>
                    <button className="rounded bg-brand-electric px-3 py-1 text-[11.5px] font-normal text-white hover:bg-brand-indigo">
                      Match & Dispatch Contractor
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded border border-dashed border-[#E8E8E5] p-8 text-center text-[12.5px] text-[#9A9A95]">
                All issued work orders are currently dispatched.
              </div>
            )}
          </div>
        </div>

        {/* Candidate Contractors / Provider Directory */}
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-5">
          <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
            <h2 className="text-[12px] font-normal uppercase tracking-wider text-[#111111]">
              Supply Chain Network ({providers.length})
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            {providers.length > 0 ? (
              providers.map((p) => (
                <div key={p.id} className="rounded border border-[#E8E8E5] bg-[#FAFAF8] p-3 text-[12.5px]">
                  <div className="flex items-center justify-between">
                    <span className="font-light text-[#111111]">{p.organisation?.name}</span>
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 font-normal text-[9px] text-emerald-400">
                      {p.vetting_status}
                    </span>
                  </div>
                  <div className="mt-1 text-[11.5px] text-[#9A9A95]">
                    Trade: {p.primary_trade || 'General FM'} · Score: {p.performance_score}/100
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded border border-dashed border-[#E8E8E5] p-6 text-center text-[12px] text-[#9A9A95]">
                No contractors currently vetted in database.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
