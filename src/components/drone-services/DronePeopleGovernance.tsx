'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Users, HardHat, FileCheck2, Plane, CheckCircle2, Wrench, Eye, Database } from 'lucide-react';

const OPERATIONAL_ROLES = [
  {
    role: 'Commercial Remote Pilot',
    discipline: 'Aviation & Flight Planning',
    desc: 'Plans flight trajectories, oversees NOTAMs, obtains airport FRZ clearances, and conducts high-resolution multi-sensor data capture in strict compliance with CAA regulations.',
    icon: Plane,
  },
  {
    role: 'Building Surveyor & Technical Review',
    discipline: 'Defect Interpretation',
    desc: 'Chartered building surveying specialists who interpret raw orthomosaics, photogrammetry, and radiometric thermal datasets to formulate precise RAG-rated condition dossiers.',
    icon: Eye,
  },
  {
    role: 'FM Operations & Site Lead',
    discipline: 'Access & Health/Safety',
    desc: 'Coordinates site-specific RAMS, building access permits, tenant communications, exclusion zones, and seamless transition into the client CAFM platform.',
    icon: Users,
  },
  {
    role: 'Self-Delivered Specialist Trades',
    discipline: 'Physical Remediation',
    desc: 'EntireFM directly-employed commercial roofers, rope-access technicians, HVAC engineers, and mastic specialists dispatched to execute required repairs.',
    icon: Wrench,
  },
  {
    role: 'Geospatial & Data Analyst',
    discipline: 'Spatial Engineering & BIM',
    desc: 'Processes dense 3D point clouds, georeferenced CAD orthomosaics, volumetric calculations, and digital twin exports for estate records.',
    icon: Database,
  },
];

const GOVERNANCE_PILLARS = [
  {
    number: '01',
    title: 'Site Risk Assessment & RAMS',
    desc: 'Site-specific Risk Assessments and Method Statements issued to principal contractors and estate managers prior to every commercial deployment.',
  },
  {
    number: '02',
    title: 'CAA Commercial Compliance',
    desc: 'Commercial operations conducted strictly within UK Civil Aviation Authority authorizations, active airspace checks, and emergency safety cordons.',
  },
  {
    number: '03',
    title: 'Commercial Aviation Insurance',
    desc: 'Full aviation public liability insurance compliant with UK & European regulation (EC) 785/2004, tailored for high-value commercial real estate.',
  },
  {
    number: '04',
    title: 'Tenant & Public Safety Protocol',
    desc: 'Trained ground safety marshals, exclusion zones, and out-of-hours scheduling to safeguard tenants, public highways, and ground transport.',
  },
];

export function DronePeopleGovernance() {
  return (
    <section 
      aria-label="Operations Team & Aviation Governance"
      className="py-24 sm:py-32 bg-white text-slate-900 overflow-hidden border-b border-slate-200"
    >
      <div className="container-custom space-y-24">
        
        {/* Section 1: The People Behind the Flight — Capability-Led Presentation */}
        <div className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
                <Users className="h-4 w-4" />
                <span>THE DELIVERY TEAM</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
                The people behind <br />
                <span className="font-normal text-slate-950">
                  the flight.
                </span>
              </h2>
            </div>

            <div className="lg:col-span-5 text-slate-600 text-base sm:text-lg font-light leading-relaxed">
              <p>
                EntireFM is an engineering and facilities management business. Behind every flight is a multidisciplinary chain of qualified pilots, technical surveyors, and physical trade specialists who ensure aerial data converts into real estate integrity.
              </p>
            </div>
          </div>

          {/* Genuine Operational Photography Pair */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative rounded-sm overflow-hidden bg-slate-950 min-h-[340px] p-8 flex flex-col justify-end text-white shadow-md">
              <Image
                src="/images/editorial/entirefm-engineers-office-testing-2000w.webp"
                alt="EntireFM technical surveying and diagnostic engineering review"
                fill
                className="object-cover object-center filter brightness-[0.80] contrast-[1.05]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-pink block">
                  TECHNICAL DIAGNOSIS
                </span>
                <h3 className="text-xl font-light">
                  Chartered Surveying &amp; Data Review
                </h3>
                <p className="text-xs text-slate-300 font-light max-w-md">
                  Every high-resolution capture is reviewed by qualified property professionals to define scope and severity.
                </p>
              </div>
            </div>

            <div className="relative rounded-sm overflow-hidden bg-slate-950 min-h-[340px] p-8 flex flex-col justify-end text-white shadow-md">
              <Image
                src="/images/editorial/entirefm-entirefm-premises-vans-2000w.webp"
                alt="EntireFM mobile engineering fleet and trade mobilisation"
                fill
                className="object-cover object-center filter brightness-[0.80] contrast-[1.05]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-pink block">
                  FIELD MOBILISATION
                </span>
                <h3 className="text-xl font-light">
                  Direct Trade Fleet &amp; Physical Remediation
                </h3>
                <p className="text-xs text-slate-300 font-light max-w-md">
                  Self-delivered mobile engineering teams dispatched directly to commercial properties nationwide.
                </p>
              </div>
            </div>
          </div>

          {/* Operational Capability Chain Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-4">
            {OPERATIONAL_ROLES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-sm bg-slate-50 border border-slate-200 space-y-3">
                  <div className="w-8 h-8 rounded-sm bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-medium">
                      {item.discipline}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {item.role}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Aviation Safety & Corporate Governance */}
        <div className="pt-16 border-t border-slate-200 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-emerald-600 text-xs uppercase tracking-[0.2em] font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>CORPORATE GOVERNANCE &amp; SAFETY</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extralight text-slate-900">
              Aviation Governance Engineered for Commercial Real Estate
            </h3>

            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              Every commercial flight is planned with the same rigorous risk mitigation, airspace clearance protocols, and method statements as heavy engineering operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GOVERNANCE_PILLARS.map((gov, gIdx) => (
              <div key={gIdx} className="p-6 rounded-sm bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="text-xs font-mono text-slate-400 font-medium">{gov.number}</span>
                <h4 className="text-sm font-semibold text-slate-900">
                  {gov.title}
                </h4>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {gov.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
