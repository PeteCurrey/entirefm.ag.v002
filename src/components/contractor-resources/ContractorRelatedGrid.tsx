import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, ShieldCheck, CheckSquare, Layers } from "lucide-react";

interface ResourceLink {
  title: string;
  href: string;
  description: string;
  category: "RAMS" | "SAFETY" | "COMPLIANCE" | "DOCS" | "MEMBERSHIP";
}

interface ContractorRelatedGridProps {
  heading?: string;
  subheading?: string;
  currentPath?: string;
  customLinks?: ResourceLink[];
}

const ALL_RESOURCE_LINKS: ResourceLink[] = [
  {
    title: "RAMS Guide for Contractors",
    href: "/contractor-resources/rams",
    description: "Complete guide to Risk Assessments and Method Statements in commercial FM.",
    category: "RAMS",
  },
  {
    title: "RAMS Template & Structure",
    href: "/contractor-resources/rams-template",
    description: "Professional 11-section RAMS template structure with operational examples.",
    category: "RAMS",
  },
  {
    title: "Contractor Risk Assessment Guide",
    href: "/contractor-resources/risk-assessment",
    description: "Hazard identification, 5x5 matrices, control hierarchies, and residual risk.",
    category: "SAFETY",
  },
  {
    title: "Risk Assessment Template",
    href: "/contractor-resources/risk-assessment-template",
    description: "Downloadable contractor risk assessment structure covering 10 common trades.",
    category: "SAFETY",
  },
  {
    title: "Method Statement Guide",
    href: "/contractor-resources/method-statement",
    description: "Step-by-step safe sequence of works, equipment, PPE, and emergency protocols.",
    category: "DOCS",
  },
  {
    title: "Method Statement Template",
    href: "/contractor-resources/method-statement-template",
    description: "Standard commercial method statement template for FM subcontractor work.",
    category: "DOCS",
  },
  {
    title: "COSHH Assessment Guide",
    href: "/contractor-resources/coshh-assessment",
    description: "Managing hazardous substances, safety data sheets, exposure routes and controls.",
    category: "SAFETY",
  },
  {
    title: "Contractor Compliance Standard",
    href: "/contractor-resources/contractor-compliance",
    description: "Insurance thresholds, qualifications, accreditations and vetting checklists.",
    category: "COMPLIANCE",
  },
  {
    title: "Supplier Platform & Membership",
    href: "/suppliers/membership",
    description: "Join the EntireFM supplier network with the tools to manage your business (£95/yr).",
    category: "MEMBERSHIP",
  },
];

export function ContractorRelatedGrid({
  heading = "Related Contractor Resources",
  subheading = "Explore practical guides, templates and compliance tools across the EntireFM contractor ecosystem.",
  currentPath,
  customLinks,
}: ContractorRelatedGridProps) {
  const linksToDisplay = (customLinks || ALL_RESOURCE_LINKS)
    .filter((l) => l.href !== currentPath)
    .slice(0, 4);

  return (
    <section className="py-16 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-wide space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="eyebrow eyebrow-light">KNOWLEDGE ECOSYSTEM</span>
          <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
            {heading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {linksToDisplay.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white border border-slate-200 rounded-sm p-5 space-y-3 shadow-xs hover:-translate-y-1 hover:shadow-card transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#EA580C]">
                  {link.category}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#EA580C] transition-colors leading-snug">
                  {link.title}
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {link.description}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1 text-[11.5px] font-medium text-[#EA580C]">
                <span>Read Resource</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
