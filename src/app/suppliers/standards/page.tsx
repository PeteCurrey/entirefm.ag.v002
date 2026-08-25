import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { SupplierStandardsGrid } from '@/components/suppliers/SupplierStandardsGrid';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, ShieldCheck, Scale, FileCheck, Users, Lock, HeartHandshake } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/standards', {
  title: 'Supplier Standards & Code of Conduct | EntireFM',
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
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

        {/* 6 PRINCIPLES */}
        <SupplierStandardsGrid />

        {/* CODE OF CONDUCT DEEP DIVE */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">ETHICAL FRAMEWORK</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                Supply Chain Code of Conduct Key Themes
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                All approved suppliers commit to our core ethical operating principles upon onboarding agreement sign-off:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Health, Safety & Welfare',
                  desc: 'Zero tolerance for unsafe work at height, uncertified electrical isolation, or improper PPE. Operative welfare and safe working environments are non-negotiable.',
                  icon: ShieldCheck,
                },
                {
                  title: 'Modern Slavery & Fair Pay',
                  desc: 'Strict prohibition of forced or child labour. Full compliance with the Modern Slavery Act 2015, fair wage rates, and verified right-to-work screening.',
                  icon: Scale,
                },
                {
                  title: 'Anti-Bribery & Corruption',
                  desc: 'Zero tolerance for bribery, illicit kickbacks, or improper gifts. Transparent quote construction against verified material and labour costs.',
                  icon: FileCheck,
                },
                {
                  title: 'Diversity, Equality & Respect',
                  desc: 'Commitment to equal opportunity, zero workplace discrimination, and dignified treatment for all staff, tenants, and site visitors.',
                  icon: Users,
                },
                {
                  title: 'Information Security & Privacy',
                  desc: 'Protection of sensitive building plans, tenant data, access codes, and CAFM system credentials under UK GDPR and ISO 27001 standards.',
                  icon: Lock,
                },
                {
                  title: 'Environmental Responsibility',
                  desc: 'Active waste reduction, proper hazardous substance disposal (COSHH / F-Gas), and low-emission vehicle route planning.',
                  icon: HeartHandshake,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm space-y-3">
                    <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white border-b border-slate-200 text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Align Your Business with the EntireFM Standard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              If your business shares our commitment to safety, technical competence, and transparent delivery, we invite you to begin qualification.
            </p>
            <div className="pt-2">
              <Link href="/suppliers/apply" className="btn-primary inline-flex">
                Apply for Supplier Qualification <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
