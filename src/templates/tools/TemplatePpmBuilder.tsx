'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Download,
  Printer,
  CheckSquare,
  Square,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Search,
  Sparkles,
  Info,
  ChevronDown,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { ToolHero } from '@/components/resources/ToolHero';
import { ResultsConversionBridge } from '@/components/resources/ResultsConversionBridge';
import type { TemplateProps } from '../types';

type BasisLevel = 'LEGAL' | 'STANDARD' | 'PRACTICE' | 'RISK';

interface PpmTask {
  id: string;
  category: string;
  asset: string;
  activity: string;
  frequency: string;
  basis: BasisLevel;
  guidance: string;
  notes: string;
}

const ALL_PPM_TASKS: PpmTask[] = [
  // HVAC
  {
    id: 'hvac-1',
    category: 'HVAC & Air Conditioning',
    asset: 'Air Handling Units (AHUs)',
    activity: 'Filter inspection & replacement, belt tension, coil sanitisation, damper operation',
    frequency: 'Quarterly',
    basis: 'PRACTICE',
    guidance: 'CIBSE Guide M / Manufacturer specs',
    notes: 'Frequency increases in heavy particulate or industrial environments.',
  },
  {
    id: 'hvac-2',
    category: 'HVAC & Air Conditioning',
    asset: 'Chillers & VRF Refrigeration',
    activity: 'F-Gas mandatory leak checking, compressor oil analysis, heat exchanger clean',
    frequency: '6-Monthly / Annual',
    basis: 'LEGAL',
    guidance: 'GB F-Gas Regulations / CIBSE Guide M',
    notes: 'Frequency set by CO2 equivalent refrigerant charge thresholds.',
  },
  {
    id: 'hvac-3',
    category: 'HVAC & Air Conditioning',
    asset: 'Extract Ventilation & LEV',
    activity: 'Local Exhaust Ventilation (LEV) statutory thorough examination & performance testing',
    frequency: '14-Monthly',
    basis: 'LEGAL',
    guidance: 'COSHH 2002 Regulation 9 / HSG258',
    notes: 'Statutory 14-month maximum interval for industrial dust/fume extract systems.',
  },

  // Fire Safety
  {
    id: 'fire-1',
    category: 'Fire Safety & Detection',
    asset: 'Fire Alarm System',
    activity: 'Weekly call point test, quarterly/6-monthly inspection by competent technician',
    frequency: 'Weekly (In-House) / 6-Monthly',
    basis: 'STANDARD',
    guidance: 'BS 5839-1',
    notes: 'RRO 2005 Article 17 requires suitable maintenance in efficient working order.',
  },
  {
    id: 'fire-2',
    category: 'Fire Safety & Detection',
    asset: 'Emergency Escape Lighting',
    activity: 'Monthly functional flicker test, annual full 3-hour battery discharge test',
    frequency: 'Monthly / Annually (3-Hour)',
    basis: 'STANDARD',
    guidance: 'BS 5266-1',
    notes: 'Annual duration test proves battery capacity under real power failure.',
  },
  {
    id: 'fire-3',
    category: 'Fire Safety & Detection',
    asset: 'Fire Dampers',
    activity: 'Drop testing, visual inspection, reset check, and fuselage mechanism service',
    frequency: 'Annually',
    basis: 'STANDARD',
    guidance: 'BS 9999 / BESA DW145',
    notes: 'Essential for maintaining compartmentation integrity across ducted routes.',
  },

  // Electrical
  {
    id: 'elec-1',
    category: 'Electrical & Power',
    asset: 'Fixed Electrical Installation',
    activity: 'Periodic inspection and testing resulting in an EICR certificate',
    frequency: 'Up to 5 Years / Risk-Based',
    basis: 'STANDARD',
    guidance: 'Electricity at Work Regs 1989 / BS 7671',
    notes: 'Interval set by environment. Industrial and public sites require shorter cycles.',
  },
  {
    id: 'elec-2',
    category: 'Electrical & Power',
    asset: 'Distribution Boards & Switchgear',
    activity: 'Thermal imaging survey under load, torque verification, switchroom audit',
    frequency: 'Annually',
    basis: 'PRACTICE',
    guidance: 'IET Electrical Maintenance Code',
    notes: 'Identifies resistive heating and loose connections prior to catastrophic outage.',
  },
  {
    id: 'elec-3',
    category: 'Electrical & Power',
    asset: 'EV Charging Points',
    activity: 'RCD testing, visual cable survey, earth loop impedance, socket locking check',
    frequency: 'Annually',
    basis: 'STANDARD',
    guidance: 'IET Code of Practice for EV Charging',
    notes: 'Ensures public and fleet vehicle charging safety and electrical continuity.',
  },

  // Water Hygiene
  {
    id: 'water-1',
    category: 'Water Hygiene & Legionella',
    asset: 'Hot & Cold Water Services',
    activity: 'Monthly sentinel temperature monitoring (calorifiers, unblended taps)',
    frequency: 'Monthly',
    basis: 'STANDARD',
    guidance: 'ACOP L8 / HSG274 Part 2',
    notes: 'Cold below 20°C within 2 mins; hot above 50°C (55°C healthcare) within 1 min.',
  },
  {
    id: 'water-2',
    category: 'Water Hygiene & Legionella',
    asset: 'Thermostatic Mixing Valves (TMVs)',
    activity: 'Fail-safe shut-off testing, temperature check, strainers clean',
    frequency: 'Annually / 6-Monthly',
    basis: 'STANDARD',
    guidance: 'HTM 04-01 / D08 / HSG274',
    notes: 'Prevents scalding in commercial, education, care and public realm buildings.',
  },
  {
    id: 'water-3',
    category: 'Water Hygiene & Legionella',
    asset: 'Cold Water Storage Tanks',
    activity: 'Annual internal visual inspection, sediment check, temperature survey',
    frequency: 'Annually',
    basis: 'STANDARD',
    guidance: 'ACOP L8 / HSG274',
    notes: 'Clean and disinfection triggered only when visual inspection indicates necessity.',
  },

  // Gas & Heating
  {
    id: 'gas-1',
    category: 'Commercial Gas & Heating',
    asset: 'Commercial Boilers & Burners',
    activity: 'Combustion efficiency check, flue gas analysis, burner clean, safety controls',
    frequency: 'Annually',
    basis: 'PRACTICE',
    guidance: 'Gas Safety (Installation & Use) Regs 1998 Reg 35',
    notes: 'Continuous duty to maintain in a safe condition; annual service is industry standard.',
  },
  {
    id: 'gas-2',
    category: 'Commercial Gas & Heating',
    asset: 'Gas Safety Interlocks & Proving',
    activity: 'Airflow switch verification, emergency gas shut-off valve operational check',
    frequency: '6-Monthly / Annually',
    basis: 'STANDARD',
    guidance: 'IGEM/UP/19 / BS 6173',
    notes: 'Critical safety system for commercial kitchens, plantrooms, and boilerhouses.',
  },

  // Lifting & Lifts
  {
    id: 'lift-1',
    category: 'Lifting & Vertical Transport',
    asset: 'Passenger Lifts',
    activity: 'Thorough examination by an independent competent person',
    frequency: '6-Monthly',
    basis: 'LEGAL',
    guidance: 'LOLER 1998 Regulation 9(3)(a)',
    notes: 'Statutory 6-month interval applies strictly to equipment carrying persons.',
  },
  {
    id: 'lift-2',
    category: 'Lifting & Vertical Transport',
    asset: 'Goods Lifts & Dock Levellers',
    activity: 'Thorough examination by an independent competent person',
    frequency: '12-Monthly',
    basis: 'LEGAL',
    guidance: 'LOLER 1998 Regulation 9(3)(b)',
    notes: 'Statutory 12-month interval for goods-only lifting equipment.',
  },

  // Security & Access
  {
    id: 'sec-1',
    category: 'Security & Access Control',
    asset: 'Automatic Doors & Gates',
    activity: 'Force testing, safety sensor check, break-out mechanism service',
    frequency: '6-Monthly',
    basis: 'STANDARD',
    guidance: 'BS EN 16005 / BS EN 12453 / Machinery Directive',
    notes: 'Ensures impact force safety and emergency escape compliance.',
  },
  {
    id: 'sec-2',
    category: 'Security & Access Control',
    asset: 'Access Control & Electronic Locks',
    activity: 'Fire alarm fail-safe interface test, battery backup load test, reader check',
    frequency: '6-Monthly / Annually',
    basis: 'PRACTICE',
    guidance: 'BS EN 60839 / Fire Safety Order',
    notes: 'Verifies that all mag-locks release automatically on fire alarm activation.',
  },

  // Building Fabric
  {
    id: 'fab-1',
    category: 'Building Fabric & Roofs',
    asset: 'Fire Doors',
    activity: 'Inspection of gaps (2–4mm), intumescent seals, hinges, self-closers',
    frequency: '6-Monthly',
    basis: 'STANDARD',
    guidance: 'BS 8214 / Fire Safety (England) Regs 2022',
    notes: 'Quarterly checks required in residential blocks >11m under 2022 Regulations.',
  },
  {
    id: 'fab-2',
    category: 'Building Fabric & Roofs',
    asset: 'Commercial Roofs & Gutters',
    activity: 'Drone survey or physical walk of valley gutters, outlets, flashing, rooflights',
    frequency: 'Bi-Annually (Autumn/Spring)',
    basis: 'PRACTICE',
    guidance: 'RICS Building Maintenance Guidance',
    notes: 'Prevents internal water ingress, fabric degradation, and drainage blockages.',
  },
];

const CATEGORIES = Array.from(new Set(ALL_PPM_TASKS.map((t) => t.category)));

export function TemplatePpmBuilder({ route, content }: TemplateProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES);
  const [basisFilter, setBasisFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Tools', url: '/tools' },
    { name: 'PPM Schedule Builder', url: '/tools/ppm-schedule-builder' },
  ];

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const selectAll = () => setSelectedCategories(CATEGORIES);
  const selectNone = () => setSelectedCategories([]);

  const filteredTasks = useMemo(() => {
    return ALL_PPM_TASKS.filter((task) => {
      const matchCat = selectedCategories.includes(task.category);
      const matchBasis = basisFilter === 'ALL' || task.basis === basisFilter;
      const matchSearch =
        searchQuery === '' ||
        task.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.guidance.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchBasis && matchSearch;
    });
  }, [selectedCategories, basisFilter, searchQuery]);

  const handleExportCsv = () => {
    const headers = ['Category', 'Asset', 'Maintenance Activity', 'Frequency', 'Basis', 'Governing Guidance', 'Notes'];
    const rows = filteredTasks.map((t) => [
      `"${t.category}"`,
      `"${t.asset}"`,
      `"${t.activity}"`,
      `"${t.frequency}"`,
      `"${t.basis}"`,
      `"${t.guidance}"`,
      `"${t.notes}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EntireFM_PPM_Schedule_Matrix_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-void text-white">
        <ToolHero
          breadcrumbs={breadcrumbs}
          eyebrow="Asset-Led Maintenance Planner"
          title="PPM Schedule Builder"
          description="Select your building services and installed plant to generate a structured Planned Preventative Maintenance schedule matrix with verified statutory, standard, and risk-based intervals."
          timeEstimate="~4 minutes"
          deliverables={[
            'Bespoke planned maintenance matrix',
            'LEGAL / STANDARD / PRACTICE / RISK basis tags',
            'Governing legislation references for each task',
            'CSV export with date-stamped filename',
            'Print-ready A4 schedule',
          ]}
          accent="blue"
          icon={Wrench}
        />

        {/* Builder Controls & Output */}
        <section className="py-14 bg-brand-carbon">
          <div className="container-custom">
            {/* Category selection bar */}
            <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-edge-dark pb-4 mb-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    Step 1: Select Installed Building Assets
                  </h2>
                  <p className="text-xs text-brand-mist/60 mt-0.5">
                    Filter by asset category to tailor the matrix to your building scope.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-brand-electric-bright hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-white/20">|</span>
                  <button
                    type="button"
                    onClick={selectNone}
                    className="text-brand-mist/50 hover:text-white"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center gap-2.5 p-3 rounded-sm border text-xs text-left transition-all ${
                        active
                          ? 'border-brand-electric-bright bg-brand-electric/10 text-white font-medium'
                          : 'border-brand-edge-dark bg-white/[0.02] text-brand-mist/50 hover:bg-white/[0.04]'
                      }`}
                    >
                      {active ? (
                        <CheckSquare className="h-4 w-4 text-brand-electric-bright shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-brand-mist/30 shrink-0" />
                      )}
                      <span className="truncate">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter and Export Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-mist/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks, assets, standards..."
                    className="h-9 w-60 rounded-sm border border-brand-edge-dark bg-brand-graphite pl-9 pr-3 text-xs text-white placeholder-brand-mist/40 focus:border-brand-electric/80 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-brand-mist/60 bg-brand-graphite border border-brand-edge-dark rounded-sm px-2.5 h-9">
                  <Filter className="h-3 w-3 text-brand-mist/40" />
                  <span>Basis:</span>
                  <select
                    value={basisFilter}
                    onChange={(e) => setBasisFilter(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-xs font-medium cursor-pointer"
                  >
                    <option value="ALL" className="bg-brand-graphite">All Levels</option>
                    <option value="LEGAL" className="bg-brand-graphite">LEGAL (Statute)</option>
                    <option value="STANDARD" className="bg-brand-graphite">STANDARD (BS/ACOP)</option>
                    <option value="PRACTICE" className="bg-brand-graphite">PRACTICE (Industry)</option>
                    <option value="RISK" className="bg-brand-graphite">RISK (Assessed)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-brand-mist/50 hidden sm:inline">
                  Showing {filteredTasks.length} tasks
                </span>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="btn-primary py-2 px-3 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn-ghost-light py-2 px-3 text-xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-sm border border-brand-edge-dark bg-brand-graphite">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-edge-dark bg-brand-carbon text-[11px] font-semibold uppercase tracking-wider text-brand-mist/60">
                    <th className="py-3.5 px-4">Asset / System</th>
                    <th className="py-3.5 px-4">Maintenance & Inspection Activity</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Frequency</th>
                    <th className="py-3.5 px-4">Basis</th>
                    <th className="py-3.5 px-4">Governing Guidance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-edge-dark">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((t) => {
                      const basisColor =
                        t.basis === 'LEGAL'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : t.basis === 'STANDARD'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : t.basis === 'PRACTICE'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30';

                      return (
                        <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white align-top">
                            <span className="block">{t.asset}</span>
                            <span className="text-[10px] text-brand-mist/40 uppercase tracking-wider block mt-0.5">
                              {t.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-brand-mist/80 align-top max-w-xs sm:max-w-sm">
                            <p>{t.activity}</p>
                            <p className="text-[11px] text-brand-mist/50 mt-1 italic">{t.notes}</p>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-white align-top whitespace-nowrap">
                            {t.frequency}
                          </td>
                          <td className="py-3.5 px-4 align-top whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${basisColor}`}>
                              {t.basis}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[11px] font-mono text-brand-mist/70 align-top">
                            {t.guidance}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-brand-mist/50">
                        No maintenance tasks match your selected categories and filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Legend explanation */}
            <div className="mt-8 grid gap-4 sm:grid-cols-4 rounded-sm border border-brand-edge-dark bg-brand-graphite p-4 text-[11px]">
              <div>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-1">
                  LEGAL
                </span>
                <p className="text-brand-mist/60">Explicit statutory legislation where the law specifies testing intervals.</p>
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-1">
                  STANDARD
                </span>
                <p className="text-brand-mist/60">British Standard (BS) or HSE Approved Code of Practice (ACOP).</p>
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                  PRACTICE
                </span>
                <p className="text-brand-mist/60">Recognised good engineering practice and CIBSE recommendations.</p>
              </div>
              <div>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1">
                  RISK
                </span>
                <p className="text-brand-mist/60">Frequency determined by environment, occupancy, and asset condition.</p>
              </div>
            </div>

            {/* Conversion Bridge */}
            <div className="mt-8">
              <ResultsConversionBridge
                headline="Ready to put this PPM matrix into action?"
                body="EntireFM can mobilise a managed PPM contract based on your asset selection within 30 days. Structured delivery, certified engineers, and CAFM-tracked completion records."
                ctaPrimary={{ label: 'Get a PPM Contract Proposal', href: '/contact-us' }}
                ctaSecondary={{ label: 'Learn about EntireFM PPM', href: '/ppm' }}
                accent="blue"
              />
            </div>
          </div>
        </section>

        <TrustBar />
        <ProposalSection />
      </main>
      <Footer />
    </>
  );
}
