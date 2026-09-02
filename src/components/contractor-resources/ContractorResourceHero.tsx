import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArrowRight, Clock, Shield, FileCheck } from "lucide-react";

interface ContractorResourceHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  intro: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  readTime?: string;
  lastUpdated?: string;
  keyTakeaway?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function ContractorResourceHero({
  eyebrow = "ENTIREFM // CONTRACTOR KNOWLEDGE BASE",
  title,
  subtitle,
  intro,
  breadcrumbs,
  readTime = "6 min read",
  lastUpdated = "2026",
  keyTakeaway,
  primaryCta = { label: "Explore the Contractor Portal", href: "/suppliers/membership#platform-overview" },
  secondaryCta = { label: "Contractor Membership (£295/yr)", href: "/suppliers/membership" },
}: ContractorResourceHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-900 text-white pt-[calc(var(--header-h,72px)+1rem)] pb-16 sm:pb-20 border-b border-slate-800">
      {/* Background Subtle Gradient & Grid Texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(234, 88, 12, 0.15), transparent 60%), radial-gradient(ellipse at bottom left, rgba(37, 99, 235, 0.1), transparent 50%)",
        }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-20" />

      <div className="container-wide space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Title & Intro */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2.5 rounded-sm border border-slate-700/80 bg-slate-800/80 px-3 py-1 text-[11px] font-mono tracking-wider text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C] animate-pulse" />
              {eyebrow}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-[1.12]">
              {title}
              {subtitle && (
                <span className="block mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl text-slate-300 font-extralight">
                  {subtitle}
                </span>
              )}
            </h1>

            <p className="text-base sm:text-lg font-light text-slate-300 leading-relaxed max-w-3xl">
              {intro}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> {readTime}
              </span>
              <span>&bull;</span>
              <span>Updated {lastUpdated}</span>
              <span>&bull;</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> UK Commercial FM Standard
              </span>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              {primaryCta && (
                <Link href={primaryCta.href} className="btn-primary text-xs py-3 px-5">
                  {primaryCta.label}
                  <ArrowRight className="btn-arrow h-4 w-4" />
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className="btn-ghost-light text-xs py-3 px-5">
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </div>

          {/* Quick Key Takeaway Card */}
          {keyTakeaway && (
            <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/80 rounded-sm p-6 space-y-3 backdrop-blur-sm shadow-card">
              <div className="flex items-center gap-2 text-[#EA580C] text-xs font-bold uppercase tracking-wider">
                <FileCheck className="w-4 h-4" />
                <span>Executive Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {keyTakeaway}
              </p>
              <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                Authoritative UK facilities management guidance. Non-legal operational standard.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
