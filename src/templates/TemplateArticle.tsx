import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection, InlineCTA } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Calendar, User, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function TemplateArticle() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/blog' },
    { name: 'What is Facilities Management?', url: '/what-is-facilities-management' },
  ];

  const relatedLinks = [
    { path: '/hard-services', label: 'What are Hard FM Services?' },
    { path: '/ppm', label: 'Planned Preventative Maintenance Guide' },
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Services' },
    { path: '/services', label: 'Explore All FM Capabilities' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="bg-brand-navy border-b border-brand-border-dark/60">
          <div className="container-custom">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>

        {/* Article Header */}
        <section className="bg-brand-navy text-white py-14 sm:py-18 border-b border-brand-border-dark">
          <div className="container-narrow space-y-4">
            <span className="badge-gold">FM Intelligence & Industry Guides</span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              What is Facilities Management? A Complete Guide for UK Property & Estate Managers
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-brand-border-dark/80">
              <span className="flex items-center gap-1.5 text-slate-300">
                <User className="w-3.5 h-3.5 text-brand-gold" />
                EntireFM Technical Editorial Team
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                Updated: 2026
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-brand-gold" />
                6 Min Read
              </span>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Article Editorial Body */}
        <article className="section-padding bg-white">
          <div className="container-narrow space-y-6 text-slate-700 leading-relaxed">
            <p className="text-base sm:text-lg font-medium text-brand-navy leading-relaxed">
              Facilities Management (FM) is the multidisciplinary practice of ensuring that the physical environment, mechanical infrastructure, and support services of a building operate efficiently, safely, and in full compliance with UK statutory law.
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-brand-navy pt-4">1. Hard FM vs Soft FM: The Core Distinction</h2>
            <p className="text-sm">
              In commercial property, facilities management is broadly divided into two primary disciplines:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="p-5 bg-brand-surface border border-brand-border rounded-sm">
                <strong className="text-brand-navy block text-sm font-bold mb-1">Hard Facilities Management</strong>
                <p className="text-xs text-slate-600">
                  Relates to physical, structural, and engineering assets: HVAC, mechanical heating, electrical distribution, fire alarms, and emergency lighting.
                </p>
              </div>
              <div className="p-5 bg-brand-surface border border-brand-border rounded-sm">
                <strong className="text-brand-navy block text-sm font-bold mb-1">Soft Facilities Management</strong>
                <p className="text-xs text-slate-600">
                  Relates to services that enhance user well-being and workspace functionality: commercial cleaning, security guarding, grounds maintenance, and waste disposal.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-brand-navy pt-4">2. The Strategic Value of Planned Preventative Maintenance (PPM)</h2>
            <p className="text-sm">
              Relying purely on reactive callouts when equipment fails results in exorbitant emergency repair bills, extended tenant downtime, and premature capital asset degradation. A modern FM strategy deploys SFG20-aligned planned preventative maintenance to service plant equipment before failure occurs.
            </p>

            <InlineCTA
              title="Need professional guidance on structuring your FM contract?"
              description="Our senior surveyors assess building condition, audit compliance registers, and recommend optimized maintenance frequencies."
              buttonText="Request FM Consultation"
              buttonLink="#enquiry"
            />

            <h2 className="text-2xl font-bold tracking-tight text-brand-navy pt-4">3. Ensuring Statutory Compliance</h2>
            <p className="text-sm">
              Building owners and managing agents bear non-delegable legal responsibilities under UK Health & Safety legislation. Professional facilities management ensures all mandatory inspections — including EICR electrical testing, Gas Safety certification, and Legionella control — are executed on schedule.
            </p>
          </div>
        </article>

        <RelatedLinks links={relatedLinks} title="Further Facilities Management Reading & Service Guides" />

        <ProposalSection
          headline="Request an Estate Review with EntireFM"
          subheadline="Consult with our engineering directors regarding single-site or portfolio maintenance scopes, compliance audits, or reactive helpdesk support."
        />
      </main>
      <Footer />
    </div>
  );
}
