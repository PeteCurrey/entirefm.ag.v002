'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { EnquiryForm } from '@/components/conversion/EnquiryForm';
import { BrandIcon, BrandIconKey } from '@/components/ui/BrandIcon';
import { CONTACT_CONFIG } from '@/config/contact';
import { ORGANIZATION_CONFIG } from '@/config/organization';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Headphones,
} from 'lucide-react';

interface ContactPathway {
  id: string;
  title: string;
  category: string;
  description: string;
  ctaText: string;
  iconName: BrandIconKey;
  targetService: string;
  isExternalLink?: boolean;
  href?: string;
}

const CONTACT_PATHWAYS: ContactPathway[] = [
  {
    id: 'new-business',
    category: 'NEW BUSINESS',
    title: 'New Business & Tenders',
    description: 'Discuss an FM requirement, tender specification, contract mobilisation, or new national service agreement.',
    ctaText: 'Start an Enquiry',
    iconName: 'proposalReporting',
    targetService: 'Tender / Framework Proposal',
  },
  {
    id: 'client-support',
    category: 'CLIENT HELPDESK',
    title: 'Existing Client Support',
    description: 'Dedicated operations helpdesk, reactive engineering dispatch, and contracted site maintenance support.',
    ctaText: 'Access Client Helpdesk',
    iconName: 'customerSupport',
    targetService: 'Existing Client Support',
    isExternalLink: true,
    href: '/helpdesk',
  },
  {
    id: 'site-survey',
    category: 'TECHNICAL AUDIT',
    title: 'Site Survey / Technical Review',
    description: 'M&E plant assessment, HVAC evaluation, PPM schedule review, or specialist service audit.',
    ctaText: 'Request Site Survey',
    iconName: 'maintenanceTools',
    targetService: 'Site Survey / Technical Review',
  },
  {
    id: 'general-enquiry',
    category: 'CORPORATE DESK',
    title: 'General Enquiries',
    description: 'Corporate communications, supplier queries, careers desk, and general operational contact.',
    ctaText: 'Contact Operations',
    iconName: 'commercialBuildings',
    targetService: 'Other / Multiple Services',
  },
];

const CAPABILITIES = [
  {
    title: 'Hard FM & Building Engineering',
    desc: 'Mechanical & electrical plant care, HV/LV switchgear, HVAC systems, boiler servicing, and fabric maintenance.',
  },
  {
    title: 'Planned Preventative Maintenance (PPM)',
    desc: 'SFG20 compliant asset maintenance, statutory compliance logging, and structured preventative visits.',
  },
  {
    title: 'Reactive Engineering & Urgent Cover',
    desc: 'Direct engineer dispatch, urgent plant fault triage, and managed contractor response.',
  },
  {
    title: 'Specialist & Industrial Services',
    desc: 'High-level commercial cleaning, industrial maintenance, grounds care, and specialist building access.',
  },
  {
    title: 'Multi-Site Portfolio Oversight',
    desc: 'Centralised account management, digital job tracking, and consolidated monthly estate reporting.',
  },
];

export function TemplateContact() {
  const [selectedService, setSelectedService] = useState<string>('Total Facilities Management');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Contact EntireFM', url: '/contact-us' },
  ];

  const handlePathwayClick = (pathway: ContactPathway) => {
    if (!pathway.isExternalLink) {
      setSelectedService(pathway.targetService);
      const formElement = document.getElementById('enquiry-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* =========================================================================
            1. CINEMATIC CONTACT HERO
            ========================================================================= */}
        <section className="on-dark relative isolate flex min-h-[38rem] lg:min-h-[42rem] w-full flex-col overflow-hidden bg-brand-graphite">
          {/* Photographic Background */}
          <div className="absolute inset-0 -z-20">
            <Image
              src="/images/EntireFM 01.png"
              alt="EntireFM Commercial Operations Facility"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Dark Overlay with subtle illumination */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                'linear-gradient(96deg, rgba(11,18,32,0.96) 0%, rgba(11,18,32,0.90) 42%, rgba(11,18,32,0.68) 78%, rgba(11,18,32,0.48) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-36"
            style={{ background: 'linear-gradient(to top, rgba(11,18,32,1), transparent)' }}
          />
          <div
            aria-hidden="true"
            className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-30"
          />

          {/* Breadcrumbs offset by header height */}
          <div className="relative pt-[calc(var(--header-h)+0.5rem)]">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Hero Content Container */}
          <div className="container-wide relative flex flex-1 items-center pb-16 pt-6">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/[0.07] border border-white/15 backdrop-blur-sm mb-6">
                <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink-light">
                  CONTACT ENTIREFM
                </span>
              </div>

              {/* H1 Heading */}
              <h1 className="text-display-xl text-white font-extrabold tracking-tight">
                Let&apos;s Talk About{' '}
                <span className="text-hero-pink">Your Estate.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-brand-mist/85 font-normal">
                Whether you need a single-source FM partner, specialist maintenance support, a comprehensive site survey, or assistance with an existing contract, speak directly with the EntireFM team.
              </p>

              {/* CTAs */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#enquiry-form"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-hero-pink"
                >
                  <span>Start an Enquiry</span>
                  <ArrowRight className="btn-arrow h-4 w-4" />
                </a>

                <Link href="/helpdesk" className="btn-ghost-light">
                  <Headphones className="h-4 w-4 text-brand-pink-light" />
                  <span>Existing Client Support</span>
                </Link>

                <a href={CONTACT_CONFIG.mainPhone.href} className="btn-ghost-light">
                  <Phone className="h-4 w-4 text-brand-pink-light" />
                  <span>{CONTACT_CONFIG.mainPhone.display}</span>
                </a>
              </div>

              {/* Supporting Facts Row */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10">
                <div className="bg-brand-graphite/75 px-5 py-3.5 backdrop-blur-md">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">UK Nationwide</div>
                  <div className="text-xs text-brand-mist/70 mt-0.5">Commercial & industrial coverage</div>
                </div>
                <div className="bg-brand-graphite/75 px-5 py-3.5 backdrop-blur-md">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Direct Operations Desk</div>
                  <div className="text-xs text-brand-mist/70 mt-0.5">Commercial technical coordination</div>
                </div>
                <div className="bg-brand-graphite/75 px-5 py-3.5 backdrop-blur-md">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Single-Source Model</div>
                  <div className="text-xs text-brand-mist/70 mt-0.5">Clear operational accountability</div>
                </div>
              </div>
            </div>
          </div>

          <div aria-hidden="true" className="rule-hero-pink absolute inset-x-0 bottom-0" />
        </section>

        {/* =========================================================================
            2. TRUST BAR
            ========================================================================= */}
        <TrustBar />

        {/* =========================================================================
            3. HOW CAN WE HELP? (4-WAY CONTACT METHOD GRID)
            ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white" id="contact-routes">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-1.5 w-6 bg-brand-pink rounded-full" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                  HOW CAN WE HELP?
                </span>
                <span className="h-1.5 w-6 bg-brand-pink rounded-full" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Choose Your Contact Pathway
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                Connect directly with the appropriate commercial, technical, or client operations desk for immediate assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CONTACT_PATHWAYS.map((pathway) => (
                <div
                  key={pathway.id}
                  className="group relative bg-white border border-slate-200/90 rounded-sm p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated hover:border-brand-pink/50 hover:bg-[#FFFDFE]"
                >
                  {/* Subtle top edge hover gradient */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Branded Icon with soft container */}
                    <div className="w-16 h-16 rounded-sm bg-slate-50 border border-slate-200/70 p-2.5 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 group-hover:border-brand-pink/30 group-hover:bg-brand-pink/5 transition-all duration-300">
                      <BrandIcon name={pathway.iconName} size={44} />
                    </div>

                    <span className="text-[11px] font-bold tracking-wider uppercase text-brand-pink block mb-1.5">
                      {pathway.category}
                    </span>

                    <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-brand-graphite transition-colors">
                      {pathway.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {pathway.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    {pathway.isExternalLink ? (
                      <Link
                        href={pathway.href || '/helpdesk'}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-pink group-hover:text-brand-magenta transition-colors"
                      >
                        <span>{pathway.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePathwayClick(pathway)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-pink group-hover:text-brand-magenta transition-colors cursor-pointer text-left"
                      >
                        <span>{pathway.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. NATIONWIDE COVERAGE & VERIFIED CONTACT DIRECTORY (SPLIT LAYOUT)
            ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#FAF9FB] border-y border-slate-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
              {/* LEFT COLUMN: Nationwide Facilities Management */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2.5">
                    <span className="h-2 w-2 rounded-full bg-brand-pink" />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                      NATIONAL ESTATE COVERAGE
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    Nationwide Facilities Management & Specialist Engineering
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                    EntireFM delivers single-source facilities management, planned maintenance, and technical engineering across commercial real estate, logistics hubs, industrial manufacturing sites, and multi-location retail estates nationwide.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {CAPABILITIES.map((cap, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-slate-200/80 rounded-sm shadow-subtle flex items-start gap-3.5 transition-all hover:border-slate-300"
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="block text-sm font-bold text-slate-900">
                          {cap.title}
                        </strong>
                        <span className="text-xs text-slate-600 leading-relaxed mt-0.5 block">
                          {cap.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white border border-dashed border-slate-300 rounded-sm text-xs text-slate-600 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-pink shrink-0" />
                  <span>
                    Fully insured, vetted supply chain, and single-contract operational accountability for your estate.
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: Authoritative Contact Information Panel */}
              <div className="lg:col-span-6">
                <div className="bg-white border border-slate-200 rounded-sm p-7 sm:p-9 shadow-elevated relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink-light via-brand-pink to-brand-magenta" />

                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-pink block mb-1">
                      AUTHORITATIVE DIRECTORY
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Corporate Contact Details
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct contact channels for commercial clients, prospective partners, and suppliers.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100 space-y-4">
                    {/* Main Phone */}
                    <div className="pt-4 first:pt-0 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-sm bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0 mt-0.5 border border-brand-pink/20">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Main Telephone
                        </span>
                        <a
                          href={CONTACT_CONFIG.mainPhone.href}
                          className="text-base sm:text-lg font-bold font-mono text-slate-900 hover:text-brand-pink transition-colors inline-block mt-0.5"
                        >
                          {CONTACT_CONFIG.mainPhone.display}
                        </a>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Central operations desk for commercial enquiries and technical dispatch.
                        </p>
                      </div>
                    </div>

                    {/* Commercial Enquiries Email */}
                    <div className="pt-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                        <Mail className="w-5 h-5 text-brand-pink" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Commercial & Tender Inquiries
                        </span>
                        <a
                          href={`mailto:${CONTACT_CONFIG.enquiryEmail}`}
                          className="text-sm sm:text-base font-semibold font-mono text-slate-900 hover:text-brand-pink transition-colors break-all inline-block mt-0.5"
                        >
                          {CONTACT_CONFIG.enquiryEmail}
                        </a>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tenders, RFQs, framework proposals, and estate reviews.
                        </p>
                      </div>
                    </div>

                    {/* Client Helpdesk Email */}
                    <div className="pt-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                        <Headphones className="w-5 h-5 text-brand-pink" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Client Operations Helpdesk
                        </span>
                        <a
                          href={`mailto:${CONTACT_CONFIG.helpdeskEmail}`}
                          className="text-sm sm:text-base font-semibold font-mono text-slate-900 hover:text-brand-pink transition-colors break-all inline-block mt-0.5"
                        >
                          {CONTACT_CONFIG.helpdeskEmail}
                        </a>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Direct logging for contracted clients and facility managers.
                        </p>
                      </div>
                    </div>

                    {/* Careers & Recruitment */}
                    <div className="pt-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                        <Building2 className="w-5 h-5 text-brand-pink" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Careers & Recruitment
                        </span>
                        <a
                          href={`mailto:${CONTACT_CONFIG.careersEmail}`}
                          className="text-sm sm:text-base font-semibold font-mono text-slate-900 hover:text-brand-pink transition-colors break-all inline-block mt-0.5"
                        >
                          {CONTACT_CONFIG.careersEmail}
                        </a>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Engineering careers, mobile technicians, and management talent.
                        </p>
                      </div>
                    </div>

                    {/* Headquarters & National Base */}
                    <div className="pt-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                        <MapPin className="w-5 h-5 text-brand-pink" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Headquarters & Regional Operations
                        </span>
                        <strong className="text-sm font-semibold text-slate-900 block mt-0.5">
                          {ORGANIZATION_CONFIG.legalName}
                        </strong>
                        <p className="text-xs text-slate-500 mt-0.5">
                          United Kingdom — National mobile engineering fleet & central coordination desk.
                        </p>
                      </div>
                    </div>

                    {/* Office Hours */}
                    <div className="pt-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                        <Clock className="w-5 h-5 text-brand-pink" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Operating Hours
                        </span>
                        <span className="text-sm font-semibold text-slate-900 block mt-0.5">
                          Monday – Friday: 08:00 – 17:30
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Out-of-hours emergency coverage available for contracted estate clients.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. MAIN ENQUIRY FORM SECTION
            ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white" id="enquiry-form">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <EnquiryForm
                variant="light"
                headline="Tell Us What You Need"
                subheadline="Give us a little information about your estate or requirement and the right member of the EntireFM team will review it."
                ctaText="Submit Enquiry"
                badgeText="COMMERCIAL ENQUIRY"
                selectedService={selectedService}
                onServiceChange={(s) => setSelectedService(s)}
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. EXISTING CLIENT SUPPORT & SITE SURVEY CTA BAND (DARK COMMERCIAL BAND)
            ========================================================================= */}
        <section className="py-16 sm:py-24 bg-brand-graphite text-white border-t border-brand-edge-dark relative overflow-hidden">
          <div
            aria-hidden="true"
            className="facet-rule pointer-events-none absolute inset-0 opacity-20"
          />

          <div className="container-custom relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card 1: Existing Client Support */}
              <div className="bg-brand-carbon border border-brand-edge-dark rounded-sm p-8 sm:p-10 flex flex-col justify-between shadow-elevated relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-electric" />

                <div>
                  <span className="eyebrow eyebrow-dark text-xs uppercase tracking-wider text-brand-electric block mb-2">
                    CLIENT SERVICES
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight mb-3">
                    Existing EntireFM Client?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Need help with an existing site or contract? Log a reactive maintenance request, track active work orders, or speak directly with your dedicated account manager.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-brand-edge-dark">
                  <Link href="/helpdesk" className="btn-secondary text-xs px-6 py-3">
                    <Headphones className="w-4 h-4 text-brand-electric" />
                    <span>Access Client Support</span>
                  </Link>
                  <a
                    href={CONTACT_CONFIG.mainPhone.href}
                    className="text-xs font-mono font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    Direct line: {CONTACT_CONFIG.mainPhone.display}
                  </a>
                </div>
              </div>

              {/* Card 2: Need a Site Survey? */}
              <div className="bg-brand-carbon border border-brand-edge-dark rounded-sm p-8 sm:p-10 flex flex-col justify-between shadow-elevated relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink-light to-brand-magenta" />

                <div>
                  <span className="eyebrow eyebrow-dark text-xs uppercase tracking-wider text-brand-pink block mb-2">
                    TECHNICAL AUDIT
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight mb-3">
                    Need a Comprehensive Site Survey?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Arrange an on-site engineering review for M&E plant, HVAC infrastructure, statutory compliance audits, commercial cleaning scopes, or broader estate management.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-brand-edge-dark">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService('Site Survey / Technical Review');
                      document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-hero-pink text-xs px-6 py-3 cursor-pointer"
                  >
                    <span>Arrange a Site Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400">
                    No obligation commercial consultation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
