'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  AlertTriangle,
  HardHat,
  Eye,
  FileCheck2,
  Droplets,
  Search,
  Zap,
  Bird,
  Calendar,
  Compass,
  PhoneCall,
} from 'lucide-react';
import type { TemplateProps } from '../types';

export function ServiceWorkingAtHeight({ route, content }: TemplateProps) {
  const breadcrumbs = content?.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Working at Height & Rope Access', url: '/working-at-height-rope-access-bmu' },
  ];

  const CORE_SERVICES = [
    {
      title: 'Rope Access & Abseiling',
      desc: 'Safe, low-impact industrial rope access to high-level and difficult-to-reach building locations for inspection, maintenance, repairs and technical interventions without costly scaffolding.',
      badge: 'TECHNICAL ACCESS',
      icon: Compass,
      points: ['IRATA-trained technician teams', 'Minimal ground-level disruption', 'Rapid setup and rigging capability'],
    },
    {
      title: 'BMU & Cradle-Based Access',
      desc: 'Building Maintenance Unit (BMU), gantry and cradle-supported operations for planned façade maintenance, glazing replacement, high-rise washdowns and extensive envelope scopes.',
      badge: 'INTEGRATED SYSTEMS',
      icon: Building2,
      points: ['Experienced with complex roof tracks', 'Pre-use safety checks & operator protocols', 'High-rise commercial efficiency'],
    },
    {
      title: 'High-Level Cleaning',
      desc: 'Specialist external building washes, architectural cladding rejuvenation, stone restoration, internal atrium cleans, glazing washdowns and difficult-access structural cleaning.',
      badge: 'FABRIC CARE',
      icon: Droplets,
      points: ['External curtain wall & cladding cleaning', 'Internal high-ceiling atrium care', 'Pure water & specialist chemical wash'],
    },
    {
      title: 'Façade Inspection & Defect Audits',
      desc: 'Close-up tactile and visual structural condition assessments, thermal envelope checks, spalling masonry detection, and high-resolution defect photographic logbooks for asset managers.',
      badge: 'SURVEY & AUDIT',
      icon: Eye,
      points: ['Close-contact physical condition surveys', 'Defect mapping with photographic evidence', 'Input into 5-to-10-year capital PPM plans'],
    },
    {
      title: 'Façade Maintenance & Minor Repairs',
      desc: 'Targeted high-level remedial works including silicone mastic renewal, expansion joint sealing, panel refixing, bracket replacement, flashing repairs and minor masonry stabilization.',
      badge: 'PLANNED & REACTIVE',
      icon: Wrench,
      points: ['Weatherproofing & sealant replacement', 'Cladding panel refastening & trims', 'Preventative defect rectification'],
    },
    {
      title: 'Glazing & Building Envelope Support',
      desc: 'Specialist access support for glass leak investigations, pressure plate inspections, gasket replacements, cracked pane securing, and localized curtain wall repairs.',
      badge: 'ENVELOPE INTEGRITY',
      icon: Layers,
      points: ['Curtain walling gasket & cap checks', 'Emergency glazing securing & templating', 'Spandrel panel & louvre maintenance'],
    },
    {
      title: 'Signage, Lighting & High-Level Fixtures',
      desc: 'Installation, bulb replacement, electrical testing, and planned preventative maintenance for high-level architectural luminaires, architectural neon, banners and branded building signage.',
      badge: 'ELECTRICAL & M&E',
      icon: Zap,
      points: ['High-level LED luminaire retrofits', 'Commercial building fascia sign repair', 'Safe power isolation protocols'],
    },
    {
      title: 'Bird Control & Proofing Access',
      desc: 'Access provision and installation of discreet anti-perch bird spikes, tensioned wire systems, netting arrays and solar panel bird guards on high-level ledges, parapets and roof plant.',
      badge: 'ESTATE HYGIENE',
      icon: Bird,
      points: ['High-level netting & spike installations', 'Deterrent repair and seasonal clearing', 'Ledge and gutter debris sanitisation'],
    },
    {
      title: 'Leak Investigation & Water Ingress Triage',
      desc: 'Rapid reactive high-level access to trace hard-to-find water ingress points, roof flashing failures, coping stone leaks, and localized window seal breaches in wet weather.',
      badge: 'RAPID DIAGNOSTICS',
      icon: Search,
      points: ['Targeted water testing at height', 'Identification of active ingress pathways', 'Immediate temporary waterproofing seal'],
    },
    {
      title: 'Planned Maintenance (PPM) at Height',
      desc: 'Scheduled cyclical high-level servicing seamlessly embedded into wider SFG20 Planned Preventative Maintenance programmes, logged in real time on EntireCAFM.',
      badge: 'SFG20 INTEGRATED',
      icon: Calendar,
      points: ['Coordinated with ground FM teams', '52-week statutory & fabric scheduling', 'One unified monthly contractor invoice'],
    },
  ];

  const BEYOND_CLEANING_ITEMS = [
    {
      title: 'Façade Inspections & Condition Surveys',
      desc: 'Detailed tactile inspection of cladding panels, curtain walling caps, masonry anchor points, and spalling concrete with high-definition digital photographic logs.',
    },
    {
      title: 'Leak Diagnostics & Penetration Testing',
      desc: 'Simulated hose spray testing and thermal camera surveys to pinpoint exact water ingress routes through defective gaskets and perished expansion joints.',
    },
    {
      title: 'Sealant, Mastic & Joint Restoration',
      desc: 'Raking out aged, brittle weather seals and replacing with commercial-grade polyurethane and silicone sealants to protect structural framing from corrosion.',
    },
    {
      title: 'Cladding & Architectural Panel Remedials',
      desc: 'Refixing loose composite panels, replacing damaged louvres, and rectifying alignment issues caused by thermal expansion or high-wind loading.',
    },
    {
      title: 'High-Level M&E, Lighting & Signage',
      desc: 'Safe access for electricians and technicians to service architectural façade illumination, aircraft warning lights, external CCTV, and high-rise signage.',
    },
    {
      title: 'Internal Atrium & Structural Steel Cleans',
      desc: 'Abseil access to vast internal glazed atriums, architectural space frames, HVAC ductwork, and acoustic baffles without intrusive floor scaffolding.',
    },
    {
      title: 'Bird Deterrent Systems & Netting',
      desc: 'Installing and repairing robust bird protection measures across intricate architectural friezes, plant screens, and high-level structural recesses.',
    },
    {
      title: 'Reactive Emergency High-Level Triage',
      desc: 'Urgent attendance for storm-damaged guttering, loose coping stones, shattered glass panes, or dangerous hanging debris on occupied buildings.',
    },
  ];

  const SECTORS = [
    {
      name: 'Commercial Offices & Towers',
      desc: 'Grade A corporate headquarters, multi-tenanted city towers, and modern business parks requiring discreet, out-of-hours high-level access with zero tenant disruption.',
    },
    {
      name: 'Mixed-Use Developments',
      desc: 'High-density urban schemes combining retail podiums, residential towers, and commercial office space requiring complex drop management and public protection.',
    },
    {
      name: 'Retail Centres & Atriums',
      desc: 'Shopping malls, leisure destinations, and retail parks with high glazed barrel-vault roofs, extensive internal atriums, and external architectural signage.',
    },
    {
      name: 'Hospitality & Hotels',
      desc: 'Luxury hotels and serviced apartments with architecturally sensitive envelopes, requiring quiet, respectful rope access that preserves guest privacy.',
    },
    {
      name: 'Public Sector & Civic Estates',
      desc: 'Municipal offices, law courts, transport interchanges, and historic civic buildings with challenging architectural geometries and stringent security clearances.',
    },
    {
      name: 'Healthcare & Higher Education',
      desc: 'Hospital campuses and university research facilities where uninterrupted daily operations and clinical sterility require precise drop planning.',
    },
  ];

  const FAQS = [
    {
      question: 'What is the advantage of industrial rope access over traditional scaffolding or MEWPs?',
      answer:
        'Industrial rope access offers unmatched speed of deployment, significantly lower costs, and near-zero ground footprint. Unlike scaffolding, which can take weeks to erect, blocks access, and introduces security vulnerabilities, rope access equipment can be rigged and derigged on the same day. For high-rise buildings and inner-city sites where mobile elevating work platforms (MEWPs) cannot reach or cannot park due to pavement weight limits, rope access is the safest and most efficient solution.',
    },
    {
      question: 'How do you ensure safety and statutory compliance for working at height?',
      answer:
        'Safety is the foundational principle of all EntireFM high-level operations. All rope access technicians are fully IRATA-certified and operate strictly under the Work at Height Regulations 2005. Every single project begins with a comprehensive, site-specific Risk Assessment and Method Statement (RAMS), rescue plans, exclusion zone demarcation, and equipment load-testing. When operating BMUs or cradles, our technicians verify LOLER certification and execute strict daily pre-use checklists.',
    },
    {
      question: 'Can you carry out technical maintenance and repairs at height, or only cleaning?',
      answer:
        'EntireFM is a Total Facilities Management provider. Our high-level access teams include skilled trade operatives capable of executing mastic sealant repairs, glazing replacement, electrical luminaire maintenance, cladding fixes, bird deterrent installation, leak tracing, and structural surveys. We combine high-level rigging expertise with genuine building maintenance capability.',
    },
    {
      question: 'Do you operate on building maintenance units (BMUs) and permanent cradles?',
      answer:
        'Yes. Many modern commercial towers are designed with integrated roof track BMUs and power cradles. Our teams are trained and competent across various BMU configurations, monorail systems, and gantry rigs. We liaise directly with building management to coordinate access schedules and conduct pre-flight safety inspections before commencing works.',
    },
    {
      question: 'Can high-level access works be carried out out-of-hours or over weekends?',
      answer:
        'Yes. In occupied commercial offices, high-footfall retail centres, and transport hubs, high-level works over building entrances, reception atriums, or public thoroughfares are frequently scheduled out-of-hours, early morning, or over weekends to guarantee zero operational impact on your tenants and visitors.',
    },
    {
      question: 'How are high-level inspections and completed works reported to building owners?',
      answer:
        'Every high-level job is documented digitally through EntireCAFM. Our technicians record high-resolution before-and-after photographs, defect coordinate maps, and engineering sign-off sheets. Asset managers and managing agents receive instantaneous digital work order completion reports and audit-ready compliance certificates.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC HERO WORKSPACE */}
        {/* ========================================================================= */}
        <section className="relative min-h-[620px] lg:min-h-[720px] flex items-center bg-[#0B1220] overflow-hidden pt-24 pb-16">
          {/* Real Rope Access Photography with Dusk / Blue-Hour Treatment */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/services/working-at-height/hero-rope-access.png"
              alt="EntireFM specialist rope access technicians operating on commercial building glazed façade"
              fill
              priority
              className="object-cover object-center opacity-65 scale-105 transition-transform duration-1000 ease-out"
              sizes="100vw"
            />
            {/* Cinematic Gradient Overlays for High Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/60 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/80 to-transparent" />
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-3xl space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                <span className="h-2 w-2 rounded-full bg-[#FF3E9D] animate-pulse" />
                <span className="text-[11px] uppercase tracking-widest text-white/90 font-light">
                  SPECIALIST ACCESS & FAÇADE CARE
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.1]">
                Working at Height, <br />
                <span className="text-hero-pink">
                  Rope Access &amp; BMU Services
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl">
                Safe, efficient high-level access for inspection, maintenance, cleaning and façade works across commercial buildings and complex estates.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact-us#enquiry"
                  className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-gradient-to-r from-[#FF3E9D] via-[#ED3899] to-[#C026D3] px-6 py-3.5 text-sm font-normal text-white shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-[1.02]"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm font-normal text-white hover:bg-white/20 transition-all"
                >
                  <PhoneCall className="h-4 w-4 text-[#FF3E9D]" />
                  <span>Talk to Our Team</span>
                </Link>
              </div>

              {/* Trust Supporting Bar */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-normal text-white/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                  IRATA-Trained Operatives
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                  BMU &amp; Cradle Certified
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                  Site-Specific RAMS &amp; Safety
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                  Commercial M&amp;E Integration
                </span>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. EDITORIAL POSITIONING / SAFE ACCESS INTRO */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF3E9D]" />
                  <span className="text-xs font-normal uppercase tracking-wider text-[#FF3E9D]">
                    STRATEGIC ACCESS METHODOLOGIES
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                  Safe access for the work most contractors cannot easily reach
                </h2>
                <p className="text-base text-slate-600 leading-relaxed font-light">
                  High-level building works demand rigorous engineering discipline, technical competence, and uncompromising safety standards. EntireFM provides planned preventative and reactive high-level access services across complex commercial envelopes, deploying the most efficient and safe access methodology for every structure:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-normal text-sm text-slate-800">
                  <div className="flex items-center gap-2.5 p-3 rounded-[8px] bg-[#FAF9FB] border border-slate-200/80">
                    <CheckCircle2 className="h-4 w-4 text-[#FF3E9D] shrink-0" />
                    <span>Industrial Rope Access / Abseiling</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-[8px] bg-[#FAF9FB] border border-slate-200/80">
                    <CheckCircle2 className="h-4 w-4 text-[#FF3E9D] shrink-0" />
                    <span>BMU &amp; Cradle Integrated Systems</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-[8px] bg-[#FAF9FB] border border-slate-200/80">
                    <CheckCircle2 className="h-4 w-4 text-[#FF3E9D] shrink-0" />
                    <span>Rooftop Rigging &amp; Safety Lines</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-[8px] bg-[#FAF9FB] border border-slate-200/80">
                    <CheckCircle2 className="h-4 w-4 text-[#FF3E9D] shrink-0" />
                    <span>Specialist High-Level Maintenance</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed pt-2 font-light">
                  We bridge the gap between pure cleaning contractors and complex structural engineers. From routine envelope care and mastic resealing to emergency leak diagnosis and high-level lighting maintenance, our access teams integrate directly into your estate’s broader maintenance programme.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="relative h-[420px] rounded-[16px] overflow-hidden border border-slate-200 shadow-xl group">
                  <Image
                    src="/images/services/working-at-height/rooftop-rigging-access.png"
                    alt="EntireFM technical rooftop rigging and safety system deployment on high-rise building"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-[11px] text-white/80 uppercase tracking-wider block font-medium">
                      PRECISION RIGGING &amp; ANCHOR PROTOCOLS
                    </span>
                    <h3 className="text-lg font-light text-white">
                      Zero Ground Disruption, Maximum Safety
                    </h3>
                    <p className="text-xs text-white/80 font-light">
                      Engineered anchor verification and controlled drop plans for occupied commercial environments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CORE SERVICES GRID (10 DETAILED COMMERCIAL CAPABILITIES) */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-[#FF3E9D]" />
                <span className="text-xs font-normal uppercase tracking-wider text-[#FF3E9D]">
                  COMPREHENSIVE CAPABILITY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                High-Level Access &amp; Façade Maintenance Services
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                A robust, multi-disciplinary service spectrum engineered specifically for commercial property managers, managing agents, and facilities directors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CORE_SERVICES.map((srv, idx) => {
                const Icon = srv.icon;
                return (
                  <div
                    key={idx}
                    className="p-7 bg-white border border-slate-200 rounded-[14px] shadow-sm hover:border-[#FF3E9D] hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-[10px] bg-[#FAF9FB] border border-slate-200 flex items-center justify-center text-[#FF3E9D] group-hover:bg-[#FF3E9D] group-hover:text-white transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[9.5px] uppercase font-light text-slate-600 bg-slate-100 px-2 py-0.5 rounded-[4px]">
                          {srv.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-light text-slate-900 group-hover:text-[#FF3E9D] transition-colors">
                          {srv.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                          {srv.desc}
                        </p>
                      </div>

                      <ul className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                        {srv.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3E9D] mt-1.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <Link
                        href="/contact-us#enquiry"
                        className="inline-flex items-center gap-1 text-xs font-normal text-[#FF3E9D] group-hover:underline"
                      >
                        <span>Enquire for this service</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. "MORE THAN WINDOW CLEANING" COMMERCIAL DIFFERENTIATOR */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#0B1220] text-white relative overflow-hidden">
          <div className="container-custom relative z-10 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF3E9D]" />
                  <span className="text-[11px] uppercase tracking-widest text-white font-light">
                    COMMERCIAL POSITIONING
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
                  More than <br />
                  <span className="font-light text-hero-pink">window cleaning</span>
                </h2>

                <p className="text-base text-slate-300 leading-relaxed">
                  High-level access is often associated purely with external window cleaning, but in practice it supports a far wider range of building maintenance needs. EntireFM uses rope access, BMU and other safe access methods to inspect, maintain, repair and support difficult-to-reach areas across commercial buildings and estate portfolios.
                </p>

                <p className="text-sm text-slate-400 leading-relaxed">
                  When you engage EntireFM, you gain a multi-skilled engineering partner capable of diagnosing building envelope failures, replacing defective components, renewing mastic joints, and maintaining mechanical assets at height—all documented within a unified CAFM asset management framework.
                </p>

                <div className="pt-2">
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 rounded-[8px] bg-white text-[#0B1220] px-5 py-3 text-xs font-normal hover:bg-slate-100 transition-colors shadow-md"
                  >
                    <span>Discuss Your High-Level Requirements</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#FF3E9D]" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative h-[460px] rounded-[16px] overflow-hidden border border-white/15 shadow-2xl">
                  <Image
                    src="/images/services/working-at-height/facade-inspection-maintenance.png"
                    alt="EntireFM rope access engineer executing technical mastic repair and façade inspection"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#FF3E9D] font-light block">
                      TECHNICAL BUILDING ENVELOPE CARE
                    </span>
                    <h3 className="text-base font-light text-white">
                      Proactive Defect Remediation at Height
                    </h3>
                    <p className="text-xs text-white/80">
                      Combining tactile façade inspection with immediate minor remedial repairs to prevent water ingress.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 8 Differentiator Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {BEYOND_CLEANING_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-[12px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:border-[#FF3E9D]/60 hover:bg-white/10 transition-all space-y-2"
                >
                  <div className="flex items-center gap-2 text-[#FF3E9D]">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <h4 className="text-sm font-normal text-white">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. BMU & CRADLE INTEGRATED SYSTEMS SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative h-[440px] rounded-[16px] overflow-hidden border border-slate-200 shadow-xl group">
                  <Image
                    src="/images/services/working-at-height/bmu-cradle-access.png"
                    alt="Building Maintenance Unit BMU cradle operating on commercial glass high-rise"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="font-medium text-[11px] text-white/80 uppercase tracking-wider block">
                      ENGINEERED CRADLE OPERATIONS
                    </span>
                    <h3 className="text-lg font-light text-white">
                      High-Rise Building Access Systems
                    </h3>
                    <p className="text-xs text-white/80">
                      Trained BMU operators compliant with BS 6037 standards for commercial high-rise towers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF3E9D]" />
                  <span className="text-xs font-normal uppercase tracking-wider text-[#FF3E9D]">
                    INTEGRATED PLANT &amp; CRADLES
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                  BMU and cradle-supported high-level works
                </h2>
                <p className="text-base text-slate-600 leading-relaxed font-light">
                  For high-rise commercial towers and architecturally complex buildings equipped with permanent façade access equipment, Building Maintenance Units (BMUs) and motorized cradles provide the most effective platform for large-scale maintenance and inspection scopes.
                </p>
                <div className="space-y-3.5 pt-1">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#FAF9FB] border border-slate-200 flex items-center justify-center text-[#FF3E9D] shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-light text-slate-900">Planned Façade Maintenance &amp; Cyclic Cleans</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        Continuous coverage across multi-storey elevations for scheduled glass cleaning, pressure-washing, and mastic inspection.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#FAF9FB] border border-slate-200 flex items-center justify-center text-[#FF3E9D] shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-light text-slate-900">Glass &amp; Envelope Component Replacement</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        Stable working platform for heavy glass panel replacement, louvre installations, and structural sealant tooling.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#FAF9FB] border border-slate-200 flex items-center justify-center text-[#FF3E9D] shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-light text-slate-900">Safe, Repeatable Access for High-Rise Assets</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        Fully compliant operation of roof car tracks, luffing jibs, and traversing gantries on major UK commercial landmarks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. SAFETY & RAMS COMPLIANCE SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                <span className="text-xs font-normal uppercase tracking-wider text-[#16A34A]">
                  HEALTH, SAFETY &amp; GOVERNANCE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                Safe working at height, planned properly
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                Every working-at-height scope is planned around the building, the task and the safest suitable access method. From rooftop rigging and rope access through to BMU-supported activity, safety and control sit at the centre of delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white border border-slate-200 rounded-[12px] space-y-2.5 shadow-sm">
                <div className="h-9 w-9 rounded-[8px] bg-slate-50 border border-slate-200 flex items-center justify-center text-[#FF3E9D]">
                  <HardHat className="h-5 w-5" />
                </div>
                <h3 className="font-light text-slate-900 text-sm">Trained Operatives</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All technicians are qualified under recognized industry bodies (including IRATA Levels 1–3) with mandatory regular recertification.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-[12px] space-y-2.5 shadow-sm">
                <div className="h-9 w-9 rounded-[8px] bg-slate-50 border border-slate-200 flex items-center justify-center text-[#FF3E9D]">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <h3 className="font-light text-slate-900 text-sm">Site-Specific RAMS</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tailored Risk Assessments, Method Statements and emergency rescue protocols produced before any equipment is rigged on site.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-[12px] space-y-2.5 shadow-sm">
                <div className="h-9 w-9 rounded-[8px] bg-slate-50 border border-slate-200 flex items-center justify-center text-[#FF3E9D]">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="font-light text-slate-900 text-sm">Controlled Exclusion Zones</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Barriers, signage, tool tethering, and ground spotters to protect pedestrians and building occupants from drop hazards.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-[12px] space-y-2.5 shadow-sm">
                <div className="h-9 w-9 rounded-[8px] bg-slate-50 border border-slate-200 flex items-center justify-center text-[#FF3E9D]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-light text-slate-900 text-sm">Commercial Coordination</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Close liaison with site management, security, and building occupants to schedule work around high-traffic business hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6B. DRONE SCREENING INTEGRATION */}
        {/* ========================================================================= */}
        <section className="py-14 bg-white border-b border-slate-200">
          <div className="container-custom">
            <div className="p-8 rounded-[16px] bg-[#0B1220] text-white flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
                    RISK REDUCTION &amp; INITIAL SURVEYS
                  </span>
                </div>
                <h3 className="text-2xl font-extralight text-white">
                  Aerial Drone Surveys Before Physical Access
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Reduce work-at-height risk by conducting initial high-level screening with EntireFM Drone Services. We capture ultra-high-resolution aerial imagery to pinpoint exact defect coordinates before deploying rope access technicians or BMU cradles.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/services/drone-services/building-envelope-inspections"
                  className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-5 py-3 text-xs font-normal text-white shadow-md hover:scale-[1.02] transition-all"
                >
                  <span>Façade Drone Surveys</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/services/drone-services/roof-inspections"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-5 py-3 text-xs font-normal text-white hover:bg-white/20 transition-all"
                >
                  <span>Roof Drone Surveys</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. TYPICAL ENVIRONMENTS & SECTORS */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-[#FF3E9D]" />
                <span className="text-xs font-normal uppercase tracking-wider text-[#FF3E9D]">
                  ESTATE PORTFOLIO RELEVANCE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                Typical environments we support
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                Our high-level access and façade services are deployed across a diverse range of commercial and public property archetypes across the UK.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SECTORS.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-[12px] space-y-2 hover:border-[#FF3E9D] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#FF3E9D]" />
                    <h3 className="font-light text-slate-900 text-base">{sec.name}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{sec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. WHY ENTIREFM SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <div className="rounded-[18px] border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF3E9D]" />
                  <span className="text-xs font-normal uppercase tracking-wider text-[#FF3E9D]">
                    THE ENTIREFM ADVANTAGE
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-light text-slate-900">
                  Why commercial estate teams choose EntireFM
                </h2>
                <p className="mt-2 text-sm text-slate-600 font-light">
                  We combine specialist high-level access with deep commercial facilities management experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-normal text-xs">
                <div className="space-y-2 border-l-2 border-[#FF3E9D] pl-4">
                  <h4 className="font-light text-slate-900 uppercase font-sans text-sm">One Integrated Provider</h4>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed font-light">
                    Avoid managing separate cleaning, access, and M&amp;E contractors. We deliver high-level care under your single Total FM contract.
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-[#FF3E9D] pl-4">
                  <h4 className="font-light text-slate-900 uppercase font-sans text-sm">Planned &amp; 24/7 Reactive</h4>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed font-light">
                    From 52-week cyclic washdown schedules to emergency storm-damage attendance, our teams are ready when you need them.
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-[#FF3E9D] pl-4">
                  <h4 className="font-light text-slate-900 uppercase font-sans text-sm">Digital CAFM Evidence</h4>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed font-light">
                    Every drop, survey point, and mastic repair is logged with photographic provenance on our client portal for audit readiness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. FAQ ACCORDION */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-normal uppercase tracking-wider text-[#FF3E9D]">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl font-light text-slate-900">
                Working at Height &amp; High-Level Access FAQ
              </h2>
              <p className="text-sm text-slate-600 font-light">
                Key operational and technical questions answered for facilities managers and building owners.
              </p>
            </div>
            <FAQAccordion faqs={FAQS} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9b. CONNECTED SERVICES ARCHITECTURE */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom space-y-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-[#FF3E9D]" />
                <span className="text-xs font-normal uppercase tracking-wider text-[#FF3E9D]">
                  CONNECTED CAPABILITIES
                </span>
              </div>
              <h2 className="text-3xl font-light text-slate-900">
                Related Building &amp; Engineering Services
              </h2>
              <p className="mt-2 text-sm text-slate-600 font-light">
                Combine high-level access with our comprehensive Hard &amp; Soft Facilities Management disciplines under a single commercial contract.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/building-maintenance"
                className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-[14px] hover:border-[#FF3E9D] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-light text-[#FF3E9D] bg-pink-50 px-2 py-0.5 rounded-[4px]">
                    FABRIC CARE
                  </span>
                  <h3 className="font-light text-slate-900 text-base group-hover:text-[#FF3E9D] transition-colors">
                    Building Fabric &amp; Maintenance
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Structural repairs, roofing maintenance, joinery, and envelope remediation across commercial estates.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-normal text-slate-900 group-hover:text-[#FF3E9D]">
                  <span>Explore Fabric Care</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/industrial-cleaning"
                className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-[14px] hover:border-[#FF3E9D] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-light text-[#FF3E9D] bg-pink-50 px-2 py-0.5 rounded-[4px]">
                    SPECIALIST CLEANING
                  </span>
                  <h3 className="font-light text-slate-900 text-base group-hover:text-[#FF3E9D] transition-colors">
                    Industrial &amp; High-Level Cleaning
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Process plant hygiene, factory shutdown overhauls, high-bay lighting de-dusting, and ATEX cleans.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-normal text-slate-900 group-hover:text-[#FF3E9D]">
                  <span>Explore Industrial Cleaning</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/mechanical-electrical"
                className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-[14px] hover:border-[#FF3E9D] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-light text-[#FF3E9D] bg-pink-50 px-2 py-0.5 rounded-[4px]">
                    HARD FM
                  </span>
                  <h3 className="font-light text-slate-900 text-base group-hover:text-[#FF3E9D] transition-colors">
                    Mechanical &amp; Electrical (M&amp;E)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Switchgear, HV/LV distribution, commercial HVAC plant, fixed-wire testing, and emergency lighting.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-normal text-slate-900 group-hover:text-[#FF3E9D]">
                  <span>Explore M&amp;E Engineering</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/ppm"
                className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-[14px] hover:border-[#FF3E9D] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-light text-[#FF3E9D] bg-pink-50 px-2 py-0.5 rounded-[4px]">
                    STATUTORY CARE
                  </span>
                  <h3 className="font-light text-slate-900 text-base group-hover:text-[#FF3E9D] transition-colors">
                    Planned Preventative Maintenance (PPM)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    SFG20 maintenance scheduling, asset registers, compliance calendars, and digital CAFM tracking.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-normal text-slate-900 group-hover:text-[#FF3E9D]">
                  <span>Explore PPM Programmes</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. ENQUIRY CTA SECTION */}
        {/* ========================================================================= */}
        <section id="enquiry" className="py-20 bg-gradient-to-b from-[#0B1220] to-[#101010] text-white">
          <div className="container-custom max-w-4xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 mx-auto">
              <span className="h-2 w-2 rounded-full bg-[#FF3E9D] animate-pulse" />
              <span className="text-[11px] uppercase tracking-widest text-white/90 font-light">
                SAFE HIGH-LEVEL ACCESS
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
                Need safe access to <br />
                <span className="font-light text-hero-pink">high-level building works?</span>
              </h2>
              <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Whether the requirement is planned façade maintenance, rope access support, BMU-led works or reactive high-level access, EntireFM can help scope and deliver the right solution.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/contact-us#enquiry"
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-gradient-to-r from-[#FF3E9D] via-[#ED3899] to-[#C026D3] px-8 py-4 text-sm font-normal text-white shadow-xl hover:scale-105 transition-all"
              >
                <span>Request a Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-white/20 bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-normal text-white hover:bg-white/20 transition-all"
              >
                <PhoneCall className="h-4 w-4 text-[#FF3E9D]" />
                <span>Speak to EntireFM</span>
              </Link>
            </div>

            <div className="pt-6 border-t border-white/15 text-xs text-slate-400 font-normal">
              Direct technical consultation with EntireFM Operations Directors · National UK Coverage
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
