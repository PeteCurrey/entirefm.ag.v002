import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocationHero } from "@/components/contractors/geo/LocationHero";
import { TradeFmWorkflow } from "@/components/contractors/TradeFmWorkflow";
import { TradeComplianceGrid } from "@/components/contractors/TradeComplianceGrid";
import { TradePortalShowcase } from "@/components/contractors/TradePortalShowcase";
import { TradeDocsGrid } from "@/components/contractors/TradeDocsGrid";
import { LocalFaqAccordion } from "@/components/contractors/geo/LocalFaqAccordion";
import { LocalConversionBridge } from "@/components/contractors/geo/LocalConversionBridge";
import { TRADE_LOCATION_PAIRINGS } from "@/lib/data/contractor-locations";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";

export const metadata: Metadata = generateRouteMetadata("/contractors/locations/nottingham/cleaning", {
  title: TRADE_LOCATION_PAIRINGS["nottingham/cleaning"].metaTitle,
  description: TRADE_LOCATION_PAIRINGS["nottingham/cleaning"].metaDescription,
});

export default function TradeLocationPage() {
  const item = TRADE_LOCATION_PAIRINGS["nottingham/cleaning"];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Locations", url: "/contractors/locations" },
    { name: item.locationName, url: `/contractors/locations/${item.locationSlug}` },
    { name: `${item.tradeName} Contractors`, url: `/contractors/locations/${item.locationSlug}/${item.tradeSlug}` },
  ];

  const tradeDocs = [
    {
      title: `${item.tradeName} RAMS Guide`,
      href: "/contractor-resources/rams/what-are-rams",
      desc: "Complete risk assessment and method statement standard for commercial facilities work.",
      type: "GUIDE" as const,
    },
    {
      title: "RAMS Template (11-Section)",
      href: "/contractor-resources/rams/how-to-write-rams",
      desc: "Downloadable commercial RAMS framework covering site safety, isolations, and sign-offs.",
      type: "TEMPLATE" as const,
    },
    {
      title: `${item.tradeName} Risk Assessment`,
      href: "/contractor-resources/risk-assessments/what-is-a-risk-assessment",
      desc: "5x5 risk evaluation model and hazard control hierarchy for trade contractors.",
      type: "GUIDE" as const,
    },
    {
      title: "Contractor Compliance Standard",
      href: "/contractor-resources/winning-work/how-to-get-facilities-management-work",
      desc: "6 statutory compliance pillars, £5m/£10m insurance standards, and automated expiry alerts.",
      type: "COMPLIANCE" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <LocationHero
          locationName={item.locationName}
          region={item.tradeName}
          eyebrow="ENTIREFM CONTRACTOR NETWORK"
          title={item.headline}
          subtitle={item.subheadline}
          intro={item.intro}
          imageSrc={item.heroImage}
          imageAlt={item.heroImageAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Join ${item.locationName} ${item.tradeName} Network`, href: "/contractors/join" }}
          secondaryCta={{ label: "Explore Contractor Portal", href: "/contractors" }}
          statusBadge="Active Trade Hub"
        />

        {/* Local Trade Commercial Context */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">LOCAL COMMERCIAL CONTEXT</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Delivering Professional {item.tradeName} Engineering in {item.locationName}
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>{item.localCommercialContext}</p>
              <p>
                Through the EntireFM Contractor Platform, {item.tradeName.toLowerCase()} contractors in {item.locationName} maintain verified compliance records, store operative certifications, generate site-specific RAMS, and receive clear commercial work instructions with purchase orders.
              </p>
            </div>
          </div>
        </section>

        {/* Operational Workflow */}
        <TradeFmWorkflow tradeName={item.tradeName} />

        {/* Compliance Grid */}
        <TradeComplianceGrid tradeName={item.tradeName} requirements={item.keyCompliance} />

        {/* Portal Showcase */}
        <TradePortalShowcase
          tradeName={`${item.locationName} ${item.tradeName}`}
          sampleJob={item.sampleJob}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m)", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: `${item.tradeName} Scheme Accreditation`, expiry: "15 Oct 2026", status: "VERIFIED" },
            { name: `Postcode Radius: ${item.locationName} + 35 miles`, expiry: "Ongoing", status: "ACTIVE" },
          ]}
        />

        {/* Documentation Links */}
        <TradeDocsGrid tradeName={item.tradeName} docs={tradeDocs} />

        {/* Conversion Bridge */}
        <LocalConversionBridge locationName={`${item.locationName} ${item.tradeName}`} />

        {/* FAQs */}
        <LocalFaqAccordion locationName={`${item.locationName} ${item.tradeName}`} faqs={item.faqs} />
      </main>

      <Footer />
    </div>
  );
}
