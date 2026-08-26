import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { DisciplineOpportunityMatrix } from '@/components/suppliers/interactive/DisciplineOpportunityMatrix';
import { OperatorPersonaSelector } from '@/components/suppliers/interactive/OperatorPersonaSelector';
import { PaymentPerformanceBanner } from '@/components/suppliers/interactive/PaymentPerformanceBanner';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, CheckCircle2, TrendingUp, Building2, Wrench, Cpu, Users, Award, ShieldCheck } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/partner-with-entirefm', {
  title: 'Partner with EntireFM | Contractor & Supplier Opportunities | EntireFM',
  description:
    'Discover commercial opportunities for contractors, regional SMEs, OEMs, and technology providers with EntireFM. Access recurring planned maintenance and transparent digital workflows.',
});

export default function PartnerWithEntireFMPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Partner with EntireFM', url: '/suppliers/partner-with-entirefm' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="SUPPLIER RECRUITMENT // COMMERCIAL OPPORTUNITIES"
          title="Better suppliers deserve"
          subtitle="better partnerships."
          intro="EntireFM provides high-calibre contractors, regional SMEs, manufacturers, and technology innovators with consistent commercial volume, structured digital instructions, and transparent operational relationships."
          imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
          imageAlt="EntireFM commercial directors discussing supplier partnership agreements"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'How We Work', href: '/suppliers/how-we-work' }}
          facts={[
            { figure: 'Recurring Volume', label: 'Planned Maintenance', detail: 'SFG20 maintenance schedules' },
            { figure: 'Prompt Terms', label: 'Validated Invoicing', detail: 'Transparent electronic payment' },
            { figure: 'Preferred Tier', label: 'Strategic Progression', detail: 'Exclusivity on managed estates' },
          ]}
        />

        <TrustBar />

        {/* 2. OPERATOR PERSONA SELECTOR */}
        <OperatorPersonaSelector />

        {/* 3. DISCIPLINE & OPPORTUNITY MATRIX */}
        <DisciplineOpportunityMatrix />

        {/* 4. PAYMENT & PERFORMANCE COMMERCIAL PLEDGE (DARK BREAK) */}
        <PaymentPerformanceBanner />

        {/* 5. TIER PROGRESSION ROADMAP */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">GROWTH &amp; RECOGNITION</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                A Transparent Pathway from Applicant to Preferred Partner
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                We reward reliability and technical precision. As your attendance rate, first-time fix scores, and compliance integrity build, your business automatically progresses through our partner tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  tier: '01',
                  name: 'Registered Applicant',
                  badge: 'ENTRY LEVEL',
                  desc: 'Completed Stage 1 company profile. Pre-qualification underway across requested trade disciplines.',
                  volume: 'Profile verification',
                },
                {
                  tier: '02',
                  name: 'Approved Supplier',
                  badge: 'ACCREDITED STATUS',
                  desc: 'Full 6-pillar vetting passed. Active access to standard reactive callouts and scheduled maintenance orders.',
                  volume: 'Standard regional allocation',
                },
                {
                  tier: '03',
                  name: 'Preferred Partner',
                  badge: 'HIGH PERFORMER',
                  desc: 'Consistent >92% SLA attendance and flawless RAMS. First priority for multi-site PPM contracts and emergency jobs.',
                  volume: 'Priority dispatch & PPM packages',
                },
                {
                  tier: '04',
                  name: 'Strategic Alliance',
                  badge: 'EXCLUSIVE TIER',
                  desc: 'Multi-region engineering footprint or direct OEM relationship. Collaborative framework with executive quarterly reviews.',
                  volume: 'Contract exclusivity & co-development',
                },
              ].map((t, idx) => (
                <div key={idx} className="p-7 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extralight text-brand-pink">TIER {t.tier}</span>
                      <span className="text-[10px] text-slate-500 font-light px-2 py-0.5 bg-white border border-slate-200 rounded-sm">
                        {t.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-light text-slate-900">{t.name}</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">{t.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80">
                    <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-400 block mb-0.5">
                      WORKLOAD PROFILE
                    </span>
                    <span className="text-xs font-light text-slate-800">{t.volume}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. CALL TO ACTION */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark">
          <div className="container-custom max-w-4xl text-center space-y-6">
            <span className="text-xs font-light uppercase tracking-wider text-brand-pink">
              APPLICATION INTAKE // PARTNER NETWORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white">
              Join the EntireFM Partner Network Today
            </h2>
            <p className="text-sm sm:text-base text-brand-mist/80 font-light max-w-2xl mx-auto leading-relaxed">
              Complete our initial online qualification in under 15 minutes. Our supply chain governance team will review your trade scope and issue your document vault access.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Start Supplier Application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/vetting" className="btn-ghost-light">
                Review Vetting Standards
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="PARTNERSHIP OPPORTUNITIES"
          heading="Related supplier information"
          links={[
            {
              title: 'Partner Network',
              href: '/suppliers/partner-network',
              description: 'Collaborative ecosystem for contractors, specialists, OEMs, and innovators.',
              tag: 'NETWORK',
            },
            {
              title: 'How We Work',
              href: '/suppliers/how-we-work',
              description: 'The 12-stage operational journey from registration to work delivery.',
              tag: 'PROCESS',
            },
            {
              title: 'Supplier Vetting',
              href: '/suppliers/vetting',
              description: 'Risk-proportional 6-pillar assurance before any site allocation.',
              tag: 'VETTING',
            },
            {
              title: 'Events & Forums',
              href: '/suppliers/events',
              description: 'Engagement forums, technical sessions, and partner open days.',
              tag: 'EVENTS',
            },
            {
              title: 'Become a Supplier',
              href: '/suppliers/apply',
              description: 'Start your pre-qualification submission to join our supply chain.',
              tag: 'APPLY',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
