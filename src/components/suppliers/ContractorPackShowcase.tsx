import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  IdCard,
  QrCode,
  BookOpen,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Package,
  CheckCircle2,
  HardHat
} from 'lucide-react';

interface ContractorPackShowcaseProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function ContractorPackShowcase({
  eyebrow = 'PHYSICAL CREDENTIALS & ONBOARDING PACK',
  title = 'Official EntireFM Contractor Pack & Verified ID',
  subtitle = 'Every approved network member receives a physical onboarding pack containing their verified operative ID badge, site PPE, contractor handbook, and trade discount card.',
  ctaText = 'Apply to Join the Network',
  ctaHref = '/suppliers/apply',
}: ContractorPackShowcaseProps) {
  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="eyebrow eyebrow-light">{eyebrow}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Visual Grid: Welcome Pack Box & Dual ID Badge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Approved Supplier Welcome Box (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FAF9FB] border border-slate-200 rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  PHYSICAL WELCOME PACK
                </span>
                <span className="text-[10.5px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                  Issued Upon Technical Approval
                </span>
              </div>

              <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden border border-slate-200 bg-slate-900">
                <Image
                  src="/images/contractor-pack/entirefm-contractor-welcome-box.png"
                  alt="EntireFM Approved Supplier Welcome Pack Box containing handbook, ID card, PPE and partner card"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-lg font-light text-slate-900">
                  Premium Contractor Welcome Box
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Presented in a bespoke EntireFM magnetic-close presentation box. Equips your engineers with official physical credentials and documentation for on-site client attendance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-200/80 mt-6 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Contractor Handbook &amp; Standards</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Branded EntireFM High-Vis PPE</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Trade Counter Partner Discount Card</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Operations Notebook &amp; Pen</span>
              </div>
            </div>
          </div>

          {/* Right: Official Approved Supplier ID Card & Lanyard (5 Cols) */}
          <div className="lg:col-span-5 bg-[#FAF9FB] border border-slate-200 rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SITE SECURITY CREDENTIAL
                </span>
                <span className="text-[10.5px] font-mono text-slate-500">
                  QR-VERIFIED
                </span>
              </div>

              <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden border border-slate-200 bg-white">
                <Image
                  src="/images/contractor-pack/entirefm-contractor-id-card-dual.png"
                  alt="EntireFM Approved Supplier ID Card and Lanyard front and back with QR verification code"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-lg font-light text-slate-900">
                  Approved Supplier ID &amp; Lanyard
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  High-durability credit-card format ID badge with bespoke EntireFM lanyard. Features photo ID, verified trade discipline, unique supplier ID number, and dynamic QR code.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-6 border-t border-slate-200/80 mt-6 text-xs text-slate-600 font-light">
              <div className="p-3 bg-white rounded border border-slate-200 flex items-start gap-2.5">
                <QrCode className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-medium">Instant QR Site Validation:</strong> Facility managers and security staff can scan the badge QR code to verify live operative eligibility and insurance standing.
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-slate-200 flex items-start gap-2.5">
                <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-medium">24/7 Operations Desk Hotline:</strong> Direct emergency phone number printed on the reverse for swift site escalation.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Callout Banner */}
        <div className="p-6 sm:p-8 rounded-sm bg-white border-2 border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EA580C]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                COMPLETE ONBOARDING EXPERIENCE
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-light text-slate-900">
              Combine digital contractor software with professional physical credentials.
            </h4>
            <p className="text-xs text-slate-600 font-light max-w-xl">
              From day one, your business presents a credible, unified identity on every client site and commercial plant room.
            </p>
          </div>

          <Link href={ctaHref} className="btn-primary text-xs py-2.5 px-6 font-bold shrink-0">
            {ctaText} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
