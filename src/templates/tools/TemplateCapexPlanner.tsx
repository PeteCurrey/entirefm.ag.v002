'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Layers,
  AlertTriangle,
  Building2,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Download,
  FileSpreadsheet,
  Plus,
  Trash2,
  Copy,
  Info,
  CheckCircle2,
  ShieldAlert,
  Clock,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  BarChart3,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { ToolPdfGateModal } from '@/components/tools/ToolPdfGateModal';
import { SaveToWorkspaceButton, SiteProfileOption } from '@/components/tools/SaveToWorkspaceButton';
import {
  CAPEX_ASSET_CATEGORIES,
  CAPEX_REGIONS,
  AssetCondition,
  getAllCapexAssets,
  getCapexAssetById,
} from '@/lib/tools/capex-taxonomy';
import {
  CapexItemInput,
  calculateCapexForecast,
  CapexForecastSummary,
} from '@/lib/tools/capex-calculator';
import { downloadCapexPack, CapexReportData } from '@/lib/pdf/capex-pack-builder';
import type { TemplateProps } from '../types';

// Preset Scenarios for Rapid Exploration
const PRESET_OFFICE_HQ: CapexItemInput[] = [
  { id: 'item-1', assetId: 'hvac-ahu', customName: 'Main Supply Air Handler (AHU-01)', installYear: 2008, condition: 'Fair', quantity: 2 },
  { id: 'item-2', assetId: 'hvac-chiller-air', customName: 'Rooftop Packaged Chiller 1', installYear: 2011, condition: 'Fair', quantity: 1 },
  { id: 'item-3', assetId: 'hvac-boiler', customName: 'Condensing Gas Boilers', installYear: 2007, condition: 'Poor', quantity: 2 },
  { id: 'item-4', assetId: 'lift-passenger', customName: 'Core Passenger Lifts (10-Person)', installYear: 2002, condition: 'Fair', quantity: 2 },
  { id: 'item-5', assetId: 'fab-roof-felt', customName: 'Flat Roof Cap Sheet Membrane', installYear: 2006, condition: 'Poor', quantity: 1 },
  { id: 'item-6', assetId: 'elec-switchgear', customName: 'Main LV Incomer Switchboard', installYear: 1998, condition: 'Good', quantity: 1 },
  { id: 'item-7', assetId: 'fire-alarm', customName: 'Addressable Fire Alarm Panel', installYear: 2012, condition: 'Fair', quantity: 1 },
  { id: 'item-8', assetId: 'water-tanks', customName: 'Sectional Cold Water Tanks', installYear: 2004, condition: 'Fair', quantity: 1 },
  { id: 'item-9', assetId: 'water-booster', customName: 'Cold Water Booster Pump Skid', installYear: 2015, condition: 'Good', quantity: 1 },
  { id: 'item-10', assetId: 'sec-cctv', customName: 'Site IP CCTV Camera Network', installYear: 2018, condition: 'Good', quantity: 1 },
];

const PRESET_LOGISTICS_HUB: CapexItemInput[] = [
  { id: 'item-1', assetId: 'hvac-vrf', customName: 'Office Mezzanine VRF System', installYear: 2014, condition: 'Fair', quantity: 2 },
  { id: 'item-2', assetId: 'lift-goods', customName: 'Loading Bay Hydraulic Dock Levellers', installYear: 2009, condition: 'Poor', quantity: 4 },
  { id: 'item-3', assetId: 'fab-roof-single-ply', customName: 'Warehouse Single-Ply Membrane', installYear: 2005, condition: 'Fair', quantity: 1 },
  { id: 'item-4', assetId: 'elec-generator', customName: 'Standby Diesel Generator (250kVA)', installYear: 2003, condition: 'Fair', quantity: 1 },
  { id: 'item-5', assetId: 'fire-sprinklers', customName: 'Sprinkler Booster Pumps & Valves', installYear: 2006, condition: 'Good', quantity: 1 },
  { id: 'item-6', assetId: 'sec-gates', customName: 'HGV Perimeter Sliding Barrier', installYear: 2013, condition: 'Poor', quantity: 2 },
  { id: 'item-7', assetId: 'elec-solar', customName: 'Rooftop Solar PV Inverter (50kW)', installYear: 2016, condition: 'Good', quantity: 1 },
];

const PRESET_AGED_FACILITY: CapexItemInput[] = [
  { id: 'item-1', assetId: 'hvac-boiler', customName: 'Commercial Heating Plant (Boiler 1 & 2)', installYear: 2001, condition: 'Poor', quantity: 2 },
  { id: 'item-2', assetId: 'hvac-chiller-water', customName: 'Basement Water-Cooled Chiller', installYear: 1999, condition: 'Poor', quantity: 1 },
  { id: 'item-3', assetId: 'lift-passenger', customName: 'Main Reception Traction Lift', installYear: 1997, condition: 'Poor', quantity: 1 },
  { id: 'item-4', assetId: 'fab-roof-felt', customName: 'Built-Up Bituminous Felt Roof', installYear: 2003, condition: 'Poor', quantity: 1 },
  { id: 'item-5', assetId: 'elec-ups', customName: 'Critical Comms Room UPS Inverter', installYear: 2011, condition: 'Fair', quantity: 1 },
  { id: 'item-6', assetId: 'water-calorifier', customName: 'Domestic Hot Water Calorifiers', installYear: 2005, condition: 'Fair', quantity: 2 },
];

export function TemplateCapexPlanner({ route, content }: TemplateProps) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Estate & Regional Settings
  const [siteName, setSiteName] = useState<string>('St Pauls Commercial Centre');
  const [regionKey, setRegionKey] = useState<string>('national');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [siteProfiles, setSiteProfiles] = useState<SiteProfileOption[]>([]);

  // Asset Inventory Items
  const [items, setItems] = useState<CapexItemInput[]>(PRESET_OFFICE_HQ);

  // Filter & Selected Chart Year
  const [selectedChartYear, setSelectedChartYear] = useState<number | null>(null);

  // AI Commentary State
  const [whyItWorksText, setWhyItWorksText] = useState<string>('');
  const [whyItWorksSource, setWhyItWorksSource] = useState<string>('');
  const [whyItWorksLoading, setWhyItWorksLoading] = useState<boolean>(false);

  // PDF Gate Modal State
  const [gateOpen, setGateOpen] = useState<boolean>(false);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'Asset Lifecycle & CAPEX Planner', url: '/tools/capex-planner' },
  ];

  // Load member site profiles if logged in
  useEffect(() => {
    async function loadProfiles() {
      try {
        const res = await fetch('/api/member/workspace/profiles');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setSiteProfiles(json.data);
          }
        }
      } catch {
        // Logged out / unauthenticated - silent fallback
      }
    }
    loadProfiles();
  }, []);

  // Handle selecting an existing site profile
  const handleSelectProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    const found = siteProfiles.find((p) => p.id === profileId);
    if (found) {
      setSiteName(found.name);
      if (found.region) {
        const matchingKey = Object.keys(CAPEX_REGIONS).find(
          (k) => CAPEX_REGIONS[k].name.toLowerCase().includes(found.region.toLowerCase())
        );
        if (matchingKey) setRegionKey(matchingKey);
      }
    }
  };

  // Perform calculations
  const summary: CapexForecastSummary = useMemo(() => {
    return calculateCapexForecast(items, { currentYear, regionKey });
  }, [items, currentYear, regionKey]);

  // Determine risk profile for AI Commentary
  const riskProfile = useMemo(() => {
    if (summary.immediateAtRiskCount >= 3 || summary.immediateAtRiskCapital >= 80000) {
      return 'high_risk';
    }
    const imminentSpend = summary.forecastYears.slice(0, 3).reduce((acc, y) => acc + y.totalSpend, 0);
    if (imminentSpend > summary.totalTenYearCapex * 0.45) {
      return 'imminent_risk';
    }
    if (summary.averageAssetAge <= 6) {
      return 'modern_estate';
    }
    return 'balanced_estate';
  }, [summary]);

  // Fetch "Why Lifecycle Planning Matters" AI commentary
  useEffect(() => {
    let cancelled = false;
    async function loadCommentary() {
      setWhyItWorksLoading(true);
      try {
        const res = await fetch(`/api/tools/capex-planner/market-context?profile=${riskProfile}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (!cancelled && data.success && data.content) {
          setWhyItWorksText(data.content);
          setWhyItWorksSource(data.source);
        }
      } catch {
        if (!cancelled) {
          setWhyItWorksText(
            'Operating critical commercial building assets beyond their recognized economic service life drastically compounds operational vulnerability, energy inefficiency, and sudden emergency disruption. When aging boilers, chillers, or lifting plant operate past expected thresholds, component obsolescence forces facilities managers into unbudgeted emergency replacements, protracted lead times for specialist plant, and severe operational interruption. Implementing a structured capital expenditure replacement plan replaces reactionary crisis management with orderly forward budgeting. Forward procurement enables competitive engineering tendering, prevents catastrophic mid-season breakdown, and ensures replacement equipment delivers modern seasonal efficiency standards. Proactive lifecycle forecasting transforms unpredictable capital emergencies into controlled, board-approved estate modernization programs.'
          );
          setWhyItWorksSource('DETERMINISTIC');
        }
      } finally {
        if (!cancelled) {
          setWhyItWorksLoading(false);
        }
      }
    }

    loadCommentary();
    return () => {
      cancelled = true;
    };
  }, [riskProfile]);

  // Asset CRUD handlers
  const handleAddItem = () => {
    const all = getAllCapexAssets();
    const defaultAsset = all[0];
    const newItem: CapexItemInput = {
      id: `item-${Date.now()}`,
      assetId: defaultAsset.id,
      customName: '',
      installYear: currentYear - 10,
      condition: 'Fair',
      quantity: 1,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, updates: Partial<CapexItemInput>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDuplicateItem = (item: CapexItemInput) => {
    const duplicated: CapexItemInput = {
      ...item,
      id: `item-${Date.now()}`,
      customName: item.customName ? `${item.customName} (Copy)` : undefined,
    };
    setItems((prev) => [...prev, duplicated]);
  };

  // CSV Export (100% free & ungated)
  const handleDownloadCsv = () => {
    const rows = [
      ['EntireFM Commercial Asset Lifecycle & 10-Year CAPEX Forecast'],
      ['Generated Date', new Date().toLocaleDateString('en-GB')],
      ['Facility / Estate Name', siteName],
      ['Cost Index Region', summary.regionName],
      ['Total 10-Year Forecast Spend', `£${summary.totalTenYearCapex}`],
      ['Immediate At-Risk Capital', `£${summary.immediateAtRiskCapital}`],
      ['Average Asset Age', `${summary.averageAssetAge} years`],
      ['Methodology Note', 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.'],
      [''],
      ['ASSET INVENTORY & LIFECYCLE ASSESSMENT'],
      [
        'Asset Description',
        'Discipline / Category',
        'Install Year',
        'Current Age (Yrs)',
        'Condition',
        'Nominal Life (Yrs)',
        'Adjusted Life (Yrs)',
        'Remaining Useful Life (Yrs)',
        'Replacement Due Year',
        'Quantity',
        'Unit Cost (£)',
        'Total CAPEX (£)',
        'Risk Status',
      ],
      ...items.map((item) => {
        const assetDef = getCapexAssetById(item.assetId);
        const age = currentYear - item.installYear;
        const conditionFactor = item.condition === 'Good' ? 1.1 : item.condition === 'Poor' ? 0.8 : 1.0;
        const adjustedLife = Math.round((assetDef?.nominalYears || 15) * conditionFactor);
        const rul = adjustedLife - age;
        const dueYear = item.installYear + adjustedLife;
        const baseCost = item.costOverride || assetDef?.defaultCost || 10000;
        const unitCost = Math.round(baseCost * summary.regionalMultiplier);
        const total = unitCost * item.quantity;
        const status = rul <= 0 ? 'AT RISK NOW' : rul <= 3 ? 'IMMINENT (1-3 YRS)' : 'STABLE';

        return [
          item.customName || assetDef?.name || 'Commercial Plant',
          assetDef?.categoryName || 'M&E',
          item.installYear.toString(),
          age.toString(),
          item.condition,
          (assetDef?.nominalYears || 15).toString(),
          adjustedLife.toString(),
          rul.toString(),
          dueYear.toString(),
          item.quantity.toString(),
          unitCost.toString(),
          total.toString(),
          status,
        ];
      }),
      [''],
      ['10-YEAR ROLLING CAPITAL CASH FLOW SCHEDULE'],
      ['Calendar Year', 'Relative Year', 'Renewed Units', 'Total Annual Spend (£)'],
      ...summary.forecastYears.map((y) => [
        y.year.toString(),
        `Year ${y.relativeYear}`,
        y.assetCount.toString(),
        y.totalSpend.toString(),
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EntireFM-CAPEX-Forecast-${siteName.replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Download Execution (Triggers after lead capture)
  const handleExecutePdfDownload = () => {
    const allCalculated = items.map((item) => {
      const assetDef = getCapexAssetById(item.assetId);
      const age = currentYear - item.installYear;
      const conditionFactor = item.condition === 'Good' ? 1.1 : item.condition === 'Poor' ? 0.8 : 1.0;
      const adjustedLife = Math.round((assetDef?.nominalYears || 15) * conditionFactor);
      const rul = adjustedLife - age;
      const dueYear = item.installYear + adjustedLife;
      const baseCost = item.costOverride || assetDef?.defaultCost || 10000;
      const unitCost = Math.round(baseCost * summary.regionalMultiplier);
      const isAtRisk = rul <= 0;

      return {
        id: item.id,
        assetId: item.assetId,
        displayName: item.customName || assetDef?.name || 'Commercial Plant Asset',
        categoryName: assetDef?.categoryName || 'Plant',
        categoryId: assetDef?.categoryId || 'general',
        installYear: item.installYear,
        ageYears: age,
        condition: item.condition,
        quantity: item.quantity,
        nominalLifespan: assetDef?.nominalYears || 15,
        adjustedLifespan: adjustedLife,
        remainingUsefulLife: rul,
        replacementDueYear: dueYear,
        isAtRiskNow: isAtRisk,
        unitCost,
        totalCost: unitCost * item.quantity,
        urgencyStatus: isAtRisk ? ('AT_RISK_NOW' as const) : ('MEDIUM_4_7_YRS' as const),
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      };
    });

    const reportData: CapexReportData = {
      siteName,
      organisationName: 'Estate Duty Holder',
      summary,
      allAssets: allCalculated,
      whyThisWorksText: whyItWorksText || undefined,
      whyThisWorksSource: whyItWorksSource || undefined,
    };

    downloadCapexPack(reportData, `EntireFM-CAPEX-Appraisal-${siteName.replace(/\s+/g, '-')}.pdf`);
  };

  // Max spend across 10 years for chart scaling
  const maxBarSpend = Math.max(1, ...summary.forecastYears.map((y) => y.totalSpend));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />

      <div className="py-8 sm:py-12">
        <ToolShell
          title="Asset Lifecycle & CAPEX Replacement Planner"
          eyebrow="10-Year Rolling Capital Forecast"
          purpose="Model commercial plant lifespans, uncover at-risk plant operating beyond useful life, and forecast rolling capital replacement expenditure across your commercial estate."
          timeEstimate="3 mins"
          outputs={['10-Year Capital Forecast', 'PDF Appraisal Pack']}
          breadcrumbs={breadcrumbs}
        >
          {/* Top Controls: Presets, Site Profiles, Regional Index */}
          <div className="bg-white border border-slate-200 rounded-sm p-5 sm:p-6 shadow-xs space-y-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wider">
                  01 / Estate Configuration &amp; Presets
                </span>
                <h2 className="text-base sm:text-lg font-light text-slate-900 mt-0.5">
                  Select Facility Scope &amp; Cost Index
                </h2>
              </div>

              {/* Presets Button Group */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-light mr-1">Load Preset:</span>
                <button
                  type="button"
                  onClick={() => setItems(PRESET_OFFICE_HQ)}
                  className="px-2.5 py-1 text-xs font-normal text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors"
                >
                  Commercial Office
                </button>
                <button
                  type="button"
                  onClick={() => setItems(PRESET_LOGISTICS_HUB)}
                  className="px-2.5 py-1 text-xs font-normal text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors"
                >
                  Logistics Depot
                </button>
                <button
                  type="button"
                  onClick={() => setItems(PRESET_AGED_FACILITY)}
                  className="px-2.5 py-1 text-xs font-normal text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-sm transition-colors"
                >
                  Aging Plant
                </button>
                <button
                  type="button"
                  onClick={() => setItems(PRESET_OFFICE_HQ)}
                  className="p-1 text-slate-400 hover:text-slate-600 ml-1"
                  title="Reset to default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inputs: Site Name, Profile Selector, Regional Multiplier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Facility / Estate Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. St Pauls Plaza HQ"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Site Profile (Workspace Integration) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Linked Site Profile</span>
                  {siteProfiles.length > 0 && (
                    <span className="text-[10px] text-emerald-600 font-medium">Workspace Active</span>
                  )}
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => handleSelectProfile(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                >
                  <option value="">-- Manual Estate Entry --</option>
                  {siteProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.building_type || 'Commercial'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Regional Cost Index */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Regional Cost Index</span>
                  {CAPEX_REGIONS[regionKey]?.badge && (
                    <span className="text-[10px] text-blue-600 font-medium">
                      {CAPEX_REGIONS[regionKey].badge}
                    </span>
                  )}
                </label>
                <select
                  value={regionKey}
                  onChange={(e) => setRegionKey(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                >
                  {Object.entries(CAPEX_REGIONS).map(([key, reg]) => (
                    <option key={key} value={key}>
                      {reg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4 Key Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-[#0B1220] text-white p-4 sm:p-5 rounded-sm relative overflow-hidden shadow-xs">
              <span className="text-[10.5px] uppercase tracking-wider text-slate-300 font-medium block">
                Total 10-Yr CAPEX
              </span>
              <p className="text-2xl sm:text-3xl font-light text-sky-400 mt-1 tabular-nums">
                £{summary.totalTenYearCapex.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400 block mt-1">
                {summary.horizonStartYear} – {summary.horizonEndYear} projected spend
              </span>
            </div>

            <div
              className={`p-4 sm:p-5 rounded-sm border shadow-xs ${
                summary.immediateAtRiskCapital > 0
                  ? 'bg-red-50/70 border-red-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10.5px] uppercase tracking-wider font-medium ${
                    summary.immediateAtRiskCapital > 0 ? 'text-red-800' : 'text-slate-500'
                  }`}
                >
                  At-Risk Capital Now
                </span>
                {summary.immediateAtRiskCapital > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                )}
              </div>
              <p
                className={`text-2xl sm:text-3xl font-light mt-1 tabular-nums ${
                  summary.immediateAtRiskCapital > 0 ? 'text-red-700 font-normal' : 'text-slate-900'
                }`}
              >
                £{summary.immediateAtRiskCapital.toLocaleString()}
              </p>
              <span
                className={`text-[10px] block mt-1 ${
                  summary.immediateAtRiskCapital > 0 ? 'text-red-600 font-medium' : 'text-slate-400'
                }`}
              >
                {summary.immediateAtRiskCount} plant items past expected life
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-sm shadow-xs">
              <span className="text-[10.5px] uppercase tracking-wider text-slate-500 font-medium block">
                Average Equipment Age
              </span>
              <p className="text-2xl sm:text-3xl font-light text-slate-900 mt-1 tabular-nums">
                {summary.averageAssetAge} <span className="text-sm font-normal text-slate-500">years</span>
              </p>
              <span className="text-[10px] text-slate-400 block mt-1">
                Oldest asset in estate: {summary.oldestAssetAge} yrs
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-sm shadow-xs">
              <span className="text-[10.5px] uppercase tracking-wider text-slate-500 font-medium block">
                Peak Renewal Year
              </span>
              <p className="text-2xl sm:text-3xl font-light text-blue-600 mt-1 tabular-nums">
                {
                  summary.forecastYears.reduce(
                    (max, y) => (y.totalSpend > max.totalSpend ? y : max),
                    summary.forecastYears[0]
                  )?.year || summary.horizonStartYear
                }
              </p>
              <span className="text-[10px] text-slate-400 block mt-1">
                Largest single replacement cycle
              </span>
            </div>
          </div>

          {/* MAIN GRID: Left = Asset Inventory Inputs, Right = Interactive Outputs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Repeatable Asset Inventory List (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-sm p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wider">
                      02 / Major Plant Inventory
                    </span>
                    <h3 className="text-base font-light text-slate-900 mt-0.5">
                      Asset Category, Age &amp; Condition
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-sm transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Plant Item
                  </button>
                </div>

                {/* Repeatable Items List */}
                <div className="space-y-3.5">
                  {items.map((item, idx) => {
                    const assetDef = getCapexAssetById(item.assetId);
                    const age = currentYear - item.installYear;
                    const conditionFactor =
                      item.condition === 'Good' ? 1.1 : item.condition === 'Poor' ? 0.8 : 1.0;
                    const adjustedLifespan = Math.round((assetDef?.nominalYears || 15) * conditionFactor);
                    const rul = adjustedLifespan - age;
                    const isAtRisk = rul <= 0;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-sm border transition-all ${
                          isAtRisk
                            ? 'border-red-300 bg-red-50/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {/* Row Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                              <input
                                type="text"
                                value={item.customName || ''}
                                onChange={(e) => handleUpdateItem(item.id, { customName: e.target.value })}
                                placeholder={assetDef?.name || 'Enter custom plant identifier'}
                                className="text-xs sm:text-sm font-medium text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none w-full max-w-sm bg-transparent"
                              />
                            </div>
                            <p className="text-[11px] text-slate-500 font-light truncate mt-0.5">
                              {assetDef?.shortDescription}
                            </p>
                          </div>

                          {/* RUL Pill */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[10.5px] px-2 py-0.5 rounded-sm font-medium ${
                                isAtRisk
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : rul <= 3
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {isAtRisk
                                ? `At Risk (${Math.abs(rul)} yrs overdue)`
                                : `RUL: ${rul} yr${rul > 1 ? 's' : ''}`}
                            </span>

                            {/* Actions */}
                            <button
                              type="button"
                              onClick={() => handleDuplicateItem(item)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded-sm transition-colors"
                              title="Duplicate plant item"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              disabled={items.length <= 1}
                              className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 rounded-sm transition-colors"
                              title="Delete plant item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Row Controls Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                          {/* Asset Category / Type */}
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1">
                              Asset Type
                            </label>
                            <select
                              value={item.assetId}
                              onChange={(e) => handleUpdateItem(item.id, { assetId: e.target.value })}
                              className="w-full text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                            >
                              {CAPEX_ASSET_CATEGORIES.map((cat) => (
                                <optgroup key={cat.id} label={cat.name}>
                                  {cat.assets.map((a) => (
                                    <option key={a.id} value={a.id}>
                                      {a.name}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>

                          {/* Install Year */}
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1">
                              Installed Year ({age} yrs)
                            </label>
                            <input
                              type="number"
                              min={1970}
                              max={currentYear}
                              value={item.installYear}
                              onChange={(e) =>
                                handleUpdateItem(item.id, {
                                  installYear: parseInt(e.target.value, 10) || currentYear,
                                })
                              }
                              className="w-full text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Condition (Good / Fair / Poor) */}
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1">
                              Condition
                            </label>
                            <div className="flex rounded-sm overflow-hidden border border-slate-200">
                              {(['Good', 'Fair', 'Poor'] as AssetCondition[]).map((cond) => (
                                <button
                                  key={cond}
                                  type="button"
                                  onClick={() => handleUpdateItem(item.id, { condition: cond })}
                                  className={`flex-1 py-1 text-[10px] font-medium transition-colors ${
                                    item.condition === cond
                                      ? cond === 'Good'
                                        ? 'bg-emerald-600 text-white'
                                        : cond === 'Fair'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-red-600 text-white'
                                      : 'bg-white text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {cond}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Quantity & Unit Cost */}
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1">
                              Qty &amp; Unit Cost
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={1}
                                max={500}
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateItem(item.id, {
                                    quantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                                  })
                                }
                                className="w-12 text-xs px-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-800 text-center"
                                title="Quantity"
                              />
                              <span className="text-[11px] font-medium text-slate-700 tabular-nums">
                                £
                                {Math.round(
                                  (item.costOverride || assetDef?.defaultCost || 10000) *
                                    summary.regionalMultiplier
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Row Button at bottom */}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2.5 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-sm text-xs font-medium text-slate-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Another Commercial Plant Item
                </button>
              </div>

              {/* "Why Lifecycle Planning Matters" AI Commentary Card */}
              <div className="bg-white border border-slate-200 rounded-sm p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Why Strategic Lifecycle Planning Matters
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-light px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                    {whyItWorksSource === 'GROUNDED_GEMINI_CLAUDE'
                      ? 'Grounded UK FM Evidence'
                      : whyItWorksSource === 'CACHE_HIT'
                      ? 'Verified UK Benchmark'
                      : 'Commercial FM Baseline'}
                  </span>
                </div>

                {whyItWorksLoading ? (
                  <div className="py-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                    <span>Loading operational engineering context...</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-light">
                      {whyItWorksText}
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400">
                      <span>EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.</span>
                      <span>100% Non-Numeric Guidance</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Statutory Legal Planning Disclaimer */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-sm p-4 text-[11px] text-amber-900 leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-amber-950 uppercase tracking-wider text-[10px]">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Planning Disclaimer &amp; Benchmark Methodology</span>
                </div>
                <p className="font-light">
                  This capital expenditure planner provides an indicative lifecycle model based on generalised UK commercial plant service lives and user-declared asset condition. It is designed for forward budgeting and strategic prioritisation only. It does not constitute a physical structural survey, invasive M&amp;E inspection, or fixed-price quotation. A formal capital expenditure schedule requires an on-site technical condition assessment by a qualified engineer.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive 10-Year Rolling Capital Forecast (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              {/* 10-Year Capital Forecast Visualiser */}
              <div className="bg-white border border-slate-200 rounded-sm shadow-md p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      03 / 10-Year Capital Trajectory
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                      Rolling Forecast ({summary.horizonStartYear} – {summary.horizonEndYear})
                    </h3>
                  </div>
                  <span className="text-[10.5px] text-slate-500">
                    {summary.totalAssetUnits} items modelled
                  </span>
                </div>

                {/* SVG Vector Bar Chart */}
                <div className="space-y-2">
                  <div className="h-44 flex items-end justify-between gap-1 sm:gap-1.5 pt-6 pb-2 border-b border-slate-200">
                    {summary.forecastYears.map((y, idx) => {
                      const heightPercent =
                        maxBarSpend > 0 ? Math.max(4, Math.round((y.totalSpend / maxBarSpend) * 100)) : 4;
                      const isOverdueYear = idx === 0 && summary.immediateAtRiskCapital > 0;
                      const isSelected = selectedChartYear === y.year;

                      return (
                        <div
                          key={y.year}
                          onClick={() =>
                            setSelectedChartYear(selectedChartYear === y.year ? null : y.year)
                          }
                          className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                          title={`${y.year}: £${y.totalSpend.toLocaleString()} (${y.assetCount} items)`}
                        >
                          {/* Spend label on top */}
                          <span
                            className={`text-[8.5px] font-mono leading-none mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                              isOverdueYear ? 'text-red-700 font-semibold' : 'text-slate-700'
                            }`}
                          >
                            {y.totalSpend > 0 ? `£${Math.round(y.totalSpend / 1000)}k` : '£0'}
                          </span>

                          {/* Bar */}
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t-xs transition-all ${
                              isSelected
                                ? 'bg-blue-800'
                                : isOverdueYear
                                ? 'bg-red-600 hover:bg-red-700'
                                : y.totalSpend > 0
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-slate-200'
                            }`}
                          />

                          {/* Year label underneath */}
                          <span className="text-[9.5px] font-medium text-slate-600 mt-1.5">
                            {y.year.toString().slice(-2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart Legend */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-red-600 rounded-xs inline-block" />
                      Immediate Backlog / Yr 1
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-xs inline-block" />
                      Forward CAPEX
                    </span>
                    <span className="text-slate-400">Click bar to filter</span>
                  </div>
                </div>

                {/* Selected Year or Immediate Priority Detail Box */}
                {selectedChartYear ? (
                  <div className="bg-blue-50/60 border border-blue-200 rounded-sm p-3.5 text-xs space-y-2">
                    <div className="flex items-center justify-between font-medium text-blue-900">
                      <span>{selectedChartYear} Capital Schedule</span>
                      <button
                        type="button"
                        onClick={() => setSelectedChartYear(null)}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        Clear Filter
                      </button>
                    </div>
                    {summary.forecastYears.find((y) => y.year === selectedChartYear)?.assets.length ? (
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {summary.forecastYears
                          .find((y) => y.year === selectedChartYear)
                          ?.assets.map((a, i) => (
                            <li key={i} className="flex justify-between items-center">
                              <span>
                                {a.displayName} (x{a.quantity})
                              </span>
                              <span className="font-semibold text-slate-900">
                                £{a.totalCost.toLocaleString()}
                              </span>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-slate-500">No scheduled major plant renewals in this year.</p>
                    )}
                  </div>
                ) : summary.immediateAtRiskCapital > 0 ? (
                  <div className="bg-red-50 border border-red-200 rounded-sm p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-red-900">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        Urgent Backlog: Assets Past Useful Life
                      </span>
                      <span className="text-[10.5px] text-red-700 tabular-nums">
                        £{summary.immediateAtRiskCapital.toLocaleString()}
                      </span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-red-800 font-light">
                      {summary.atRiskAssets.slice(0, 3).map((a, i) => (
                        <li key={i} className="flex justify-between items-center">
                          <span className="truncate pr-2">{a.displayName}</span>
                          <span className="font-medium shrink-0">
                            {Math.abs(a.remainingUsefulLife)} yrs overdue
                          </span>
                        </li>
                      ))}
                      {summary.atRiskAssets.length > 3 && (
                        <li className="text-[10px] text-red-600 font-medium">
                          + {summary.atRiskAssets.length - 3} more overdue plant items
                        </li>
                      )}
                    </ul>
                  </div>
                ) : null}

                {/* Tabular Spend by Category */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <span className="text-[10.5px] font-semibold text-slate-900 uppercase tracking-wider block">
                    10-Year Spend by Asset Discipline
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {summary.categorySpendBreakdown.map((cat) => (
                      <div key={cat.categoryId} className="flex items-center justify-between text-[11.5px]">
                        <span className="text-slate-600 truncate pr-2">{cat.categoryName}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-slate-400 font-mono text-[10.5px]">
                            {cat.percentOfTotal}%
                          </span>
                          <span className="font-medium text-slate-900 tabular-nums">
                            £{cat.totalSpend.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: PDF Download, CSV Export, Save to Workspace */}
                <div className="border-t border-slate-100 pt-5 space-y-2.5">
                  {/* Primary PDF Download Trigger */}
                  <button
                    type="button"
                    onClick={() => setGateOpen(true)}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm rounded-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full 10-Yr Capital Appraisal (PDF)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Free Ungated CSV Export */}
                    <button
                      type="button"
                      onClick={handleDownloadCsv}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Export CSV Data</span>
                    </button>

                    {/* Reusable SaveToWorkspaceButton with Site Profile support */}
                    <SaveToWorkspaceButton
                      toolName="capex-planner"
                      defaultTitle={`CAPEX Plan: ${siteName}`}
                      inputsJson={{
                        siteName,
                        regionKey,
                        items,
                      }}
                      outputsJson={{
                        summary,
                      }}
                      summaryKpis={{
                        totalTenYearCapex: summary.totalTenYearCapex,
                        immediateAtRiskCapital: summary.immediateAtRiskCapital,
                        immediateAtRiskCount: summary.immediateAtRiskCount,
                        averageAssetAge: summary.averageAssetAge,
                      }}
                      className="w-full text-xs font-medium"
                      buttonText="Save to Workspace"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Conversion CTA for Capital Appraisals */}
          <ToolConversionCTA
            toolName="Asset Lifecycle & CAPEX Planner"
            heading="Planning plant replacements or major capital tenders?"
            subheading="EntireFM provides comprehensive on-site M&E plant condition surveys, thermal imaging, asset tagging, and turnkey capital project management nationwide."
            primaryActionLabel="Request Capital Plant Survey"
            primaryActionHref="/contact-us#enquiry"
          />
        </ToolShell>
      </div>

      {/* Turnstile-Protected Lead Gate Modal (High-Intent Capital Replacement Lead) */}
      <ToolPdfGateModal
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onSuccess={handleExecutePdfDownload}
        toolTitle="Asset Lifecycle & CAPEX Appraisal"
        annualSavingFormatted={`£${summary.immediateAtRiskCapital.toLocaleString()} at-risk capital`}
        leadSource="CAPEX_PLANNER_HIGH_INTENT"
        conversionPage="/tools/capex-planner"
        contextPayload={{
          siteName,
          regionName: summary.regionName,
          regionalMultiplier: summary.regionalMultiplier,
          totalTenYearCapex: summary.totalTenYearCapex,
          immediateAtRiskCapital: summary.immediateAtRiskCapital,
          immediateAtRiskCount: summary.immediateAtRiskCount,
          totalAssetsCount: summary.totalAssetsCount,
          averageAssetAge: summary.averageAssetAge,
          itemCount: items.length,
        }}
        showCallbackPreference={true}
      />

      <Footer />
    </div>
  );
}
