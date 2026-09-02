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
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Zap,
  Activity,
  Layers,
  Scale
} from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/risk-assessment", {
  title: "Contractor Risk Assessment Guide UK: 5-Step Process & Matrix | EntireFM",
  description:
    "Comprehensive UK guide to contractor risk assessments in commercial facilities management. 5-step HSE model, 5x5 risk evaluation matrix, hierarchy of controls, and trade hazards.",
});

const RA_FAQS = [
  {
    question: "What is the legal basis for contractor risk assessments in the UK?",
    answer:
      "The statutory duty to conduct risk assessments is set out in Regulation 3 of the Management of Health and Safety at Work Regulations 1999. Employers and self-employed persons must make a 'suitable and sufficient' assessment of risks to employees and non-employees arising out of their work undertakings.",
  },
  {
    question: "What is the 5-step HSE risk assessment model?",
    answer:
      "The Health and Safety Executive (HSE) defines 5 steps: 1) Identify hazards; 2) Assess who might be harmed and how; 3) Evaluate the risks and decide on control measures (using the Hierarchy of Controls); 4) Record your significant findings; and 5) Review your assessment regularly or when circumstances change.",
  },
  {
    question: "How does the 5x5 Risk Matrix work?",
    answer:
      "A 5x5 matrix multiplies Severity (1: Negligible to 5: Catastrophic/Fatality) by Likelihood (1: Improbable to 5: Almost Certain). This produces a risk score from 1 to 25. Scores of 1-6 are generally Low/Acceptable; 8-12 are Medium (tolerable only with strict controls); and 15-25 are High (work must not proceed until re-engineered).",
  },
  {
    question: "What is the Hierarchy of Controls?",
    answer:
      "The statutory hierarchy prioritises risk elimination over personal protection: 1. Elimination (remove hazard completely); 2. Substitution (replace with safer alternative); 3. Engineering Controls (physical barriers, extraction, isolations); 4. Administrative Controls (procedures, training, signage, permits); 5. PPE (Personal Protective Equipment as the last line of defence).",
  },
  {
    question: "Does every minor job require a brand-new risk assessment?",
    answer:
      "Contractors can maintain standard task risk assessments for routine, repetitive activities, provided they perform a dynamic site check upon arrival to confirm that no unique or unrecorded site hazards exist (e.g. nearby public, live cables, poor lighting, or fragile roof lights).",
  },
];

export default function RiskAssessmentGuidePage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "Risk Assessment Guide", url: "/contractor-resources/risk-assessment" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO */}
        <ContractorResourceHero
          eyebrow="STATUTORY SAFETY MANAGEMENT"
          title="Contractor Risk Assessment Guide"
          subtitle="Principles, Matrices &amp; Control Hierarchies for Commercial FM"
          intro="Learn how to conduct robust, audit-ready risk assessments that comply with HSE guidelines, protect operatives on site, and satisfy commercial client compliance audits."
          breadcrumbs={breadcrumbs}
          readTime="7 min read"
          lastUpdated="2026"
          keyTakeaway="A suitable and sufficient risk assessment identifies genuine hazards, applies the statutory hierarchy of controls, and calculates residual risk using standard 5x5 severity/likelihood scoring."
          primaryCta={{ label: "View Risk Assessment Template", href: "/contractor-resources/risk-assessment-template" }}
          secondaryCta={{ label: "Explore Compliance in Portal", href: "/suppliers/membership#platform-overview" }}
        />

        {/* MAIN BODY ARTICLE */}
        <article className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-12">
            {/* 1. The 5-Step Process */}
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">01 // THE HSE 5-STEP MODEL</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                The Five Steps to Contractor Risk Assessment
              </h2>
              <div className="space-y-4 pt-2">
                {[
                  { step: "01", title: "Identify the Hazards", desc: "Inspect the physical working area, equipment, materials, and processes. Look beyond obvious risks to identify invisible hazards such as asbestos, toxic gases, buried cables, or structural weaknesses." },
                  { step: "02", title: "Decide Who Might Be Harmed & How", desc: "Identify all affected groups: your engineers, client building occupants, cleaning staff, delivery drivers, and members of the public (especially children or vulnerable persons if near public boundaries)." },
                  { step: "03", title: "Evaluate Risks & Apply Controls", desc: "Determine the likelihood and severity of harm. Apply the Hierarchy of Controls (Elimination -> Substitution -> Engineering -> Admin -> PPE) to reduce risk As Low As Reasonably Practicable (ALARP)." },
                  { step: "04", title: "Record Your Significant Findings", desc: "Document the hazards, identified risks, control measures, responsible persons, and residual risk scores in an audit-ready format. (Mandatory for employers with 5 or more staff, and required by all FM clients regardless of business size)." },
                  { step: "05", title: "Review & Update When Conditions Change", desc: "Regularly audit the assessment. Immediately revise controls if new equipment is deployed, building operations alter, or an incident occurs on site." },
                ].map((s) => (
                  <div key={s.step} className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm flex gap-4">
                    <span className="text-xl font-bold font-mono text-[#EA580C] shrink-0">{s.step}</span>
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900">{s.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. The 5x5 Matrix */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">02 // QUANTITATIVE EVALUATION</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Understanding the 5x5 Risk Matrix
              </h2>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Risk is mathematically defined as: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">Risk = Severity (1-5) &times; Likelihood (1-5)</code>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">SCORE 1 – 6 // LOW RISK</span>
                  <h4 className="text-sm font-semibold text-emerald-950">Acceptable / Manageable</h4>
                  <p className="text-xs text-emerald-800 font-light leading-relaxed">
                    Standard site precautions and basic PPE are sufficient. Work may proceed under normal supervision.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">SCORE 8 – 12 // MEDIUM RISK</span>
                  <h4 className="text-sm font-semibold text-amber-950">Tolerable with Specific Controls</h4>
                  <p className="text-xs text-amber-800 font-light leading-relaxed">
                    Formal engineering isolations, permits to work, or physical barriers required. Specific briefing before starting.
                  </p>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-sm space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">SCORE 15 – 25 // HIGH RISK</span>
                  <h4 className="text-sm font-semibold text-rose-950">Unacceptable / Immediate Stop</h4>
                  <p className="text-xs text-rose-800 font-light leading-relaxed">
                    Work must not commence. The process must be completely re-engineered or eliminated until residual score drops.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Common Contractor Hazards */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">03 // HAZARD CHECKLIST</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Common Commercial FM Contractor Hazards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: "Working at Height", desc: "Ladders, roofs, plant decks, MEWPs. Falls from height remain the leading cause of fatal injury in UK construction." },
                  { title: "Electricity & Live Conductors", desc: "Electric shock, burns, arc flash explosions, and power interruption to critical building services." },
                  { title: "Hazardous Substances (COSHH)", desc: "Refrigerant gases (R410A/R32/R717), solvents, acidic coil cleaners, water treatment biocides." },
                  { title: "Hot Works & Fire Inception", desc: "Oxy-acetylene brazing, soldering, grinding, roofing torch-on membranes. Strict permit & fire watch required." },
                  { title: "Asbestos Containing Materials (ACMs)", desc: "Disturbance of insulation boards, pipe lagging, floor tiles in pre-2000 commercial properties." },
                  { title: "Lone Working & Confined Spaces", desc: "Working isolated in plantrooms, basements, ceiling voids without immediate alarm communication." },
                ].map((h, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-sm shadow-xs space-y-1">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{h.title}</h4>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">{h.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </article>

        {/* COMMERCIAL CONVERSION COMPONENT */}
        <div className="container-wide">
          <ContractorPortalCtaCard
            headline="Connect your risk assessments directly to live work orders."
            description="EntireFM's Contractor Platform brings together risk assessments, method statements, operative qualifications, and dispatch work orders in one audited workspace."
            bulletPoints={[
              "Pre-built commercial FM risk libraries for M&E, HVAC, Roofing & Cleaning",
              "Operative skills matrix automatically validates engineer training for high-risk tasks",
              "Direct work order integration with photo capture and completion sign-off",
              "All-inclusive contractor membership (£295/yr) with fair work dispatch eligibility",
            ]}
            primaryBtnText="Explore Compliance Tools in Portal"
            primaryBtnHref="/suppliers/membership#platform-overview"
            secondaryBtnText="Join EntireFM Network"
            secondaryBtnHref="/suppliers/membership"
          />
        </div>

        {/* FAQS */}
        <ContractorFaqAccordion
          title="Frequently Asked Questions: Contractor Risk Assessments"
          subtitle="Key guidance on statutory thresholds, matrices, and commercial review requirements."
          faqs={RA_FAQS}
        />

        {/* RELATED RESOURCES */}
        <ContractorRelatedGrid
          heading="Related Safety Guides &amp; Tools"
          subheading="Deepen your safety documentation across the EntireFM contractor ecosystem."
          currentPath="/contractor-resources/risk-assessment"
        />
      </main>

      <Footer />
    </div>
  );
}
