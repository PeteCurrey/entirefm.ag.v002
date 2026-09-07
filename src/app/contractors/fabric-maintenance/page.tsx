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
  Building2,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Award,
  Layers,
  Wrench,
  DoorClosed,
  Paintbrush,
  Hammer,
  AlertTriangle,
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
      'Submit your company profile, multi-skilled operative trade competencies (joinery, drywall, suspended ceilings, glazing), and regional coverage.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your CSCS trade cards, relevant trade certifications (such as FDIS or DHF where applicable), and Public Liability insurance.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Declare your reactive call-out availability, out-of-hours capability for noisy works in occupied offices, and specialist plant equipment.',
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
      'EntireFM conducts due diligence on your trade craftsmanship qualifications, dust-control RAMS, and health & safety documentation.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved contractors join our active supplier panel for merit-based consideration across scheduled fabric audits and reactive repairs.',
    badge: 'Step 6',
  },
];

export default function FabricMaintenanceContractorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://www.entirefm.com/contractors/fabric-maintenance#service',
        name: 'Commercial Fabric Maintenance Contractor Network',
        serviceType: 'Facilities Management Commercial Building Fabric Contractor Onboarding & Work Allocation',
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
        '@id': 'https://www.entirefm.com/contractors/fabric-maintenance#breadcrumb',
        itemListElement: config.breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `https://www.entirefm.com${crumb.url}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.entirefm.com/contractors/fabric-maintenance#faq',
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
            { figure: 'NVQ & CSCS Assured', label: 'Competence Standard', detail: 'Trade skill verified' },
            { figure: 'Merit-Based', label: 'Work Allocation', detail: 'Audits & remedials' },
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
                What Commercial FM Fabric Maintenance Involves
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial building fabric maintenance is a specialized facilities discipline dedicated to preserving structural asset longevity, compliance standards, and flawless tenant presentation across working commercial estates:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <DoorClosed className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Statutory Fire Door Auditing &amp; Remedials</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executing planned inspections and compliance remedials to BS 8214 and BS 9999 standards under the Fire Safety Act 2021. Rectifying perimeter gaps (3mm–4mm tolerance), replacing damaged intumescent strips and cold smoke seals, rebating certified fire-rated ironmongery, and adjusting overhead door closers to guarantee positive self-latching against air pressure differentials.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Suspended Ceilings &amp; Acoustic Partitioning</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Installing and repairing commercial lay-in grid ceiling systems (SAS, Armstrong, Zentia), concealed grid tiles, and demountable acoustic partition walls. Resolving plenum void deflection, realigning damaged perimeter trims, replacing moisture-stained acoustic mineral tiles, and installing certified fire and smoke barrier baffles above ceiling lines.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Hammer className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Joinery, Ironmongery &amp; Access Panels</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Heavy-duty commercial carpentry repairs across tenant suites, lift reveals, and washroom cubicles. Installing high-frequency commercial ironmongery, concealed digital locksets, panic escape push-bars to BS EN 1125, acoustic boxing around service risers, and certified metal fire-rated access panels for building engineering access.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Industrial Doors, Roller Shutters &amp; Dock Levellers</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Maintenance and defect remediation for motorized commercial roller shutters, sectional overhead doors, high-speed insulated spiral doors, and loading dock leveller lip plates in accordance with DHF guidelines and BS EN 12604, verifying safety brake integrity and anti-drop mechanisms across logistics facilities.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Paintbrush className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Plasterwork, Drylining &amp; Commercial Re-Decoration</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executing rapid drywall patch repairs, impact-resistant corner bead replacement, joint taping, and durable commercial emulsion repainting across communal corridors, lift lobbies, and stairwells. Work is scheduled with low-VOC paints and dust-suppressed sanding to prevent tenant disruption in occupied office environments.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Safety Glazing &amp; Minor Building Repairs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Replacing cracked toughened or laminated architectural glass units to BS EN 12600 impact standards, applying manifestation decals, renewing mastic expansion joints on exterior facades, executing minor masonry pointing, and repairing floor tile trip hazards across commercial circulation concourses.
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
                Building fabric works require disciplined tradecraft, dust control, and site protection tailored to diverse commercial property portfolios:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Grade-A Corporate Offices</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Multi-storey office towers requiring out-of-hours joinery, acoustic door drop-seals, suspended ceiling adjustments, and French polishing of reception architectural timber finishes.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <DoorClosed className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail Shopping Centres &amp; Commercial Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Public concourse terrazzo tile repairs, impact protection crash rails on service corridors, automated entrance door brush seals, and emergency security shutter repairs.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Logistics Hubs &amp; Industrial Warehouses</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Sectional loading bay door repairs, forklift impact protection bollards, metal cladding sheet replacement, and concrete expansion joint mastic resealing, often working alongside our <Link href="/contractors/roofing" className="text-[#EA580C] underline font-medium">commercial roofing contractors</Link>.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Educational &amp; Healthcare Estates</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Heavy-traffic fire door maintenance, anti-ligature door furniture in clinical areas, hygienic PVC wall cladding (e.g. Altro Whiterock), and enhanced DBS-cleared attending operatives.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Paintbrush className="w-4 h-4 text-rose-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Mixed-Use Developments</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Communal residential block fire doors, bin store metal security gates, car park vehicular barriers, and common area redecoration managed under leasehold service charge schedules.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Tenanted Business Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Managing landlord common areas, dividing partitions, tenant dilapidation remedials, and external perimeter repairs, interfacing cleanly with our <Link href="/contractors/electrical" className="text-[#EA580C] underline font-medium">commercial electrical contractors</Link> for integrated containment.
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
                Planned Fabric Condition Audits vs Reactive Building Repairs
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities management building fabric care combines proactive condition surveys with swift reactive repairs to protect life safety, security, and estate value.
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
                    <p className="text-slate-500 text-[11px] font-mono">Bi-Annual / Annual • Condition Auditing • SFG20 Standards</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Scheduled systematically in accordance with <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 building fabric standards</Link> to identify progressive wear, maintain statutory fire compartmentation, and eliminate minor defects before they escalate.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Six-monthly statutory fire door inspections, measuring perimeter gaps, checking intumescent seal adhesion, and testing self-closing forces.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Annual building fabric visual audits assessing suspended ceilings, external cladding mastic joints, rooflights, and perimeter ironmongery.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Planned maintenance on industrial roller shutters, overhead sectional doors, and loading dock equipment in compliance with DHF standards.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <AlertTriangle className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Reactive Fabric Repairs</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Broken Closers • Glazing Failures • Security Breaches</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Triggered by smashed entrance glazing, jammed emergency fire escape doors, failed roller shutters blocking logistics dispatch, or damaged ceilings following overhead leaks.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Urgent reactive attendance aligned with individual work order priority targets to secure premises, board glazing, or make building fabric safe.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Rapid sourcing and replacement of commercial ironmongery, emergency panic bolts, and heavy-duty floor spring closers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Comprehensive photographic close-out documentation evidencing completed repairs and compliance restoration before invoicing.</span>
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
                Facilities managers, building surveyors, and institutional landlords evaluate building fabric contractors on tradecraft precision, regulatory compliance, and workplace cleanliness:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-light">
              <div className="space-y-6">
                <div className="border-l-2 border-[#EA580C] pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-[#EA580C] uppercase tracking-wider">
                    SPECIFICATION 01 // STATUTORY COMPARTMENTATION
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Fire Door Regulatory Precision</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Fire door maintenance and compliance remedials must strictly align with BS 8214 standards. For compliant installations, perimeter gaps typically sit within 3mm–4mm tolerances, bottom undercuts within 8mm–10mm, and all replaced hardware must be CE/UKCA marked and fire-rated for the specific door leaf core.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 02 // DUST & NOISE CONTROL
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Occupied Office Discipline</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Noisy operations (drilling, timber cutting, drywall routing) are typically scheduled during out-of-hours windows in occupied buildings. Contractors are expected to deploy dust extraction tools and floor protection sheeting to ensure clean morning handovers.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 03 // TRADE BOUNDARY INTEGRITY
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">General Fabric vs Specialist Trade Demarcation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    General fabric maintenance does not automatically confer specialist competence. Where works involve statutory fire-safety compartmentation, complex industrial doors, high-risk safety glazing, or building structures, commercial clients require verified trade credentials, specialist certification (such as FDIS or DHF), or qualified trade specialists. Specialist electrical, mechanical, or gas work must always be referred to dedicated licensed disciplines.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 04 // ASSET CLOSE-OUT
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Photographic Close-Out Documentation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Capturing high-resolution before/after photographs of repaired door leaves, replaced acoustic tiles, fixed plasterwork, and rectified ironmongery. Compliance officers verify photographic packs before approving invoice payments.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 05 // SAFETY & PERMITS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Working at Height &amp; Hot Works Permits</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Adherence to the Work at Height Regulations 2005 when accessing high ceilings or loading bay doors using podium steps, scaffold towers, or MEWPs. Operating under strict hot works permits whenever heat guns or welding equipment are deployed.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 06 // FINANCIAL PROCESS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Purchase Order Discipline</h3>
                  <p className="text-slate-600 leading-relaxed">
                    All remedial jobs and scheduled audit visits must be pre-authorised against official Purchase Orders. Invoices must clearly itemize labour hours, ironmongery, and materials to ensure automated commercial accounts verification.
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
                Building Fabric Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial facilities managers and building surveyors evaluate fabric contractors across insurance limits, trade accreditations, and health and safety schemes:
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
                    <span><strong>Public Liability:</strong> £5,000,000 network admission baseline; £10,000,000 frequently specified by clients for major commercial portfolios.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory requirement for all workforce personnel.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Height &amp; Hot Works Endorsement:</strong> Policy coverage extending to access equipment and thermal tooling where applicable.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Trade Accreditations &amp; Schemes</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Trade registrations commonly recognized across commercial building fabric specifications:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Trade Qualifications:</strong> NVQ Level 2/3 in Carpentry &amp; Joinery, Interior Systems, or Plastering.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Fire Door Schemes:</strong> FDIS (Fire Door Inspection Scheme) or BM TRADA Q-Mark registration commonly required for statutory fire-stopping work.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>DHF Certification:</strong> Door &amp; Hardware Federation credentials for industrial roller shutters and powered doors where relevant.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Safety, Cards &amp; Site Standards</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Health, safety, and competency standards typically reviewed during onboarding or specified by clients:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>SSIP Accreditation:</strong> CHAS, SafeContractor, or Constructionline health &amp; safety approval commonly expected.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>CSCS Skilled Cards:</strong> Blue or Gold Skilled Worker CSCS cards verifying operative health &amp; safety training.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>IPAF &amp; PASMA:</strong> Operator licences for mobile scissor lifts, cherry pickers, and mobile scaffold towers where working at height is required.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. WHY COMMERCIAL FABRIC CONTRACTORS NEED STRONG RAMS & DOCUMENTATION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">COMPLIANCE &amp; SAFETY RIGOUR</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Why Commercial Fabric Maintenance Contractors Need Robust RAMS
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Working in occupied commercial premises, modifying fire compartments, and working at height on suspended ceilings carry substantial legal liabilities. Managing agents and facilities directors require auditable risk assessments and method statements before access is permitted.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <FileCheck className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Task-Specific Method Statements &amp; Dust Controls</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Fire Compartment Integrity • Working at Height • Dust Suppression</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Every building fabric intervention on commercial property requires clear step-by-step method statements. Whether adjusting fire doors or repairing a suspended ceiling grid, facilities teams inspect the sequence of work before issuing permits. Review our comprehensive guide on <Link href="/contractor-resources/rams/what-are-rams" className="text-[#EA580C] underline font-medium">what commercial RAMS are</Link>.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Clear method statements for fire door repairs detailing component certification and retention of fire resistance ratings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Safe systems of work for ceiling void access, specifying PASMA-assembled mobile towers, fall-arrest harnesses, and step-ladder rules.</span>
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
                    <h3 className="text-lg font-semibold text-slate-900">Risk Assessment Matrices &amp; Public Safety</h3>
                    <p className="text-slate-500 text-[11px] font-mono">5x5 Risk Evaluation • Tenant Separation • Cordoning Standards</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Commercial building duty holders and managing agents expect rigorous risk evaluation for contractor activities in occupied spaces. Risk assessments must evaluate noise, airborne dust, sharp tools, and pedestrian segregation in occupied environments.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Comprehensive hazard evaluation covering power tool vibration, eye protection from airborne particulates, and manual handling of heavy doors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Full compliance with <Link href="/contractor-resources/risk-assessments/what-is-a-risk-assessment" className="text-[#EA580C] underline font-medium">commercial risk assessment standards</Link>, documenting barrier cordoning around active work areas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Documented control measures for smoke detector bag-off procedures with client facilities security during dusty plastering operations.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Professional Responsibility Note */}
            <div className="rounded-sm border border-slate-200 bg-[#FAFAF8] p-5 text-xs text-slate-500 font-light leading-relaxed max-w-4xl mx-auto text-center">
              <strong className="text-slate-800 font-semibold">Professional Competency Notice:</strong> Site-specific RAMS, method statements, and control measures must always be prepared, reviewed, and signed off by the contractor&apos;s own qualified competent persons to reflect the specific site, task, equipment, and operational risks.
            </div>
          </div>
        </section>

        {/* 10. HOW THE CONTRACTOR NETWORK WORKS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <ContractorStepByStep
              eyebrow="ONBOARDING ROADMAP"
              title="How EntireFM's Contractor Network Works"
              subtitle="A clear, structured, and transparent process for putting your commercial building fabric business forward."
              steps={FABRIC_STEPS}
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
                Why Building Fabric Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network positions your carpentry, joinery, and building fabric firm as an approved supplier for commercial facilities management requirements:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Frameworks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business directly in front of commercial facilities management requirements across offices, retail destinations, and industrial hubs.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage CSCS cards, FDIS / DHF certificates, and insurance in one secure system with automated renewal alerts.
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
                  Clear Purchase Orders, structured job instructions, and straightforward electronic invoicing processes aligned with commercial finance teams.
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
              title="Essential Resources for Fabric Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, fire door compliance, and statutory PPM standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 13. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Fabric Maintenance Contractor FAQs"
              subtitle="Answers to common questions about trade qualifications, fire door standards, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 14. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Fabric Maintenance Business Forward for Commercial FM Work"
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
