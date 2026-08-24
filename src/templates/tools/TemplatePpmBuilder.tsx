'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Search,
  Check,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Wind,
  Flame,
  Zap,
  Droplets,
  Layers,
  Shield,
  Home,
  Trees,
  List,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { WizardProgress } from '@/components/tools/WizardProgress';
import { ComplianceBadge } from '@/components/tools/ComplianceBadge';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import {
  COMMERCIAL_ASSET_CATEGORIES,
  CommercialAssetDefinition,
  getAllAssetDefinitions,
  getAssetById,
} from '@/lib/tools/asset-taxonomy';
import { generateCsv, downloadCsvFile } from '@/lib/exports/csv-exporter';
import { downloadPdfReport, PdfDocumentDefinition } from '@/lib/pdf/generator';
import type { TemplateProps } from '../types';

export interface ConfiguredAssetItem {
  assetId: string;
  quantity: number;
  ageBand: '0-3 years' | '4-7 years' | '8-15 years' | '15+ years';
  condition: 'Excellent' | 'Good' | 'Fair / Wear' | 'Poor / Immediate Attention';
  criticality: 'Standard' | 'High / Business Critical';
}

const WIZARD_STEPS = [
  { id: 1, title: '01 Profile', subtitle: 'Building Details' },
  { id: 2, title: '02 Categories', subtitle: 'Disciplines' },
  { id: 3, title: '03 Assets', subtitle: 'Asset Selection' },
  { id: 4, title: '04 Configure', subtitle: 'Quantities & Age' },
  { id: 5, title: '05 Review', subtitle: 'Estate Summary' },
  { id: 6, title: '06 Programme', subtitle: 'Generated PPM' },
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  hvac: Wind,
  fire: Flame,
  electrical: Zap,
  water: Droplets,
  vertical: Layers,
  security: Shield,
  fabric: Home,
  grounds: Trees,
};

export function TemplatePpmBuilder({ route, content }: TemplateProps) {
  // Step State (0 to 5)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // STEP 1: Building Profile
  const [buildingName, setBuildingName] = useState('');
  const [buildingType, setBuildingType] = useState('Commercial Office / Corporate HQ');
  const [floorArea, setFloorArea] = useState('45,000 sq ft');
  const [occupancyProfile, setOccupancyProfile] = useState('Standard Business Hours (07:00–19:00)');
  const [numberOfFloors, setNumberOfFloors] = useState('5 Floors');
  const [siteCriticality, setSiteCriticality] = useState<'Standard Commercial' | 'Critical / Regulated' | 'High Public Footfall'>('Standard Commercial');

  // STEP 2: Selected Categories
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    new Set(['hvac', 'fire', 'electrical', 'water'])
  );

  // STEP 3: Selected Assets Map (assetId -> quantity)
  const [selectedAssets, setSelectedAssets] = useState<Record<string, number>>({
    'hvac-ahu': 4,
    'hvac-fcu': 22,
    'fire-alarm': 1,
    'fire-emergency-light': 35,
    'elec-eicr': 1,
    'water-lra': 1,
    'water-monitoring': 1,
  });

  // Search & Filter in Step 3
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [activeAssetCatTab, setActiveAssetCatTab] = useState<string>('ALL');

  // STEP 4: Configuration Map (assetId -> Config details)
  const [assetConfigs, setAssetConfigs] = useState<Record<string, ConfiguredAssetItem>>({});

  // STEP 5 / 6 Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');

  // STEP 6: Programme Filter & View State
  const [programmeViewMode, setProgrammeViewMode] = useState<'matrix' | 'annual'>('matrix');
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'PPM Schedule Builder', url: '/tools/ppm-schedule-builder' },
  ];

  // Helper functions for Category Selection
  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const addAsset = (asset: CommercialAssetDefinition) => {
    setSelectedAssets((prev) => ({
      ...prev,
      [asset.id]: asset.defaultQuantity || 1,
    }));
  };

  const removeAsset = (assetId: string) => {
    setSelectedAssets((prev) => {
      const next = { ...prev };
      delete next[assetId];
      return next;
    });
  };

  const updateAssetQuantity = (assetId: string, delta: number) => {
    setSelectedAssets((prev) => {
      const current = prev[assetId] || 1;
      const nextQty = Math.max(1, current + delta);
      return { ...prev, [assetId]: nextQty };
    });
  };

  const setExactAssetQuantity = (assetId: string, qty: number) => {
    setSelectedAssets((prev) => ({
      ...prev,
      [assetId]: Math.max(1, qty),
    }));
  };

  // Filtered Categories based on Step 2 selection
  const activeCategories = useMemo(() => {
    return COMMERCIAL_ASSET_CATEGORIES.filter((c) => selectedCategoryIds.has(c.id));
  }, [selectedCategoryIds]);

  // Selected Asset Objects List
  const selectedAssetList = useMemo(() => {
    return Object.keys(selectedAssets)
      .map((id) => {
        const def = getAssetById(id);
        if (!def) return null;
        return {
          definition: def,
          quantity: selectedAssets[id],
        };
      })
      .filter(Boolean) as { definition: CommercialAssetDefinition; quantity: number }[];
  }, [selectedAssets]);

  // Total physical asset count
  const totalPhysicalAssetCount = useMemo(() => {
    return Object.values(selectedAssets).reduce((sum, q) => sum + q, 0);
  }, [selectedAssets]);

  // Programme Tasks (STRICTLY ONLY FROM SELECTED ASSETS)
  const programmeTasks = useMemo(() => {
    const list: {
      asset: CommercialAssetDefinition;
      quantity: number;
      task: CommercialAssetDefinition['tasks'][0];
    }[] = [];

    selectedAssetList.forEach(({ definition, quantity }) => {
      definition.tasks.forEach((task) => {
        list.push({
          asset: definition,
          quantity,
          task,
        });
      });
    });

    return list;
  }, [selectedAssetList]);

  // Programme Statistics
  const stats = useMemo(() => {
    const totalActivities = programmeTasks.length;
    const legalCount = programmeTasks.filter((t) => t.task.classification === 'LEGAL_STATUTORY_DUTY').length;
    const standardCount = programmeTasks.filter((t) => t.task.classification === 'BRITISH_INDUSTRY_STANDARD').length;
    const sfg20Count = programmeTasks.filter(
      (t) =>
        t.task.classification === 'SFG20_PLANNED_PRACTICE' ||
        t.task.classification === 'MANUFACTURER_REQUIREMENT' ||
        t.task.classification === 'RISK_BASED_SITE_SPECIFIC' ||
        t.task.classification === 'INDUSTRY_BEST_PRACTICE'
    ).length;

    return { totalActivities, legalCount, standardCount, sfg20Count };
  }, [programmeTasks]);

  // Filtered Programme Tasks for Matrix View
  const filteredTasks = useMemo(() => {
    return programmeTasks.filter(({ asset, task }) => {
      if (tableSearchQuery.trim()) {
        const q = tableSearchQuery.toLowerCase();
        const match =
          asset.name.toLowerCase().includes(q) ||
          asset.categoryName.toLowerCase().includes(q) ||
          task.activity.toLowerCase().includes(q) ||
          task.governingBasis.toLowerCase().includes(q) ||
          task.statutoryReference.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [programmeTasks, tableSearchQuery]);

  // Generate event handler with professional transition
  const handleGenerateProgramme = () => {
    setIsGenerating(true);
    setGenerationStage('Processing selected building assets…');

    setTimeout(() => {
      setGenerationStage('Applying statutory & SFG20 maintenance regimes…');
    }, 400);

    setTimeout(() => {
      setGenerationStage('Distributing 12-month maintenance timetable…');
    }, 800);

    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(5); // Go to Step 6 (Programme)
    }, 1200);
  };

  // CSV Export Handler
  const handleDownloadCsv = () => {
    const csvContent = generateCsv(programmeTasks, [
      { header: 'Discipline', accessor: (d) => d.asset.categoryName },
      { header: 'Asset Name', accessor: (d) => d.asset.name },
      { header: 'Asset Quantity', accessor: (d) => d.quantity },
      { header: 'Maintenance Activity', accessor: (d) => d.task.activity },
      { header: 'Frequency', accessor: (d) => d.task.frequency },
      { header: 'Scheduled Months', accessor: (d) => d.task.frequencyMonths.map((m) => MONTH_NAMES[m - 1]).join(', ') },
      { header: 'Compliance Classification', accessor: (d) => d.task.classification },
      { header: 'Governing Standard / Basis', accessor: (d) => d.task.governingBasis },
      { header: 'Statutory Reference', accessor: (d) => d.task.statutoryReference },
      { header: 'Competency Required', accessor: (d) => d.task.recommendedCompetency },
      { header: 'Expected Evidence', accessor: (d) => d.task.evidenceExpected },
    ]);
    const filename = `EntireFM_PPM_Programme_${(buildingName || 'Estate').replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    downloadCsvFile(csvContent, filename);
  };

  // PDF Export Handler
  const handleDownloadPdf = () => {
    const pdfDoc: PdfDocumentDefinition = {
      title: 'Planned Preventative Maintenance (PPM) Programme',
      subtitle: `Bespoke statutory and planned maintenance specification for ${buildingName || 'Commercial Estate'}.`,
      documentRef: `EFM-PPM-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      organisationName: buildingName || 'Commercial Building',
      badgeText: 'Technical PPM Specification',
      summaryStats: [
        { label: 'Building Type', value: buildingType },
        { label: 'Floor Area', value: floorArea || 'Unspecified' },
        { label: 'Asset Types', value: `${selectedAssetList.length} Types`, detail: `${totalPhysicalAssetCount} Physical Assets` },
        { label: 'Planned Tasks', value: `${programmeTasks.length} Regimes`, detail: `${stats.legalCount} Legal Duties` },
      ],
      sections: [
        {
          type: 'cards',
          heading: '1. Executive Estate & Compliance Summary',
          items: [
            {
              title: 'Estate Specification & Occupancy',
              body: `Property Profile: ${buildingType} | Area: ${floorArea} | Floors: ${numberOfFloors} | Hours: ${occupancyProfile} | Criticality: ${siteCriticality}`,
            },
            {
              title: 'Statutory Duty Profile',
              body: `The programme includes ${stats.legalCount} statutory legal obligations, ${stats.standardCount} British Standard protocols, and ${stats.sfg20Count} planned preventative maintenance tasks.`,
            },
          ],
        },
        {
          type: 'table',
          heading: '2. Selected Asset Inventory',
          columns: [
            { header: 'Discipline', widthPercent: 25 },
            { header: 'Installed Asset System', widthPercent: 55 },
            { header: 'Quantity', widthPercent: 20, align: 'center' },
          ],
          rows: selectedAssetList.map(({ definition, quantity }) => [
            definition.categoryName,
            definition.name,
            definition.supportsQuantity === false ? 'Whole Building' : `${quantity} Units`,
          ]),
        },
        {
          type: 'table',
          heading: '3. Full PPM Maintenance Matrix & Legal Basis',
          columns: [
            { header: 'Asset / Discipline', widthPercent: 22 },
            { header: 'Maintenance Activity & Guidance', widthPercent: 46 },
            { header: 'Freq.', widthPercent: 12, align: 'center' },
            { header: 'Classification & Legal Basis', widthPercent: 20 },
          ],
          rows: programmeTasks.map(({ asset, task, quantity }) => [
            `<strong>${asset.name}</strong><br><span style="color:#64748B;font-size:9px;">${quantity > 1 ? `${quantity}x ` : ''}${asset.categoryName}</span>`,
            `${task.activity}<br><span style="color:#FF3E9D;font-size:9px;font-family:monospace;">${task.governingBasis}</span>`,
            task.frequency,
            `<span style="font-weight:700;font-size:9px;">${task.classification.replace(/_/g, ' ')}</span><br><span style="color:#64748B;font-size:8.5px;">${task.statutoryReference}</span>`,
          ]),
        },
        {
          type: 'table',
          heading: '4. 12-Month Maintenance Schedule Distribution',
          columns: [
            { header: 'Month', widthPercent: 15 },
            { header: 'Scheduled Maintenance Activities', widthPercent: 85 },
          ],
          rows: MONTH_NAMES.map((mName, mIdx) => {
            const mNum = mIdx + 1;
            const monthTasks = programmeTasks.filter((t) => t.task.frequencyMonths.includes(mNum));
            return [
              `<strong>${mName} 2026</strong>`,
              monthTasks.length > 0
                ? monthTasks.map((t) => `• ${t.asset.name}: ${t.task.activity} (${t.task.frequency})`).join('<br>')
                : 'No major periodic overhauls scheduled.',
            ];
          }),
        },
      ],
    };
    downloadPdfReport(pdfDoc);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Header />
      <main id="main" className="flex-grow pt-20">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="PPM Schedule Builder"
          purpose="Select the plant and systems installed at the property to build an indicative maintenance programme."
          timeEstimate="5 min"
          outputs={['PDF Programme', 'CSV Matrix']}
        >
          {/* Architectural Horizontal Stepper */}
          <WizardProgress
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            onSelectStep={(idx) => {
              if (idx <= currentStep || (idx === 5 && currentStep === 4)) {
                setCurrentStep(idx);
              }
            }}
          />

          {/* ========================================================================= */}
          {/* STEP 1: BUILDING PROFILE (72% WORK AREA / 28% CONTEXT PANEL) */}
          {/* ========================================================================= */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* 72% Main Work Area */}
              <div className="lg:col-span-8 space-y-8">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                    01 / Building Profile
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">
                    Tell us about the property
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    We will use this information to tailor the maintenance programme to the operating environment of your estate.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-200">
                        Site / Building Name
                      </label>
                      <span className="text-[11px] text-slate-400">Optional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Apex Plaza HQ"
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-[#0c1527] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-200">
                        Building Type
                      </label>
                      <span className="text-[11px] text-slate-400">Required</span>
                    </div>
                    <select
                      value={buildingType}
                      onChange={(e) => setBuildingType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-[#0c1527] border border-slate-700 text-sm text-white focus:outline-none focus:border-slate-400 transition-colors"
                    >
                      <option value="Commercial Office / Corporate HQ">Commercial Office / Corporate HQ</option>
                      <option value="Industrial & Manufacturing Facility">Industrial &amp; Manufacturing Facility</option>
                      <option value="Logistics & Distribution Warehousing">Logistics &amp; Distribution Warehousing</option>
                      <option value="Retail & Shopping Centre">Retail &amp; Shopping Centre</option>
                      <option value="Healthcare & Clinical Environment">Healthcare &amp; Clinical Environment</option>
                      <option value="Hotels & Hospitality Estate">Hotels &amp; Hospitality Estate</option>
                      <option value="Education & University Campus">Education &amp; University Campus</option>
                      <option value="Residential Block / Build-to-Rent">Residential Block / Build-to-Rent</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-200">
                        Approximate Floor Area
                      </label>
                      <span className="text-[11px] text-slate-400">Optional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 45,000 sq ft"
                      value={floorArea}
                      onChange={(e) => setFloorArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-[#0c1527] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-200">
                        Operating Hours Profile
                      </label>
                      <span className="text-[11px] text-slate-400">Required</span>
                    </div>
                    <select
                      value={occupancyProfile}
                      onChange={(e) => setOccupancyProfile(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-[#0c1527] border border-slate-700 text-sm text-white focus:outline-none focus:border-slate-400 transition-colors"
                    >
                      <option value="Standard Business Hours (07:00–19:00)">Standard Business Hours (07:00–19:00)</option>
                      <option value="Extended Operations (06:00–22:00)">Extended Operations (06:00–22:00)</option>
                      <option value="24/7 Continuous Mission Critical">24/7 Continuous Mission Critical</option>
                      <option value="High Public Footfall / Weekend Operation">High Public Footfall / Weekend Operation</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-200">
                        Number of Storeys
                      </label>
                      <span className="text-[11px] text-slate-400">Optional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 5 Floors + Plant Room"
                      value={numberOfFloors}
                      onChange={(e) => setNumberOfFloors(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-[#0c1527] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-200">
                        Site Governance Criticality
                      </label>
                      <span className="text-[11px] text-slate-400">Required</span>
                    </div>
                    <select
                      value={siteCriticality}
                      onChange={(e) => setSiteCriticality(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-[#0c1527] border border-slate-700 text-sm text-white focus:outline-none focus:border-slate-400 transition-colors"
                    >
                      <option value="Standard Commercial">Standard Commercial Governance</option>
                      <option value="Critical / Regulated">Mission Critical / Highly Regulated</option>
                      <option value="High Public Footfall">High Public Footfall Risk</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    Step 1 of 6
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-[3px] bg-[#0c1527] hover:bg-[#111e38] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 hover:border-slate-500 transition-colors"
                  >
                    <span>Select Building Disciplines</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF3E9D]" />
                  </button>
                </div>
              </div>

              {/* 28% Context Panel */}
              <aside className="lg:col-span-4 border-l border-slate-800 pl-0 lg:pl-8 space-y-6 pt-4 lg:pt-0 text-xs">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Building Profile Guidance
                  </h3>
                  <p className="text-slate-400 mt-1.5 leading-relaxed">
                    Plant operating hours and building occupancy directly influence service intervals and SFG20 maintenance frequencies.
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div>
                    <span className="font-semibold text-slate-200 block">Baseline Assumptions</span>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      Standard UK commercial terms, typical SFG20 task frequencies, and statutory duty discharge standards.
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">Data Privacy</span>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      Your estate specifications remain strictly in this browser session unless explicitly exported.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: DISCIPLINE SELECTION (REFINED SELECTION ROWS) */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-8 space-y-8">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                    02 / Discipline Scope
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">
                    Which systems are installed?
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    Select all engineering disciplines present on your estate to unlock the relevant asset registers.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {COMMERCIAL_ASSET_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategoryIds.has(cat.id);
                    const IconComponent = CATEGORY_ICONS[cat.id] || Wrench;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-4 border rounded-[3px] cursor-pointer transition-colors flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-slate-600 bg-[#0c1527]'
                            : 'border-slate-800/80 bg-[#080e1c] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#FF3E9D]' : 'text-slate-500'}`} />
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-white block truncate">{cat.name}</span>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{cat.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                            {cat.assets.length} assets
                          </span>
                          <div
                            className={`w-4 h-4 rounded-[2px] flex items-center justify-center border ${
                              isSelected
                                ? 'bg-slate-700 border-slate-500 text-white'
                                : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={selectedCategoryIds.size === 0}
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[3px] bg-[#0c1527] hover:bg-[#111e38] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 hover:border-slate-500 transition-colors disabled:opacity-40"
                  >
                    <span>Choose Assets ({selectedCategoryIds.size} Selected)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF3E9D]" />
                  </button>
                </div>
              </div>

              <aside className="lg:col-span-4 border-l border-slate-800 pl-0 lg:pl-8 space-y-6 pt-4 lg:pt-0 text-xs">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Discipline Filtering
                  </h3>
                  <p className="text-slate-400 mt-1.5 leading-relaxed">
                    Selecting disciplines filters the asset catalogue on the following step. No maintenance tasks are generated until specific assets are added.
                  </p>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: ASSET SELECTION (70% ASSET ROWS / 30% STICKY SUMMARY) */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* 70% Asset Library Work Area */}
              <div className="lg:col-span-8 space-y-6">
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                      03 / Asset Selection
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Select Installed Assets
                    </h2>
                  </div>

                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Filter 44 assets…"
                      value={assetSearchQuery}
                      onChange={(e) => setAssetSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-[3px] bg-[#0c1527] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs scrollbar-thin">
                  <button
                    type="button"
                    onClick={() => setActiveAssetCatTab('ALL')}
                    className={`px-3 py-1 font-semibold whitespace-nowrap border-b-2 transition-colors ${
                      activeAssetCatTab === 'ALL'
                        ? 'border-[#FF3E9D] text-white'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({activeCategories.length})
                  </button>
                  {activeCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveAssetCatTab(cat.id)}
                      className={`px-3 py-1 font-semibold whitespace-nowrap border-b-2 transition-colors ${
                        activeAssetCatTab === cat.id
                          ? 'border-[#FF3E9D] text-white'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Asset Library List by Category */}
                <div className="space-y-6">
                  {activeCategories
                    .filter((cat) => activeAssetCatTab === 'ALL' || activeAssetCatTab === cat.id)
                    .map((cat) => {
                      const matchingAssets = cat.assets.filter((asset) => {
                        if (!assetSearchQuery.trim()) return true;
                        const q = assetSearchQuery.toLowerCase();
                        return (
                          asset.name.toLowerCase().includes(q) ||
                          asset.shortDescription.toLowerCase().includes(q)
                        );
                      });

                      if (matchingAssets.length === 0) return null;

                      return (
                        <div key={cat.id} className="space-y-2">
                          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                            {cat.name}
                          </div>

                          <div className="space-y-2">
                            {matchingAssets.map((asset) => {
                              const isAdded = asset.id in selectedAssets;
                              const currentQty = selectedAssets[asset.id] || 1;

                              return (
                                <div
                                  key={asset.id}
                                  className={`p-3.5 border rounded-[3px] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                    isAdded
                                      ? 'border-slate-600 bg-[#0c1527]'
                                      : 'border-slate-800/80 bg-[#080e1c] hover:border-slate-700'
                                  }`}
                                >
                                  <div className="space-y-0.5 min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-sm font-bold text-white">{asset.name}</span>
                                      {asset.isStatutoryOrStandard && (
                                        <span className="px-1.5 py-0.2 border border-rose-800 text-rose-400 font-mono text-[9px] uppercase font-bold rounded-[2px]">
                                          STATUTORY
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-400 leading-snug">{asset.shortDescription}</p>
                                    <div className="text-[11px] font-mono text-slate-500">
                                      Typical: {asset.defaultFrequencies.join(' · ')}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                    {isAdded ? (
                                      <div className="flex items-center gap-3">
                                        {asset.supportsQuantity !== false && (
                                          <div className="flex items-center border border-slate-700 rounded-[2px] bg-slate-900">
                                            <button
                                              type="button"
                                              onClick={() => updateAssetQuantity(asset.id, -1)}
                                              className="px-2 py-1 text-slate-400 hover:text-white text-xs font-bold"
                                            >
                                              −
                                            </button>
                                            <span className="px-2 font-mono text-xs font-bold text-white">
                                              {currentQty}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => updateAssetQuantity(asset.id, 1)}
                                              className="px-2 py-1 text-slate-400 hover:text-white text-xs font-bold"
                                            >
                                              +
                                            </button>
                                          </div>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => removeAsset(asset.id)}
                                          className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => addAsset(asset)}
                                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-[2px] border border-slate-700 transition-colors"
                                      >
                                        + Add Asset
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* 30% Sticky Selected Assets Sidebar */}
              <aside className="lg:col-span-4 border-l border-slate-800 pl-0 lg:pl-8 space-y-5 sticky top-36">
                <div className="border-b border-slate-800 pb-3">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                    Selected Estate
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedAssetList.length} Asset Types
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {totalPhysicalAssetCount} physical items
                  </span>
                </div>

                <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1 scrollbar-thin text-xs">
                  {selectedAssetList.length === 0 && (
                    <p className="text-slate-500 py-6 text-center">No assets selected yet.</p>
                  )}
                  {selectedAssetList.map(({ definition, quantity }) => (
                    <div
                      key={definition.id}
                      className="py-1.5 border-b border-slate-800/80 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-white block truncate">
                          {definition.supportsQuantity !== false ? `${quantity}× ` : ''}
                          {definition.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{definition.categoryName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAsset(definition.id)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <button
                    type="button"
                    disabled={selectedAssetList.length === 0}
                    onClick={() => setCurrentStep(3)}
                    className="w-full py-3 rounded-[3px] bg-[#0c1527] hover:bg-[#111e38] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 hover:border-slate-500 transition-colors disabled:opacity-40"
                  >
                    Configure Assets →
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-full text-center text-xs text-slate-400 hover:text-white py-1"
                  >
                    ← Back to Disciplines
                  </button>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: CONFIGURE ASSETS (QUANTITIES, AGE, CONDITION) */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-8 space-y-8">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                    04 / Asset Configuration
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">
                    Fine-tune asset parameters
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    Verify counts and asset lifecycle profiles. Standard defaults are already populated.
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedAssetList.map(({ definition, quantity }) => {
                    const cfg = assetConfigs[definition.id] || {
                      assetId: definition.id,
                      quantity,
                      ageBand: '4-7 years',
                      condition: 'Good',
                      criticality: 'Standard',
                    };

                    return (
                      <div
                        key={definition.id}
                        className="p-3.5 border border-slate-800 bg-[#0c1527] rounded-[3px] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                      >
                        <div className="sm:col-span-4">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{definition.categoryName}</span>
                          <span className="text-sm font-bold text-white block">{definition.name}</span>
                        </div>

                        <div className="sm:col-span-3">
                          {definition.supportsQuantity !== false ? (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400">Qty:</span>
                              <input
                                type="number"
                                min={1}
                                value={selectedAssets[definition.id] || 1}
                                onChange={(e) => setExactAssetQuantity(definition.id, parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white rounded-[2px]"
                              />
                            </div>
                          ) : (
                            <span className="text-xs font-mono text-slate-400">Whole Building</span>
                          )}
                        </div>

                        <div className="sm:col-span-3">
                          <select
                            value={cfg.ageBand}
                            onChange={(e) =>
                              setAssetConfigs((prev) => ({
                                ...prev,
                                [definition.id]: { ...cfg, ageBand: e.target.value as any },
                              }))
                            }
                            className="w-full px-2 py-1 rounded-[2px] bg-slate-900 border border-slate-700 text-xs text-white"
                          >
                            <option value="0-3 years">0–3 years (New/Warranty)</option>
                            <option value="4-7 years">4–7 years (Established)</option>
                            <option value="8-15 years">8–15 years (Mid-life)</option>
                            <option value="15+ years">15+ years (Legacy)</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeAsset(definition.id)}
                            className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Assets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[3px] bg-[#0c1527] hover:bg-[#111e38] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 hover:border-slate-500 transition-colors"
                  >
                    <span>Review Estate Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF3E9D]" />
                  </button>
                </div>
              </div>

              <aside className="lg:col-span-4 border-l border-slate-800 pl-0 lg:pl-8 space-y-6 pt-4 lg:pt-0 text-xs">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Lifecycle &amp; Wear Modelling
                  </h3>
                  <p className="text-slate-400 mt-1.5 leading-relaxed">
                    Aged mechanical equipment (8+ years) requires expanded seasonal testing to mitigate breakdown risk.
                  </p>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: REVIEW ESTATE (PRE-GENERATION SUMMARY) */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="border-b border-slate-800 pb-5">
                <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                  05 / Estate Review
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">
                  Review your building specification
                </h2>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  Confirm your configured building profile before generating the bespoke maintenance matrix.
                </p>
              </div>

              {/* Executive Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 border-y border-slate-800">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Property Profile</span>
                  <div className="text-sm font-bold text-white mt-0.5">{buildingType}</div>
                  <span className="text-xs text-slate-400">{buildingName || 'Commercial Estate'}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Floor Area</span>
                  <div className="text-sm font-bold text-white mt-0.5">{floorArea}</div>
                  <span className="text-xs text-slate-400">{numberOfFloors}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Asset Systems</span>
                  <div className="text-sm font-bold text-white mt-0.5">{selectedAssetList.length} Types</div>
                  <span className="text-xs text-slate-400">Selected</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Physical Items</span>
                  <div className="text-sm font-bold text-white mt-0.5">{totalPhysicalAssetCount} Assets</div>
                  <span className="text-xs text-slate-400">Total Count</span>
                </div>
              </div>

              {/* Selected Asset Register Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Configured Asset Register to be Processed:
                </h3>
                <div className="border border-slate-800 bg-[#0c1527] divide-y divide-slate-800 text-xs">
                  {selectedAssetList.map(({ definition, quantity }) => (
                    <div key={definition.id} className="p-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="font-semibold text-white">{definition.name}</span>
                        <span className="text-[11px] font-mono text-slate-500 ml-2">({definition.categoryName})</span>
                      </div>
                      <span className="font-mono text-slate-300 shrink-0">
                        {definition.supportsQuantity !== false ? `${quantity} Units` : 'Whole Site'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Configure</span>
                </button>

                <button
                  type="button"
                  disabled={isGenerating || selectedAssetList.length === 0}
                  onClick={handleGenerateProgramme}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[3px] bg-[#0c1527] hover:bg-[#111e38] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 hover:border-slate-500 transition-colors disabled:opacity-40"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{generationStage}</span>
                    </>
                  ) : (
                    <>
                      <span>Generate PPM Programme</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF3E9D]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: GENERATED PROGRAMME (EXECUTIVE METRICS + TERMINAL MATRIX) */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-8">
              {/* Executive Summary Strip */}
              <div className="border border-slate-800 bg-[#09101f] p-6 rounded-[4px] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                      Generated Output Specification
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                      {buildingName || 'Estate'} — PPM Maintenance Programme
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Based on: <strong>1 Building</strong> · <strong>{selectedAssetList.length} Asset Types</strong> · <strong>{totalPhysicalAssetCount} Physical Assets</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[3px] border border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold self-start sm:self-center transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Edit Assets</span>
                  </button>
                </div>

                {/* Scoreboard Metrics Strip with fine vertical dividers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
                  <div className="border-r border-slate-800 pr-4">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">Planned Tasks</span>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1">{stats.totalActivities}</div>
                    <span className="text-xs text-slate-500">12-Month Schedule</span>
                  </div>

                  <div className="border-r border-slate-800 pr-4">
                    <span className="text-[11px] font-mono text-rose-400 uppercase block">Legal Duties</span>
                    <div className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono mt-1">{stats.legalCount}</div>
                    <span className="text-xs text-slate-500">Statutory Regulations</span>
                  </div>

                  <div className="border-r border-slate-800 pr-4">
                    <span className="text-[11px] font-mono text-blue-400 uppercase block">British Standards</span>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono mt-1">{stats.standardCount}</div>
                    <span className="text-xs text-slate-500">Code of Practice</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase block">SFG20 &amp; Risk</span>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono mt-1">{stats.sfg20Count}</div>
                    <span className="text-xs text-slate-500">Preventative Care</span>
                  </div>
                </div>

                {/* Architectural Export Toolbar */}
                <ExportToolbar
                  toolName="PPM Schedule Builder"
                  onDownloadPdf={handleDownloadPdf}
                  onDownloadCsv={handleDownloadCsv}
                  pdfLabel="Download EntireFM PPM Programme (PDF)"
                  csvLabel="Export Maintenance Matrix (CSV)"
                />
              </div>

              {/* View Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setProgrammeViewMode('matrix')}
                    className={`px-3 py-1 font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
                      programmeViewMode === 'matrix'
                        ? 'border-[#FF3E9D] text-white'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Matrix View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProgrammeViewMode('annual')}
                    className={`px-3 py-1 font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
                      programmeViewMode === 'annual'
                        ? 'border-[#FF3E9D] text-white'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Annual Schedule (Jan–Dec)</span>
                  </button>
                </div>

                {programmeViewMode === 'matrix' && (
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter matrix rows…"
                      value={tableSearchQuery}
                      onChange={(e) => setTableSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-[#0c1527] border border-slate-700 text-xs text-white placeholder-slate-500 rounded-[2px] focus:outline-none focus:border-slate-400"
                    />
                  </div>
                )}
              </div>

              {/* MATRIX VIEW */}
              {programmeViewMode === 'matrix' && (
                <div className="border border-slate-800 bg-[#09101f] overflow-x-auto rounded-[3px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0c1527] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <th className="p-3.5">Asset System</th>
                        <th className="p-3.5">Maintenance Activity</th>
                        <th className="p-3.5 text-center">Frequency</th>
                        <th className="p-3.5">Compliance Basis</th>
                        <th className="p-3.5">Governing Guidance</th>
                        <th className="p-3.5">Recommended Competency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {filteredTasks.map(({ asset, quantity, task }, idx) => (
                        <tr key={idx} className="hover:bg-[#0c1527]/70 transition-colors">
                          <td className="p-3.5 font-bold text-white whitespace-nowrap">
                            {quantity > 1 ? `${quantity}× ` : ''}
                            {asset.name}
                            <span className="text-[10px] font-mono text-slate-500 block font-normal">
                              {asset.categoryName}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <p className="text-slate-200 leading-snug font-medium">{task.activity}</p>
                            <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                              Evidence: {task.evidenceExpected}
                            </span>
                          </td>
                          <td className="p-3.5 text-center whitespace-nowrap font-mono font-semibold text-slate-200">
                            {task.frequency}
                          </td>
                          <td className="p-3.5">
                            <ComplianceBadge classification={task.classification} />
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-300">
                            <div>{task.governingBasis}</div>
                            <div className="text-[10px] text-slate-500">{task.statutoryReference}</div>
                          </td>
                          <td className="p-3.5 text-slate-400 text-xs">
                            {task.recommendedCompetency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ANNUAL VIEW (12-MONTH CALENDAR GRID) */}
              {programmeViewMode === 'annual' && (
                <div className="border border-slate-800 bg-[#09101f] p-6 rounded-[3px] space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      12-Month Annual Distribution Schedule (Jan–Dec)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    {MONTH_NAMES.map((mName, mIdx) => {
                      const mNum = mIdx + 1;
                      const monthTasks = programmeTasks.filter((t) => t.task.frequencyMonths.includes(mNum));

                      return (
                        <div key={mName} className="p-3.5 border border-slate-800 bg-[#0c1527] rounded-[2px] space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                            <span className="font-mono text-xs font-bold text-white">{mName} 2026</span>
                            <span className="text-[10px] font-mono text-slate-400">{monthTasks.length} Regimes</span>
                          </div>

                          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                            {monthTasks.map((t, idx) => (
                              <div key={idx} className="text-slate-300">
                                <span className="font-semibold text-white">{t.asset.name}: </span>
                                <span className="text-slate-400">{t.task.activity} ({t.task.frequency})</span>
                              </div>
                            ))}
                            {monthTasks.length === 0 && (
                              <div className="text-slate-600 py-2 text-center">Routine inspections only</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Corporate Conversion CTA */}
              <ToolConversionCTA
                toolName="PPM Schedule Builder"
                heading="Require on-site engineering verification?"
                subheading="EntireFM mobilises certified engineering teams to survey physical assets, verify condition, and execute planned preventative maintenance under fixed SLAs."
                primaryActionLabel="Request Engineering Survey"
                primaryActionHref="/contact-us#enquiry"
              />
            </div>
          )}
        </ToolShell>
      </main>
      <Footer />
    </div>
  );
}
