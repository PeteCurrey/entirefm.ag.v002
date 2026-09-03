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
  Hammer,
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
  Search,
  Eye,
  Umbrella,
  DoorOpen,
  Paintbrush,
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/fabric-maintenance'];

export const metadata: Metadata = generateRouteMetadata('/contractors/fabric-maintenance', {
  title: config.metaTitle,
  description: config.metaDescription,
});

const FABRIC_STEPS = [
  {
    step: 1,
    title: 'Apply Online',
    description:
      'Submit your company profile, multi-skilled fabric engineering trades (joinery, ceilings, doors, glazing), and operating radius.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your CSCS trade cards, DHF door certifications, BM TRADA fire door credentials, Asbestos Awareness, and Public Liability insurance.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Declare your specialist workshop fabrication capabilities, access equipment (PASMA/IPAF), and out-of-hours coverage.',
    badge: 'Step 3',
  },
  {
    step: 4,
    title: 'Pay Annual Membership Fee',
    description:
      'Pay the straightforward £95 + VAT annual membership fee during application submission. Clear, transparent, and professional.',
    badge: 'Step 4',
  },
  {
    step: 5,
    title: 'Technical Desk Review',
    description:
      'EntireFM audits your fire door inspection competency, dust control RAMS, and commercial architectural finish quality records.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved building fabric contractors join our active supplier panel for consideration across planned fabric condition PPM and reactive property repairs.',
    badge: 'Step 6',
  },
];

export default function FabricMaintenanceContractorPage() {
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
              name: 'Commercial Building Fabric Maintenance Contractor Network',
              serviceType: 'Facilities Management Commercial Building Fabric Contractor Onboarding & Contract Allocation',
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
            { figure: 'BS 8214 & DHF', label: 'Compliance Standard', detail: 'Fire doors & industrial plant' },
            { figure: 'Merit-Based', label: 'Work Matching', detail: 'Fabric PPM & reactive' },
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

        {/* 3. WHAT COMMERCIAL FM FABRIC MAINTENANCE INVOLVES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ORDER PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM Fabric Maintenance Work Can Involve
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Building fabric maintenance covers architectural interior systems, statutory fire compartmentation, industrial door mechanics, and structural envelope repairs:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <DoorOpen className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">BS 8214 Statutory Fire Door Maintenance</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Periodic fire door inspections, intumescent and cold smoke seal replacement, overhead concealed closer adjustments, certified fire-rated hinges, and perimeter gap rectification (3-4mm tolerance).
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Suspended Ceilings &amp; Acoustic Partitions</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Overhaul of lay-in acoustic grid tiles (Armstrong, SAS, Zentia), metal pan ceilings, demountable glass partition relocations, and drylining fire-rated stud partition installations.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Industrial Roller Shutters &amp; Loading Docks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  DHF-compliant servicing of motorized industrial roller shutters, sectional overhead doors, safety brake drop tests, hydraulic dock levellers, and dock shelter bumper repairs.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Glazing &amp; Window Hardware</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Replacement of cracked commercial double-glazed units, safety manifestation decals (BS 6262-4), teleflex window winding gear overhauls, and emergency security boarding up.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Paintbrush className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Redecoration &amp; Floor Finishes</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Out-of-hours commercial painting (low VOC airless spraying), heavy-duty vinyl safety flooring weld repairs (Altro/Polyflor), carpet tile replacement, and corner wall guard protection.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Hammer className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Locksmithing &amp; Panic Hardware</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Master key suite installations, BS EN 1125 panic exit push bar maintenance, electromechanical strike servicing, and commercial architectural ironmongery replacements.
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
                Where Commercial Fabric Maintenance Contractors Operate
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial fabric engineers maintain interior and exterior structural elements across all major commercial sectors:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Corporate Offices &amp; Banks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Acoustic boardroom partitions, executive washroom joinery, high-spec architectural reception finishes, and carpet tiles.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Logistics &amp; Distribution Hubs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-speed rapid roll doors, industrial sectional shutters, warehouse bollard barriers, and floor expansion joints.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail Parks &amp; Shopping Centres</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Automatic sliding entrance doors, anti-ram security bollards, safety balustrades, and public washroom cubicle repairs.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Healthcare &amp; Public Buildings</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Acrovyn impact wall protection, anti-ligature door hardware, hygienic vinyl wall cladding (Whiterock), and fire doors.
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
                Planned Building Fabric PPM vs Urgent Reactive Repairs
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities management building fabric works balance statutory compartmentation PPM with urgent reactive lock, glass, and door call-outs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Planned Fabric Inspections (PPM)</h3>
                    <p className="text-slate-500 text-[11px] font-mono">6 / 12-Monthly • SFG20 Standards • Statutory Fire Safety</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Scheduled asset condition auditing aligned with <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 planned maintenance tasks</Link> to preserve asset lifespan and verify fire compartmentation.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Bi-annual 6-point fire door gap and closer inspections (BS 8214).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Annual industrial door mechanical servicing, chain tensioning, and brake tests.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Photographic dilapidation surveys and fabric life-cycle condition reporting.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <Wrench className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Urgent Reactive Fabric Repairs</h3>
                    <p className="text-slate-500 text-[11px] font-mono">2 to 4-Hour Response • Building Security • Priority Call-Outs</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Rapid resolution of physical building security breaches, failed exit hardware, shattered vision panels, and jammed loading bay shutters.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Emergency boarding-up and glass replacement following break-ins or impact.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Failed emergency exit panic hardware repair to restore means of escape.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Stuck industrial roller shutter release to prevent warehouse loading stoppages.</span>
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
                What Commercial FM Clients Expect from Fabric Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities directors, building surveyors, and property management teams evaluate fabric contractors on technical certification, dust containment, and professional craftsmanship:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-base font-semibold text-slate-900">Fire Door Certification</h3>
                <p className="text-slate-600 leading-relaxed">
                  Operatives repairing fire doors must understand BS 8214 requirements: intumescent strip specifications, non-combustible packing, certified hinges, and 3mm gap tolerances.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-base font-semibold text-slate-900">Dust &amp; Noise Control</h3>
                <p className="text-slate-600 leading-relaxed">
                  Strict M-Class HEPA dust extraction on all cutting tools, plastic screening barriers in occupied buildings, and scheduling loud drilling/sanding out of normal office hours.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-base font-semibold text-slate-900">Asbestos Awareness</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  All attending operatives must hold current UKATA/IATP Asbestos Awareness training and verify the site Asbestos Register prior to drilling or cutting into any wall/ceiling fabric.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  04
                </div>
                <h3 className="text-base font-semibold text-slate-900">DHF Industrial Door Safety</h3>
                <p className="text-slate-600 leading-relaxed">
                  Power-operated doors and shutters must be serviced in accordance with BS EN 12635, verifying anti-drop safety brakes, optical safety edges, and emergency manual overrides.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  05
                </div>
                <h3 className="text-base font-semibold text-slate-900">Photographic Proof of Repair</h3>
                <p className="text-slate-600 leading-relaxed">
                  Digital job sign-off requires clear before-and-after photographs demonstrating flawless paint finishes, flush joinery alignments, and cleaned work areas.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  06
                </div>
                <h3 className="text-base font-semibold text-slate-900">Purchase Order Discipline</h3>
                <p className="text-slate-600 leading-relaxed">
                  Invoicing strictly referencing pre-approved Purchase Orders with clear separation of labour hours and specialist materials (e.g. fire-rated ironmongery) for rapid payment.
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
                Building Fabric Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Requirements reflect statutory fire safety legislation, work-at-height rules, and commercial craftsmanship standards:
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
                    <span><strong>Public Liability:</strong> Minimum £5,000,000 (£10,000,000 for corporate head offices).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory minimum.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Hot Works:</strong> Endorsement covering heat guns or mechanical cutting disc operations.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Trade Accreditations</span>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Fire Door Schemes:</strong> BM TRADA Q-Mark or FIRAS fire door maintenance certification.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>DHF Accreditation:</strong> Door &amp; Hardware Federation industrial door certification.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>SSIP Member Scheme:</strong> CHAS, SafeContractor, or Constructionline health &amp; safety.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Operative Competencies</span>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>CSCS Skilled Worker:</strong> NVQ Level 2/3 in Carpentry, Joinery, or Drylining.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Asbestos Awareness:</strong> UKATA or IATP certified training for all operatives.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>PASMA / IPAF:</strong> Mobile tower and MEWP access qualifications for high-level work.</span>
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
              subtitle="A clear, structured, and transparent process for putting your building fabric business forward."
              steps={FABRIC_STEPS}
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
                Why Building Fabric Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network connects your joiners and fabric trades with commercial facilities management contracts:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Portfolios</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business directly in front of multi-site commercial office maintenance, retail parks, and logistics depots.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage CSCS cards, asbestos certificates, and insurance in one unified dashboard with automated renewal alerts.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Merit-Based Matching</h3>
                <p className="text-slate-600 leading-relaxed">
                  Work is allocated based on verified trade qualifications (CSCS/DHF), craftsmanship track record, and operational radius.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Streamlined Admin</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clear Purchase Orders, digital photographic sign-off, and structured electronic invoicing aligned with commercial accounts.
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
              title="Essential Resources for Fabric Maintenance Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, fire door compliance, and statutory PPM standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 12. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Fabric Maintenance Contractor FAQs"
              subtitle="Answers to common questions about fire door regulations, CSCS requirements, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 13. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Building Fabric Business Forward for Commercial FM Work"
            description="Join the EntireFM Contractor Network. Complete the online intake, submit your trade and compliance details, and access commercial facilities management opportunities across the UK. £95+VAT annual membership payable upon application submission."
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
