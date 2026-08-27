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
import { TrustBar } from '@/components/trust/TrustBar';

export function TemplateComplianceReporting() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Client Portal', url: '/client-portal' },
    { name: 'Compliance & Reporting', url: '/client-portal/compliance-reporting' },
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-emerald-50 border border-emerald-200 text-xs font-light text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              STATUTORY COMPLIANCE &amp; REPORTING // SFG20 &amp; BRITISH STANDARDS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
              Compliance shouldn&apos;t disappear{' '}
              <span className="block font-extralight text-slate-900 mt-1">
                into a filing cabinet.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              From statutory obligation to immutable proof of completion. EntireCAFM connects every physical plantroom asset directly to British Standards, SFG20 task codes, engineer accreditations, and digital evidence vaults.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/contact-us?subject=Compliance%20Portal%20Walkthrough"
                className="btn-primary"
              >
                Book Compliance Demonstration <ArrowRight className="h-4 w-4" />
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

          {/* Primary PPM Autopilot & Compliance Visual */}
          <section className="my-16">
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
          <section className="my-20 bg-[#FAF9FB] border border-slate-200 rounded-sm p-8 lg:p-12 shadow-sm">
            <div className="max-w-3xl mb-10">
              <span className="eyebrow eyebrow-light">AUDIT CERTAINTY</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                The 6-Step Statutory Assurance Model
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light mt-2 leading-relaxed">
                How EntireCAFM transforms building regulations into verifiable legal protection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {[
                { title: '1. Standard Mapping', desc: 'Every maintainable asset is mapped to applicable legislation: Electricity at Work, Gas Safety, ACoP L8 (Legionella), Regulatory Reform (Fire Safety) Order, and LOLER.' },
                { title: '2. SFG20 Automation', desc: 'Preventative task schedules are generated with certified frequency intervals, required engineering trade qualifications, and risk-assessed method statements.' },
                { title: '3. Digital Vault Deposit', desc: 'Completed certificates (EICR, CP12/15, TM44, Fire Damper Drop Tests) are indexed and stored with 10-year immutable audit retention.' },
              ].map((c, i) => (
                <div key={i} className="p-6 bg-white border border-slate-200 rounded-sm space-y-2">
                  <span className="text-xs font-normal text-slate-900 block">{c.title}</span>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Direct Enquiry Proposal Form */}
          <ProposalSection
            defaultService="Compliance & Reporting Demonstration"
            headline="Inspect the Digital Compliance Vault"
            subheadline="See how EntireCAFM eliminates regulatory risk, proves SFG20 compliance, and produces instant audit packs for your property portfolio."
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
