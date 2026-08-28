'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Users, HardHat, FileCheck2, Plane, CheckCircle2 } from 'lucide-react';

const TEAM_PROFILES = [
  {
    name: 'Dan Wright',
    role: 'Chief Commercial Remote Pilot & Aviation Lead',
    bio: 'Oversees commercial airspace authorisations, complex urban flight planning, and multi-sensor photogrammetry standards.',
    image: '/images/drone/team/dan.jpg',
  },
  {
    name: 'James Harrison',
    role: 'Head of Building Fabric & Surveying',
    bio: 'Chartered building surveyor translating raw orthomosaics and thermal datasets into actionable remedial specifications.',
    image: '/images/drone/team/james.jpg',
  },
  {
    name: 'Rachel Davies',
    role: 'FM Operations & Estate Mobilisation Lead',
    bio: 'Coordinates tenant notifications, site RAMS, ground cordons, and seamless EntireCAFM work order dispatch.',
    image: '/images/drone/team/rachel.jpg',
  },
  {
    name: 'Sarah Evans',
    role: 'Technical Data & Geospatial Analyst',
    bio: 'Specialises in 3D reality mesh point clouds, GIS coordinate systems, and radiometric thermal delta-T calibration.',
    image: '/images/drone/team/sarah.jpg',
  },
];

const GOVERNANCE_PILLARS = [
  {
    title: 'Site Risk Assessment & RAMS',
    desc: 'Site-specific Risk Assessments and Method Statements issued to principal contractors and facilities directors before flight.',
  },
  {
    title: 'Airspace & CAA Compliance',
    desc: 'Strict operation within UK Civil Aviation Authority commercial authorisations, FRZ airport clearances, and NOTAM reviews.',
  },
  {
    title: 'Aviation Third-Party Insurance',
    desc: 'Comprehensive aviation public liability insurance compliant with Regulation (EC) 785/2004 for commercial operations.',
  },
  {
    title: 'Tenant & Public Safety Cordons',
    desc: 'Dedicated safety marshals, exclusion zones, and out-of-hours scheduling to protect building occupants and ground transport.',
  },
];

export function DronePeopleGovernance() {
  return (
    <section 
      aria-label="Operations Team & Aviation Governance"
      className="py-24 sm:py-32 bg-white text-slate-900 overflow-hidden border-b border-slate-200"
    >
      <div className="container-custom space-y-24">
        
        {/* Section 1: The People Behind the Flight */}
        <div className="space-y-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
              <Users className="h-4 w-4" />
              <span>THE SPECIALIST TEAM</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
              The people behind <br />
              <span className="font-normal text-slate-950">
                the flight.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              EntireFM is a service business powered by experienced pilots, chartered surveyors, project managers, and trade engineers who ensure every flight delivers tangible engineering outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_PROFILES.map((member, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-slate-950 shadow-md">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center filter brightness-[0.95] contrast-[1.05] transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    {member.name}
                  </h3>
                  <div className="text-xs text-brand-pink font-medium">
                    {member.role}
                  </div>
                  <p className="text-xs text-slate-500 font-light leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
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
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>0{gIdx + 1}</span>
                </div>
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
