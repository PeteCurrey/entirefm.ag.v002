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
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  ClipboardList
} from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/rams", {
  title: "RAMS for Contractors: Risk Assessment & Method Statement UK | EntireFM",
  description:
    "Complete contractor guide to RAMS (Risk Assessment & Method Statement) in the UK. Understand legal duties, document anatomy, differences between RA and MS, and client review expectations.",
});

const RAMS_FAQS = [
  {
    question: "What does RAMS stand for?",
    answer:
      "RAMS stands for Risk Assessment and Method Statement. It is a combined safety package that identifies the hazards associated with a job (the Risk Assessment) and details the exact, step-by-step safe procedure for completing the work (the Method Statement).",
  },
  {
    question: "Are RAMS legally required in the UK?",
    answer:
      "Under the Management of Health and Safety at Work Regulations 1999 (Regulation 3), employers and self-employed contractors have a statutory duty to conduct suitable and sufficient risk assessments. While the term 'Method Statement' is not explicitly written into UK statute, preparing safe systems of work is a legal duty under the Health and Safety at Work etc. Act 1974. Principal Contractors and commercial FM clients almost universally require RAMS before issuing a permit to work or allowing contractors on site.",
  },
  {
    question: "What is the key difference between a Risk Assessment and a Method Statement?",
    answer:
      "A Risk Assessment identifies hazards, evaluates who could be harmed and how, and defines the control measures required to mitigate that risk. A Method Statement translates those controls into practical, chronological instructions for the engineers or operatives performing the work (covering sequence, plant, PPE, isolations, and emergency procedures).",
  },
  {
    question: "Can I use a generic or universal RAMS document for every job?",
    answer:
      "No. While contractors often maintain baseline template libraries for common tasks, a generic RAMS document that fails to reflect site-specific hazards (e.g. fragile roofs, asbestos locations, occupied commercial offices, restricted access, live services) is commonly rejected by FM compliance desks. RAMS must be reviewed and tailored to the actual physical site and scope.",
  },
  {
    question: "Who is responsible for preparing and signing off RAMS?",
    answer:
      "The contractor performing the work is responsible for creating technically competent RAMS. A designated competent person (such as a qualified supervisor, H&S manager, or business owner) must author or approve the document. Furthermore, all operatives attending the site must read, acknowledge, and sign the RAMS before starting work.",
  },
  {
    question: "How often should RAMS documents be reviewed and updated?",
    answer:
      "RAMS must be reviewed whenever site conditions change, new hazards emerge, scope expands, unforeseen plant is required, or following an incident or near miss. For long-term planned maintenance contracts, RAMS should be formally reviewed at least annually.",
  },
];

export default function RamsGuidePage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "RAMS Guide", url: "/contractor-resources/rams" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO */}
        <ContractorResourceHero
          eyebrow="CONTRACTOR SAFETY &amp; COMPLIANCE FRAMEWORK"
          title="RAMS: Risk Assessments &amp; Method Statements for Contractors"
          subtitle="A comprehensive UK operational guide."
          intro="Everything professional trade contractors need to know about preparing, reviewing, and managing Risk Assessments and Method Statements (RAMS) for commercial facilities management and construction clients."
          breadcrumbs={breadcrumbs}
          readTime="8 min read"
          lastUpdated="2026"
          keyTakeaway="RAMS is the gold standard for communicating safe systems of work to commercial clients. Combining quantitative hazard assessment with detailed sequential methods ensures statutory compliance and smooth site access."
          primaryCta={{ label: "View RAMS Template", href: "/contractor-resources/rams-template" }}
          secondaryCta={{ label: "Explore RAMS Builder in Portal", href: "/suppliers/membership#platform-overview" }}
        />

        {/* CONTENT ARTICLE */}
        <article className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-12">
            {/* 1. What is RAMS */}
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">01 // DEFINITION &amp; PURPOSE</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                What is a RAMS Document?
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  In UK facilities management and construction, <strong>RAMS</strong> is an acronym for <strong>Risk Assessment and Method Statement</strong>. It represents a paired package of safety documentation created prior to undertaking any high-risk, intrusive, or commercial maintenance task.
                </p>
                <p>
                  Rather than treating safety as an abstract compliance exercise, a well-structured RAMS bridges the gap between statutory obligations and real-world site execution. It answers two fundamental questions for clients, building managers, and site engineers:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="p-5 rounded-sm bg-[#FAFAF8] border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider block">
                      PART 1: THE RISK ASSESSMENT
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">What could go wrong?</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      Identifies hazards (e.g. electrical shock, falls from height, toxic fumes, manual handling strains), assesses who is at risk, and specifies control measures to reduce residual risk to an acceptable level.
                    </p>
                  </div>

                  <div className="p-5 rounded-sm bg-[#FAFAF8] border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      PART 2: THE METHOD STATEMENT
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">How will we do the job safely?</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      Provides a clear, step-by-step sequential breakdown of how the task will be carried out, including access arrangements, tool inspections, isolation protocols, PPE, and emergency plans.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Why FM Clients Demand RAMS */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">02 // CLIENT EXPECTATIONS</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                What Facilities Management Clients Look For in Your RAMS
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  When an FM organisation such as EntireFM reviews a subcontractor's RAMS, the review desk is ensuring that the contractor understands the physical realities of the site and possesses the technical competence to safeguard building occupants, assets, and operatives.
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    {
                      title: "Site-Specific Context vs. Generic Cut-and-Paste",
                      desc: "The document must explicitly name the site, address, specific plant or equipment (e.g. AHU-02 on Roof Level), and account for surrounding building operations (such as occupied offices, schools, or retail units).",
                    },
                    {
                      title: "Clear Isolation and Permit Controls",
                      desc: "Detailed procedures for electrical Lock-Out Tag-Out (LOTO), hot work permits, confined space entry, or rooftop access authorisations.",
                    },
                    {
                      title: "Competent Operative Allocation",
                      desc: "Evidence that operatives assigned to the job hold relevant trade qualifications (e.g. F-Gas, Gas Safe, 18th Edition, IPAF, PASMA, CSCS).",
                    },
                    {
                      title: "Emergency Rescue & Environmental Plans",
                      desc: "Actionable protocols for fire evacuation, first aid cover, chemical spill control, or rescue from height.",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-[#FAFAF8] border border-slate-200 rounded-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-600 font-light mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. The 11 Core Sections of an Audit-Ready RAMS */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">03 // DOCUMENT ANATOMY</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Anatomy of a Professional RAMS Document
              </h2>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Every commercial RAMS package should follow a logical, 11-section structure that ensures nothing critical is overlooked:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {[
                  { n: "01", t: "Project & Site Details", d: "Client name, site address, principal contractor, emergency contacts, date of works." },
                  { n: "02", t: "Scope of Works", d: "Explicit, unambiguous description of the exact task to be performed." },
                  { n: "03", t: "Supervision & Responsibilities", d: "Named lead engineer, appointed first aiders, safety supervisor contact numbers." },
                  { n: "04", t: "Hazard Identification & Matrix", d: "5x5 severity vs likelihood risk ratings before and after control measures." },
                  { n: "05", t: "Specific Risk Controls", d: "Physical controls, barriers, isolations, signage, and administrative procedures." },
                  { n: "06", t: "PPE Assessment", d: "Mandatory personal protective equipment (safety footwear, eye protection, gloves, hi-vis)." },
                  { n: "07", t: "Plant & Equipment Verification", d: "Tools, access equipment (ladders/scaffolding/MEWP), calibration and PAT certificates." },
                  { n: "08", t: "Step-by-Step Method Sequence", d: "Chronological narrative: Arrival -> Isolation -> Execution -> Re-commissioning -> Clean-down." },
                  { n: "09", t: "Emergency & First Aid Protocols", d: "Site first aider, hospital location, spill response, evacuation muster point." },
                  { n: "10", t: "Environmental & Waste Disposal", d: "Waste transfer notes, hazardous substance disposal, noise and vibration controls." },
                  { n: "11", t: "Operative Sign-Off Register", d: "Printed names, signatures, CSCS/trade numbers, and date of briefing before work begins." },
                ].map((s) => (
                  <div key={s.n} className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#EA580C]">{s.n}</span>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{s.t}</h4>
                    </div>
                    <p className="text-[11.5px] text-slate-600 font-light leading-relaxed">{s.d}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/contractor-resources/rams-template" className="btn-primary text-xs py-2.5 px-5">
                  Download Full RAMS Template &rarr;
                </Link>
                <Link href="/contractor-resources/risk-assessment" className="btn-outline text-xs py-2.5 px-5">
                  Explore Risk Assessment Guide
                </Link>
              </div>
            </section>
          </div>
        </article>

        {/* COMMERCIAL CONVERSION COMPONENT */}
        <div className="container-wide">
          <ContractorPortalCtaCard
            headline="Stop generating static Word RAMS for every job."
            description="The EntireFM Contractor Platform includes a built-in RAMS creator tailored specifically for commercial FM trades. Select pre-vetted hazard libraries, attach engineer competencies, and collect digital operative sign-offs directly on site."
            bulletPoints={[
              "FM-specific RAMS builder with trade templates (HVAC, Electrical, Plumbing, Cleaning)",
              "Integrated Document Vault holding valid insurance policies and trade qualifications",
              "Operative sign-off matrix tracking who has read and acknowledged the method statement",
              "Real-time work dispatch and purchase order linkage in the EntireFM contractor ecosystem",
            ]}
            primaryBtnText="Explore RAMS Builder in Portal"
            primaryBtnHref="/suppliers/membership#platform-overview"
            secondaryBtnText="Join Supplier Network (£95/yr)"
            secondaryBtnHref="/suppliers/membership"
          />
        </div>

        {/* FAQS */}
        <ContractorFaqAccordion
          title="Frequently Asked Questions about Contractor RAMS"
          subtitle="Clear answers on statutory requirements, reviews, and FM client documentation standards."
          faqs={RAMS_FAQS}
        />

        {/* RELATED RESOURCES */}
        <ContractorRelatedGrid
          heading="Related Contractor Guides &amp; Templates"
          subheading="Deepen your compliance and documentation workflow across the EntireFM contractor ecosystem."
          currentPath="/contractor-resources/rams"
        />
      </main>

      <Footer />
    </div>
  );
}
