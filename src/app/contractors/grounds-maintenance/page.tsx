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
  Trees,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Award,
  Layers,
  Wrench,
  Scissors,
  Shovel,
  AlertTriangle,
  Truck,
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/grounds-maintenance'];

export const metadata: Metadata = generateRouteMetadata('/contractors/grounds-maintenance', {
  title: config.metaTitle,
  description: config.metaDescription,
});

const GROUNDS_STEPS = [
  {
    step: 1,
    title: 'Apply Online',
    description:
      'Submit your company profile, machinery inventory (commercial ride-on mowers, tractor flails, gritters), and regional operating territories.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your NPTC PA1/PA6 pesticide certificates (where chemical spraying is offered), relevant arborist credentials, Upper Tier Waste Carrier Licence, and Public Liability insurance.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Specify your seasonal maintenance capacity, automated winter gritting readiness, and specialist machinery (flail mowers, tree chippers).',
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
      'EntireFM conducts due diligence on your relevant trade certifications, machinery maintenance logs, and site health & safety documentation.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved contractors join our active supplier panel for merit-based consideration across seasonal grounds packages and reactive storm attendance.',
    badge: 'Step 6',
  },
];

export default function GroundsMaintenanceContractorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://www.entirefm.com/contractors/grounds-maintenance#service',
        name: 'Commercial Grounds Maintenance Contractor Network',
        serviceType: 'Facilities Management Commercial Grounds Maintenance Contractor Onboarding & Contract Allocation',
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
        '@id': 'https://www.entirefm.com/contractors/grounds-maintenance#breadcrumb',
        itemListElement: config.breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `https://www.entirefm.com${crumb.url}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.entirefm.com/contractors/grounds-maintenance#faq',
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
            { figure: 'NPTC & LANTRA', label: 'Competence Standard', detail: 'Plant & safety verified' },
            { figure: 'Merit-Based', label: 'Work Allocation', detail: 'Seasonal & winter scopes' },
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

        {/* 3. WHAT COMMERCIAL FM GROUNDS MAINTENANCE INVOLVES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ORDER PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM Grounds Maintenance Involves
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial grounds maintenance demands industrial machinery, rigorous chemical safety under pesticide legislation, and seasonal agility across expansive commercial business estates:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Trees className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Grass Cutting &amp; Large-Deck Mowing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executing planned 10 to 14-day rotational mowing across corporate campuses and logistics parks using commercial zero-turn ride-on mowers (60&quot;+ mulching decks) and tractor-mounted rotary flails. Precision strimming around kerb lines, street lighting columns, and perimeter fencing without turf scalping.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Shrub Pruning, Hedging &amp; Perimeter Sights</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Scheduled mechanical trimming of formal ornamental hedging, native perimeter boundary hedgerows, and decorative shrub beds. Maintaining sightlines at road junctions, barrier access gates, and CCTV surveillance camera arcs in compliance with Wildlife and Countryside Act bird nesting restrictions.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Shovel className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">NPTC Chemical Weed Control &amp; Invasive Species</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Targeted chemical herbicide application across tarmac car parks, block paving, and gravel margins by NPTC PA1/PA6 certified operatives. Managing invasive weed species (Japanese Knotweed, Giant Hogweed) under strict environmental legislation with traceable application logbooks.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Tree Hazard Inspections &amp; Arboricultural Works</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Conducting tree safety surveys in line with BS 5837 and Quantified Tree Risk Assessment (QTRA) methodologies. NPTC CS30/31 certified arborists executing crown lifting over lorry access roads, deadwood removal over pedestrian footways, and 24/7 storm damage emergency limb clearance.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">SUDS Attenuation Ponds &amp; Swale Management</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Ecological maintenance of sustainable urban drainage systems (SUDS), stormwater retention basins, and reedbed swales. Silt clearance, reed cutting, headwall grating unblocking, and aquatic weed management to ensure peak hydraulic performance during heavy storm rainfall events.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Truck className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Winter Gritting &amp; Automated Snow Clearance</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Automated deployment triggered by Met Office Road Surface Temperature (RST &le; 0&deg;C) forecasts. Deploying 3.5t pick-up and tractor-mounted salt spreaders and snow ploughs across commercial circulation roads, HGV service yards, and pedestrian walkways with automated GPS tracking.
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
                Where Commercial Grounds Contractors Operate
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial grounds care requires large-scale plant, traffic management, and safety protocols tailored to varied estate environments:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Corporate Headquarters &amp; Science Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-profile architectural frontage, formal lawns, sensory employee gardens, and ornamental water features demanding immaculate presentation and quiet battery-electric machinery during core office hours.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Truck className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Logistics &amp; Distribution Hubs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-acreage perimeter fencing, bund grass management, stormwater attenuation swales, and heavy-duty winter gritting across constant 24/7 heavy goods vehicle circulation rings.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail Parks &amp; Shopping Centres</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Extensive customer car park shrub islands, pedestrian walkways, litter collection, and early morning proactive salt spreading before retail shoppers arrive on site.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Educational &amp; Healthcare Estates</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Campus grounds, sports fields, emergency hospital ambulance access routes, and non-toxic ecological weed management requiring enhanced DBS-cleared operative teams.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Trees className="w-4 h-4 text-rose-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Industrial Estates &amp; Manufacturing Plants</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Rough grass bank flailing, security fence clear-zones, scrub clearance, and boundary tree line management interfacing safely with busy fork-lift loading operations.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Tenanted Commercial Business Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Extensive shared road verges, entrance roundabouts, seasonal bedding displays, and autumn leaf clearance, coordinating closely with our <Link href="/contractors/cleaning" className="text-[#EA580C] underline font-medium">commercial cleaning contractors</Link> for total site upkeep.
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
                Scheduled Grounds PPM vs Reactive Storm &amp; Frost Care
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities management grounds maintenance balances structured seasonal landscaping visits with responsive reactive winter weather and storm services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Planned Seasonal Maintenance (PPM)</h3>
                    <p className="text-slate-500 text-[11px] font-mono">14-Day Summer Visits • Autumn Leaf Clearance • SFG20 Standards</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Programmed systematically in accordance with <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 grounds care standards</Link> to ensure aesthetic excellence, healthy turf, and clear pedestrian sightlines throughout all seasons.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Rotational summer visits (March–October) covering grass mowing, edging, shrub bed weeding, and pruning.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Autumn leaf clearing using commercial blowers and vacuum sweepers to eliminate slip hazards across pedestrian paths.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Bi-annual statutory tree hazard inspections and preventative pruning by certified arborists.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <AlertTriangle className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Reactive Storm &amp; Winter Attendance</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Fallen Trees • Road Gritting • Sub-Zero Dispatches</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Triggered by gale-force wind tree damage blocking access, flash flood silt blockages, or automated road temperature alerts predicting freezing conditions.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Urgent reactive attendance aligned with individual work order priority targets to clear dangerous tree limbs and reopen access.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Automated evening or early morning gritting dispatches triggered by Met Office Road Surface Temperature thresholds.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Digital GPS tracking logs and photographic verification confirming application rates and time of spread.</span>
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
                What Commercial FM Clients Expect from Grounds Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities managers, estate surveyors, and managing agents evaluate commercial grounds maintenance contractors on equipment capacity, chemical safety compliance, and disciplined site delivery:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-light">
              <div className="space-y-6">
                <div className="border-l-2 border-[#EA580C] pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-[#EA580C] uppercase tracking-wider">
                    SPECIFICATION 01 // CHEMICAL SAFETY
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">NPTC Herbicide Certification &amp; Traceability</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Where chemical weed spraying is included in the scope of service, commercial clients require City &amp; Guilds NPTC PA1 (Foundation) and PA6 (Handheld Applicator) certificates. Contractors must maintain detailed COSHH spraying records documenting chemical batch numbers, dilution rates, target weeds, wind speed, and ambient temperature.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 02 // MACHINERY GUARDS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Plant Safety &amp; Stone Deflector Guards</h3>
                  <p className="text-slate-600 leading-relaxed">
                    All commercial ride-on mowers, flails, and strimmers must be equipped with intact manufacturer stone deflector guards and emergency cut-off switches. Operatives must establish pedestrian exclusion zones when operating adjacent to parked tenant vehicles or public walkways.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 03 // STATUTORY DISPOSAL
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Green Waste Disposal Compliance</h3>
                  <p className="text-slate-600 leading-relaxed">
                    All grass arisings, hedge clippings, and timber removed from commercial estates must be transported under an active Environment Agency Upper Tier Waste Carrier Licence and tipped at licensed commercial composting or biomass recycling facilities with traceable waste transfer notes.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 04 // ROADSIDE CONTROLS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Chapter 8 Traffic Management Livery</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Commercial grounds maintenance vehicles and towed trailers operating on estate roadways must feature Chapter 8 reflective chevron livery, roof-mounted amber flashing beacons, and high-visibility PPE for all attending operatives.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 05 // WEATHER ACTIVATION PROTOCOLS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Winter Weather Activation &amp; Telemetry Data</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Winter maintenance contractors must demonstrate reliable activation protocols triggered by Road Surface Temperature forecasts. Spreading operations are backed by timestamped GPS logs, salt application density records (g/m&sup2;), and digital completion confirmations where specified.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 06 // FINANCIAL PROCESS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Purchase Order Discipline</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Clear invoicing mapped to seasonal contract Purchase Orders, with distinct line items for scheduled grounds visits, reactive storm call-outs, and winter gritting activations to enable automated commercial accounts processing.
                  </p>
                </div>
              </div>
            </div>

            {/* Specialist Demarcation Note */}
            <div className="rounded-sm border border-slate-200 bg-[#FAFAF8] p-5 text-xs text-slate-600 font-light leading-relaxed max-w-4xl mx-auto text-center space-y-1.5">
              <p className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
                Professional Scope Demarcation
              </p>
              <p>
                General grounds maintenance (rotational mowing, strimming, hedge cutting, and seasonal bed care) does not automatically qualify contractors for specialist operations. Chemical weed spraying requires certified NPTC PA1/PA6 operatives, arboricultural tree works require qualified NPTC CS30/31 personnel working to BS 3998 standards, and winter gritting requires calibrated spreading machinery and weather activation telemetry.
              </p>
            </div>
          </div>
        </section>

        {/* 8. COMPLIANCE & COMPETENCE FRAMEWORK */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">STANDARDS &amp; ACCREDITATION</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Grounds Care Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial facilities managers and landscape auditors evaluate grounds contractors across statutory health and safety credentials, insurance cover, and equipment qualifications:
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
                    <span><strong>Public Liability:</strong> £5,000,000 network admission baseline; £10,000,000 frequently specified by clients for major business parks and logistics sites.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory requirement for all workforce personnel.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Arboricultural &amp; Plant Endorsement:</strong> Specific policy extension for commercial plant, roadside operations, and tree works where applicable.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Trade Licences &amp; Scheme Memberships</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Certifications commonly recognized across commercial grounds maintenance frameworks:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>NPTC PA1/PA6:</strong> City &amp; Guilds pesticide spraying qualifications required where commercial weed management is undertaken.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>BALI / Association:</strong> British Association of Landscape Industries membership commonly preferred.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Waste Licence:</strong> Upper Tier Environment Agency Waste Carrier registration for green waste transport.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Safety, Machinery &amp; Arborist Cards</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Safety schemes and operative qualifications typically reviewed during onboarding or specified by clients:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>SSIP Accreditation:</strong> CHAS, SafeContractor, or Constructionline health &amp; safety approval commonly expected.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>LANTRA Awards:</strong> Certified operator competence for commercial brushcutters, mowers, and winter gritters.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>NPTC Chainsaw (CS30/31):</strong> Certified arborist competence for tree felling, cross-cutting, and maintenance where tree care is provided.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. WHY COMMERCIAL GROUNDS CONTRACTORS NEED STRONG RAMS & DOCUMENTATION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">SAFETY &amp; ENVIRONMENTAL RIGOUR</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Why Commercial Grounds Contractors Need Robust RAMS
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Operating heavy rotary mowers near parked vehicles, handling regulated chemical herbicides, and working roadside on commercial parks carry significant liability. Managing agents require site-specific RAMS before works proceed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <FileCheck className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Task-Specific Method Statements &amp; Machinery Controls</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Ride-On Mowing • Herbicide Spraying • Tree Felling</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Every commercial grounds contract requires comprehensive method statements detailing pedestrian segregation, stone-chip deflection controls, and chemical mixing sequences. Review our comprehensive guide on <Link href="/contractor-resources/rams/what-are-rams" className="text-[#EA580C] underline font-medium">what commercial RAMS are</Link>.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Clear method statements for zero-turn mowing, specifying slope stability limits (&le; 15&deg;), buffer zones, and ROPS roll-bar use.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Safe systems of work for chemical spraying, detailing spray drift mitigation, buffer zones near watercourses, and public warning notices.</span>
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
                    <h3 className="text-lg font-semibold text-slate-900">Risk Assessment Matrices &amp; Vehicle Interfaces</h3>
                    <p className="text-slate-500 text-[11px] font-mono">5x5 Risk Evaluation • Flying Debris • Roadway Cordoning</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Commercial estate owners and managing agents expect comprehensive risk evaluation for contractor activities on occupied estates. Risk assessments must evaluate traffic interfaces, flying stones, and chemical exposure risks.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>5x5 risk matrix covering stone throw risks to cars and glazing, hand-arm vibration (HAVS) monitoring, and noise controls.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Full compliance with <Link href="/contractor-resources/risk-assessments/what-is-a-risk-assessment" className="text-[#EA580C] underline font-medium">commercial risk assessment standards</Link>, documenting Chapter 8 signage along commercial roadways.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Documented environmental emergency procedures for fuel spillage on porous soil and herbicide containment.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Professional Responsibility Note */}
            <div className="rounded-sm border border-slate-200 bg-[#FAFAF8] p-5 text-xs text-slate-500 font-light leading-relaxed max-w-4xl mx-auto text-center">
              <strong className="text-slate-800 font-semibold">Professional Competency Notice:</strong> Site-specific RAMS, pesticide application plans, and tree work safety controls must always be prepared, reviewed, and signed off by the contractor&apos;s own qualified competent persons to reflect the specific estate topography, plant inventory, and operational risks.
            </div>
          </div>
        </section>

        {/* 10. HOW THE CONTRACTOR NETWORK WORKS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <ContractorStepByStep
              eyebrow="ONBOARDING ROADMAP"
              title="How EntireFM's Contractor Network Works"
              subtitle="A clear, structured, and transparent process for putting your commercial grounds maintenance business forward."
              steps={GROUNDS_STEPS}
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
                Why Grounds Maintenance Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network puts your specialist grounds care plant in front of high-value commercial facilities management requirements:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Frameworks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business directly in front of commercial facilities management requirements across business parks, logistics hubs, and retail estates.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage NPTC certificates, Waste Carrier Licences, and insurance in one secure system with automated renewal alerts.
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
                  Clear Purchase Orders, structured site visit schedules, and straightforward electronic invoicing processes aligned with commercial finance teams.
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
              title="Essential Resources for Grounds Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, pesticide safety, and statutory PPM standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 13. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Grounds Maintenance Contractor FAQs"
              subtitle="Answers to common questions about NPTC qualifications, winter weather services, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 14. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Grounds Maintenance Business Forward for Commercial FM Work"
            description="Join the EntireFM Contractor Network. Complete the online intake, submit your machinery and compliance details, and access commercial facilities management opportunities across the UK. £95+VAT annual membership payable upon application submission."
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
