'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Wrench, Headphones, Layers, Cpu, TrendingUp } from 'lucide-react';

const DISCIPLINES = [
  {
    title: 'Engineering & Technical',
    icon: Wrench,
    eyebrow: 'FIELD & SPECIALIST',
    description: 'Commercial M&E engineers, HVAC specialists, high-voltage technicians, water hygiene officers, and rope access operatives delivering frontline maintenance on client assets.',
    imageSrc: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
    imageAlt: 'EntireFM commercial maintenance engineer executing thermal inspection',
    roles: ['Mobile M&E Engineers', 'HVAC Technicians', 'Electrical Testers (EICR)', 'Water Hygiene Specialists'],
  },
  {
    title: 'Operations & Helpdesk',
    icon: Headphones,
    eyebrow: '24/7 SERVICE DELIVERY',
    description: 'Central operations controllers, helpdesk coordinators, regional dispatchers, and customer service teams managing emergency callouts, reactive tickets, and client SLAs.',
    imageSrc: '/images/editorial/entirefm-reception-2000w.webp',
    imageAlt: 'EntireFM commercial reception and customer operations desk',
    roles: ['Helpdesk Coordinators', 'Duty Operations Managers', 'Contract Schedulers', 'Client Relationship Leads'],
  },
  {
    title: 'Projects & Mobilisation',
    icon: Layers,
    eyebrow: 'LIFECYCLE & ONBOARDING',
    description: 'Specialist managers leading multi-site contract onboarding, asset barcode surveys, SFG20 matrix setup, capital plant replacements, and compliance remediation programmes.',
    imageSrc: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
    imageAlt: 'EntireFM commercial managed premises',
    roles: ['Contract Mobilisation Managers', 'Project Engineers', 'Asset Survey Specialists', 'TUPE & Transition Leads'],
  },
  {
    title: 'Technology & Digital',
    icon: Cpu,
    eyebrow: 'CAFM & AUTOMATION',
    description: 'Engineers building the EntireCAFM software suite, IoT sensor telemetry pipelines, automated dispatch algorithms, reality mesh digital twins, and client compliance dashboards.',
    imageSrc: '/images/editorial/entirefm-plumbing-pressure-test-2000w.webp',
    imageAlt: 'Engineers deploying technical diagnostics',
    roles: ['CAFM Systems Engineers', 'IoT & Telemetry Specialists', 'Full-Stack Developers', 'Product Designers'],
  },
  {
    title: 'Commercial & Corporate',
    icon: TrendingUp,
    eyebrow: 'FINANCE & PROCUREMENT',
    description: 'Commercial managers, estimators, procurement partners, and finance controllers ensuring fair supply chain payment, transparent rate cards, and sustainable growth.',
    imageSrc: '/images/suppliers/supplier-events-hero.jpg',
    imageAlt: 'EntireFM executive commercial meeting and relationship forum',
    roles: ['FM Estimators & Bid Leads', 'Commercial Managers', 'Procurement Officers', 'Management Accountants'],
  },
];

export function LifeAtEntireFM() {
  return (
    <section className="bg-brand-void text-white py-20 lg:py-28 border-b border-brand-edge-dark relative overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
              OPERATIONAL DISCIPLINES // WHERE YOUR EXPERTISE FITS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
            Diverse disciplines. One operational standard.
          </h2>

          <p className="text-base sm:text-lg text-brand-mist/80 font-light leading-relaxed">
            Whether you work in the plantroom, at the operations desk, on the digital product team, or in commercial management, your work directly supports the buildings that keep the UK economy moving.
          </p>
        </div>

        {/* 5-Card Discipline Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISCIPLINES.map((item, idx) => {
            const Icon = item.icon;
            const isWide = idx === 0 || idx === 3;

            return (
              <div
                key={item.title}
                className={`group relative rounded-sm border border-brand-edge-dark bg-brand-carbon overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-brand-electric/50 ${
                  isWide ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Visual Header with Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-carbon via-brand-carbon/60 to-transparent" />
                  
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-brand-void/80 border border-white/10 backdrop-blur-sm">
                    <Icon className="w-3.5 h-3.5 text-brand-electric-bright" />
                    <span className="text-[10px] font-normal uppercase tracking-wider text-brand-mist/90">
                      {item.eyebrow}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-light tracking-tight text-white group-hover:text-brand-electric-bright transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[13px] font-light text-brand-mist/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Typical Roles Pill List */}
                  <div className="pt-3 border-t border-white/[0.06] space-y-2">
                    <span className="text-[10px] font-normal uppercase tracking-wider text-brand-mist/40 block">
                      TYPICAL ROLES
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.roles.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-1 rounded-xs bg-white/[0.04] border border-white/[0.08] text-[11px] font-light text-brand-mist/80"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
