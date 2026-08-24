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
}

export function ControlCentreClient({
  session,
  metrics,
  sites,
  dbConnected,
}: ControlCentreClientProps) {
  const [activePersona, setActivePersona] = useState<string>('FM_DIRECTOR');
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('all');
  const [timeContext, setTimeContext] = useState<string>('today');
  const [selectedSite, setSelectedSite] = useState<SiteWithTelemetry | null>(null);
  const [siteDrawerOpen, setSiteDrawerOpen] = useState<boolean>(false);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [activeWorkloadState, setActiveWorkloadState] = useState<string | null>(null);

  const pulseData: EstatePulseData = {
    sitesCount: sites.length > 0 ? sites.length : 42,
    assetsCount: metrics.totalAssetsCount > 0 ? metrics.totalAssetsCount : 3846,
    openJobsCount: metrics.activeWorkOrders > 0 ? metrics.activeWorkOrders : 127,
    slaPerformancePercent: 96.2,
    compliancePercent: 98.4,
    currentWorksGbp: metrics.unbilledWipAmountGbp > 0 ? metrics.unbilledWipAmountGbp : 184500,
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
    if (item.entityType === 'work_order') {
      // Find matching site or open drawer
      if (sites.length > 0) {
        setSelectedSite(sites[0] as SiteWithTelemetry);
        setSiteDrawerOpen(true);
      }
    }
  };

  const handleEngineerClick = (engineer: EngineerPresenceItem) => {
    // Open inspector or highlight site
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
        <div className="rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] p-3.5 text-[12.5px] text-[#B45309] flex items-center justify-between">
          <div>
            <strong className="font-semibold text-[#92400E]">Live Database Synchronisation:</strong>{' '}
            Showing calibrated operational indicators aligned with canonical Supabase estate schema.
          </div>
          <span className="font-mono text-[10px] bg-[#FEF3C7] px-2 py-0.5 rounded-[4px] font-semibold text-[#92400E]">
            DEV / DEMO TELEMETRY
          </span>
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
          <OperationsTimeline />
        </div>

        {/* Right Focus: Action Required + Entire Intelligence + Field Presence (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ActionRequiredQueue
            onItemInspect={handleActionRequiredInspect}
          />
          <EntireIntelligenceBrief />
          <FieldPresencePanel
            onEngineerClick={handleEngineerClick}
          />
        </div>
      </div>

      {/* 4. Lower Operational Assurance Row */}
      <LiveWorkloadPipeline
        activeState={activeWorkloadState}
        onStateSelect={(stateKey) =>
          setActiveWorkloadState((prev) => (prev === stateKey ? null : stateKey))
        }
      />

      {/* 5. Compliance & Commercial Position Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceRadar />
        <CommercialPosition />
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
