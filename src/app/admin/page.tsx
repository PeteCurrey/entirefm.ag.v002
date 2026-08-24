import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getOperationalMetrics } from '@/server/reporting';
import { listSites } from '@/server/estate';
import { isDbConfigured } from '@/server/db/client';
import { ControlCentreClient } from '@/components/admin/control-centre/ControlCentreClient';

export const dynamic = 'force-dynamic';

export default async function AdminCommandCentrePage() {
  const session = await getCurrentSession();
  const dbConnected = isDbConfigured();

  const [metrics, sites] = await Promise.all([
    getOperationalMetrics(),
    listSites(),
  ]);

  return (
    <ControlCentreClient
      session={session}
      metrics={metrics}
      sites={sites}
      dbConnected={dbConnected}
    />
  );
}
