'use client';

import React, { useState } from 'react';
import { UserSession } from '@/server/identity';
import { OperationalMetrics } from '@/server/reporting';
import { Site } from '@/server/estate';
import { CommandHeader } from './CommandHeader';
import { EstatePulseStrip, EstatePulseData } from './EstatePulseStrip';
import { LiveEstateWorkspace, SiteWithTelemetry } from './LiveEstateWorkspace';
import { ActionRequiredQueue, ActionRequiredItem } from './ActionRequiredQueue';
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
}

export function ControlCentreClient({
  session,
  metrics,
  sites,
  dbConnected,
  complianceKpis,
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
    // SLA % requires SLA tracking analytics — no real data source yet
    slaPerformancePercent: null,
    compliancePercent,
    currentWorksGbp: metrics.unbilledWipAmountGbp,
    criticalJobsCount: metrics.criticalIncidents,
    slaBreachRiskCount: metrics.slaBreachRiskCount,
  };

  const handleSelectSite = (site: SiteWithTelemetry) => {
    setSelectedSite(site);
    setSiteDrawerOpen(true);
  };

  const handleMetricClick = (key: string) => {
    setActiveMetric((prev) => (prev === key ? null : key));
  };

  const handleActionRequiredInspect = (item: ActionRequiredItem) => {
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
          <strong className="font-semibold text-[#92400E]">Database Not Connected.</strong>{' '}
          Connect your Supabase database in Platform Settings to see live operational data.
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
            items={[]}
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

      {/* 4. Lower Operational Assurance Row */}
      <LiveWorkloadPipeline
        counts={null}
        activeState={activeWorkloadState}
        onStateSelect={(stateKey) =>
          setActiveWorkloadState((prev) => (prev === stateKey ? null : stateKey))
        }
      />

      {/* 5. Compliance & Commercial Position Grid */}
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
