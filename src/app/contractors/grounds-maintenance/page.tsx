import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TradeHero } from "@/components/contractors/TradeHero";
import { TradeFmWorkflow } from "@/components/contractors/TradeFmWorkflow";
import { TradeComplianceGrid } from "@/components/contractors/TradeComplianceGrid";
import { TradePortalShowcase } from "@/components/contractors/TradePortalShowcase";
import { TradeDocsGrid } from "@/components/contractors/TradeDocsGrid";
import { TradeFaqAccordion } from "@/components/contractors/TradeFaqAccordion";
import { TradeConversionBridge } from "@/components/contractors/TradeConversionBridge";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";

export const metadata: Metadata = generateRouteMetadata("/contractors/grounds-maintenance", {
  title: "Grounds Maintenance Contractors UK | Commercial Landscaping & FM Network | EntireFM",
  description:
    "Join the EntireFM Grounds Maintenance Contractor Network. Manage NPTC / PA1 / PA6 compliance, tree surgery RAMS, winter gritting, and commercial FM estate maintenance.",
});

const GROUNDS_COMPLIANCE = [
  {
    category: "Statutory Insurance",
    mandatoryType: "Statutory & Insurance" as const,
    items: [
      "Public Liability Insurance (£5m minimum, £10m for large business parks/estates)",
      "Employers Liability Insurance (£10m mandatory for all employers)",
      "Tree surgery / aerial tree work insurance indemnity where arborist services apply",
    ],
  },
  {
    category: "Trade Accreditations",
    mandatoryType: "Trade Competency" as const,
    items: [
      "BALI (British Association of Landscape Industries) or Amenity Forum accreditation",
      "Arboricultural Association Approved Contractor status (for tree surgery operations)",
      "Valid SSIP Member Scheme accreditation (CHAS / SafeContractor / Constructionline)",
    ],
  },
  {
    category: "Operative Competency & Pesticide Control",
    mandatoryType: "Operational Standard" as const,
    items: [
      "City & Guilds NPTC / LANTRA PA1 (Foundation) & PA6 (Handheld) Pesticide Application Licences",
      "NPTC CS30/CS31/CS38/CS39 Chainsaw & Aerial Tree Climbing certification",
      "Ride-on mower & tractor PUWER operator competency certificates",
      "Waste Carrier Licence (Environment Agency Upper Tier) for green waste disposal",
    ],
  },
];

const GROUNDS_DOCS = [
  {
    title: "Grounds Maintenance RAMS Guide",
    href: "/contractor-resources/rams/what-are-rams",
    desc: "Complete guide to risk assessments covering mowers, hedge cutters, tree climbing, and pesticide spray.",
    type: "GUIDE" as const,
  },
  {
    title: "RAMS Template (11-Section)",
    href: "/contractor-resources/rams/how-to-write-rams",
    desc: "Standard commercial RAMS framework covering flying debris, pedestrian segregation, and machinery.",
    type: "TEMPLATE" as const,
  },
  {
    title: "Pesticide & Chemical COSHH",
    href: "/contractor-resources/rams/what-is-a-method-statement",
    desc: "Chemical safety for Glyphosate weedkillers, fertilisers, and chainsaw bar oils.",
    type: "SAFETY" as const,
  },
  {
    title: "Contractor Compliance Standard",
    href: "/contractor-resources/winning-work/how-to-get-facilities-management-work",
    desc: "6 statutory pillars, pesticide licence tracking, and automated 90/60/30-day credential alerts.",
    type: "COMPLIANCE" as const,
  },
];

const GROUNDS_FAQS = [
  {
    question: "What grounds maintenance work does EntireFM manage?",
    answer:
      "Contracts include scheduled grass cutting, hedge trimming, weed spraying (PA1/PA6), seasonal planting, litter picking across car parks, winter gritting and snow clearance, tree safety surveys, and arboricultural remedial pruning.",
  },
  {
    question: "What pesticide licensing is required for chemical weed control?",
    answer:
      "Operatives applying professional plant protection products on client grounds must hold valid City & Guilds NPTC PA1 and PA6 (or PA2 for boom sprayers) qualifications. All applications must be logged with weather records, wind speeds, and product batch numbers.",
  },
  {
    question: "How does the Contractor Portal support grounds maintenance companies?",
    answer:
      "The portal allows contractors to upload machinery maintenance logs, track operative NPTC cards, upload green waste transfer notes, and receive seasonal schedule instructions with GPS-stamped photo verification.",
  },
];

export default function GroundsMaintenanceContractorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Grounds Maintenance Contractors", url: "/contractors/grounds-maintenance" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="Grounds Maintenance"
          title="Grounds Maintenance Contractors"
          subtitle="Commercial estate landscaping, tree surgery &amp; gritting network."
          intro="A professional operating platform for UK grounds maintenance contractors — combining NPTC pesticide compliance, machinery safety RAMS, waste transfer tracking, and commercial FM contracts."
          imageSrc="/images/editorial/entirefm-headquarters-exterior-2000w.webp"
          imageAlt="Commercial property grounds and landscaped estate maintenance"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join Grounds Network", href: "/contractors/join" }}
          secondaryCta={{ label: "Explore Contractor Hub", href: "/contractors" }}
          facts={[
            { figure: "NPTC / PA1 / PA6", label: "Pesticide Assurance" },
            { figure: "£95 / yr", label: "Supplier Membership" },
            { figure: "Commercial Estates", label: "Scheduled & Winter PPM" },
          ]}
        />

        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">THE DISCIPLINE</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Maintaining Commercial Kerb Appeal, Environmental Safety &amp; Winter Resilience
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Commercial grounds maintenance defines the first impression of corporate headquarters, business parks, and retail centres. Operations involve high-speed machinery, flying debris hazards, statutory pesticide regulations under <strong>The Plant Protection Products (Sustainable Use) Regulations 2012</strong>, and tree safety governance.
              </p>
              <p>
                The EntireFM Contractor Platform gives grounds maintenance businesses the digital infrastructure to manage NPTC licences, store PUWER machinery inspections, generate pedestrian segregation RAMS, and receive scheduled commercial FM work orders.
              </p>
            </div>
          </div>
        </section>

        <TradeFmWorkflow tradeName="Grounds Maintenance" />
        <TradeComplianceGrid tradeName="Grounds Maintenance" requirements={GROUNDS_COMPLIANCE} />

        <TradePortalShowcase
          tradeName="Grounds Maintenance"
          sampleJob={{
            title: "Commercial Business Park Spring Grounds Refresh & Shrub Pruning",
            ref: "WO-84960-GM",
            location: "Innovation Business Park, Derby DE24",
            poValue: "£1,650.00 PO",
            scope: "Cut 18,000m² turf, edge all kerblines, prune perimeter hawthorn boundary hedges, apply targeted PA6 herbicide to car park block paving, remove green waste.",
          }}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m)", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: "Environment Agency Upper Tier Waste Carrier Licence", expiry: "20 Jul 2027", status: "VERIFIED" },
            { name: "Lead Operative NPTC PA1/PA6 Licences", expiry: "15 Oct 2026", status: "VERIFIED" },
          ]}
        />

        <TradeDocsGrid tradeName="Grounds Maintenance" docs={GROUNDS_DOCS} />
        <TradeConversionBridge tradeName="Grounds Maintenance Contractors" />
        <TradeFaqAccordion tradeName="Grounds Maintenance" faqs={GROUNDS_FAQS} />
      </main>

      <Footer />
    </div>
  );
}
