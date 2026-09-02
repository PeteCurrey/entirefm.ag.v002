import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { MembershipTierCards } from '@/components/suppliers/MembershipTierCards';
import { ContractorPlatformPreview } from '@/components/suppliers/ContractorPlatformPreview';
import { ContractorPackShowcase } from '@/components/suppliers/ContractorPackShowcase';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import {
  ShieldCheck,
  Building2,
  Cpu,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Wrench,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  Sliders,
  FileText,
  Calculator,
  Compass,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Lock,
  Clock,
  Check
} from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/partner-network', {
  title: 'EntireFM Partner Network | Contractor Operating Platform & Supply Chain',
  description:
    'Join the EntireFM Partner Network. A professional digital operating environment, compliance infrastructure, business tools, and managed FM supply chain for trade contractors.',
});

export default function PartnerNetworkPublicPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Partner Network', url: '/suppliers/partner-network' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="ENTIREFM PARTNER NETWORK // MANAGED SUPPLY CHAIN &amp; CONTRACTOR PLATFORM"
          title="More than a supplier list."
          subtitle="A complete contractor operating platform."
          intro="EntireFM Partner Network gives trade contractors a professional operating environment designed specifically for commercial FM delivery—combining compliance infrastructure, workforce management, RAMS, job delivery tools, business intelligence, and verified supply chain participation."
          imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
          imageAlt="EntireFM Partner Network directors meeting with regional engineering contractors"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Apply to Join the Network', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Explore the Contractor Platform', href: '#platform-preview' }}
          facts={[
            { figure: 'Contractor Platform', label: 'Digital Operating Hub', detail: 'Work orders, RAMS & business tools' },
            { figure: 'Compliance Vault', label: 'Automated Radar', detail: 'Insurance, certs & audit tracking' },
            { figure: 'Regional Coverage', label: 'National Standards', detail: 'Local craft with corporate governance' },
          ]}
        />

        <TrustBar />

        {/* 2. CORE COMMERCIAL MESSAGE: WHY CONTRACTORS JOIN */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">WHY CONTRACTORS JOIN // VALUE PROPOSITION</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                More than access to work.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                EntireFM Partner Network membership gives contractors access to a professional operating environment designed specifically around commercial FM delivery. Your business gains structured technology, compliance safeguards, and productivity tools that operate every day—not just when a work order arrives.
              </p>
            </div>

            {/* 6 Value Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 01 OPERATE */}
              <div className="p-7 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#EA580C]">
                    <Sliders className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">01 &bull; OPERATE</span>
                  </div>
                  <h3 className="text-lg font-normal text-slate-900">Digital Contractor Platform</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    End-to-end operational execution hub with structured work order dispatch, digital job packs, FM-tailored RAMS, site forms, service reporting, and timestamped photo evidence capture.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-light">
                  Work orders &bull; RAMS &bull; Job Packs &bull; Digital Forms
                </div>
              </div>

              {/* 02 CONTROL */}
              <div className="p-7 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">02 &bull; CONTROL</span>
                  </div>
                  <h3 className="text-lg font-normal text-slate-900">Compliance &amp; Document Vault</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Automated surveillance of insurance policies, trade bodies (Gas Safe, NICEIC, Refcom), and operative certifications with proactive expiry alerts before work eligibility is impacted.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-light">
                  Insurance radar &bull; Document storage &bull; Audit history
                </div>
              </div>

              {/* 03 GROW */}
              <div className="p-7 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <TrendingUp className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">03 &bull; GROW</span>
                  </div>
                  <h3 className="text-lg font-normal text-slate-900">Business Tools &amp; Margin Calculators</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Practical commercial calculators for true hourly labour cost recovery, project gross margins, call-out rate matrices, engineer utilisation, and corporate partner positioning.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-light">
                  Labour recovery &bull; Margin modeler &bull; Verified badge
                </div>
              </div>

              {/* 04 STAY INFORMED */}
              <div className="p-7 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Compass className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">04 &bull; STAY INFORMED</span>
                  </div>
                  <h3 className="text-lg font-normal text-slate-900">Regulatory Intelligence &amp; Watch</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Personalised compliance updates, Companies House filing tracking, trade-specific statutory updates (Building Safety Act, F-Gas phase-down, BS7671), and technical safety alerts.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-light">
                  Company Watch &bull; Credential Watch &bull; Safety alerts
                </div>
              </div>

              {/* 05 CONNECT */}
              <div className="p-7 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-cyan-600">
                    <Users className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">05 &bull; CONNECT</span>
                  </div>
                  <h3 className="text-lg font-normal text-slate-900">EntireFM Supply Chain &amp; OEM Network</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Direct access to EntireFM procurement teams, regional technical breakfasts, manufacturer product sessions, OEM alliances, and continuing professional development (CPD) forums.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-light">
                  Technical forums &bull; OEM partnerships &bull; Regional events
                </div>
              </div>

              {/* 06 WORK */}
              <div className="p-7 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#EA580C]">
                    <Briefcase className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">06 &bull; WORK</span>
                  </div>
                  <h3 className="text-lg font-normal text-slate-900">Managed Supply Chain Allocation</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Potential work opportunities across EntireFM client estates where declared capabilities, trade competencies, regional coverage, and live client demand align.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-light">
                  Digital dispatch &bull; Prompt payment &bull; Capability matching
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MAJOR PRODUCT VISUAL: THE CONTRACTOR OPERATING PLATFORM */}
        <section id="platform-preview" className="py-24 bg-[#FAF9FB] border-b border-slate-200 scroll-mt-12">
          <div className="container-wide">
            <div className="max-w-3xl mb-12">
              <span className="eyebrow eyebrow-light">THE PRODUCT DEMONSTRATION</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                This is what you&apos;re actually getting for your membership.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Your EntireFM membership gives your business a professional operating environment for compliance, workforce management, RAMS, job delivery, documentation, and business productivity.
              </p>
            </div>

            {/* Interactive / Controlled Product Preview */}
            <ContractorPlatformPreview />

            <div className="mt-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-sm bg-white border border-slate-200 text-xs text-slate-600 font-light">
              <div>
                <strong>Single login. Complete clarity.</strong> Approved contractors operate directly within this interface across desktop, tablet, and mobile browsers.
              </div>
              <Link href="/suppliers/apply" className="btn-primary text-xs py-2 px-4 shrink-0 font-medium">
                Apply for Member Access &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* 4. WHAT YOU GET (6 CORE OPERATING CAPABILITIES) */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">COMPREHENSIVE CAPABILITIES</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Everything you need to operate as a modern FM contractor.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                EntireFM membership brings the tools contractors normally have to assemble across separate third-party systems into one professional operating environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 01 */}
              <div className="space-y-3 p-6 rounded-sm border border-slate-200 bg-[#FAF9FB]">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  01 &bull; Contractor Control Centre
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  Operational command &amp; live pipeline
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Real-time work queue showing pending offers, active site visits, engineer attendance, critical compliance alerts, and purchase order tracking from a single dashboard.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80 font-light">
                  <li className="flex items-center gap-1.5">&bull; Live work assignment queue</li>
                  <li className="flex items-center gap-1.5">&bull; Attendance &amp; status tracking</li>
                  <li className="flex items-center gap-1.5">&bull; Company-level compliance score</li>
                </ul>
              </div>

              {/* Feature 02 */}
              <div className="space-y-3 p-6 rounded-sm border border-slate-200 bg-[#FAF9FB]">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  02 &bull; Compliance &amp; Document Vault
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  Secure storage &amp; expiry radar
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Centralised document vault for insurance schedules, statutory bodies, waste carrier licences, and health &amp; safety policies with automated 90/60/30-day renewal radar.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80 font-light">
                  <li className="flex items-center gap-1.5">&bull; Policy expiry alerts &amp; reminders</li>
                  <li className="flex items-center gap-1.5">&bull; Immutable audit trail of evidence</li>
                  <li className="flex items-center gap-1.5">&bull; Scoped trade qualification verification</li>
                </ul>
              </div>

              {/* Feature 03 */}
              <div className="space-y-3 p-6 rounded-sm border border-slate-200 bg-[#FAF9FB]">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  03 &bull; RAMS &amp; Job Packs
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  FM risk assessments &amp; site packs
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Fast risk assessment builder tailored to commercial FM environments (hot works, height, live M&amp;E, confined space) with digital operative briefings and job pack assembly.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80 font-light">
                  <li className="flex items-center gap-1.5">&bull; FM-specific hazard &amp; control library</li>
                  <li className="flex items-center gap-1.5">&bull; Digital operative sign-off &amp; briefing</li>
                  <li className="flex items-center gap-1.5">&bull; Integrated job pack site documents</li>
                </ul>
              </div>

              {/* Feature 04 */}
              <div className="space-y-3 p-6 rounded-sm border border-slate-200 bg-[#FAF9FB]">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  04 &bull; Workforce &amp; Competency
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  Engineer skill matrix &amp; cards
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Maintain complete records for every field operative: CSCS/ECS/JIB cards, Gas Safe licenses, F-Gas qualifications, IPAF, PASMA, and client site induction verifications.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80 font-light">
                  <li className="flex items-center gap-1.5">&bull; Individual engineer qualification matrix</li>
                  <li className="flex items-center gap-1.5">&bull; Automated operative eligibility check</li>
                  <li className="flex items-center gap-1.5">&bull; Training &amp; renewal surveillance</li>
                </ul>
              </div>

              {/* Feature 05 */}
              <div className="space-y-3 p-6 rounded-sm border border-slate-200 bg-[#FAF9FB]">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  05 &bull; Business Tools
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  Cost calculators &amp; margin tools
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Instant commercial calculators designed specifically for UK maintenance contractors: calculate accurate hourly overhead recovery, project margins, call-out matrices, and PPM pricing.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80 font-light">
                  <li className="flex items-center gap-1.5">&bull; Hourly labour rate recovery tool</li>
                  <li className="flex items-center gap-1.5">&bull; Job gross margin simulator</li>
                  <li className="flex items-center gap-1.5">&bull; 24/7 call-out &amp; travel matrix</li>
                </ul>
              </div>

              {/* Feature 06 */}
              <div className="space-y-3 p-6 rounded-sm border border-slate-200 bg-[#FAF9FB]">
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  06 &bull; Contractor Intelligence
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  Statutory surveillance &amp; watch
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Proactive intelligence including Companies House filing monitoring (Company Watch), statutory trade surveillance (Credential Watch), Building Safety Act updates, and technical alerts.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80 font-light">
                  <li className="flex items-center gap-1.5">&bull; Company Watch good-standing checks</li>
                  <li className="flex items-center gap-1.5">&bull; Trade statutory briefings &amp; safety bulletins</li>
                  <li className="flex items-center gap-1.5">&bull; Regional CPD and technical events</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. EXPLAIN THE MEMBERSHIP FEE & NOT A PAY-TO-WORK SCHEME */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left column: Transparency on the fee */}
              <div className="lg:col-span-7 space-y-6">
                <span className="eyebrow eyebrow-light">COMMERCIAL TRANSPARENCY</span>
                <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                  Why is there a membership fee?
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                  <p>
                    EntireFM operates a managed, professionally governed supply chain rather than an open contractor directory. Membership helps fund and support the secure technology platform, compliance infrastructure, document verification processes, and operational toolsets that sit behind the network.
                  </p>
                  <p>
                    Contractors receive ongoing business value every day—from statutory document storage and risk assessments to labour calculators and regulatory surveillance—independently of whether an EntireFM work order arrives tomorrow.
                  </p>
                </div>

                {/* Restrained Trust Statement */}
                <div className="p-6 bg-white border-l-4 border-slate-900 rounded-sm border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900">
                    <ShieldCheck className="h-4 w-4 text-[#EA580C]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Membership does not buy work.
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    EntireFM does not guarantee a volume of work, minimum spend, or priority allocation simply because a contractor holds membership. Work is allocated strictly according to operational requirements, capability, geography, compliance status, workforce competency, availability, and client/site specifications.
                  </p>
                </div>
              </div>

              {/* Right column: Membership Value Stack */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-8 rounded-sm shadow-xs space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
                    INFRASTRUCTURE &amp; SERVICE SUPPORT
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Your Membership Supports
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    The ongoing operational infrastructure provided to your business:
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { num: '01', title: 'Compliance Infrastructure', desc: 'Continuous verification and statutory monitoring' },
                    { num: '02', title: 'Contractor Operating Platform', desc: 'Work orders, digital dispatch, and reporting' },
                    { num: '03', title: 'Workforce & Competency Management', desc: 'Engineer skill matrix, qualifications, and card audits' },
                    { num: '04', title: 'RAMS & Job Pack Technology', desc: 'FM risk assessment generator and site packs' },
                    { num: '05', title: 'Business Productivity Tools', desc: 'Labour rate, margin, and call-out calculators' },
                    { num: '06', title: 'Regulatory & Technical Intelligence', desc: 'Company Watch, Credential Watch, and safety bulletins' },
                    { num: '07', title: 'Managed Network Participation', desc: 'Verified status across EntireFM regional hubs' },
                    { num: '08', title: 'Technical Events & Industry Access', desc: 'OEM alliances, manufacturer days, and technical breakfasts' },
                  ].map((item) => (
                    <div key={item.num} className="p-2.5 rounded bg-[#FAF9FB] border border-slate-100 flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-[#EA580C] shrink-0 mt-0.5">
                        {item.num}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500 font-light">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. A PLATFORM, NOT A DIRECTORY */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <span className="eyebrow eyebrow-light">GOVERNANCE &amp; DIFFERENTIATION</span>
              <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                A contractor operating platform, not another supplier directory.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
                EntireFM is not simply collecting contractor names and phone numbers to sell leads. Approved partners operate within a structured digital environment covering compliance, documents, workforce competencies, risk, work execution, and operational intelligence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
                <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Open Directories / Lead Sites
                  </div>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Unverified contact listings, pay-per-lead models, race-to-the-bottom bidding, and zero operational tools.
                  </p>
                </div>

                <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Fragmented SaaS Apps
                  </div>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Separate monthly fees for compliance vaults, RAMS creators, margin calculators, and training matrices.
                  </p>
                </div>

                <div className="p-5 rounded-sm bg-white border-2 border-slate-900 space-y-2 shadow-xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
                    EntireFM Partner Network
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Integrated operating environment, verified supply chain status, statutory surveillance, and commercial FM tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. THE CONTRACTOR JOURNEY */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">STRUCTURED LIFECYCLE</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                The Contractor Network Journey
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                A clear, transparent 6-stage lifecycle from initial application to ongoing operational growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Apply',
                  desc: 'Declare your company details, genuine trade capabilities, geographic coverage, and initial compliance documentation.',
                },
                {
                  step: '02',
                  title: 'Verify',
                  desc: 'EntireFM due diligence team reviews your statutory evidence, insurance levels, and trade qualifications.',
                },
                {
                  step: '03',
                  title: 'Activate',
                  desc: 'Approved contractors activate their membership, complete onboarding, and access the Contractor Platform.',
                },
                {
                  step: '04',
                  title: 'Operate',
                  desc: 'Manage jobs, generate RAMS, build job packs, register operatives, and capture verified fieldwork evidence.',
                },
                {
                  step: '05',
                  title: 'Maintain',
                  desc: 'Stay ahead of insurance renewals, engineer card expiries, and regulatory developments with automated surveillance.',
                },
                {
                  step: '06',
                  title: 'Grow',
                  desc: 'Use business calculators, technical briefings, OEM alliances, and network participation to operate more profitably.',
                },
              ].map((stage) => (
                <div key={stage.step} className="p-6 bg-white border border-slate-200 rounded-sm space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#EA580C] px-2 py-0.5 rounded bg-orange-50 border border-orange-200">
                      STAGE {stage.step}
                    </span>
                    <span className="text-xs font-medium text-slate-400">Lifecycle</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{stage.title}</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. REGIONAL NETWORK COVERAGE (REFINED WITHOUT RESTRICTIONS) */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">REGIONAL NETWORK COVERAGE</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Local capability. National standards.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                EntireFM builds its contractor network around regional coverage, response capability, and specialist expertise. Contractors can declare the trades and geographical areas they genuinely operate within, allowing EntireFM to build an accurate picture of supply-chain capability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  region: 'North West & Midlands',
                  hub: 'Manchester & Birmingham',
                  coverage: 'Greater Manchester, Merseyside, Cheshire, West Midlands, Derbyshire',
                  trades: ['Commercial Gas & Heating', 'Chiller & HVAC PPM', 'Emergency Drainage', 'Security & Access'],
                },
                {
                  region: 'Yorkshire & North East',
                  hub: 'Leeds & Newcastle',
                  coverage: 'West Yorkshire, South Yorkshire, Tyne & Wear, County Durham',
                  trades: ['M&E Building Services', 'Fixed Wire Testing (EICR)', 'Rooftop Safety & Fabric', 'Grounds Maintenance'],
                },
                {
                  region: 'London & South East',
                  hub: 'London & Home Counties',
                  coverage: 'Greater London, Surrey, Kent, Essex, Hertfordshire, Berkshire',
                  trades: ['Façade & Height Access', 'BMS Controls & Niagara', 'Fire Alarms & Detection', 'Water Hygiene (L8)'],
                },
                {
                  region: 'South West & Wales',
                  hub: 'Bristol & Cardiff',
                  coverage: 'Bristol, Gloucestershire, Somerset, South Wales, Devon',
                  trades: ['Commercial Plumbing', 'Refrigeration & Cold Stores', 'Automatic Gates & Barriers', 'Specialist Cleaning'],
                },
              ].map((hub, idx) => (
                <div key={idx} className="p-7 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#EA580C]">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="text-xs font-medium uppercase tracking-wider">{hub.region}</span>
                    </div>
                    <h3 className="text-lg font-light text-slate-900">{hub.hub}</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">{hub.coverage}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                      EXAMPLES OF REGIONAL CAPABILITY
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {hub.trades.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10.5px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-light">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Non-restrictive trade clarification notice */}
            <div className="mt-8 p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm text-xs text-slate-600 font-light flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
              <div>
                <strong>Non-Exhaustive Scope:</strong> Examples shown are illustrative rather than an exhaustive list of trades or current work requirements. The network is not restricted to the disciplines listed above. Contractors are encouraged to declare all genuine service capabilities and regional coverage during application.
              </div>
            </div>
          </div>
        </section>

        {/* 8b. PHYSICAL CONTRACTOR PACK & CREDENTIALS */}
        <ContractorPackShowcase
          eyebrow="TANGIBLE CREDENTIALS // ONBOARDING PACK"
          title="Physical Contractor Welcome Pack &amp; Verified ID"
          subtitle="Every verified contractor network partner receives our bespoke physical onboarding pack with their QR-verified operative ID card, branded site PPE, partner card, and contractor handbook."
        />

        {/* 9. COMMERCIAL MEMBERSHIP TIERS */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">COMMERCIAL TIERS</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Transparent Partner Network Tiers
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Choose the participation tier that matches your operational scale, team size, and business requirements. EntireFM Invitation Codes are accepted across all tiers.
              </p>
            </div>

            <MembershipTierCards />
          </div>
        </section>

        {/* 10. WORK ALLOCATION TRANSPARENCY */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-12">
              <span className="eyebrow eyebrow-light">WORK ALLOCATION PRINCIPLES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Become part of the supply chain that delivers EntireFM work.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Once approved and active on the platform, contractors may be considered for work order assignments matching their operational profile. Work allocation remains strictly operationally driven:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Declared Services &amp; Trade Scope
                </div>
                <p className="text-xs text-slate-600 font-light">
                  Work orders are dispatched to suppliers with verified competencies in the specific engineering discipline required.
                </p>
              </div>

              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Geographical Coverage
                </div>
                <p className="text-xs text-slate-600 font-light">
                  Dispatch algorithms match properties with contractors operating within genuine emergency and standard response radii.
                </p>
              </div>

              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Compliance &amp; Insurance Status
                </div>
                <p className="text-xs text-slate-600 font-light">
                  Only organisations with 100% active, verified insurances and mandatory statutory credentials receive automated dispatch offers.
                </p>
              </div>

              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Workforce Competency
                </div>
                <p className="text-xs text-slate-600 font-light">
                  Tasks requiring specific cards (Gas Safe, F-Gas, 18th Edition, CSCS) require registered operatives with verified credentials.
                </p>
              </div>

              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Client &amp; Site Requirements
                </div>
                <p className="text-xs text-slate-600 font-light">
                  Specific site security clearance, DBS checks, or heritage restrictions are matched to contractor team profiles.
                </p>
              </div>

              <div className="p-5 rounded-sm bg-[#FAF9FB] border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Operational Performance
                </div>
                <p className="text-xs text-slate-600 font-light">
                  On-time first-time fix rates, RAMS quality, and evidence turnaround inform continued commercial allocation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 11. PARTNER EVENTS STRIP (TECHNICAL COLLABORATION) */}
        <section className="py-24 bg-brand-graphite text-white border-t border-b border-brand-edge-dark relative overflow-hidden">
          <div className="container-wide relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-[11px] font-normal uppercase tracking-wider text-[#EA580C] block font-medium">
                  TECHNICAL COLLABORATION // EVENTS HUB
                </span>
                <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
                  Connect at EntireFM Partner Forums &amp; Technical Sessions
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  We host technical breakfasts, manufacturer product demonstrations, and supply chain summits where contractors, OEMs, and property leaders meet to discuss statutory updates and new technology.
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Link href="/suppliers/events" className="btn-primary">
                    View 2026 Event Programme <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/suppliers/industry-partners" className="btn-ghost-light">
                    Explore OEM Alliances
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-950/90 border border-slate-800 rounded-sm p-8 sm:p-10 shadow-2xl space-y-4">
                <div className="flex items-center gap-3 text-[#EA580C]">
                  <Calendar className="h-5 w-5 shrink-0" />
                  <span className="text-xs uppercase tracking-wider font-medium">UPCOMING FORUMS</span>
                </div>
                <h3 className="text-xl font-light text-white">
                  Regional Technical Breakfasts &amp; Briefings
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Join our Manchester, Birmingham, and London sessions covering Building Safety Act golden thread compliance, Heat Pump retrofits, and F-Gas statutory transition milestones.
                </p>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-light">Included for registered network partners</span>
                  <Link href="/suppliers/events" className="text-xs text-[#EA580C] hover:underline flex items-center gap-1 font-light">
                    Register Interest <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12. CALL TO ACTION */}
        <section className="py-20 bg-white border-b border-slate-200 text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <span className="eyebrow eyebrow-light">JOIN THE NETWORK</span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900">
              Apply to the EntireFM Partner Network
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
              Equip your business with a professional contractor operating environment, statutory compliance vault, business calculators, and managed FM supply chain participation.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Apply to Join the Network <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login?redirect=/contractor" className="btn-ghost-dark">
                Sign In to Supplier Portal
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="PARTNER NETWORK"
          heading="Related supplier information"
          links={[
            {
              title: 'How We Work',
              href: '/suppliers/how-we-work',
              description: 'End-to-end 12-stage operational journey, work allocation, and fair payment.',
              tag: 'PROCESS',
            },
            {
              title: 'Events & Forums',
              href: '/suppliers/events',
              description: 'Technical breakfasts, manufacturer open days, and regional networking forums.',
              tag: 'EVENTS',
            },
            {
              title: 'Partner Network Framework',
              href: '/suppliers/membership',
              description: 'Partner Network capability tiers, technical standards, and governance firewalls.',
              tag: 'FRAMEWORK',
            },
            {
              title: 'Industry & OEM Partners',
              href: '/suppliers/industry-partners',
              description: 'Direct manufacturer equipment partnerships and factory-backed training.',
              tag: 'OEM',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
