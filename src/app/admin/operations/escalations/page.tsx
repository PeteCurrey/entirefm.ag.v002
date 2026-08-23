import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function EscalationsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Operations"
        title="Operational Escalations"
        description="Priority job alerts, SLA threshold warnings, safety escalations, and unassigned work exceptions."
      />

      <EmptyState
        title="Zero Active Escalations"
        description="Operational escalations raised by SLA breach triggers, engineer on-site emergencies, or customer management will appear here."
        actionText="View Operations Command"
        actionHref="/admin"
      />
    </div>
  );
}
