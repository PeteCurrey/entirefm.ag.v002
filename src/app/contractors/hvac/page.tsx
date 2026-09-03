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
  Wind,
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

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/hvac'];

export const metadata: Metadata = generateRouteMetadata('/contractors/hvac', {
  title: config.metaTitle,
  description: config.metaDescription,
});

const HVAC_STEPS = [
  {
    step: 1,
    title: 'Apply Online',
    description:
      'Put your business forward via our contractor intake with company registration, operating territories, and primary HVAC trade specialisms.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload company Refcom/Bureau Veritas F-Gas certificates, engineer City & Guilds 2079 Cat 1 cards, and Public Liability insurance.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Declare your service radii, rooftop working-at-height capabilities, and specialized equipment (recovery machines, vacuum pumps).',
    badge: 'Step 3',
  },
  {
    step: 4,
    title: 'Pay Annual Membership Fee',
    description:
      'Submit the straightforward £95 + VAT annual membership fee during application submission. Transparent, fair, and professional.',
    badge: 'Step 4',
  },
  {
    step: 5,
    title: 'Technical Desk Review',
    description:
      'EntireFM conducts due diligence on your F-Gas registrations, scale calibration certs, and health & safety documentation.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved contractors enter our active supplier network for merit-based consideration across scheduled PPM packages and reactive HVAC repairs.',
    badge: 'Step 6',
  },
];

export default function HvacContractorPage() {
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
              name: 'Commercial HVAC Contractor Network',
              serviceType: 'Facilities Management Commercial HVAC Contractor Onboarding & Work Allocation',
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
            { figure: 'Refcom & F-Gas Cat 1', label: 'Statutory Standard', detail: 'Audited compliance' },
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

        {/* 3. WHAT COMMERCIAL FM HVAC WORK INVOLVES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ORDER PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM HVAC Work Can Involve
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial HVAC maintenance bridges complex refrigeration thermodynamics, electrical inverter controls, air movement engineering, and stringent environmental law. Contractors encounter diverse plantroom and rooftop equipment:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wind className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">VRF / VRV Multi-Split Maintenance</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Quarterly PPM and fault diagnostics on 2-pipe and 3-pipe heat recovery VRF systems (Daikin, Mitsubishi Electric, Toshiba). Inspecting PCB operational telemetry, electronic expansion valves, sensor thermistors, and chemical coil washing.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Chillers &amp; Heat Pumps</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Servicing air-cooled and water-cooled scroll, screw, and centrifugal chillers. Checking oil levels, compressor running currents, approach temperatures, flow switches, transducer calibrations, and condenser fan speed controllers.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Air Handling Units (AHUs) &amp; Heat Recovery</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Overhauling central AHUs: replacing G4/F7 panel and bag filters, cleaning heat recovery thermal wheels and plate recuperators, inspecting belt drive alignment, testing differential pressure switches, and biocidal treatment of condensate pans.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Statutory F-Gas Leak Testing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Conducting mandatory direct and indirect refrigerant leak checks under UK F-Gas Regulations based on system CO2 equivalent charge. Updating digital F-Gas logbooks and issuing compliance certificates for building safety files.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">BMS Controls &amp; Trend/Tridium Integration</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Interfacing HVAC plant with Building Management Systems (BACnet, Modbus, Trend, Tridium). Checking setpoint deadbands, actuator damper strokes, room temperature sensor offsets, and time-schedule holiday overrides.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Reactive Fault Finding &amp; Compressor Swaps</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Diagnosing inverter drive faults, high-pressure trips, burnt-out scroll compressors, reversing valve failures, and PCB communications errors, followed by OFN pressure testing, evacuation, and precise digital charging.
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
                Where Commercial HVAC Contractors Operate
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial environmental control is critical to building occupancy, statutory fresh air ventilation, and server reliability:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Corporate Offices</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Multi-tenant office towers requiring strict tenant comfort SLAs (21°C ± 1°C), out-of-hours rooftop condenser cleans, and fresh air ventilation rate compliance (CIBSE Guide A).
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Data &amp; Server Rooms</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Close-control computer room air conditioning (CRAC) units requiring N+1 redundancy, 24/7 emergency response, and precision temperature and humidity control.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail &amp; Leisure Centres</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-capacity rooftop package units, over-door warm air curtains, variable occupancy CO2 demand-controlled ventilation, and commercial kitchen extract make-up air.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Industrial &amp; Cleanrooms</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Manufacturing process cooling, HEPA filtration ventilation for pharmaceutical packaging, and negative/positive pressure airlocks with verified airflow telemetry.
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
                Planned Preventative Maintenance vs Reactive HVAC Call-Outs
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                HVAC systems experience heavy mechanical wear and seasonal thermal stresses. FM providers balance scheduled servicing with rapid reactive capability.
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
                    <p className="text-slate-500 text-[11px] font-mono">Quarterly / Bi-Annual • Statutory F-Gas • SFG20</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Scheduled according to <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 maintenance schedules</Link> and manufacturer guidelines to maintain seasonal energy efficiency, prevent compressor burnouts, and satisfy building insurance warranties.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Spring cooling prep: Condenser chemical washing, refrigerant subcooling/superheat checks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Autumn heating prep: 4-way reversing valve verification, electric heater battery checks, frost stats.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Statutory F-Gas leak testing and digital logbook sign-off for client compliance files.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <Flame className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Reactive Cooling &amp; Heating Restorations</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Critical SLAs • Server Rooms • High-Disruption Scenarios</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Triggered by catastrophic compressor failures, high-pressure trips during summer heatwaves, condensate tray flooding over tenant office desks, or frozen evaporator coils.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Priority 1 attendance (2 to 4 hours) for critical comms rooms and executive trading floors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Deployment of temporary spot coolers / portable AC units where major parts require ordering.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Clear technical diagnosis, OEM part numbering, and rapid formal quotation for client approval.</span>
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
                What Commercial FM Clients Expect from HVAC Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities managers and corporate managing agents evaluate HVAC contractors on safety discipline, environmental compliance, and clear communication:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-base font-semibold text-slate-900">Rigorous F-Gas Tracking</h3>
                <p className="text-slate-600 leading-relaxed">
                  Recording exact refrigerant weights added or recovered, cylinder serial numbers, and certified scale details. Zero tolerance for unrecorded refrigerant losses under UK environmental audits.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-base font-semibold text-slate-900">Rooftop Height Safety Discipline</h3>
                <p className="text-slate-600 leading-relaxed">
                  Complying with rooftop permit-to-work procedures, designated roof walkway paths, anchor point inspections, and Work at Height Regulations 2005 for high-level plant deck maintenance.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-base font-semibold text-slate-900">Hot Works &amp; OFN Brazing Controls</h3>
                <p className="text-slate-600 leading-relaxed">
                  Operating under strict hot works permits when brazing pipework. Utilizing Oxygen-Free Nitrogen (OFN) purging to prevent internal oxide scaling, and conducting mandatory 60-minute fire watch periods.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  04
                </div>
                <h3 className="text-base font-semibold text-slate-900">Asset Data &amp; Telemetry Reporting</h3>
                <p className="text-slate-600 leading-relaxed">
                  Submitting comprehensive electronic service sheets detailing asset model/serial numbers, compressor suction/discharge pressures, electrical current draw, and air filter differential pressures.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  05
                </div>
                <h3 className="text-base font-semibold text-slate-900">Discreet Tenant-Area Conduct</h3>
                <p className="text-slate-600 leading-relaxed">
                  Using dust sheets, clean drop cloths, and noise-damped tools when working on ceiling cassette units above tenant office desks. Leaving commercial working spaces cleaner than upon arrival.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  06
                </div>
                <h3 className="text-base font-semibold text-slate-900">Purchase Order Integrity</h3>
                <p className="text-slate-600 leading-relaxed">
                  Ensuring all work and replacement components (e.g. fan motors, expansion valves) are pre-authorised with clear Purchase Orders, enabling rapid invoice verification and payment.
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
                HVAC Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Requirements reflect specific refrigeration, ventilation, and rooftop working-at-height hazards:
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
                    <span><strong>Public Liability:</strong> Minimum £5,000,000 (£10,000,000 for high-level plant decks).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory minimum for all employers.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Efficacy &amp; Product Liability:</strong> Endorsements for refrigerant handling and system efficacy.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>F-Gas &amp; Trade Certification</span>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Company F-Gas:</strong> Current Refcom Elite or Bureau Veritas Company Certificate.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Engineer Cat 1:</strong> City &amp; Guilds 2079 or BESA FG Cat 1 certification.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Trade Schemes:</strong> BESA membership or Building Engineering Services Competence.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Height &amp; Tool Safety</span>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>SSIP Accreditation:</strong> CHAS, SafeContractor, or Constructionline health &amp; safety.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Access Cards:</strong> IPAF (3a/3b MEWPs) and PASMA tower cards for high-level access.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Tool Calibration:</strong> Annual calibration on digital manifold gauges and refrigerant scales.</span>
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
              subtitle="A clear, structured, and transparent process for putting your HVAC contracting business forward."
              steps={HVAC_STEPS}
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
                Why HVAC Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network connects your engineering business with commercial facilities management opportunities:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Frameworks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business forward for high-value commercial building maintenance contracts across corporate, retail, and industrial portfolios.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage company Refcom certificates, engineer F-Gas cards, and insurance in one place with automated renewal alerts.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Merit-Based Matching</h3>
                <p className="text-slate-600 leading-relaxed">
                  Work orders are dispatched based on verified technical competence, chiller/VRF specialization, engineer proximity, and performance.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Structured Job Orders</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clear asset lists, detailed client fault descriptions, pre-agreed hourly rates, and formal Purchase Orders for prompt payment.
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
              title="Essential Resources for HVAC Contractors"
              subtitle="Explore practical guides to commercial plantroom RAMS, SFG20 maintenance standards, and FM contractor network participation."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 12. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial HVAC Contractor FAQs"
              subtitle="Answers to common questions about F-Gas requirements, equipment scope, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 13. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your HVAC Business Forward for Commercial FM Work"
            description="Join the EntireFM Contractor Network. Submit your company Refcom credentials, engineer certifications, and access commercial facilities management opportunities across the UK. £95+VAT annual membership payable upon application submission."
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

