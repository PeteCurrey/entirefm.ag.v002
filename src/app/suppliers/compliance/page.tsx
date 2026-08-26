import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { ComplianceInsuranceTable } from '@/components/suppliers/interactive/ComplianceInsuranceTable';
import { ComplianceRadarGraphic } from '@/components/suppliers/interactive/ComplianceRadarGraphic';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, CheckCircle2, ShieldCheck, FileCheck, Lock, Leaf, Scale, Building, Users, Award } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/compliance', {
  title: 'Supply Chain Compliance & Statutory Criteria | EntireFM',
  description:
    'Detailed compliance specifications for EntireFM suppliers across Corporate standing, Insurance thresholds, Health & Safety, People & Competence, Technical schemes, Environmental, and InfoSec.',
});

export default function CompliancePage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Compliance Matrix', url: '/suppliers/compliance' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="REGULATORY COMPLIANCE // AUDIT SPECIFICATIONS"
          title="Supply Chain Compliance"
          subtitle="Proportionate criteria. Transparent governance."
          intro="Review our comprehensive compliance criteria. Requirements are proportionate to the services being supplied, operational risk, and the client estate environment."
          imageSrc="/images/editorial/entirefm-distribution-board-testing-2000w.webp"
          imageAlt="EntireFM compliance auditing technician testing distribution board"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Review Supplier Standards', href: '/suppliers/standards' }}
          facts={[
            { figure: '8 Governance Areas', label: 'Compliance Matrix', detail: 'Corporate to Cyber Security' },
            { figure: 'Risk-Proportionate', label: 'Tiered Thresholds', detail: 'No unnecessary burdens' },
            { figure: 'Dynamic Radar', label: 'Expiry Tracking', detail: 'Automated renewal prompts' },
          ]}
        />

        <TrustBar />

        {/* 2. INSURANCE SCHEDULE THRESHOLDS (INTERACTIVE TABLE) */}
        <ComplianceInsuranceTable />

        {/* 3. 8 COMPLIANCE SECTORS */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">GOVERNANCE CRITERIA</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                The Eight Pillars of Supplier Assurance
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Requirements are categorized across eight governance dimensions to ensure clear accountability across every trade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  area: '1. Corporate & Legal',
                  icon: Building,
                  items: ['Active Companies House registration', 'VAT registration certificate', 'Bank account validation for fraud prevention', 'Director identity verification'],
                },
                {
                  area: '2. Insurance Verification',
                  icon: ShieldCheck,
                  items: ['Minimum £5M Public Liability (up to £10M)', '£10M Employers Liability', 'Professional Indemnity where applicable', 'Motor / Fleet insurance verification'],
                },
                {
                  area: '3. Health & Safety',
                  icon: FileCheck,
                  items: ['H&S Policy & Competent Person details', 'SSIP scheme accreditation (or Stage 1 audit)', 'Point-of-Work RAMS methodology', 'COSHH & RIDDOR reporting protocols'],
                },
                {
                  area: '4. Workforce Competence',
                  icon: Users,
                  items: ['CSCS / ECS / Skillcard verification', 'IRATA / IPAF / PASMA licences', 'Asbestos Awareness & First Aid training', 'Right to Work & DBS checks where required'],
                },
                {
                  area: '5. Technical Schemes',
                  icon: Award,
                  items: ['NICEIC / NAPIT (Electrical)', 'Gas Safe Register (Commercial)', 'F-Gas / REFCOM (Refrigeration)', 'BAFE / FIA (Fire & Life Safety)'],
                },
                {
                  area: '6. Environmental',
                  icon: Leaf,
                  items: ['Waste Carrier Licence (where carrying waste)', 'Hazardous waste transfer procedures', 'ISO 14001 or environmental policy', 'Route & travel efficiency commitments'],
                },
                {
                  area: '7. Information Security',
                  icon: Lock,
                  items: ['UK GDPR data protection compliance', 'Cyber Essentials awareness', 'Confidentiality of client site data', 'Secure CAFM credential management'],
                },
                {
                  area: '8. Ethical Governance',
                  icon: Scale,
                  items: ['Modern Slavery Act compliance', 'Anti-bribery & corruption policy', 'Equal opportunities & fair pay', 'Protected whistleblowing channel'],
                },
              ].map((comp, idx) => {
                const Icon = comp.icon;
                return (
                  <div key={idx} className="p-7 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="w-10 h-10 rounded-sm bg-slate-900 text-white flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-brand-pink" />
                      </div>
                      <h3 className="text-base font-light text-slate-900 mb-2">{comp.area}</h3>
                      <ul className="space-y-2 text-xs text-slate-600 font-light">
                        {comp.items.map((it, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. DYNAMIC COMPLIANCE RADAR (DARK BREAK) */}
        <ComplianceRadarGraphic />

        {/* 5. CALL TO ACTION */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <span className="text-xs font-light uppercase tracking-wider text-brand-pink">
              SUPPLIER ONBOARDING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-white">
              Ready to submit your compliance profile?
            </h2>
            <p className="text-sm text-brand-mist/80 max-w-xl mx-auto font-light leading-relaxed">
              Begin Stage 1 qualification. Our procurement team will assist with document verification and insurance checks.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Start Supplier Application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/standards" className="btn-ghost-light">
                Review Operating Standards
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="COMPLIANCE &amp; GOVERNANCE"
          heading="Related supplier information"
          links={[
            {
              title: 'Supplier Vetting',
              href: '/suppliers/vetting',
              description: 'The 6-pillar assessment process applied to verify compliance and competencies.',
              tag: 'VETTING',
            },
            {
              title: 'Supplier Standards',
              href: '/suppliers/standards',
              description: 'Operational principles, ethical benchmarks, and the Supplier Code of Conduct.',
              tag: 'STANDARDS',
            },
            {
              title: 'Onboarding Process',
              href: '/suppliers/onboarding',
              description: '4-phase structured compliance verification, agreement execution, and mobilization.',
              tag: 'ONBOARDING',
            },
            {
              title: 'How We Work',
              href: '/suppliers/how-we-work',
              description: '12-stage operational journey from onboarding to continuous delivery.',
              tag: 'PROCESS',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
