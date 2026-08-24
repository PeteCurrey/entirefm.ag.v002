'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  Printer,
  RotateCcw,
  Building2,
  Layers,
  Sparkles,
  Info,
  TrendingUp,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { ToolHero } from '@/components/resources/ToolHero';
import { ResultsConversionBridge } from '@/components/resources/ResultsConversionBridge';
import type { TemplateProps } from '../types';

interface SectorMultiplier {
  name: string;
  baseRateSqFt: number; // Base annual PPM rate £/sq ft
  complexityFactor: number;
}

const SECTORS: Record<string, SectorMultiplier> = {
  office: { name: 'Commercial Office / Corporate', baseRateSqFt: 1.45, complexityFactor: 1.0 },
  industrial: { name: 'Industrial & Manufacturing', baseRateSqFt: 1.85, complexityFactor: 1.25 },
  logistics: { name: 'Logistics & Distribution Warehousing', baseRateSqFt: 0.95, complexityFactor: 0.85 },
  retail: { name: 'Retail & Shopping Centres', baseRateSqFt: 1.65, complexityFactor: 1.15 },
  healthcare: { name: 'Healthcare & Clinical Environments', baseRateSqFt: 2.25, complexityFactor: 1.4 },
  hospitality: { name: 'Hotels & Hospitality', baseRateSqFt: 1.75, complexityFactor: 1.2 },
  education: { name: 'Education & Campus Estates', baseRateSqFt: 1.35, complexityFactor: 0.95 },
};

export function TemplatePpmEstimator({ route, content }: TemplateProps) {
  const [sectorKey, setSectorKey] = useState<string>('office');
  const [floorArea, setFloorArea] = useState<number>(25000); // in sq ft
  const [siteCount, setSiteCount] = useState<number>(1);
  const [serviceScope, setServiceScope] = useState<'compliance' | 'hard_fm' | 'total_fm'>('hard_fm');
  const [plantAge, setPlantAge] = useState<'new' | 'mid' | 'aged'>('mid');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Tools', url: '/tools' },
    { name: 'PPM Cost Estimator', url: '/tools/ppm-estimator' },
  ];

  // Calculation model
  const estimation = useMemo(() => {
    const sector = SECTORS[sectorKey] || SECTORS.office;
    let baseRate = sector.baseRateSqFt;

    // Scope adjustment
    if (serviceScope === 'compliance') {
      baseRate = baseRate * 0.45; // Compliance testing only
    } else if (serviceScope === 'total_fm') {
      baseRate = baseRate * 1.85; // Hard + Soft FM combined
    }

    // Plant age adjustment
    let ageMultiplier = 1.0;
    if (plantAge === 'new') ageMultiplier = 0.88;
    if (plantAge === 'aged') ageMultiplier = 1.25;

    // Multi-site efficiency factor
    let siteMultiplier = 1.0;
    if (siteCount > 1) {
      siteMultiplier = 1 - Math.min(siteCount * 0.02, 0.15); // Up to 15% multi-site volume efficiency
    }

    const calculatedAnnualTotal = floorArea * siteCount * baseRate * ageMultiplier * siteMultiplier;
    const lowerBound = Math.round(calculatedAnnualTotal * 0.88);
    const upperBound = Math.round(calculatedAnnualTotal * 1.14);

    const costPerSqFtLow = (lowerBound / (floorArea * siteCount)).toFixed(2);
    const costPerSqFtHigh = (upperBound / (floorArea * siteCount)).toFixed(2);

    return {
      lowerBound,
      upperBound,
      costPerSqFtLow,
      costPerSqFtHigh,
      hardFmSplit: Math.round(calculatedAnnualTotal * 0.52),
      statutorySplit: Math.round(calculatedAnnualTotal * 0.28),
      managementCafmSplit: Math.round(calculatedAnnualTotal * 0.12),
      consumablesSplit: Math.round(calculatedAnnualTotal * 0.08),
    };
  }, [sectorKey, floorArea, siteCount, serviceScope, plantAge]);

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
          eyebrow="Indicative Budget Planning"
          title="PPM Cost Estimator"
          description="Model an indicative annual planned maintenance budget range based on building square footage, sector profile, and service intensity."
          timeEstimate="~2 minutes"
          deliverables={[
            'Indicative annual budget range (lower/upper bound)',
            'Estimated cost per sq ft / annum metric',
            '4-tier cost allocation breakdown',
            'Multi-site volume discount modelling',
            'Printable budget feasibility summary',
          ]}
          accent="cyan"
          icon={Calculator}
        />

        {/* Estimator App Section */}
        <section className="py-14 bg-brand-carbon">
          <div className="container-custom max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Input Form Column (7 cols) */}
              <div className="lg:col-span-7 rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-8 space-y-6">
                <div className="border-b border-brand-edge-dark pb-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    Estate & Operational Inputs
                  </h2>
                  <p className="text-xs text-brand-mist/60 mt-0.5">
                    Adjust the parameters below to reflect your building profile.
                  </p>
                </div>

                {/* Sector Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                    Property Sector
                  </label>
                  <select
                    value={sectorKey}
                    onChange={(e) => setSectorKey(e.target.value)}
                    className="w-full h-10 rounded-sm border border-brand-edge-dark bg-brand-carbon px-3 text-xs text-white focus:border-brand-electric/80 focus:outline-none"
                  >
                    {Object.entries(SECTORS).map(([key, item]) => (
                      <option key={key} value={key} className="bg-brand-carbon">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Floor Area Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-mist/70">
                      Approximate Floor Area per Site
                    </label>
                    <span className="font-mono text-xs font-bold text-brand-electric-bright">
                      {floorArea.toLocaleString()} sq ft ({Math.round(floorArea * 0.0929).toLocaleString()} m²)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2500"
                    max="200000"
                    step="2500"
                    value={floorArea}
                    onChange={(e) => setFloorArea(Number(e.target.value))}
                    className="w-full accent-brand-electric-bright cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-brand-mist/40 mt-1">
                    <span>2,500 sq ft</span>
                    <span>50,000 sq ft</span>
                    <span>100,000 sq ft</span>
                    <span>200,000+ sq ft</span>
                  </div>
                </div>

                {/* Number of Sites */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-mist/70">
                      Number of Sites
                    </label>
                    <span className="font-mono text-xs font-bold text-white">
                      {siteCount} {siteCount === 1 ? 'Site' : 'Sites'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={siteCount}
                    onChange={(e) => setSiteCount(Number(e.target.value))}
                    className="w-full accent-brand-electric-bright cursor-pointer"
                  />
                </div>

                {/* Scope of Service */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                    Service Scope
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setServiceScope('compliance')}
                      className={`p-3 rounded-sm border text-xs text-center transition-all ${
                        serviceScope === 'compliance'
                          ? 'border-brand-electric-bright bg-brand-electric/15 text-white font-semibold'
                          : 'border-brand-edge-dark bg-white/[0.02] text-brand-mist/60 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="block font-medium">Compliance Only</span>
                      <span className="text-[10px] text-brand-mist/50 block mt-0.5">Testing & Certification</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceScope('hard_fm')}
                      className={`p-3 rounded-sm border text-xs text-center transition-all ${
                        serviceScope === 'hard_fm'
                          ? 'border-brand-electric-bright bg-brand-electric/15 text-white font-semibold'
                          : 'border-brand-edge-dark bg-white/[0.02] text-brand-mist/60 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="block font-medium">Core Hard FM</span>
                      <span className="text-[10px] text-brand-mist/50 block mt-0.5">M&E, PPM & Statutory</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceScope('total_fm')}
                      className={`p-3 rounded-sm border text-xs text-center transition-all ${
                        serviceScope === 'total_fm'
                          ? 'border-brand-electric-bright bg-brand-electric/15 text-white font-semibold'
                          : 'border-brand-edge-dark bg-white/[0.02] text-brand-mist/60 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="block font-medium">Total FM</span>
                      <span className="text-[10px] text-brand-mist/50 block mt-0.5">Hard FM + Cleaning/Fabric</span>
                    </button>
                  </div>
                </div>

                {/* Plant Age / Condition */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                    Plant Age & Condition
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPlantAge('new')}
                      className={`p-2.5 rounded-sm border text-center transition-all ${
                        plantAge === 'new'
                          ? 'border-brand-electric-bright bg-brand-electric/15 text-white font-semibold'
                          : 'border-brand-edge-dark bg-white/[0.02] text-brand-mist/60 hover:bg-white/[0.04]'
                      }`}
                    >
                      Modern (&lt;5 yrs)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlantAge('mid')}
                      className={`p-2.5 rounded-sm border text-center transition-all ${
                        plantAge === 'mid'
                          ? 'border-brand-electric-bright bg-brand-electric/15 text-white font-semibold'
                          : 'border-brand-edge-dark bg-white/[0.02] text-brand-mist/60 hover:bg-white/[0.04]'
                      }`}
                    >
                      Mid-Life (5–15 yrs)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlantAge('aged')}
                      className={`p-2.5 rounded-sm border text-center transition-all ${
                        plantAge === 'aged'
                          ? 'border-brand-electric-bright bg-brand-electric/15 text-white font-semibold'
                          : 'border-brand-edge-dark bg-white/[0.02] text-brand-mist/60 hover:bg-white/[0.04]'
                      }`}
                    >
                      Aged (&gt;15 yrs)
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Results Column (5 cols) */}
              <div className="lg:col-span-5 rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-8 space-y-6">
                <div>
                  <span className="eyebrow eyebrow-dark">Estimated Budget Range</span>
                  <div className="mt-3 p-5 rounded-sm bg-brand-carbon border border-brand-edge-dark">
                    <span className="text-[11px] font-semibold text-brand-mist/50 uppercase tracking-wider block">
                      Indicative Annual PPM Budget
                    </span>
                    <p className="mt-2 text-3xl font-extrabold text-white font-mono tracking-tight">
                      £{estimation.lowerBound.toLocaleString()} – £{estimation.upperBound.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-brand-mist/60">
                      Approx. <span className="text-brand-electric-bright font-mono font-semibold">£{estimation.costPerSqFtLow} – £{estimation.costPerSqFtHigh}</span> per sq ft / annum
                    </p>
                  </div>
                </div>

                {/* Estimated cost breakdown */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-3">
                    Indicative Cost Allocation Breakdown
                  </h3>

                  {/* Visual allocation bar */}
                  <div className="h-2 w-full rounded-full overflow-hidden flex mb-3 bg-brand-carbon">
                    <div style={{ width: '52%' }} className="bg-brand-electric" title="Scheduled M&E Visits (52%)" />
                    <div style={{ width: '28%' }} className="bg-emerald-400" title="Statutory Testing (28%)" />
                    <div style={{ width: '12%' }} className="bg-amber-400" title="CAFM & Management (12%)" />
                    <div style={{ width: '8%' }} className="bg-purple-400" title="Consumables (8%)" />
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-brand-edge-dark pb-1.5">
                      <span className="text-brand-mist/80 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-brand-electric inline-block" />
                        Scheduled M&E Visits (52%):
                      </span>
                      <span className="font-mono text-white font-medium">~£{estimation.hardFmSplit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-brand-edge-dark pb-1.5">
                      <span className="text-brand-mist/80 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                        Statutory Testing & Certs (28%):
                      </span>
                      <span className="font-mono text-white font-medium">~£{estimation.statutorySplit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-brand-edge-dark pb-1.5">
                      <span className="text-brand-mist/80 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
                        CAFM, Portal & Management (12%):
                      </span>
                      <span className="font-mono text-white font-medium">~£{estimation.managementCafmSplit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-brand-edge-dark pb-1.5">
                      <span className="text-brand-mist/80 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-purple-400 inline-block" />
                        Minor Sundries & Consumables (8%):
                      </span>
                      <span className="font-mono text-white font-medium">~£{estimation.consumablesSplit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="btn-ghost-light w-full py-2.5 text-xs justify-center"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print Budget Summary
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="text-[11px] leading-relaxed text-brand-mist/50 pt-2 border-t border-brand-edge-dark">
                  <p>
                    <strong>Planning Model Notice:</strong> Figures generated are indicative benchmarks for high-level feasibility and budgeting. Actual commercial contract pricing requires an on-site asset survey to evaluate physical equipment condition, access requirements, and operating hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Conversion Bridge */}
            <div className="mt-8">
              <ResultsConversionBridge
                headline="Ready for a verified contract quote based on real assets?"
                body="EntireFM delivers structured planned maintenance contracts across the UK. Request an on-site asset condition survey to replace estimates with fixed contract pricing."
                ctaPrimary={{ label: 'Request an Asset Survey', href: '/contact-us' }}
                ctaSecondary={{ label: 'Explore EntireFM PPM scope', href: '/ppm' }}
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
