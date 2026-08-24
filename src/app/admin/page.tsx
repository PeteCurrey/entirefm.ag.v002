import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getOperationalMetrics } from '@/server/reporting';
import { listSites } from '@/server/estate';
import { getComplianceKPIs } from '@/server/compliance';
import { isDbConfigured } from '@/server/db/client';
import { ControlCentreClient } from '@/components/admin/control-centre/ControlCentreClient';

export const dynamic = 'force-dynamic';

export default async function AdminCommandCentrePage() {
  const session = await getCurrentSession();
  const dbConnected = isDbConfigured();

  const [metrics, sites, complianceKpis] = await Promise.all([
    getOperationalMetrics(),
    listSites(),
    getComplianceKPIs(undefined, undefined, session ?? undefined).catch(() => ({})),
  ]);

  return (
    <ControlCentreClient
      session={session}
      metrics={metrics}
      sites={sites}
      dbConnected={dbConnected}
      complianceKpis={complianceKpis}
    />
  );
}

