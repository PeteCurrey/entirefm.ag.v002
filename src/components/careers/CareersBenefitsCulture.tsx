'use client';

import React from 'react';
import {
  Truck,
  GraduationCap,
  HeartPulse,
  Smartphone,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Fleet & Precision Tooling',
    eyebrow: 'ENGINEERING ASSETS',
    description: 'Modern, fully liveried vans equipped with calibrated test meters, extraction systems, specialized diagnostic gear, safety equipment, and private fuel cards.',
  },
  {
    icon: GraduationCap,
    title: 'Funded Accreditations & CPD',
    eyebrow: 'DEVELOPMENT & QUALIFICATIONS',
    description: 'EntireFM funds your ongoing certifications, including City & Guilds 2391, 18th Edition, F-Gas Category 1, IRATA Rope Access, IWFM qualifications, and health & safety diplomas.',
  },
  {
    icon: Smartphone,
    title: 'Digital Operations (Zero Paper)',
    eyebrow: 'ENTIRECAFM TECHNOLOGY',
    description: 'All work orders, asset histories, dynamic risk assessments, and timesheets live in our proprietary EntireCAFM mobile app on company-provided iPhone and iPad devices.',
  },
  {
    icon: HeartPulse,
    title: 'Health, Wellness & Protection',
    eyebrow: 'EMPLOYEE WELLBEING',
    description: 'Comprehensive private healthcare cash plan (dental, optical, therapy), 24/7 Employee Assistance Programme (EAP), life assurance, and workplace mental health support.',
  },
  {
    icon: Clock,
    title: 'Fair Standby & Overtime Rates',
    eyebrow: 'TRANSPARENT REWARD',
    description: 'Competitive basic salaries, clear overtime bands (1.5x / 2.0x), guaranteed standby rota retainers, and transparent annual progression milestones.',
  },
  {
    icon: Zap,
    title: 'Collaborative Operational Culture',
    eyebrow: 'NO ISOLATION',
    description: 'Technical backup whenever you need it. Our duty managers, compliance leads, and operations desk support our mobile teams in real-time across every job.',
  },
];

export function CareersBenefitsCulture() {
  return (
    <section className="bg-brand-void text-white py-20 lg:py-28 border-b border-brand-edge-dark relative overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
              THE ENTIREFM STANDARD // REWARD, TOOLING &amp; PROGRESSION
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
            How we support the people who keep buildings running.
          </h2>

          <p className="text-base sm:text-lg text-brand-mist/80 font-light leading-relaxed">
            We invest in the right equipment, ongoing technical training, fair remuneration, and modern software so you can do your best work safely and with pride.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-sm border border-brand-edge-dark bg-brand-carbon p-6 lg:p-8 space-y-4 transition-all duration-300 hover:border-brand-electric/50"
              >
                <div className="w-10 h-10 rounded-sm bg-white/[0.04] border border-white/10 flex items-center justify-center text-brand-electric-bright">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink block">
                    {b.eyebrow}
                  </span>
                  <h3 className="text-lg font-light tracking-tight text-white">
                    {b.title}
                  </h3>
                  <p className="text-sm font-light text-brand-mist/70 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
