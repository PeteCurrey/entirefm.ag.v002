'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  Box,
  Layers,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Activity,
  Cpu,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductFrame } from '@/components/client-portal/ProductFrame';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import { TrustBar } from '@/components/trust/TrustBar';

export function TemplateSite360() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Client Portal', url: '/client-portal' },
    { name: 'Site 360 Workspace', url: '/client-portal/site-360' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col">
      <Header />

      <main id="main" className="flex-grow pt-24 pb-20">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Hero Section */}
          <section className="mb-16 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-purple-50 border border-purple-200 text-xs font-light text-purple-800">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
              SITE 360 PHYSICAL ASSET CANVAS // SPATIAL FACILITIES MANAGEMENT
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
              Every building has a{' '}
              <span className="block font-light text-slate-700 mt-1">
                digital operating picture.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              Moving CAFM away from abstract database rows and into the physical reality of the building. Site 360 unifies high-resolution site photography, CAD floor plans, asset hierarchies, live sensor nodes, and operational risk overlays.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/contact-us?subject=Site%20360%20Demonstration"
                className="btn-primary"
              >
                Experience Site 360 Live <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/client-portal"
                className="btn-ghost-dark"
              >
                &larr; Back to Portal Overview
              </Link>
            </div>
          </section>

          <TrustBar />

          {/* Primary Full-Width Site 360 Workspace Visual */}
          <section className="my-16">
            <ProductFrame
              src="/images/client-portal/entirecafm-site-360-workspace.png"
              alt="EntireCAFM Site 360 Digital Operating Picture"
              caption="Site 360 Physical Asset Canvas: Victoria House Commercial Complex (8,450 m² GIA, 48 online sensor nodes, live P1 boiler plant trip overlay, and on-site engineer tracking)."
              badge="48 SENSORS ONLINE"
              badgeType="telemetry"
              aspectRatio="16/10"
            />
          </section>

          {/* 4 Spatial Presentation Modes */}
          <section className="my-20 bg-[#FAF9FB] border border-slate-200 rounded-sm p-8 lg:p-12 shadow-sm">
            <div className="max-w-3xl mb-10">
              <span className="eyebrow eyebrow-light">SPATIAL DIMENSIONS</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Four Ways Site 360 Navigates Physical Facilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light mt-2 leading-relaxed">
                Connect physical building topography to statutory compliance and engineer attendance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              {[
                { title: '1. Photographic Reality', desc: 'True-to-life 360° panos of plantrooms, electrical intake cupboards, and riser cupboards with clickable asset tags.' },
                { title: '2. 2D CAD & BIM Overlays', desc: 'Integrated architectural drawings with asset pin locations, fire compartment lines, and isolated emergency shutoffs.' },
                { title: '3. Real-Time Telemetry', desc: '48 wireless IoT sensors tracking live vibration frequencies, flow rates, and plant ambient temperatures.' },
                { title: '4. Contractor Access Log', desc: 'Dynamic map showing checked-in engineers and active permits-to-work across roof, plant, and tenant zones.' },
              ].map((m, i) => (
                <div key={i} className="p-6 bg-white border border-slate-200 rounded-sm space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-normal text-slate-900 block">{m.title}</span>
                    <p className="text-xs text-slate-600 font-light leading-relaxed mt-2">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Direct Enquiry Proposal Form */}
          <ProposalSection
            defaultService="Site 360 Spatial Canvas Demonstration"
            headline="Experience Site 360 on Your Estate"
            subheadline="See how EntireCAFM transforms static building drawings and maintenance spreadsheets into an interactive spatial operating canvas."
          />

          {/* Newsletter Section */}
          <div className="mt-16">
            <NewsletterSignupSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
