import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function AlertsExceptionsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Command Centre"
        title="Alerts & Operational Exceptions"
        description="Process deviations requiring immediate intervention: missing compliance evidence, rejected dispatches, and budget variances."
      />

      <EmptyState
        title="Zero Operational Exceptions"
        description="All operational processes are running within normal parameters. Process variances and missing evidence alerts will appear here."
        actionText="View Operations Command"
        actionHref="/admin"
      />
    </div>
  );
}
