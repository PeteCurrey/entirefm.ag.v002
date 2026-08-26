import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CommercialTransparencyBanner } from '@/components/suppliers/CommercialTransparencyBanner';
import { MembershipTierCards } from '@/components/suppliers/MembershipTierCards';
import { CANONICAL_PUBLIC_PRICING } from '@/config/supplier-data';
import { CreditCard, FileText, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Supplier Membership & Fees | EntireFM Partner Network',
  description: 'Transparent supplier membership fees and commercial framework for the EntireFM Partner Network. Understand what fees support and our strict procurement firewall.',
};

export default function SupplierMembershipPublicPage() {
  const fee = CANONICAL_PUBLIC_PRICING.INITIAL_ASSURANCE_REVIEW;

  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-slate-900 text-white py-20 lg:py-28">
          <div className="container-custom max-w-5xl space-y-6">
            <span className="text-[11px] font-light uppercase tracking-wider text-brand-pink font-bold">
              COMMERCIAL TRANSPARENCY
            </span>
            <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight tracking-tight text-white max-w-3xl leading-tight">
              Transparent membership. Independent procurement.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
              EntireFM operates a commercial Partner Network supporting supplier administration, digital services, ongoing engagement and network activity. Membership remains separate from supplier assurance, operational approval and procurement decisions.
            </p>
          </div>
        </section>

        {/* Tiers */}
        <section className="py-16 container-custom max-w-5xl space-y-12">
          <MembershipTierCards />
        </section>

        {/* Membership Comparison Matrix */}
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="container-custom max-w-5xl space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold tracking-wider">
                RELATIONSHIP &amp; COMMERCIAL COMPARISON
              </span>
              <h2 className="text-2xl font-light text-slate-900">
                Supplier Relationships vs Commercial Products
              </h2>
              <p className="text-xs text-slate-600 font-light">
                Understanding the clear separation between technical assurance status, commercial memberships, and earned relationships.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-sm">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-900 text-white font-light uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="p-3.5">Relationship / Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Commercial Fee</th>
                    <th className="p-3.5">What It Means</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">Registered Supplier</td>
                    <td className="p-3.5 text-[11px] text-slate-500">Commercial Tier</td>
                    <td className="p-3.5 font-light text-slate-900">£0</td>
                    <td className="p-3.5 text-slate-600">Initial profile registration and intake access. Does not constitute approval.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">Supplier Network Membership</td>
                    <td className="p-3.5 text-[11px] text-slate-500">Commercial Product</td>
                    <td className="p-3.5 font-light text-slate-900">£495 + VAT/yr</td>
                    <td className="p-3.5 text-slate-600">Commercial network membership, digital portal tools, and compliance administration.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">Network Partner Membership</td>
                    <td className="p-3.5 text-[11px] text-slate-500">Commercial Product</td>
                    <td className="p-3.5 font-light text-slate-900">£1,250 + VAT/yr</td>
                    <td className="p-3.5 text-slate-600">Expanded commercial network participation with multi-user access and forum benefits.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 bg-emerald-50/20">
                    <td className="p-3.5 font-bold text-emerald-950">Approved / Verified Supplier</td>
                    <td className="p-3.5 text-[11px] text-emerald-800">Assurance Outcome</td>
                    <td className="p-3.5 font-medium text-slate-400">Not purchasable</td>
                    <td className="p-3.5 text-slate-600">Organisation that has completed the technical assurance process for defined services and regions.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">Preferred Supplier</td>
                    <td className="p-3.5 text-[11px] text-slate-500">Earned Relationship</td>
                    <td className="p-3.5 font-medium text-slate-400">Not purchasable</td>
                    <td className="p-3.5 text-slate-600">Earned through sustained operational performance, SLA adherence, and first-time fix excellence.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">Strategic Partner</td>
                    <td className="p-3.5 text-[11px] text-slate-500">Executive Relationship</td>
                    <td className="p-3.5 font-medium text-slate-400">Invitation only</td>
                    <td className="p-3.5 text-slate-600">Strategic relationship based on critical national scale or key OEM collaboration.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Assurance Review Fee Explanation */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="container-custom max-w-5xl space-y-6 text-xs font-light">
            <div className="space-y-1 font-sans">
              <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold tracking-wider">
                TECHNICAL VETTING
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Initial Supplier Assurance Review ({fee.displayPrice})
              </h3>
              <p className="text-xs text-slate-600 font-light">
                The Initial Supplier Assurance Review supports the administration and review of applicable company, insurance, health &amp; safety, competency, compliance and commercial information according to the supplier's services and risk profile.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-sm border border-slate-200">
              <div className="space-y-2 font-sans">
                <span className="font-bold text-slate-900 block">Proportionate Assurance Review:</span>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  The precise assurance requirements vary according to supplier type, service discipline, operational risk level, and client estate requirements. Requirements are strictly proportionate to the risk of the work being delivered.
                </p>
              </div>

              <div className="space-y-2 font-sans text-[11.5px] text-slate-600 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                <span className="font-bold text-slate-900 block">Important Governance Rule:</span>
                <p>
                  Payment of the assurance review fee contributes towards the independent administration and desk review of submitted credentials. Payment does not guarantee successful approval.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency Banner */}
        <section className="py-16 container-custom max-w-5xl">
          <CommercialTransparencyBanner />
        </section>
      </main>

      <Footer />
    </div>
  );
}
