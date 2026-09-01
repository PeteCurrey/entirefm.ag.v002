import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { listComplianceExceptions } from '@/server/compliance';

export const dynamic = 'force-dynamic';

export default async function AlertsExceptionsPage() {
  const exceptions = await listComplianceExceptions();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Command Centre"
        title="Alerts & Operational Exceptions"
        description="Process deviations requiring immediate intervention: missing compliance evidence, rejected dispatches, and budget variances."
      />

      {exceptions.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
            <h3 className="text-sm font-normal text-white mb-3">Statutory & Operational Compliance Exceptions ({exceptions.length})</h3>
            <div className="space-y-2">
              {exceptions.map(exc => (
                <div key={exc.id} className="flex items-center justify-between rounded border border-brand-edge-dark/50 bg-brand-void/30 p-3 text-[12.5px]">
                  <div>
                    <div className="font-normal text-white">{exc.site?.name || 'Estate Site'} — {exc.exception_type}</div>
                    <div className="text-[11.5px] text-brand-mist/60">{exc.reason}</div>
                  </div>
                  <div className="text-right">
                    <span className={`rounded px-2 py-0.5 font-normal text-[10px]${exc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {exc.severity}
                    </span>
                    <div className="text-[10px] text-brand-mist/50 mt-1 font-normal">{exc.state}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Zero Operational Exceptions"
          description="All operational processes are running within normal parameters. Process variances and missing evidence alerts will appear here."
          actionText="View Operations Command"
          actionHref="/admin"
        />
      )}
    </div>
  );
}
