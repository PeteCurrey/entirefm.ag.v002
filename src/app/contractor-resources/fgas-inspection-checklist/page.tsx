import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContractorResourceHero } from "@/components/contractor-resources/ContractorResourceHero";
import { ContractorTemplateViewer } from "@/components/contractor-resources/ContractorTemplateViewer";
import { ContractorPortalCtaCard } from "@/components/contractor-resources/ContractorPortalCtaCard";
import { ContractorFaqAccordion } from "@/components/contractor-resources/ContractorFaqAccordion";
import { ContractorRelatedGrid } from "@/components/contractor-resources/ContractorRelatedGrid";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/fgas-inspection-checklist", {
  title: "F-Gas Statutory Inspection & Leak Test Checklist | HVAC Tool | EntireFM",
  description:
    "Standard statutory F-Gas leak testing checklist and refrigerant logbook framework under UK F-Gas Regulations. CO2 equivalent calculations, leak checks, and recovery tracking.",
});

const FGAS_SECTIONS = [
  {
    "number": "01",
    "title": "System & Asset Charge Calculation",
    "purpose": "Establish refrigerant charge in kilograms and calculate tonnes CO2 equivalent to determine statutory test frequency.",
    "fields": [
      {
        "label": "Asset Identifier & Location",
        "description": "Equipment tag, outdoor condenser reference, and building zone.",
        "example": "CU-ROOF-01 / AHU-02 (Plant Deck)"
      },
      {
        "label": "Refrigerant Type & Mass",
        "description": "Gas type (R410A, R32, R134a, R407C) and factory charge in kg.",
        "example": "R410A (8.4 kg)"
      },
      {
        "label": "Tonnes CO2 Equivalent",
        "description": "Calculated via: (Mass kg x GWP) / 1000.",
        "example": "8.4 kg x 2088 / 1000 = 17.54 tonnes CO2e (Annual leak test required)"
      },
      {
        "label": "Automatic Leak Detection",
        "description": "Verify presence and operational status of fixed sensor systems."
      }
    ]
  },
  {
    "number": "02",
    "title": "Engineer Competency & Calibrated Instruments",
    "purpose": "Verify F-Gas Category 1 qualification, Refcom accreditation, and leak detector sensitivity.",
    "fields": [
      {
        "label": "F-Gas Cat 1 Certification",
        "description": "Engineer C&G 2079 / BESA certificate number and expiry.",
        "example": "City & Guilds 2079 Cat 1 (No: FG-89210)"
      },
      {
        "label": "Refcom Elite Registration",
        "description": "Company F-Gas registration number in good standing.",
        "example": "REF1004821"
      },
      {
        "label": "Electronic Leak Detector",
        "description": "Instrument sensitivity verified to detect leaks <= 5g/year.",
        "example": "Testo 316-3 (Calibrated: 11 Nov 2026)"
      },
      {
        "label": "Refrigerant Scales",
        "description": "Digital weighing scales calibration verification certificate.",
        "example": "Fieldpiece SRS3 (Calibrated: 08 Aug 2026)"
      }
    ]
  },
  {
    "number": "03",
    "title": "Comprehensive Leak Inspection Protocol",
    "purpose": "Execute physical, electronic, and bubble-spray leak testing across all potential leak pathways.",
    "fields": [
      {
        "label": "Flare & Mechanical Joints",
        "description": "Electronic sniffing probe test on indoor and outdoor flare connections."
      },
      {
        "label": "Service Ports & Schrader Cores",
        "description": "Bubble test solution on gauge ports and valve caps; verify metal sealing caps fitted."
      },
      {
        "label": "Oil Residue Visual Check",
        "description": "Inspect pipework bends, brazed joints, compressor body, and sight glasses for refrigerant oil staining."
      },
      {
        "label": "Heat Exchanger Coils",
        "description": "Probe coil faces, U-bends, and header manifolds for pinhole micro-leaks."
      }
    ]
  },
  {
    "number": "04",
    "title": "Refrigerant Logbook & 30-Day Re-Test Tracking",
    "purpose": "Record any added or recovered refrigerant mass and schedule mandatory follow-up testing.",
    "fields": [
      {
        "label": "Refrigerant Added (kg)",
        "description": "Quantity added and virgin cylinder batch number logged in portal."
      },
      {
        "label": "Refrigerant Recovered (kg)",
        "description": "Quantity recovered into dedicated reclamation cylinder with waste consignment note."
      },
      {
        "label": "Leak Location & Repair Action",
        "description": "Detailed description of defect (e.g. cracked flare nut) and remedial method."
      },
      {
        "label": "Mandatory 30-Day Re-Test",
        "description": "Schedule mandatory statutory re-test within 30 days to verify repair integrity under UK law."
      }
    ]
  }
];

const FGAS_FAQS = [
  {
    question: "When is an F-Gas logbook legally required in the UK?",
    answer: "Under UK F-Gas Regulations, building operators must maintain logbooks for stationary refrigeration and air conditioning systems containing 5 tonnes CO2 equivalent or more of fluorinated greenhouse gases.",
  },
  {
    question: "How is CO2 equivalent calculated for R410A systems?",
    answer: "Multiply the refrigerant mass in kilograms by the Global Warming Potential (GWP of R410A is 2088) and divide by 1,000. For example, a 2.4 kg R410A system = 2.4 x 2088 / 1000 = 5.01 tonnes CO2e, triggering statutory 12-month leak inspections.",
  },
  {
    question: "What happens if a leak is identified during testing?",
    answer: "The leak must be repaired without undue delay. Under UK law, the repaired system must be re-tested for leaks within 30 calendar days of the repair to confirm sealing integrity.",
  },
];

export default function FgasChecklistPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "Checklists", url: "/contractor-resources/inspection-checklists" },
    { name: "F-Gas Inspection Checklist", url: "/contractor-resources/fgas-inspection-checklist" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <ContractorResourceHero
          eyebrow="STATUTORY HVAC TOOLKIT"
          title="F-Gas Statutory Inspection &amp; Leak Test Checklist"
          subtitle="Mandatory leak inspection &amp; logbook compliance under UK F-Gas Regulations."
          intro="Commercial facilities managers require rigorous compliance with F-Gas record-keeping. This checklist structures leak test inspections, CO2e calculations, cylinder tracking, and 30-day follow-up audit requirements for HVAC and refrigeration contractors."
          readTime="6 min guide + copyable checklist"
          lastUpdated="September 2026"
          breadcrumbs={breadcrumbs}
          keyTakeaway="Maintaining verified F-Gas logs and adhering to CO2e testing intervals protects commercial building owners from statutory enforcement and heavy environmental fines."
        />

        <section className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-10">
            <div className="space-y-3">
              <span className="eyebrow eyebrow-light">CHECKLIST FRAMEWORK</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Interactive F-Gas Inspection &amp; Logbook Template
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Copy this structured checklist for on-site F-Gas logbook records or download the text template.
              </p>
            </div>

            <ContractorTemplateViewer
              templateName="F-Gas Statutory Inspection Checklist"
              description="Statutory leak test and logbook tracking framework for stationary commercial refrigeration and HVAC systems."
              sections={FGAS_SECTIONS}
            />
          </div>
        </section>

        <ContractorPortalCtaCard
          headline="Upload F-Gas logs directly to EntireFM work orders"
          description="Contractor Platform members store Refcom certificates, engineer Cat 1 cards, and digital leak logs inside the Contractor Portal Document Vault."
          primaryBtnText="Explore Contractor Membership (£295/yr)"
          primaryBtnHref="/suppliers/membership"
        />

        <ContractorFaqAccordion
          title="F-Gas Statutory Compliance Questions"
          faqs={FGAS_FAQS}
        />

        <ContractorRelatedGrid
          heading="Related HVAC Resources"
          currentPath="/contractor-resources/fgas-inspection-checklist"
        />
      </main>

      <Footer />
    </div>
  );
}
