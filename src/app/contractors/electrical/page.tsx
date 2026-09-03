import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContractorCinematicHero } from '@/components/contractors/ContractorCinematicHero';
import { ContractorQuickAnswer } from '@/components/contractors/ContractorQuickAnswer';
import { ContractorStepByStep } from '@/components/contractors/ContractorStepByStep';
import { ContractorComparisonTable } from '@/components/contractors/ContractorComparisonTable';
import { ContractorFaqAccordion } from '@/components/contractors/ContractorFaqAccordion';
import { ContractorConversionBanner } from '@/components/contractors/ContractorConversionBanner';
import { ContractorRelatedGrid } from '@/components/contractors/ContractorRelatedGrid';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { CONTRACTOR_COMMERCIAL_PAGES } from '@/config/contractor-seo-data';
import {
  Zap,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Activity,
  Award,
  Flame,
  Wrench,
  Layers,
  Sparkles,
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/electrical'];

export const metadata: Metadata = generateRouteMetadata('/contractors/electrical', {
  title: config.metaTitle,
  description: config.metaDescription,
});

const ELECTRICAL_STEPS = [
  {
    step: 1,
    title: 'Apply Online',
    description:
      'Put your business forward via our contractor intake with company registration, operating territories, and primary trade specialisms.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your statutory Public Liability insurance, 18th Edition BS 7671 certifications, NICEIC/NAPIT registrations, and ECS Gold Cards.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Finalise your operational profile, service radii, and verified equipment lists for technical assessment.',
    badge: 'Step 3',
  },
  {
    step: 4,
    title: 'Pay Annual Membership Fee',
    description:
      'Submit the straightforward £95 + VAT annual membership fee during application submission. Clear, transparent, and professional.',
    badge: 'Step 4',
  },
  {
    step: 5,
    title: 'Technical Desk Review',
    description:
      'EntireFM conducts due diligence on your electrical qualifications, tester calibration records, and health & safety documentation.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved contractors enter our active panel for merit-based consideration across relevant planned PPM and reactive electrical assignments.',
    badge: 'Step 6',
  },
];

export default function ElectricalContractorPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Commercial Electrical Contractor Network',
              serviceType: 'Facilities Management Commercial Electrical Contractor Onboarding & Work Allocation',
              provider: {
                '@type': 'Organization',
                name: 'EntireFM',
                url: 'https://www.entirefm.com',
              },
              areaServed: {
                '@type': 'Country',
                name: 'United Kingdom',
              },
              offers: {
                '@type': 'Offer',
                price: '95',
                priceCurrency: 'GBP',
                description: 'Annual Contractor Network Membership (£95+VAT/year)',
                url: 'https://www.entirefm.com/contractors/join',
              },
            }),
          }}
        />

        {/* 1. CINEMATIC HERO */}
        <ContractorCinematicHero
          eyebrow={config.eyebrow}
          title={config.h1}
          subtitle={config.subtitle}
          intro={config.intro}
          imageSrc={config.heroImage.src}
          imageAlt={config.heroImage.alt}
          breadcrumbs={config.breadcrumbs}
          primaryCta={{ label: 'Join the Contractor Network', href: '/contractors/join' }}
          secondaryCta={{ label: 'Find Facilities Management Work', href: '/contractors/find-work' }}
          facts={[
            { figure: '£95 / yr', label: 'Annual Membership', detail: 'Payable on submission' },
            { figure: '18th Edition & NICEIC', label: 'Competency Standards', detail: 'BS 7671 verified' },
            { figure: 'Merit-Based', label: 'Work Matching', detail: 'PPM & reactive scopes' },
          ]}
        />

        {/* 2. QUICK ANSWER */}
        {config.quickSummary && (
          <section className="py-12 bg-[#FAFAF8] border-b border-slate-200">
            <div className="container-custom">
              <ContractorQuickAnswer
                question={config.quickSummary.question}
                summary={config.quickSummary.summary}
                keyPoints={config.quickSummary.keyPoints}
                readTime={config.quickSummary.readTime}
              />
            </div>
          </section>
        )}

        {/* 3. WHAT COMMERCIAL FM ELECTRICAL WORK INVOLVES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ORDER PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM Electrical Work Can Involve
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities management electrical requirements differ substantially from domestic repairs. Commercial clients operate under rigorous statutory inspection regimes, multi-tenant lease obligations, and critical power continuity demands.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Periodic Inspection &amp; Testing (EICR)</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Five-year (or risk-based 3-year) Electrical Installation Condition Reports across three-phase commercial switchgear, busbar risers, sub-distribution panels, and machinery supplies. Identifying C1 (danger present), C2 (potentially dangerous), and FI (further investigation) defects.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Activity className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Emergency Lighting Compliance (BS 5266)</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Monthly functional flicker tests and annual full 3-hour battery duration discharge testing across commercial escape routes, illuminated exit signage, stairwells, and plantrooms, complete with luminaire asset registers and logbook certification.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Thermal Imaging &amp; Switchgear Maintenance</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Non-invasive thermographic surveys on live low-voltage switchboards and motor control centres (MCCs) to detect high-resistance terminations, phase imbalances, and overloaded breakers before catastrophic component burnout occurs.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">EICR Remedial Works &amp; Upgrades</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executing authorised remedial repairs to resolve unsatisfactory condition reports: replacing obsolete fuseboards with modern RCBO/AFDD distribution boards, upgrading earthing and main protective bonding, and re-routing damaged containment.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Lighting &amp; Controls</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Retrofitting energy-efficient commercial LED panels, high-bay warehouse luminaires, external security floodlights, and DALI/PIR automated lighting control systems to reduce client energy consumption and maintain lux level compliance.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Flame className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">24/7 Reactive Power &amp; Fault Resolution</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Rapid fault-finding on tripped RCDs, burnt-out contactors, failed mechanical plant supplies, and intermittent distribution faults within contracted service level agreement (SLA) attendance windows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. COMMERCIAL ENVIRONMENTS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">ESTATE PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Where Commercial Electrical Contractors Operate
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                EntireFM manages facilities across diverse commercial sectors. Electrical contractors encounter varied infrastructure, access constraints, and client operational protocols:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Corporate Offices</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Multi-storey Grade A offices and business parks requiring out-of-hours scheduled shutdowns, floor-box power track maintenance, tenant sub-metering, and server room UPS backup supplies.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Industrial &amp; Manufacturing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Heavy industrial facilities with 3-phase machinery isolators, motor control centres (MCCs), busbar distribution, overhead cranes, and hazardous environment containment.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Logistics &amp; Warehousing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-bay storage facilities, distribution hubs, loading bay dock leveller power, exterior perimeter lighting, and EV fleet commercial charging infrastructure.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail &amp; Leisure Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-footfall commercial shopping centres and leisure complexes demanding discreet out-of-hours testing, architectural feature lighting, and rapid emergency lighting fault clearance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PLANNED VS REACTIVE WORK */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK STREAM DYNAMICS</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Planned Preventative Maintenance vs Reactive Electrical Repairs
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial facilities managers structure electrical work into two core delivery channels. Understanding the operational rhythm of each ensures contractors deliver effective service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Planned Preventative Maintenance (PPM)</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Scheduled • Contractual • Compliance-Driven</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  PPM packages are scheduled weeks in advance according to <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 maintenance standards</Link> and statutory duty-holder obligations under the Electricity at Work Regulations 1989.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Fixed agreed appointment windows, allowing efficient engineer route planning.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Comprehensive asset registers: testing every circuit, luminaire, and distribution board systematically.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Generates follow-on remedial quote opportunities to rectify discovered non-compliances.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <Flame className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Reactive &amp; Corrective Call-Outs</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Urgent • SLA-Bound • Fault Resolution</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Reactive work orders arise from sudden power losses, tripped sub-mains, burnt contactors, or storm damage affecting building services. Response times are dictated by contractual priority bands.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Priority 1 (Emergency): 2 to 4-hour on-site attendance to make safe and restore essential power.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Dynamic on-site fault diagnosis and immediate communication with the facilities helpdesk.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Clear first-time fix focus or documented temporary make-safe with priced rectification scope.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. COMPARISON TABLE */}
        {config.comparison && (
          <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
            <div className="container-custom">
              <ContractorComparisonTable
                eyebrow={config.comparison.eyebrow}
                title={config.comparison.title}
                subtitle={config.comparison.subtitle}
                colAName={config.comparison.colAName}
                colBName={config.comparison.colBName}
                rows={config.comparison.rows}
              />
            </div>
          </section>
        )}

        {/* 7. WHAT COMMERCIAL CLIENTS EXPECT FROM CONTRACTORS */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">PROFESSIONAL ASSURANCE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM Clients Expect from Electrical Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Technical skill is only one component of commercial contracting. Facilities managers, building surveyors, and institutional landlords assess contractors on operational reliability and compliance rigour:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-base font-semibold text-slate-900">Strict Safe Isolation &amp; LOTO</h3>
                <p className="text-slate-600 leading-relaxed">
                  Strict adherence to Electricity at Work Regulations 1989 Regulation 14. Live working is prohibited except under exceptional, legally justified conditions. Operatives must prove dead using approved voltage indicators and lock-off isolators with unique padlocks.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-base font-semibold text-slate-900">Site-Specific RAMS Packages</h3>
                <p className="text-slate-600 leading-relaxed">
                  Submitting robust, task-specific <Link href="/contractor-resources/rams/what-are-rams" className="text-[#EA580C] underline font-medium">RAMS documentation</Link> in advance. Generic templates are rejected. Review desks verify that building hazards, tenant access routes, and working at height controls are addressed.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-base font-semibold text-slate-900">Photographic Proof &amp; Asset Data</h3>
                <p className="text-slate-600 leading-relaxed">
                  Capturing clear timestamped photographs of distribution board interiors, schedule cards, repaired components, and final tidy work areas. Facilities managers require visual proof before authorising payment.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  04
                </div>
                <h3 className="text-base font-semibold text-slate-900">Accurate Test Certification</h3>
                <p className="text-slate-600 leading-relaxed">
                  Providing completed, legible digital test certificates (EICR schedules, Minor Electrical Installation Works Certificates) generated using calibrated multi-function testers within 48 hours of work completion.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  05
                </div>
                <h3 className="text-base font-semibold text-slate-900">Professional Site Conduct</h3>
                <p className="text-slate-600 leading-relaxed">
                  Uniformed operatives wearing appropriate PPE (safety footwear, arc-flash protection where required), signing in and out via security logbooks, respecting tenant demise boundaries, and leaving plantrooms spotless.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  06
                </div>
                <h3 className="text-base font-semibold text-slate-900">Purchase Order Discipline</h3>
                <p className="text-slate-600 leading-relaxed">
                  Operating strictly against approved Purchase Orders (POs). Ensuring all invoices explicitly reference the PO number, itemised materials, and agreed labour rates to allow seamless automated payment processing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. COMPLIANCE & COMPETENCE FRAMEWORK */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">STANDARDS &amp; ACCREDITATION</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Electrical Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Requirements reflect the specific electrical scope and site risk. Below are the standard credentials evaluated during EntireFM technical desk reviews:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-[#EA580C] font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Statutory Insurance</span>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Public Liability:</strong> Minimum £5,000,000 (£10,000,000 preferred for corporate/industrial estates).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory minimum for all employers.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Professional Indemnity:</strong> £2,000,000 where electrical design or certification applies.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Trade Competency</span>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Scheme Registration:</strong> NICEIC Approved Contractor, NAPIT, or ECA membership.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Regulations:</strong> Current BS 7671 (18th Edition Wiring Regulations) certification.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Test &amp; Inspection:</strong> City &amp; Guilds 2391 (or 2394/2395) qualification.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Safety &amp; Calibration</span>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>SSIP Accreditation:</strong> CHAS, SafeContractor, or Constructionline health &amp; safety approval.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Operative Cards:</strong> Valid ECS Gold Cards for all on-site electricians.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Calibration:</strong> Annual calibration certificates for all multi-function test equipment.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. HOW THE CONTRACTOR NETWORK WORKS */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <ContractorStepByStep
              eyebrow="ONBOARDING ROADMAP"
              title="How EntireFM's Contractor Network Works"
              subtitle="A clear, structured, and transparent process for putting your electrical contracting business forward."
              steps={ELECTRICAL_STEPS}
              columns={2}
            />

            {/* Disclaimer Box */}
            <div className="rounded-sm border border-slate-200 bg-[#FAFAF8] p-6 text-xs text-slate-600 font-light leading-relaxed max-w-4xl mx-auto text-center space-y-2">
              <p className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
                Transparent Operating Proposition
              </p>
              <p>
                Membership provides access to EntireFM's approved supplier framework, compliance management tools, and consideration for relevant commercial work orders. Membership does not guarantee contract awards or minimum work volumes.
              </p>
            </div>
          </div>
        </section>

        {/* 10. WHY COMMERCIAL CONTRACTORS JOIN */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">BUSINESS VALUE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Why Electrical Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network positions your business as a verified provider for UK facilities management requirements:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Positioning</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business directly in front of commercial facilities management requirements across corporate, industrial, and retail client estates.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Maintain your insurance policies, NICEIC certs, and operative ECS cards in one secure system with automated expiry reminder alerts.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Merit-Based Matching</h3>
                <p className="text-slate-600 leading-relaxed">
                  Work orders are matched based on verified technical competence, response capability, proximity to client sites, and reliable delivery.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Streamlined Admin</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clear Purchase Orders, structured job instructions, and straightforward electronic invoicing processes aligned with commercial finance teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 11. CONTRACTOR RESOURCES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom">
            <ContractorRelatedGrid
              eyebrow="CONTRACTOR KNOWLEDGE BASE"
              title="Essential Resources for Electrical Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, safety documentation, and statutory standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 12. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Electrical Contractor FAQs"
              subtitle="Answers to common questions about qualifications, documentation, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 13. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Electrical Business Forward for Commercial FM Work"
            description="Join the EntireFM Contractor Network. Complete the online intake, submit your compliance details, and access commercial facilities management opportunities across the UK. £95+VAT annual membership payable upon application submission."
            primaryCtaLabel="Join Contractor Network (£95/yr)"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="Find Out How FM Work Works"
            secondaryCtaHref="/contractors/find-work"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

