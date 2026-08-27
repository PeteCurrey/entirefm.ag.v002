import React from 'react';
import { listWorkOrders } from '@/server/work';
import { listSites } from '@/server/estate';
import { WorkOrdersPageClient } from './WorkOrdersPageClient';

export const dynamic = 'force-dynamic';

export default async function WorkOrdersPage() {
  const [workOrders, sites] = await Promise.all([
    listWorkOrders({ limit: 200 }),
    listSites(),
  ]);

  return <WorkOrdersPageClient initialWorkOrders={workOrders} sites={sites} />;
}
