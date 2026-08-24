'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Building2,
  Sliders,
  Calendar,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  Plus,
  Minus,
  Trash2,
  SlidersHorizontal,
  Flame,
  Zap,
  Droplets,
  Wind,
  Shield,
  Key,
  Home,
  Trees,
  FileText,
  Clock,
  List,
  LayoutGrid,
  CheckCircle2,
  AlertTriangle,
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
  CommercialAssetCategory,
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
  const [location, setLocation] = useState('Greater London / South East');

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
  const [classificationFilter, setClassificationFilter] = useState<string>('ALL');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('ALL');
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'PPM Schedule Builder', url: '/tools/ppm-schedule-builder' },
  ];

  // Helper functions for Asset Selection
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
      if (classificationFilter !== 'ALL' && task.classification !== classificationFilter) return false;
      if (frequencyFilter !== 'ALL' && task.frequency !== frequencyFilter) return false;
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
  }, [programmeTasks, classificationFilter, frequencyFilter, tableSearchQuery]);

  // Generate event handler with animation
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
          purpose="Configure your exact building assets and generate a comprehensive SFG20 and statutory maintenance programme."
          timeEstimate="3–5 min"
          outputs={['PDF Programme', 'CSV Matrix']}
          icon={Wrench}
        >
          {/* 6-Step Stepper */}
          <WizardProgress
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            onSelectStep={(idx) => {
              // Allow jumping backwards freely, or jumping to step 5 only if generated
              if (idx <= currentStep || (idx === 5 && currentStep === 4)) {
                setCurrentStep(idx);
              }
            }}
          />

          {/* ========================================================================= */}
          {/* STEP 1: BUILDING PROFILE */}
          {/* ========================================================================= */}
          {currentStep === 0 && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                    01 Building Profile
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Build your PPM programme
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Tell us a little about the property, then select the plant and systems installed within the building. Sensible defaults provided.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Site / Building Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Plaza HQ / Unit 4 Distribution"
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Building Type / Sector
                    </label>
                    <select
                      value={buildingType}
                      onChange={(e) => setBuildingType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Approximate Floor Area (Gross Internal)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 35,000 sq ft"
                      value={floorArea}
                      onChange={(e) => setFloorArea(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Operating Hours &amp; Occupancy Profile
                    </label>
                    <select
                      value={occupancyProfile}
                      onChange={(e) => setOccupancyProfile(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    >
                      <option value="Standard Business Hours (07:00–19:00)">Standard Business Hours (07:00–19:00)</option>
                      <option value="Extended Operations (06:00–22:00)">Extended Operations (06:00–22:00)</option>
                      <option value="24/7 Continuous Mission Critical">24/7 Continuous Mission Critical</option>
                      <option value="High Public Footfall / Weekend Operation">High Public Footfall / Weekend Operation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Number of Floors
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Floors + Basement"
                      value={numberOfFloors}
                      onChange={(e) => setNumberOfFloors(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Site Criticality &amp; Governance Level
                    </label>
                    <select
                      value={siteCriticality}
                      onChange={(e) => setSiteCriticality(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    >
                      <option value="Standard Commercial">Standard Commercial</option>
                      <option value="Critical / Regulated">Critical / Highly Regulated</option>
                      <option value="High Public Footfall">High Public Footfall</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <span className="text-xs text-slate-500 font-mono">
                    Step 1 of 6 · No registration required
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF3E9D] to-[#D91B7D] text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all"
                  >
                    <span>Select Building Disciplines</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: CHOOSE ASSET CATEGORIES */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                    02 Discipline Scope
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Which systems are installed?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Select all engineering and building disciplines present on your estate. This determines which asset libraries are available in the next step.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {COMMERCIAL_ASSET_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategoryIds.has(cat.id);
                    const IconComponent = CATEGORY_ICONS[cat.id] || Wrench;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-5 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'border-[#FF3E9D] bg-gradient-to-br from-[#FF3E9D]/15 to-slate-900/90 ring-1 ring-[#FF3E9D]/40'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#FF3E9D] text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{cat.name}</span>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-[#FF3E9D] border-[#FF3E9D] text-white'
                                  : 'border-slate-700 bg-slate-900'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                            {cat.description}
                          </p>
                          <span className="text-[11px] font-mono text-slate-500 block pt-1">
                            {cat.assets.length} selectable asset types
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={selectedCategoryIds.size === 0}
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF3E9D] to-[#D91B7D] text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all disabled:opacity-40"
                  >
                    <span>Choose Assets ({selectedCategoryIds.size} Disciplines)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: INDIVIDUAL ASSET SELECTION (70/30 WORKSPACE WITH STICKY SIDEBAR) */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 70% MAIN WORKSPACE: INDIVIDUAL ASSET LIBRARY */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Search and Category Pill Bar */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                          03 Asset Selection
                        </span>
                        <h2 className="text-xl font-bold text-white mt-0.5">
                          Select Installed Assets
                        </h2>
                      </div>

                      {/* Search box */}
                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="Search 36+ assets…"
                          value={assetSearchQuery}
                          onChange={(e) => setAssetSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3E9D]"
                        />
                      </div>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                      <button
                        type="button"
                        onClick={() => setActiveAssetCatTab('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                          activeAssetCatTab === 'ALL'
                            ? 'bg-[#FF3E9D] text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        All Disciplines ({activeCategories.length})
                      </button>
                      {activeCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveAssetCatTab(cat.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                            activeAssetCatTab === cat.id
                              ? 'bg-[#FF3E9D] text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Asset Cards Grid by Category */}
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

                        const IconComp = CATEGORY_ICONS[cat.id] || Wrench;

                        return (
                          <div key={cat.id} className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                              <IconComp className="w-4 h-4 text-[#FF3E9D]" />
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                                {cat.name}
                              </h3>
                              <span className="text-xs text-slate-500 font-mono">
                                ({matchingAssets.length} asset types)
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {matchingAssets.map((asset) => {
                                const isAdded = asset.id in selectedAssets;
                                const currentQty = selectedAssets[asset.id] || 1;

                                return (
                                  <div
                                    key={asset.id}
                                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                                      isAdded
                                        ? 'border-[#FF3E9D]/80 bg-gradient-to-b from-slate-900 to-slate-950 shadow-lg ring-1 ring-[#FF3E9D]/30'
                                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                                    }`}
                                  >
                                    <div className="space-y-1.5">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-sm font-bold text-white leading-snug">
                                          {asset.name}
                                        </h4>
                                        {asset.isStatutoryOrStandard && (
                                          <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-rose-950/80 border border-rose-800 text-rose-300 shrink-0">
                                            STATUTORY
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-400 leading-relaxed">
                                        {asset.shortDescription}
                                      </p>
                                      <div className="text-[11px] text-slate-500 font-mono pt-1">
                                        Typical: {asset.defaultFrequencies.join(' · ')}
                                      </div>
                                    </div>

                                    {/* Add / Quantity Control */}
                                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                                      {isAdded ? (
                                        <div className="flex items-center justify-between w-full">
                                          {asset.supportsQuantity !== false ? (
                                            <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700">
                                              <span className="text-[11px] text-slate-400 font-mono">Qty:</span>
                                              <button
                                                type="button"
                                                onClick={() => updateAssetQuantity(asset.id, -1)}
                                                className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                                              >
                                                <Minus className="w-3 h-3" />
                                              </button>
                                              <span className="font-mono text-xs font-bold text-white px-1">
                                                {currentQty}
                                              </span>
                                              <button
                                                type="button"
                                                onClick={() => updateAssetQuantity(asset.id, 1)}
                                                className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                                              >
                                                <Plus className="w-3 h-3" />
                                              </button>
                                            </div>
                                          ) : (
                                            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                                              <Check className="w-3.5 h-3.5" /> Included
                                            </span>
                                          )}

                                          <button
                                            type="button"
                                            onClick={() => removeAsset(asset.id)}
                                            className="text-xs text-rose-400 hover:text-rose-300 font-semibold p-1"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => addAsset(asset)}
                                          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                          <Plus className="w-3.5 h-3.5 text-[#FF3E9D]" />
                                          <span>Add to Estate</span>
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

                {/* 30% STICKY SIDEBAR: SELECTED ASSETS CONTROL CENTRE */}
                <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-5 sticky top-36">
                  <div className="border-b border-slate-800 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#FF3E9D] uppercase tracking-wider">
                        Live Estate Summary
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {totalPhysicalAssetCount} physical items
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      Selected Assets ({selectedAssetList.length} Types)
                    </h3>
                  </div>

                  {/* Asset List by Category in Sidebar */}
                  <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                    {selectedAssetList.length === 0 && (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No assets added yet. Select plant items from the library on the left.
                      </div>
                    )}

                    {selectedAssetList.map(({ definition, quantity }) => (
                      <div
                        key={definition.id}
                        className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">
                            {definition.supportsQuantity !== false ? `${quantity}× ` : ''}
                            {definition.name}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            {definition.categoryName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAsset(definition.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Continue Action */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <button
                      type="button"
                      disabled={selectedAssetList.length === 0}
                      onClick={() => setCurrentStep(3)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF3E9D] to-[#D91B7D] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      <span>Continue — Configure Assets</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      ← Back to Disciplines
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: CONFIGURE ASSETS (QUANTITY, AGE, CONDITION) */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                    04 Asset Configuration
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Fine-tune asset profile
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Adjust exact counts, age bands, and condition. All fields default sensibly — you may proceed directly if satisfied.
                  </p>
                </div>

                <div className="space-y-4">
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
                        className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                      >
                        <div className="sm:col-span-4">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            {definition.categoryName}
                          </span>
                          <h4 className="text-sm font-bold text-white">{definition.name}</h4>
                        </div>

                        <div className="sm:col-span-3">
                          {definition.supportsQuantity !== false ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">Qty:</span>
                              <input
                                type="number"
                                min={1}
                                value={selectedAssets[definition.id] || 1}
                                onChange={(e) => setExactAssetQuantity(definition.id, parseInt(e.target.value) || 1)}
                                className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white"
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
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                          >
                            <option value="0-3 years">0–3 years (New/Warranty)</option>
                            <option value="4-7 years">4–7 years (Established)</option>
                            <option value="8-15 years">8–15 years (Mid-life)</option>
                            <option value="15+ years">15+ years (Aged/Legacy)</option>
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

                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Assets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF3E9D] to-[#D91B7D] text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all"
                  >
                    <span>Review Estate Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: REVIEW ESTATE (PRE-GENERATION TRANSITION) */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-8">
                <div className="border-b border-slate-800 pb-4">
                  <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                    05 Final Review
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Review your building
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Confirm your estate profile before generating the bespoke PPM maintenance programme.
                  </p>
                </div>

                {/* Building Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Property Profile</span>
                    <p className="text-sm font-bold text-white">{buildingType}</p>
                    <p className="text-xs text-slate-400">{buildingName || 'Commercial Estate'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Floor Area &amp; Levels</span>
                    <p className="text-sm font-bold text-white">{floorArea}</p>
                    <p className="text-xs text-slate-400">{numberOfFloors}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Total Selected Assets</span>
                    <p className="text-sm font-bold text-[#FF3E9D] font-mono">
                      {selectedAssetList.length} Asset Types
                    </p>
                    <p className="text-xs text-slate-400">{totalPhysicalAssetCount} Physical Assets</p>
                  </div>
                </div>

                {/* Selected Asset Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Installed Asset Register to be Processed:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedAssetList.map(({ definition, quantity }) => (
                      <div
                        key={definition.id}
                        className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-white truncate">{definition.name}</span>
                        <span className="font-mono text-slate-400 shrink-0">
                          {definition.supportsQuantity !== false ? `${quantity} Units` : 'Whole Site'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generation CTA with Animation */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Configure</span>
                  </button>

                  <button
                    type="button"
                    disabled={isGenerating || selectedAssetList.length === 0}
                    onClick={handleGenerateProgramme}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF3E9D] to-[#D91B7D] text-white font-bold text-sm uppercase tracking-wider shadow-2xl hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{generationStage}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate My PPM Programme →</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: GENERATED PPM PROGRAMME (ONLY SELECTED ASSETS) */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Results Command Banner */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                      Programme Generated Successfully
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {buildingName || 'Your Estate'} — PPM Programme
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Based on: <strong>1 Building</strong> · <strong>{selectedAssetList.length} Asset Types</strong> · <strong>{totalPhysicalAssetCount} Physical Assets</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Edit Assets
                    </button>
                  </div>
                </div>

                {/* Scoreboard Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Total Planned Tasks
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
                      {stats.totalActivities}
                    </p>
                    <span className="text-[11px] text-slate-500">Across 12 months</span>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/50">
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">
                      Legal Duties
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono mt-1">
                      {stats.legalCount}
                    </p>
                    <span className="text-[11px] text-rose-300/70">Strict criminal liability</span>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/50">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                      British Standards
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono mt-1">
                      {stats.standardCount}
                    </p>
                    <span className="text-[11px] text-blue-300/70">Standard-led activities</span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                      SFG20 &amp; Risk-Based
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                      {stats.sfg20Count}
                    </p>
                    <span className="text-[11px] text-emerald-300/70">Planned preventative care</span>
                  </div>
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                  toolName="PPM Schedule Builder"
                  onDownloadPdf={handleDownloadPdf}
                  onDownloadCsv={handleDownloadCsv}
                  pdfLabel="Download EntireFM PPM Programme (PDF)"
                  csvLabel="Export Maintenance Matrix (CSV)"
                />
              </div>

              {/* View Mode Switcher (Matrix vs Annual) */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setProgrammeViewMode('matrix')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      programmeViewMode === 'matrix'
                        ? 'bg-[#0B1220] text-[#FF3E9D] border border-[#FF3E9D]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span>Matrix View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProgrammeViewMode('annual')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      programmeViewMode === 'annual'
                        ? 'bg-[#0B1220] text-[#FF3E9D] border border-[#FF3E9D]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Annual Schedule (Jan–Dec)</span>
                  </button>
                </div>

                {programmeViewMode === 'matrix' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Filter matrix rows…"
                      value={tableSearchQuery}
                      onChange={(e) => setTableSearchQuery(e.target.value)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>
                )}
              </div>

              {/* MATRIX VIEW */}
              {programmeViewMode === 'matrix' && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                          <th className="p-4">Asset / System</th>
                          <th className="p-4">Maintenance Activity</th>
                          <th className="p-4 text-center">Frequency</th>
                          <th className="p-4">Compliance Basis</th>
                          <th className="p-4">Governing Guidance</th>
                          <th className="p-4">Recommended Competency</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 text-slate-300">
                        {filteredTasks.map(({ asset, quantity, task }, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-white text-sm">
                                {quantity > 1 ? `${quantity}× ` : ''}
                                {asset.name}
                              </div>
                              <span className="text-[10px] font-mono text-slate-500">
                                {asset.categoryName}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="text-xs text-slate-200 leading-snug font-medium">
                                {task.activity}
                              </p>
                              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                                {task.evidenceExpected}
                              </span>
                            </td>
                            <td className="p-4 text-center whitespace-nowrap">
                              <span className="px-2 py-1 rounded bg-slate-800 text-white font-mono font-bold text-[11px] border border-slate-700">
                                {task.frequency}
                              </span>
                            </td>
                            <td className="p-4">
                              <ComplianceBadge classification={task.classification} />
                            </td>
                            <td className="p-4 font-mono text-[11px] text-slate-300">
                              <div>{task.governingBasis}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{task.statutoryReference}</div>
                            </td>
                            <td className="p-4 text-slate-400 text-xs">
                              {task.recommendedCompetency}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ANNUAL VIEW (12-MONTH DISTRIBUTION) */}
              {programmeViewMode === 'annual' && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-lg font-bold text-white">12-Month Maintenance Programme Distribution</h3>
                    <p className="text-xs text-slate-400">
                      Planned service activities scheduled across the calendar year based on statutory frequencies and seasonal operational windows.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MONTH_NAMES.map((mName, mIdx) => {
                      const mNum = mIdx + 1;
                      const monthTasks = programmeTasks.filter((t) => t.task.frequencyMonths.includes(mNum));

                      return (
                        <div
                          key={mName}
                          className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2.5"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                            <span className="font-mono text-sm font-bold text-white">
                              {mName} 2026
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                              {monthTasks.length} Regimes
                            </span>
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                            {monthTasks.map((t, idx) => (
                              <div key={idx} className="text-xs text-slate-300 space-y-0.5">
                                <div className="font-semibold text-white flex items-center justify-between">
                                  <span>{t.asset.name}</span>
                                  <span className="text-[9.5px] font-mono text-[#FF3E9D]">
                                    {t.task.frequency}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-1">{t.task.activity}</p>
                              </div>
                            ))}
                            {monthTasks.length === 0 && (
                              <div className="py-4 text-center text-xs text-slate-600">
                                Routine checks only
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next Steps CTA */}
              <ToolConversionCTA
                toolName="PPM Schedule Builder"
                heading="Need EntireFM to manage this PPM programme?"
                subheading="EntireFM mobilises certified engineering teams to survey physical assets, issue statutory logbooks, and execute planned maintenance across UK estates."
                primaryActionLabel="Request Engineering Proposal"
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
