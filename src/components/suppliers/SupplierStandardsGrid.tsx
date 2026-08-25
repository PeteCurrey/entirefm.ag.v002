'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Award, Clock, Eye, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export const PRINCIPLES = [
  {
    number: '01',
    title: 'Safe',
    icon: Shield,
    rule: 'No operational deadline or commercial pressure justifies compromising health, safety, or regulatory compliance.',
    points: ['Rigorous dynamic risk assessment on every arrival', 'Strict adherence to Point-of-Work RAMS', 'Zero tolerance for uncertified working at height or confined space bypass'],
  },
  {
    number: '02',
    title: 'Competent',
    icon: Award,
    rule: 'Every person deployed to an EntireFM managed property possesses verified trade licences, training, and scheme registrations.',
    points: ['Direct Gas Safe, NICEIC, F-Gas, or IRATA certification', 'Up-to-date ECS / CSCS / Skillcard verification', 'Manufacturer OEM training on critical equipment'],
  },
  {
    number: '03',
    title: 'Responsive',
    icon: Clock,
    rule: 'Agreed attendance SLAs and dispatch milestones are treated as binding commercial commitments.',
    points: ['Live GPS attendance logging via CAFM portal', 'Immediate escalation of site access delays', 'Adherence to emergency 2h/4h and standard PPM windows'],
  },
  {
    number: '04',
    title: 'Transparent',
    icon: Eye,
    rule: 'Delays, scope variations, obsolete plant, and additional remedial requirements are reported openly and early.',
    points: ['No hidden charges or unauthorised scope extensions', 'Immediate logging of unexpected site risks', 'Transparent quote breakdowns against pre-agreed rate cards'],
  },
  {
    number: '05',
    title: 'Evidence-Led',
    icon: FileText,
    rule: 'No work order is closed without photographic validation, instrument test readings, and compliant digital certificates.',
    points: ['Clear before-and-after photographic records', 'Calibrated readings logged for temperatures, pressures, and loads', 'Statutory inspection certificates issued within 24h'],
  },
  {
    number: '06',
    title: 'Professional',
    icon: CheckCircle2,
    rule: 'Suppliers represent both EntireFM and our client when attending corporate facilities.',
    points: ['Branded uniforms, clean liveried vehicles, and ID badges', 'Courteous front-of-house communication', 'Clean handover with zero debris or tools left behind'],
  },
];

export function SupplierStandardsGrid() {
  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <span className="eyebrow eyebrow-light">OPERATING CHARTER</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            The Six Core Principles of the EntireFM Supplier Standard
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            These six principles define how EntireFM and our supply chain partners operate across corporate estates, clinical facilities, logistics hubs, and retail assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRINCIPLES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="bg-[#FAF9FB] border border-slate-200 p-8 rounded-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-brand-pink font-bold">
                      PRINCIPLE {item.number}
                    </span>
                    <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium mb-4">
                    {item.rule}
                  </p>
                  <ul className="space-y-2 pt-4 border-t border-slate-200 text-xs text-slate-600 font-light">
                    {item.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Code of Conduct Highlight */}
        <div className="mt-14 p-8 bg-brand-graphite text-white rounded-sm border border-brand-edge-dark flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright">
              ETHICAL &amp; CORPORATE GOVERNANCE
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
              EntireFM Supplier Code of Conduct
            </h3>
            <p className="text-xs text-brand-mist/80 mt-1 max-w-2xl font-light">
              Covering anti-bribery, modern slavery, ethical worker welfare, environmental responsibility, data protection, and whistleblowing protections.
            </p>
          </div>
          <Link
            href="/suppliers/compliance"
            className="btn-ghost-light text-xs shrink-0"
          >
            Review Governance Policies <ArrowRight className="h-3.5 w-3.5 text-brand-electric-bright" />
          </Link>
        </div>
      </div>
    </section>
  );
}
