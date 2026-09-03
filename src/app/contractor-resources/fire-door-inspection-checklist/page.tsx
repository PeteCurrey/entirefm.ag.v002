import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContractorResourceHero } from "@/components/contractor-resources/ContractorResourceHero";
import { ContractorTemplateViewer } from "@/components/contractor-resources/ContractorTemplateViewer";
import { ContractorPortalCtaCard } from "@/components/contractor-resources/ContractorPortalCtaCard";
import { ContractorFaqAccordion } from "@/components/contractor-resources/ContractorFaqAccordion";
import { ContractorRelatedGrid } from "@/components/contractor-resources/ContractorRelatedGrid";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/fire-door-inspection-checklist", {
  title: "Commercial Fire Door 6-Point Inspection Checklist | BS 8214 Guide | EntireFM",
  description:
    "Statutory 6-point commercial fire door inspection checklist under the Fire Safety (England) Regulations 2022 and BS 8214. Covers gap tolerances, intumescent seals, and self-closing devices.",
});

const FIREDOOR_SECTIONS = [
  {
    "number": "01",
    "title": "Door Identification & Rating Verification",
    "purpose": "Record building location, door rating tag (FD30S/FD60S), and leaf core material.",
    "fields": [
      {
        "label": "Door Identifier & Location",
        "description": "Door ID number and corridor/stairwell location.",
        "example": "FD-GF-CORR-03 (Main Escape Corridor)"
      },
      {
        "label": "Fire Resistance Rating",
        "description": "FD30 (30 min fire), FD30S (30 min + cold smoke), FD60, or FD60S."
      },
      {
        "label": "Third-Party Certification Plug",
        "description": "Inspect for BM TRADA Q-Mark colour-coded plastic plug or BWF label on top edge."
      },
      {
        "label": "Glazing Fire Rating",
        "description": "Verify glass carries etch mark (Pyrostop/Pyroguard) with intact intumescent glazing channel."
      }
    ]
  },
  {
    "number": "02",
    "title": "Perimeter Gap Tolerances (The 3-4mm Rule)",
    "purpose": "Measure perimeter gaps using a calibrated taper gauge to ensure flame and smoke cannot bypass the door.",
    "fields": [
      {
        "label": "Top Header Gap",
        "description": "Must measure between 2mm and 4mm (ideal 3mm) continuously across header."
      },
      {
        "label": "Hinge Side Jamb Gap",
        "description": "Must measure between 2mm and 4mm; check for hinge screw pull-out."
      },
      {
        "label": "Latch Side Jamb Gap",
        "description": "Must measure between 2mm and 4mm to ensure positive latch engagement."
      },
      {
        "label": "Threshold Bottom Gap",
        "description": "Maximum 8mm for fire-only; maximum 3mm (or fitted automatic drop seal) for FD30S smoke doors."
      }
    ]
  },
  {
    "number": "03",
    "title": "Intumescent Strips & Cold Smoke Seals",
    "purpose": "Inspect passive seal integrity in frame grooves and door leaf edges.",
    "fields": [
      {
        "label": "Intumescent Strip Condition",
        "description": "Verify strips are unbroken, continuous, unpainted, and securely retained in rebate."
      },
      {
        "label": "Cold Smoke Brush / Blade",
        "description": "Ensure nylon brush or elastomeric blade contacts door face and has NOT been glazed over with paint."
      },
      {
        "label": "Interrupted Seals at Ironmongery",
        "description": "Verify intumescent pads are fitted behind hinge leaves and lock cases."
      }
    ]
  },
  {
    "number": "04",
    "title": "Self-Closing Devices, Hinges & Signage",
    "purpose": "Verify door closer operation, ironmongery certification, and mandatory statutory signage.",
    "fields": [
      {
        "label": "Self-Closing Action (BS EN 1154)",
        "description": "Door must latch positively into rebate from ANY open angle (including 15 degrees) overcoming latch resistance."
      },
      {
        "label": "Fire-Rated Hinges (BS EN 1935)",
        "description": "Minimum 3 Grade 13 ball-bearing hinges with all screws fitted securely."
      },
      {
        "label": "Mandatory Signage",
        "description": "Inspect for Fire Door Keep Shut or Automatic Fire Door Keep Clear at eye level on both faces."
      },
      {
        "label": "Hold-Open Release",
        "description": "Verify acoustic or electromagnetic hold-open retainers release immediately upon fire alarm activation."
      }
    ]
  }
];

const FIREDOOR_FAQS = [
  {
    question: "What is the maximum permissible gap for commercial fire doors?",
    answer: "Under BS 8214 and manufacturer test evidence, perimeter gaps between the door leaf and frame at the top and vertical sides must be between 2mm and 4mm (ideally 3mm). At the bottom threshold, the gap must not exceed 8mm for fire-only doors, or 3mm when cold smoke seals (FD30S) are specified.",
  },
  {
    question: "Can intumescent fire door seals be painted over?",
    answer: "Intumescent strips can generally accept a thin coat of paint if test evidence permits, but cold smoke brush/flipper seals must NEVER be painted over, as paint glazes the flexible fibres and destroys cold smoke containment.",
  },
  {
    question: "How often must commercial fire doors be inspected under UK law?",
    answer: "Under the Fire Safety (England) Regulations 2022, fire doors in communal areas of multi-occupied residential buildings over 11 metres must be inspected quarterly, with annual checks on all flat entrance doors. In commercial premises, the Responsible Person must ensure regular scheduled maintenance under the RRO 2005.",
  },
];

export default function FireDoorChecklistPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "Checklists", url: "/contractor-resources/inspection-checklists" },
    { name: "Fire Door Checklist", url: "/contractor-resources/fire-door-inspection-checklist" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <ContractorResourceHero
          eyebrow="LIFE SAFETY &amp; BUILDING FABRIC"
          title="Commercial Fire Door 6-Point Inspection Checklist"
          subtitle="Statutory compliance audit under the Fire Safety (England) Regs 2022 &amp; BS 8214."
          intro="Fire doors form critical passive fire barriers protecting escape corridors and stairwells. This 6-point statutory checklist structures commercial inspections covering gap tolerances, intumescent seals, self-closing latching action, and certification labels under BS 8214:2016."
          readTime="6 min guide + copyable checklist"
          lastUpdated="September 2026"
          breadcrumbs={breadcrumbs}
          keyTakeaway="Ensuring perimeter gaps remain within 3–4mm and verifying positive closer latching prevents toxic cold smoke and fire flashover from compromising escape routes."
        />

        <section className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-10">
            <div className="space-y-3">
              <span className="eyebrow eyebrow-light">CHECKLIST FRAMEWORK</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Interactive Fire Door 6-Point Inspection Checklist
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Copy this statutory checklist into your maintenance job packs or download the formatted text template.
              </p>
            </div>

            <ContractorTemplateViewer
              templateName="Fire Door 6-Point Inspection Checklist"
              description="Statutory inspection framework for commercial FD30S and FD60S fire door sets under BS 8214:2016."
              sections={FIREDOOR_SECTIONS}
            />
          </div>
        </section>

        <ContractorPortalCtaCard
          headline="Manage fire door inspection schedules in EntireFM"
          description="Contractor Platform members record gap measurements, attach door photos, and issue BM TRADA / FIRAS maintenance sign-offs directly inside the Contractor Portal."
          primaryBtnText="Explore Contractor Membership (£95/yr)"
          primaryBtnHref="/suppliers/membership"
        />

        <ContractorFaqAccordion
          title="Fire Door Compliance Questions"
          faqs={FIREDOOR_FAQS}
        />

        <ContractorRelatedGrid
          heading="Related Building Fabric &amp; Safety Resources"
          currentPath="/contractor-resources/fire-door-inspection-checklist"
        />
      </main>

      <Footer />
    </div>
  );
}
