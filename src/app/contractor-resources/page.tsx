import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContractorResourceHero } from "@/components/contractor-resources/ContractorResourceHero";
import { ContractorPortalCtaCard } from "@/components/contractor-resources/ContractorPortalCtaCard";
import { ContractorFaqAccordion } from "@/components/contractor-resources/ContractorFaqAccordion";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";
import {
  FileText,
  ShieldCheck,
  HardDrive,
  Briefcase,
  Layers,
  ArrowRight,
  Download,
  CheckCircle2,
  Sliders,
  Award,
  AlertTriangle,
  Building2,
  FileCheck,
  Flame,
  Zap,
  Hammer,
  Wrench
} from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources", {
  title: "Contractor Resources | RAMS, Templates & Compliance Guides | EntireFM",
  description:
    "Practical guidance, downloadable templates and compliance frameworks for UK contractors. RAMS, risk assessments, method statements, COSHH, and FM supply chain standards.",
});

const CATEGORIES = [
  {
    id: "interactive-tools",
    title: "Interactive Contractor Tools & Checks",
    eyebrow: "SELF-ASSESSMENT TOOLS",
    icon: Wrench,
    description: "Free interactive readiness checks and audits for UK contractors. Evaluate RAMS, compliance, COSHH, onboarding, and job attendance.",
    articles: [
      {
        title: "All Contractor Tools Hub",
        href: "/contractor-tools",
        desc: "Overview of interactive readiness checks, compliance scoring, and practical contractor toolkits.",
        badge: "TOOLS HUB",
      },
      {
        title: "RAMS Readiness Check",
        href: "/contractor-tools/rams-readiness-check",
        desc: "Evaluate your RAMS preparation across project scope, people competence, hazards, site controls, and evidence.",
        badge: "INTERACTIVE",
      },
      {
        title: "Contractor Compliance Check",
        href: "/contractor-tools/contractor-compliance-check",
        desc: "Review business info, insurances, qualifications, SSIP accreditation, and H&S documentation.",
        badge: "AUDIT",
      },
      {
        title: "Contractor Document Checklist",
        href: "/contractor-tools/contractor-document-checklist",
        desc: "Mobile-ready audit of company records, insurances, H&S policies, RAMS, COSHH, and statutory licences.",
        badge: "CHECKLIST",
      },
      {
        title: "COSHH Readiness Check",
        href: "/contractor-tools/coshh-readiness-check",
        desc: "Check preparation for hazardous substances, Safety Data Sheets (SDS), exposure routes, and spill response.",
        badge: "COSHH",
      },
      {
        title: "Contractor Onboarding Checklist",
        href: "/contractor-tools/contractor-onboarding-checklist",
        desc: "Step-by-step preparation for joining a professional FM supply chain and setting up digital portal profiles.",
        badge: "ONBOARDING",
      },
      {
        title: "Job Readiness Check",
        href: "/contractor-tools/job-readiness-check",
        desc: "Three-stage job attendance checklist: before travel, on site hazard assessment, and completion sign-off.",
        badge: "JOB PREP",
      },
    ],
  },
  {
    id: "inspection-checklists",
    title: "Inspection Checklists & Toolkits",
    eyebrow: "SITE ASSURANCE",
    icon: FileCheck,
    description: "Practical trade inspection checklists for commercial switchgear, F-Gas logbooks, plantroom isolations, and fire doors.",
    articles: [
      {
        title: "All Inspection Checklists Hub",
        href: "/contractor-resources/inspection-checklists",
        desc: "Overview of statutory inspection toolkits and audit checklists for commercial trade contractors.",
        badge: "DIRECTORY",
      },
      {
        title: "Commercial EICR Visual Inspection Checklist",
        href: "/contractor-resources/eicr-visual-checklist",
        desc: "10-point visual condition checklist for three-phase switchboards and protective devices under BS 7671.",
        badge: "CHECKLIST",
      },
      {
        title: "F-Gas Statutory Inspection & Leak Test Checklist",
        href: "/contractor-resources/fgas-inspection-checklist",
        desc: "Leak testing protocol, CO2e calculations, cylinder tracking, and recovery logsheet framework.",
        badge: "STATUTORY",
      },
      {
        title: "Plantroom Pre-Work Safety Checklist",
        href: "/contractor-resources/plantroom-pre-work-checklist",
        desc: "Step-by-step mechanical isolation, LOTO verification, pressure release, and emergency egress review.",
        badge: "PROCEDURE",
      },
      {
        title: "Commercial Fire Door 6-Point Checklist",
        href: "/contractor-resources/fire-door-inspection-checklist",
        desc: "Statutory 6-point condition audit covering gap tolerances (3-4mm), intumescent seals, and closers.",
        badge: "LIFE SAFETY",
      },
    ],
  },

  {
    id: "rams-method-statements",
    title: "RAMS & Method Statements",
    eyebrow: "CORE DOCUMENTATION",
    icon: FileText,
    description: "Essential frameworks for hazard identification, safe systems of work, and commercial client documentation.",
    articles: [
      {
        title: "RAMS Guide for Contractors",
        href: "/contractor-resources/rams",
        desc: "What RAMS means, when required by FM clients, document anatomy, and practical review cycles.",
        badge: "CORE GUIDE",
      },
      {
        title: "RAMS Template (11-Section Framework)",
        href: "/contractor-resources/rams-template",
        desc: "Complete downloadable structure covering project scope, hazards, controls, PPE and sign-offs.",
        badge: "TEMPLATE",
      },
      {
        title: "Contractor Risk Assessment Guide",
        href: "/contractor-resources/risk-assessment",
        desc: "Hazard identification, 5x5 severity/likelihood evaluation, hierarchy of controls, and residual risk.",
        badge: "SAFETY GUIDE",
      },
      {
        title: "Risk Assessment Template",
        href: "/contractor-resources/risk-assessment-template",
        desc: "Structured risk matrix and hazard controls covering 10 major commercial trades.",
        badge: "TEMPLATE",
      },
      {
        title: "Method Statement Guide",
        href: "/contractor-resources/method-statement",
        desc: "Step-by-step sequence of works, equipment safety, plant checks, and emergency procedures.",
        badge: "OPERATIONAL",
      },
      {
        title: "Method Statement Template",
        href: "/contractor-resources/method-statement-template",
        desc: "Standard commercial safe system of work (SSoW) template for sub-contractor delivery.",
        badge: "TEMPLATE",
      },
    ],
  },
  {
    id: "health-safety",
    title: "Health, Safety & Chemical Control",
    eyebrow: "STATUTORY GOVERNANCE",
    icon: ShieldCheck,
    description: "Practical compliance guidance across high-hazard environments, chemical safety, and site welfare.",
    articles: [
      {
        title: "COSHH Assessment Guide for Contractors",
        href: "/contractor-resources/coshh-assessment",
        desc: "Control of Substances Hazardous to Health: Safety Data Sheets, exposure routes, ventilation & storage.",
        badge: "COSHH GUIDE",
      },
      {
        title: "Working at Height Protocol",
        href: "/contractor-resources/risk-assessment#height",
        desc: "Ladders, MEWPs, scaffold inspections, harness inspections, and edge protection requirements.",
        badge: "PROCEDURE",
      },
      {
        title: "Electrical & Hot Works Safety Controls",
        href: "/contractor-resources/risk-assessment#electrical",
        desc: "Lock-Out Tag-Out (LOTO), arc flash precautions, permit-to-work systems, and fire watches.",
        badge: "COMPLIANCE",
      },
    ],
  },
  {
    id: "contractor-compliance",
    title: "Contractor Compliance & Vetting",
    eyebrow: "SUPPLY CHAIN INTEGRITY",
    icon: Award,
    description: "Insurance standards, accreditation verifications, PQQ requirements, and onboarding frameworks.",
    articles: [
      {
        title: "Contractor Compliance Standard",
        href: "/contractor-resources/contractor-compliance",
        desc: "Mandatory public liability, trade qualifications, SSIP accreditations, and expiry management.",
        badge: "FM STANDARD",
      },
      {
        title: "Contractor Document Vault Management",
        href: "/suppliers/membership#platform-overview",
        desc: "Centralised digital repository for company insurance, operative cards, and policy documentation.",
        badge: "SYSTEMS",
      },
    ],
  },
  {
    id: "job-documentation",
    title: "Job Documentation & Evidence",
    eyebrow: "FIELD EXECUTION",
    icon: HardDrive,
    description: "Maintaining audit-ready job sheets, photographic evidence, engineer reports, and completion sign-offs.",
    articles: [
      {
        title: "Digital Job Packs & Work Order Dispatch",
        href: "/suppliers/membership#platform-overview",
        desc: "How EntireFM connects work instructions, site access notes, and completion evidence.",
        badge: "OPERATIONS",
      },
      {
        title: "Photographic Evidence Standards in FM",
        href: "/contractor-resources/method-statement#evidence",
        desc: "Timestamped before/after records, defect documentation, and client handover files.",
        badge: "BEST PRACTICE",
      },
    ],
  },
  {
    id: "contractor-business",
    title: "Contractor Business & Operating Models",
    eyebrow: "COMMERCIAL PRACTICE",
    icon: Briefcase,
    description: "Working effectively with FM companies, managing labour recovery, and growing a sustainable business.",
    articles: [
      {
        title: "Labour Recovery Rate & Cost Modelling",
        href: "/suppliers/membership#tools",
        desc: "Calculating the true hourly overhead recovery cost for engineers, downtime, and fleet vehicles.",
        badge: "CALCULATOR",
      },
      {
        title: "Joining the EntireFM Supplier Network",
        href: "/suppliers/membership",
        desc: "Supplier Platform membership (£95/yr): operating system, document vault, and work eligibility.",
        badge: "MEMBERSHIP",
      },
    ],
  },
];

const HUB_FAQS = [
  {
    question: "Why does EntireFM provide free contractor resources and templates?",
    answer:
      "EntireFM works with specialist contractors across the UK. Supplying clear, professional frameworks for RAMS, risk assessments, and compliance helps elevate standards across the entire supply chain. High-quality documentation protects engineers on site and ensures commercial clients receive audit-ready records.",
  },
  {
    question: "Can I download and use these templates for my own business?",
    answer:
      "Yes. All templates are freely accessible and designed to be adapted to your company, trade, and specific site conditions. We do not gate these resources behind mandatory email capture forms.",
  },
  {
    question: "Does using a template mean my business is automatically compliant?",
    answer:
      "No generic template can guarantee statutory compliance on its own. Templates provide a professional structural baseline, but you must assess actual site risks, operative competencies, equipment suitability, and client-specific requirements for every job.",
  },
  {
    question: "What is the EntireFM Contractor Platform?",
    answer:
      "The EntireFM Contractor Platform is a dedicated digital operating environment for UK contractors. For £95+VAT/year, members receive an integrated compliance dashboard, document vault with automated 90/60/30-day expiry tracking, FM-specific RAMS builder, workforce competency matrix, business calculators, and eligibility for applicable work across EntireFM's client portfolio.",
  },
];

export default function ContractorResourcesHubPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Suppliers", url: "/suppliers" },
    { name: "Contractor Resources", url: "/contractor-resources" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO */}
        <ContractorResourceHero
          eyebrow="ENTIREFM CONTRACTOR KNOWLEDGE BASE"
          title="Contractor Resources"
          subtitle="Practical guidance, templates and compliance frameworks."
          intro="Practical guidance, downloadable templates and compliance resources to help UK contractors manage RAMS, risk assessments, documentation and commercial FM work professionally."
          breadcrumbs={breadcrumbs}
          readTime="Knowledge Hub"
          lastUpdated="2026"
          keyTakeaway="High-intent operational resources for trade contractors: structured RAMS frameworks, chemical safety guidelines, insurance requirements, and commercial compliance standards."
          primaryCta={{ label: "Explore the Contractor Portal", href: "/suppliers/membership#platform-overview" }}
          secondaryCta={{ label: "Supplier Membership (£95/yr)", href: "/suppliers/membership" }}
        />

        {/* CATEGORY EXPLORATION MATRIX */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-wide space-y-20">
            {CATEGORIES.map((cat, catIdx) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} id={cat.id} className="space-y-8 scroll-mt-24">
                  {/* Category Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#EA580C]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
                          {cat.eyebrow}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                        {cat.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <span className="text-xs font-mono text-slate-400 shrink-0">
                      {cat.articles.length} Resources Available
                    </span>
                  </div>

                  {/* Article Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cat.articles.map((art) => (
                      <Link
                        key={art.href}
                        href={art.href}
                        className="bg-[#FAFAF8] border border-slate-200 rounded-sm p-6 space-y-3 shadow-xs hover:-translate-y-1 hover:border-[#EA580C]/50 hover:bg-white hover:shadow-card transition-all group flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <span className="inline-block text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-white border border-slate-200 text-slate-700">
                            {art.badge}
                          </span>
                          <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#EA580C] transition-colors leading-snug">
                            {art.title}
                          </h3>
                          <p className="text-xs text-slate-600 font-light leading-relaxed">
                            {art.desc}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-[#EA580C]">
                          <span>Read Full Resource</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMMERCIAL CONVERSION COMPONENT */}
        <div className="container-wide">
          <ContractorPortalCtaCard
            headline="Your contractor documents shouldn't live scattered in Word and email."
            description="RAMS, public liability insurance, Gas Safe / NICEIC accreditations, engineer qualifications and job completion packs all belong in one connected digital operations workspace."
            bulletPoints={[
              "Centralised Document Vault with automated 90/60/30-day renewal alerts",
              "Integrated RAMS builder with site controls and digital operative sign-offs",
              "Direct work order dispatch, photographic evidence & purchase order tracking",
              "Verified supply chain partner status within EntireFM's commercial network (£95/yr)",
            ]}
            primaryBtnText="Explore the Contractor Portal"
            primaryBtnHref="/suppliers/membership#platform-overview"
            secondaryBtnText="View Contractor Membership"
            secondaryBtnHref="/suppliers/membership"
          />
        </div>

        {/* FAQ ACCORDION */}
        <ContractorFaqAccordion
          title="Contractor Resources &amp; Platform FAQs"
          subtitle="Answers to common questions regarding template use, statutory compliance, and EntireFM contractor membership."
          faqs={HUB_FAQS}
        />
      </main>

      <Footer />
    </div>
  );
}
