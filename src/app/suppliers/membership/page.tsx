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
  title: 'Supplier Membership & Commercial Framework | EntireFM Partner Network',
  description:
    'Transparent supplier membership fees and commercial framework for the EntireFM Partner Network. Understand what fees support and our strict procurement firewall.',
});

export default function SupplierMembershipPublicPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Membership & Fees', url: '/suppliers/membership' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="COMMERCIAL TRANSPARENCY // GOVERNANCE FIREWALL"
          title="Transparent membership."
          subtitle="Independent procurement."
          intro="EntireFM operates a commercial Partner Network supporting supplier administration, digital services, ongoing engagement, and network activity. Commercial membership remains strictly separate from technical assurance, statutory approval, and work order allocation decisions."
          imageSrc="/images/editorial/entirefm-hero-headquarters-2560w.webp"
          imageAlt="EntireFM commercial headquarters and supplier governance centre"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'How We Work', href: '/suppliers/how-we-work' }}
          facts={[
            { figure: '100% Ringfenced', label: 'Assurance Quality', detail: 'Funded vetting & admin' },
            { figure: 'Strict Firewall', label: 'Procurement Integrity', detail: 'No pay-to-win work' },
            { figure: 'Zero Hidden Fees', label: 'Complete Transparency', detail: 'Zero invoice discounting' },
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
                Commercial Membership Structures
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Choose the commercial participation level that fits your business scale and growth objectives.
              </p>
            </div>

            <MembershipTierCards />
          </div>
        </section>

        {/* 4. RELATIONSHIP VS PRODUCT MATRIX */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide space-y-10">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">RELATIONSHIP &amp; COMMERCIAL COMPARISON</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Supplier Relationships vs Commercial Products
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                We maintain an explicit separation between technical assurance status, commercial memberships, and earned relationships.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-sm bg-white shadow-sm">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-900 text-white font-light uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="p-4">Relationship / Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Commercial Fee</th>
                    <th className="p-4">What It Means</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-normal text-slate-900">Registered Supplier</td>
                    <td className="p-4 text-[11px] text-slate-500">Commercial Tier</td>
                    <td className="p-4 font-light text-slate-900">£0</td>
                    <td className="p-4 text-slate-600 font-light">Initial profile registration and intake access. Does not constitute technical approval.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-normal text-slate-900">Supplier Network Membership</td>
                    <td className="p-4 text-[11px] text-slate-500">Commercial Product</td>
                    <td className="p-4 font-light text-slate-900">£495 + VAT/yr</td>
                    <td className="p-4 text-slate-600 font-light">Commercial network membership, digital portal tools, and continuous compliance administration.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-normal text-slate-900">Network Partner Membership</td>
                    <td className="p-4 text-[11px] text-slate-500">Commercial Product</td>
                    <td className="p-4 font-light text-slate-900">£1,250 + VAT/yr</td>
                    <td className="p-4 text-slate-600 font-light">Expanded commercial network participation with multi-user access and forum benefits.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 bg-emerald-50/20">
                    <td className="p-4 font-normal text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Approved / Verified Supplier
                    </td>
                    <td className="p-4 text-[11px] text-emerald-800">Assurance Outcome</td>
                    <td className="p-4 font-medium text-slate-400">Not purchasable</td>
                    <td className="p-4 text-slate-600 font-light">Organisation that has completed the technical 6-pillar assurance process for defined services and regions.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 bg-amber-50/20">
                    <td className="p-4 font-normal text-amber-950 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-amber-600 shrink-0" />
                      Preferred Partner
                    </td>
                    <td className="p-4 text-[11px] text-amber-800">Earned Operational Tier</td>
                    <td className="p-4 font-medium text-slate-400">Earned only</td>
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
          eyebrow="MEMBERSHIP &amp; GOVERNANCE"
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
              description: 'Clear answers on assurance fees, commercial separation, and payment terms.',
              tag: 'FAQ',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
