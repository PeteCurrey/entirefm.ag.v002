'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Clock,
  FileCheck,
  CheckCircle2,
  Building2,
  PiggyBank,
  BadgePercent,
  Sparkles,
  Info,
  BarChart3,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { ToolPdfGateModal } from '@/components/tools/ToolPdfGateModal';
import { downloadFmRoiPack, FmRoiReportData } from '@/lib/pdf/fm-roi-pack-builder';
import type { TemplateProps } from '../types';

// ---------------------------------------------------------------------------
// SMOOTH NUMBER INTERPOLATION HOOK (250ms cubic ease-out)
// ---------------------------------------------------------------------------
function useAnimatedValue(target: number, duration = 250): number {
  const [current, setCurrent] = useState(target);
  const currentRef = useRef(target);
  currentRef.current = current;

  useEffect(() => {
    const start = currentRef.current;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      const next = Math.round(start + diff * ease);
      setCurrent(next);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    const handle = requestAnimationFrame(step);
    return () => cancelAnimationFrame(handle);
  }, [target, duration]);

  return current;
}

export function TemplateRoiCalculator({ route, content }: TemplateProps) {
  // Inputs
  const [portfolioSites, setPortfolioSites] = useState<number>(3); // Number of buildings / sites
  const [reactiveSpend, setReactiveSpend] = useState<number>(45000); // £/year reactive callouts
  const [currentPpmSpend, setCurrentPpmSpend] = useState<number>(30000); // Current PPM spend (£)
  const [supplierCount, setSupplierCount] = useState<number>(5); // Number of independent FM contractors
  const [adminHoursPerMonth, setAdminHoursPerMonth] = useState<number>(20); // Hours/month managing FM/invoices
  const [hourlyAdminRate, setHourlyAdminRate] = useState<number>(35); // Internal rate £/hour
  const [unplannedOutages, setUnplannedOutages] = useState<number>(4); // Outages/year
  const [avgOutageCost, setAvgOutageCost] = useState<number>(2500); // Disruption cost per outage (£)

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
    { name: 'FM ROI / TCO Calculator', url: '/tools/fm-roi-calculator' },
  ];

  // PLACEHOLDER ASSUMPTION: UI ceiling scaling heuristic (£150k * (1 + portfolioSites * 0.3)).
  // Designed solely for responsive slider range headroom across 1-50 sites; does not alter output calculation formulas.
  const reactiveCeiling = useMemo(() => {
    return Math.max(100000, Math.round(150000 * (1 + portfolioSites * 0.3)));
  }, [portfolioSites]);

  const ppmCeiling = useMemo(() => {
    return Math.max(80000, Math.round(100000 * (1 + portfolioSites * 0.25)));
  }, [portfolioSites]);

  // Determine Portfolio Band for AI Context Cache
  const portfolioBand = useMemo(() => {
    if (portfolioSites <= 1) return 'single';
    if (portfolioSites <= 5) return 'multi';
    if (portfolioSites <= 15) return 'estate';
    return 'nationwide';
  }, [portfolioSites]);

  // Fetch "Why This Works" AI commentary when portfolio band changes
  useEffect(() => {
    let cancelled = false;
    async function loadWhyItWorks() {
      setWhyItWorksLoading(true);
      try {
        const res = await fetch(`/api/tools/fm-roi-calculator/market-context?band=${portfolioBand}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (!cancelled && data.success && data.content) {
          setWhyItWorksText(data.content);
          setWhyItWorksSource(data.source);
        }
      } catch {
        if (!cancelled) {
          setWhyItWorksText(
            'Consolidating fragmented maintenance contractors under a single planned delivery model replaces disconnected callouts with structured, multidisciplinary engineering visits. Integrating mechanical, electrical, and statutory obligations within one planned schedule eliminates duplicate dispatch travel fees and reduces administrative processing time. Proactive servicing identifies mechanical degradation before plant failure occurs, significantly dampening emergency callouts and protecting continuous commercial uptime.'
          );
          setWhyItWorksSource('DETERMINISTIC');
        }
      } finally {
        if (!cancelled) {
          setWhyItWorksLoading(false);
        }
      }
    }

    loadWhyItWorks();
    return () => {
      cancelled = true;
    };
  }, [portfolioBand]);

  // Indicative Mathematical Model (Portfolio Consolidation Factors)
  const calculation = useMemo(() => {
    // Current Model Baseline
    const annualAdminCost = adminHoursPerMonth * 12 * hourlyAdminRate;
    const annualOutageCost = unplannedOutages * avgOutageCost;
    const currentTotalTco = reactiveSpend + currentPpmSpend + annualAdminCost + annualOutageCost;

    // Indicative Multi-Site Efficiency Adjustments
    // Tiered PPM economies of scale across clustered visits
    const ppmEfficiencyFactor = portfolioSites > 10 ? 0.88 : portfolioSites > 3 ? 0.92 : 0.95;
    // Multi-contractor admin reduction factor
    const adminConsolidationFactor = supplierCount > 4 ? 0.15 : 0.25;

    // Indicative Projections
    const projectedReactiveSpend = Math.round(reactiveSpend * 0.65); // ~35% reactive suppression
    const projectedPpmSpend = Math.round(currentPpmSpend * ppmEfficiencyFactor);
    const projectedAdminCost = Math.round(annualAdminCost * adminConsolidationFactor);
    const projectedOutageCost = Math.round(annualOutageCost * 0.40); // ~60% outage risk mitigation
    const projectedTotalTco = projectedReactiveSpend + projectedPpmSpend + projectedAdminCost + projectedOutageCost;

    const totalPotentialSavings = currentTotalTco - projectedTotalTco;
    const percentageSavings = currentTotalTco > 0 ? Math.round((totalPotentialSavings / currentTotalTco) * 100) : 0;
    const fiveYearSavings = totalPotentialSavings * 5;

    // Cumulative progression over 5 years
    const fiveYearCumulative = [
      { year: 'Yr 1', annual: totalPotentialSavings, cumulative: totalPotentialSavings },
      { year: 'Yr 2', annual: totalPotentialSavings, cumulative: totalPotentialSavings * 2 },
      { year: 'Yr 3', annual: totalPotentialSavings, cumulative: totalPotentialSavings * 3 },
      { year: 'Yr 4', annual: totalPotentialSavings, cumulative: totalPotentialSavings * 4 },
      { year: 'Yr 5', annual: totalPotentialSavings, cumulative: totalPotentialSavings * 5 },
    ];

    return {
      annualAdminCost,
      annualOutageCost,
      currentTotalTco,
      projectedReactiveSpend,
      projectedPpmSpend,
      projectedAdminCost,
      projectedOutageCost,
      projectedTotalTco,
      totalPotentialSavings,
      percentageSavings,
      fiveYearSavings,
      fiveYearCumulative,
      ppmSavings: currentPpmSpend - projectedPpmSpend,
      reactiveSavings: reactiveSpend - projectedReactiveSpend,
      adminSavings: annualAdminCost - projectedAdminCost,
      outageSavings: annualOutageCost - projectedOutageCost,
    };
  }, [
    portfolioSites,
    reactiveSpend,
    currentPpmSpend,
    supplierCount,
    adminHoursPerMonth,
    hourlyAdminRate,
    unplannedOutages,
    avgOutageCost,
  ]);

  // Animated values for 250ms smooth transition
  const animTotalSavings = useAnimatedValue(calculation.totalPotentialSavings);
  const animFiveYearSavings = useAnimatedValue(calculation.fiveYearSavings);
  const animPercentageSavings = useAnimatedValue(calculation.percentageSavings);
  const animCurrentTco = useAnimatedValue(calculation.currentTotalTco);
  const animProjectedTco = useAnimatedValue(calculation.projectedTotalTco);

  // Download PDF Handler (Formal Multi-Page Appraisal Pack)
  const handleExecutePdfDownload = () => {
    const reportData: FmRoiReportData = {
      portfolioSites,
      reactiveSpend,
      currentPpmSpend,
      supplierCount,
      adminHoursPerMonth,
      hourlyAdminRate,
      unplannedOutages,
      avgOutageCost,
      annualAdminCost: calculation.annualAdminCost,
      annualOutageCost: calculation.annualOutageCost,
      currentTotalTco: calculation.currentTotalTco,
      projectedReactiveSpend: calculation.projectedReactiveSpend,
      projectedPpmSpend: calculation.projectedPpmSpend,
      projectedAdminCost: calculation.projectedAdminCost,
      projectedOutageCost: calculation.projectedOutageCost,
      projectedTotalTco: calculation.projectedTotalTco,
      totalPotentialSavings: calculation.totalPotentialSavings,
      percentageSavings: calculation.percentageSavings,
      fiveYearSavings: calculation.fiveYearSavings,
      fiveYearCumulative: calculation.fiveYearCumulative,
      whyThisWorksText: whyItWorksText || undefined,
      whyThisWorksSource: whyItWorksSource || undefined,
    };

    downloadFmRoiPack(reportData, `EntireFM-TCO-Appraisal-${portfolioSites}-sites.pdf`);
  };

  // CSV Export (100% ungated)
  const handleDownloadCsv = () => {
    const rows = [
      ['EntireFM Commercial TCO & ROI Financial Appraisal'],
      ['Generated Date', new Date().toLocaleDateString('en-GB')],
      ['Portfolio Buildings / Sites', portfolioSites.toString()],
      ['Current Contractors', supplierCount.toString()],
      ['Admin Hours / Month', adminHoursPerMonth.toString()],
      ['Internal Hourly Admin Rate', `£${hourlyAdminRate}`],
      ['Unplanned Outages / Year', unplannedOutages.toString()],
      ['Average Outage Disruption Cost', `£${avgOutageCost}`],
      [''],
      ['COST CATEGORY', 'CURRENT BASELINE (£)', 'INDICATIVE CONSOLIDATED (£)', 'ANNUAL VARIANCE (£)'],
      [
        'Reactive Repairs & Emergency Callouts',
        reactiveSpend.toString(),
        calculation.projectedReactiveSpend.toString(),
        (reactiveSpend - calculation.projectedReactiveSpend).toString(),
      ],
      [
        'Planned Preventative Maintenance (PPM)',
        currentPpmSpend.toString(),
        calculation.projectedPpmSpend.toString(),
        (currentPpmSpend - calculation.projectedPpmSpend).toString(),
      ],
      [
        'Internal Contract Admin & Invoicing Overhead',
        calculation.annualAdminCost.toString(),
        calculation.projectedAdminCost.toString(),
        (calculation.annualAdminCost - calculation.projectedAdminCost).toString(),
      ],
      [
        'Unplanned Outages & Disruption Cost',
        calculation.annualOutageCost.toString(),
        calculation.projectedOutageCost.toString(),
        (calculation.annualOutageCost - calculation.projectedOutageCost).toString(),
      ],
      [
        'TOTAL ANNUAL ESTATE TCO',
        calculation.currentTotalTco.toString(),
        calculation.projectedTotalTco.toString(),
        calculation.totalPotentialSavings.toString(),
      ],
      [''],
      ['5-YEAR CUMULATIVE VALUE (£)', calculation.fiveYearSavings.toString()],
      ['INDICATIVE EFFICIENCY GAIN (%)', `${calculation.percentageSavings}%`],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EntireFM-TCO-Appraisal-${portfolioSites}-sites.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Comparative Cost Categories for Chart
  const categories = [
    {
      name: 'Reactive Spend',
      current: reactiveSpend,
      projected: calculation.projectedReactiveSpend,
      color: 'bg-rose-500',
    },
    {
      name: 'Planned PPM',
      current: currentPpmSpend,
      projected: calculation.projectedPpmSpend,
      color: 'bg-brand-electric',
    },
    {
      name: 'Contract Admin',
      current: calculation.annualAdminCost,
      projected: calculation.projectedAdminCost,
      color: 'bg-amber-500',
    },
    {
      name: 'Outage Risk',
      current: calculation.annualOutageCost,
      projected: calculation.projectedOutageCost,
      color: 'bg-purple-500',
    },
  ];

  const maxCategoryCost = Math.max(...categories.map((c) => Math.max(c.current, c.projected)), 1000);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <div className="flex-grow">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="FM ROI / TCO Calculator"
          purpose="Model the commercial total cost of ownership across fragmented multi-contractor estates versus an integrated planned delivery model."
          timeEstimate="2 min"
          outputs={['PDF Financial Model', 'CSV Data Export']}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Sliders Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-electric" />
                    <span className="text-[11px] tracking-widest text-slate-500 uppercase font-light">
                      01 / Portfolio Parameters
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extralight text-slate-900 mt-1">
                    Estate Operating Cost Profile
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Adjust parameters to reflect your estate&apos;s current annual maintenance expenditure, contractor
                    spread, and internal management overhead.
                  </p>
                </div>

                {/* Number of Buildings / Sites Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Number of Buildings / Sites in Portfolio</span>
                    </label>
                    <span className="text-sm font-normal text-slate-900 bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200">
                      {portfolioSites} {portfolioSites === 1 ? 'Site' : 'Sites'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={portfolioSites}
                    onChange={(e) => setPortfolioSites(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <div className="flex items-start justify-between text-[11px] text-slate-500 font-light pt-0.5">
                    <span>
                      Indicative portfolio scale — multi-site estates typically achieve tiered procurement
                      efficiencies and reduced contractor administration overhead across unified PPM contracts.
                    </span>
                  </div>
                </div>

                {/* Reactive Spend Slider */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Annual Reactive Repairs &amp; Callout Spend
                    </label>
                    <span className="text-sm font-normal text-brand-electric bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100 tabular-nums">
                      £{reactiveSpend.toLocaleString()} / yr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max={reactiveCeiling}
                    step="2500"
                    value={reactiveSpend}
                    onChange={(e) => setReactiveSpend(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <div className="flex items-start justify-between text-[11px] text-slate-500 font-light pt-0.5">
                    <span>
                      Typical range: £15,000–£120,000/yr across commercial portfolios. Proactive planned maintenance
                      regimes identify component wear early, reducing avoidable emergency callouts and premium
                      out-of-hours tariffs.
                    </span>
                  </div>
                </div>

                {/* Current PPM Spend Slider */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Annual Planned Maintenance (PPM) Contracts
                    </label>
                    <span className="text-sm font-normal text-brand-electric bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100 tabular-nums">
                      £{currentPpmSpend.toLocaleString()} / yr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max={ppmCeiling}
                    step="2500"
                    value={currentPpmSpend}
                    onChange={(e) => setCurrentPpmSpend(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <div className="flex items-start justify-between text-[11px] text-slate-500 font-light pt-0.5">
                    <span>
                      Typical range: £20,000–£90,000/yr. Consolidated multi-site agreements typically unlock tiered
                      economies of scale (indicatively 5% to 12% across multi-property portfolios).
                    </span>
                  </div>
                </div>

                {/* Supplier Count Slider */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Number of Independent FM Contractors
                    </label>
                    <span className="text-sm font-normal text-slate-900 bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200">
                      {supplierCount} {supplierCount === 1 ? 'Contractor' : 'Contractors'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={supplierCount}
                    onChange={(e) => setSupplierCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <div className="flex items-start justify-between text-[11px] text-slate-500 font-light pt-0.5">
                    <span>
                      Typical range: 4–8 separate specialist trades. Consolidating under an integrated model can reduce
                      fragmented contract administration toward the higher end of typical multi-site consolidation
                      patterns (indicatively 70–85% reduction in administrative handling).
                    </span>
                  </div>
                </div>

                {/* Internal Admin Hours */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Internal Management &amp; Invoicing Overhead
                    </label>
                    <span className="text-sm font-normal text-slate-900 bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200 tabular-nums">
                      {adminHoursPerMonth} hrs / mo (~£{calculation.annualAdminCost.toLocaleString()}/yr)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="5"
                    value={adminHoursPerMonth}
                    onChange={(e) => setAdminHoursPerMonth(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <div className="flex items-start justify-between text-[11px] text-slate-500 font-light pt-0.5">
                    <span>
                      Typical range: 15–40 hours/month spent chasing trade suppliers, auditing job sheets, and verifying
                      disparate invoices.
                    </span>
                  </div>
                </div>

                {/* Hourly Admin Rate */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Internal Admin Hourly Rate
                    </label>
                    <span className="text-sm font-normal text-slate-900 bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200 tabular-nums">
                      £{hourlyAdminRate} / hr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="65"
                    step="5"
                    value={hourlyAdminRate}
                    onChange={(e) => setHourlyAdminRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <div className="flex items-start justify-between text-[11px] text-slate-500 font-light pt-0.5">
                    <span>
                      Typical range: £25–£45/hour fully burdened internal facilities management / administration labour
                      rate.
                    </span>
                  </div>
                </div>

                {/* Outage / Disruption Assumptions */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Unplanned Asset Outages / Disruptions
                    </label>
                    <span className="text-sm font-normal text-rose-700 bg-rose-50 px-2.5 py-1 rounded-sm border border-rose-100 tabular-nums">
                      {unplannedOutages} Events (~£{calculation.annualOutageCost.toLocaleString()}/yr)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={unplannedOutages}
                    onChange={(e) => setUnplannedOutages(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <div className="flex items-start justify-between text-[11px] text-slate-500 font-light pt-0.5">
                    <span>
                      Typical range: 2–6 unplanned plant interruptions annually (chillers, boilers, distribution
                      boards). Structured compliance checks and preventative servicing significantly mitigate plant
                      failure risks and tenant disruption.
                    </span>
                  </div>
                </div>
              </div>

              {/* "Why This Works" AI Commentary Section */}
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Why Consolidation Works
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
                    <span>Loading operational context...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-light">
                      {whyItWorksText}
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400">
                      <span>General commercial FM restructuring principles (IWFM / SFG20 aligned)</span>
                      <span>100% Qualitative Guidance</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Dashboard Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white border border-slate-200 rounded-sm shadow-md p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-normal text-slate-500 uppercase tracking-wider">
                    02 / Financial Model Output
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    {animPercentageSavings}% Indicative Gain
                  </span>
                </div>

                {/* Primary Financial Benefit Card */}
                <div className="rounded-sm bg-[#0B1220] p-6 text-white space-y-2 relative overflow-hidden shadow-sm">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(ellipse at 80% 0%, rgba(37, 99, 235, 0.6), transparent 70%)`,
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-normal uppercase tracking-wider text-slate-300 block">
                      Projected Annual TCO Reduction
                    </span>
                    <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                      Indicative Target
                    </span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-light text-emerald-400 tracking-tight tabular-nums">
                    £{animTotalSavings.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-300">
                    <span>5-Year Cumulative Value:</span>
                    <strong className="text-white font-normal text-sm tabular-nums">
                      £{animFiveYearSavings.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* VISUAL 1: Comparative Grouped Bar Chart */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-normal text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Cost Allocation Comparison</span>
                    </h3>
                    <span className="text-[10.5px] text-slate-400 font-light">Current vs. Projected</span>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-sm space-y-3.5">
                    {categories.map((cat, idx) => {
                      const currentPct = Math.min(100, Math.round((cat.current / maxCategoryCost) * 100));
                      const projectedPct = Math.min(100, Math.round((cat.projected / maxCategoryCost) * 100));

                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-700 font-medium">{cat.name}</span>
                            <div className="text-right tabular-nums">
                              <span className="text-slate-400 line-through text-[11px] mr-1.5">
                                £{cat.current.toLocaleString()}
                              </span>
                              <span className="text-slate-900 font-semibold">
                                £{cat.projected.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            {/* Baseline Bar */}
                            <div className="h-2 w-full bg-slate-200 rounded-xs overflow-hidden">
                              <div
                                className="h-full bg-slate-400 transition-all duration-300 ease-out"
                                style={{ width: `${currentPct}%` }}
                                title={`Baseline: £${cat.current.toLocaleString()}`}
                              />
                            </div>
                            {/* Projected Bar */}
                            <div className="h-2 w-full bg-slate-200 rounded-xs overflow-hidden">
                              <div
                                className={`h-full ${cat.color} transition-all duration-300 ease-out`}
                                style={{ width: `${projectedPct}%` }}
                                title={`Projected: £${cat.projected.toLocaleString()}`}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-slate-400 rounded-xs inline-block" />
                        <span>Baseline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-brand-electric rounded-xs inline-block" />
                        <span>Consolidated</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VISUAL 2: 5-Year Cumulative Value Line/Area Chart */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-normal text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>5-Year Value Trajectory</span>
                    </h3>
                    <span className="text-[10.5px] text-emerald-700 font-medium">Progressive Accumulation</span>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-sm space-y-3">
                    {/* Responsive Native SVG Line/Area Chart */}
                    <div className="relative w-full h-32 flex items-center justify-center">
                      <svg viewBox="0 0 320 120" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <line x1="20" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                        <line x1="20" y1="60" x2="300" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                        <line x1="20" y1="100" x2="300" y2="100" stroke="#cbd5e1" strokeWidth="1" />

                        {/* Area Fill */}
                        <polygon
                          points="20,100 20,84 90,68 160,52 230,36 300,20 300,100"
                          fill="url(#valueGrad)"
                        />

                        {/* Trend Line */}
                        <polyline
                          points="20,84 90,68 160,52 230,36 300,20"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Data Points */}
                        {[
                          { cx: 20, cy: 84, val: calculation.fiveYearCumulative[0].cumulative },
                          { cx: 90, cy: 68, val: calculation.fiveYearCumulative[1].cumulative },
                          { cx: 160, cy: 52, val: calculation.fiveYearCumulative[2].cumulative },
                          { cx: 230, cy: 36, val: calculation.fiveYearCumulative[3].cumulative },
                          { cx: 300, cy: 20, val: calculation.fiveYearCumulative[4].cumulative },
                        ].map((pt, i) => (
                          <g key={i}>
                            <circle cx={pt.cx} cy={pt.cy} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* Milestone readouts */}
                    <div className="grid grid-cols-5 text-center text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      {calculation.fiveYearCumulative.map((m, i) => (
                        <div key={i}>
                          <div className="font-medium text-slate-700">{m.year}</div>
                          <div className="tabular-nums text-slate-900 font-light">
                            £{Math.round(m.cumulative / 1000)}k
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comparative Cost Summary Table */}
                <div className="space-y-2 pt-1">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-sm flex items-center justify-between font-light text-xs">
                    <span className="text-slate-900 font-medium">Total Estate TCO</span>
                    <div className="text-right tabular-nums">
                      <span className="text-slate-500 line-through text-[11px] mr-2">
                        £{animCurrentTco.toLocaleString()}
                      </span>
                      <strong className="text-brand-electric font-semibold text-sm">
                        £{animProjectedTco.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Softened Methodology Note */}
                <div className="text-[10.5px] text-slate-500 font-light leading-relaxed border-t border-slate-100 pt-3">
                  <p>
                    <strong>Methodology Note:</strong> Figures reflect indicative operational projections based on
                    typical commercial FM consolidation patterns (such as reducing fragmented administrative handling
                    and achieving multi-site PPM economies of scale). These figures do not constitute a fixed commercial
                    proposal.
                  </p>
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                  toolName="FM ROI / TCO Calculator"
                  onDownloadPdf={() => setGateOpen(true)}
                  onDownloadCsv={handleDownloadCsv}
                  pdfLabel="Download Appraisal (PDF)"
                  csvLabel="Export Data (CSV)"
                />
              </div>
            </div>
          </div>

          <ToolConversionCTA
            toolName="FM ROI / TCO Calculator"
            heading="Explore a consolidated FM contract tender?"
            subheading="EntireFM delivers consolidated Hard FM, compliance tracking, and Helpdesk operations with guaranteed SLA performance across commercial estates."
            primaryActionLabel="Request Contract Benchmark"
            primaryActionHref="/contact-us#enquiry"
          />
        </ToolShell>
      </div>

      {/* Reusable Turnstile-Protected Lead Gate Modal */}
      <ToolPdfGateModal
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onSuccess={handleExecutePdfDownload}
        toolTitle="FM ROI & TCO Appraisal"
        annualSavingFormatted={`£${calculation.totalPotentialSavings.toLocaleString()}`}
        leadSource="FM ROI / TCO Calculator"
        conversionPage="/tools/fm-roi-calculator"
        contextPayload={{
          portfolioSites,
          reactiveSpend,
          currentPpmSpend,
          supplierCount,
          adminHoursPerMonth,
          hourlyAdminRate,
          unplannedOutages,
          avgOutageCost,
          currentTotalTco: calculation.currentTotalTco,
          projectedTotalTco: calculation.projectedTotalTco,
          annualSaving: calculation.totalPotentialSavings,
          fiveYearSaving: calculation.fiveYearSavings,
          percentageSaving: calculation.percentageSavings,
        }}
        showCallbackPreference={true}
      />

      <Footer />
    </div>
  );
}
