import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Phone, Shield, Clock, MapPin, Building } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

interface LocationHeroProps {
  city: string;
  heroH1?: string;
  badge?: string;
  intro?: string;
  coverageZones?: string;
  responseSLA?: string;
  supportedProperties?: string[];
  primaryCTA?: string;
}

export function LocationHero({
  city = 'London',
  heroH1,
  badge = 'Regional Operations Hub',
  intro,
  coverageZones = 'Greater London (Zones 1-6 & M25)',
  responseSLA = '2-4 Hour Emergency Window',
  supportedProperties = [
    'Commercial Office Towers & Business Parks',
    'Industrial Units & Logistics Warehouses',
    'Retail Parks & High-Footfall Complexes',
    'Residential Blocks & Managing Agent Portfolios',
  ],
  primaryCTA = '#enquiry',
}: LocationHeroProps) {
  const h1Text = heroH1 || `${city} Facilities Management & 24/7 Operations`;
  const defaultIntro = intro || `EntireFM provides comprehensive Hard & Soft Facilities Management across ${city}. Our certified mobile engineering fleet and 24/7 helpdesk deliver planned maintenance, statutory compliance, and emergency reactive support.`;

  return (
    <section className="bg-brand-navy border-b border-brand-border-dark text-white py-12 sm:py-16 relative overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="badge-gold">{badge}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {h1Text}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {defaultIntro}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300 font-mono">
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
              <Link href={primaryCTA} className="btn-primary py-3 px-6 text-xs font-bold">
                Request {city} Proposal <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={CONTACT_CONFIG.mainPhone.href} className="btn-phone py-3 px-4 text-xs font-semibold">
                <Phone className="w-3.5 h-3.5" />
                <span>Call {CONTACT_CONFIG.mainPhone.display}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm space-y-4 shadow-command">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-gold block">{city} Hub Factsheet</span>
              <h3 className="text-base font-bold text-white">Commercial Properties Supported</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {supportedProperties.map((prop, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                    <span>{prop}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-brand-border-dark/60 text-xs text-slate-400">
                <span className="text-white font-semibold block">Direct Regional Helpdesk:</span>
                Live dispatch tracking and digital CAFM reporting.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectorHero({
  sectorName = 'Industrial & Manufacturing',
  heroH1,
  badge = 'Industry Sector Scope',
  intro,
  criticalAssets = [
    'Heavy Machinery Plant Rooms',
    'High-Voltage Switchgear & Distribution',
    'Compressed Air & Process Mechanical',
    'Factory Extraction & Ventilation',
    'Confined Space & Shutdown Cleaning',
    'Site Security & Automated Gate Barriers',
  ],
}: {
  sectorName?: string;
  heroH1?: string;
  badge?: string;
  intro?: string;
  criticalAssets?: string[];
}) {
  const h1Text = heroH1 || `${sectorName} Facilities Management & Maintenance`;
  const defaultIntro = intro || `Specialist facilities management engineered for the operational intensity, statutory safety standards, and 24/7 uptime requirements of the ${sectorName.toLowerCase()} sector.`;

  return (
    <section className="bg-brand-navy border-b border-brand-border-dark text-white py-12 sm:py-16 relative overflow-hidden">
      <div className="container-custom">
        <div className="max-w-4xl space-y-4">
          <span className="badge-gold">{badge}</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {h1Text}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {defaultIntro}
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
            <a href={CONTACT_CONFIG.mainPhone.href} className="btn-phone py-3 px-4 text-xs font-semibold">
              <Phone className="w-3.5 h-3.5" />
              <span>Call {CONTACT_CONFIG.mainPhone.display}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
