import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContractorResourceHero } from "@/components/contractor-resources/ContractorResourceHero";
import { ContractorPortalCtaCard } from "@/components/contractor-resources/ContractorPortalCtaCard";
import { ContractorTemplateViewer, TemplateSection } from "@/components/contractor-resources/ContractorTemplateViewer";
import { ContractorFaqAccordion } from "@/components/contractor-resources/ContractorFaqAccordion";
import { ContractorRelatedGrid } from "@/components/contractor-resources/ContractorRelatedGrid";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";
import { ShieldCheck, FileText, CheckCircle2, Download } from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/risk-assessment-template", {
  title: "Free Contractor Risk Assessment Template UK | EntireFM",
  description:
    "Downloadable commercial contractor risk assessment template. 5x5 risk rating matrix, hazard categories, hierarchy of controls, and sign-off registers.",
});

const RA_TEMPLATE_SECTIONS: TemplateSection[] = [
  {
    number: "01",
    title: "Assessment Overview & Administrative Boundary",
    purpose: "Identifies the company, site, lead assessor, and scope under assessment.",
    fields: [
      { label: "Company Trading Name", description: "Contractor legal name and Companies House registration number." },
      { label: "Site & Location Covered", description: "Precise building, floor, plantroom or roof area under evaluation." },
      { label: "Task / Process Being Assessed", description: "Clear definition of the maintenance, engineering or cleaning activity." },
      { label: "Lead Assessor Name & Competency", description: "Name of competent person (NEBOSH/IOSH/Trade Qualified Supervisor)." },
      { label: "Assessment Date & Review Schedule", description: "Creation date and mandatory annual or task-specific review date." },
    ],
  },
  {
    number: "02",
    title: "Persons at Risk Analysis",
    purpose: "Identifies all groups who could be affected by the work.",
    fields: [
      { label: "Direct Operatives / Engineers", description: "Contractor technicians and sub-tier specialists carrying out the physical work." },
      { label: "Client Occupants & Building Staff", description: "Office workers, tenants, facilities teams, receptionists, security." },
      { label: "Members of the Public & Visitors", description: "Pedestrians, shoppers, patients, students, or adjacent property owners." },
      { label: "Vulnerable Individuals", description: "Young workers, expectant mothers, lone workers, persons with mobility impairments." },
    ],
  },
  {
    number: "03",
    title: "Hazard Identification & Evaluation Matrix",
    purpose: "Records specific hazards and calculates initial risk scores before control implementation.",
    fields: [
      { label: "Working at Height (Falls / Dropped Objects)", description: "Roof plant, stepladders, MEWPs, podiums. Initial rating (e.g. S4 x L3 = 12 Medium)." },
      { label: "Electricity (Shock / Burn / Arc Flash)", description: "Live testing, switchgear inspection, cable tracing. Initial rating (e.g. S5 x L3 = 15 High)." },
      { label: "Hazardous Substances / Fumes (COSHH)", description: "Refrigerant release, solvent fumes, drain cleaning acid. Initial rating (e.g. S4 x L3 = 12 Medium)." },
      { label: "Manual Handling / Heavy Plant Movement", description: "Compressor lifting, fan motor replacements. Initial rating (e.g. S3 x L3 = 9 Medium)." },
      { label: "Slips, Trips & Falls / Trailing Leads", description: "Wet floors during cleaning, temporary power cords. Initial rating (e.g. S2 x L4 = 8 Medium)." },
    ],
  },
  {
    number: "04",
    title: "Required Control Measures (Hierarchy Applied)",
    purpose: "Specifies engineering, administrative, and physical control measures to minimise risks.",
    fields: [
      { label: "Elimination / Substitution", description: "De-energise systems where possible; use non-toxic or water-based chemical alternatives." },
      { label: "Engineering Controls & Isolations", description: "Physical barriers, safety interlocks, Lock-Out Tag-Out (LOTO) locks, local exhaust ventilation (LEV)." },
      { label: "Administrative Controls & Permits", description: "Hot work permits, height access permits, site induction sign-in, toolbox talks, two-man working." },
      { label: "Personal Protective Equipment (PPE)", description: "Safety footwear (EN 20345), eye protection (EN 166), high-vis vest (EN 20471), trade gloves." },
    ],
  },
  {
    number: "05",
    title: "Residual Risk Rating & Approval",
    purpose: "Verifies that after all controls are implemented, the remaining risk is Low / Acceptable.",
    fields: [
      { label: "Residual Severity (1-5)", description: "Estimated consequence severity with all controls strictly in place." },
      { label: "Residual Likelihood (1-5)", description: "Estimated probability of occurrence with all controls strictly in place." },
      { label: "Residual Risk Score (SxL)", description: "Target residual score must be Low (1-6) before work is authorised to commence." },
      { label: "Competent Person Sign-Off", description: "Signature and confirmation from the qualified health & safety lead." },
    ],
  },
];

const RA_TEMPLATE_FAQS = [
  {
    question: "How do I format the 5x5 rating score in this template?",
    answer:
      "Multiply Severity (1: Minor scratch to 5: Fatality) by Likelihood (1: Very unlikely to 5: Almost certain). Any initial score above 12 must show clear engineering controls that bring the residual score down below 6.",
  },
  {
    question: "Can I use this template for trade accreditations (SafeContractor, CHAS, Constructionline)?",
    answer:
      "Yes. SSIP member schemes look for clear hazard identification, quantitative risk scoring, adherence to the hierarchy of controls, and operative sign-off registers — all of which are built into this template.",
  },
];

export default function RiskAssessmentTemplatePage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "Risk Assessment Template", url: "/contractor-resources/risk-assessment-template" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO */}
        <ContractorResourceHero
          eyebrow="FREE DOWNLOADABLE CONTRACTOR RESOURCE"
          title="Contractor Risk Assessment Template"
          subtitle="UK Commercial Facilities Management Standard"
          intro="Download our structured commercial risk assessment template. Features 5x5 severity/likelihood scoring, hazard registers covering 10 major trades, and statutory hierarchy of controls."
          breadcrumbs={breadcrumbs}
          readTime="Template Resource"
          lastUpdated="2026"
          keyTakeaway="Audit-ready template structure for quantifying risk, documenting site controls, establishing residual scores, and securing client work permits."
          primaryCta={{ label: "Explore RAMS & RA Builder in Portal", href: "/suppliers/membership#platform-overview" }}
          secondaryCta={{ label: "Read Risk Assessment Guide", href: "/contractor-resources/risk-assessment" }}
        />

        {/* TEMPLATE VIEWER */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-5xl space-y-8">
            <div className="space-y-3">
              <span className="eyebrow eyebrow-light">TEMPLATE STRUCTURE</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Review &amp; Copy the Risk Assessment Structure
              </h2>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Click <strong>Download (.TXT)</strong> or <strong>Copy Text</strong> to use this framework across your contracting business.
              </p>
            </div>

            <ContractorTemplateViewer
              templateName="EntireFM Commercial Risk Assessment Template"
              description="Standard Risk Assessment template for commercial building engineering, trade contractors, and facilities maintenance."
              version="2026.1 UK Standard"
              sections={RA_TEMPLATE_SECTIONS}
            />
          </div>
        </section>

        {/* COMMERCIAL CONVERSION COMPONENT */}
        <div className="container-wide">
          <ContractorPortalCtaCard
            headline="Manage risk assessments, RAMS &amp; jobs in one place."
            description="The EntireFM Contractor Platform gives UK trade contractors an integrated operating platform to build digital risk assessments, store insurance certificates, and manage commercial work orders."
            bulletPoints={[
              "Integrated risk matrix scoring with pre-populated trade hazard databases",
              "Automated document vault with 90/60/30-day insurance & qualification tracking",
              "Direct work dispatch & purchase orders across EntireFM's client network",
              "Contractor membership £295+VAT/year with fair, merit-based work allocation",
            ]}
            primaryBtnText="Explore the Contractor Portal"
            primaryBtnHref="/suppliers/membership#platform-overview"
            secondaryBtnText="Join Contractor Network"
            secondaryBtnHref="/suppliers/membership"
          />
        </div>

        {/* FAQS */}
        <ContractorFaqAccordion
          title="Risk Assessment Template FAQs"
          subtitle="Guidance on tailoring templates, quantitative scoring, and SSIP accreditation audits."
          faqs={RA_TEMPLATE_FAQS}
        />

        {/* RELATED RESOURCES */}
        <ContractorRelatedGrid
          heading="Related Risk &amp; Method Resources"
          subheading="Explore companion tools for method statements, COSHH, and contractor compliance."
          currentPath="/contractor-resources/risk-assessment-template"
        />
      </main>

      <Footer />
    </div>
  );
}
