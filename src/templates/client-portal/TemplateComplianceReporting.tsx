'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductFrame } from '@/components/client-portal/ProductFrame';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';

export function TemplateComplianceReporting() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Client Portal', url: '/client-portal' },
    { name: 'Compliance & Reporting', url: '/client-portal/compliance-reporting' },
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
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 font-mono text-[11px] font-normal text-[#059669]">
                <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
                STATUTORY COMPLIANCE &amp; REPORTING
              </span>
              <span className="font-mono text-[11.5px] text-[#686866]">
                SFG20 &amp; British Standards
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#101010] leading-[1.15]">
              Compliance shouldn&apos;t disappear{' '}
              <span className="font-light block mt-1">
                into a filing cabinet.
              </span>
            </h1>

            <p className="text-[16px] text-[#4B5563] mt-5 leading-relaxed">
              From statutory obligation to immutable proof of completion. EntireCAFM connects every physical plantroom asset directly to British Standards, SFG20 task codes, engineer accreditations, and digital evidence vaults.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <Link
                href="/contact-us?subject=Compliance%20Portal%20Walkthrough"
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#EA580C] px-6 py-3 text-[13.5px] font-normal text-white shadow hover:bg-[#D44708] transition-all"
              >
                Book Compliance Demonstration
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

          {/* Primary PPM Autopilot & Compliance Visual */}
          <section className="mb-16">
            <ProductFrame
              src="/images/client-portal/entirecafm-ppm-autopilot.png"
              alt="EntireCAFM PPM Autopilot Control Desk & Statutory Compliance"
              caption="PPM Autopilot Control Desk: 99.7% Statutory Compliance score, 1,428 active plan items, SFG20 dynamic frequency leveling, and mobile engineer capacity."
              badge="99.7% COMPLIANT"
              badgeType="live"
              aspectRatio="16/10"
            />
          </section>

          {/* End-to-End Compliance Chain */}
          <section className="mb-20">
            <div className="max-w-3xl mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                THE COMPLIANCE INFORMATION MODEL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                From statutory duty to auditable digital proof
              </h2>
              <p className="text-[14px] text-[#686866] mt-2 leading-relaxed">
                We don&apos;t just present a green compliance percentage. We preserve the full lineage connecting legislation to the engineer holding the tool on site.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  title: 'Statutory Obligation',
                  desc: 'Mapped to UK legislation: BS 7671 (EICR), BS 5839 (Fire Alarms), ACOP L8 (Legionella), Gas Safety Reg 35.',
                  badge: 'Legal Mandate',
                },
                {
                  step: '02',
                  title: 'Asset Register Linkage',
                  desc: 'Assigned to individual plantroom equipment with SFG20 standard frequencies and manufacturer specifications.',
                  badge: 'SFG20 Mapped',
                },
                {
                  step: '03',
                  title: 'Certified Field Execution',
                  desc: 'Auto-dispatched exclusively to engineers holding verified NICEIC, F-Gas Cat 1, or Gas Safe credentials.',
                  badge: 'Accreditation Gate',
                },
                {
                  step: '04',
                  title: 'Immutable Evidence Vault',
                  desc: 'Certificates, test values, and time-stamped photos stored in the Compliance Vault for instant insurer audit.',
                  badge: 'Audit Ready',
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded-[10px] border border-[#E4E4E1] bg-white p-5 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="font-mono text-[11px] font-normal text-[#059669] block mb-1">
                      PILLAR {s.step}
                    </span>
                    <h3 className="text-[15px] font-normal text-[#101010] mb-2">
                      {s.title}
                    </h3>
                    <p className="text-[12.5px] text-[#4B5563] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#F0F0EE] mt-4">
                    <span className="inline-block rounded-[4px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 font-mono text-[10px] font-normal">
                      {s.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Compliance Vault Detail Section */}
          <section className="mb-20">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C]">
                    COMPLIANCE VAULT
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                    Instant audit packs for insurers, fire officers, and local authorities.
                  </h2>
                  <p className="text-[14px] text-[#4B5563] leading-relaxed">
                    Rather than spending days pulling paperwork from disparate folders, EntireCAFM lets authorised users generate comprehensive, point-in-time statutory compliance packs in a single click.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { title: 'Electrical (EICR)', desc: '5-year fixed wire test certificates and remedial thermography.' },
                      { title: 'Fire & Life Safety', desc: 'Weekly bell tests, 6-monthly detector checks, and FRA actions.' },
                      { title: 'Water Hygiene (L8)', desc: 'Monthly calorifier temperatures, flushing logs, and sampling.' },
                      { title: 'Gas & Pressure Systems', desc: 'Non-domestic CP15 certificates and written schemes of examination.' },
                    ].map((item) => (
                      <div key={item.title} className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-3">
                        <strong className="text-[12.5px] font-normal text-[#101010] block">
                          {item.title}
                        </strong>
                        <span className="text-[11.5px] text-[#686866] block mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <ProductFrame
                    src="/images/client-portal/entirecafm-ppm-autopilot-drawer.png"
                    alt="EntireCAFM PPM Autopilot Estate Drawer"
                    caption="PPM Autopilot Estate Drawer: Manchester City Tower 100% compliance breakdown, assigned Lead Engineer, and upcoming statutory visits."
                    badge="COMPLIANCE VAULT"
                    badgeType="audit"
                    aspectRatio="16/10"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Proposal / Demo CTA */}
          <ProposalSection
            defaultService="Compliance & Planned Maintenance"
            headline="Audit-Proof Your Commercial Estate"
            subheadline="Speak with our compliance engineering team to see how EntireCAFM transforms statutory safety management."
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
