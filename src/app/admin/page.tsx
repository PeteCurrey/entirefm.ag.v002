import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getOperationalMetrics } from '@/server/reporting';
import { listSites, Site } from '@/server/estate';
import { listWorkOrders } from '@/server/work';
import { getComplianceKPIs } from '@/server/compliance';
import { isDbConfigured } from '@/server/db/client';
import { listExtendedLeads } from '@/server/growth/store';
import { listNotifications } from '@/server/notifications';
import { getWebsiteAnalytics } from '@/server/analytics';
import { ControlCentreClient } from '@/components/admin/control-centre/ControlCentreClient';
import { SiteWithTelemetry } from '@/components/admin/control-centre/LiveEstateWorkspace';

export const dynamic = 'force-dynamic';

export default async function AdminCommandCentrePage() {
  const session = await getCurrentSession();
  const dbConnected = isDbConfigured();

  const [metrics, allSites, complianceKpis, leadsData, unreadNotifications, analyticsData, workOrders] =
    await Promise.all([
      getOperationalMetrics(),
      listSites(),
      getComplianceKPIs(undefined, undefined, session ?? undefined).catch(() => ({})),
      listExtendedLeads({ limit: 15 }).catch(() => ({ leads: [], total: 0 })),
      listNotifications({ unreadOnly: true, limit: 10 }).catch(() => []),
      getWebsiteAnalytics('30d').catch(() => null),
      listWorkOrders().catch(() => []),
    ]);

  // Aggregate active live work orders per site
  const activeStatuses = ['OPEN', 'ISSUED', 'ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETION_PENDING'];
  const siteJobStats: Record<string, { open: number; critical: number }> = {};

  for (const wo of workOrders) {
    if (activeStatuses.includes(wo.status) && wo.site_id) {
      if (!siteJobStats[wo.site_id]) {
        siteJobStats[wo.site_id] = { open: 0, critical: 0 };
      }
      siteJobStats[wo.site_id].open++;
      if (wo.priority === 'P1_CRITICAL') {
        siteJobStats[wo.site_id].critical++;
      }
    }
  }

  // Filter for Live Estate Workspace: ONLY sites with live open jobs
  const liveSites: SiteWithTelemetry[] = allSites
    .filter((s) => (siteJobStats[s.id]?.open ?? 0) > 0)
    .map((s) => {
      const stats = siteJobStats[s.id] || { open: 0, critical: 0 };
      return {
        ...s,
        openJobsCount: stats.open,
        criticalJobsCount: stats.critical,
        healthStatus: stats.critical > 0 ? 'CRITICAL' : stats.open > 3 ? 'WARNING' : 'HEALTHY',
      };
    });

  const googleMapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    '';

  return (
    <ControlCentreClient
      session={session}
      metrics={metrics}
      sites={allSites}
      liveSites={liveSites}
      dbConnected={dbConnected}
      complianceKpis={complianceKpis}
      leads={leadsData.leads}
      unreadNotifications={unreadNotifications}
      analytics={analyticsData}
      googleMapsApiKey={googleMapsApiKey}
    />
  );
}
