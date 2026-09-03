import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContractorResourceHero } from "@/components/contractor-resources/ContractorResourceHero";
import { ContractorPortalCtaCard } from "@/components/contractor-resources/ContractorPortalCtaCard";
import { ContractorFaqAccordion } from "@/components/contractor-resources/ContractorFaqAccordion";
import { ContractorRelatedGrid } from "@/components/contractor-resources/ContractorRelatedGrid";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ListOrdered,
  Layers,
  ShieldCheck,
  HardHat,
  Truck,
  RotateCw
} from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/method-statement", {
  title: "Method Statement Guide for Contractors UK | Safe System of Work | EntireFM",
  description:
    "How to write a professional Method Statement (Safe System of Work) for UK facilities management. Step-by-step sequence, equipment, plant, PPE, and emergency protocols.",
});

const MS_FAQS = [
  {
    question: "What is a Method Statement?",
    answer:
      "A Method Statement (often referred to as a Safe System of Work or SSoW) is a detailed, chronological document detailing exactly how a specific job will be carried out safely. It outlines the sequence of operations, equipment to be used, isolation procedures, required PPE, and emergency arrangements.",
  },
  {
    question: "What is the difference between a RAMS and a Method Statement?",
    answer:
      "RAMS includes both the Risk Assessment (which evaluates hazards and calculates scores) and the Method Statement. The Method Statement is the practical, operational half of RAMS — it takes the control measures identified in the Risk Assessment and turns them into a step-by-step procedure for operatives to follow on site.",
  },
  {
    question: "Who writes the Method Statement?",
    answer:
      "The contractor or subcontractor undertaking the work must author the Method Statement. It should be written by a technically competent person who understands the trade, plant, site constraints, and equipment involved.",
  },
  {
    question: "Can I use the same Method Statement for multiple sites?",
    answer:
      "While core engineering procedures (such as changing a 3-port valve or servicing an AHU) remain similar, the Method Statement must be adapted to each site's physical layout, access routes, building occupancy, isolation points, and emergency muster stations.",
  },
];

export default function MethodStatementGuidePage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "Method Statement Guide", url: "/contractor-resources/method-statement" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO */}
        <ContractorResourceHero
          eyebrow="SAFE SYSTEM OF WORK (SSOW)"
          title="Method Statements for Contractors"
          subtitle="How to write, structure and execute safe systems of work."
          intro="A comprehensive UK guide to authoring professional, audit-ready Method Statements for commercial facilities management, M&E engineering, and building maintenance work."
          breadcrumbs={breadcrumbs}
          readTime="7 min read"
          lastUpdated="2026"
          keyTakeaway="A method statement translates safety controls into an actionable, chronological sequence of operations that site engineers can easily follow and commercial clients can verify."
          primaryCta={{ label: "View Method Statement Template", href: "/contractor-resources/method-statement-template" }}
          secondaryCta={{ label: "Explore RAMS in Portal", href: "/suppliers/membership#platform-overview" }}
        />

        {/* MAIN BODY ARTICLE */}
        <article className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-12">
            {/* 1. Relationship Diagram */}
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">01 // THE RAMS WORKFLOW</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                How the Method Statement Connects to the Job
              </h2>
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-white border border-slate-200 rounded-sm space-y-1">
                    <span className="text-xs font-bold text-[#EA580C] uppercase block">STEP 1</span>
                    <h4 className="text-xs font-semibold text-slate-900">Risk Assessment</h4>
                    <p className="text-[11px] text-slate-500 font-light">Identifies hazards and required controls.</p>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-sm space-y-1">
                    <span className="text-xs font-bold text-blue-600 uppercase block">STEP 2</span>
                    <h4 className="text-xs font-semibold text-slate-900">Method Statement</h4>
                    <p className="text-[11px] text-slate-500 font-light">Explains how work is safely executed step-by-step.</p>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-sm space-y-1">
                    <span className="text-xs font-bold text-emerald-600 uppercase block">STEP 3</span>
                    <h4 className="text-xs font-semibold text-slate-900">On-Site Delivery</h4>
                    <p className="text-[11px] text-slate-500 font-light">Operatives follow sequence and agreed controls.</p>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-sm space-y-1">
                    <span className="text-xs font-bold text-purple-600 uppercase block">STEP 4</span>
                    <h4 className="text-xs font-semibold text-slate-900">Review &amp; Evidence</h4>
                    <p className="text-[11px] text-slate-500 font-light">Photos, test sheets, and sign-offs captured.</p>
                  </div>
                </div>

                {/* Deep Guide Quick Link */}
                <div className="p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold text-[#EA580C] uppercase block">IN-DEPTH GUIDE</span>
                    <h4 className="text-sm font-semibold text-slate-900">What Is a Method Statement? Comprehensive Contractor Guide</h4>
                    <p className="text-xs text-slate-500 font-light">Explore safe systems of work, mandatory sections, and common drafting errors.</p>
                  </div>
                  <Link
                    href="/contractor-resources/rams/what-is-a-method-statement"
                    className="btn-primary text-xs py-2 px-4 shrink-0"
                  >
                    Read Guide &rarr;
                  </Link>
                </div>
              </div>
            </section>

            {/* 2. Typical Structure */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">02 // DOCUMENT SECTIONS</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Core Sections of a Professional Method Statement
              </h2>
              <div className="prose-brand space-y-3 text-slate-700 text-sm font-light leading-relaxed">
                {[
                  { n: "01", t: "Project, Scope & Location", d: "Detailed task description, location, operating hours, client contact details." },
                  { n: "02", t: "Supervision & Personnel Competencies", d: "Named supervisor, CSCS/JIB/Gas Safe registration numbers, first aider details." },
                  { n: "03", t: "Access, Egress & Plant Delivery", d: "Routes to work area, loading bay arrangements, lift usage, protection of client flooring." },
                  { n: "04", t: "Plant, Machinery & Tooling (PUWER/LOLER)", d: "All 110V/battery tools, ladders, scaffold towers (PASMA), calibration test certs." },
                  { n: "05", t: "Personal Protective Equipment (PPE)", d: "Task-specific PPE: dielectric gloves, eye protection, harness, FFP3 masks." },
                  { n: "06", t: "Step-by-Step Chronological Sequence", d: "Arrival -> Isolations/LOTO -> Intrusive Works -> Testing/Commissioning -> Clean-down." },
                  { n: "07", t: "Emergency, Fire & Spill Arrangements", d: "Nearest fire exit, assembly point, spill kit location, emergency rescue procedures." },
                  { n: "08", t: "Waste Management & Environmental Controls", d: "Licensed waste disposal, hazardous chemical containment, scrap metal recycling." },
                ].map((item) => (
                  <div key={item.n} className="flex items-start gap-3 p-3.5 bg-[#FAFAF8] border border-slate-200 rounded-sm">
                    <span className="font-mono text-xs font-bold text-[#EA580C] shrink-0 mt-0.5">{item.n}</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{item.t}</h4>
                      <p className="text-xs text-slate-600 font-light mt-0.5 leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </article>

        {/* COMMERCIAL CONVERSION COMPONENT */}
        <div className="container-wide">
          <ContractorPortalCtaCard
            headline="Stop rewriting method statements from scratch."
            description="The EntireFM Contractor Platform includes customisable method statement templates for commercial FM trades. Attach engineer qualifications, link valid insurance, and record digital sign-offs in one audited hub."
            bulletPoints={[
              "Pre-built step-by-step methods for HVAC, Electrical, Plumbing, Roofing and Cleaning",
              "Integrated document vault ensuring proof of insurance and operative qualifications",
              "Direct connection to work order dispatch and digital purchase orders",
              "Supplier platform membership (£95/yr) with fair supply chain participation",
            ]}
            primaryBtnText="Explore Method Builder in Portal"
            primaryBtnHref="/suppliers/membership#platform-overview"
            secondaryBtnText="Join EntireFM Network"
            secondaryBtnHref="/suppliers/membership"
          />
        </div>

        {/* FAQS */}
        <ContractorFaqAccordion
          title="Method Statement FAQs"
          subtitle="Practical answers on drafting, site variations, and client sign-off procedures."
          faqs={MS_FAQS}
        />

        {/* RELATED RESOURCES */}
        <ContractorRelatedGrid
          heading="Related Method &amp; Safety Resources"
          subheading="Deepen your operational documentation across the EntireFM contractor ecosystem."
          currentPath="/contractor-resources/method-statement"
        />
      </main>

      <Footer />
    </div>
  );
}
