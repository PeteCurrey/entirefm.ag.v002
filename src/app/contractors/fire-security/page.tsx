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
  Flame,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Activity,
  Award,
  Lock,
  Camera,
  Layers,
  Wrench,
  AlertCircle,
  BellRing,
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/fire-security'];

export const metadata: Metadata = generateRouteMetadata('/contractors/fire-security', {
  title: config.metaTitle,
  description: config.metaDescription,
});

const FIRE_SECURITY_STEPS = [
  {
    step: 1,
    title: 'Apply Online',
    description:
      'Submit your company profile, fire safety accreditations (BAFE/NSI/SSAIB), and geographic response territories.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your BAFE SP203/SP101 certs, NSI/SSAIB gold/silver cards, Efficacy liability insurance, and engineer BS 7858 screening records.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Indicate your manufacturer panel software authorizations (Advanced, Gent, Morley, C-TEC) and access control proficiencies (Paxton, Salto).',
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
      'EntireFM reviews your FIA engineering qualifications, smoke detector tester calibrations, and statutory logbook standards.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved contractors join our active supplier panel for merit-based consideration across statutory BS 5839/BS 5266 PPM and reactive fault calls.',
    badge: 'Step 6',
  },
];

export default function FireSecurityContractorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://www.entirefm.com/contractors/fire-security#service',
        name: 'Commercial Fire and Security Contractor Network',
        serviceType: 'Facilities Management Commercial Fire & Security Contractor Onboarding & Work Allocation',
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
        '@id': 'https://www.entirefm.com/contractors/fire-security#breadcrumb',
        itemListElement: config.breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `https://www.entirefm.com${crumb.url}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.entirefm.com/contractors/fire-security#faq',
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
            { figure: 'BAFE & NSI / SSAIB', label: 'Statutory Standard', detail: 'Life safety audited' },
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

        {/* 3. WHAT COMMERCIAL FM FIRE & SECURITY INVOLVES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ORDER PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM Fire &amp; Security Work Can Involve
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial fire and electronic security maintenance demands absolute compliance with life-safety legislation, British Standards, and building management interfaces:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <BellRing className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">BS 5839-1 Addressable Fire Alarm Servicing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executing quarterly and annual testing across multi-loop analogue addressable panels including Advanced Electronics, Morley-IAS, Gent by Honeywell, and C-TEC. Requires systematic 100% detector head testing across the annual cycle, optical smoke aerosol checks, thermal rate-of-rise sensor verification, aspirating (VESDA) system filter maintenance, loop voltage checks, and digital inspection certificate issuing.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Cause-and-Effect Matrix Verification</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Conducting planned, controlled verification of complex fire alarm interface outputs: primary and secondary passenger lift grounding, HVAC Air Handling Unit (AHU) ventilation fan shutdown to halt smoke migration, automatic motorized smoke damper release, magnetic fire door hold-open release, and natural gas solenoid emergency shut-off valves without disrupting core business trading.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Access Control &amp; Integrated Turnstiles</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Servicing networked commercial access control architectures (Paxton Net2, Salto Space, Gallagher, Honeywell Pro-Watch). Routine maintenance of electro-magnetic shear locks, fail-safe green break-glass emergency overrides, motorized speed lanes, revolving turnstiles, and fire alarm interfaced escape door hardware to guarantee unimpeded escape during building evacuations.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Camera className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial IP CCTV &amp; ANPR Systems</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Preventative servicing of high-definition multi-terabyte Network Video Recorders (NVRs), PTZ speed dome cameras, PoE industrial network distribution switches, uninterrupted power supplies (UPS), and automatic number plate recognition (ANPR) parking barriers. Ensuring 31-day recording retention compliance and GDPR privacy masking verification.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Flame className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">BS 5266 Emergency Lighting &amp; BAFE Extinguishers</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Conducting monthly key-switch functional flicker tests alongside annual full 3-hour battery discharge testing of self-contained and central battery emergency lighting systems (often coordinated with our <Link href="/contractors/electrical" className="text-[#EA580C] underline font-medium">commercial electrical contractors</Link> for distribution board isolations). Servicing escape route signage, high-bay luminaire battery packs, and executing annual BAFE SP101 portable fire extinguisher inspections, weight verifications, and refilling.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">BS 9999 Fire Damper Drop-Testing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executing statutory annual physical drop-testing and operational resetting of mechanical fusible link and motorized smoke/fire dampers within commercial HVAC ductwork. Providing geo-timestamped photographic records of open, closed, and reset blade states, verifying microswitch telemetry to the main fire indicator panel.
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
                Where Commercial Fire &amp; Security Contractors Operate
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial life safety and security contractors operate across diverse environments, each presenting distinct acoustic parameters, occupancy dynamics, and duty-holder constraints:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Storey Corporate Offices</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-specification Grade A office towers requiring phased evacuation sounders, optical beam detectors across multi-tier atriums, motorized speed lane turnstiles, and tenant demise access partitions. All testing must be scheduled strictly out-of-hours or within contracted silent testing windows to prevent acoustic disruption to commercial tenants.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Industrial &amp; Logistics Hubs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-bay distribution centres and manufacturing facilities featuring aspirating smoke detection (ASD/VESDA) sampling pipe networks, explosion-proof ATEX call points, high-level beam smoke detectors, external perimeter thermal fence cameras, and automatic gate/barrier control systems operating 24 hours a day.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail &amp; Leisure Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Regional shopping centres and retail leisure parks demanding integrated Public Address Voice Alarm (PAVA) systems, panic attack alarms in cash offices, tenant sub-alarm monitoring, sprinkler flow switch telemetry, and ANPR surveillance covering extensive customer parking facilities.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Education &amp; Healthcare Campuses</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Universities, colleges, and healthcare estates requiring lockdown alarm protocols, disabled refuge emergency voice communication (EVC) outstations, nurse call monitoring interfaces, magnetic door hold-backs on cross-corridor fire partitions, and enhanced DBS-cleared engineering teams.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-rose-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Occupancy Residential Portfolios</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Residential block portfolios governed by the Building Safety Act 2022. Maintenance covers communal BS 5839-1 systems, Automatic Opening Vent (AOV) stairwell smoke clearance dampers, dry riser inlet monitoring, and BS 8629 evacuation alert systems designed specifically for Fire and Rescue Service operational control.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Critical Infrastructure &amp; Data Centres</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Mission-critical environments equipped with gaseous fire suppression systems (Inergen, Novec 1230, FM-200), coincidence loop detection, pressure relief dampers, biometric access control airlocks, and dual-path secure Alarm Receiving Centre (ARC) signalling.
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
                Statutory Fire Compliance PPM vs Reactive Security Repairs
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Fire and security engineering combines strict statutory testing cycles under fire safety law with urgent reactive fault resolution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Planned Statutory Maintenance (PPM)</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Quarterly / Bi-Annual • BS 5839 / BS 5266 • Fire Safety Act 2021</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Scheduled according to <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 maintenance standards</Link> and British Standards to ensure building duty holders satisfy the Regulatory Reform (Fire Safety) Order 2005.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Quarterly BS 5839 fire alarm inspections with sequential loop and sounder audibility testing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Annual 3-hour emergency lighting duration testing and lux level assessments.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Annual BS 9999 fire damper drop tests with individual photographic asset records.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <Lock className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Reactive Life-Safety &amp; Security Call-Outs</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Panel Earth Faults • Maglock Failures • 24/7 Priority Dispatch</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Dispatched when fire alarm panels register open-circuit/earth faults, access control doors fail to secure or fail to release on fire signals, or IP cameras lose communication.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Urgent reactive attendance aligned with individual work order priority targets to diagnose loop faults, silence false alarms, and restore life-safety system integrity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Replacing faulty break-glass units, swollen backup batteries, or defective magnetic shear locks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Immediate logging in physical fire logbook and issuance of digital test certification.</span>
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
                What Commercial FM Clients Expect from Fire &amp; Security Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities directors, fire risk assessors, and property management companies require rigorous technical integrity and verified scheme credentials:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-light">
              <div className="space-y-6">
                <div className="border-l-2 border-[#EA580C] pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-[#EA580C] uppercase tracking-wider">
                    SPECIFICATION 01 // THIRD-PARTY ASSURANCE
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">BAFE &amp; NSI Accreditation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Commercial clients and managing agents frequently specify third-party scheme registration (such as BAFE SP203-1, NSI Gold/Silver, or SSAIB) to independently verify management systems, technical design capabilities, and ongoing engineer competency audits.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 02 // INTERFACE INTEGRITY
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Controlled Cause &amp; Effect Protocols</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Managing building interfaces with absolute care. Always isolating Alarm Receiving Centre (ARC) monitoring links before testing, coordinating passenger lift grounding and AHU fan shutdown with on-site building managers to prevent disruptive false alarms or blue-light callouts.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 03 // AUDIT EVIDENCE
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Defensible Digital Test Certificates</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Providing completed BS 5839 and BS 5266 inspection certificates upon completion, itemizing tested device counts, loop voltages, standby battery load-test results, and clearly documenting any client variations or site defects.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 04 // SECURITY VETTING
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">BS 7858 Operative Screening</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Ensuring all attending security and fire engineers hold verified 5-year BS 7858 security screening and DBS clearances where required for sensitive client demises, data rooms, financial institutions, or multi-tenant commercial HQs.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 05 // STATUTORY LOGS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">On-Site Logbook Updates</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Physically signing and dating the on-site statutory fire safety logbook after every maintenance attendance, ensuring duty holders have immediate physical records available for local Fire &amp; Rescue Service audits.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 06 // FINANCIAL PROCESS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Purchase Order Discipline</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Ensuring all extra works, replacement detector heads, sounder bases, and standby batteries are formally pre-authorised under a valid Purchase Order, guaranteeing swift billing verification and automated invoice payment.
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
                Fire &amp; Security Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial facilities managers and property directors evaluate contractors across statutory health and safety compliance, insurance cover, and scheme credentials:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-[#EA580C] font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Insurance Cover Expectations</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Commercial clients and managing agents set insurance criteria based on property scale and life-safety exposure:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Public Liability:</strong> £5,000,000 indemnity is commonly expected; £10,000,000 is frequently specified on high-occupancy corporate or public-sector portfolios.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory requirement for all businesses employing personnel.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Efficacy Endorsement:</strong> Failure-to-perform / inefficacy cover is widely required by commercial insurers for fire alarm and security systems.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Scheme &amp; Trade Accreditations</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Third-party scheme memberships commonly expected or preferred by commercial procurement frameworks:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>BAFE SP203-1:</strong> Fire detection and alarm system design, installation, commissioning, and maintenance scheme.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>NSI / SSAIB:</strong> Gold or Silver certification verifying technical capability for electronic security, CCTV, and access control.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>FIA Certified Training:</strong> Fire Industry Association certified technical qualification modules for engineers.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Operative Competence &amp; Site Standards</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Health, safety, and security verification required during client vendor onboarding:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>SSIP Accreditation:</strong> Recognised safety schemes (CHAS, SafeContractor, Constructionline) confirming core H&amp;S compliance.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>BS 7858 Screening:</strong> 5-year security screening and criminal record checks often required for high-security commercial premises.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>ECS Fire &amp; Security Cards:</strong> Electrotechnical certification verifying individual operative skill and health &amp; safety awareness.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. WHY COMMERCIAL CONTRACTORS NEED STRONG RAMS & DOCUMENTATION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">COMPLIANCE RIGOUR</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Why Fire &amp; Security Contractors Need Robust RAMS
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities managers, building surveyors, and institutional landlords cannot compromise on life-safety liabilities. Working in commercial premises demands site-specific, auditable Risk Assessments and Method Statements before access permits are issued.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <FileCheck className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Method Statements &amp; Safe Systems of Work</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Site-Specific RAMS • Working at Height • Live Systems</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Fire and security installations frequently involve live alarm panels, suppression systems, and energised circuits. Commercial clients and principal contractors expect site-specific method statements before access permits are issued.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Working at height risk controls (MEWP/IPAF certification, scaffold towers, or specialised telescopic detector poles).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Isolation and reinstatement sequences for live panel interfaces and cause-and-effect matrices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Explore our practical guide on <Link href="/contractor-resources/rams/how-to-write-rams" className="text-[#EA580C] underline font-medium">how to write compliant RAMS</Link> for facilities engineering.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Risk Assessment Matrices &amp; Duty of Care</h3>
                    <p className="text-slate-500 text-[11px] font-mono">5x5 Risk Evaluation • Hazard Mitigation</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Commercial building duty holders are legally liable under health and safety legislation. Review desks rigorously check risk assessments for public protection, tenant demarcation, electrical lock-off (LOTO), and hazardous area precautions.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Comprehensive hazard identification: electrical arc-flash, accidental activation of gaseous suppression, and lone working.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Residual risk scoring verified through hierarchical control measures before any operative sets foot on site.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Review our technical reference on <Link href="/contractor-resources/risk-assessments/what-is-a-risk-assessment" className="text-[#EA580C] underline font-medium">what constitutes a commercial risk assessment</Link>.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Professional Responsibility Note */}
            <div className="rounded-sm border border-slate-200 bg-[#FAFAF8] p-5 text-xs text-slate-500 font-light leading-relaxed max-w-4xl mx-auto text-center">
              <strong className="text-slate-800 font-semibold">Professional Competency Notice:</strong> Site-specific RAMS, isolation sequences, and cause-and-effect controls must always be drafted, reviewed, and signed off by the contractor's own qualified competent persons to reflect the specific layout, plant, and operational risks of each individual commercial building.
            </div>
          </div>
        </section>

        {/* 10. HOW THE CONTRACTOR NETWORK WORKS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <ContractorStepByStep
              eyebrow="ONBOARDING ROADMAP"
              title="How EntireFM's Contractor Network Works"
              subtitle="A clear, structured, and transparent process for putting your fire & security business forward."
              steps={FIRE_SECURITY_STEPS}
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
                Why Fire &amp; Security Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network positions your business as a preferred life-safety contractor for commercial facilities management portfolios:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Frameworks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business directly in front of statutory fire alarm and security requirements across corporate, industrial, and retail estates.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage BAFE accreditations, NSI certificates, and efficacy insurance in one central system with automated renewal tracking.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Merit-Based Matching</h3>
                <p className="text-slate-600 leading-relaxed">
                  Work orders are matched based on verified panel competencies (Advanced/Gent/Morley), access control expertise, SLA response, and proximity.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Streamlined Admin</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clear Purchase Orders, digital certificate uploads, and transparent electronic invoicing processes aligned with commercial finance teams.
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
              title="Essential Resources for Fire &amp; Security Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, fire safety regulations, and statutory PPM standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 12. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Fire &amp; Security Contractor FAQs"
              subtitle="Answers to common questions about BAFE certification, life-safety standards, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 13. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Fire &amp; Security Business Forward for Commercial FM Work"
            description="Join the EntireFM Contractor Network. Complete the online intake, submit your BAFE/NSI credentials and insurance details, and access commercial facilities management opportunities across the UK. £95+VAT annual membership payable upon application submission."
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
