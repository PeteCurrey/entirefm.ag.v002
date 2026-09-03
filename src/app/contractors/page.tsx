import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContractorCinematicHero } from '@/components/contractors/ContractorCinematicHero';
import { ContractorFaqAccordion } from '@/components/contractors/ContractorFaqAccordion';
import { ContractorConversionBanner } from '@/components/contractors/ContractorConversionBanner';
import { ContractorRelatedGrid } from '@/components/contractors/ContractorRelatedGrid';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { CONTRACTOR_COMMERCIAL_PAGES } from '@/config/contractor-seo-data';
import {
  Zap,
  Cog,
  Wind,
  Droplets,
  Shield,
  Sparkles,
  Flame,
  Trees,
  Hammer,
  Waves,
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
  FileCheck,
  Users,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors'];

export const metadata: Metadata = generateRouteMetadata('/contractors', {
  title: config.metaTitle,
  description: config.metaDescription,
});

const TRADES = [
  {
    slug: 'electrical',
    name: 'Electrical Contractors',
    icon: Zap,
    desc: 'Commercial electrical installations, testing (EICR), switchgear inspections, and emergency repairs.',
    certs: '18th Edition BS7671 • NICEIC / NAPIT • ECS Gold Card',
  },
  {
    slug: 'mechanical',
    name: 'Mechanical Contractors',
    icon: Cog,
    desc: 'Commercial pump sets, pressurisation units, valves, plantroom maintenance, and calorifier overhauls.',
    certs: 'City & Guilds Mechanical • Water Regs • CSCS Skilled',
  },
  {
    slug: 'hvac',
    name: 'HVAC Contractors',
    icon: Wind,
    desc: 'Commercial chillers, AHUs, VRF/VRV air conditioning, ventilation, and statutory F-Gas refrigerant testing.',
    certs: 'Refcom Elite • F-Gas Cat 1 • City & Guilds 2079',
  },
  {
    slug: 'plumbing',
    name: 'Plumbing & Gas Contractors',
    icon: Droplets,
    desc: 'Commercial hot and cold water services, booster pumps, sanitaryware, leak tracing, and TMV servicing.',
    certs: 'Gas Safe (Commercial/Domestic) • WRAS • JIB-PMES',
  },
  {
    slug: 'roofing',
    name: 'Roofing Contractors',
    icon: Shield,
    desc: 'Commercial flat roofing, gutter maintenance, cladding, liquid membranes, and safe working at height.',
    certs: 'NFRC • Working at Height • IPAF / PASMA',
  },
  {
    slug: 'cleaning',
    name: 'Cleaning Contractors',
    icon: Sparkles,
    desc: 'Contract commercial office cleaning, industrial deep cleans, builders cleans, and hygiene controls.',
    certs: 'BICSc Standard • COSHH Certified • Public Liability £5m+',
  },
  {
    slug: 'fire-security',
    name: 'Fire & Security Contractors',
    icon: Flame,
    desc: 'Fire alarms, emergency lighting, access control, CCTV, intruder alarms, and statutory BS5839 servicing.',
    certs: 'BAFE / FIA • NSI / SSAIB • 18th Edition',
  },
  {
    slug: 'grounds-maintenance',
    name: 'Grounds Maintenance Contractors',
    icon: Trees,
    desc: 'Commercial estate landscaping, grass cutting, weed control, tree surgery, hedge maintenance, and winter gritting.',
    certs: 'NPTC / City & Guilds • PA1/PA6 Pesticide • LANTRA',
  },
  {
    slug: 'fabric-maintenance',
    name: 'Fabric Maintenance Contractors',
    icon: Hammer,
    desc: 'Commercial joinery, plastering, painting, glazing, fire doors, locksmithing, and general building fabric repairs.',
    certs: 'CSCS Trade Certified • BM TRADA Fire Door • Asbestos Awareness',
  },
  {
    slug: 'drainage',
    name: 'Drainage Contractors',
    icon: Waves,
    desc: 'High-pressure water jetting (HPWJ), CCTV surveys, grease traps, unblocking, and interceptor maintenance.',
    certs: 'WJA Certified • Confined Space • Street Works (NRSWA)',
  },
];

export default function ContractorsMainHub() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* Product / Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'EntireFM Facilities Management Contractor Network',
              serviceType: 'Contractor Network & Commercial FM Platform',
              provider: {
                '@type': 'Organization',
                name: 'EntireFM',
                url: 'https://www.entirefm.com',
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
          primaryCta={{ label: 'Join Contractor Network', href: '/contractors/join' }}
          secondaryCta={{ label: 'How the Network Works', href: '/contractors/find-work' }}
          facts={[
            { figure: '£95 / yr', label: 'Annual Membership', detail: 'Payable on submission' },
            { figure: '10 Trades', label: 'Specialist Disciplines', detail: 'Hard & soft building services' },
            { figure: 'Merit-Based', label: 'Work Allocation', detail: 'Capability & compliance driven' },
          ]}
        />

        {/* 2. VALUE PROPOSITION & OVERVIEW */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-6 space-y-5">
                <span className="eyebrow eyebrow-light">THE ENTIREFM PROPOSITION</span>
                <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                  A Professional Contractor Network Built for Modern Commercial FM
                </h2>
                <p className="text-sm sm:text-base font-light text-slate-600 leading-relaxed">
                  EntireFM manages comprehensive facilities management, planned maintenance (PPM), and reactive building services contracts across corporate offices, industrial logistics hubs, retail parks, and commercial property portfolios nationwide.
                </p>
                <p className="text-sm sm:text-base font-light text-slate-600 leading-relaxed">
                  To deliver consistent operational excellence on the ground, we work closely with an approved panel of specialist trade contractors. Our network provides regional contractors with direct visibility to relevant commercial work orders, structured digital job packs, and an operating environment built around transparency and prompt payment.
                </p>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                  <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Commercial Environments</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Work across prime corporate offices, logistics distribution centres, light industrial parks, and multi-tenant commercial property.
                  </p>
                </div>

                <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                  <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Compliance Infrastructure</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Automated Document Vault tracking for insurance schedules, SSIP accreditations, and engineer competency certifications.
                  </p>
                </div>

                <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                  <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Merit-Based Dispatch</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Job matching based strictly on contractor capability, operating radius, verified accreditations, and SLA performance.
                  </p>
                </div>

                <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2.5">
                  <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">£95 Annual Membership</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    One straightforward annual membership payable during application submission. Transparent, fair, and professional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRADE DISCIPLINES */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">CORE DISCIPLINES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                Specialist Trades We Engage
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                EntireFM contracts specialist businesses across 10 commercial disciplines. Explore trade-specific compliance frameworks and requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TRADES.map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.slug}
                    className="p-6 bg-white border border-slate-200 rounded-sm hover:border-[#EA580C]/40 hover:shadow-sm transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="p-2.5 bg-slate-900 text-white rounded-sm group-hover:bg-[#EA580C] transition-colors">
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          APPROVED DISCIPLINE
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#EA580C] transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {t.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                      {t.certs}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. HOW THE NETWORK WORKS */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">APPLICATION &amp; ONBOARDING ROADMAP</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                How the EntireFM Contractor Network Works
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                A transparent, 4-stage intake process from initial qualification through to active job dispatch consideration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {[
                {
                  step: '01',
                  title: 'Submit Application & Pay £95',
                  desc: 'Complete the online intake profile with company registration, primary trades, and operating territories. Submit £95+VAT annual membership fee.',
                },
                {
                  step: '02',
                  title: 'Technical Desk Review',
                  desc: 'Our compliance desk validates your Companies House records, insurance schedules, and statutory trade accreditations.',
                },
                {
                  step: '03',
                  title: 'Document Vault Activation',
                  desc: 'Receive operating portal access. Upload policy documents and certificates with automated 90/60/30-day renewal alerts.',
                },
                {
                  step: '04',
                  title: 'Commercial Work Allocation',
                  desc: 'Your business is mapped to relevant commercial client sites. Receive notification when matching PPM and reactive opportunities arise.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#EA580C] block mb-1">
                      STAGE {item.step}
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. REQUIREMENTS & COMPLIANCE EXPECTATIONS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-10">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">STANDARDS &amp; ASSURANCE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                Contractor Requirements &amp; Compliance Standards
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                We maintain strict standards to ensure our clients receive dependable, legally compliant building services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider text-[#EA580C]">
                  1. Insurance Coverage
                </h3>
                <ul className="space-y-2 text-slate-600 font-light">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Public Liability: Minimum £5,000,000 (£10M preferred for corporate estates).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Employers Liability: Minimum £10,000,000 (exempt for sole directors).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Professional Indemnity where design consultancy is provided.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider text-blue-600">
                  2. SSIP Health &amp; Safety
                </h3>
                <ul className="space-y-2 text-slate-600 font-light">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Current accreditation with an SSIP scheme (CHAS, SafeContractor, SMAS, Constructionline).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Written Health &amp; Safety Policy and Environmental Policy.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Demonstrated competence in producing site-specific RAMS.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider text-slate-900">
                  3. Trade Competency
                </h3>
                <ul className="space-y-2 text-slate-600 font-light">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Statutory registrations (Gas Safe, NICEIC, Refcom, BAFE, BICSc).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Valid CSCS / ECS / PMES cards for site-attending engineers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Calibrated test instruments with up-to-date certificates.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. REGIONAL COVERAGE */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-8">
            <div className="max-w-2xl space-y-3">
              <span className="eyebrow eyebrow-light">GEOGRAPHIC REACH</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                National FM Contracts, Regional Contractor Hubs
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                We operate across commercial corridors throughout the United Kingdom. Contractors define their specific operating radius (e.g. 30–45 miles from base).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: 'Sheffield & Yorkshire', badge: 'Active' },
                { name: 'Greater Manchester', badge: 'Active' },
                { name: 'Leeds & W. Yorks', badge: 'Active' },
                { name: 'Birmingham & Mids', badge: 'Active' },
                { name: 'Greater London', badge: 'Active' },
                { name: 'Nottingham & East', badge: 'Active' },
              ].map((loc, idx) => (
                <div key={idx} className="p-4 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-1">
                  <span className="text-[10px] font-mono text-[#EA580C] uppercase font-semibold">{loc.badge}</span>
                  <div className="text-xs font-semibold text-slate-900">{loc.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FAQ ACCORDION */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="FREQUENTLY ASKED QUESTIONS"
              title="Common Questions About Joining the Network"
              subtitle="Everything you need to know regarding membership, commercial terms, and work allocation."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 8. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="READY TO PUT YOUR BUSINESS FORWARD?"
            title="Join the EntireFM Contractor Network"
            description="Complete one streamlined qualification intake to tell us who you are, what services you provide, and where you operate. £95+VAT annual membership payable upon application submission."
            primaryCtaLabel="Apply to Join the Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="Find Out How Network Works"
            secondaryCtaHref="/contractors/find-work"
          />
        </div>

        {/* 9. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="EXPLORE CONTRACTOR GUIDES"
            title="Supporting Information &amp; Industry Standards"
            subtitle="Authoritative educational resources covering RAMS, method statements, and winning FM work."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
