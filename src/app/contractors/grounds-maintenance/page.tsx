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
  Activity,
  Award,
  Flame,
  Wrench,
  Layers,
  Search,
  Eye,
  Umbrella,
  Snowflake,
  Shovel,
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
      'Submit your landscaping company details, machinery fleet (zero-turn mowers, tractor flails, gritters), and operating regions.',
    badge: 'Step 1',
  },
  {
    step: 2,
    title: 'Provide Business & Compliance Details',
    description:
      'Upload your NPTC PA1/PA6 pesticide licences, NPTC arborist certificates, Waste Carrier Licence, and Public Liability insurance.',
    badge: 'Step 2',
  },
  {
    step: 3,
    title: 'Submit Application',
    description:
      'Declare your winter maintenance fleet capabilities (3.5t/tractor spreaders, snow ploughs) and GPS tracking systems.',
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
      'EntireFM reviews your pesticide handling RAMS, arborist tree survey competencies, and green waste disposal auditing.',
    badge: 'Step 5',
  },
  {
    step: 6,
    title: 'Consideration for Work Orders',
    description:
      'Approved contractors enter our active supplier network for merit-based consideration across seasonal landscape PPM and winter gritting packages.',
    badge: 'Step 6',
  },
];

export default function GroundsMaintenanceContractorPage() {
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
              name: 'Commercial Grounds Maintenance Contractor Network',
              serviceType: 'Facilities Management Commercial Grounds Maintenance Contractor Onboarding & Contract Allocation',
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
            { figure: 'NPTC PA1/PA6 & BALI', label: 'Statutory Standard', detail: 'Machinery & chemical audited' },
            { figure: 'Merit-Based', label: 'Work Matching', detail: 'PPM & winter gritting' },
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

        {/* 3. WHAT COMMERCIAL FM GROUNDS CARE INVOLVES */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ORDER PROFILES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                What Commercial FM Grounds Maintenance Work Can Involve
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial grounds care requires heavy commercial machinery, chemical pesticide compliance under the Plant Protection Products Regulations, and winter weather responsiveness:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Trees className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Amenity Grass Mowing &amp; Edging</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Scheduled 14-day rotational mowing cycles across business parks, distribution centres, and retail verges using commercial zero-turn mowers, mechanical kerb strimming, and blown grass dispersal.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">NPTC Chemical Weed Control (PA1 / PA6)</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Targeted non-glyphosate and amenity herbicide application on hard standing, car park kerb lines, block paving, and gravel borders strictly adhering to pesticide application records and watercourse buffer zones.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">BS 5837 Tree Hazard Surveys &amp; Arboriculture</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Statutory tree safety surveys (QTRA/VTA methodology), crown lifting above vehicle roadways/car parks, deadwood removal, and emergency storm damage clearance by certified NPTC arborists.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Snowflake className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Winter Gritting &amp; Road De-Icing Services</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Automated Met Office OpenRoad forecast dispatch. Spreading white marine de-icing salt across private estate roadways, loading yards, and footpaths before 07:00 with automated GPS vehicle tracking logs.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Shovel className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Shrub Pruning, Mulching &amp; Bed Care</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Formative pruning of amenity shrubs, seasonal rose bed maintenance, organic bark mulch replenishment, perimeter hedge flailing, and weed suppression across corporate landscaping borders.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 hover:border-[#EA580C]/40 transition-all">
                <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">SUDS Attenuation Basin &amp; Pond Maintenance</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Maintaining sustainable urban drainage systems (SUDS), swales, and balancing ponds: reed bed management, bank vegetation flailing, silt trap inspection, and hydro-brake outfall clearing.
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
                Where Commercial Grounds Maintenance Contractors Operate
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial grounds maintenance contractors operate across diverse environments requiring specialized traffic management and high-output machinery:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Business &amp; Science Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-profile corporate entrance features, manicured lawns, decorative water features, and formal tree avenues.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Distribution &amp; Logistics Hubs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Large perimeter fence line clearance, heavy vehicle sightlines, SUDS attenuation swales, and loading bay gritting.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Retail &amp; Leisure Parks</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Customer car park shrub beds, pedestrian walkway weed management, automated gritting, and daily litter picking.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Trees className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Industrial Estates &amp; Depots</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Rough grass flailing, scrub clearance, boundary security hedge management, and weed eradication on hard standing.
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
                Seasonal Grounds PPM vs Emergency Winter Gritting &amp; Storm Response
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Grounds management combines cyclical summer landscape maintenance with rapid weather-triggered winter de-icing and tree hazard response.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Summer Landscape Maintenance (PPM)</h3>
                    <p className="text-slate-500 text-[11px] font-mono">March to October • 14-Day Cycle • SFG20 Grounds Care</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Scheduled according to <Link href="/contractor-resources/facilities-management/what-is-ppm" className="text-[#EA580C] underline font-medium">SFG20 maintenance standards</Link> to maintain corporate estate presentation, preserve line-of-sight road safety, and control vegetation.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Fortnightly grass cutting, strimming around bollards/posts, and blow-down clearing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>NPTC weed spraying on kerb lines, paved walkways, and building perimeter gravel.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Shrub bed hoeing, seasonal pruning, and hedge height reduction outside nesting season.</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-900 text-white rounded-sm">
                    <Snowflake className="w-5 h-5 text-[#EA580C]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Winter Gritting &amp; Reactive Storm Clear</h3>
                    <p className="text-slate-500 text-[11px] font-mono">November to April • Met Office Triggers • 24/7 Priority</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Automated forecast-activated winter salt spreading to eliminate slip/skid liability, alongside urgent call-outs for storm-damaged fallen trees blocking estate roadways.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Pre-salt spreading triggered when road surface temperatures fall below 0°C.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Automated GPS track logging and salt application rate recording (15-25g/m²).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Emergency arborist chainsaw crews dispatched within 2 hours to clear fallen branches.</span>
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
                What Commercial FM Clients Expect from Grounds Maintenance Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities managers, estate surveying teams, and property management companies require rigorous technical competence, machinery safety, and environmental auditing:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-base font-semibold text-slate-900">NPTC Pesticide Governance</h3>
                <p className="text-slate-600 leading-relaxed">
                  Operatives applying herbicides must hold NPTC PA1 &amp; PA6 qualifications, maintain formal chemical application logbooks, and observe environmental buffer zones near drains and watercourses.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-base font-semibold text-slate-900">Machinery Safety &amp; Deflectors</h3>
                <p className="text-slate-600 leading-relaxed">
                  All commercial mowers and strimmers must be fitted with stone-deflector guards to protect parked vehicles and pedestrians. Operatives must establish exclusion zones and wear full PPE.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-base font-semibold text-slate-900">Green Waste Transfer Auditing</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  All arborist timber, hedge clippings, and organic waste removed from site must be documented under a valid Environment Agency Waste Carrier Licence and tipped at licensed composting facilities.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  04
                </div>
                <h3 className="text-base font-semibold text-slate-900">GPS Gritting Proof</h3>
                <p className="text-slate-600 leading-relaxed">
                  Winter gritting operations must be validated with automated vehicle tracking data, time of spread confirmation, and weather forecast reports to protect clients against slip-and-fall claims.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  05
                </div>
                <h3 className="text-base font-semibold text-slate-900">Wildlife &amp; Nesting Bird Law</h3>
                <p className="text-slate-600 leading-relaxed">
                  Strict compliance with the Wildlife and Countryside Act 1981. Conducting pre-work nesting bird checks before executing any major hedge trimming or tree felling between March and August.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold">
                  06
                </div>
                <h3 className="text-base font-semibold text-slate-900">Purchase Order Discipline</h3>
                <p className="text-slate-600 leading-relaxed">
                  Monthly seasonal invoicing matching pre-authorised Purchase Orders, with explicit itemisation of gritting activations and additional tree works for rapid sign-off.
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
                Grounds Maintenance Compliance &amp; Competence Framework
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Requirements reflect chemical safety legislation, arborist liability, and commercial plant machinery standards:
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
                    <span><strong>Public Liability:</strong> Minimum £5,000,000 (£10,000,000 for major logistics parks).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Employers Liability:</strong> £10,000,000 statutory minimum.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#EA580C] font-bold">&bull;</span>
                    <span><strong>Arborist Endorsement:</strong> Aerial tree surgery indemnity insurance.</span>
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
                    <span><strong>BALI / Amenity Forum:</strong> British Association of Landscape Industries membership.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Arb Association:</strong> Approved Contractor status for tree surgery operations.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span><strong>Waste Carrier Licence:</strong> Upper Tier Environment Agency registration.</span>
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
                    <span><strong>NPTC PA1/PA6:</strong> Foundation and Knapsack Pesticide Application Licences.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>NPTC CS30/CS31:</strong> Chainsaw maintenance and small tree felling.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>LANTRA Awards:</strong> Commercial ride-on mower and winter gritting certificates.</span>
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
              subtitle="A clear, structured, and transparent process for putting your grounds maintenance business forward."
              steps={GROUNDS_STEPS}
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
                Why Grounds Maintenance Contractors Join EntireFM
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Joining the EntireFM Contractor Network puts your machinery and arborist teams in front of commercial facilities management contracts:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-light">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Commercial Frameworks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Put your business directly in front of annual landscape tenders across business parks, retail centres, and logistics hubs.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Compliance Vault</h3>
                <p className="text-slate-600 leading-relaxed">
                  Store and manage NPTC pesticide licences, chainsaw certificates, and waste carrier credentials with automated expiry tracking.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Merit-Based Matching</h3>
                <p className="text-slate-600 leading-relaxed">
                  Contracts are awarded based on verified machinery fleet capacity, pesticide certifications, arborist capabilities, and proximity.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Streamlined Admin</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clear Purchase Orders, structured seasonal billing schedules, and straightforward electronic invoicing aligned with commercial accounts.
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
              title="Essential Resources for Grounds Maintenance Contractors"
              subtitle="Deepen your knowledge of commercial facilities management procurement, pesticide safety RAMS, and statutory PPM standards."
              links={config.relatedLinks}
            />
          </div>
        </section>

        {/* 12. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Commercial Grounds Maintenance Contractor FAQs"
              subtitle="Answers to common questions about NPTC licensing, winter gritting contracts, work allocation, and network membership."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 13. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="APPLY TO JOIN"
            title="Put Your Grounds Maintenance Business Forward for Commercial FM Work"
            description="Join the EntireFM Contractor Network. Complete the online intake, submit your machinery and NPTC compliance details, and access commercial facilities management opportunities across the UK. £95+VAT annual membership payable upon application submission."
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
