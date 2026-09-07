import React from 'react';
import { listSites } from '@/server/estate';
import { listWorkOrders } from '@/server/work';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { WorkOrdersMapCard } from '@/components/admin/WorkOrdersMapCard';

export const dynamic = 'force-dynamic';

export default async function OperationsMapPage() {
  const [sites, activeJobs] = await Promise.all([
    listSites({ status: 'ACTIVE' }),
    listWorkOrders({ limit: 100 }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Operations"
        title="Operations Radar Map"
        description="Geospatial distribution of managed client sites, active emergency callouts, and field contractor coverage points."
      />

      <WorkOrdersMapCard
        workOrders={activeJobs}
        sites={sites}
        statusFilter="ALL"
      />
    </div>
  );
}
