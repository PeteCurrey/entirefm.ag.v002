import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContractorResourceHero } from "@/components/contractor-resources/ContractorResourceHero";
import { ContractorTemplateViewer } from "@/components/contractor-resources/ContractorTemplateViewer";
import { ContractorPortalCtaCard } from "@/components/contractor-resources/ContractorPortalCtaCard";
import { ContractorFaqAccordion } from "@/components/contractor-resources/ContractorFaqAccordion";
import { ContractorRelatedGrid } from "@/components/contractor-resources/ContractorRelatedGrid";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/plantroom-pre-work-checklist", {
  title: "Plantroom Pre-Work Isolation & Safety Checklist | EntireFM Resources",
  description:
    "Commercial plantroom pre-work safety checklist covering mechanical isolations, Lock-Out Tag-Out (LOTO), pressure release, hot works permits, and emergency egress.",
});

const PLANT_SECTIONS = [
  {
    "number": "01",
    "title": "Access Authorisation & Permit Verification",
    "purpose": "Ensure all required permits and building security clearances are authorised prior to crossing the plantroom threshold.",
    "fields": [
      {
        "label": "General Permit to Work (PTW)",
        "description": "PTW signed by EntireFM facilities manager and contractor lead engineer."
      },
      {
        "label": "Specialist Permits",
        "description": "Hot Works, Confined Space, or Working at Height permits active and signed where required."
      },
      {
        "label": "Plantroom Key & Log-In",
        "description": "Key signed out from reception/security desk with operative time-in recorded."
      },
      {
        "label": "Competency Card Check",
        "description": "CSCS/Skillcard verified for all mechanical engineers attending."
      }
    ]
  },
  {
    "number": "02",
    "title": "Environmental Safety & Emergency Egress",
    "purpose": "Verify escape routes, emergency stop devices, forced ventilation, and gas detection systems.",
    "fields": [
      {
        "label": "Escape Route Clearance",
        "description": "Primary and secondary escape routes 100% unobstructed, illuminated, and doors unlocked from inside."
      },
      {
        "label": "Emergency Stop Locations",
        "description": "Gas slam-shut valves and electrical emergency stop buttons identified."
      },
      {
        "label": "Forced Ventilation & Gas Sensors",
        "description": "Verify mechanical extract ventilation running and gas alarm panel healthy (no active alarms)."
      },
      {
        "label": "Task Lighting Level",
        "description": "Adequate temporary or fixed illumination (minimum 200 lux across pump and valve work zones)."
      }
    ]
  },
  {
    "number": "03",
    "title": "Energy Isolation & Lock-Out Tag-Out (LOTO)",
    "purpose": "Isolate mechanical, electrical, thermal, and hydraulic energy sources before opening system boundaries.",
    "fields": [
      {
        "label": "Electrical Lock-Out",
        "description": "Isolate local rotary switch/MCB with personal padlock, warning tag, and prove dead with calibrated meter."
      },
      {
        "label": "Hydraulic / Valve Isolation",
        "description": "Flow and return valves closed, locked with chain/clamp, and tagged with engineer details."
      },
      {
        "label": "Pressure Depressurisation",
        "description": "Drain down isolated section slowly; verify pressure gauge reads 0.0 bar before loosening bolts."
      },
      {
        "label": "Thermal Cool-Down",
        "description": "Verify water/steam circuit temperature has cooled below 40°C to prevent scalding injuries."
      }
    ]
  },
  {
    "number": "04",
    "title": "Spill Containment, Lifting & Housekeeping",
    "purpose": "Prevent building flood damage, protect floor finishes, and verify heavy lifting equipment.",
    "fields": [
      {
        "label": "Bunded Drip Trays",
        "description": "High-capacity drip trays positioned under all drain cocks and pump flanges."
      },
      {
        "label": "LOLER Lifting Certification",
        "description": "A-frame gantry, chain hoist, and webbing slings inspected and within 6-month LOLER inspection."
      },
      {
        "label": "Fire Extinguisher Proximity",
        "description": "Dry powder / CO2 extinguisher positioned within 5 metres of work area."
      },
      {
        "label": "Waste & Component Removal",
        "description": "Scrap pump motors and glycol waste removed via licensed waste management carrier."
      }
    ]
  }
];

const PLANT_FAQS = [
  {
    question: "Why must water systems cool below 40°C before opening connections?",
    answer: "High-temperature Low Temperature Hot Water (LTHW) and Medium Temperature Hot Water (MTHW) systems operate at 70°C–120°C under pressure. Opening uncooled pipework risks catastrophic scalding and flash steam generation.",
  },
  {
    question: "What is required for a commercial Hot Works permit in a plantroom?",
    answer: "A Hot Works permit requires removal of combustibles within a 10-metre radius, active fire watch during works, deployment of appropriate fire extinguishers, and a minimum 60-minute continuous post-work fire watch after all heat sources are extinguished.",
  },
  {
    question: "How does EntireFM verify plantroom permits?",
    answer: "Permits to Work and associated pre-work isolation checklists are submitted digitally through the Contractor Portal prior to site arrival for FM authoriser sign-off.",
  },
];

export default function PlantroomChecklistPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "Checklists", url: "/contractor-resources/inspection-checklists" },
    { name: "Plantroom Pre-Work Checklist", url: "/contractor-resources/plantroom-pre-work-checklist" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <ContractorResourceHero
          eyebrow="MECHANICAL &amp; PLANTROOM TOOLKIT"
          title="Plantroom Pre-Work Isolation &amp; Safety Checklist"
          subtitle="Safe system of work verification for commercial plantroom maintenance."
          intro="Commercial plantrooms contain rotating machinery, pressurised hot water, high-voltage switchgear, and hazardous gases. This pre-work safety checklist enforces rigorous Safe Isolation, Lock-Out Tag-Out (LOTO), pressure release, and emergency egress verification."
          readTime="5 min guide + copyable checklist"
          lastUpdated="September 2026"
          breadcrumbs={breadcrumbs}
          keyTakeaway="Ensuring hydraulic depressurisation, thermal cool-down, electrical dead-testing, and unobstructed egress prevents catastrophic site incidents during plantroom overhauls."
        />

        <section className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-10">
            <div className="space-y-3">
              <span className="eyebrow eyebrow-light">CHECKLIST FRAMEWORK</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Interactive Plantroom Pre-Work Safety Checklist
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Copy this checklist into your safe system of work packs or download the text format.
              </p>
            </div>

            <ContractorTemplateViewer
              templateName="Plantroom Pre-Work Safety Checklist"
              description="Step-by-step mechanical isolation, LOTO, and emergency safety checklist for commercial building services plantrooms."
              sections={PLANT_SECTIONS}
            />
          </div>
        </section>

        <ContractorPortalCtaCard
          headline="Manage plantroom permits digitally in EntireFM"
          description="Contractor Platform members upload LOTO logs, attach LOLER lifting certificates, and manage hot works permits through the Contractor Portal."
          primaryBtnText="Explore Contractor Membership (£295/yr)"
          primaryBtnHref="/suppliers/membership"
        />

        <ContractorFaqAccordion
          title="Plantroom Safety &amp; Isolation Questions"
          faqs={PLANT_FAQS}
        />

        <ContractorRelatedGrid
          heading="Related Mechanical Resources"
          currentPath="/contractor-resources/plantroom-pre-work-checklist"
        />
      </main>

      <Footer />
    </div>
  );
}
