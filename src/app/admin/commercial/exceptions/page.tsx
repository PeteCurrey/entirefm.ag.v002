import React from 'react';
import Link from 'next/link';
import { dbQuery } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function CommercialExceptionsPage() {
  const { data: exceptions } = await dbQuery<any[]>(
    'commercial_exceptions?select=*&order=created_at.desc'
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Commercial"
        title="Commercial Exceptions Desk"
        description="Active margin warnings, missing labour rates, stale supplier prices, unbilled work, and cost variance alerts."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/commercial/quotes"
              className="rounded bg-white px-3 py-1.5 text-[12px] font-normal text-[#6D6D68] border border-[#E8E8E5] hover:text-white"
            >
              Quotes Desk →
            </Link>
          </div>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[12px] uppercase tracking-wider text-[#6D6D68]">
            Exceptions Queue ({exceptions?.length || 0})
          </h3>
        </div>

        {exceptions && exceptions.length > 0 ? (
          <div className="space-y-3">
            {exceptions.map((e) => (
              <div
                key={e.id}
                className="flex items-start justify-between rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-normal ${
                        e.severity === 'BLOCKING'
                          ? 'bg-rose-500/20 text-rose-300'
                          : e.severity === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {e.severity}
                    </span>
                    <span className="font-normal text-[11px] text-[#6D6D68]">
                      {e.object_type} · Ref: {e.object_id.slice(0, 8)}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#111111] font-normal">{e.detail}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-normal text-[11px] text-[#9A9A95]">
                    {new Date(e.created_at).toLocaleDateString('en-GB')}
                  </span>
                  <button className="rounded bg-[#F5F5F3] px-2.5 py-1 font-normal text-[11px] text-[#6D6D68] hover:text-white hover:bg-brand-electric">
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Active Commercial Exceptions"
            description="All quotes, labour rates, and cost commitments comply with standard commercial policy."
            actionText="View Commercial WIP"
            actionHref="/admin/commercial/wip"
          />
        )}
      </div>
    </div>
  );
}
