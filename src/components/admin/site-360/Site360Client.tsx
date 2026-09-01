'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Site, Asset, Building, Space } from '@/server/estate';
import { WorkOrder } from '@/server/work';
import { ComplianceObligation } from '@/server/compliance';
import { SiteVisualMode } from './VisualModeSelector';
import { BuildingNavTab, BuildingNavPalette } from './BuildingNavPalette';
import { SiteHeroWorkspace } from './SiteHeroWorkspace';
import { SiteCarouselSelector, SiteCarouselItem } from './SiteCarouselSelector';
import { SiteProfileInspector } from './SiteProfileInspector';
import { SiteLiveOperationsInspector } from './SiteLiveOperationsInspector';
import { SiteHealthInstrument } from './SiteHealthInstrument';
import { Asset360Inspector } from './Asset360Inspector';
import { WorkOrderOperationalWorkspace } from './WorkOrderOperationalWorkspace';
import { Layers, Wrench, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Site360ClientProps {
  currentSite: Site;
  allSites: Site[];
  assets?: Asset[];
  buildings?: Building[];
  spaces?: Space[];
  workOrders?: WorkOrder[];
  complianceObligations?: ComplianceObligation[];
}

export function Site360Client({
  currentSite,
  allSites,
  assets = [],
  buildings = [],
  spaces = [],
  workOrders = [],
  complianceObligations = [],
}: Site360ClientProps) {
  const router = useRouter();
  const [visualMode, setVisualMode] = useState<SiteVisualMode>('PHOTO');
  const [activeTab, setActiveTab] = useState<BuildingNavTab>('overview');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(
    workOrders.length > 0 ? workOrders[0] : null
  );
  const [assetDrawerOpen, setAssetDrawerOpen] = useState(false);

  // Compute real compliance percentage
  const compliantCount = complianceObligations.filter((c) => c.status === 'COMPLIANT').length;
  const compliancePercent =
    complianceObligations.length > 0
      ? Math.round((compliantCount / complianceObligations.length) * 100)
      : 100;

  // Map all sites to carousel items
  const carouselSites: SiteCarouselItem[] = allSites.map((s, idx) => ({
    ...s,
    openJobsCount: 0,
    healthStatus: s.status === 'ACTIVE' ? 'HEALTHY' : 'WARNING',
    heroImageUrl: idx % 2 === 0 ? '/images/EntireFM 01.png' : '/images/EntireFM 02.png',
  }));

  const handleSelectSiteFromCarousel = (siteId: string) => {
    router.push(`/admin/estate/sites/${siteId}`);
  };

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssetDrawerOpen(true);
  };

  const handleSelectWorkOrder = (wo: WorkOrder) => {
    setSelectedWorkOrder(wo);
    setActiveTab('work');
  };

  return (
    <div className="space-y-6">
      {/* 1. Large Central Hero Workspace */}
      <SiteHeroWorkspace
        site={currentSite}
        buildings={buildings}
        spaces={spaces}
        assets={assets}
        workOrders={workOrders}
        compliancePercent={compliancePercent}
        mode={visualMode}
        onModeChange={setVisualMode}
        onSelectAsset={handleSelectAsset}
        onSelectWorkOrder={handleSelectWorkOrder}
      />

      {/* 2. Precision Building Navigation Palette */}
      <BuildingNavPalette
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        counts={{
          spaces: spaces.length,
          assets: assets.length,
          work: workOrders.length,
          compliance: complianceObligations.length,
          documents: 0,
        }}
      />

      {/* 3. Dynamic Module Body depending on Active Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Profile Inspector (6 Cols) */}
            <div className="lg:col-span-6">
              <SiteProfileInspector site={currentSite} buildings={buildings} />
            </div>

            {/* Right Live Operations Inspector (6 Cols) */}
            <div className="lg:col-span-6">
              <SiteLiveOperationsInspector
                siteId={currentSite.id}
                workOrders={workOrders}
                complianceObligations={complianceObligations}
                onSelectWorkOrder={handleSelectWorkOrder}
              />
            </div>
          </div>

          {/* Site Health Instrument */}
          <SiteHealthInstrument
            assets={assets}
            workOrders={workOrders}
            complianceObligations={complianceObligations}
          />
        </div>
      )}

      {activeTab === 'work' && (
        <div className="space-y-6">
          <WorkOrderOperationalWorkspace workOrder={selectedWorkOrder} />
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-3">
            <h3 className="text-[12px] font-normal uppercase tracking-wider text-[#101010]">
              SITE ASSET REGISTER ({assets.length} UNITS)
            </h3>
            <span className="text-[12px] text-[#686866]">
              Click asset to inspect technical record
            </span>
          </div>

          {assets.length === 0 ? (
            <div className="py-12 text-center text-[#686866] font-normal text-[12px]">
              No physical assets registered for this site.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {assets.map((a) => (
                <div
                  key={a.id}
                  onClick={() => handleSelectAsset(a)}
                  className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-4 hover:border-[#FF6B24] hover:bg-[#FFFFFF] transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] text-[#FF6B24] font-light">
                      {a.asset_reference}
                    </span>
                    <span
                      className={`rounded-[4px] px-1.5 py-0.2 font-normal text-[9px] ${
                        a.criticality === 'CRITICAL'
                          ? 'bg-[#FEF2F2] text-[#B91C1C] font-light'
                          : 'bg-[#EFF6FF] text-[#1D4ED8]'
                      }`}
                    >
                      {a.criticality || 'STANDARD'}
                    </span>
                  </div>
                  <div className="font-normal text-[13.5px] text-[#101010] line-clamp-1">{a.name}</div>
                  <div className="text-[11.5px] text-[#686866]">{a.system_category || 'GENERAL'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-3">
            <h3 className="text-[12px] font-normal uppercase tracking-wider text-[#101010]">
              STATUTORY COMPLIANCE OBLIGATIONS ({complianceObligations.length})
            </h3>
          </div>

          {complianceObligations.length === 0 ? (
            <div className="py-12 text-center text-[#686866] font-normal text-[12px]">
              No compliance obligations assigned to this site.
            </div>
          ) : (
            <div className="space-y-2">
              {complianceObligations.map((c) => (
                <div
                  key={c.id}
                  className="rounded-[8px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 flex items-center justify-between text-[12.5px]"
                >
                  <div>
                    <div className="font-normal text-[#101010]">
                      {c.rule_version?.rule?.title || 'Statutory Obligation'}
                    </div>
                    <div className="text-[11px] text-[#686866] font-normal">
                      Category: {c.rule_version?.rule?.rule_family || 'STATUTORY'} · Due: {c.next_due_at || 'Periodic'}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-[4px] font-light ${
                      c.status === 'COMPLIANT'
                        ? 'bg-[#F0FDF4] text-[#15803D]'
                        : c.status === 'OVERDUE'
                        ? 'bg-[#FEF2F2] text-[#B91C1C]'
                        : 'bg-[#FFF7ED] text-[#C2410C]'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Bottom Horizontal Site Selector Carousel */}
      {allSites.length > 0 && (
        <SiteCarouselSelector
          sites={carouselSites}
          selectedSiteId={currentSite.id}
          onSelectSite={handleSelectSiteFromCarousel}
        />
      )}

      {/* Asset 360 Inspector Drawer */}
      <Asset360Inspector
        asset={selectedAsset}
        open={assetDrawerOpen}
        onClose={() => setAssetDrawerOpen(false)}
      />
    </div>
  );
}
