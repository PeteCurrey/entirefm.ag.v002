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
  FlaskConical,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  Wind,
  Layers,
  FileCheck
} from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/coshh-assessment", {
  title: "COSHH Assessment Guide for Contractors UK | EntireFM",
  description:
    "Complete contractor guide to COSHH assessments (Control of Substances Hazardous to Health Regulations 2002). Chemical safety, Safety Data Sheets (SDS), exposure limits, ventilation, and storage.",
});

const COSHH_FAQS = [
  {
    question: "What is COSHH?",
    answer:
      "COSHH stands for the Control of Substances Hazardous to Health Regulations 2002 (as amended). It is the UK statutory framework requiring employers and contractors to prevent or reduce workers' exposure to hazardous substances (including chemicals, fumes, dusts, vapours, gases, and biological agents).",
  },
  {
    question: "What is the difference between a Safety Data Sheet (SDS) and a COSHH Assessment?",
    answer:
      "A Safety Data Sheet (SDS) is provided by the chemical manufacturer and describes the substance's properties, hazards, and first aid measures in the bottle. A COSHH Assessment is written by the contractor and evaluates how that substance will actually be used on site (e.g. quantity, dilution, ventilation, application method, operative exposure duration, and emergency controls). Having an SDS is NOT the same as conducting a COSHH assessment.",
  },
  {
    question: "Which trades require COSHH assessments?",
    answer:
      "Almost every trade works with hazardous substances: Cleaners (detergents, descalers, bleach, sanitiser); HVAC/Refrigeration engineers (refrigerant gases, coil cleaners, compressor oils); Plumbers (flux, solder, solvent cement, drain acids); Electricians (cable pulling lubricants, solvent cleaners, resin jointing kits); Fabric/Decorating contractors (paints, solvents, adhesives, fillers, wood dust).",
  },
  {
    question: "What are Workplace Exposure Limits (WELs)?",
    answer:
      "Workplace Exposure Limits (set out in HSE publication EH40) are legal maximum concentrations of airborne hazardous substances averaged over an 8-hour Time Weighted Average (TWA) or 15-minute Short-Term Exposure Limit (STEL). COSHH assessments must demonstrate that controls keep operative exposure well below these statutory limits.",
  },
];

export default function CoshhAssessmentGuidePage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "COSHH Assessment Guide", url: "/contractor-resources/coshh-assessment" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO */}
        <ContractorResourceHero
          eyebrow="CHEMICAL &amp; SUBSTANCE GOVERNANCE"
          title="COSHH Assessments for Contractors"
          subtitle="Managing hazardous substances under UK health &amp; safety law."
          intro="A practical operational guide to managing chemicals, gases, fumes, and hazardous substances under the Control of Substances Hazardous to Health Regulations 2002 for UK commercial contractors."
          breadcrumbs={breadcrumbs}
          readTime="7 min read"
          lastUpdated="2026"
          keyTakeaway="An SDS is not a COSHH assessment. A valid COSHH evaluation details how a substance is stored, diluted, applied, ventilated, and contained in real site conditions."
          primaryCta={{ label: "Explore Document Vault in Portal", href: "/suppliers/membership#platform-overview" }}
          secondaryCta={{ label: "View RAMS Guide", href: "/contractor-resources/rams" }}
        />

        {/* MAIN BODY ARTICLE */}
        <article className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-12">
            {/* 1. Core Principles of COSHH */}
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">01 // STATUTORY OBLIGATION</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Understanding the 8 Core Principles of COSHH
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  Under the <strong>Control of Substances Hazardous to Health Regulations 2002</strong>, contractors must systematically assess and control exposure to all hazardous materials. The Health and Safety Executive (HSE) outlines an 8-step approach:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {[
                    { n: "01", t: "Assess the Risks", d: "Identify all substances used or generated (e.g. welding fumes, silica dust, refrigerants)." },
                    { n: "02", t: "Decide What Precautions Are Needed", d: "Can the chemical be eliminated or substituted for a safer alternative?" },
                    { n: "03", t: "Prevent or Adequately Control Exposure", d: "Prioritise Local Exhaust Ventilation (LEV), closed transfer systems, and dilution." },
                    { n: "04", t: "Ensure Control Measures Are Maintained", d: "Verify LEV testing (every 14 months under Regulation 9), check seals and containers." },
                    { n: "05", t: "Monitor Exposure", d: "Measure airborne concentrations where WELs exist in EH40 or where required." },
                    { n: "06", t: "Carry Out Health Surveillance", d: "Mandatory for operatives exposed to isocyanates, respiratory sensitisers, or skin irritants." },
                    { n: "07", t: "Prepare Emergency & Spill Procedures", d: "Eyewash stations, chemical spill kits, neutralising agents, and evacuation routes." },
                    { n: "08", t: "Inform, Instruct & Train Operatives", d: "Ensure technicians understand GHS hazard pictograms, SDS sheets, and PPE donning/doffing." },
                  ].map((p) => (
                    <div key={p.n} className="p-4 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#EA580C]">{p.n}</span>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{p.t}</h4>
                      </div>
                      <p className="text-[11.5px] text-slate-600 font-light leading-relaxed">{p.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Exposure Routes & Health Hazards */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">02 // EXPOSURE MECHANISMS</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                The Four Primary Routes of Chemical Exposure
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                    <Wind className="w-4 h-4 text-blue-600" />
                    <span>1. Inhalation (Breathing)</span>
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Most common industrial route. Fumes, mists, dusts, and gases enter the lungs and bloodstream (e.g. solvent vapours, welding fumes, refrigerant asphyxiation).
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>2. Skin Contact / Absorption</span>
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Direct contact leading to occupational dermatitis, chemical burns, or systemic poisoning absorbed through broken skin (e.g. coil acid cleaners, epoxy resins).
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                    <Eye className="w-4 h-4 text-rose-600" />
                    <span>3. Eye Contact / Splashing</span>
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Splashes or airborne corrosive aerosols causing permanent corneal damage or blindness. Requires EN 166 chemical splash goggles and nearby eyewash.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                    <AlertTriangle className="w-4 h-4 text-purple-600" />
                    <span>4. Ingestion (Swallowing)</span>
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Chemical transfer from contaminated hands during eating, drinking, or smoking on site. Strict site hygiene and hand-washing mandatory.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>

        {/* COMMERCIAL CONVERSION COMPONENT */}
        <div className="container-wide">
          <ContractorPortalCtaCard
            headline="Store your COSHH sheets &amp; safety policies digitally."
            description="EntireFM's Contractor Platform gives UK trade contractors a centralised Document Vault to store chemical safety data sheets, COSHH assessments, and trade accreditations with automated 90/60/30-day renewal alerts."
            bulletPoints={[
              "Centralised digital Document Vault for SDS and COSHH assessments",
              "Attach chemical safety sheets directly to digital work orders & RAMS",
              "Automatic verification against EntireFM's commercial supplier standards",
              "All-inclusive contractor membership (£295/yr) with fair work dispatch eligibility",
            ]}
            primaryBtnText="Explore Document Vault in Portal"
            primaryBtnHref="/suppliers/membership#platform-overview"
            secondaryBtnText="View Membership"
            secondaryBtnHref="/suppliers/membership"
          />
        </div>

        {/* FAQS */}
        <ContractorFaqAccordion
          title="COSHH Assessment FAQs for Contractors"
          subtitle="Key guidance on Safety Data Sheets, exposure limits, and FM supply chain compliance."
          faqs={COSHH_FAQS}
        />

        {/* RELATED RESOURCES */}
        <ContractorRelatedGrid
          heading="Related Chemical &amp; Safety Resources"
          subheading="Explore companion tools for RAMS, risk assessments, and contractor compliance."
          currentPath="/contractor-resources/coshh-assessment"
        />
      </main>

      <Footer />
    </div>
  );
}
