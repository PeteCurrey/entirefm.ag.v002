'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Building2,
  Layers,
  TrendingUp,
  Sliders,
  CheckCircle2,
  BadgePoundSterling,
  MapPin,
  Clock,
  AlertTriangle,
  Sparkles,
  Lock,
  Send,
  X,
  FileSpreadsheet,
  Info,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { TurnstileWidget } from '@/components/auth/TurnstileWidget';
import { downloadPpmEstimatorPack, PpmEstimatorReportData } from '@/lib/pdf/ppm-estimator-pack-builder';
import type { TemplateProps } from '../types';

interface SectorMultiplier {
  name: string;
  baseRateSqFt: number; // Base annual PPM rate £/sq ft
  complexityFactor: number;
}

const SECTORS: Record<string, SectorMultiplier> = {
  office: { name: 'Commercial Office / Corporate HQ', baseRateSqFt: 1.45, complexityFactor: 1.0 },
  industrial: { name: 'Industrial & Manufacturing Facility', baseRateSqFt: 1.85, complexityFactor: 1.25 },
  logistics: { name: 'Logistics & Distribution Warehousing', baseRateSqFt: 0.95, complexityFactor: 0.85 },
  retail: { name: 'Retail & Shopping Centres', baseRateSqFt: 1.65, complexityFactor: 1.15 },
  healthcare: { name: 'Healthcare & Clinical Environments', baseRateSqFt: 2.25, complexityFactor: 1.4 },
  hospitality: { name: 'Hotels & Hospitality Estates', baseRateSqFt: 1.75, complexityFactor: 1.2 },
  education: { name: 'Education & University Campuses', baseRateSqFt: 1.35, complexityFactor: 0.95 },
};

interface RegionMultiplier {
  name: string;
  multiplier: number;
  badge?: string;
}

const REGIONS: Record<string, RegionMultiplier> = {
  london: { name: 'Greater London (Zones 1–6 & M25)', multiplier: 1.15, badge: '+15% London Index' },
  south_east: { name: 'South East & Home Counties', multiplier: 1.08, badge: '+8% Regional Index' },
  midlands: { name: 'Midlands (Birmingham, Nottingham, Derby)', multiplier: 1.00 },
  north_west: { name: 'North West (Manchester, Liverpool)', multiplier: 1.00 },
  yorkshire: { name: 'Yorkshire & Humber (Leeds, Sheffield, Doncaster)', multiplier: 1.00 },
  north_east: { name: 'North East & Scotland Corridor', multiplier: 1.00 },
  national: { name: 'UK Nationwide Multi-Site Portfolio', multiplier: 1.00 },
};

interface OperatingProfileMultiplier {
  name: string;
  desc: string;
  multiplier: number;
}

const OPERATING_PROFILES: Record<string, OperatingProfileMultiplier> = {
  standard: {
    name: 'Standard Business Hours (07:00–19:00)',
    desc: '5 days/week core office or operational cycle',
    multiplier: 1.00,
  },
  extended: {
    name: 'Extended Operations (06:00–22:00)',
    desc: '6–7 days extended retail or shift operations',
    multiplier: 1.12,
  },
  continuous: {
    name: '24/7 Continuous Mission Critical',
    desc: 'Uninterrupted datacentre, hospital, or logistics hub',
    multiplier: 1.28,
  },
  public_footfall: {
    name: 'High Public Footfall / Weekend Operation',
    desc: 'Public leisure, transport, and retail parks',
    multiplier: 1.10,
  },
};

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

interface PdfGateFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
}

const EMPTY_GATE: PdfGateFormData = { name: '', email: '', company: '', phone: '' };

export function TemplatePpmEstimator({ route, content }: TemplateProps) {
  // Input States
  const [sectorKey, setSectorKey] = useState<string>('office');
  const [regionKey, setRegionKey] = useState<string>('london');
  const [operatingProfileKey, setOperatingProfileKey] = useState<string>('standard');
  const [floorArea, setFloorArea] = useState<number>(25000); // in sq ft
  const [siteCount, setSiteCount] = useState<number>(1);
  const [serviceScope, setServiceScope] = useState<'compliance' | 'hard_fm' | 'total_fm'>('hard_fm');
  const [plantAge, setPlantAge] = useState<'new' | 'mid' | 'aged'>('mid');
  const [reactiveMultiplier, setReactiveMultiplier] = useState<number>(1.6);

  // Market Context State
  const [marketContext, setMarketContext] = useState<string | null>(null);
  const [marketContextSource, setMarketContextSource] = useState<string | null>(null);
  const [marketContextLoading, setMarketContextLoading] = useState<boolean>(false);

  // PDF Gate Modal State
  const [gateOpen, setGateOpen] = useState(false);
  const [gateForm, setGateForm] = useState<PdfGateFormData>(EMPTY_GATE);
  const [gateErrors, setGateErrors] = useState<Partial<PdfGateFormData>>({});
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const [gateSubmitted, setGateSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'PPM Cost Estimator', url: '/tools/ppm-estimator' },
  ];

  const sector = SECTORS[sectorKey] || SECTORS.office;
  const region = REGIONS[regionKey] || REGIONS.london;
  const operatingProfile = OPERATING_PROFILES[operatingProfileKey] || OPERATING_PROFILES.standard;

  // Calculation logic (Preserved & extended with region and operating profile)
  const estimate = useMemo(() => {
    const scopeMultiplier = serviceScope === 'compliance' ? 0.45 : serviceScope === 'hard_fm' ? 1.0 : 1.65;
    const ageMultiplier = plantAge === 'new' ? 0.85 : plantAge === 'mid' ? 1.0 : 1.3;
    const multiSiteDiscount = siteCount > 5 ? 0.88 : siteCount > 1 ? 0.94 : 1.0;
    const regionMult = region.multiplier;
    const opMult = operatingProfile.multiplier;

    const baseCost =
      floorArea *
      sector.baseRateSqFt *
      scopeMultiplier *
      ageMultiplier *
      regionMult *
      opMult *
      siteCount *
      multiSiteDiscount;

    const lowerBound = Math.round(baseCost * 0.9);
    const upperBound = Math.round(baseCost * 1.15);
    const midPoint = Math.round((lowerBound + upperBound) / 2);
    const reactiveCost = Math.round(midPoint * reactiveMultiplier);
    const potentialSavings = reactiveCost - midPoint;

    // Indicative Category Allocation
    const hvac = Math.round(midPoint * 0.38);
    const electrical = Math.round(midPoint * 0.22);
    const fireSafety = Math.round(midPoint * 0.18);
    const waterHygiene = Math.round(midPoint * 0.12);
    const otherFabric = Math.round(midPoint * 0.10);

    return {
      lowerBound,
      upperBound,
      midPoint,
      ratePerSqFt: (midPoint / (floorArea * siteCount)).toFixed(2),
      reactiveCost,
      potentialSavings,
      breakdown: { hvac, electrical, fireSafety, waterHygiene, otherFabric },
    };
  }, [sector, region, operatingProfile, floorArea, siteCount, serviceScope, plantAge, reactiveMultiplier]);

  // Smooth animated counter values for 250ms transitions
  const animLowerBound = useAnimatedValue(estimate.lowerBound);
  const animUpperBound = useAnimatedValue(estimate.upperBound);
  const animMidPoint = useAnimatedValue(estimate.midPoint);
  const animReactiveCost = useAnimatedValue(estimate.reactiveCost);
  const animSavings = useAnimatedValue(estimate.potentialSavings);

  // Fetch AI Market Context when sector or region changes
  useEffect(() => {
    let cancelled = false;
    async function loadMarketContext() {
      setMarketContextLoading(true);
      try {
        const res = await fetch(
          `/api/tools/ppm-estimator/market-context?sector=${encodeURIComponent(sectorKey)}&region=${encodeURIComponent(regionKey)}`
        );
        if (!res.ok) throw new Error('Failed to load market context');
        const data = await res.json();
        if (!cancelled && data.success && data.content) {
          setMarketContext(data.content);
          setMarketContextSource(data.source);
        }
      } catch {
        if (!cancelled) {
          setMarketContext(
            'UK commercial estates face continuous upward cost adjustments driven by specialized technical engineering rates and long component lead times. Forward asset planning and routine statutory testing remain essential across all regions to preserve operational compliance and safeguard tenant safety.'
          );
          setMarketContextSource('DETERMINISTIC');
        }
      } finally {
        if (!cancelled) {
          setMarketContextLoading(false);
        }
      }
    }

    loadMarketContext();
    return () => {
      cancelled = true;
    };
  }, [sectorKey, regionKey]);

  // Download PDF Handler (Called after contact gate is completed)
  const triggerPdfDownload = useCallback(() => {
    const scopeLabels: Record<string, string> = {
      compliance: 'Statutory Compliance Only (Mandatory Duties)',
      hard_fm: 'Full Hard FM (Statutory + SFG20 Asset Care)',
      total_fm: 'Total FM Care (Hard FM + 24/7 Dedicated Helpdesk)',
    };
    const ageLabels: Record<string, string> = {
      new: '0–3 Years (Modern Plant Under Warranty)',
      mid: '4–10 Years (Established Operational Plant)',
      aged: '10+ Years (Legacy Aged Systems)',
    };

    const reportData: PpmEstimatorReportData = {
      sectorName: sector.name,
      regionName: region.name,
      operatingProfileName: operatingProfile.name,
      floorArea,
      siteCount,
      serviceScopeLabel: scopeLabels[serviceScope] || 'Full Hard FM',
      plantAgeLabel: ageLabels[plantAge] || 'Established Plant',
      lowerBound: estimate.lowerBound,
      upperBound: estimate.upperBound,
      midPoint: estimate.midPoint,
      ratePerSqFt: estimate.ratePerSqFt,
      reactiveMultiplier,
      reactiveCost: estimate.reactiveCost,
      potentialSavings: estimate.potentialSavings,
      breakdown: estimate.breakdown,
      marketContextText: marketContext || undefined,
      marketContextSource: marketContextSource || undefined,
    };

    downloadPpmEstimatorPack(reportData, `EntireFM-PPM-Cost-Estimate-${sectorKey}-${regionKey}.pdf`);
  }, [
    sector,
    region,
    operatingProfile,
    floorArea,
    siteCount,
    serviceScope,
    plantAge,
    estimate,
    reactiveMultiplier,
    marketContext,
    marketContextSource,
    sectorKey,
    regionKey,
  ]);

  // PDF Gate Submission Handler
  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<PdfGateFormData> = {};
    if (!gateForm.name.trim() || gateForm.name.trim().length < 2) {
      errors.name = 'Full name is required';
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gateForm.email);
    if (!emailOk) {
      errors.email = 'A valid work email is required';
    }
    if (!gateForm.company.trim()) {
      errors.company = 'Company or organisation name is required';
    }

    if (Object.keys(errors).length > 0) {
      setGateErrors(errors);
      return;
    }

    setGateErrors({});
    setGateSubmitting(true);

    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: gateForm.name,
          email: gateForm.email,
          company: gateForm.company,
          phone: gateForm.phone || 'Not provided',
          service: `PPM Cost Estimate — ${sector.name}`,
          location: region.name,
          message: `PPM Cost Estimator PDF download. Estimate: £${estimate.lowerBound.toLocaleString()} – £${estimate.upperBound.toLocaleString()} / yr (${sector.name}, ${region.name}, ${floorArea.toLocaleString()} sq ft).`,
          conversion_page: '/tools/ppm-estimator',
          landing_page: '/tools/ppm-estimator',
          form_id: 'ppm-estimator-pdf-gate',
          lead_source: 'PPM Cost Estimator Tool',
          lead_priority: 'HIGH',
          sector_interest: sector.name,
          location_interest: region.name,
          asset_scanner_context: {
            tool: 'ppm-estimator',
            sector: sectorKey,
            region: regionKey,
            operatingProfile: operatingProfileKey,
            floorArea,
            serviceScope,
            plantAge,
            lowerBound: estimate.lowerBound,
            upperBound: estimate.upperBound,
            midPoint: estimate.midPoint,
            ratePerSqFt: estimate.ratePerSqFt,
            reactiveMultiplier,
          },
          turnstile_token: turnstileToken,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Non-blocking for PDF fulfillment
    }

    setGateSubmitted(true);
    setGateSubmitting(false);

    setTimeout(() => {
      triggerPdfDownload();
      setGateOpen(false);
      setGateSubmitted(false);
      setGateForm(EMPTY_GATE);
    }, 700);
  };

  // CSV Export (100% ungated)
  const handleDownloadCsv = () => {
    const rows = [
      ['EntireFM PPM Cost Estimator Specification'],
      ['Generated Date', new Date().toLocaleDateString('en-GB')],
      ['Property Sector', sector.name],
      ['Region', region.name],
      ['Gross Internal Floor Area (sq ft)', floorArea.toString()],
      ['Operating Profile', operatingProfile.name],
      ['Service Scope', serviceScope],
      ['Plant Age Profile', plantAge],
      [''],
      ['BUDGET PROJECTION', 'COST (£)'],
      ['Lower Bound Annual PPM', estimate.lowerBound.toString()],
      ['Upper Bound Annual PPM', estimate.upperBound.toString()],
      ['Indicative Mid-Point Annual PPM', estimate.midPoint.toString()],
      ['Rate per Sq Ft (£/sq ft)', estimate.ratePerSqFt],
      [''],
      ['INDICATIVE TRADE ALLOCATION', 'COST (£)', 'SHARE (%)'],
      ['HVAC & Mechanical Systems', estimate.breakdown.hvac.toString(), '38%'],
      ['Electrical Distribution & Lighting', estimate.breakdown.electrical.toString(), '22%'],
      ['Fire Safety & Detection Alarms', estimate.breakdown.fireSafety.toString(), '18%'],
      ['Water Hygiene & Legionella (LRA)', estimate.breakdown.waterHygiene.toString(), '12%'],
      ['Building Fabric, Roof & Drainage', estimate.breakdown.otherFabric.toString(), '10%'],
      [''],
      ['REACTIVE RUN-TO-FAILURE COMPARISON', 'COST (£)'],
      [`Modelled Reactive Breakdown (${reactiveMultiplier.toFixed(1)}x penalty)`, estimate.reactiveCost.toString()],
      ['Estimated Cost Avoidance (Net Savings)', estimate.potentialSavings.toString()],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EntireFM-PPM-Cost-Estimate-${sectorKey}-${regionKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Donut chart trade calculation
  const trades = useMemo(() => {
    const items = [
      { label: 'HVAC & Mechanical', pct: 38, cost: estimate.breakdown.hvac, color: '#2563EB', bg: 'bg-blue-600' },
      { label: 'Electrical & Lighting', pct: 22, cost: estimate.breakdown.electrical, color: '#3B82F6', bg: 'bg-blue-500' },
      { label: 'Fire Safety & Alarms', pct: 18, cost: estimate.breakdown.fireSafety, color: '#E11D48', bg: 'bg-rose-600' },
      { label: 'Water Hygiene (LRA)', pct: 12, cost: estimate.breakdown.waterHygiene, color: '#059669', bg: 'bg-emerald-600' },
      { label: 'Building Fabric', pct: 10, cost: estimate.breakdown.otherFabric, color: '#64748B', bg: 'bg-slate-500' },
    ];
    const C = 2 * Math.PI * 70; // 439.82
    let accumulatedOffset = 0;

    return items.map((item) => {
      const dashLength = (item.pct / 100) * C;
      const dashOffset = -accumulatedOffset;
      accumulatedOffset += dashLength;
      return {
        ...item,
        dashLength,
        dashOffset,
        circumference: C,
      };
    });
  }, [estimate.breakdown]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <div className="flex-grow">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="PPM Cost Estimator"
          purpose="Model indicative planned preventative maintenance expenditure ranges based on commercial estate footprint, sector complexity, regional engineering rates, and service intensity."
          timeEstimate="2 min"
          outputs={['PDF Budget Specification', 'Trade Donut Allocation', 'Reactive vs. Planned Analysis']}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 7 Columns: Form Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-electric" />
                    <span className="text-[11px] tracking-widest text-slate-500 uppercase font-light">
                      01 / Estate Parameters
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extralight text-slate-900 mt-1">
                    Property &amp; Operational Scope
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Configure your building footprint and operating profile to generate an indicative SFG20 maintenance budget projection.
                  </p>
                </div>

                {/* Sector Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block">
                    Property Sector / Building Type
                  </label>
                  <select
                    value={sectorKey}
                    onChange={(e) => setSectorKey(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-slate-900 font-normal focus:bg-white focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors"
                  >
                    {Object.entries(SECTORS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Region Selection (New Input 1) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-electric" />
                      <span>Operational Region</span>
                    </label>
                    {region.badge && (
                      <span className="text-[10.5px] font-medium text-brand-electric bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm">
                        {region.badge}
                      </span>
                    )}
                  </div>
                  <select
                    value={regionKey}
                    onChange={(e) => setRegionKey(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-slate-900 font-normal focus:bg-white focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors"
                  >
                    {Object.entries(REGIONS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Operating Profile Selection (New Input 2) */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-normal text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-electric" />
                    <span>Operating &amp; Duty Profile</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(OPERATING_PROFILES).map(([key, item]) => {
                      const isActive = operatingProfileKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setOperatingProfileKey(key)}
                          className={`p-3.5 rounded-sm border text-left transition-all ${
                            isActive
                              ? 'border-brand-electric bg-blue-50/70 ring-1 ring-brand-electric text-slate-900'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-normal text-xs ${isActive ? 'text-brand-electric font-medium' : 'text-slate-900'}`}>
                              {item.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-1 leading-snug">
                            {item.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Floor Area Slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Gross Internal Floor Area
                    </label>
                    <span className="text-sm font-normal text-brand-electric bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100">
                      {floorArea.toLocaleString()} sq ft
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={floorArea}
                    onChange={(e) => setFloorArea(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <div className="flex justify-between text-[11px] font-normal text-slate-600">
                    <span>5,000 sq ft</span>
                    <span>100,000 sq ft</span>
                    <span>200,000+ sq ft</span>
                  </div>
                </div>

                {/* Scope Level Toggle */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block">
                    Service Scope Intensity
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'compliance', label: 'Statutory Only', desc: 'Mandatory duties only' },
                      { key: 'hard_fm', label: 'Full Hard FM', desc: 'Statutory + SFG20 plant care' },
                      { key: 'total_fm', label: 'Total FM Care', desc: 'Hard FM + 24/7 helpdesk' },
                    ].map((s) => {
                      const isActive = serviceScope === s.key;
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setServiceScope(s.key as any)}
                          className={`p-3.5 rounded-sm border text-left transition-all ${
                            isActive
                              ? 'border-brand-electric bg-blue-50/60 ring-1 ring-brand-electric text-slate-900'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className={`font-normal text-xs block ${isActive ? 'text-brand-electric font-medium' : 'text-slate-900'}`}>
                            {s.label}
                          </span>
                          <span className="text-[11px] text-slate-600 block mt-0.5">
                            {s.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Plant Age */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block">
                    Plant &amp; Primary Asset Age Profile
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'new', label: '0–3 Years', desc: 'Modern under warranty' },
                      { key: 'mid', label: '4–10 Years', desc: 'Established plant' },
                      { key: 'aged', label: '10+ Years', desc: 'Legacy aged systems' },
                    ].map((a) => {
                      const isActive = plantAge === a.key;
                      return (
                        <button
                          key={a.key}
                          type="button"
                          onClick={() => setPlantAge(a.key as any)}
                          className={`p-3.5 rounded-sm border text-left transition-all ${
                            isActive
                              ? 'border-brand-electric bg-blue-50/60 ring-1 ring-brand-electric text-slate-900'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className={`font-normal text-xs block ${isActive ? 'text-brand-electric font-medium' : 'text-slate-900'}`}>
                            {a.label}
                          </span>
                          <span className="text-[11px] text-slate-600 block mt-0.5">
                            {a.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Market Context & Commercial Landscape Card */}
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-electric animate-pulse" />
                    <span className="text-xs font-normal uppercase tracking-wider text-slate-800">
                      Regional Market Context &amp; Cost Pressures
                    </span>
                  </div>
                  <span className="text-[10.5px] font-normal uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-sm">
                    {sector.name.split('/')[0].trim()} · {region.name.split('(')[0].trim()}
                  </span>
                </div>

                {marketContextLoading ? (
                  <div className="space-y-2 py-3 animate-pulse">
                    <div className="h-3.5 bg-slate-100 rounded-xs w-full" />
                    <div className="h-3.5 bg-slate-100 rounded-xs w-11/12" />
                    <div className="h-3.5 bg-slate-100 rounded-xs w-4/5" />
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-700 font-light leading-relaxed">
                    {marketContext}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>AI-generated commentary, refreshed periodically — not a substitute for a formal cost survey.</span>
                </div>
              </div>
            </div>

            {/* 5 Columns: Budget Projection Output */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <div className="bg-white border border-slate-200 rounded-sm shadow-md p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-normal text-slate-500 uppercase tracking-wider">
                    02 / Indicative Budget Model
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Live Estimate
                  </span>
                </div>

                {/* Primary Metric Banner */}
                <div className="rounded-sm bg-[#0B1220] p-6 text-white space-y-2 relative overflow-hidden shadow-sm">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(ellipse at 80% 0%, rgba(37, 99, 235, 0.6), transparent 70%)`,
                    }}
                  />
                  <span className="text-[11px] font-normal uppercase tracking-wider text-slate-300 block">
                    Estimated Annual PPM Range
                  </span>
                  <p className="text-2xl sm:text-3xl font-light text-white tracking-tight tabular-nums transition-all duration-300">
                    £{animLowerBound.toLocaleString()} – £{animUpperBound.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-300">
                    <span>Target Rate:</span>
                    <strong className="text-white font-normal text-sm">£{estimate.ratePerSqFt} / sq ft</strong>
                  </div>
                </div>

                {/* Visual 1: SVG Donut Chart Trade Allocation */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Indicative Trade Allocation
                    </h3>
                    <span className="text-[11px] text-slate-500 font-light">SFG20 Standard</span>
                  </div>

                  <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-sm">
                    {/* SVG Donut */}
                    <div className="relative flex items-center justify-center py-2">
                      <svg width="180" height="180" viewBox="0 0 200 200" className="transform -rotate-90">
                        {trades.map((t, idx) => (
                          <circle
                            key={idx}
                            cx="100"
                            cy="100"
                            r="70"
                            fill="transparent"
                            stroke={t.color}
                            strokeWidth="30"
                            strokeDasharray={`${t.dashLength} ${t.circumference}`}
                            strokeDashoffset={t.dashOffset}
                            className="transition-all duration-300 ease-out"
                          />
                        ))}
                      </svg>
                      {/* Center cutout readout */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">MID-POINT</span>
                        <span className="text-base font-medium text-slate-900 tabular-nums">
                          £{animMidPoint.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-500">per annum</span>
                      </div>
                    </div>

                    {/* Trade Legend Breakdown List */}
                    <div className="divide-y divide-slate-200 text-xs pt-3 border-t border-slate-200">
                      {trades.map((t, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${t.bg} shrink-0`} />
                            <span className="text-slate-700 font-normal">{t.label}</span>
                            <span className="text-[10px] text-slate-400 font-light">({t.pct}%)</span>
                          </div>
                          <strong className="text-slate-900 font-light tabular-nums">
                            £{Math.round(animMidPoint * (t.pct / 100)).toLocaleString()}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual 2: Reactive vs Planned Comparison */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Reactive vs. Planned Comparison
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-600">
                      <span>Penalty:</span>
                      <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-xs">
                        {reactiveMultiplier.toFixed(1)}×
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-sm space-y-4">
                    <p className="text-[11px] text-slate-600 leading-relaxed font-light">
                      Industry benchmark comparison: unmanaged run-to-failure breakdown expenditure versus planned preventative maintenance.
                    </p>

                    {/* Comparative Horizontal Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-800 font-medium">Planned PPM (SFG20)</span>
                          <span className="text-brand-electric font-semibold tabular-nums">
                            £{animMidPoint.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 rounded-xs overflow-hidden">
                          <div
                            className="h-full bg-brand-electric transition-all duration-300 ease-out"
                            style={{ width: `${(100 / reactiveMultiplier).toFixed(1)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-800 font-medium">Modelled Reactive Cost</span>
                          <span className="text-rose-600 font-semibold tabular-nums">
                            £{animReactiveCost.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 rounded-xs overflow-hidden">
                          <div
                            className="h-full bg-rose-600 transition-all duration-300 ease-out"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Configurable Multiplier Slider */}
                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Adjust Reactive Penalty Multiplier:</span>
                        <span className="font-medium text-slate-800">{reactiveMultiplier.toFixed(1)}×</span>
                      </div>
                      <input
                        type="range"
                        min="1.3"
                        max="2.0"
                        step="0.1"
                        value={reactiveMultiplier}
                        onChange={(e) => setReactiveMultiplier(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>1.3× (Low emergency callouts)</span>
                        <span>2.0× (Critical aging plant)</span>
                      </div>
                    </div>

                    {/* Annual Net Cost Avoidance Box */}
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-emerald-900 block">
                          Potential Cost Avoidance
                        </span>
                        <span className="text-[10.5px] text-emerald-700">Annual unplanned savings</span>
                      </div>
                      <span className="text-base font-bold text-emerald-700 tabular-nums">
                        £{animSavings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                  toolName="PPM Cost Estimator"
                  onDownloadPdf={() => setGateOpen(true)}
                  pdfLabel="Download PDF Specification"
                  onDownloadCsv={handleDownloadCsv}
                  csvLabel="Export CSV Data"
                />
              </div>
            </div>
          </div>

          <ToolConversionCTA
            toolName="PPM Cost Estimator"
            heading="Require a formal competitive PPM tender proposal?"
            subheading="EntireFM delivers transparent fixed-price Planned Preventative Maintenance proposals tailored to your property asset register and SFG20 maintenance regimes."
            primaryActionLabel="Request Formal Tender Proposal"
            primaryActionHref="/contact-us#enquiry"
          />
        </ToolShell>
      </div>
      <Footer />

      {/* PDF Gate Modal */}
      {gateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-sm shadow-2xl border border-slate-200 overflow-hidden">
            {/* Top Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-electric to-blue-500" />

            {/* Close Button */}
            <button
              onClick={() => setGateOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-7 sm:p-8">
              {gateSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-normal text-slate-900">Generating Your Specification</h3>
                  <p className="text-xs text-slate-500">Compiling multi-section vector PDF report...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="shrink-0 w-9 h-9 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-brand-electric" />
                    </div>
                    <div>
                      <h2 className="text-base font-normal text-slate-900 leading-snug">
                        Download Complete Budget Specification
                      </h2>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        We'll email your budget specification and flag anything in the figures worth discussing.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleGateSubmit} className="space-y-3.5" noValidate>
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider mb-1">
                        Full Name <span className="text-brand-electric">*</span>
                      </label>
                      <input
                        type="text"
                        value={gateForm.name}
                        onChange={(e) => setGateForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Sarah Johnson"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-sm border bg-slate-50 focus:bg-white focus:ring-1 transition-colors ${
                          gateErrors.name
                            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                            : 'border-slate-300 focus:border-brand-electric focus:ring-brand-electric'
                        }`}
                      />
                      {gateErrors.name && <p className="text-xs text-red-600 mt-1">{gateErrors.name}</p>}
                    </div>

                    {/* Work Email */}
                    <div>
                      <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider mb-1">
                        Work Email <span className="text-brand-electric">*</span>
                      </label>
                      <input
                        type="email"
                        value={gateForm.email}
                        onChange={(e) => setGateForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="e.g. sarah@company.co.uk"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-sm border bg-slate-50 focus:bg-white focus:ring-1 transition-colors ${
                          gateErrors.email
                            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                            : 'border-slate-300 focus:border-brand-electric focus:ring-brand-electric'
                        }`}
                      />
                      {gateErrors.email && <p className="text-xs text-red-600 mt-1">{gateErrors.email}</p>}
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider mb-1">
                        Company / Organisation <span className="text-brand-electric">*</span>
                      </label>
                      <input
                        type="text"
                        value={gateForm.company}
                        onChange={(e) => setGateForm((f) => ({ ...f, company: e.target.value }))}
                        placeholder="e.g. British Land / Regional Estates Ltd"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-sm border bg-slate-50 focus:bg-white focus:ring-1 transition-colors ${
                          gateErrors.company
                            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                            : 'border-slate-300 focus:border-brand-electric focus:ring-brand-electric'
                        }`}
                      />
                      {gateErrors.company && <p className="text-xs text-red-600 mt-1">{gateErrors.company}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number <span className="text-slate-400 font-light normal-case tracking-normal">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={gateForm.phone}
                        onChange={(e) => setGateForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="e.g. 020 7946 0912"
                        className="w-full px-3.5 py-2.5 text-sm rounded-sm border border-slate-300 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-brand-electric focus:border-brand-electric transition-colors"
                      />
                    </div>

                    {/* Turnstile Anti-Bot Protection */}
                    <div className="pt-1">
                      <TurnstileWidget
                        onVerify={(token) => setTurnstileToken(token)}
                        onExpire={() => setTurnstileToken('')}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={gateSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 mt-3 bg-brand-graphite hover:bg-slate-800 text-white text-xs font-normal uppercase tracking-wider rounded-sm transition-all duration-200 disabled:opacity-60"
                    >
                      {gateSubmitting ? (
                        <span className="animate-pulse">Preparing Report...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-brand-electric-bright" />
                          <span>Generate &amp; Download PDF</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-1">
                      We protect your data. Your estate context is shared with EntireFM technical surveyors only.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
