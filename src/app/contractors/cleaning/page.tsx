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
  Sparkles,
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
  FlaskConical,
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/cleaning'];

export const metadata: Metadata = generateRouteMetadata('/contractors/cleaning', {
  title: config.metaTitle,
  description: config.metaDescription,
});

const CLEANING_STEPS = [
  {
    step: 1,
    title: 'Apply Online',
    description:
      'Submit your cleaning company profile, operative workforce scale, supervisor ratios, and regional service territories.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your COSHH safety packs, Safety Data Sheets (SDS), BICSc certificates, Right to Work audit records, and Public Liability insurance.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Declare your specialist machinery capabilities (scrubber dryers, diamond polishers, reach-and-wash systems) and out-of-hours coverage.',
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
      'EntireFM audits your colour-coded cross-contamination controls, supervisor inspection formats, and operative health & safety vetting.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved cleaning contractors join our active supplier panel for consideration across scheduled daily office contracts and periodic floor/deep cleaning.',
    badge: 'Step 6',
  },
];

export default function CleaningContractorPage() {
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
              name: 'Commercial Cleaning Contractor Network',
              serviceType: 'Facilities Management Commercial Cleaning Contractor Onboarding & Contract Allocation',
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
            { figure: 'BICSc & COSHH', label: 'Hygiene Standard', detail: 'Vetted & audit-ready' },
            { figure: 'Merit-Based', label: 'Work Matching', detail: 'Daily contracts & periodic' },
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

        {/* 3. WHAT COMMERCIAL FM CLEANING INVOLVES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ORDER PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM Cleaning Work Can Involve
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial cleaning demands strict chemical safety, high-grade machinery, and audited cross-contamination prevention across high-density workplaces:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Daily Corporate Office Contract Cleaning</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Scheduled early morning or evening contract cleaning across corporate offices: open-plan desk sanitisation, communal tea-point hygiene, high-volume washroom replenishment, and waste segregation.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Hard Floor Diamond Restoration &amp; Scrubbing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Periodic machine stripping, deep rotary scrubbing, diamond-pad mechanical polishing, and polymer seal application across high-traffic vinyl, terrazzo, marble, and polished concrete floors.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Carpet Deep Extraction</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Hot water extraction (steam cleaning), encapsulation dry cleaning, and specialized spot treatment across corporate carpet tiles, boardroom wool carpets, and high-wear entrance barrier matting.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">High-Level &amp; Reach-and-Wash Window Cleaning</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Pure water deionised reach-and-wash pole cleaning up to 60ft, alongside MEWP-assisted external curtain wall glazing and atrium high-level internal framework cleaning.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Clinical &amp; Healthcare Deep Sanitisation</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Terminal room sanitisation, ATP bioluminescence surface swab validation, disinfectant fogging, and strict clinical waste segregation for medical suites and cleanroom environments.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Industrial Warehouse &amp; Plantroom Degreasing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Heavy-duty industrial scrubber-dryer washing of distribution warehouse floor slabs, battery charging bays, tyre mark chemical stripping, and mechanical plantroom floor degreasing.
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
                Where Commercial Cleaning Contractors Operate
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial cleaning demands specialized equipment, staff vetting, and quality auditing across diverse estate sectors:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Headquarters &amp; Corporate Offices</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executive boardroom standards, daily hot-desk sanitisation, shower block hygiene, and touchpoint wipe-downs.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Logistics &amp; Distribution Hubs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  24/7 driver welfare facilities, warehouse floor scrubbing, locker room sanitation, and canteen turnarounds.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail Parks &amp; Shopping Centres</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Continuous day-janitor coverage, mall concourse floor burnishing, customer washroom checks, and food court clearing.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Educational &amp; Healthcare Facilities</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Enhanced DBS vetted cleaning teams, infection control colour coding, non-toxic eco chemical dosing, and holiday deep cleans.
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
                Scheduled Contract Cleaning vs Periodic Deep Clean Scopes
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities management cleaning combines recurring daily service schedules with specialist periodic asset restoration projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Scheduled Daily Contract Cleaning</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Daily / Weekly • Predictable Recurring Revenue • SLA Scorecards</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Structured recurring routines managing workplace hygiene according to <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">contracted SLA specifications</Link> and BICSc standards.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Daily vacuuming, hard floor damp mopping, and waste container clearing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Washroom descaling, sanitary bin servicing, and soap/paper towel replenishment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Digital supervisor quality scoring and time-and-attendance logging.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <Sparkles className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Periodic Deep Cleans &amp; Reactive Scopes</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Quarterly / Ad-Hoc • High-Margin Project Scopes • Asset Recovery</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Specialist project scopes targeting deep contamination, lease handover dilapidations, or post-incident contamination events.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Machine floor strip and seal or high-speed diamond pad burnishing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>High-level reach-and-wash external glazing and architectural louvre cleaning.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Emergency viral containment fogging or post-flood deep hygiene extraction.</span>
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
                What Commercial FM Clients Expect from Cleaning Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities managers, corporate operations directors, and commercial property managers evaluate cleaning companies on audit rigor, staff reliability, and safety discipline:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-base font-semibold text-slate-900">COSHH &amp; Chemical Safety</h3>
                <p className="text-slate-600 leading-relaxed">
                  Complete Safety Data Sheets (SDS) in locked janitorial cupboards, automatic dilution dispensers, clear product labelling, and operative training on PPE and spill containment.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-base font-semibold text-slate-900">BICSc Colour-Coded Hygiene</h3>
                <p className="text-slate-600 leading-relaxed">
                  Strict enforcement of BICSc colour coding across cloths, mops, and buckets (Red for washrooms, Green for kitchens, Blue for general areas, Yellow for clinical zones) to prevent cross-contamination.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-base font-semibold text-slate-900">Staff Vetting &amp; Right to Work</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  100% verified UK Right to Work documentation, formal employee contracts, DBS checks where required, and strict electronic site sign-in verification.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  04
                </div>
                <h3 className="text-base font-semibold text-slate-900">Supervision &amp; Digital Auditing</h3>
                <p className="text-slate-600 leading-relaxed">
                  Designated mobile area supervisors conducting weekly photographic cleanliness audits, reviewing washroom log sheets, and holding monthly client review meetings.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  05
                </div>
                <h3 className="text-base font-semibold text-slate-900">PAT Tested Industrial Machinery</h3>
                <p className="text-slate-600 leading-relaxed">
                  All electrical equipment (commercial vacuums, floor scrubbers, steam cleaners) must carry active PAT test stickers, undamaged cable sheaths, and residual current protection.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  06
                </div>
                <h3 className="text-base font-semibold text-slate-900">Purchase Order Discipline</h3>
                <p className="text-slate-600 leading-relaxed">
                  Accurate monthly billing against pre-authorised Purchase Orders with clear itemisation of consumable stock supplies, enabling rapid invoice sign-off and timely payment.
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
                Cleaning Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Requirements reflect chemical safety law, staff vetting integrity, and professional hygiene standards:
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
                    <span><strong>Public Liability:</strong> Minimum £5,000,000 (£10,000,000 for public sector estates).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory minimum.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Treatment Risk:</strong> Damage to property worked upon endorsement.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Industry Standards</span>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>BICSc Standards:</strong> British Institute of Cleaning Science alignment or corporate membership.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>COSHH Packs:</strong> Complete SDS binder and operative chemical safety training records.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>SSIP Accreditation:</strong> CHAS, SafeContractor, or Constructionline health &amp; safety.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Workforce Integrity</span>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Right to Work:</strong> Complete Home Office compliant employment checks on all staff.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>DBS Clearances:</strong> Basic or Enhanced DBS checks for education and healthcare sites.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>PAT Records:</strong> Annual PAT testing register for all commercial cleaning plant.</span>
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
              subtitle="A clear, structured, and transparent process for putting your commercial cleaning business forward."
              steps={CLEANING_STEPS}
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
                Why Cleaning Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network connects your commercial cleaning business with corporate property contracts across the UK:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Frameworks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business directly in front of corporate office contracts, logistics hub cleans, and multi-site retail portfolios.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage COSHH packs, BICSc certificates, and insurance in one centralized system with automated expiry alerts.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Merit-Based Matching</h3>
                <p className="text-slate-600 leading-relaxed">
                  Contracts are matched based on verified supervisory capabilities, workforce scale, specialist machinery, and location.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Streamlined Admin</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clear Purchase Orders, structured digital audit checklists, and straightforward electronic invoicing aligned with commercial accounting teams.
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
              title="Essential Resources for Cleaning Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, COSHH safety, and statutory PPM standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 12. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Cleaning Contractor FAQs"
              subtitle="Answers to common questions about COSHH regulations, BICSc standards, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 13. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Cleaning Business Forward for Commercial FM Work"
            description="Join the EntireFM Contractor Network. Complete the online intake, submit your COSHH and compliance details, and access commercial facilities management opportunities across the UK. £95+VAT annual membership payable upon application submission."
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
