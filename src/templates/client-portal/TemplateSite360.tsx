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

export function TemplateSite360() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Client Portal', url: '/client-portal' },
    { name: 'Site 360 Workspace', url: '/client-portal/site-360' },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#101010] antialiased selection:bg-[#EA580C] selection:text-white">
      <Header solid />

      <main className="pt-24 pb-20">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Hero Section */}
          <section className="mb-14 max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[11px] font-normal text-[#C2410C]">
                <span className="h-2 w-2 rounded-full bg-[#EA580C] animate-pulse" />
                SITE 360 PHYSICAL ASSET CANVAS
              </span>
              <span className="font-mono text-[11.5px] text-[#686866]">
                Spatial Facilities Management
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#101010] leading-[1.15]">
              Every building has a{' '}
              <span className="font-light block mt-1">
                digital operating picture.
              </span>
            </h1>

            <p className="text-[16px] text-[#4B5563] mt-5 leading-relaxed">
              Moving CAFM away from abstract database rows and into the physical reality of the building. Site 360 unifies high-resolution site photography, CAD floor plans, asset hierarchies, live sensor nodes, and operational risk overlays.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <Link
                href="/contact-us?subject=Site%20360%20Demonstration"
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#EA580C] px-6 py-3 text-[13.5px] font-normal text-white shadow hover:bg-[#D44708] transition-all"
              >
                Experience Site 360 Live
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/client-portal"
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#E4E4E1] bg-white px-5 py-3 text-[13.5px] font-normal text-[#101010] hover:bg-[#F5F5F3] transition-colors"
              >
                ← Back to Portal Overview
              </Link>
            </div>
          </section>

          {/* Primary Full-Width Site 360 Workspace Visual */}
          <section className="mb-16">
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
          <section className="mb-20">
            <div className="max-w-3xl mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                FOUR PRESENTATION MODES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                Understand your building through multiple interfaces
              </h2>
              <p className="text-[14px] text-[#686866] mt-2 leading-relaxed">
                Switch seamlessly between visual reality, spatial CAD diagrams, and structured engineering data.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  mode: 'Photo Reality',
                  title: 'Photographic Canvas',
                  desc: 'High-resolution exterior and plantroom photography overlaid with live asset status and active work order pins.',
                  tag: 'Visual Context',
                },
                {
                  mode: 'Floor Plans / CAD',
                  title: 'Spatial CAD Overlay',
                  desc: 'Architectural drawings showing zone boundaries, escape routes, distribution boards, and valve isolation locations.',
                  tag: 'Architectural Layer',
                },
                {
                  mode: 'Asset Hierarchy',
                  title: 'Engineering Tree',
                  desc: 'Structured parent-child asset breakdown connecting central chiller plants to tenant fan coil units and dampers.',
                  tag: 'SFG20 Hierarchy',
                },
                {
                  mode: 'Spatial / Access',
                  title: 'Security & Access Protocols',
                  desc: 'Floor-by-floor access rules, permit requirements, keyholder contacts, and risers/plantroom safety hazards.',
                  tag: 'Access Control',
                },
              ].map((m) => (
                <div
                  key={m.mode}
                  className="rounded-[10px] border border-[#E4E4E1] bg-white p-5 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="font-mono text-[10.5px] font-normal text-[#EA580C] block mb-1">
                      {m.mode.toUpperCase()}
                    </span>
                    <h3 className="text-[15px] font-normal text-[#101010] mb-2">
                      {m.title}
                    </h3>
                    <p className="text-[12.5px] text-[#4B5563] leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#F0F0EE] mt-4">
                    <span className="inline-block rounded-[4px] bg-[#F5F5F3] px-2 py-0.5 font-mono text-[10px] text-[#686866]">
                      {m.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 11 Integrated Facility Modules Grid */}
          <section className="mb-20">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="max-w-3xl mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                  FACILITY INTELLIGENCE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                  11 Integrated modules inside every building profile
                </h2>
                <p className="text-[14px] text-[#686866] mt-2">
                  Everything relating to a specific facility unified in one place.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Overview', desc: 'Building parameters, GIA, occupancy, and current operational posture.' },
                  { name: 'Spaces & Zones (24)', desc: 'Floor plate subdivisions, tenant demises, and common areas.' },
                  { name: 'Assets (148)', desc: 'Full plant register with serial numbers, warranty, and condition ratings.' },
                  { name: 'Work Orders (3)', desc: 'Active reactive maintenance tickets and target completion countdowns.' },
                  { name: 'PPM Schedule', desc: '52-week master planned maintenance calendar aligned to SFG20.' },
                  { name: 'Compliance Vault (16)', desc: 'Statutory certificates, test sheets, and written schemes of control.' },
                  { name: 'Documents & O&M (42)', desc: 'Building operating manuals, schematic drawings, and asset handbooks.' },
                  { name: 'Key Contacts', desc: 'Lead FM Director, site managers, gatekeepers, and emergency contacts.' },
                  { name: 'Energy & Meters', desc: 'Sub-metering, gas/electricity telemetry, and consumption trends.' },
                  { name: 'Commercial Ledger', desc: 'Committed WIP, approved repair quotes, and historical spend.' },
                  { name: 'Audit Trail', desc: 'Immutable chronological ledger recording every action taken on site.' },
                ].map((mod) => (
                  <div key={mod.name} className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-4">
                    <h4 className="text-[13.5px] font-normal text-[#101010]">
                      {mod.name}
                    </h4>
                    <p className="text-[12px] text-[#686866] mt-1 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Proposal / Demo CTA */}
          <ProposalSection
            defaultService="Site 360 Spatial CAFM"
            headline="Transform How You Experience Your Facilities"
            subheadline="Book a live walkthrough to see Site 360 in action across real commercial and industrial estates."
          />

          <div className="mt-16">
            <NewsletterSignupSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
