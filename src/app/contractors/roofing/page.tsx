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
  ShieldAlert,
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
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/roofing'];

export const metadata: Metadata = generateRouteMetadata('/contractors/roofing', {
  title: config.metaTitle,
  description: config.metaDescription,
});

const ROOFING_STEPS = [
  {
    step: 1,
    title: 'Apply Online',
    description:
      'Submit your roofing company details, membrane specialisms (single-ply, liquid, felt, cladding), and operating coverage.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your NFRC/CompetentRoofer credentials, Working at Height certifications, Safe2Torch certificates, and Public Liability insurance.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Indicate your access capabilities (MEWP/IPAF, rope access, scaffold networks), electronic leak detection rigs, and reactive response SLAs.',
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
      'EntireFM reviews your roofing operative CSCS cards, mansafe inspection competencies, and site-specific height safety RAMS.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved contractors enter our active supplier network for merit-based consideration across bi-annual gutter/roof PPM and urgent leak repairs.',
    badge: 'Step 6',
  },
];

export default function RoofingContractorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://www.entirefm.com/contractors/roofing#service',
        name: 'Commercial Roofing Contractor Network',
        serviceType: 'Facilities Management Commercial Roofing Contractor Onboarding & Work Allocation',
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
        '@id': 'https://www.entirefm.com/contractors/roofing#breadcrumb',
        itemListElement: config.breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `https://www.entirefm.com${crumb.url}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.entirefm.com/contractors/roofing#faq',
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
            { figure: 'NFRC & Safe2Torch', label: 'Statutory Standard', detail: 'Height safety verified' },
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

        {/* 3. WHAT COMMERCIAL FM ROOFING INVOLVES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ORDER PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM Roofing Work Can Involve
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial roofing demands rigorous adherence to the Work at Height Regulations 2005, industrial waterproofing chemistry, and structural condition surveying:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Single-Ply &amp; Liquid Membrane Maintenance</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Inspecting and repairing commercial single-ply systems (EPDM, TPO, PVC), hot-air welded lap seams, and moisture-triggered polyurethane/PMMA liquid waterproofing coatings across large flat roof decks. Ensuring seamless detailing around HVAC roof penetrations, upstands, soil stacks, and parapet coping stones.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Umbrella className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Industrial Gutter PPM &amp; Syphonic Clearing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Scheduled bi-annual clearance of high-capacity boundary box gutters, valley gutters, and syphonic drainage outlets across distribution centres, ensuring unrestricted stormwater discharge, clearance of windblown silt, leaf debris removal, and zero internal overflow risk into tenant operations.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Search className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Electronic Leak Detection &amp; Core Sampling</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Non-destructive electronic vector mapping (wet/dry roof testing), high-voltage spark testing, and structural core sampling to pinpoint micro-punctures, saturated PIR insulation boards, and interstitial condensation issues on flat roofs without invasive membrane destruction.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Industrial Rooflight &amp; Cladding Remedials</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Replacing UV-degraded, brittle GRP factory rooflights with class-B non-fragile polycarbonate units. Repairing cut-edge corrosion on profiled metal cladding sheets using elastomeric edge sealants, and replacing failed silicone weatherproofing joints (interfacing seamlessly with our <Link href="/contractors/fabric-maintenance" className="text-[#EA580C] underline font-medium">commercial fabric maintenance contractors</Link>).
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Mansafe Systems &amp; Edge Protection Audits</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Annual statutory recertification and maintenance of horizontal lifeline wire systems (BS EN 795), anchor eyebolts, freestanding counterbalance roof guardrails, self-closing access gates, stepover units, and demarcated anti-slip walkway matting.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Flame className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Safe2Torch Bituminous Patch Repairs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Executing torch-on felt and self-adhesive elastomeric membrane patch repairs strictly complying with NFRC Safe2Torch guidelines, hot works permits, combustible zone identification, and continuous 120-minute post-completion thermal imaging fire watches.
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
                Where Commercial Roofing Contractors Operate
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial roofing environments require specialized fall-arrest equipment, MEWPs, and weather-monitoring protocols:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Distribution &amp; Logistics Hubs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Sprawling low-pitch standing seam roofs, high-level translucent rooflights, perimeter valley gutters, and rooftop smoke vents. Work demands strict ground-level pedestrian exclusion zones around loading bays and high-capacity boom lifts (IPAF 3b).
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Storey Corporate Offices</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Inverted flat roofs with paved concrete ballasts, complex HVAC chiller plant deck penetrations, and perimeter parapet flashing. Access via internal companionway ladders requiring strict noise minimization during normal business hours.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail Parks &amp; Superstores</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Curved standing seam metal systems, boundary eaves gutters, external downpipes over public walkways, and canopy roofs. Work requires careful coordination with store trading hours and hoarding around access towers.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Industrial Manufacturing Facilities</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  North-light roof structures, chemical exhaust stack penetrations, combustible insulation checks, and severe roof access permits. Requires full harness rescue plans and dynamic atmospheric monitoring where process flues discharge.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-rose-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Education &amp; Healthcare Portfolios</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  School and hospital flat roofs often aged multi-layer felt or asphalt requiring term-break planned overlays, solvent-free liquid coatings to prevent odour ingress into wards or classrooms, and enhanced DBS-cleared operatives.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Umbrella className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Tenanted Business Parks &amp; Mixed Use</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Mixed-use business parks with diverse roof coverings across adjoining commercial demises. Work demands clear photographic demarcation of leasehold boundaries, aerial thermal drone thermography to isolate ingress sources across shared party parapets, and formal tenant liaison before mobilizing boom lifts or scaffold towers in communal vehicle loading zones.
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
                Scheduled Roof PPM Audits vs Emergency Leak Tracing
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Roofing within facilities management balances seasonal preventative maintenance with rapid reactive emergency containment.
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
                    <p className="text-slate-500 text-[11px] font-mono">Bi-Annual (Spring/Autumn) • SFG20 • Condition Asset Registers</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Conducted systematically according to <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 maintenance standards</Link> to preserve asset lifespan, maintain institutional landlord covenants, uphold multi-year manufacturer waterproofing warranties, and prevent catastrophic tenant business interruption.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Bi-annual industrial gutter clearance: extracting rotting vegetation, windblown industrial grit, and clearing silt traps across boundary box and eaves gutters.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Detailed inspection of single-ply lap seams, perimeter lead/aluminium flashings, parapet coping stone mastic expansion joints, and plant upstands.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Comprehensive photographic condition surveys documenting core moisture levels, standing water ponding, and projecting remaining serviceable lifecycle.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <Umbrella className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Reactive Roof Water Ingress</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Storm Damage • High-Value Stock Protection • Priority Attendance</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Triggered during severe rainfall or gale-force weather events when puncture damage, blown cladding sheets, blocked syphonic outlets, or failed rooflight seals threaten commercial trading floors, server racks, or multimillion-pound warehouse inventory.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Urgent reactive attendance aligned with work order priority targets to inspect roof decks within strictly monitored safe wind speed and environmental parameters.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Immediate water diversion, clearing blocked rainwater outlets, and applying rapid-curing moisture-tolerant elastomeric coatings or cold-applied patches.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Follow-up post-storm non-destructive survey (electronic vector mapping/thermal imaging) to formulate permanent, warranted repair specifications.</span>
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
                What Commercial FM Clients Expect from Roofing Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities managers, building surveyors, and property management companies require verified safety standards, comprehensive proof of work, and technical assurance from roofing contractors:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-light">
              <div className="space-y-6">
                <div className="border-l-2 border-[#EA580C] pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-[#EA580C] uppercase tracking-wider">
                    SPECIFICATION 01 // STATUTORY SAFETY
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Work at Height Safety Rigour</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Full statutory adherence to the Work at Height Regulations 2005. Contractors must provide site-specific RAMS documenting edge protection, fragile rooflight load-bearing covers, harness rescue plans, and strictly enforced wind-speed suspension cut-offs (typically 17 mph for MEWP operations).
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 02 // FIRE PREVENTION
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">NFRC Safe2Torch Compliance</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Strict application of Safe2Torch safety protocols. Identifying combustible deck substrates and insulation, utilizing flame-free self-adhesive or liquid coatings near upstands and timber details, and maintaining certified 2-hour continuous thermal imaging fire watches.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 03 // AUDIT EVIDENCE
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Photographic Survey Proof</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Supplying high-resolution geo-timestamped before, during, and after photos of every cleared gutter length, welded patch, and re-sealed flashing. Facilities managers verify digital photographic close-out packages before signing off work order payments.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 04 // PLANT COMPETENCE
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Access Plant Competency</h3>
                  <p className="text-slate-600 leading-relaxed">
                    All attending operatives operating mobile elevated work platforms (IPAF 3a scissor lifts, 3b boom lifts) or mobile aluminium access towers (PASMA) must carry valid photo certification and ensure daily pre-use plant inspection checklists are completed.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 05 // PUBLIC SAFETY
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Ground Exclusion Cordoning</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Establishing rigid ground-level drop-zone exclusion barriers, warning signage, and debris catch netting when working above active pedestrian footpaths, logistics loading bays, fire exits, or client car parks to prevent fallen tool or debris strikes.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-5 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    SPECIFICATION 06 // FINANCIAL DISCIPLINE
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Purchase Order Discipline</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Clear PO-driven billing with explicit itemisation of access plant hire, membrane waterproofing materials, licensed waste disposal transfer notes for cleared silt, and labour hours ensuring swift invoice processing and automated payment.
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
                Roofing Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial facilities managers and building surveyors evaluate roofing contractors across working-at-height safety, insurance cover, and trade certifications:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-[#EA580C] font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Insurance Cover Expectations</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Commercial clients and building surveyors set insurance criteria based on working height, building value, and hot works:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Public Liability:</strong> Minimum £5,000,000 indemnity commonly expected; £10,000,000 frequently specified for high-rise or major commercial complexes.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory minimum for all contractors with direct or labour-only personnel.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Height &amp; Hot Works Endorsements:</strong> Specific policy endorsements covering open flame application and unrestricted working at height.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Scheme &amp; Trade Accreditations</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Recognised trade bodies and industry affiliations commonly expected by commercial procurement desks:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>NFRC / CompetentRoofer:</strong> National Federation of Roofing Contractors membership or CompetentRoofer scheme registration.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Safe2Torch:</strong> Registered Safe2Torch contractor certification demonstrating adherence to fire-reduction guidance.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>LRWA:</strong> Liquid Roofing and Waterproofing Association membership where liquid overlays are deployed.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Operative Competence &amp; Site Standards</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Site safety certifications and operative plant credentials required prior to commercial roof access:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>SSIP Accreditation:</strong> Recognised safety schemes (CHAS, SafeContractor, Constructionline) confirming core H&amp;S compliance.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>CSCS Skilled Cards:</strong> Blue or Gold CSCS cards verifying skilled tradesperson status for attending operatives.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>IPAF &amp; PASMA:</strong> Powered access (IPAF 3a/3b) and mobile aluminium tower qualifications for safe access plant operation.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. WHY COMMERCIAL CONTRACTORS NEED STRONG RAMS & HEIGHT SAFETY DOCUMENTATION */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">HEIGHT SAFETY RIGOUR</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Why Commercial Roofing Contractors Need Robust RAMS
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Falls from height remain the primary cause of workplace fatalities in the UK construction and facilities management sectors. Commercial facilities directors, building surveyors, and institutional landlords operate zero-tolerance policies toward generic or incomplete safety documentation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <FileCheck className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Task-Specific Working at Height RAMS</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Hierarchy of Control • Fragile Demarcation • Rescue Planning</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Every commercial roof access request must be accompanied by comprehensive, site-specific <Link href="/contractor-resources/rams/what-are-rams" className="text-[#EA580C] underline font-medium">RAMS documentation</Link>. Review teams verify that access routes, edge protection, and weather suspension limits are formally recorded.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Exact access methodology (fixed companionway ladders, scaffold towers, or MEWP positioning with ground condition checks).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Demarcation and physical load-bearing covers over fragile rooflights, wired glass, and asbestos cement sheets.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Read our in-depth contractor guide on <Link href="/contractor-resources/rams/how-to-write-rams" className="text-[#EA580C] underline font-medium">how to write compliant commercial RAMS</Link>.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Dynamic Risk Assessments &amp; Hot Works Permits</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Safe2Torch • 5x5 Hazard Evaluation • Fire Watches</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Duty holders face criminal prosecution under the Work at Height Regulations 2005 if uncontrolled works occur on their properties. Technical desks require clear evidence of risk mitigation before permits-to-work are countersigned.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Mandatory Safe2Torch zone auditing: identifying timber fillets, combustible insulation, and cladding gaps within 900mm of open flames.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Detailed suspension trauma and harness rescue procedures detailing emergency recovery within 10 minutes of a fall arrest event.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Review our reference on <Link href="/contractor-resources/risk-assessments/what-is-a-risk-assessment" className="text-[#EA580C] underline font-medium">commercial risk assessment principles</Link>.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Professional Responsibility Note */}
            <div className="rounded-sm border border-slate-200 bg-[#FAFAF8] p-5 text-xs text-slate-500 font-light leading-relaxed max-w-4xl mx-auto text-center">
              <strong className="text-slate-800 font-semibold">Professional Competency Notice:</strong> Working at height RAMS, fragile surface demarcations, and emergency rescue plans must always be prepared and countersigned by the contractor's own trained competent persons specific to the physical building structure and access conditions.
            </div>
          </div>
        </section>

        {/* 10. HOW THE CONTRACTOR NETWORK WORKS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <ContractorStepByStep
              eyebrow="ONBOARDING ROADMAP"
              title="How EntireFM's Contractor Network Works"
              subtitle="A clear, structured, and transparent process for commercial roofing contractors."
              steps={ROOFING_STEPS}
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
                Why Roofing Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network connects your roofing business with commercial property maintenance requirements across the UK:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Frameworks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Access commercial facilities management requirements across industrial warehouses, retail centres, and corporate offices.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage NFRC certificates, IPAF cards, and working at height insurance in one centralized portal with automated expiry alerts.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Merit-Based Matching</h3>
                <p className="text-slate-600 leading-relaxed">
                  Work orders are matched based on verified roofing specialisms (single-ply/liquid/felt), access equipment, response time, and location.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Streamlined Admin</h3>
                <p className="text-slate-600 leading-relaxed">
                  Pre-authorised Purchase Orders, structured photo sign-off workflows, and clear invoicing processes aligned with commercial finance teams.
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
              title="Essential Resources for Roofing Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, height safety RAMS, and statutory PPM standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 12. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Roofing Contractor FAQs"
              subtitle="Answers to common questions about height safety, NFRC accreditations, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 13. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Roofing Business Forward for Commercial FM Work"
            description="Join the EntireFM Contractor Network. Complete the online intake, submit your height safety and trade compliance details, and access commercial facilities management opportunities across the UK. £95+VAT annual membership payable upon application submission."
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
