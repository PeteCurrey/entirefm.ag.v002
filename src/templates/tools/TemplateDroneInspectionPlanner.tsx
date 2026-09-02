'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { DroneInspectionPlanner } from '@/components/tools/drone-planner/DroneInspectionPlanner';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { 
  Camera, 
  Layers, 
  Flame, 
  Building2, 
  Sun, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateDroneInspectionPlannerProps {
  route: RouteRecord;
  content: ContentRecord;
}

export function TemplateDroneInspectionPlanner({
  route,
  content,
}: TemplateDroneInspectionPlannerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1220] text-white relative">
      <Header />

      {/* Hero Photographic Background behind transparent header */}
      <div className="absolute inset-x-0 top-0 h-[480px] -z-10 overflow-hidden pointer-events-none">
        <Image
          src="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
          alt="EntireFM Drone Survey Inspection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/60 via-[#0B1220]/80 to-[#0B1220]"
        />
      </div>

      <main id="main" className="flex-grow pt-[calc(72px+1.5rem)] pb-20">
        {/* Subtle Background Accent */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="container-custom relative z-10 space-y-16">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="pt-4">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-normal text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/services/drone-services" className="hover:text-white transition-colors">Drone Services</Link>
              </li>
              <li>/</li>
              <li className="text-brand-pink font-light" aria-current="page">
                Inspection Planner
              </li>
            </ol>
          </nav>

          {/* Interactive Planner Tool Viewport */}
          <div className="p-6 sm:p-10 rounded-[14px] bg-[#0E1726] border border-brand-edge-dark shadow-elevated">
            <DroneInspectionPlanner />
          </div>

          <TrustBar />

          {/* Cross-Link Exploration Grid */}
          <section className="p-8 rounded-[14px] bg-brand-carbon border border-brand-edge-dark space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
                EXPLORE DRONE CAPABILITIES
              </span>
              <h2 className="text-xl font-light text-white">
                Learn more about EntireFM Drone Services
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Drone Roof Inspections', href: '/services/drone-services/roof-inspections', icon: Layers },
                { title: 'Thermal Drone Surveys', href: '/services/drone-services/thermal-imaging', icon: Flame },
                { title: 'Building Envelope & Façade', href: '/services/drone-services/building-envelope-inspections', icon: Building2 },
                { title: 'Solar PV Inspections', href: '/services/drone-services/solar-pv-inspections', icon: Sun },
              ].map((srv, idx) => {
                const Icon = srv.icon;
                return (
                  <Link
                    key={idx}
                    href={srv.href}
                    className="p-4 rounded-sm bg-brand-graphite border border-brand-edge-dark hover:border-brand-pink hover:bg-white/[0.04] transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-brand-pink" />
                      <span className="text-xs font-normal text-white group-hover:text-brand-pink transition-colors">
                        {srv.title}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-pink transition-colors" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Technical FAQs */}
          <section className="max-w-4xl mx-auto space-y-8 pt-4">
            <div className="text-center space-y-2">
              <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-white">
                Drone Inspection Planner FAQ
              </h2>
            </div>

            <div className="bg-brand-carbon p-6 rounded-[14px] border border-brand-edge-dark">
              <FAQAccordion faqs={content.faqs || []} />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
