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
import { FileText, Download, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/method-statement-template", {
  title: "Free Method Statement Template UK | Safe System of Work | EntireFM",
  description:
    "Free downloadable Method Statement (Safe System of Work) template for UK trade contractors, building services engineers, and FM subcontractors.",
});

const MS_TEMPLATE_SECTIONS: TemplateSection[] = [
  {
    number: "01",
    title: "Project Scope & Site Administration",
    purpose: "Establishes the location, client, principal contractor, and exact scope of works.",
    fields: [
      { label: "Client & FM Managing Agent", description: "Name of managing FM company (e.g. EntireFM Facilities Management)." },
      { label: "Site Address & Work Location", description: "Exact physical area (e.g. 50 King Street, Manchester, Basement Plantroom B)." },
      { label: "Contractor Details", description: "Company trading name, address, telephone, and lead contact person." },
      { label: "Permitted Working Hours", description: "Standard site hours or out-of-hours permissions (e.g. 08:00 - 17:00 Monday to Friday)." },
    ],
  },
  {
    number: "02",
    title: "Named Supervision & Operative Competency",
    purpose: "Documents the technical supervision and certified qualifications of personnel on site.",
    fields: [
      { label: "Site Supervisor", description: "Name, mobile number, and SSSTS/SMSTS or technical trade qualification." },
      { label: "Assigned Operatives & Trade Cards", description: "Names of attending engineers with CSCS/JIB/Gas Safe/F-Gas card numbers." },
      { label: "Designated First Aider", description: "Name of operative holding current First Aid at Work (FAW) certification." },
    ],
  },
  {
    number: "03",
    title: "Site Access, Egress & Deliveries",
    purpose: "Defines logistical movement, parking, loading bay procedures, and public protection.",
    fields: [
      { label: "Access & Signing In Protocol", description: "Building reception sign-in, security pass issue, and site induction completion." },
      { label: "Plant / Material Delivery Routes", description: "Designated loading bays, goods lifts, floor protection, and vehicle marshals." },
      { label: "Pedestrian & Occupant Protection", description: "Physical barriers, warning signage, dust screens, and cordoned work zones." },
    ],
  },
  {
    number: "04",
    title: "Plant, Tools & Equipment (PUWER/LOLER)",
    purpose: "Ensures all tools and access machinery have valid statutory inspection certificates.",
    fields: [
      { label: "Access Equipment", description: "Stepladders (EN131 Professional), podiums, mobile scaffold towers (PASMA), scissor lifts (IPAF)." },
      { label: "Power Tools & Electrical Plant", description: "110V step-down transformers or battery tools with valid PAT test stickers." },
      { label: "Specialist Test Meters", description: "Calibrated multimeters, flue gas analysers, refrigeration manifolds, insulation testers." },
    ],
  },
  {
    number: "05",
    title: "Step-by-Step Chronological Sequence of Works",
    purpose: "The core narrative detailing the exact procedural order from arrival to commissioning.",
    fields: [
      { label: "Phase 1: Arrival, Briefing & Permits", description: "Review RAMS with team, sign permits (Hot Works/Isolation/Height), inspect work area." },
      { label: "Phase 2: Isolation & Proving Dead", description: "Implement Lock-Out Tag-Out (LOTO), isolate valves, test with calibrated voltage indicator." },
      { label: "Phase 3: Execution of Works", description: "Perform replacement/servicing strictly per manufacturer technical manuals and safety controls." },
      { label: "Phase 4: Inspection, Testing & Commissioning", description: "Pressure test, electrical test, re-energise system under supervision, verify correct operation." },
      { label: "Phase 5: Site Handover & Housekeeping", description: "Clean work area, remove scrap, sign off permits, record before/after photo evidence." },
    ],
  },
  {
    number: "06",
    title: "Emergency, Fire & First Aid Protocols",
    purpose: "Ensures immediate, effective response to accidents or alarms.",
    fields: [
      { label: "Fire Alarms & Evacuation Route", description: "Location of break-glass call points, fire exits, and external assembly muster points." },
      { label: "First Aid Kit & Nearest A&E Hospital", description: "Location of vehicle first aid kit, nearest emergency hospital address and phone number." },
      { label: "Spill Response & Rescue Procedures", description: "Location of chemical spill kits, height rescue equipment and trained rescue personnel." },
    ],
  },
  {
    number: "07",
    title: "Operative Sign-Off Register",
    purpose: "Confirms all site operatives have received the briefing and agreed to follow the method.",
    fields: [
      { label: "Briefing Declaration", description: "Confirmation that engineers have read, understood, and will comply with this safe method." },
      { label: "Sign-Off Grid", description: "Print Name | Signature | Trade Registration # | Date | Time." },
    ],
  },
];

const MS_TEMPLATE_FAQS = [
  {
    question: "Can I use this template for commercial facilities management jobs?",
    answer:
      "Yes. This structure meets the operational standards required by UK Principal Contractors, corporate property managers, and EntireFM compliance desks.",
  },
  {
    question: "How detailed should the step-by-step sequence be?",
    answer:
      "The sequence should be specific enough that a competent tradesperson can follow the exact chronological order of work safely, especially regarding electrical/mechanical isolations, permits to work, testing, and clean-down.",
  },
];

export default function MethodStatementTemplatePage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "Method Statement Template", url: "/contractor-resources/method-statement-template" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO */}
        <ContractorResourceHero
          eyebrow="FREE DOWNLOADABLE CONTRACTOR RESOURCE"
          title="Method Statement Template (SSoW)"
          subtitle="UK Commercial Facilities Management Standard"
          intro="Download our structured Safe System of Work (Method Statement) template designed for UK trade contractors, M&E engineers, and facilities maintenance specialists."
          breadcrumbs={breadcrumbs}
          readTime="Template Resource"
          lastUpdated="2026"
          keyTakeaway="An audit-ready method statement structure detailing supervision, logistics, plant checks, step-by-step execution sequences, emergency protocols, and operative sign-offs."
          primaryCta={{ label: "Explore RAMS Builder in Portal", href: "/suppliers/membership#platform-overview" }}
          secondaryCta={{ label: "Read Method Statement Guide", href: "/contractor-resources/method-statement" }}
        />

        {/* TEMPLATE VIEWER */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-5xl space-y-8">
            <div className="space-y-3">
              <span className="eyebrow eyebrow-light">TEMPLATE STRUCTURE</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Review &amp; Copy the Method Statement Structure
              </h2>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Click <strong>Download (.TXT)</strong> or <strong>Copy Text</strong> to use this structure across your business.
              </p>
            </div>

            <ContractorTemplateViewer
              templateName="EntireFM Safe System of Work (Method Statement) Template"
              description="Standard Method Statement template for commercial building engineering, trade contractors, and facilities maintenance."
              version="2026.1 UK Commercial Standard"
              sections={MS_TEMPLATE_SECTIONS}
            />
          </div>
        </section>

        {/* COMMERCIAL CONVERSION COMPONENT */}
        <div className="container-wide">
          <ContractorPortalCtaCard
            headline="Connect your safe systems of work to your digital job queue."
            description="The EntireFM Contractor Platform gives UK trade contractors an integrated operating platform to build digital method statements, store insurance certificates, and manage commercial work orders."
            bulletPoints={[
              "Integrated method statement builder with trade-specific task libraries",
              "Centralised document vault with automated 90/60/30-day credential alerts",
              "Direct work dispatch, purchase order tracking, and timestamped photo evidence",
              "Supplier membership £95+VAT/year with fair, merit-based work allocation",
            ]}
            primaryBtnText="Explore Contractor Portal"
            primaryBtnHref="/suppliers/membership#platform-overview"
            secondaryBtnText="Join EntireFM Network"
            secondaryBtnHref="/suppliers/membership"
          />
        </div>

        {/* FAQS */}
        <ContractorFaqAccordion
          title="Method Statement Template FAQs"
          subtitle="Key guidance on tailoring method statements for specific commercial sites and tasks."
          faqs={MS_TEMPLATE_FAQS}
        />

        {/* RELATED RESOURCES */}
        <ContractorRelatedGrid
          heading="Related Safe System &amp; Method Resources"
          subheading="Explore companion tools for risk assessments, COSHH, and contractor compliance."
          currentPath="/contractor-resources/method-statement-template"
        />
      </main>

      <Footer />
    </div>
  );
}
