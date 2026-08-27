import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { MembershipTierCards } from '@/components/suppliers/MembershipTierCards';
import { CommercialTransparencyBanner } from '@/components/suppliers/CommercialTransparencyBanner';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { CANONICAL_PUBLIC_PRICING } from '@/config/supplier-data';
import { CreditCard, FileText, Lock, ShieldCheck, CheckCircle2, ArrowRight, Scale, Award } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/membership', {
  title: 'Supplier Framework & Partner Network | EntireFM',
  description:
    'Understand the EntireFM Partner Network framework, technical due diligence standards, and our strict procurement firewall.',
});

export default function SupplierMembershipPublicPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Partner Network Framework', url: '/suppliers/membership' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="COMMERCIAL TRANSPARENCY // GOVERNANCE FIREWALL"
          title="Transparent standards."
          subtitle="Independent procurement."
          intro="EntireFM operates a collaborative Partner Network supporting supplier administration, digital compliance tooling, ongoing engagement, and regional technical standards. Network participation remains strictly separate from technical assurance, statutory approval, and work order allocation decisions."
          imageSrc="/images/editorial/entirefm-hero-headquarters-2560w.webp"
          imageAlt="EntireFM commercial headquarters and supplier governance centre"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'How We Work', href: '/suppliers/how-we-work' }}
          facts={[
            { figure: '100% Ringfenced', label: 'Assurance Quality', detail: 'Independent technical vetting' },
            { figure: 'Strict Firewall', label: 'Procurement Integrity', detail: 'No pay-to-win work' },
            { figure: 'Direct BACS', label: 'Commercial Terms', detail: 'Prompt work order remittances' },
          ]}
        />

        <TrustBar />

        {/* 2. COMMERCIAL TRANSPARENCY BANNER */}
        <CommercialTransparencyBanner />

        {/* 3. MEMBERSHIP TIERS */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">PARTNER NETWORK TIERS</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Participation &amp; Capability Framework
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Structured participation levels designed to support contractors across all operational scales.
              </p>
            </div>

            <MembershipTierCards />
          </div>
        </section>

        {/* 4. RELATIONSHIP VS PRODUCT MATRIX */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide space-y-10">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">RELATIONSHIP &amp; STATUS MATRIX</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Supplier Relationships &amp; Governance Matrix
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                We maintain an explicit separation between technical assurance status, capability levels, and earned operational tiers.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-sm bg-white shadow-sm">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-900 text-white font-light uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="p-4">Relationship / Stage</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Governance Scope</th>
                    <th className="p-4">What It Means</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-normal text-slate-900">Applicant Supplier</td>
                    <td className="p-4 text-[11px] text-slate-500">Intake Stage</td>
                    <td className="p-4 font-light text-slate-900">Profile &amp; Evidence Intake</td>
                    <td className="p-4 text-slate-600 font-light">Initial profile registration and compliance intake. Does not constitute technical approval.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 bg-emerald-50/20">
                    <td className="p-4 font-normal text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Approved / Verified Supplier
                    </td>
                    <td className="p-4 text-[11px] text-emerald-800">Assurance Outcome</td>
                    <td className="p-4 font-medium text-emerald-800">Verified &amp; Authorized</td>
                    <td className="p-4 text-slate-600 font-light">Organisation that has completed the technical 6-pillar assurance process for defined services and regions.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-normal text-slate-900">Multi-Discipline Partner</td>
                    <td className="p-4 text-[11px] text-slate-500">Capability Tier</td>
                    <td className="p-4 font-light text-slate-900">Regional / National</td>
                    <td className="p-4 text-slate-600 font-light">Expanded multi-trade contractor with multi-site capability and integrated dispatch coordination.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 bg-amber-50/20">
                    <td className="p-4 font-normal text-amber-950 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-amber-600 shrink-0" />
                      Preferred Partner
                    </td>
                    <td className="p-4 text-[11px] text-amber-800">Earned Operational Tier</td>
                    <td className="p-4 font-medium text-amber-800">Performance-Based</td>
                    <td className="p-4 text-slate-600 font-light">High-performing supplier with proven SLA delivery, flawless RAMS, and high volume capacity.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. CALL TO ACTION */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <span className="text-xs font-light uppercase tracking-wider text-brand-pink">
              SUPPLIER ONBOARDING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-white">
              Ready to Join the Partner Network?
            </h2>
            <p className="text-sm text-brand-mist/80 max-w-xl mx-auto font-light leading-relaxed">
              Begin your Stage 1 registration today. Experience transparent terms, predictable volume, and clear commercial relationships.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Start Supplier Application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/events" className="btn-ghost-light">
                Explore Partner Events
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="NETWORK &amp; GOVERNANCE"
          heading="Related supplier information"
          links={[
            {
              title: 'Partner Network',
              href: '/suppliers/partner-network',
              description: 'Collaborative ecosystem for regional contractors, specialists, OEMs, and innovators.',
              tag: 'NETWORK',
            },
            {
              title: 'Events & Forums',
              href: '/suppliers/events',
              description: 'Technical breakfasts, manufacturer seminars, training days, and industry roundtables.',
              tag: 'EVENTS',
            },
            {
              title: 'How We Work',
              href: '/suppliers/how-we-work',
              description: 'Understand the 12-stage operational journey from registration to work allocation.',
              tag: 'LIFECYCLE',
            },
            {
              title: 'Supplier FAQ',
              href: '/suppliers/faq',
              description: 'Clear answers on vetting standards, operational processes, and contractor payment terms.',
              tag: 'FAQ',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
