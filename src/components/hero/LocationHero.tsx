import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, MapPin, ShieldCheck, Clock, Building2, CheckCircle2 } from 'lucide-react';

interface LocationHeroProps {
  city: string;
  title: string;
  subtitle: string;
  badge?: string;
  coverageZones?: string;
  responseSLA?: string;
  intentVariant?: 'rapid-response' | 'total-fm' | 'corporate-estates';
}

export function LocationHero({
  city,
  title,
  subtitle,
  badge = 'Regional Operations Hub',
  coverageZones = 'Greater London & M25 Corridor',
  responseSLA = 'Guaranteed Rapid Response [SLA PENDING VERIF.]',
  intentVariant = 'total-fm',
}: LocationHeroProps) {
  return (
    <section className="bg-brand-navy text-white relative overflow-hidden border-b border-brand-border-dark py-14 sm:py-20">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-gold">
                <MapPin className="w-3.5 h-3.5" />
                {city} Regional Centre
              </span>
              <span className="badge-dark text-slate-300">
                {badge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {subtitle}
            </p>

            {/* Regional Capabilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-slate-300 border-y border-brand-border-dark py-3">
              <div>
                <span className="text-slate-400 block">Coverage Scope:</span>
                <span className="text-white font-semibold text-sm">{coverageZones}</span>
              </div>
              <div className="sm:border-l sm:border-brand-border-dark sm:pl-3">
                <span className="text-slate-400 block">Emergency Response:</span>
                <span className="text-brand-gold font-semibold text-sm">{responseSLA}</span>
              </div>
              <div className="sm:border-l sm:border-brand-border-dark sm:pl-3">
                <span className="text-slate-400 block">Engineering Base:</span>
                <span className="text-white font-semibold text-sm">Direct Regional Fleet</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="#enquiry" className="btn-primary py-3 px-6 text-xs font-bold">
                Request {city} Proposal <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:0800000000" className="btn-phone py-3 px-4 text-xs font-semibold">
                <Phone className="w-3.5 h-3.5" />
                <span>Call [REGIONAL PHONE TO VERIFY]</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm space-y-4 shadow-command">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-gold block">{city} Hub Factsheet</span>
              <h3 className="text-base font-bold text-white">Commercial Properties Supported</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>Central commercial office blocks & HQs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>Logistics hubs, warehouses & trade parks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>Retail parks & leisure complexes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>Industrial & manufacturing facilities</span>
                </li>
              </ul>
              <div className="pt-3 border-t border-brand-border-dark">
                <span className="text-[10px] text-slate-500 font-mono block">
                  *All regional SLAs contractually guaranteed.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectorHero({
  sectorName,
  title,
  subtitle,
  criticalAssets = ['Plant Rooms & HVAC Systems', 'High-Voltage Switchgear & Distribution', 'Statutory Fire & Life Safety Systems'],
}: {
  sectorName: string;
  title: string;
  subtitle: string;
  criticalAssets?: string[];
}) {
  return (
    <section className="bg-brand-navy text-white relative overflow-hidden border-b border-brand-border-dark py-14 sm:py-20">
      <div className="container-custom relative z-10">
        <div className="max-w-4xl space-y-5">
          <div className="flex items-center gap-2">
            <span className="badge-gold">
              <Building2 className="w-3.5 h-3.5" />
              Sector Solutions
            </span>
            <span className="badge-dark text-slate-300">
              {sectorName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-2">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-2">Critical Assets & Environments Managed:</span>
            <div className="flex flex-wrap gap-2">
              {criticalAssets.map((asset, idx) => (
                <span key={idx} className="px-3 py-1 bg-brand-charcoal border border-brand-border-dark rounded-sm text-xs font-mono text-brand-gold">
                  {asset}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href="#enquiry" className="btn-primary py-3 px-6 text-xs font-bold">
              Request Sector Proposal <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:0800000000" className="btn-phone py-3 px-4 text-xs font-semibold">
              <Phone className="w-3.5 h-3.5" />
              <span>Call [PHONE TO VERIFY]</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
