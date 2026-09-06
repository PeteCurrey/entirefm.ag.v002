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
  Droplets,
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
  Thermometer,
  Gauge,
  Sparkles,
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/plumbing'];

export const metadata: Metadata = generateRouteMetadata('/contractors/plumbing', {
  title: config.metaTitle,
  description: config.metaDescription,
});

const PLUMBING_STEPS = [
  {
    step: 1,
    title: 'Apply Online',
    description:
      'Put your business forward via our contractor intake with company registration, operating territories, and primary water service specialisms.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your WaterSafe/WRAS approvals, unvented G3 certificates, Legionella awareness cards, and Public Liability insurance.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Declare your service radius, reactive emergency availability, and specialist testing kits (RPZ test rigs, digital immersion probes).',
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
      'EntireFM conducts due diligence on your plumbing qualifications, thermometer calibration certs, and health & safety documentation.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved contractors enter our active supplier network for merit-based consideration across scheduled L8 PPM packages and reactive plumbing call-outs.',
    badge: 'Step 6',
  },
];

export default function PlumbingContractorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://www.entirefm.com/contractors/plumbing#service',
        name: 'Commercial Plumbing Contractor Network',
        serviceType: 'Facilities Management Commercial Plumbing Contractor Onboarding & Work Allocation',
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
        '@id': 'https://www.entirefm.com/contractors/plumbing#breadcrumb',
        itemListElement: config.breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `https://www.entirefm.com${crumb.url}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.entirefm.com/contractors/plumbing#faq',
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
            { figure: 'ACOP L8 & WaterSafe', label: 'Statutory Standard', detail: 'Water hygiene audited' },
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

        {/* 3. WHAT COMMERCIAL FM PLUMBING INVOLVES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ORDER PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM Plumbing Work Can Involve
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial water services involve strict compliance with the Water Supply (Water Fittings) Regulations 1999, ACOP L8 Legionella prevention, and heavy-duty commercial washroom demands:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">ACOP L8 Statutory Water Temperature Monitoring</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Monthly sentinel point temperature testing on domestic hot and cold water systems (hot &gt;50°C within 1 minute, cold &lt;20°C within 2 minutes), recording calibrated digital immersion probe data into statutory water logbooks, auditing calorifier flow/returns, and identifying uninsulated pipe runs.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">TMV Servicing &amp; Failsafe Overhauls</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Annual strip-down, chemical descaling, and rapid failsafe cold-failure shut-off testing of commercial Thermostatic Mixing Valves (TMV2/TMV3 schemes) across corporate washrooms, disabled facilities, and healthcare suites to guarantee anti-scalding protection and precise mixed delivery temperatures.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Cold Water Booster Sets &amp; Break Tanks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Quarterly preventative maintenance on multi-pump variable speed potable booster sets, air gap compliance verification (Type AB/AF backflow protection), pressure vessel membrane pre-charge checks, and CWST tank inspection for screened overflows, vermin seals, and thermal insulation (often interfacing with our <Link href="/contractors/mechanical" className="text-[#EA580C] underline font-medium">commercial mechanical contractors</Link> for central plantroom integration).
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Unvented Cylinders &amp; Calorifiers</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Annual statutory G3 Building Regulation maintenance on commercial unvented hot water storage systems (&gt;500L) and indirect plate heat exchangers. Testing temperature and pressure relief valves (T&amp;PRVs), expansion vessels, and tundish discharge lines for unhindered gravity drainage.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Backflow Prevention &amp; RPZ Valve Testing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Annual statutory testing and calibration of Reduced Pressure Zone (RPZ) valves protecting potable supplies against Fluid Category 4 backflow contamination in commercial kitchens, printing plants, and laboratories, issuing WRAS-approved compliance certificates.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Flame className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Emergency Leak Isolation &amp; Pipe Freezing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  24/7 reactive containment of major escape-of-water incidents on high-pressure risers and distribution loops. Deploying liquid nitrogen or CO2 pipe freezing kits to execute localized valve replacements and repairs without draining entire multi-storey building water systems.
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
                Where Commercial Plumbing Contractors Operate
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial plumbing infrastructure requires specialized equipment and safety discipline tailored to diverse client environments:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Storey Corporate Offices</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-rise vertical water risers, PRVs, tenant tea points, commercial washroom blocks, and hot water recirculation loops. Work demands strict out-of-hours scheduled isolations and water sampling to prevent disruption to trading operations.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Hospitality &amp; Leisure Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Commercial kitchens, grease dosing systems, unvented shower blocks, glasswashers, and high-volume hot water demand. Contractors manage high-temperature sanitisation requirements and rapid fault response on booster set failures.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Industrial &amp; Logistics Hubs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Large footprint warehouse welfare facilities, emergency eye wash stations, safety deluge showers, and borehole water systems. Requirements involve servicing high-pressure ring mains and backflow prevention valves across broad estates.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Educational &amp; Healthcare Sites</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Strict legionella monitoring regimes, TMV failsafe compliance, clinical non-concussive taps, and dead-leg removal programmes. Contractors must operate around vulnerable patients or students with enhanced DBS-cleared teams.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-rose-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Residential Block Portfolios</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-density residential buildings, student halls, and build-to-rent properties requiring central plantroom plate heat exchangers, unvented domestic hot water cylinders, and communal cold water storage cistern inspections.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Tenanted Commercial Estates</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Business parks where water supplies cross multiple tenant leases. Requires localized sub-metering maintenance, check valve verification, and clear demarcation of landlord vs demised plumbing infrastructure.
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
                Planned Water Hygiene PPM vs Reactive Plumbing Repairs
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Plumbing within facilities management balances contractual water hygiene schedules with rapid reactive emergency repairs.
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
                    <p className="text-slate-500 text-[11px] font-mono">Monthly / Quarterly • ACOP L8 Compliance • SFG20 Standards</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Scheduled systematically according to <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 maintenance standards</Link> and HSE HSG274 guidance to protect building occupants from waterborne pathogens, ensure drinking water safety, and preserve mechanical asset integrity.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Monthly statutory temperature logging of sentinel hot and cold outlets, calorifier flow/returns, and incoming mains supplies.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Quarterly chemical descaling, disinfection, and micro-biological inspection of shower heads, flexible hoses, and spray taps.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Annual unvented cylinder G3 safety testing, expansion vessel pre-charge pressure verification, and calorifier inspection for sediment buildup.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <Flame className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Reactive Plumbing Emergencies</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Escape of Water • Washroom Closures • High-Liability Scenarios</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Triggered by burst mains water pipes, failed flexible tap connectors in ceiling voids, overflowing cisterns flooding server rooms, or complete loss of domestic water pressure to high-occupancy commercial estates.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Urgent reactive attendance aligned with work order priority targets to isolate leaking circuits, contain water escape, and minimize structural building fabric damage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Rapid deployment of liquid nitrogen or electrical pipe-freezing rigs to execute localized isolations without draining multi-storey building risers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Definitive repairs with WRAS-approved commercial components, full hydraulic pressure testing, and digital photographic completion sign-off.</span>
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
                What Commercial FM Clients Expect from Plumbing Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities managers, compliance auditors, and commercial managing agents evaluate plumbing contractors on technical competence, water hygiene rigour, and operational discipline:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-light">
              <div className="space-y-6">
                <div className="border-l-2 border-[#EA580C] pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-[#EA580C] uppercase tracking-wider">
                    SPECIFICATION 01 // WATER HYGIENE ACCURACY
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">ACOP L8 Compliance Precision</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Recording exact water temperatures using calibrated digital immersion thermometers, identifying dead-legs or little-used outlets, and immediately reporting non-compliant temperature readings (e.g. cold water warming above 20°C or hot water below 50°C) to the facilities desk.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 02 // NETWORK CONTROL
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Controlled Isolation Protocols</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Executing planned water isolations with prior written notice to avoid interrupting commercial operations. Using pipe freezing tools where isolation valves fail, and ensuring safe refilling without water hammer, pressure surges, or air locks.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 03 // STATUTORY MATERIALS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">WRAS Approved Materials Only</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Strict adherence to Water Supply (Water Fittings) Regulations 1999. All installed valves, fittings, copper, and barrier pipework must be WRAS approved and suitably rated for commercial working pressures (up to 16 bar for boosted distribution).
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 04 // ASSET CLOSE-OUT
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Photographic &amp; Asset Data</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Capturing timestamped before/after photographs of repaired pipework, descaled TMVs, tested booster sets, and unvented cylinder data plates. Facilities managers verify digital photographic close-out packages before signing off work order payments.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 05 // FLAME-FREE DISCIPLINE
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Hot Works &amp; Soldering Safety</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Operating under strict hot works permit controls when soldering copper pipework. Utilizing press-fit crimp connections (e.g. Geberit Mapress / Viega) where flame-free commercial requirements apply, avoiding open flame permits in occupied commercial buildings.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 06 // FINANCIAL PROCESS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Purchase Order Discipline</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Ensuring all work orders and replacement parts (booster pumps, expansion vessels, PRVs, unvented cylinders) are pre-authorised with clear Purchase Orders, enabling rapid invoice verification and prompt automated payment.
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
                Plumbing Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial facilities managers and water hygiene auditors evaluate contractors across statutory health and safety compliance, insurance cover, and scheme credentials:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-[#EA580C] font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Insurance Cover Expectations</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Commercial clients and managing agents set insurance criteria based on escape-of-water exposure and building value:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Public Liability:</strong> Minimum £5,000,000 indemnity commonly required; £10,000,000 frequently specified for high-value commercial estates.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory minimum for all contractors employing workforce personnel.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Water Damage Endorsement:</strong> Adequate policy coverage for escape-of-water liability across commercial tenancies.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Scheme &amp; Trade Accreditations</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Trade registrations and qualifications commonly expected across commercial water services specifications:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>WaterSafe / WRAS:</strong> Approved Contractor scheme registration (WIAPS, APHC, or CIPHE).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Unvented G3:</strong> BPEC or City &amp; Guilds Unvented Hot Water qualification for commercial pressurized vessels.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Core Qualifications:</strong> NVQ Level 2/3 in Plumbing &amp; Heating or JIB-PMES Blue/Gold Card.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Hygiene, Safety &amp; Calibration Standards</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Safety schemes and audit standards expected during commercial contractor onboarding:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>SSIP Accreditation:</strong> CHAS, SafeContractor, or Constructionline health &amp; safety accreditation.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Legionella Awareness:</strong> Certified City &amp; Guilds / BOHS Legionella water hygiene awareness training.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Probe Calibration:</strong> Annual calibration certificates for digital immersion temperature probes.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. WHY COMMERCIAL PLUMBING CONTRACTORS NEED STRONG RAMS & WATER HYGIENE DOCUMENTATION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WATER HYGIENE RIGOUR</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Why Commercial Plumbing Contractors Need Robust RAMS
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Escape of water and waterborne pathogens (specifically Legionella pneumophila) represent two of the highest-liability operational risks for commercial property owners and facilities directors. Generic domestic paperwork is immediately rejected by corporate compliance desks, insurer auditors, and FM technical teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <FileCheck className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Task-Specific Plumbing RAMS &amp; Isolations</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Isolation Sequence • Pipe Freezing Safety • Hot Works Controls</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Every commercial plumbing task on complex estates requires task-specific method statements. Whether tapping into a high-pressure cold water booster riser or replacing a commercial calorifier, facilities teams inspect the sequence of work before issuing access permits. Review our comprehensive guide on <Link href="/contractor-resources/rams/what-are-rams" className="text-[#EA580C] underline font-medium">what commercial RAMS are</Link>.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Clear isolation sequences identifying boundary valves, drainage points, and pressure relief paths to prevent accidental hydraulic shock or water escape.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Formal method statements for cryogenic pipe-freezing (liquid nitrogen or CO2 freeze jackets) detailing freeze plug integrity checks, monitoring durations, and backup isolations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Hot works controls complying with insurer joint codes of practice, or method statements detailing flame-free press-fit crimping (M-press / V-profile) to eliminate fire risks.</span>
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
                    <h3 className="text-lg font-semibold text-slate-900">ACOP L8 Risk Assessments &amp; Water Hygiene</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Legionella Control • Temperature Cascades • BS 8558 Disinfection</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Under the Health and Safety at Work etc. Act 1974 and the Control of Substances Hazardous to Health (COSHH) Regulations, duty holders are legally bound to manage Legionella risks. Commercial plumbing contractors must provide defensible risk documentation and auditable sampling protocols.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>5x5 matrix risk assessments identifying stagnation hazards, dead-legs, thermal gain across pipe runs, and vulnerable building occupants (e.g. healthcare and care estates).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Full compliance with <Link href="/contractor-resources/risk-assessments/what-is-a-risk-assessment" className="text-[#EA580C] underline font-medium">commercial risk assessment standards</Link>, documenting calibrated probe serial numbers and UKAS-accredited laboratory chains of custody for water samples.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Written disinfection and flushing procedures in accordance with BS 8558:2015 and ACOP L8 following any invasive pipework alterations, calorifier descaling, or tank refurbishment.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Professional Responsibility Note */}
            <div className="rounded-sm border border-slate-200 bg-[#FAFAF8] p-5 text-xs text-slate-500 font-light leading-relaxed max-w-4xl mx-auto text-center">
              <strong className="text-slate-800 font-semibold">Professional Competency Notice:</strong> Site-specific water isolation method statements, Legionella risk assessments, and disinfection procedures must always be compiled and signed off by the contractor's own qualified competent persons in accordance with ACOP L8, HSG274, and Water Regulations.
            </div>
          </div>
        </section>

        {/* 10. HOW THE CONTRACTOR NETWORK WORKS */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <ContractorStepByStep
              eyebrow="ONBOARDING ROADMAP"
              title="How EntireFM's Contractor Network Works"
              subtitle="A clear, structured, and transparent process for putting your commercial plumbing business forward."
              steps={PLUMBING_STEPS}
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
                Why Plumbing Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network positions your plumbing business as an approved supplier for commercial facilities management requirements:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Frameworks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business directly in front of commercial facilities management requirements across corporate, industrial, and public estates.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage WaterSafe certificates, G3 unvented cards, and insurance in one secure system with automated renewal alerts.
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
              title="Essential Resources for Plumbing Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, water hygiene regulations, and statutory PPM standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 12. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Plumbing Contractor FAQs"
              subtitle="Answers to common questions about water hygiene, qualifications, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 13. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Plumbing Business Forward for Commercial FM Work"
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
