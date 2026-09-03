import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArrowRight, Shield, CheckCircle2, Wrench } from "lucide-react";

interface TradeHeroProps {
  tradeName: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  facts?: Array<{ figure: string; label: string }>;
}

export function TradeHero({
  tradeName,
  eyebrow = "ENTIREFM CONTRACTOR NETWORK",
  title,
  subtitle,
  intro,
  imageSrc,
  imageAlt,
  breadcrumbs,
  primaryCta = { label: "Join the Contractor Network", href: "/suppliers/apply" },
  secondaryCta = { label: "Explore the Contractor Portal", href: "/suppliers/membership#platform-overview" },
  facts = [
    { figure: "£95 / yr", label: "Supplier Membership" },
    { figure: "Audit-Ready", label: "Trade Compliance & RAMS" },
    { figure: "UK-Wide", label: "Commercial FM Network" },
  ],
}: TradeHeroProps) {
  const displayTitle = title || `${tradeName} Contractors`;

  return (
    <section className="relative isolate overflow-hidden bg-slate-900 text-white min-h-[34rem] flex flex-col justify-between pt-[calc(var(--header-h,72px)+1rem)] pb-14 border-b border-slate-800">
      {/* Background Image & Gradient Scrim */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(98deg, rgba(11,18,32,0.96) 0%, rgba(11,18,32,0.90) 45%, rgba(11,18,32,0.65) 100%)",
        }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-25" />

      <div className="container-wide space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono tracking-wider text-brand-mist/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C] animate-pulse" />
            {eyebrow} // {tradeName.toUpperCase()}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-white leading-[1.1]">
            {displayTitle}
            {subtitle && (
              <span className="block mt-1 sm:mt-2 text-2xl sm:text-3xl text-slate-300 font-extralight">
                {subtitle}
              </span>
            )}
          </h1>

          <p className="text-base sm:text-lg font-light leading-relaxed text-slate-300 max-w-2xl">
            {intro}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link href={primaryCta.href} className="btn-primary text-xs py-3.5 px-6 font-bold">
              {primaryCta.label}
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
            <Link href={secondaryCta.href} className="btn-ghost-light text-xs py-3.5 px-6">
              {secondaryCta.label}
            </Link>
          </div>

          {/* Quick Metrics */}
          {facts.length > 0 && (
            <dl className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-sm overflow-hidden max-w-xl">
              {facts.map((f, idx) => (
                <div key={idx} className="bg-slate-900/80 px-4 py-3 backdrop-blur-sm">
                  <dt className="text-sm font-semibold text-white">{f.figure}</dt>
                  <dd className="text-[11px] text-slate-400 font-light mt-0.5">{f.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
