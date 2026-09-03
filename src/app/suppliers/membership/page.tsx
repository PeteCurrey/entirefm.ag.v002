import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { MembershipTierCards } from '@/components/suppliers/MembershipTierCards';
import { ContractorPlatformPreview } from '@/components/suppliers/ContractorPlatformPreview';
import { ContractorFourPillars } from '@/components/suppliers/ContractorFourPillars';
import { ContractorRamsSection } from '@/components/suppliers/ContractorRamsSection';
import { ContractorTestimonialPlaceholder } from '@/components/suppliers/ContractorTestimonialPlaceholder';
import { ContractorPackShowcase } from '@/components/suppliers/ContractorPackShowcase';
import { StickyMembershipCta } from '@/components/suppliers/StickyMembershipCta';
import { CommercialTransparencyBanner } from '@/components/suppliers/CommercialTransparencyBanner';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import {
  ShieldCheck,
  Building2,
  Cpu,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Wrench,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  Sliders,
  FileText,
  Calculator,
  Compass,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Lock,
  Clock,
  Check,
  X,
  Scale,
  CreditCard,
  Zap,
  FolderLock,
  BadgeCheck,
  ChevronDown
} from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/membership', {
  title: 'Supplier Platform & Membership (£95/yr) | EntireFM Supplier Network',
  description:
    'EntireFM Supplier Platform — compliance management, RAMS, work orders, job records and document vault for UK FM suppliers. £95+VAT/year. Part of the EntireFM supplier ecosystem.',
});

export default function SupplierMembershipPublicPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Supplier Membership', url: '/suppliers/membership' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
      {/* Product & Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "EntireFM Supplier Platform",
            "description": "Professional contractor operating platform and supplier network gateway for UK facilities management contractors.",
            "brand": {
              "@type": "Brand",
              "name": "EntireFM"
            },
            "offers": {
              "@type": "Offer",
              "price": "95",
              "priceCurrency": "GBP",
              "availability": "https://schema.org/InStock",
              "url": "https://www.entirefm.com/suppliers/membership",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "95",
                "priceCurrency": "GBP",
                "unitText": "YEAR"
              }
            }
          }),
        }}
      />

        {/* 1. HERO SECTION */}
        <SupplierHero
          eyebrow="ENTIREFM SUPPLIER NETWORK // PLATFORM & ECOSYSTEM"
          title="Run your contracting business"
          subtitle="with the tools behind the work."
          intro="A professional operating platform and network gateway for UK contractors — combining compliance management, RAMS, digital job records, workforce competency and business tools in one connected environment."
          imageSrc="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
          imageAlt="EntireFM commercial operations and contractor platform control centre"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Join the Supplier Network', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Explore the Platform', href: '#platform-overview' }}
          facts={[
            { figure: '£95 + VAT', label: 'Annual Membership', detail: '~£7.92 / mo equivalent operating cost' },
            { figure: '6 Core Modules', label: 'Integrated Tooling', detail: 'Operations, RAMS, Vault, Matrix & Calculators' },
            { figure: 'Fair Allocation', label: 'Procurement Firewall', detail: 'No pay-to-work. Merited allocation' },
          ]}
        />

        <TrustBar />

        {/* 2. VALUE STRIP (OPERATE / CONTROL / GROW / CONNECT) */}
        <section className="py-6 bg-slate-900 text-white border-b border-slate-800">
          <div className="container-wide">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-sm border border-slate-700/60">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">OPERATE</div>
                <div className="font-medium text-white mt-0.5">Jobs, RAMS &amp; Field Execution</div>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-sm border border-slate-700/60">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">CONTROL</div>
                <div className="font-medium text-white mt-0.5">Compliance, Vault &amp; Matrix</div>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-sm border border-slate-700/60">
                <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">GROW</div>
                <div className="font-medium text-white mt-0.5">Calculators, Margins &amp; Profile</div>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-sm border border-slate-700/60">
                <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400">CONNECT</div>
                <div className="font-medium text-white mt-0.5">Supply Chain &amp; Technical Forums</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2b. FOUR PILLARS POSITIONING */}
        <ContractorFourPillars />

        {/* 3. CORE POSITIONING & THE £95 QUESTION */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide space-y-16">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">CORE POSITIONING</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                More than a supplier network. A better way to operate your contracting business.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                EntireFM gives contractors the digital tools, compliance infrastructure, and operational systems needed to run professional FM work — while connecting capable businesses to a governed facilities management supply chain.
              </p>
            </div>

            {/* The £95 Question Breakdown */}
            <div className="p-8 sm:p-10 rounded-sm bg-[#FAF9FB] border border-slate-200 shadow-xs space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#EA580C]">
                    COMMERCIAL ECONOMICS // THE £95 QUESTION
                  </span>
                  <h3 className="text-2xl font-light text-slate-900 mt-1">
                    &ldquo;Why would I spend £95 a year?&rdquo;
                  </h3>
                  <p className="text-xs text-slate-600 font-light mt-1">
                    £95 per year is approximately <strong>£7.92 per month before VAT</strong> — an operating cost, not an access fee.
                  </p>
                </div>

                <div className="p-4 rounded-sm bg-white border border-slate-200 text-center shrink-0">
                  <div className="text-xs text-slate-400 uppercase font-medium">Monthly Equivalent</div>
                  <div className="text-2xl font-light text-slate-900 mt-0.5 font-mono">£7.92<span className="text-xs text-slate-500 font-normal"> / mo</span></div>
                  <span className="text-[10px] text-emerald-700 font-medium">Billed annually (£95 + VAT)</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-900 mb-4 uppercase tracking-wider">
                  Can this platform save your business more than £7.92 per month in operational friction?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-700 font-light">
                  {[
                    'Chasing insurance certificates & renewal dates',
                    'Manually checking engineer qualification expiries',
                    'Maintaining scattered compliance folders & drives',
                    'Rebuilding risk assessments & RAMS from scratch',
                    'Preparing manual job packs for on-site engineers',
                    'Paper-based field forms & missing photo evidence',
                    'Chasing engineers for site reports & signatures',
                    'Managing workforce competencies & CSCS records',
                    'Calculating true hourly labour cost recovery',
                    'Simulating project gross margins & call-out costs',
                    'Repeatedly sending the same documentation to FM clients',
                    'Keeping company capability & coverage profiles current',
                  ].map((friction, fIdx) => (
                    <div key={fIdx} className="p-3 bg-white border border-slate-200 rounded-sm flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{friction}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SHOW THE PRODUCT — MAJOR PLATFORM DEMONSTRATION */}
        <section id="platform-overview" className="py-24 bg-[#FAF9FB] border-b border-slate-200 scroll-mt-12">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">THE CONTRACTOR OPERATING PLATFORM</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Your EntireFM Contractor Platform
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Your membership gives your business a dedicated operating environment built around the realities of commercial FM delivery. Inspect the real platform tools below:
              </p>
            </div>

            {/* Interactive / Controlled Product Preview */}
            <ContractorPlatformPreview />
          </div>
        </section>

        {/* 4b. RAMS & DOCUMENTATION LIFECYCLE */}
        <ContractorRamsSection />

        {/* 5. ONE PLATFORM VS DISCONNECTED TOOLS */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">OPERATIONAL SIMPLIFICATION</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Stop running your business across disconnected tools.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Spreadsheets for compliance. Word documents for RAMS. Email for job instructions. WhatsApp for engineers. Folders for certificates. Paper for site reports.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Left: The Fragmented Way */}
              <div className="p-8 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
                    <X className="h-4 w-4 shrink-0" />
                    <span>Typical Disconnected Setup</span>
                  </div>
                  <h3 className="text-xl font-light text-slate-900">
                    Fragmented Tools &amp; Duplicated Effort
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Contractors end up paying for multiple separate subscriptions or relying on unstructured paper and emails:
                  </p>

                  <div className="space-y-2 pt-2">
                    {[
                      'Separate compliance software or manual spreadsheets',
                      'Standalone RAMS subscription software',
                      'Separate quote and calculator apps',
                      'Scattered Dropbox/Google Drive certificate folders',
                      'WhatsApp messages for job dispatches & site photos',
                      'Manual tracking of operative card expiry dates',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-light">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-sm bg-white border border-slate-200 text-xs text-slate-500 font-light">
                  Result: Higher administrative overhead, missing compliance records, and constant operational friction.
                </div>
              </div>

              {/* Right: The EntireFM Way */}
              <div className="p-8 rounded-sm bg-white border-2 border-slate-900 space-y-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#EA580C] text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>EntireFM Contractor Platform</span>
                  </div>
                  <h3 className="text-xl font-light text-slate-900">
                    One Connected Operating Environment
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Everything required to operate as a modern commercial FM contractor united in a single browser environment:
                  </p>

                  <div className="space-y-2 pt-2">
                    {[
                      'Digital Contractor Control Centre & live work pipeline',
                      'Statutory Document Vault with automated renewal radar',
                      'FM-specific RAMS builder & digital Job Pack generator',
                      'Complete Workforce Matrix & operative card tracking',
                      'Business calculators for labour recovery, margin & call-outs',
                      'Verified status in the managed EntireFM supply chain',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 font-normal">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-sm bg-[#FAF9FB] border border-slate-200 text-xs text-slate-900 font-medium">
                  Result: Streamlined administration, continuous compliance visibility, and verified supply chain participation.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. SELL BY BUSINESS OUTCOMES (6 PILLARS) */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide space-y-16">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">BUSINESS OUTCOMES</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Designed around your contracting business.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                We organise the platform around the concrete operational outcomes that make contracting businesses more efficient, compliant, and profitable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* OPERATE */}
              <div className="p-7 bg-white border border-slate-200 rounded-sm space-y-4">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  01 &bull; OPERATE
                </div>
                <h3 className="text-lg font-light text-slate-900">
                  Run work properly from instruction to completion.
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Work orders, RAMS, job packs, site information, digital forms, service reports, evidence capture, variations, and client sign-offs.
                </p>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-light">
                  Everything required to prepare, execute, and close out work professionally.
                </div>
              </div>

              {/* CONTROL */}
              <div className="p-7 bg-white border border-slate-200 rounded-sm space-y-4">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  02 &bull; CONTROL
                </div>
                <h3 className="text-lg font-light text-slate-900">
                  Know whether your business is actually ready to work.
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Compliance profile, document vault, insurance monitoring, accreditation tracking, workforce records, training, and 90/60/30-day expiry radar.
                </p>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-light">
                  Replace reactive compliance chasing with continuous automated visibility.
                </div>
              </div>

              {/* PROTECT */}
              <div className="p-7 bg-white border border-slate-200 rounded-sm space-y-4">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  03 &bull; PROTECT
                </div>
                <h3 className="text-lg font-light text-slate-900">
                  Make every completed job easier to defend.
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Structured RAMS, Job Packs, site checklists, operative digital signatures, timestamped photo evidence, and complete service report histories.
                </p>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-light">
                  Better records. Clearer accountability. Stronger operational evidence.
                </div>
              </div>

              {/* GROW */}
              <div className="p-7 bg-white border border-slate-200 rounded-sm space-y-4">
                <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  04 &bull; GROW
                </div>
                <h3 className="text-lg font-light text-slate-900">
                  Build a more professional contracting operation.
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Hourly labour rate recovery calculator, job gross margin modeler, call-out matrix, mileage overheads, PPM planning, and verified partner profile.
                </p>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-light">
                  Professionalise the commercial business behind the engineering tools.
                </div>
              </div>

              {/* STAY AHEAD */}
              <div className="p-7 bg-white border border-slate-200 rounded-sm space-y-4">
                <div className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
                  05 &bull; STAY AHEAD
                </div>
                <h3 className="text-lg font-light text-slate-900">
                  Know what is changing around your trade.
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Compliance Watch, Company Watch (Companies House monitoring), Credential Watch, trade updates, statutory safety alerts, and CPD event invitations.
                </p>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-light">
                  Relevant FM and trade intelligence without spending your week looking for it.
                </div>
              </div>

              {/* CONNECT */}
              <div className="p-7 bg-white border border-slate-200 rounded-sm space-y-4">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  06 &bull; CONNECT
                </div>
                <h3 className="text-lg font-light text-slate-900">
                  Be part of the EntireFM supply chain.
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Supplier profile, network participation, technical forums, OEM manufacturer sessions, and consideration for work orders where capabilities align.
                </p>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-light">
                  Approved contractors are considered for work matching their verified scope.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. WHAT YOU GET FOR £95 (VALUE STACK) */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">PRICING TRANSPARENCY</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                What £95 a year puts in your business.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                That&apos;s approximately <strong>£7.92 per month before VAT</strong> — for a complete contractor operating environment rather than another standalone document or calculator subscription.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="p-5 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-3">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  Digital Operations
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 font-light">
                  <li>&bull; Contractor Control Centre</li>
                  <li>&bull; Work Order Queue</li>
                  <li>&bull; RAMS Generator</li>
                  <li>&bull; Job Packs Assembly</li>
                  <li>&bull; Digital Site Forms</li>
                  <li>&bull; Service Reporting</li>
                </ul>
              </div>

              <div className="p-5 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-3">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  Compliance Vault
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 font-light">
                  <li>&bull; Statutory Document Storage</li>
                  <li>&bull; 90/60/30-Day Expiry Radar</li>
                  <li>&bull; Direct Broker Verification</li>
                  <li>&bull; Policy Lapsed Warnings</li>
                  <li>&bull; Multi-Branch Repository</li>
                  <li>&bull; Exportable Audit Records</li>
                </ul>
              </div>

              <div className="p-5 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-3">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  Workforce &amp; Matrix
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 font-light">
                  <li>&bull; Engineer Competency Matrix</li>
                  <li>&bull; CSCS / JIB Verification</li>
                  <li>&bull; Gas Safe / F-Gas Tracking</li>
                  <li>&bull; Site Induction Registers</li>
                  <li>&bull; Training Expiry Watch</li>
                  <li>&bull; Operative Mobile Briefings</li>
                </ul>
              </div>

              <div className="p-5 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-3">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  Business Calculators
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 font-light">
                  <li>&bull; True Labour Rate Calculator</li>
                  <li>&bull; Gross Margin &amp; Markup Tool</li>
                  <li>&bull; Call-Out Cost Modeller</li>
                  <li>&bull; Mileage &amp; Travel Estimator</li>
                  <li>&bull; Engineer Utilisation Planner</li>
                  <li>&bull; PPM Frequency Estimator</li>
                </ul>
              </div>

              <div className="p-5 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-3">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  Intelligence &amp; Network
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 font-light">
                  <li>&bull; Company Watch Radar</li>
                  <li>&bull; Statutory Regulatory Alerts</li>
                  <li>&bull; Verified Partner Profile</li>
                  <li>&bull; EntireFM Network Eligibility</li>
                  <li>&bull; Technical Forum Access</li>
                  <li>&bull; Event Programme Priority</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 8. COMPARISON TABLE */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">CAPABILITY COMPARISON</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Operating platform vs disconnected point solutions.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                The value is not a single feature — it is having your compliance, operations, workforce, business tools, and network connection united in one layer.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-sm bg-white shadow-xs">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-900 text-white font-light uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="p-4 w-1/3">Operating Capability</th>
                    <th className="p-4 w-1/3 text-[#EA580C] font-semibold">EntireFM Supplier Platform (£95/yr)</th>
                    <th className="p-4 w-1/3 text-slate-400">Typical Alternative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {[
                    {
                      cap: 'Compliance & Document Storage',
                      entire: 'Integrated Document Vault with automated 90/60/30-day insurance and certificate radar',
                      alt: 'Scattered local folders, manual spreadsheets, or separate compliance subscription',
                    },
                    {
                      cap: 'Risk Assessments (RAMS)',
                      entire: 'Built-in commercial FM RAMS generator with digital operative signatures and job packs',
                      alt: 'Standalone RAMS software subscription or manual Word document templates',
                    },
                    {
                      cap: 'Workforce & Competencies',
                      entire: 'Dedicated engineer matrix tracking CSCS, Gas Safe, F-Gas, 18th Edition, and site readiness',
                      alt: 'Spreadsheet roster or standalone HR / training tracker',
                    },
                    {
                      cap: 'Business Calculators',
                      entire: 'Instant labour recovery rate, project margin, call-out matrix, and travel overhead tools',
                      alt: 'Ad-hoc manual calculations or separate estimating software',
                    },
                    {
                      cap: 'Regulatory Intelligence',
                      entire: 'Personalised Company Watch, Credential Watch, Building Safety Act, and trade safety alerts',
                      alt: 'Manual trade association searches and missed regulatory updates',
                    },
                    {
                      cap: 'Supply Chain Relationship',
                      entire: 'Verified partner status and digital work dispatch connection to EntireFM client estates',
                      alt: 'Open directories with no operating tools or pay-per-lead charges',
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="p-4 font-semibold text-slate-900">{row.cap}</td>
                      <td className="p-4 text-slate-800 bg-orange-50/20 font-medium flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{row.entire}</span>
                      </td>
                      <td className="p-4 text-slate-500 font-light">{row.alt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 font-light italic">
              * Note: EntireFM does not require you to abandon existing specialist engineering software. The platform integrates seamlessly alongside your current operations.
            </p>
          </div>
        </section>

        {/* 8b. PHYSICAL CONTRACTOR PACK & VERIFIED ID CARD */}
        <ContractorPackShowcase
          eyebrow="TANGIBLE CREDENTIALS &amp; ONBOARDING PACK"
          title="Official Contractor Pack &amp; Verified Site ID"
          subtitle="Every verified network member receives a physical onboarding pack containing their verified operative ID card, lanyard, branded PPE, and contractor handbook."
        />

        {/* 9. COMMERCIAL MEMBERSHIP TIERS */}
        <section id="membership-comparison" className="py-24 bg-white border-b border-slate-200 scroll-mt-12">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">MEMBERSHIP TIERS</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Transparent Commercial Membership
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Choose the participation tier that matches your operational scale, team structure, and business requirements.
              </p>
            </div>

            <MembershipTierCards />
          </div>
        </section>

        {/* 10. INVITATION CODE SECTION */}
        <section className="py-16 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="p-8 sm:p-10 rounded-sm bg-white border-2 border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#EA580C]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                    INVITED BY ENTIREFM?
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Your invitation code may reduce your membership fee to £0.
                </h3>
                <p className="text-xs text-slate-600 font-light max-w-xl leading-relaxed">
                  If EntireFM has directly invited your organisation to join the supply chain for a specific client requirement or regional partnership, enter your unique invitation code during application to apply the full commercial waiver.
                </p>
              </div>

              <Link
                href="/suppliers/apply"
                className="btn-primary text-xs py-3 px-6 shrink-0 whitespace-nowrap font-bold"
              >
                Apply with Invitation Code &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* 11. WHO IS THIS FOR? */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">TARGET PROFILES</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Who is the Contractor Platform for?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                EntireFM is built for contractors of all sizes who want to operate with greater professional control.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">Regional Specialists</div>
                <h3 className="text-base font-semibold text-slate-900">Niche Engineering Contractors</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Operate with corporate-grade governance, insurance tracking, and professional RAMS without needing a giant back-office administrative department.
                </p>
              </div>

              <div className="p-6 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">Engineering SMEs</div>
                <h3 className="text-base font-semibold text-slate-900">Commercial M&amp;E Providers</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Manage compliance, workforce qualifications, job documentation, and field evidence in one connected environment.
                </p>
              </div>

              <div className="p-6 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">Growing Contractors</div>
                <h3 className="text-base font-semibold text-slate-900">Expanding Trade Businesses</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Replace fragmented spreadsheets and WhatsApp groups with structured systems as your engineer count and job volume scale.
                </p>
              </div>

              <div className="p-6 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">Multi-Discipline Contractors</div>
                <h3 className="text-base font-semibold text-slate-900">Multi-Region Organisations</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Utilise the complete platform to manage multiple trades, administrative coordinators, and regional operational coverage.
                </p>
              </div>

              <div className="p-6 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">Specialists &amp; OEMs</div>
                <h3 className="text-base font-semibold text-slate-900">Manufacturers &amp; Systems Partners</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Maintain structured technical information, support factory-backed maintenance ecosystems, and engage at industry forums.
                </p>
              </div>

              <div className="p-6 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">Sole Practitioners</div>
                <h3 className="text-base font-semibold text-slate-900">Independent Specialists</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Gain instant access to commercial calculators, professional document storage, and verified partner credibility for just £7.92/mo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 12. CONTRACTOR JOURNEY (7 STEPS) */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">ONBOARDING LIFECYCLE</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                From application to verified partner.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                A transparent, step-by-step qualification process designed for professional trade suppliers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {[
                { step: '01', title: 'Register', desc: 'Basic business details & trading history' },
                { step: '02', title: 'Capability', desc: 'Select trade disciplines & operating regions' },
                { step: '03', title: 'Compliance', desc: 'Upload insurances, accreditations & policies' },
                { step: '04', title: 'Workforce', desc: 'Register engineers, tickets & competency cards' },
                { step: '05', title: 'Review & Pay', desc: 'EntireFM review and £95 + VAT membership' },
                { step: '06', title: 'Verification', desc: 'Broker insurance checks & technical review' },
                { step: '07', title: 'Active Partner', desc: 'Access platform tools & network consideration' },
              ].map((s, idx) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-sm space-y-2">
                  <span className="text-[10px] font-mono text-[#EA580C] font-bold">{s.step}</span>
                  <h3 className="text-xs font-bold text-slate-900">{s.title}</h3>
                  <p className="text-[11px] text-slate-500 font-light leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 13. ROI / BUSINESS CASE SECTION */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-12">
              <span className="eyebrow eyebrow-light">BUSINESS CASE DIAGNOSTIC</span>
              <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Is £95 a sensible business decision?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Consider the operational economics. If EntireFM helps your business achieve just one of the following:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: '1 Hour Saved per Month', desc: 'One hour of reduced admin or document searching pays back the monthly £7.92 equivalent.' },
                { title: '1 Avoided Compliance Chase', desc: 'Preventing a lapsed policy hold or emergency insurance scramble protects your work readiness.' },
                { title: '1 Faster Job Close-Out', desc: 'Submitting timestamped digital evidence and signed service reports accelerates payment approval.' },
                { title: '1 Better-Prepared Site Visit', desc: 'Having operatives inducted and briefed with digital job packs eliminates wasted journeys.' },
              ].map((roi, idx) => (
                <div key={idx} className="p-6 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Efficiency Gain</div>
                  <h3 className="text-sm font-semibold text-slate-900">{roi.title}</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">{roi.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 14. BUILT FOR FAIR PROCUREMENT (GOVERNANCE FIREWALL) */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">PROCUREMENT INTEGRITY</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Built for fair procurement.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Membership gives you access to the Contractor Platform and Partner Network. It does not purchase work.
              </p>
            </div>

            {/* Commercial Transparency Banner component (icons cleaned) */}
            <CommercialTransparencyBanner />

            <div className="p-6 rounded-sm bg-white border border-slate-200 text-xs text-slate-600 font-light leading-relaxed space-y-2">
              <div className="font-semibold text-slate-900">Why this separation protects both sides:</div>
              <p>
                Contractors know exactly what they are paying for: professional operating software, document infrastructure, and network intelligence. Clients know supplier selection and work order allocation are based strictly on technical competence, verified compliance, availability, and operational performance — never on membership spend.
              </p>
            </div>
          </div>
        </section>

        {/* 15. WHERE YOUR MEMBERSHIP SUPPORTS THE PLATFORM */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-12">
              <span className="eyebrow eyebrow-light">INFRASTRUCTURE SUPPORT</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Where your membership supports the platform.
              </h2>
              <p className="mt-3 text-sm text-slate-600 font-light leading-relaxed">
                EntireFM membership fees directly fund the technology, verification processes, and network infrastructure that power the platform:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-light text-slate-700">
              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Secure Document Storage</span>
                <p className="text-slate-600">High-availability cloud infrastructure for insurance policies, RAMS, and training records.</p>
              </div>
              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Dedicated Verification Desks</span>
                <p className="text-slate-600">Technical compliance reviews of accreditation bodies, underwriting policies, and certifications.</p>
              </div>
              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Automated Expiry Radar</span>
                <p className="text-slate-600">Proactive 90/60/30-day notifications preventing unexpected operational compliance holds.</p>
              </div>
              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Platform Development</span>
                <p className="text-slate-600">Continuous updates to business calculators, RAMS generators, and digital field forms.</p>
              </div>
              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Regulatory Surveillance</span>
                <p className="text-slate-600">Tracking Companies House good standing, Building Safety Act bulletins, and trade updates.</p>
              </div>
              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Technical Forums &amp; CPD</span>
                <p className="text-slate-600">Organising regional breakfast briefings, manufacturer product sessions, and network events.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 16. COMMERCIAL FAQ */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">FREQUENTLY ASKED QUESTIONS</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Contractor Membership FAQ
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Clear, transparent answers on commercial terms, platform features, and network participation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  q: 'What does the £95 membership include?',
                  a: 'The £95 + VAT annual membership includes full access to the EntireFM Contractor Platform: Contractor Control Centre, Document Vault, automated insurance expiry radar, RAMS generator, Job Packs tool, Workforce Matrix, business productivity calculators, and contractor intelligence.',
                },
                {
                  q: 'Is membership mandatory to apply as a supplier?',
                  a: 'Initial Stage 1 application and basic company registration is free (£0 intake). To access the full digital contractor operating platform, document vault, and active network tools, annual membership applies upon verification.',
                },
                {
                  q: 'Does membership guarantee work?',
                  a: 'No. EntireFM strictly separates commercial membership from operational work allocation. Work orders are awarded based on technical capability, geography, compliance status, workforce competency, availability, and client demand.',
                },
                {
                  q: 'Are there different membership tiers?',
                  a: 'No. EntireFM has simplified to a single annual membership of £95 + VAT. Every member receives the complete platform proposition with no artificial feature tiering or upsells.',
                },
                {
                  q: 'Can I use the Contractor Platform if I do not currently have EntireFM work?',
                  a: 'Yes. The Contractor Platform provides daily operating value for compliance storage, RAMS creation, engineer matrix tracking, and business calculators independently of EntireFM work order flow.',
                },
                {
                  q: 'Can I upload my existing insurance and trade certificates?',
                  a: 'Yes. You can upload Public Liability, Employers Liability, Gas Safe, NICEIC, Refcom, and other statutory certifications directly into your Document Vault.',
                },
                {
                  q: 'What happens when an insurance certificate expires?',
                  a: 'Our automated system notifies you 90, 60, 30, and 7 days prior to expiry. If a mandatory policy lapses, a temporary compliance hold applies to work dispatch until the renewed certificate is uploaded.',
                },
                {
                  q: 'Can I manage my individual engineers and operatives?',
                  a: 'Yes. The Workforce & Matrix module allows you to register field operatives, assign trade qualifications, upload CSCS/JIB cards, and monitor site induction readiness.',
                },
                {
                  q: 'Can I create RAMS for commercial jobs?',
                  a: 'Yes. The RAMS builder provides commercial FM risk controls, hazard selection, method statement creation, and digital operative sign-offs.',
                },
                {
                  q: 'What happens if I have an EntireFM invitation code?',
                  a: 'Valid EntireFM invitation codes apply a £0 fee waiver across membership during application checkout.',
                },
                {
                  q: 'Does technical approval come automatically after payment?',
                  a: 'No. Payment provides platform access. Operational approval to perform work on EntireFM client properties requires satisfactory completion of technical due diligence and verification of mandatory insurances.',
                },
              ].map((faq, fIdx) => (
                <div key={fIdx} className="p-6 bg-white border border-slate-200 rounded-sm space-y-2 shadow-xs">
                  <h3 className="text-sm font-semibold text-slate-900">{faq.q}</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 16b. CONTRACTOR TESTIMONIALS */}
        <ContractorTestimonialPlaceholder />

        {/* 17. FINAL CONVERSION CALL TO ACTION */}
        <section className="py-24 bg-white border-b border-slate-200 text-center">
          <div className="container-custom max-w-3xl space-y-8">
            <span className="eyebrow eyebrow-light">JOIN TODAY</span>
            <h2 className="text-3xl sm:text-5xl font-extralight text-slate-900 tracking-tight leading-tight">
              Build a more professional contracting business.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
              Join a contractor network designed around the way commercial FM work is actually delivered — with the digital infrastructure to manage your business, your people, your compliance, and your work from one place.
            </p>

            <div className="p-6 rounded-sm bg-[#FAF9FB] border border-slate-200 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Contractor Network Member</div>
                <div className="text-xl font-light text-slate-900">£95 + VAT<span className="text-xs text-slate-500 font-normal"> / year</span></div>
                <span className="text-[10.5px] text-emerald-700 font-medium">Invitation codes accepted (£0 waiver)</span>
              </div>

              <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 px-5 font-bold shrink-0">
                Join the Network &rarr;
              </Link>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Join the EntireFM Contractor Network <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#platform-overview" className="btn-ghost-dark">
                Explore the Contractor Platform
              </Link>
            </div>

            <p className="text-[11.5px] text-slate-500 max-w-md mx-auto font-light pt-4 border-t border-slate-100">
              Membership does not guarantee work. Technical approval and work allocation remain based on capability, compliance, and operational performance.
            </p>
          </div>
        </section>

        {/* Sticky CTA bar */}
        <StickyMembershipCta />

        {/* Related Supplier Information Links */}
        <SupplierRelatedLinks
          eyebrow="CONTRACTOR PLATFORM"
          heading="Related supplier information"
          links={[
            {
              title: 'Partner Network',
              href: '/suppliers/partner-network',
              description: 'Collaborative ecosystem for regional contractors, specialists, OEMs, and innovators.',
              tag: 'NETWORK',
            },
            {
              title: 'How We Work',
              href: '/suppliers/how-we-work',
              description: 'Understand the 12-stage operational journey from registration to work allocation.',
              tag: 'LIFECYCLE',
            },
            {
              title: 'Supplier Compliance',
              href: '/suppliers/compliance',
              description: '6-pillar statutory vetting framework, required insurance levels, and trade bodies.',
              tag: 'COMPLIANCE',
            },
            {
              title: 'Supplier FAQ',
              href: '/suppliers/faq',
              description: 'Clear answers on vetting standards, operational processes, and payment terms.',
              tag: 'FAQ',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
