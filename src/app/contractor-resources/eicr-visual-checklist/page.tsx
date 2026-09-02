import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContractorResourceHero } from "@/components/contractor-resources/ContractorResourceHero";
import { ContractorTemplateViewer } from "@/components/contractor-resources/ContractorTemplateViewer";
import { ContractorPortalCtaCard } from "@/components/contractor-resources/ContractorPortalCtaCard";
import { ContractorFaqAccordion } from "@/components/contractor-resources/ContractorFaqAccordion";
import { ContractorRelatedGrid } from "@/components/contractor-resources/ContractorRelatedGrid";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/eicr-visual-checklist", {
  title: "Commercial EICR Visual Inspection Checklist | BS 7671 Guide | EntireFM",
  description:
    "Standard commercial Electrical Installation Condition Report (EICR) visual inspection checklist. Covers three-phase switchboards, thermal imaging, RCD testing, and BS 7671 compliance.",
});

const EICR_SECTIONS = [
  {
    "number": "01",
    "title": "Inspection Header & Site Details",
    "purpose": "Establish building identity, distribution board reference, and engineer testing instrument details.",
    "fields": [
      {
        "label": "Site & Managing Agent",
        "description": "Commercial building address, client name, and switchroom room identifier.",
        "example": "Corporate Office Tower, Leeds LS1 (Switchroom B1)"
      },
      {
        "label": "Engineer Competency",
        "description": "Name of inspecting electrician, ECS Gold Card number, and NICEIC/NAPIT enrolment.",
        "example": "David Walker (ECS 489201)"
      },
      {
        "label": "Calibrated Test Instrument",
        "description": "Model and calibration certificate expiry date.",
        "example": "Fluke 1664FC (Calibrated: 14 Oct 2026)"
      }
    ]
  },
  {
    "number": "02",
    "title": "Switchgear Enclosure & Environmental Integrity",
    "purpose": "Verify external enclosure safety, IP ratings, blanking plates, and physical environment.",
    "fields": [
      {
        "label": "Enclosure IP Rating",
        "description": "IP4X/IPXXD top horizontal surface and IP2X/IPXXB elsewhere to prevent contact with live parts."
      },
      {
        "label": "Blanking Plates",
        "description": "Verify all unused MCB pole ways are securely blanked to prevent finger access to live busbars."
      },
      {
        "label": "Warning Notices & Schedules",
        "description": "400V Danger notices, periodic inspection dates, and circuit chart secured inside door."
      },
      {
        "label": "Switchroom Environment",
        "description": "Minimum 0.8m uninhibited working space, clear of combustible storage, dry, and well illuminated."
      }
    ]
  },
  {
    "number": "03",
    "title": "Earthing, Bonding & Supply Protection",
    "purpose": "Inspect main protective conductors, bonding to metallic services, and surge protection.",
    "fields": [
      {
        "label": "Main Earthing Conductor",
        "description": "Sized correctly per adiabatic equation (or Table 54.7), unbroken, with safety label attached."
      },
      {
        "label": "Equipotential Bonding",
        "description": "Bonding verified to incoming water, gas, and structural steelwork within 600mm of meter."
      },
      {
        "label": "Surge Protection Device (SPD)",
        "description": "Visual status indicator verified (Green / Healthy) under BS 7671 Section 443."
      },
      {
        "label": "Main Means of Isolation",
        "description": "Main switch mechanically sound, accessible, and correctly labelled."
      }
    ]
  },
  {
    "number": "04",
    "title": "Circuit Protective Devices & Conductor Condition",
    "purpose": "Examine circuit breakers, thermal distress signs, cable clamping, and harmonic colour coding.",
    "fields": [
      {
        "label": "Protective Device Rating",
        "description": "Verify MCB/RCBO ratings do not exceed conductor current carrying capacity (Iz >= In)."
      },
      {
        "label": "Thermal Distress Checks",
        "description": "No discolouration, melted PVC, or signs of overheating at line and neutral terminations."
      },
      {
        "label": "Harmonised Sleeving",
        "description": "Conductors identified with correct colours (Brown L1, Black L2, Grey L3, Blue N, G/Y Earth)."
      },
      {
        "label": "Cable Containment & Glands",
        "description": "Cables securely clamped with no mechanical abrasion across metal enclosure entries."
      }
    ]
  },
  {
    "number": "05",
    "title": "Defect Classification & Remedial Action Log",
    "purpose": "Categorise observations accurately using BS 7671 standard condition codes.",
    "fields": [
      {
        "label": "Code C1 (Danger Present)",
        "description": "Immediate risk of injury. Requires immediate verbal/written alert and isolation where authorized."
      },
      {
        "label": "Code C2 (Potentially Dangerous)",
        "description": "Urgent remedial action required (e.g. missing blank, ungrounded metallic enclosure)."
      },
      {
        "label": "Code C3 (Improvement Recommended)",
        "description": "Departure from modern standards not posing immediate danger (e.g. missing circuit label)."
      },
      {
        "label": "Code FI (Further Investigation)",
        "description": "Circuits unable to be fully traced or inspected during site visit."
      }
    ]
  }
];

const EICR_FAQS = [
  {
    question: "What is the commercial testing interval for EICR reports?",
    answer: "Under BS 7671 Guidance Note 3, commercial offices, retail premises, and industrial buildings typically require full periodic inspection and testing every 5 years, or on a 20% per year rolling sampling programme.",
  },
  {
    question: "What should an engineer do if a C1 defect is discovered?",
    answer: "A C1 (Danger Present) observation requires immediate verbal and written notification to the client and site facilities manager. If safe to do so with client authorisation, the dangerous circuit must be safely isolated immediately.",
  },
  {
    question: "How does EntireFM verify calibrated test instruments?",
    answer: "Contractors register their multi-function testers (e.g. Fluke 1664FC, Megger MFT1741) in the EntireFM Document Vault, which monitors annual calibration certificate expiry dates automatically.",
  },
];

export default function EicrChecklistPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "Checklists", url: "/contractor-resources/inspection-checklists" },
    { name: "EICR Visual Checklist", url: "/contractor-resources/eicr-visual-checklist" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <ContractorResourceHero
          eyebrow="COMMERCIAL ELECTRICAL TOOLKIT"
          title="Commercial EICR Visual Inspection Checklist"
          subtitle="Statutory 5-year periodic inspection checklist under BS 7671:2018+A2:2022."
          intro="Before connecting calibrated test meters, a structured visual inspection uncovers up to 70% of electrical safety defects. This checklist provides commercial electrical contractors with an audit-ready verification framework covering switchgear integrity, earthing, conductor terminations, and defect coding."
          readTime="7 min guide + copyable checklist"
          lastUpdated="September 2026"
          breadcrumbs={breadcrumbs}
          keyTakeaway="A rigorous visual audit identifies loose terminations, missing blanks, thermal degradation, and bonding omissions before invasive live or dead instrument testing."
        />

        <section className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-10">
            <div className="space-y-3">
              <span className="eyebrow eyebrow-light">CHECKLIST FRAMEWORK</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Interactive EICR Visual Inspection Checklist
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Copy this structured checklist into your job packs, or download the formatted text template for on-site execution.
              </p>
            </div>

            <ContractorTemplateViewer
              templateName="Commercial EICR Visual Inspection Checklist"
              description="Standardised visual audit framework for three-phase commercial distribution boards under BS 7671:2018+A2:2022."
              sections={EICR_SECTIONS}
            />
          </div>
        </section>

        <ContractorPortalCtaCard
          headline="Attach EICR certificates directly to EntireFM work orders"
          description="Contractor Platform members manage calibrated tester logs, attach digital condition reports, and submit remedial repair quotes directly inside the Contractor Portal."
          primaryBtnText="Explore Contractor Membership (£295/yr)"
          primaryBtnHref="/suppliers/membership"
        />

        <ContractorFaqAccordion
          title="EICR Inspection &amp; Compliance Questions"
          faqs={EICR_FAQS}
        />

        <ContractorRelatedGrid
          heading="Related Electrical Resources"
          currentPath="/contractor-resources/eicr-visual-checklist"
        />
      </main>

      <Footer />
    </div>
  );
}
