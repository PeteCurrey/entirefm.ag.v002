'use client';

import React, { useState } from 'react';
import { UserSession } from '@/server/identity';
import { OperationalMetrics } from '@/server/reporting';
import { Site } from '@/server/estate';
import { ExtendedLead } from '@/server/growth/types';
import { NotificationRecord } from '@/server/notifications/types';
import { AnalyticsSummary } from '@/server/analytics/types';
import { CommandHeader } from './CommandHeader';
import { EstatePulseStrip, EstatePulseData } from './EstatePulseStrip';
import { LiveEstateWorkspace, SiteWithTelemetry } from './LiveEstateWorkspace';
import { ActionRequiredQueue, ActionRequiredItem } from './ActionRequiredQueue';
import { LeadPipelineWidget } from './LeadPipelineWidget';
import { WebsiteAnalyticsMiniWidget } from './WebsiteAnalyticsMiniWidget';
import { OperationsTimeline } from './OperationsTimeline';
import { LiveWorkloadPipeline } from './LiveWorkloadPipeline';
import { FieldPresencePanel, EngineerPresenceItem } from './FieldPresencePanel';
import { ComplianceRadar } from './ComplianceRadar';
import { CommercialPosition } from './CommercialPosition';
import { EntireIntelligenceBrief } from './EntireIntelligenceBrief';
import { SiteInspectorDrawer } from './SiteInspectorDrawer';

interface ControlCentreClientProps {
  session: UserSession | null;
  metrics: OperationalMetrics;
  sites: Site[];
  dbConnected: boolean;
  complianceKpis?: Record<string, number>;
  leads?: ExtendedLead[];
  unreadNotifications?: NotificationRecord[];
  analytics?: AnalyticsSummary | null;
}

export function ControlCentreClient({
  session,
  metrics,
  sites,
  dbConnected,
  complianceKpis,
  leads = [],
  unreadNotifications = [],
  analytics = null,
}: ControlCentreClientProps) {
  const [activePersona, setActivePersona] = useState<string>('FM_DIRECTOR');
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('all');
  const [timeContext, setTimeContext] = useState<string>('today');
  const [selectedSite, setSelectedSite] = useState<SiteWithTelemetry | null>(null);
  const [siteDrawerOpen, setSiteDrawerOpen] = useState<boolean>(false);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [activeWorkloadState, setActiveWorkloadState] = useState<string | null>(null);

  // Compute compliance % from real KPIs — no hard-coded fallback
  const applicableObligations = complianceKpis?.APPLICABLE_OBLIGATIONS ?? 0;
  const compliantObligations = complianceKpis?.COMPLIANT_OBLIGATIONS ?? 0;
  const compliancePercent =
    applicableObligations > 0
      ? Math.round((compliantObligations / applicableObligations) * 1000) / 10
      : null;

  const pulseData: EstatePulseData = {
    sitesCount: sites.length,
    assetsCount: metrics.totalAssetsCount,
    openJobsCount: metrics.activeWorkOrders,
    slaPerformancePercent: null,
    compliancePercent,
    currentWorksGbp: metrics.unbilledWipAmountGbp,
    criticalJobsCount: metrics.criticalIncidents,
    slaBreachRiskCount: metrics.slaBreachRiskCount,
  };

  const actionItems: ActionRequiredItem[] = unreadNotifications.map((n) => ({
    id: n.id,
    type:
      n.severity === 'CRITICAL'
        ? 'CRITICAL'
        : n.type === 'NEW_ENQUIRY'
        ? 'NEW_LEAD'
        : n.type === 'SLA_RISK'
        ? 'SLA_RISK'
        : n.type === 'COMPLIANCE_OVERDUE' || n.type === 'PPM_OVERDUE'
        ? 'OVERDUE'
        : 'APPROVAL',
    title: n.title,
    location: n.metadata?.source || n.metadata?.siteName || 'Commercial Estate',
    urgencyDetail: n.message,
    primaryActionLabel: n.type === 'NEW_ENQUIRY' ? 'Qualify Lead' : 'View Record',
    targetHref: n.action_url,
    entityType: n.entity_type as any,
  }));

  const handleSelectSite = (site: SiteWithTelemetry) => {
    setSelectedSite(site);
    setSiteDrawerOpen(true);
  };

  const handleMetricClick = (key: string) => {
    setActiveMetric((prev) => (prev === key ? null : key));
  };

  const handleActionRequiredInspect = (item: ActionRequiredItem) => {
    if (item.targetHref) {
      window.location.href = item.targetHref;
      return;
    }
    if (item.entityType === 'work_order' && sites.length > 0) {
      setSelectedSite(sites[0] as SiteWithTelemetry);
      setSiteDrawerOpen(true);
    }
  };

  const handleEngineerClick = (_engineer: EngineerPresenceItem) => {
    if (sites.length > 0) {
      setSelectedSite(sites[0] as SiteWithTelemetry);
      setSiteDrawerOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Command Header */}
      <CommandHeader
        session={session}
        activePersona={activePersona}
        onPersonaChange={setActivePersona}
        selectedPortfolio={selectedPortfolio}
        onPortfolioChange={setSelectedPortfolio}
        timeContext={timeContext}
        onTimeContextChange={setTimeContext}
        onCreateClick={() => {
          window.location.href = '/admin/operations/work-orders';
        }}
      />

      {!dbConnected && (
        <div className="rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] p-3.5 text-[12.5px] text-[#B45309] flex items-center gap-3">
          <strong className="font-semibold text-[#92400E]">Database Offline / Local Mode.</strong>{' '}
          Inbound leads and notifications are actively persisting in memory and syncing with telemetry.
        </div>
      )}

      {/* 2. Estate Pulse Instrumentation Strip */}
      <EstatePulseStrip
        data={pulseData}
        activeMetric={activeMetric}
        onMetricClick={handleMetricClick}
      />

      {/* 3. Primary Spatial & Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Central Focus: Live Estate Workspace + Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <LiveEstateWorkspace
            sites={sites as SiteWithTelemetry[]}
            selectedSiteId={selectedSite?.id || null}
            onSelectSite={handleSelectSite}
          />
          <OperationsTimeline events={[]} />
        </div>

        {/* Right Focus: Action Required + Entire Intelligence + Field Presence (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ActionRequiredQueue
            items={actionItems}
            onItemInspect={handleActionRequiredInspect}
          />
          <EntireIntelligenceBrief />
          <FieldPresencePanel
            summary={null}
            exceptions={[]}
            onEngineerClick={handleEngineerClick}
          />
        </div>
      </div>

      {/* 4. Commercial Intelligence & Conversion Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <WebsiteAnalyticsMiniWidget analytics={analytics} />
        </div>
        <div className="lg:col-span-6">
          <LeadPipelineWidget leads={leads} />
        </div>
      </div>

      {/* 5. Lower Operational Assurance Row */}
      <LiveWorkloadPipeline
        counts={null}
        activeState={activeWorkloadState}
        onStateSelect={(stateKey) =>
          setActiveWorkloadState((prev) => (prev === stateKey ? null : stateKey))
        }
      />

      {/* 6. Compliance & Commercial Position Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceRadar
          overallRate={compliancePercent}
          compliant={compliantObligations}
          dueIn30Days={complianceKpis?.CERTIFICATES_EXPIRING_30D ?? null}
          overdue={complianceKpis?.OVERDUE_OBLIGATIONS ?? null}
          evidenceRejected={null}
          reviewRequired={complianceKpis?.RULES_UNDER_REVIEW ?? null}
        />
        <CommercialPosition
          spendMtd={metrics.unbilledWipAmountGbp > 0 ? metrics.unbilledWipAmountGbp : null}
          committed={null}
          awaitingApproval={null}
        />
      </div>

      {/* Contextual Side Inspector Drawer */}
      <SiteInspectorDrawer
        site={selectedSite}
        open={siteDrawerOpen}
        onClose={() => setSiteDrawerOpen(false)}
      />
    </div>
  );
}
