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
import { Download, FileText, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/rams-template", {
  title: "Free RAMS Template UK: Risk Assessment & Method Statement | EntireFM",
  description:
    "Free, professional 11-section RAMS template for UK contractors. Structured for commercial facilities management, M&E, and building services work.",
});

const RAMS_SECTIONS: TemplateSection[] = [
  {
    number: "01",
    title: "Project, Client & Site Information",
    purpose: "Establishes the administrative boundary, location, and key points of contact for the task.",
    fields: [
      { label: "Principal Client / FM Provider", description: "Name of client or managing FM company (e.g. EntireFM Facilities Management)." },
      { label: "Site Address & Specific Location", description: "Exact physical building, floor, room, or plant area (e.g. 100 St Peter's Square, 4th Floor Plant Deck)." },
      { label: "Contractor Company Details", description: "Trading name, company registration number, address, and lead contact number." },
      { label: "Dates & Operating Hours", description: "Scheduled start date, completion date, and permitted working hours." },
      { label: "Document Reference & Version", description: "Unique tracking code (e.g. RAMS-2026-HVAC-014) and revision number." },
    ],
  },
  {
    number: "02",
    title: "Scope of Works & Technical Summary",
    purpose: "Defines precisely what work is authorised and prevents dangerous scope creep.",
    fields: [
      { label: "Detailed Task Description", description: "Clear summary of all scheduled maintenance, repairs, or installations to be carried out." },
      { label: "Exclusions & Work Out of Scope", description: "Explicit statements of what is NOT covered by this document (e.g. high-voltage switching)." },
      { label: "Permits to Work Required", description: "Identification of required permits: Hot Works, Working at Height, Confined Space, Electrical Isolation." },
    ],
  },
  {
    number: "03",
    title: "Supervision, Competency & Operatives",
    purpose: "Verifies that all personnel attending site possess certified competence.",
    fields: [
      { label: "Named Site Supervisor", description: "Lead technical contact responsible for overseeing the work on-site." },
      { label: "Operative Roster & Trade Certs", description: "Names of all engineers with relevant card/cert numbers (Gas Safe, CSCS, JIB, F-Gas, IPAF)." },
      { label: "Appointed First Aiders", description: "Designated first aid trained person and location of site first aid kit." },
    ],
  },
  {
    number: "04",
    title: "Hazard Identification & 5x5 Risk Matrix",
    purpose: "Quantifies initial risk versus residual risk following control implementation.",
    fields: [
      { label: "Identified Hazards", description: "All foreseeable hazards: live electrical, falls from height, slip/trip, manual handling, noise." },
      { label: "Persons at Risk", description: "Engineers, client staff, visitors, members of the public, other contractors." },
      { label: "Initial Risk Rating (IxL)", description: "Numerical score (Severity 1-5 x Likelihood 1-5) before any controls are applied." },
    ],
  },
  {
    number: "05",
    title: "Specific Control Measures",
    purpose: "Documents the hierarchy of controls (Elimination, Substitution, Engineering, Administrative, PPE).",
    fields: [
      { label: "Physical & Engineering Controls", description: "Edge protection, scaffold towers, barriers, Lock-Out Tag-Out isolations, LEV extraction." },
      { label: "Administrative Controls", description: "Site inductions, signage, toolbox talks, two-man working protocols, permit verification." },
      { label: "Residual Risk Rating", description: "Target acceptable score (typically < 6 on a 25-point matrix) after controls are verified." },
    ],
  },
  {
    number: "06",
    title: "Personal Protective Equipment (PPE)",
    purpose: "Specifies mandatory and task-specific safety gear.",
    fields: [
      { label: "Standard Site PPE", description: "Safety footwear (EN ISO 20345), high-visibility vest (EN ISO 20471), hard hat (EN 397)." },
      { label: "Task-Specific PPE", description: "Safety eyewear (EN 166), dielectric gloves (EN 60903), FFP3 respirators, full body harness." },
    ],
  },
  {
    number: "07",
    title: "Plant, Tools & Access Equipment",
    purpose: "Ensures all machinery and access equipment complies with statutory testing standards.",
    fields: [
      { label: "Access Equipment (PUWER/LOLER)", description: "Stepladders, podiums, mobile scaffold towers (PASMA), scissor lifts (IPAF) with inspection dates." },
      { label: "Hand & Power Tools", description: "110V or battery-powered tools with valid Portable Appliance Test (PAT) stickers." },
      { label: "Calibration & Specialist Test Meters", description: "Multimeters, pressure gauges, refrigerant recovery units with calibration records." },
    ],
  },
  {
    number: "08",
    title: "Step-by-Step Safe Method Sequence",
    purpose: "Chronological narrative explaining exactly how work proceeds from arrival to completion.",
    fields: [
      { label: "Step 1: Arrival & Site Induction", description: "Report to building management, sign in, verify emergency routes, obtain permits." },
      { label: "Step 2: Work Area Isolation & Signage", description: "Erect barriers, post warning signs, isolate services (LOTO), prove dead." },
      { label: "Step 3: Execution of Works", description: "Perform task strictly in accordance with manufacturer instructions and safety controls." },
      { label: "Step 4: Testing & Re-commissioning", description: "Verify safety devices, test system, remove isolations under controlled conditions." },
      { label: "Step 5: Site Clean-Down & Handover", description: "Remove tools, sweep area, sign off permits, provide photographic completion evidence." },
    ],
  },
  {
    number: "09",
    title: "Emergency Arrangements & First Aid",
    purpose: "Ensures immediate, effective response in the event of an accident or building alarm.",
    fields: [
      { label: "Fire & Evacuation Route", description: "Nearest fire exit, alarm call point, designated assembly muster point." },
      { label: "Nearest A&E Hospital Details", description: "Hospital name, address, telephone number, and estimated travel time." },
      { label: "Spill Response & Rescue Procedures", description: "Chemical spill kit location, emergency ladder/harness rescue plan." },
    ],
  },
  {
    number: "10",
    title: "Environmental, Waste & COSHH Controls",
    purpose: "Ensures environmental compliance and hazardous substance containment.",
    fields: [
      { label: "Hazardous Substances (COSHH)", description: "Refrigerants, oils, solvents, cleaning chemicals attached with Safety Data Sheets." },
      { label: "Waste Disposal Protocol", description: "Licensed waste carrier details, duty of care waste transfer notes, scrap metal disposal." },
    ],
  },
  {
    number: "11",
    title: "Operative Briefing & Sign-Off Register",
    purpose: "Legally binding acknowledgement that operatives understand the method and risks.",
    fields: [
      { label: "Briefing Confirmation", description: "Statement that all operatives have read, understood, and agreed to comply with this RAMS." },
      { label: "Sign-Off Grid", description: "Operative Print Name | Signature | Trade/CSCS Number | Date | Time." },
    ],
  },
];

const TEMPLATE_FAQS = [
  {
    question: "Can I use this template for commercial FM tenders and client approvals?",
    answer:
      "Yes. This 11-section framework covers the exact statutory categories evaluated by commercial FM review desks, Principal Contractors, and corporate building managers across the UK.",
  },
  {
    question: "How should I adapt this template for different trades?",
    answer:
      "Customise Sections 04 (Hazards), 05 (Controls), 07 (Plant/Equipment) and 08 (Method Sequence) for your specific trade discipline — for instance, adding LOTO and arc flash protocols for electrical work, or F-Gas cylinder handling and pressure testing for HVAC work.",
  },
  {
    question: "Is it better to create Word RAMS or use the EntireFM Contractor Portal?",
    answer:
      "While Word documents are common, they quickly become scattered, out-of-date, and difficult to cross-reference with operative qualifications and insurance expiries. The EntireFM Contractor Portal allows members to build RAMS directly inside their workspace, automatically linking valid insurance, trade cards, and work orders in one connected platform.",
  },
];

export default function RamsTemplatePage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "RAMS Template", url: "/contractor-resources/rams-template" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO */}
        <ContractorResourceHero
          eyebrow="FREE DOWNLOADABLE CONTRACTOR RESOURCE"
          title="RAMS Template: Risk Assessment &amp; Method Statement"
          subtitle="UK 11-Section Commercial FM Standard"
          intro="Download our professionally structured 11-section RAMS template designed for UK trade contractors, building services engineers, and commercial facilities maintenance specialists."
          breadcrumbs={breadcrumbs}
          readTime="Template Resource"
          lastUpdated="2026"
          keyTakeaway="An audit-ready RAMS template covering project details, risk evaluation, control measures, step-by-step method statements, PUWER/LOLER plant verification, and operative sign-off registers."
          primaryCta={{ label: "Explore RAMS Builder in Portal", href: "/suppliers/membership#platform-overview" }}
          secondaryCta={{ label: "Read RAMS Guide", href: "/contractor-resources/rams" }}
        />

        {/* TEMPLATE VIEWER */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-5xl space-y-8">
            <div className="space-y-3">
              <span className="eyebrow eyebrow-light">TEMPLATE STRUCTURE</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Review &amp; Copy the RAMS Framework
              </h2>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Review each section below or click <strong>Download (.TXT)</strong> / <strong>Copy Text</strong> to use this structure in your own documentation workflow.
              </p>
            </div>

            <ContractorTemplateViewer
              templateName="EntireFM Commercial Contractor RAMS Template"
              description="Standard Risk Assessment & Method Statement structure for commercial building maintenance, engineering, and specialist subcontractor delivery."
              version="2026.1 UK Commercial Standard"
              sections={RAMS_SECTIONS}
            />
          </div>
        </section>

        {/* COMMERCIAL CONVERSION COMPONENT */}
        <div className="container-wide">
          <ContractorPortalCtaCard
            headline="Need more than a Word document?"
            description="Keep your contractor documentation, compliance information, operative competency records, and live job work orders connected in one place with the EntireFM Contractor Platform (£295/yr)."
            bulletPoints={[
              "Cloud RAMS builder with pre-configured risk controls and method steps",
              "Automated expiry tracking across public liability, Gas Safe, NICEIC and Refcom",
              "Operative skills matrix ensuring only certified engineers are assigned to jobs",
              "Direct work dispatch, purchase order tracking, and timestamped evidence records",
            ]}
            primaryBtnText="Explore Contractor Portal"
            primaryBtnHref="/suppliers/membership#platform-overview"
            secondaryBtnText="View Membership Details"
            secondaryBtnHref="/suppliers/membership"
          />
        </div>

        {/* FAQS */}
        <ContractorFaqAccordion
          title="RAMS Template Usage FAQs"
          subtitle="Key guidance on adapting this template, client reviews, and managing digital contractor documentation."
          faqs={TEMPLATE_FAQS}
        />

        {/* RELATED RESOURCES */}
        <ContractorRelatedGrid
          heading="Related Safety &amp; Method Templates"
          subheading="Explore companion resources for risk assessments, method statements, and contractor compliance."
          currentPath="/contractor-resources/rams-template"
        />
      </main>

      <Footer />
    </div>
  );
}
