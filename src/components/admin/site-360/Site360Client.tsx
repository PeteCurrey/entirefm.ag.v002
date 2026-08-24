'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Site } from '@/server/estate';
import { SiteVisualMode } from './VisualModeSelector';
import { BuildingNavTab, BuildingNavPalette } from './BuildingNavPalette';
import { SiteHeroWorkspace } from './SiteHeroWorkspace';
import { SiteCarouselSelector, SiteCarouselItem } from './SiteCarouselSelector';
import { SiteProfileInspector } from './SiteProfileInspector';
import { SiteLiveOperationsInspector } from './SiteLiveOperationsInspector';
import { SiteHealthInstrument } from './SiteHealthInstrument';
import { Asset360Inspector, AssetDetail } from './Asset360Inspector';
import { WorkOrderOperationalWorkspace } from './WorkOrderOperationalWorkspace';

interface Site360ClientProps {
  currentSite: Site;
  allSites: Site[];
}

export function Site360Client({ currentSite, allSites }: Site360ClientProps) {
  const router = useRouter();
  const [visualMode, setVisualMode] = useState<SiteVisualMode>('PHOTO');
  const [activeTab, setActiveTab] = useState<BuildingNavTab>('overview');
  const [selectedAsset, setSelectedAsset] = useState<AssetDetail | null>(null);
  const [assetDrawerOpen, setAssetDrawerOpen] = useState(false);

  // Map all sites to carousel items
  const carouselSites: SiteCarouselItem[] = allSites.map((s, idx) => ({
    ...s,
    openJobsCount: idx === 0 ? 3 : idx === 1 ? 1 : 0,
    healthStatus: idx === 0 ? 'CRITICAL' : idx === 1 ? 'WARNING' : 'HEALTHY',
    heroImageUrl:
      s.city?.toLowerCase().includes('manchester')
        ? '/images/EntireFM 02.png'
        : s.city?.toLowerCase().includes('london')
        ? '/images/0c21ecde-cc89-4509-951a-5d9d65a7a8be.png'
        : s.city?.toLowerCase().includes('birmingham')
        ? '/images/12ecc6b7-2a40-4046-86d8-ca2f3f51dec6.png'
        : '/images/EntireFM 01.png',
  }));

  const handleSelectSiteFromCarousel = (siteId: string) => {
    router.push(`/admin/estate/sites/${siteId}`);
  };

  const handleMarkerClick = (markerType: string) => {
    if (markerType === 'critical_wo') {
      setActiveTab('work');
    } else if (markerType === 'loler_inspection') {
      setSelectedAsset({
        id: 'asset-lift',
        assetReference: 'EQ-LFT-001',
        name: 'Passenger Elevator Core A',
        category: 'VERTICAL_TRANSPORT',
        manufacturer: 'KONE',
        modelNumber: 'MonoSpace 700 DX',
        serialNumber: 'KN-2021-98402',
        location: 'Central Core Shaft 1',
        criticality: 'HIGH',
        condition: 'GOOD',
        installDate: '2021-04-12',
        expectedLifeYears: 25,
        status: 'IN_SERVICE',
      });
      setAssetDrawerOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Large Central Hero Workspace */}
      <SiteHeroWorkspace
        site={{
          ...currentSite,
          heroImageUrl:
            currentSite.city?.toLowerCase().includes('manchester')
              ? '/images/EntireFM 02.png'
              : '/images/EntireFM 01.png',
          openJobsCount: 3,
          criticalJobsCount: 1,
          compliancePercent: 98.4,
          engineersPresent: 2,
          grossAreaSqm: 8450,
          occupancyPercent: 94,
        }}
        mode={visualMode}
        onModeChange={setVisualMode}
        onMarkerClick={handleMarkerClick}
      />

      {/* 2. Precision Building Navigation Palette */}
      <BuildingNavPalette
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        counts={{
          spaces: 24,
          assets: 148,
          work: 3,
          compliance: 16,
          documents: 42,
        }}
      />

      {/* 3. Dynamic Module Body depending on Active Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Profile Inspector (6 Cols) */}
            <div className="lg:col-span-6">
              <SiteProfileInspector
                site={{
                  ...currentSite,
                  grossAreaSqm: 8450,
                  contractName: 'Total FM Complete Asset & Fabric Contract',
                }}
              />
            </div>

            {/* Right Live Operations Inspector (6 Cols) */}
            <div className="lg:col-span-6">
              <SiteLiveOperationsInspector siteId={currentSite.id} />
            </div>
          </div>

          {/* Site Health Instrument */}
          <SiteHealthInstrument />
        </div>
      )}

      {activeTab === 'work' && (
        <div className="space-y-6">
          <WorkOrderOperationalWorkspace />
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-3">
            <h3 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-[#101010]">
              SITE ASSET REGISTER (148 UNITS)
            </h3>
            <span className="text-[12px] text-[#686866]">Click asset to inspect technical record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {[
              {
                id: 'a1',
                assetReference: 'EQ-BLR-001',
                name: 'Primary Condensing Gas Boiler BLR-01',
                category: 'HEATING_PLANT',
                manufacturer: 'Viessmann',
                modelNumber: 'Vitocrossal 300',
                serialNumber: 'VM-98402-2022',
                location: 'Basement Plant Room Level -1',
                criticality: 'CRITICAL' as const,
                condition: 'GOOD' as const,
                installDate: '2022-09-15',
                expectedLifeYears: 20,
                status: 'UNDER_REPAIR' as const,
              },
              {
                id: 'a2',
                assetReference: 'EQ-AHU-001',
                name: 'Main Air Handling Unit AHU-01',
                category: 'HVAC_VENTILATION',
                manufacturer: 'Daikin Applied',
                modelNumber: 'Modular-P 400',
                serialNumber: 'DK-44820-2021',
                location: 'Roof Plant Deck',
                criticality: 'HIGH' as const,
                condition: 'EXCELLENT' as const,
                installDate: '2021-06-10',
                expectedLifeYears: 18,
                status: 'IN_SERVICE' as const,
              },
              {
                id: 'a3',
                assetReference: 'EQ-LFT-001',
                name: 'Passenger Elevator Core A',
                category: 'VERTICAL_TRANSPORT',
                manufacturer: 'KONE',
                modelNumber: 'MonoSpace 700 DX',
                serialNumber: 'KN-2021-98402',
                location: 'Central Core Shaft 1',
                criticality: 'HIGH' as const,
                condition: 'GOOD' as const,
                installDate: '2021-04-12',
                expectedLifeYears: 25,
                status: 'IN_SERVICE' as const,
              },
            ].map((a) => (
              <div
                key={a.id}
                onClick={() => {
                  setSelectedAsset(a);
                  setAssetDrawerOpen(true);
                }}
                className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-4 hover:border-[#FF6B24] hover:bg-[#FFFFFF] transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10.5px] text-[#FF6B24] font-semibold">
                    {a.assetReference}
                  </span>
                  <span
                    className={`rounded-[4px] px-1.5 py-0.2 font-mono text-[9px] ${
                      a.criticality === 'CRITICAL'
                        ? 'bg-[#FEF2F2] text-[#B91C1C] font-semibold'
                        : 'bg-[#EFF6FF] text-[#1D4ED8]'
                    }`}
                  >
                    {a.criticality}
                  </span>
                </div>
                <div className="font-medium text-[13.5px] text-[#101010] line-clamp-1">{a.name}</div>
                <div className="text-[11.5px] text-[#686866]">{a.location}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Bottom Horizontal Site Selector Carousel */}
      <SiteCarouselSelector
        sites={carouselSites}
        selectedSiteId={currentSite.id}
        onSelectSite={handleSelectSiteFromCarousel}
      />

      {/* Asset 360 Inspector Drawer */}
      <Asset360Inspector
        asset={selectedAsset}
        open={assetDrawerOpen}
        onClose={() => setAssetDrawerOpen(false)}
      />
    </div>
  );
}
