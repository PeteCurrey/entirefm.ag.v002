'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, FileText, Info } from 'lucide-react';

interface TradeRiskBand {
  id: string;
  name: string;
  badge: string;
  description: string;
  sampleTrades: string[];
  publicLiability: string;
  employersLiability: string;
  professionalIndemnity: string;
  specialEndorsements: string[];
}

const RISK_BANDS: TradeRiskBand[] = [
  {
    id: 'low-risk',
    name: 'Low Risk & Minor Works',
    badge: 'TIER 1 // LOW RISK PROFILE',
    description: 'Non-invasive trades operating at ground level with minimal structural or life-safety risk.',
    sampleTrades: ['Commercial Cleaning', 'Grounds Maintenance & Landscaping', 'Internal Painting & Decorating', 'Pest Control'],
    publicLiability: '£5,000,000 (Five Million Pounds)',
    employersLiability: '£10,000,000 (Statutory UK Minimum)',
    professionalIndemnity: 'Not required unless providing design consultation',
    specialEndorsements: ['Standard COSHH compliance for cleaning chemicals'],
  },
  {
    id: 'medium-risk',
    name: 'Medium Risk Building Fabric & M&E',
    badge: 'TIER 2 // CORE COMMERCIAL FM',
    description: 'Standard building services, low-voltage electrical, plumbing, carpentry, and minor roof repairs.',
    sampleTrades: ['General Building Fabric & Joinery', 'Commercial Plumbing & Drainage', 'Low Voltage Electrical (< 415V)', 'Automatic Doors & Access Control'],
    publicLiability: '£5,000,000 (Five Million Pounds)',
    employersLiability: '£10,000,000 (Statutory UK Minimum)',
    professionalIndemnity: '£1,000,000 (recommended if providing certification)',
    specialEndorsements: ['Safe isolation procedures', 'Hot works endorsement if using torches/heat guns'],
  },
  {
    id: 'high-risk',
    name: 'High Risk & Statutory Engineering',
    badge: 'TIER 3 // STATUTORY ENGINEERING',
    description: 'Commercial gas, HVAC/refrigeration, high-voltage switchgear, fire suppression, and pressure vessels.',
    sampleTrades: ['Commercial Gas & Boilers', 'Chillers & F-Gas Refrigeration', 'High Voltage Switchgear (> 415V)', 'Fire Alarms & Sprinklers', 'Water Hygiene & Legionella'],
    publicLiability: '£10,000,000 (Ten Million Pounds)',
    employersLiability: '£10,000,000 (Statutory UK Minimum)',
    professionalIndemnity: '£2,000,000 – £5,000,000 (mandatory for compliance sign-off)',
    specialEndorsements: ['F-Gas handling & recovery', 'Gas Safe commercial registration', 'Hot works permit compliance'],
  },
  {
    id: 'critical-access',
    name: 'Complex Access & High Hazard',
    badge: 'TIER 4 // HIGH HAZARD ACCESS',
    description: 'Work at height, industrial rope access, building cradles, confined spaces, and asbestos removal.',
    sampleTrades: ['IRATA Industrial Rope Access', 'BMU Cradle Maintenance', 'Asbestos Abatement (Licensed)', 'Confined Space Interceptor Works', 'Lightning Protection'],
    publicLiability: '£10,000,000 (Ten Million Pounds)',
    employersLiability: '£10,000,000 (Statutory UK Minimum)',
    professionalIndemnity: '£2,000,000 (for access design and rigging calculations)',
    specialEndorsements: ['Height unrestricted endorsement', 'Confined space entry certification', 'Rigging & anchor point load testing'],
  },
];

export function ComplianceInsuranceTable() {
  const [activeBandId, setActiveBandId] = useState(RISK_BANDS[2].id); // Default to High Risk

  const selected = RISK_BANDS.find((b) => b.id === activeBandId) || RISK_BANDS[2];

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">INSURANCE SCHEDULE SPECIFICATIONS</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            Minimum Mandatory Insurance Cover Limits
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            EntireFM applies clear, risk-proportional insurance requirements across all trade categories. Policies must be placed with reputable UK/EU insurers with no unapproved safety exclusions.
          </p>
        </div>

        {/* Risk Tier Tabs */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200 mb-8">
          {RISK_BANDS.map((band) => {
            const isSelected = band.id === activeBandId;
            return (
              <button
                key={band.id}
                onClick={() => setActiveBandId(band.id)}
                className={`px-4 py-2.5 rounded-sm text-xs font-light tracking-wide transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-normal shadow-sm border border-slate-900'
                    : 'bg-[#FAF9FB] text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {band.name}
              </button>
            );
          })}
        </div>

        {/* Insurance Specification Table Card */}
        <div className="bg-[#FAF9FB] border border-slate-200 rounded-sm p-8 lg:p-12 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink font-semibold">
                {selected.badge}
              </span>
              <h3 className="text-2xl font-light text-slate-900 mt-0.5">{selected.name}</h3>
              <p className="text-xs text-slate-600 font-light mt-1 max-w-2xl">{selected.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-light">Applicable trades:</span>
              <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-normal rounded-sm">
                {selected.sampleTrades.length} Trade Categories
              </span>
            </div>
          </div>

          {/* Insurance Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-sm border border-slate-200 space-y-2">
              <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-400 block">
                PUBLIC &amp; PRODUCTS LIABILITY
              </span>
              <div className="text-xl font-light text-slate-900">{selected.publicLiability}</div>
              <p className="text-[11.5px] text-slate-500 font-light leading-relaxed">
                Mandatory for all site attendance. Must include indemnification of principal clauses.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-slate-200 space-y-2">
              <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-400 block">
                EMPLOYERS LIABILITY
              </span>
              <div className="text-xl font-light text-slate-900">{selected.employersLiability}</div>
              <p className="text-[11.5px] text-slate-500 font-light leading-relaxed">
                Statutory UK requirement covering all direct employees, labour-only subcontractors, and apprentices.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-slate-200 space-y-2">
              <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-400 block">
                PROFESSIONAL INDEMNITY
              </span>
              <div className="text-xl font-light text-slate-900">{selected.professionalIndemnity}</div>
              <p className="text-[11.5px] text-slate-500 font-light leading-relaxed">
                Applies to testing, diagnostic advisory, statutory certification, and engineering calculations.
              </p>
            </div>
          </div>

          {/* Special Endorsements & Sample Trades */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 pt-8 border-t border-slate-200">
            <div className="lg:col-span-6 space-y-3">
              <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block">
                MANDATORY SPECIAL POLICY ENDORSEMENTS
              </span>
              <ul className="space-y-2">
                {selected.specialEndorsements.map((end, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-700 font-light">
                    <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0" />
                    <span>{end}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block">
                TYPICAL TRADES IN THIS BAND
              </span>
              <div className="flex flex-wrap gap-2">
                {selected.sampleTrades.map((trade, j) => (
                  <span key={j} className="px-3 py-1 bg-white border border-slate-200 text-xs text-slate-800 font-light rounded-sm">
                    {trade}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
