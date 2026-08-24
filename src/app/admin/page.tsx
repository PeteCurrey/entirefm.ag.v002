import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getOperationalMetrics } from '@/server/reporting';
import { listSites } from '@/server/estate';
import { getComplianceKPIs } from '@/server/compliance';
import { isDbConfigured } from '@/server/db/client';
import { listExtendedLeads } from '@/server/growth/store';
import { listNotifications } from '@/server/notifications';
import { getWebsiteAnalytics } from '@/server/analytics';
import { ControlCentreClient } from '@/components/admin/control-centre/ControlCentreClient';

export const dynamic = 'force-dynamic';

export default async function AdminCommandCentrePage() {
  const session = await getCurrentSession();
  const dbConnected = isDbConfigured();

  const [metrics, sites, complianceKpis, leadsData, unreadNotifications, analyticsData] = await Promise.all([
    getOperationalMetrics(),
    listSites(),
    getComplianceKPIs(undefined, undefined, session ?? undefined).catch(() => ({})),
    listExtendedLeads({ limit: 15 }).catch(() => ({ leads: [], total: 0 })),
    listNotifications({ unreadOnly: true, limit: 10 }).catch(() => []),
    getWebsiteAnalytics('30d').catch(() => null),
  ]);

  return (
    <ControlCentreClient
      session={session}
      metrics={metrics}
      sites={sites}
      dbConnected={dbConnected}
      complianceKpis={complianceKpis}
      leads={leadsData.leads}
      unreadNotifications={unreadNotifications}
      analytics={analyticsData}
    />
  );
}
