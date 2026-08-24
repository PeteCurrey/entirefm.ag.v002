'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
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
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Download,
  Clock,
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
  const [generationStageIndex, setGenerationStageIndex] = useState(0);

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

  // Generate event handler with structured step breakdown
  const handleGenerateProgramme = () => {
    setIsGenerating(true);
    setGenerationStageIndex(0);

    setTimeout(() => {
      setGenerationStageIndex(1);
    }, 350);

    setTimeout(() => {
      setGenerationStageIndex(2);
    }, 700);

    setTimeout(() => {
      setGenerationStageIndex(3);
    }, 1050);

    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(5); // Go to Step 6 (Programme)
    }, 1400);
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
    <div className="min-h-screen flex flex-col bg-[#070b16]">
      <Header />
      <main id="main" className="flex-grow pt-20">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="PPM Schedule Builder"
          purpose="Build an indicative planned maintenance programme around the plant and systems actually installed at your property."
          timeEstimate="05 MINUTES"
          outputs={['PDF PROGRAMME', 'CSV MATRIX']}
        >
          {/* Engineering Process Stepper */}
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
          {/* STEP 1: BUILDING PROFILE (72% WORK AREA / 28% BLUE-HOUR CONTEXT PANEL) */}
          {/* ========================================================================= */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* 72% Main Work Area */}
              <div className="lg:col-span-8 space-y-8 bg-[#091124]/70 border border-slate-800/90 p-6 sm:p-8 rounded-[4px] shadow-sm backdrop-blur-sm">
                <div className="border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                    <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                      01 / Building Profile
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight font-display">
                    Tell us about the property
                  </h2>
                  <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                    We will use this information to tailor the maintenance programme to the operating environment of your estate.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-200">
                        Site / building name
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">Optional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Apex Plaza HQ"
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      className="w-full h-12 px-4 rounded-[3px] bg-[#0c162d] border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-200">
                        Building type
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">Required</span>
                    </div>
                    <select
                      value={buildingType}
                      onChange={(e) => setBuildingType(e.target.value)}
                      className="w-full h-12 px-4 rounded-[3px] bg-[#0c162d] border border-slate-700/80 text-sm text-white focus:outline-none focus:border-[#0284C7] transition-all"
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-200">
                        Approximate floor area
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">Optional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 45,000 sq ft"
                      value={floorArea}
                      onChange={(e) => setFloorArea(e.target.value)}
                      className="w-full h-12 px-4 rounded-[3px] bg-[#0c162d] border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0284C7] transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-200">
                        Operating profile
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">Required</span>
                    </div>
                    <select
                      value={occupancyProfile}
                      onChange={(e) => setOccupancyProfile(e.target.value)}
                      className="w-full h-12 px-4 rounded-[3px] bg-[#0c162d] border border-slate-700/80 text-sm text-white focus:outline-none focus:border-[#0284C7] transition-all"
                    >
                      <option value="Standard Business Hours (07:00–19:00)">Standard Business Hours (07:00–19:00)</option>
                      <option value="Extended Operations (06:00–22:00)">Extended Operations (06:00–22:00)</option>
                      <option value="24/7 Continuous Mission Critical">24/7 Continuous Mission Critical</option>
                      <option value="High Public Footfall / Weekend Operation">High Public Footfall / Weekend Operation</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-200">
                        Number of storeys
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">Optional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 5 Floors + Plant Room"
                      value={numberOfFloors}
                      onChange={(e) => setNumberOfFloors(e.target.value)}
                      className="w-full h-12 px-4 rounded-[3px] bg-[#0c162d] border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0284C7] transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-200">
                        Site criticality
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">Required</span>
                    </div>
                    <select
                      value={siteCriticality}
                      onChange={(e) => setSiteCriticality(e.target.value as any)}
                      className="w-full h-12 px-4 rounded-[3px] bg-[#0c162d] border border-slate-700/80 text-sm text-white focus:outline-none focus:border-[#0284C7] transition-all"
                    >
                      <option value="Standard Commercial">Standard Commercial Governance</option>
                      <option value="Critical / Regulated">Mission Critical / Highly Regulated</option>
                      <option value="High Public Footfall">High Public Footfall Risk</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/90 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    STEP 1 OF 6
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[3px] bg-[#0c162d] hover:bg-[#122040] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 hover:border-slate-500 transition-all shadow-sm group"
                  >
                    <span>Select Building Disciplines</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF3E9D] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* 28% Intelligent Blue-Hour Context Panel with Photography */}
              <aside className="lg:col-span-4 border border-slate-800/90 bg-[#091124]/70 p-6 rounded-[4px] space-y-6 backdrop-blur-sm">
                {/* Controlled Blue-Hour Engineering Image */}
                <div className="relative h-44 w-full rounded-[2px] overflow-hidden border border-slate-800 shadow-inner">
                  <Image
                    src="/images/editorial/entirefm-distribution-board-testing-800w.webp"
                    alt="EntireFM technical engineer inspecting commercial building plant"
                    fill
                    className="object-cover object-center filter saturate-[0.85] contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-300 font-semibold tracking-wider uppercase">
                    Commercial Plant &amp; Building Infrastructure
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Building Profile Guidance
                  </h3>
                  <p className="text-slate-300 mt-2 text-xs leading-relaxed">
                    Operating hours and building use directly determine servicing strategy, plant duty cycle, and SFG20 task frequencies.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="font-bold text-white block uppercase text-[10px] tracking-wider font-mono text-[#0284C7]">
                      Used to Calculate
                    </span>
                    <ul className="mt-1.5 space-y-1 text-slate-300">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        Operating duty cycle &amp; runtime hours
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        Statutory inspection intervals
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        Emergency lighting &amp; fire safety scope
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-800/60">
                    <span className="text-[11px] font-mono text-slate-400 block">
                      Data Privacy: Your estate inputs remain strictly in this browser session.
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: DISCIPLINE SELECTION (REFINED ENGINEERING ROWS) */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-8 space-y-8 bg-[#091124]/70 border border-slate-800/90 p-6 sm:p-8 rounded-[4px] shadow-sm backdrop-blur-sm">
                <div className="border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                    <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                      02 / Discipline Scope
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight font-display">
                    Which systems are installed?
                  </h2>
                  <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                    Select all engineering disciplines present on your estate to unlock the relevant asset registers.
                  </p>
                </div>

                <div className="space-y-3">
                  {COMMERCIAL_ASSET_CATEGORIES.map((cat, idx) => {
                    const isSelected = selectedCategoryIds.has(cat.id);
                    const IconComponent = CATEGORY_ICONS[cat.id] || Wrench;
                    const catNumber = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-4 border rounded-[3px] cursor-pointer transition-all flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-slate-600 bg-[#0c162d] shadow-sm'
                            : 'border-slate-800/80 bg-[#080e1c] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="text-xs font-mono font-bold text-slate-500 w-5 shrink-0">
                            {catNumber}
                          </span>
                          <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#FF3E9D]' : 'text-slate-500'}`} />
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-white block truncate uppercase tracking-wide">
                              {cat.name}
                            </span>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{cat.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                            {cat.assets.length} ASSETS
                          </span>
                          <div
                            className={`w-5 h-5 rounded-[2px] flex items-center justify-center border transition-colors ${
                              isSelected
                                ? 'bg-slate-700 border-slate-500 text-white'
                                : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-slate-800/90 flex items-center justify-between">
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
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[3px] bg-[#0c162d] hover:bg-[#122040] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 hover:border-slate-500 transition-all disabled:opacity-40 shadow-sm group"
                  >
                    <span>Choose Assets ({selectedCategoryIds.size} Disciplines)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF3E9D] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              <aside className="lg:col-span-4 border border-slate-800/90 bg-[#091124]/70 p-6 rounded-[4px] space-y-6 backdrop-blur-sm text-xs">
                <div className="relative h-36 w-full rounded-[2px] overflow-hidden border border-slate-800 shadow-inner">
                  <Image
                    src="/images/editorial/entirefm-access-control-install-800w.webp"
                    alt="EntireFM technical engineering installations"
                    fill
                    className="object-cover object-center filter saturate-[0.85]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-300 font-semibold tracking-wider uppercase">
                    Discipline Filtering
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Discipline Scope Notice
                  </h3>
                  <p className="text-slate-300 mt-2 leading-relaxed">
                    Selected categories unlock specific asset registers on the next step. No maintenance tasks are scheduled until physical assets are added.
                  </p>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: ASSET SELECTION (70% ASSET REGISTER / 30% STICKY SUMMARY) */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* 70% Asset Library Work Area */}
              <div className="lg:col-span-8 space-y-6 bg-[#091124]/70 border border-slate-800/90 p-6 sm:p-8 rounded-[4px] shadow-sm backdrop-blur-sm">
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                      <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                        03 / Asset Register Library
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-1 font-display">
                      Select Installed Assets
                    </h2>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Filter 44 commercial assets…"
                      value={assetSearchQuery}
                      onChange={(e) => setAssetSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-[3px] bg-[#0c162d] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0284C7] transition-colors"
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
                    All Disciplines ({activeCategories.length})
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
                                      ? 'border-slate-600 bg-[#0c162d]'
                                      : 'border-slate-800/80 bg-[#080e1c] hover:border-slate-700'
                                  }`}
                                >
                                  <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-sm font-bold text-white">{asset.name}</span>
                                      {asset.isStatutoryOrStandard && (
                                        <span className="px-1.5 py-0.2 border border-rose-800 text-rose-400 font-mono text-[9px] uppercase font-bold rounded-[2px]">
                                          STATUTORY
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-400 leading-snug">{asset.shortDescription}</p>
                                    <div className="text-[11px] font-mono text-slate-400">
                                      Standard frequencies: {asset.defaultFrequencies.join(' · ')}
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
                                              className="px-2.5 py-1 text-slate-400 hover:text-white text-xs font-bold"
                                            >
                                              −
                                            </button>
                                            <span className="px-2 font-mono text-xs font-bold text-white">
                                              {currentQty}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => updateAssetQuantity(asset.id, 1)}
                                              className="px-2.5 py-1 text-slate-400 hover:text-white text-xs font-bold"
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
              <aside className="lg:col-span-4 border border-slate-800/90 bg-[#091124]/70 p-6 rounded-[4px] space-y-5 sticky top-36 backdrop-blur-sm">
                <div className="border-b border-slate-800 pb-3">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                    Selected Estate
                  </div>
                  <h3 className="text-xl font-bold text-white mt-0.5 font-display">
                    {selectedAssetList.length} Asset Types
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {totalPhysicalAssetCount} physical items registered
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
                    className="w-full py-3.5 rounded-[3px] bg-[#0c162d] hover:bg-[#122040] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 hover:border-slate-500 transition-colors disabled:opacity-40 shadow-sm"
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
              <div className="lg:col-span-8 space-y-8 bg-[#091124]/70 border border-slate-800/90 p-6 sm:p-8 rounded-[4px] shadow-sm backdrop-blur-sm">
                <div className="border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                    <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                      04 / Asset Configuration
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight font-display">
                    Fine-tune asset parameters
                  </h2>
                  <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                    Verify physical unit counts and lifecycle profiles. Standard industry baselines are pre-populated.
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
                        className="p-4 border border-slate-800/90 bg-[#0c162d] rounded-[3px] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                      >
                        <div className="sm:col-span-4">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">{definition.categoryName}</span>
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
                                className="w-16 px-2.5 py-1 bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white rounded-[2px]"
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
                            className="w-full px-2.5 py-1 rounded-[2px] bg-slate-900 border border-slate-700 text-xs text-white"
                          >
                            <option value="0-3 years">0–3 years (Warranty)</option>
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

                <div className="pt-6 border-t border-slate-800/90 flex items-center justify-between">
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
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[3px] bg-[#0c162d] hover:bg-[#122040] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 hover:border-slate-500 transition-all shadow-sm group"
                  >
                    <span>Review Estate Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF3E9D] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              <aside className="lg:col-span-4 border border-slate-800/90 bg-[#091124]/70 p-6 rounded-[4px] space-y-6 backdrop-blur-sm text-xs">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Lifecycle &amp; Wear Calibration
                  </h3>
                  <p className="text-slate-300 mt-2 leading-relaxed">
                    Plant operating in the 8+ year band is scheduled with expanded pre-season testing to prevent uncoordinated outages.
                  </p>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: REVIEW ESTATE (PRE-GENERATION CINEMATIC SUMMARY) */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="max-w-4xl mx-auto space-y-8 bg-[#091124]/70 border border-slate-800/90 p-6 sm:p-10 rounded-[4px] shadow-sm backdrop-blur-sm">
              <div className="border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                  <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                    05 / Estate Review
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight font-display">
                  Review your building specification
                </h2>
                <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
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

              {/* Configured Asset Register Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Configured Asset Register to be Processed:
                </h3>
                <div className="border border-slate-800 bg-[#0c162d] divide-y divide-slate-800 text-xs">
                  {selectedAssetList.map(({ definition, quantity }) => (
                    <div key={definition.id} className="p-3.5 flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="font-semibold text-white">{definition.name}</span>
                        <span className="text-[11px] font-mono text-slate-400 ml-2">({definition.categoryName})</span>
                      </div>
                      <span className="font-mono text-slate-300 shrink-0">
                        {definition.supportsQuantity !== false ? `${quantity} Units` : 'Whole Site'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/90 flex items-center justify-between">
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
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[3px] bg-[#0c162d] hover:bg-[#122040] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 hover:border-slate-500 transition-all disabled:opacity-40 shadow-sm group"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>
                        {generationStageIndex === 0 && 'Processing asset register…'}
                        {generationStageIndex === 1 && 'Applying statutory & SFG20 regimes…'}
                        {generationStageIndex === 2 && 'Calibrating 12-month schedule…'}
                        {generationStageIndex === 3 && 'Finalising PPM matrix…'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span>Generate PPM Programme</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF3E9D] group-hover:translate-x-0.5 transition-transform" />
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
              <div className="border border-slate-800/90 bg-[#091124]/80 p-6 sm:p-8 rounded-[4px] space-y-6 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                      Generated Output Specification
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
                      {buildingName || 'Commercial Estate'} — PPM Maintenance Programme
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
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
                    <span className="text-xs text-slate-400">12-Month Schedule</span>
                  </div>

                  <div className="border-r border-slate-800 pr-4">
                    <span className="text-[11px] font-mono text-rose-400 uppercase block">Legal Duties</span>
                    <div className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono mt-1">{stats.legalCount}</div>
                    <span className="text-xs text-slate-400">Statutory Regulations</span>
                  </div>

                  <div className="border-r border-slate-800 pr-4">
                    <span className="text-[11px] font-mono text-blue-400 uppercase block">British Standards</span>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono mt-1">{stats.standardCount}</div>
                    <span className="text-xs text-slate-400">Code of Practice</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase block">SFG20 &amp; Risk</span>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono mt-1">{stats.sfg20Count}</div>
                    <span className="text-xs text-slate-400">Preventative Care</span>
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
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter matrix rows…"
                      value={tableSearchQuery}
                      onChange={(e) => setTableSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-[#0c162d] border border-slate-700 text-xs text-white placeholder-slate-500 rounded-[2px] focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                )}
              </div>

              {/* MATRIX VIEW */}
              {programmeViewMode === 'matrix' && (
                <div className="border border-slate-800/90 bg-[#091124] overflow-x-auto rounded-[3px] shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0c162d] text-slate-300 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
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
                        <tr key={idx} className="hover:bg-[#0c162d]/70 transition-colors">
                          <td className="p-3.5 font-bold text-white whitespace-nowrap">
                            {quantity > 1 ? `${quantity}× ` : ''}
                            {asset.name}
                            <span className="text-[10px] font-mono text-slate-400 block font-normal">
                              {asset.categoryName}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <p className="text-slate-200 leading-snug font-medium">{task.activity}</p>
                            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
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
                            <div className="text-[10px] text-slate-400">{task.statutoryReference}</div>
                          </td>
                          <td className="p-3.5 text-slate-300 text-xs">
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
                <div className="border border-slate-800/90 bg-[#091124] p-6 rounded-[3px] space-y-6 shadow-sm">
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
                        <div key={mName} className="p-3.5 border border-slate-800 bg-[#0c162d] rounded-[2px] space-y-2">
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
