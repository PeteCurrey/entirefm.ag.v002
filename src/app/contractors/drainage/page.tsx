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
  Camera,
  Gauge,
  Layers,
  Sparkles,
  Wrench,
  AlertTriangle,
  Building2,
  ShieldCheck,
  ClipboardCheck,
  CheckCircle2,
  FileCheck,
  Award,
  Clock,
  Droplets,
  Truck,
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/drainage'];

export const metadata: Metadata = generateRouteMetadata('/contractors/drainage', {
  title: config.metaTitle,
  description: config.metaDescription,
});

const DRAINAGE_STEPS = [
  {
    step: 1,
    title: 'Apply Online',
    description:
      'Submit your drainage company details, operating radius, and core plant capabilities (van-pack jetters, combination tankers, CCTV crawler rigs).',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your Water Jetting Association (WJA) certificates, Confined Space cards, Upper Tier Waste Carrier Licence, and Public Liability insurance.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Specify your reactive attendance availability, WinCan survey software compatibility, and specialist capabilities (no-dig patch lining, interceptor desludging).',
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
      'EntireFM conducts due diligence on your operative jetting qualifications, gas monitor calibration certs, and health & safety documentation.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved contractors join our active supplier panel for merit-based consideration across scheduled gully/interceptor PPM and reactive blockage call-outs.',
    badge: 'Step 6',
  },
];

export default function DrainageContractorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://www.entirefm.com/contractors/drainage#service',
        name: 'Commercial Drainage Contractor Network',
        serviceType: 'Facilities Management Commercial Drainage Contractor Onboarding & Work Allocation',
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
        '@id': 'https://www.entirefm.com/contractors/drainage#breadcrumb',
        itemListElement: config.breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `https://www.entirefm.com${crumb.url}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.entirefm.com/contractors/drainage#faq',
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
            { figure: 'WJA & Confined Space', label: 'Competence Standard', detail: 'Plant & safety verified' },
            { figure: 'Merit-Based', label: 'Work Allocation', detail: 'PPM & reactive scopes' },
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

        {/* 3. WHAT COMMERCIAL FM DRAINAGE INVOLVES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ORDER PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM Drainage Work Involves
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial drainage operations demand heavy-duty plant, environmental compliance under Environment Agency guidelines, and rigorous safe systems of work across occupied business premises:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Camera className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">WinCan CCTV Structural Condition Surveys</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executing crawler and push-rod CCTV surveys to BS EN 13508-2 standards. Generating validated reports with standardized defect grading, high-resolution video links, photographic stills, and CAD drainage run overlays for commercial asset management logs and property acquisition audits.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">High-Pressure Water Jetting &amp; Descaling</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Heavy-duty descaling of underground foul runs, stormwater culverts, and grease-encrusted commercial kitchen discharge stacks deploying suitable van-pack or tanker-mounted jetting plant (for example, commercial units operating up to 3,000+ PSI / 15–20 GPM for heavy culvert descaling) equipped with rotary chain flails, spinning nozzles, and root-cutting heads appropriate to the pipe diameter.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Truck className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Interceptors &amp; Fuel Separators</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Scheduled PPM emptying, vacuum tanker desludging, and coalescence filter replacement on car park oil/water separators under Environment Agency PPG3 / GPP3 guidelines. Issuing compliant Hazardous Waste Consignment Notes with licensed disposal facility documentation.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Grease Traps &amp; FOG Management</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Tank vacuum servicing and line maintenance for internal automatic grease recovery units (GRUs) and exterior underground grease interceptors across commercial food courts and corporate canteens. Servicing biological enzyme dosing units to prevent fats, oils, and grease from solidifying in municipal sewer infrastructure.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Sewage Pump Stations &amp; Wet Wells</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Planned maintenance and reactive overhaul of dual submersible grinder and vortex pumps, guide-rail retrieval systems, check valves, float switches, ultrasonic level controllers, and BMS telemetry alarms. Often interfacing with our <Link href="/contractors/plumbing" className="text-[#EA580C] underline font-medium">commercial plumbing contractors</Link> for estate booster and riser coordination.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">No-Dig Patch Lining &amp; Trenchless Remedials</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executing localized fiberglass resin patch repairs and ambient-cured CIPP relining on cracked, root-infiltrated, or displaced commercial sewer runs. Restoring structural pipe integrity beneath busy service yards, retail parking decks, and roadways without costly ground excavation or disruption.
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
                Where Commercial Drainage Contractors Operate
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial drainage demands specialized traffic management, safety controls, and environmental compliance tailored to distinct commercial estate categories:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail Parks &amp; Shopping Destinations</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Extensive customer car park gullies, bypass petrol interceptors, multi-tenant food court grease lines, and pedestrian linear ACO drainage. Work is scheduled to minimise disruption during peak retail trading windows.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Truck className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Logistics Hubs &amp; Freight Distribution Depots</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Heavy goods vehicle washdown bays, high-capacity fuel interceptors, attenuation crates, hydro-brake flow regulators, and deep catchpits receiving runoff across thousands of square meters of concrete hardstanding.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Corporate Headquarters &amp; Office Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Sub-surface ring mains, basement sewage pumping chambers, multi-storey vertical soil stacks, and rainwater harvesting attenuation systems requiring out-of-hours attendance to avoid noise and disruption.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Industrial &amp; Manufacturing Plants</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Trade effluent monitoring pits, pH neutralization tanks, heavy silt traps, and process water drainage requiring strict environmental discharge compliance, COSHH safety, and specialized chemical PPE.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-rose-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Educational &amp; Healthcare Estates</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Complex campus foul and storm networks, residential student accommodation blocks, and clinical washdown lines requiring enhanced hygiene protocols, biological sanitisation, and DBS-cleared attending operatives.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Tenanted Commercial Estates</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Business parks where shared foul and storm networks cross multiple leasehold boundaries. Demands clear demarcation between landlord common mains and demised tenant connections, supported by validated CCTV records.
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
                Scheduled Drainage PPM vs Reactive Emergency Response
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities management drainage combines cyclical environmental maintenance with rapid reactive emergency containment.
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
                    <p className="text-slate-500 text-[11px] font-mono">Cyclical Schedules • Environmental Compliance • SFG20 Standards</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Scheduled systematically according to <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 maintenance standards</Link> and environmental guidance to prevent catastrophic estate flooding, environmental pollution breaches, and foul backups.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Annual high-pressure jetting and vacuum clearance of estate stormwater gullies, perimeter kerb drains, and linear channels.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Bi-annual vacuum tanker desludging of fuel separators and oil interceptors, including coalescence filter washing and alarm probe calibration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Quarterly grease trap waste extraction and optical inspection of foul pump wet wells, non-return valves, and guide-rail couplings.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <AlertTriangle className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Reactive Drainage Emergencies</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Surcharging Manholes • Flooded Service Yards • Containment</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Triggered by surcharging sewer runs, flooded distribution yards, backing-up toilet blocks, or high-level pump alarms threatening business continuity and public health.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Urgent reactive attendance aligned with individual work order priority targets to deploy high-pressure jetting and suction equipment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Immediate pedestrian cordoning, traffic management, hazard containment, and biological sanitisation of affected surface areas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Post-clearance CCTV look-see to identify underlying defects (displaced joints, heavy scale, root intrusion) and issue remedial proposals.</span>
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
                What Commercial FM Clients Expect from Drainage Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities managers, environmental compliance officers, and managing agents evaluate drainage specialists on technical documentation, equipment capacity, and site safety discipline:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-light">
              <div className="space-y-6">
                <div className="border-l-2 border-[#EA580C] pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-[#EA580C] uppercase tracking-wider">
                    SPECIFICATION 01 // SURVEY ACCURACY
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">WinCan-Coded CCTV Reporting</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Commercial clients typically expect structural surveys to be coded to BS EN 13508-2 standards with standardized defect classification. Reports generally include clear still photographs, invert levels, pipe dimensions, material classifications, and accessible video download links for commercial building records.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 02 // STATUTORY DISPOSAL
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Duty of Care Waste Transfer Compliance</h3>
                  <p className="text-slate-600 leading-relaxed">
                    All extracted interceptor waste, grease sludge, and contaminated silt must be transported under a valid Upper Tier Waste Carrier Licence with legally compliant Waste Transfer Notes or Hazardous Waste Consignment Notes identifying authorized disposal facilities.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 03 // SAFETY PERMITTING
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Confined Space Entry Rigour</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Adherence to the Confined Spaces Regulations 1997. Where manhole or wet-well chamber entry is required, operatives deploy calibrated 4-gas atmospheric monitors, tripod safety winches, harness retrieval lines, and emergency escape breathing apparatus (EBA).
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 04 // ENVIRONMENTAL CARE
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Site Environmental Protection</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Preventing uncontrolled surface runoff during high-pressure jetting operations. Utilizing temporary drain bunding, spill kits, and suction extraction to protect watercourses and sensitive surface drainage networks from cross-contamination.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 05 // PUBLIC & VEHICLE CONTROLS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Traffic Management &amp; Pedestrian Safety</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Deploying Chapter 8 compliant barriers, vehicle livery, pedestrian crossing ramps over jetting hoses, and reflective hazard warning signage when working in busy retail car parks, loading docks, and public rights of way.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 06 // FINANCIAL PROCESS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Purchase Order Discipline</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Clear PO-driven billing with itemized breakdowns of jetting hours, tanker disposal volume (litres or tonnes), and patch lining consumables to ensure rapid invoice verification and automated payment processing.
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
                Drainage Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial facilities managers and environmental auditors evaluate drainage contractors across statutory health and safety credentials, insurance cover, and scheme registrations:
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
                    <span><strong>Public Liability:</strong> £5,000,000 network admission baseline; £10,000,000 frequently specified by clients for major industrial estates or critical infrastructure.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory requirement for all workforce personnel.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Environmental Impairment:</strong> Appropriate policy coverage for accidental pollution or escape of effluent where required by client frameworks.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Trade Accreditations &amp; Licences</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Trade registrations and licences commonly expected across commercial drainage tenders:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>WJA Certification:</strong> Water Jetting Association certificates for pressure jetting operatives commonly required.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Waste Carrier Licence:</strong> Active Environment Agency Upper Tier Waste Carrier / Broker registration.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>NADC Membership:</strong> National Association of Drainage Contractors membership commonly preferred.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Safety &amp; Confined Space Standards</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Health, safety, and operational standards typically reviewed during onboarding or specified by clients:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>SSIP Accreditation:</strong> CHAS, SafeContractor, or Constructionline health &amp; safety approval commonly expected.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Confined Space:</strong> City &amp; Guilds 6150 (Medium / High Risk with Escape Breathing Apparatus) where chamber entry is required.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Street Works (NRSWA):</strong> Qualifications for working within public highways and footways where relevant.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. WHY COMMERCIAL DRAINAGE CONTRACTORS NEED STRONG RAMS & DOCUMENTATION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">ENVIRONMENTAL &amp; SAFETY RIGOUR</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Why Commercial Drainage Contractors Need Robust RAMS
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                High-pressure water jetting, hazardous chemical atmospheres, and environmental pollution liabilities present severe operational risks. Facilities directors and managing agents require comprehensive safe systems of work before permits are issued.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <FileCheck className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Task-Specific Method Statements &amp; HPWJ Controls</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Jetting Safety • Confined Space Sequence • Traffic Cordoning</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Commercial drainage works frequently involve high operating pressures and work in pedestrian-dense commercial environments. Method statements should clearly define safety exclusion zones, hose protection across walkways, and emergency shut-off procedures. Review our comprehensive guide on <Link href="/contractor-resources/rams/what-are-rams" className="text-[#EA580C] underline font-medium">what commercial RAMS are</Link>.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Detailed sequence of work for water jetting, specifying nozzle ratings, pressure limits, and operative anti-blast PPE.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Confined space entry method statements detailing atmospheric pre-testing, continuous gas monitoring, top-man duties, and emergency extraction protocols.</span>
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
                    <h3 className="text-lg font-semibold text-slate-900">Risk Assessment Matrices &amp; Environmental Protection</h3>
                    <p className="text-slate-500 text-[11px] font-mono">5x5 Risk Evaluation • Biological Hazards • Spill Containment</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Under the Environmental Protection Act 1990 and Health and Safety at Work etc. Act 1974, duty holders are legally responsible for hazardous spills and workforce health. Commercial drainage contractors are expected to provide auditable risk matrices and pollution prevention controls.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>5x5 matrix risk assessments identifying biohazards (Weil&apos;s disease / Leptospirosis), toxic hydrogen sulfide gas, and mechanical entrapment risks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Compliance with <Link href="/contractor-resources/risk-assessments/what-is-a-risk-assessment" className="text-[#EA580C] underline font-medium">commercial risk assessment standards</Link>, documenting spill kit deployment and surface water protection.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Documented emergency response protocols for accidental interceptor overflow or sewage escape into nearby watercourses.</span>
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
              subtitle="A clear, structured, and transparent process for putting your commercial drainage business forward."
              steps={DRAINAGE_STEPS}
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
                Why Drainage Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network puts your specialist drainage plant in front of commercial facilities management requirements across the UK:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Frameworks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business directly in front of commercial facilities management requirements across retail parks, corporate hubs, and industrial sites.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage WJA certificates, Waste Carrier Licences, and insurance in one secure system with automated renewal alerts.
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
                  Clear Purchase Orders, structured work scopes, and straightforward electronic invoicing processes aligned with commercial finance teams.
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
              title="Essential Resources for Drainage Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, confined space safety, and statutory PPM standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 13. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Drainage Contractor FAQs"
              subtitle="Answers to common questions about WJA standards, CCTV survey reporting, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 14. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Drainage Business Forward for Commercial FM Work"
            description="Join the EntireFM Contractor Network. Complete the online intake, submit your plant and compliance details, and access commercial facilities management opportunities across the UK. £95+VAT annual membership payable upon application submission."
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
