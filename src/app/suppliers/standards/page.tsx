import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { SupplierStandardsGrid } from '@/components/suppliers/SupplierStandardsGrid';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  FileCheck, 
  Users, 
  Lock, 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle,
  Award,
  Eye
} from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/standards', {
  title: 'Supplier Standards & Code of Conduct | Governance & Quality | EntireFM',
  description:
    'The EntireFM Supplier Standard defines the six operational principles—Safe, Competent, Responsive, Transparent, Evidence-Led, Professional—and ethical Code of Conduct governing our supply chain.',
});

export default function StandardsPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Standards & Code of Conduct', url: '/suppliers/standards' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="OPERATING CHARTER // GOVERNANCE BENCHMARK"
          title="The EntireFM Supplier Standard"
          subtitle="Corporate governance &amp; operational precision."
          intro="We hold our supply chain to the identical engineering precision, statutory safety, and ethical standards that we deliver directly to UK commercial property owners and managing agents."
          imageSrc="/images/editorial/entirefm-hero-headquarters-2560w.webp"
          imageAlt="EntireFM corporate headquarters and operational governance hub"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Apply to Approved Network', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Review Compliance Matrix', href: '/suppliers/compliance' }}
          facts={[
            { figure: '6 Principles', label: 'Operational Standard', detail: 'Safe, Competent, Responsive...' },
            { figure: 'Code of Conduct', label: 'Ethical Governance', detail: 'Anti-bribery & modern slavery' },
            { figure: 'Audit Rights', label: 'Quality Verification', detail: 'Periodic random site inspections' },
          ]}
        />

        <TrustBar />

        {/* 2. SIX CORE OPERATIONAL PRINCIPLES */}
        <SupplierStandardsGrid />

        {/* 3. ETHICAL CODE OF CONDUCT DEEP DIVE */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">ETHICAL FRAMEWORK</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Supply Chain Code of Conduct Key Themes
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                All approved suppliers execute our binding Code of Conduct upon framework appointment. These commitments protect workers, clients, and the public across all operational touchpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Health, Safety & Operative Welfare',
                  desc: 'Zero tolerance for unsafe working at height, unisolated electrical work, or inadequate PPE. All operatives are provided with safe working gear and dynamic risk assessment tools.',
                  icon: ShieldCheck,
                  standard: 'ISO 45001 / HASAWA 1974',
                },
                {
                  title: 'Modern Slavery & Fair Wages',
                  desc: 'Strict prohibition of forced, bonded, or involuntary prison labour. Full compliance with the Modern Slavery Act 2015, real Living Wage rates, and verified right-to-work audits.',
                  icon: Scale,
                  standard: 'Modern Slavery Act 2015',
                },
                {
                  title: 'Anti-Bribery & Commercial Integrity',
                  desc: 'Zero tolerance for bribery, illicit inducements, kickbacks, or gifts. Transparent quote construction against audited material and labor rate cards.',
                  icon: FileCheck,
                  standard: 'Bribery Act 2010',
                },
                {
                  title: 'Diversity, Equality & Dignity',
                  desc: 'Commitment to equal opportunity, zero discrimination on grounds of protected characteristics, and respectful treatment for all staff, tenants, and visitors.',
                  icon: Users,
                  standard: 'Equality Act 2010',
                },
                {
                  title: 'Information Security & Data Privacy',
                  desc: 'Strict protection of sensitive building floorplans, tenant details, security codes, and CAFM system credentials under UK GDPR and ISO 27001 guidelines.',
                  icon: Lock,
                  standard: 'UK GDPR / ISO 27001',
                },
                {
                  title: 'Environmental Responsibility & COSHH',
                  desc: 'Active waste reduction, 100% certified refrigerant containment under F-Gas regulations, licensed hazardous disposal, and low-emission fleet routing.',
                  icon: HeartHandshake,
                  standard: 'ISO 14001 / F-Gas Regs',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-8 bg-white border border-slate-200 rounded-sm shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                          <Icon className="h-5 w-5 text-brand-pink" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-light px-2 py-0.5 bg-slate-100 rounded-sm">
                          {item.standard}
                        </span>
                      </div>
                      <h3 className="text-base font-light text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. RANDOM QUALITY AUDIT & INSPECTION PROTOCOL (DARK BREAK) */}
        <section className="py-24 bg-brand-graphite text-white border-t border-b border-brand-edge-dark relative overflow-hidden">
          <div className="container-wide relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
                  QUALITY ASSURANCE &amp; AUDIT RIGHTS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
                  Independent Quality Auditing on Live Estates
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  EntireFM maintains an independent technical auditing regime. Our regional compliance managers conduct random on-site inspections and photographic evidence reviews to maintain standard integrity.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-sm bg-slate-900/80 border border-slate-800">
                    <Eye className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-white">Unannounced Site Safety Audits</h4>
                      <p className="text-[11.5px] text-slate-400 font-light">Verifying operative PPE, physical permits-to-work, and point-of-work dynamic RAMS compliance.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-sm bg-slate-900/80 border border-slate-800">
                    <Award className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-white">Post-Work Photographic Verification</h4>
                      <p className="text-[11.5px] text-slate-400 font-light">100% of closed work orders reviewed for before/after image validation and calibrated instrument readings.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-950/90 border border-slate-800 rounded-sm p-8 sm:p-10 shadow-2xl">
                <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block mb-2">
                  ETHICAL ESCALATION &amp; WHISTLEBLOWING
                </span>
                <h3 className="text-xl font-light text-white mb-4">Whistleblowing &amp; Safety First Guarantee</h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed mb-6">
                  Any contractor, operative, or subcontractor who observes unsafe working conditions, commercial corruption, or modern slavery concerns on an EntireFM managed estate has direct access to our independent confidential reporting line with zero fear of reprisal.
                </p>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-sm space-y-1 text-xs text-slate-300 font-light">
                  <div className="text-white font-medium">EntireFM Confidential Compliance Hotline:</div>
                  <div>Email: <a href="mailto:compliance@entirefm.com" className="text-brand-pink hover:underline">compliance@entirefm.com</a></div>
                  <div>Direct Desk: 0800 048 5858 (Option 4 - Compliance & Safety)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CALL TO ACTION */}
        <section className="py-20 bg-white border-b border-slate-200 text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <span className="eyebrow eyebrow-light">ALIGNMENT &amp; QUALIFICATION</span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900">
              Align Your Business with the EntireFM Standard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-light">
              If your business shares our commitment to safety, technical competence, and transparent delivery, we invite you to begin supplier qualification.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Apply for Supplier Qualification <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/vetting" className="btn-ghost-dark">
                Review 6-Pillar Vetting
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="STANDARDS &amp; GOVERNANCE"
          heading="Related supplier information"
          links={[
            {
              title: 'Supplier Vetting',
              href: '/suppliers/vetting',
              description: 'The 6-pillar assessment process applied to verify compliance and competencies.',
              tag: 'VETTING',
            },
            {
              title: 'Onboarding Process',
              href: '/suppliers/onboarding',
              description: '4-phase structured induction and digital compliance mobilization.',
              tag: 'ONBOARDING',
            },
            {
              title: 'Compliance & Safety',
              href: '/suppliers/compliance',
              description: 'Insurance minimums, dynamic RAMS, and competence card matrices.',
              tag: 'COMPLIANCE',
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
