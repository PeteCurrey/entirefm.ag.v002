import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContractorResourceHero } from "@/components/contractor-resources/ContractorResourceHero";
import { ContractorPortalCtaCard } from "@/components/contractor-resources/ContractorPortalCtaCard";
import { ContractorRelatedGrid } from "@/components/contractor-resources/ContractorRelatedGrid";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";
import {
  FileCheck,
  Zap,
  Wind,
  Cog,
  ShieldAlert,
  ArrowRight,
  Download,
  CheckCircle2,
  Sliders
} from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/inspection-checklists", {
  title: "Commercial Contractor Inspection Checklists UK | EntireFM Resources",
  description:
    "Free downloadable inspection checklists and audit frameworks for commercial trade contractors. EICR visual inspection, F-Gas leak testing, plantroom safety, and fire door compliance.",
});

const CHECKLISTS = [
  {
    slug: "eicr-visual-checklist",
    title: "EICR Visual Inspection Checklist",
    trade: "Electrical Engineering",
    icon: Zap,
    desc: "10-point statutory visual condition checklist for commercial three-phase distribution boards, containment, and protective devices under BS 7671:2018+A2:2022.",
    format: "Printable / Copyable / TXT Download",
  },
  {
    slug: "fgas-inspection-checklist",
    title: "F-Gas Statutory Inspection & Logbook Checklist",
    trade: "HVAC & Refrigeration",
    icon: Wind,
    desc: "Comprehensive leak test verification protocol, CO2 equivalent calculations, cylinder tracking, and recovery logsheet framework under UK F-Gas Regulations.",
    format: "Printable / Copyable / TXT Download",
  },
  {
    slug: "plantroom-pre-work-checklist",
    title: "Plantroom Pre-Work Isolation & Safety Checklist",
    trade: "Mechanical & Building Services",
    icon: Cog,
    desc: "Step-by-step mechanical/hydraulic isolation checklist, LOTO verification, hot works permit checklist, and emergency egress review for commercial plantrooms.",
    format: "Printable / Copyable / TXT Download",
  },
  {
    slug: "fire-door-inspection-checklist",
    title: "Commercial Fire Door 6-Point Inspection Checklist",
    trade: "Fabric Maintenance & Life Safety",
    icon: ShieldAlert,
    desc: "Statutory 6-point condition audit for FD30S and FD60S fire doors covering gap tolerances (3–4mm), intumescent seals, self-closing devices, and ironmongery.",
    format: "Printable / Copyable / TXT Download",
  },
];

export default function ChecklistsHubPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "Inspection Checklists", url: "/contractor-resources/inspection-checklists" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <ContractorResourceHero
          eyebrow="COMMERCIAL TOOLKITS"
          title="Contractor Inspection Checklists"
          subtitle="Audit-ready compliance frameworks for commercial site delivery."
          intro="Maintain uncompromising quality and statutory compliance on commercial client sites. These downloadable inspection checklists provide structured frameworks for on-site audits, pre-work isolations, and proof-of-delivery sign-offs."
          readTime="5 min overview"
          lastUpdated="September 2026"
          breadcrumbs={breadcrumbs}
          keyTakeaway="Structured inspection checklists reduce compliance failures by up to 70%, ensuring trade engineers complete all statutory checks before commencing work or issuing sign-off."
        />

        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">TECHNICAL FRAMEWORKS</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Select a Trade Inspection Checklist
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Each checklist provides step-by-step statutory verification criteria, inspection thresholds, and instant copy/download functionality for site engineers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CHECKLISTS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.slug}
                    href={`/contractor-resources/${item.slug}`}
                    className="bg-[#FAFAF8] border border-slate-200 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs hover:-translate-y-1 hover:border-[#EA580C]/50 hover:bg-white hover:shadow-card transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="p-2.5 bg-slate-900 text-white rounded-sm group-hover:bg-[#EA580C] transition-colors">
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="text-[10px] font-mono text-[#EA580C] uppercase font-semibold">
                          {item.trade}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#EA580C] transition-colors leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-slate-400">{item.format}</span>
                      <div className="flex items-center gap-1 font-medium text-[#EA580C]">
                        <span>Open Checklist</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <ContractorPortalCtaCard
          headline="Digitise your site inspections with EntireFM"
          description="Contractor Platform members attach digital checklists, calibrated meter logs, and timestamped photo evidence directly to commercial work orders."
          primaryBtnText="Explore Contractor Platform (£95/yr)"
          primaryBtnHref="/suppliers/membership"
        />

        <ContractorRelatedGrid
          heading="Related Contractor Guides &amp; Frameworks"
          currentPath="/contractor-resources/inspection-checklists"
        />
      </main>

      <Footer />
    </div>
  );
}
