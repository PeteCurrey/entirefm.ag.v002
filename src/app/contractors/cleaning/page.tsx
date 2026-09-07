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
  Award,
  Layers,
  Eye,
  FlaskConical,
  Wrench,
  Droplets,
  AlertTriangle,
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
      'Submit your commercial cleaning business details, workforce scale, supervisor ratios, and regional operating territories.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your COSHH safety packs, Safety Data Sheets (SDS), BICSc certificates, Right to Work audit logs, and Public Liability insurance.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Specify your machinery capabilities (ride-on scrubber dryers, diamond burnishers, pure-water reach-and-wash systems) and out-of-hours coverage.',
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
      'EntireFM conducts due diligence on your colour-coded cross-contamination controls, mobile audit formats, and operative health & safety vetting.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved contractors enter our active supplier network for merit-based consideration across scheduled contract cleaning and periodic deep cleaning.',
    badge: 'Step 6',
  },
];

export default function CleaningContractorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://www.entirefm.com/contractors/cleaning#service',
        name: 'Commercial Cleaning Contractor Network',
        serviceType: 'Facilities Management Commercial Cleaning Contractor Onboarding & Contract Allocation',
        description: config.metaDescription,
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
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.entirefm.com/contractors/cleaning#breadcrumb',
        itemListElement: config.breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `https://www.entirefm.com${crumb.url}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.entirefm.com/contractors/cleaning#faq',
        mainEntity: config.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
            { figure: 'Merit-Based', label: 'Work Allocation', detail: 'Daily contracts & periodic' },
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
                What Commercial FM Cleaning Work Involves
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial contract cleaning demands strict chemical safety, industrial machinery, and audited cross-contamination prevention across high-density workplaces:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Daily Corporate Office Contract Cleaning</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Delivering scheduled early morning or evening contract cleaning across Grade-A office buildings: open-plan desk sanitisation, IT equipment keyboard detailing, communal kitchen hygiene, high-volume washroom replenishment, and waste segregation in line with client environmental targets.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Hard Floor Diamond Restoration &amp; Scrubbing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executing periodic mechanical stripping, deep rotary scrubbing, diamond-pad crystallization polishing, and slip-resistant polymer seal application across high-traffic terrazzo, natural marble, vinyl composite tile (VCT), and polished architectural concrete floors.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Carpet Deep Extraction</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Utilizing truck-mounted and portable high-cfm hot water extraction (HWE), low-moisture polymer encapsulation cleaning, and targeted spot treatment across commercial modular carpet tiles, executive wool boardrooms, and heavy-wear entrance barrier matting.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">High-Level &amp; Reach-and-Wash Glazing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Periodic external and internal glass cleaning utilizing deionised pure-water carbon fibre telescopic poles (up to 60ft) and mobile elevating work platforms (MEWPs / IPAF certification) for architectural curtain walling, atrium canopies, and high-level balustrades.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Industrial Warehouse Degreasing &amp; Decontamination</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Heavy-duty industrial cleaning across logistics distribution depots and manufacturing bays: deploying ride-on scrubber-dryers, alkaline chemical degreasers, mechanical tyre-mark removal, and overhead structural truss vacuuming to preserve pristine warehouse standards.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Hygiene Washroom Services &amp; Infection Control</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Statutory sanitary waste disposal, automatic air-care maintenance, and clinical infection control sanitisation. Reactive deployment for biological contamination or post-incident deep sanitisation using electrostatic antimicrobial fogging and ATP bioluminescence surface swab auditing.
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
                Commercial contract cleaning demands tailored scheduling, security clearances, and equipment suited to diverse property types:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Grade-A Corporate Headquarters</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Multi-storey commercial office towers requiring early morning and twilight cleaning rotas, daytime janitorial cover, secure electronic keycard management, and immaculate executive reception presentation.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail Shopping Centres &amp; Commercial Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-footfall common mall walkways, public washrooms, food court seating areas, and entrance concourses requiring continuous daytime janitorial maintenance and automated floor care outside trading hours.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Logistics Hubs &amp; Industrial Depots</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Round-the-clock 24/7 operating distribution centres: driver welfare amenities, transport offices, warehouse packing stations, and automated high-output ride-on scrubbing of floor slab expanses.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Educational Campuses &amp; Schools</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Strict safeguarding environments requiring enhanced DBS-cleared cleaning teams, term-time daily schedules, and extensive summer holiday periodic deep cleaning and floor stripping programmes.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-rose-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Clinical Suites &amp; Healthcare Facilities</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Stringent National Standards of Healthcare Cleanliness compliance, terminal deep cleaning, clinical non-touch dispensers, and auditable high-level infection prevention logging.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Tenanted Commercial Business Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Shared entrance foyers, communal stairwells, passenger lift lobbies, and central core washrooms, coordinating cleanly with our <Link href="/contractors/grounds-maintenance" className="text-[#EA580C] underline font-medium">commercial grounds maintenance contractors</Link> for total estate upkeep.
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
                Scheduled Contract Cleaning vs Reactive Deep Cleans
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial facilities management cleaning balances routine scheduled daily service contracts with responsive reactive deep cleaning call-outs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Scheduled Contract Cleaning (PPM)</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Daily / Weekly Rosters • BICSc Standards • Mobile Auditing</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Programmed systematically in accordance with <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 specifications</Link> and agreed site cleaning schedules to ensure continuous hygiene, asset protection, and statutory compliance.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Daily early morning or evening office contract cleaning with electronic check-in attendance verification.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Weekly washroom deep sanitisation, descaling of sanitary fittings, and automated soap and paper stock replenishment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Quarterly planned machine floor scrubbing, high-reach window cleaning, and hot water carpet extraction cycles.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <AlertTriangle className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Reactive Emergency Sanitisation</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Biohazard Events • Post-Flood Recovery • Outbreak Control</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Triggered by sewage backups, bodily fluid incidents, water leaks into carpeted spaces, post-builder tenancy handovers, or viral outbreak infection control requirements.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Urgent reactive attendance aligned with individual work order priority targets to isolate contaminated areas and restore operational use.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Deployment of specialist biocidal chemical solutions, industrial wet-vacuum extractors, and electrostatic disinfectant sprayers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Post-clean ATP surface swab testing and verified digital sign-off documentation certifying site hygiene and safety.</span>
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
                Facilities managers, workplace directors, and managing agents evaluate cleaning contractors on supervisory discipline, chemical safety rigour, and consistent quality:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-light">
              <div className="space-y-6">
                <div className="border-l-2 border-[#EA580C] pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-[#EA580C] uppercase tracking-wider">
                    SPECIFICATION 01 // CHEMICAL SAFETY
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">COSHH &amp; Chemical Management</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Full compliance with COSHH Regulations 2002. Janitorial facilities typically require secure chemical storage, locked dosing systems where installed, complete Safety Data Sheets (SDS), standardized hazard labelling, and documented operative PPE training records.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 02 // INFECTION CONTROL
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">BICSc 4-Colour Hygiene Coding</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Adherence to colour-coded hygiene systems (such as the BICSc 4-colour standard): Red for sanitary washrooms/toilets, Green for kitchens/catering, Blue for general office areas, and Yellow for washroom basins/surfaces to eliminate cross-contamination risks.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 03 // WORKFORCE VETTING
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Security Vetting &amp; Right to Work</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Verified Home Office Right to Work checks on all attending personnel. Depending on the client framework, contractors may be required to provide BS 7858 security screening or enhanced DBS certificates where servicing financial institutions, schools, or healthcare estates.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 04 // AUDITABLE SUPERVISION
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Dedicated Area Supervision &amp; Quality Audits</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Providing designated mobile area managers who conduct monthly documented photographic audits, maintain electronic sign-in verification, and resolve cleaning punch-list items within agreed timeframes.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 05 // MACHINERY SAFETY
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">PAT-Tested Equipment &amp; Cable Safety</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Commercial cleaning machinery should carry in-date electrical inspection or PAT test labels, safety cable guards, and trip-hazard ramps when operating in corridors and common circulation zones.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 06 // FINANCIAL PROCESS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Purchase Order &amp; Billing Discipline</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Clear invoicing mapped to individual Purchase Orders with separate itemization of periodic works, consumables replenishment, and contracted routine hours for rapid commercial account sign-off.
                  </p>
                </div>
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
                Commercial facilities managers and hygiene compliance auditors evaluate cleaning contractors across insurance limits, industry schemes, and safety credentials:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-[#EA580C] font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Insurance Cover Expectations</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  EntireFM&apos;s network admission requirements include £5m Public Liability and £10m Employers&apos; Liability cover. Individual client frameworks or estates may specify additional or different insurance requirements depending on the nature and scale of the work:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Public Liability:</strong> £5,000,000 network admission baseline; £10,000,000 frequently specified by clients for Grade-A corporate towers or high-footfall public venues.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory minimum for all contractors employing cleaning personnel.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Treatment Risk / Key Cover:</strong> Policy extensions covering accidental chemical damage to client surfaces and loss of master keys where applicable.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Industry Schemes &amp; Standards</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Industry scheme registrations commonly recognized across commercial facilities cleaning tenders:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>BICSc Alignment:</strong> British Institute of Cleaning Science standards and colour-coding adherence commonly preferred.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>CSSA / ISSA:</strong> Membership of recognized commercial cleaning associations commonly preferred.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>ISO Standards:</strong> ISO 9001 (Quality) and ISO 14001 (Environmental) often expected for large corporate frameworks.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Health, Safety &amp; Vetting Standards</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Safety schemes and audit standards typically reviewed during onboarding or specified by clients:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>SSIP Accreditation:</strong> Valid CHAS, SafeContractor, or Constructionline health &amp; safety approval commonly expected.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>COSHH Training:</strong> Documented operative training on chemical dilution and personal protective equipment.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>DBS Checks:</strong> Enhanced Disclosure and Barring Service clearance for education and healthcare contracts where required.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. WHY COMMERCIAL CLEANING CONTRACTORS NEED STRONG RAMS & DOCUMENTATION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">SAFETY &amp; HYGIENE RIGOUR</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Why Commercial Cleaning Contractors Need Robust RAMS
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Slips, chemical exposure, working at height on glazing, and out-of-hours lone working represent genuine liabilities on commercial premises. Commercial facilities managers demand site-specific RAMS before contracts commence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <FileCheck className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Task-Specific Method Statements &amp; Safe Systems</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Floor Scrubbing • Water-Fed Pole Glazing • Lone Working</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Every commercial cleaning specification requires clear method statements detailing machine operation, wet-floor warning signage deployment, and chemical mixing sequences. Review our comprehensive guide on <Link href="/contractor-resources/rams/what-are-rams" className="text-[#EA580C] underline font-medium">what commercial RAMS are</Link>.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Detailed sequence of work for mechanical floor stripping, warning cone perimeter placement, and slip-mitigation dry-buffing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Safe systems of work for high-reach telescopic window cleaning, wind-speed monitoring, and overhead line avoidance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Learn more in our guide on <Link href="/contractor-resources/rams/how-to-write-rams" className="text-[#EA580C] underline font-medium">how to write compliant commercial RAMS</Link>.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">COSHH Risk Assessments &amp; Lone Working Controls</h3>
                    <p className="text-slate-500 text-[11px] font-mono">5x5 Risk Evaluation • Chemical Exposure • Check-In Protocols</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Under the Management of Health and Safety at Work Regulations 1999, facilities directors are accountable for workforce safety during twilight hours. Cleaning contractors are expected to maintain defensible risk matrices and lone worker welfare systems.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>5x5 risk evaluation covering chemical vapours, eye contact, repetitive strain, and slip/trip hazards during wet cleaning.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Full compliance with <Link href="/contractor-resources/risk-assessments/what-is-a-risk-assessment" className="text-[#EA580C] underline font-medium">commercial risk assessment standards</Link>, documenting eyewash station access and emergency spillage procedures.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Documented lone working safety procedures, mobile phone check-in intervals, and automated escalation protocols for twilight shifts.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Professional Responsibility Note */}
            <div className="rounded-sm border border-slate-200 bg-[#FAFAF8] p-5 text-xs text-slate-500 font-light leading-relaxed max-w-4xl mx-auto text-center">
              <strong className="text-slate-800 font-semibold">Professional Competency Notice:</strong> Site-specific RAMS, COSHH assessments, and lone-worker procedures must always be prepared, reviewed, and signed off by the contractor&apos;s own qualified competent persons to reflect the specific site layout, chemical inventory, and operational risks.
            </div>
          </div>
        </section>

        {/* 10. HOW THE CONTRACTOR NETWORK WORKS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <ContractorStepByStep
              eyebrow="ONBOARDING ROADMAP"
              title="How EntireFM's Contractor Network Works"
              subtitle="A clear, structured, and transparent process for putting your commercial cleaning business forward."
              steps={CLEANING_STEPS}
              columns={2}
            />

            {/* Disclaimer Box */}
            <div className="rounded-sm border border-slate-200 bg-white p-6 text-xs text-slate-600 font-light leading-relaxed max-w-4xl mx-auto text-center space-y-2">
              <p className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
                Transparent Operating Proposition
              </p>
              <p>
                Membership provides access to EntireFM&apos;s approved supplier framework, compliance management tools, and consideration for relevant commercial work orders. Membership does not guarantee contract awards or minimum work volumes.
              </p>
            </div>
          </div>
        </section>

        {/* 11. WHY COMMERCIAL CONTRACTORS JOIN */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">BUSINESS VALUE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Why Cleaning Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network positions your commercial cleaning company as an approved supplier for commercial facilities management requirements:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Frameworks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business directly in front of commercial facilities management requirements across corporate offices, retail parks, and logistics hubs.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage COSHH packs, BICSc certificates, and insurance in one secure system with automated renewal alerts.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Merit-Based Matching</h3>
                <p className="text-slate-600 leading-relaxed">
                  Relevant work orders can be matched against factors including trade competency, geographic proximity, work requirements, response requirements and available performance information.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Streamlined Admin</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clear Purchase Orders, structured site specifications, and straightforward electronic invoicing processes aligned with commercial finance teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 12. CONTRACTOR RESOURCES */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <ContractorRelatedGrid
              eyebrow="CONTRACTOR KNOWLEDGE BASE"
              title="Essential Resources for Cleaning Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, COSHH safety compliance, and commercial contract standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 13. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Cleaning Contractor FAQs"
              subtitle="Answers to common questions about BICSc standards, COSHH safety, staff vetting, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 14. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Cleaning Business Forward for Commercial FM Work"
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
