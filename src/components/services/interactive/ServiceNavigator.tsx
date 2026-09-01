'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Factory, 
  Truck, 
  ShoppingBag, 
  GraduationCap, 
  Activity, 
  Home, 
  Coffee, 
  Layers,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ChevronRight,
  Clock,
  Compass
} from 'lucide-react';
import { 
  NAVIGATOR_SECTORS, 
  NAVIGATOR_REQUIREMENTS, 
  getNavigatorRecommendation,
  CURATED_SERVICES,
  CuratedService
} from '@/config/services-taxonomy';
import { CONTACT_CONFIG } from '@/config/contact';

const SECTOR_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  building: Building2,
  factory: Factory,
  truck: Truck,
  shopping: ShoppingBag,
  school: GraduationCap,
  activity: Activity,
  home: Home,
  coffee: Coffee,
  layers: Layers,
};

export function ServiceNavigator() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);

  const recommendation = (selectedSector && selectedRequirement) 
    ? getNavigatorRecommendation(selectedSector, selectedRequirement)
    : null;

  const primaryService: CuratedService | undefined = recommendation
    ? CURATED_SERVICES.find(s => s.id === recommendation.primaryServiceId)
    : undefined;

  const supportingServices: CuratedService[] = recommendation
    ? CURATED_SERVICES.filter(s => recommendation.supportingServiceIds.includes(s.id))
    : [];

  const handleReset = () => {
    setSelectedSector(null);
    setSelectedRequirement(null);
  };

  const activeStep = !selectedSector ? 1 : !selectedRequirement ? 2 : 3;

  return (
    <section id="service-navigator" className="relative bg-[#FAF9FB] border-b border-slate-200 py-16 sm:py-24">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-pink/10 border border-brand-pink/20 mb-4">
            <Compass className="h-3.5 w-3.5 text-brand-pink" />
            <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink">
              INTERACTIVE SERVICE NAVIGATOR
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
            What does your estate need?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Select your property portfolio and current maintenance priority to generate an immediate, tailored facilities management delivery model.
          </p>
        </div>

        {/* Step Progression Indicators */}
        <div className="flex items-center gap-3 sm:gap-6 mb-8 text-xs font-normal border-b border-slate-200 pb-4 overflow-x-auto">
          <div className={`flex items-center gap-2 whitespace-nowrap ${activeStep >= 1 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              selectedSector ? 'bg-slate-900 text-white' : 'bg-brand-pink text-white'
            }`}>
              {selectedSector ? '✓' : '1'}
            </span>
            <span>Estate Responsibility</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className={`flex items-center gap-2 whitespace-nowrap ${activeStep >= 2 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              selectedRequirement ? 'bg-slate-900 text-white' : selectedSector ? 'bg-brand-pink text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {selectedRequirement ? '✓' : '2'}
            </span>
            <span>Required Scope</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className={`flex items-center gap-2 whitespace-nowrap ${activeStep === 3 ? 'text-brand-pink font-medium' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              activeStep === 3 ? 'bg-brand-pink text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              3
            </span>
            <span>Recommended Delivery Model</span>
          </div>
        </div>

        {/* Navigator Body */}
        <div className="space-y-10">
          {/* STEP 1: ESTATE SECTOR SELECTION */}
          {!selectedSector && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-normal uppercase tracking-wider text-slate-500">
                  Step 1 — What are you responsible for?
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {NAVIGATOR_SECTORS.map((sector) => {
                  const Icon = SECTOR_ICON_MAP[sector.iconName] || Building2;
                  return (
                    <button
                      key={sector.id}
                      onClick={() => setSelectedSector(sector.id)}
                      className="group text-left p-5 bg-white border border-slate-200/90 rounded-sm shadow-xs hover:border-brand-pink hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-xs bg-[#FAF9FB] text-slate-700 group-hover:bg-brand-pink/10 group-hover:text-brand-pink transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="mt-4">
                        <div className="font-normal text-slate-900 text-base group-hover:text-brand-pink transition-colors">
                          {sector.label}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 font-light leading-relaxed">
                          {sector.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: REQUIREMENT SELECTION */}
          {selectedSector && !selectedRequirement && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-sm">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs uppercase text-slate-400">Selected Estate:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {NAVIGATOR_SECTORS.find(s => s.id === selectedSector)?.label}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSector(null)}
                  className="text-xs text-brand-pink hover:underline inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Change Estate
                </button>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-normal uppercase tracking-wider text-slate-500 mb-4">
                  Step 2 — What needs attention?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {NAVIGATOR_REQUIREMENTS.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequirement(req.id)}
                      className="group text-left p-5 bg-white border border-slate-200/90 rounded-sm shadow-xs hover:border-brand-pink hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10.5px] font-normal uppercase text-brand-pink block mb-1">
                          {req.discipline}
                        </span>
                        <div className="font-normal text-slate-900 text-base group-hover:text-brand-pink transition-colors">
                          {req.label}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 font-light leading-relaxed">
                          {req.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-brand-pink transition-colors">
                        <span>Select scope</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INSTANT RECOMMENDED SCOPE OUTPUT */}
          {selectedSector && selectedRequirement && recommendation && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-400">
              {/* Reset bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3.5 border border-slate-200 rounded-sm">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-slate-400 uppercase tracking-wider">Parameters:</span>
                  <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-xs font-normal">
                    {NAVIGATOR_SECTORS.find(s => s.id === selectedSector)?.label}
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-xs font-normal">
                    {NAVIGATOR_REQUIREMENTS.find(r => r.id === selectedRequirement)?.label}
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs font-normal text-slate-600 hover:text-brand-pink inline-flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start again
                </button>
              </div>

              {/* Recommendation Card */}
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  {/* Left Column: Primary Recommendation & Scope */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-emerald-50 border border-emerald-200 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-normal uppercase text-emerald-800">
                          RECOMMENDED OPERATING SCOPE
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-light text-slate-900">
                        {primaryService ? primaryService.title : 'Tailored Maintenance Solution'}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                        {recommendation.summaryNote}
                      </p>
                    </div>

                    {/* Primary Service Core Capabilities */}
                    {primaryService && (
                      <div className="p-4 bg-[#FAF9FB] border border-slate-200/80 rounded-sm space-y-3">
                        <span className="text-xs uppercase tracking-wider text-slate-400 block font-light">
                          Key Deliverables in this Scope:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {primaryService.capabilities.map((cap, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink shrink-0" />
                              <span>{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Supporting Service Links */}
                    {supportingServices.length > 0 && (
                      <div>
                        <span className="text-xs uppercase tracking-wider text-slate-400 block font-light mb-2.5">
                          Integrated Supporting Capabilities:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {supportingServices.map((svc) => (
                            <Link
                              key={svc.id}
                              href={svc.slug}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white border border-slate-200 text-xs text-slate-800 hover:border-brand-pink hover:text-brand-pink transition-colors shadow-2xs group"
                            >
                              <span>{svc.title}</span>
                              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Operational Architecture & Direct CTA */}
                  <div className="lg:col-span-5 bg-[#FAF9FB] p-6 rounded-sm border border-slate-200 flex flex-col justify-between space-y-6">
                    <div className="space-y-5">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-light">
                          Delivery Model
                        </span>
                        <p className="mt-1 text-xs text-slate-700 leading-relaxed font-normal">
                          {recommendation.deliveryModel}
                        </p>
                      </div>

                      <div className="border-t border-slate-200 pt-4">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-light">
                          Statutory &amp; Compliance Focus
                        </span>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {recommendation.complianceFocus.map((c, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-normal text-slate-700 bg-white px-2.5 py-0.5 rounded-xs border border-slate-200">
                              <ShieldCheck className="w-3 h-3 text-brand-pink" />
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 space-y-2.5">
                      {primaryService && (
                        <Link
                          href={primaryService.slug}
                          className="w-full btn-primary text-center justify-center text-xs py-3"
                        >
                          <span>Explore {primaryService.shortTitle || primaryService.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      )}

                      <a
                        href="#enquiry"
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full btn-secondary text-center justify-center text-xs py-3"
                      >
                        <PhoneCall className="w-3.5 h-3.5 mr-1 text-brand-pink-light" />
                        <span>Talk to EntireFM about this scope</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
