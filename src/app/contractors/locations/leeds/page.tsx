import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocationHero } from "@/components/contractors/geo/LocationHero";
import { LocalCoverageMap } from "@/components/contractors/geo/LocalCoverageMap";
import { LocalTradesMatrix } from "@/components/contractors/geo/LocalTradesMatrix";
import { LocalBusinessContext } from "@/components/contractors/geo/LocalBusinessContext";
import { LocalContractorWorkflow } from "@/components/contractors/geo/LocalContractorWorkflow";
import { LocalPortalShowcase } from "@/components/contractors/geo/LocalPortalShowcase";
import { LocalFaqAccordion } from "@/components/contractors/geo/LocalFaqAccordion";
import { LocalConversionBridge } from "@/components/contractors/geo/LocalConversionBridge";
import { CONTRACTOR_LOCATIONS } from "@/lib/data/contractor-locations";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";

export const metadata: Metadata = generateRouteMetadata("/contractors/locations/leeds", {
  title: "Contractors in Leeds | Commercial FM Contractor Network | EntireFM",
  description:
    "Join the EntireFM Contractor Network in Leeds. Manage compliance, commercial RAMS, work orders, and local facilities management opportunities.",
});

export default function CityContractorPage() {
  const loc = CONTRACTOR_LOCATIONS["leeds"];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Locations", url: "/contractors/locations" },
    { name: loc.name, url: `/contractors/locations/${loc.slug}` },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <LocationHero
          locationName={loc.name}
          region={loc.county}
          title={loc.headline}
          subtitle={loc.subheadline}
          intro={loc.intro}
          imageSrc={loc.heroImage}
          imageAlt={loc.heroImageAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Join ${loc.name} Network`, href: "/contractors/join" }}
          secondaryCta={{ label: "Explore Contractor Portal", href: "/contractors" }}
          statusBadge="Active Operating Hub"
        />

        {/* Local Business Context */}
        <LocalBusinessContext
          locationName={loc.name}
          overview={loc.commercialLandscape.overview}
          propertySectors={loc.commercialLandscape.propertySectors}
        />

        {/* Local Coverage Map */}
        <LocalCoverageMap
          locationName={loc.name}
          region={loc.region}
          surroundingAreas={loc.surroundingAreas}
          keyCorridors={loc.commercialLandscape.keyCorridors}
        />

        {/* Trades Matrix */}
        <LocalTradesMatrix
          locationName={loc.name}
          locationSlug={loc.slug}
          disciplines={loc.activeDisciplines}
        />

        {/* Operational Workflow */}
        <LocalContractorWorkflow locationName={loc.name} />

        {/* Portal Showcase */}
        <LocalPortalShowcase
          locationName={loc.name}
          sampleWorkOrder={loc.sampleWorkOrder}
        />

        {/* Conversion Bridge */}
        <LocalConversionBridge locationName={loc.name} />

        {/* FAQs */}
        <LocalFaqAccordion locationName={loc.name} faqs={loc.faqs} />
      </main>

      <Footer />
    </div>
  );
}
