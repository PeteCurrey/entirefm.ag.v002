import type { ContentRecord } from '@/lib/routes/route-schema';
import { GEO_LOCATIONS } from '@/config/geo-registry';

/**
 * Builds non-doorway, unique ContentRecords for each /locations/{city} and /locations/{city}/services
 * based on authentic geographical data in GEO_LOCATIONS.
 */
export function generateGeoContentRecords(): Record<string, ContentRecord> {
  const records: Record<string, ContentRecord> = {};

  for (const [slug, geo] of Object.entries(GEO_LOCATIONS)) {
    const hubPath = `/locations/${slug}`;
    const servicesPath = `/locations/${slug}/services`;

    const isLondon = slug === 'london';

    // 1. Primary City Hub Record (/locations/{city})
    records[hubPath] = {
      path: hubPath,
      title: isLondon
        ? 'EntireFM London | Regional FM & Engineering Operations'
        : `Facilities Management ${geo.name} | FM & Engineering | EntireFM`,
      metaDescription: isLondon
        ? "Explore EntireFM's London operational coverage, engineering services, local FM delivery model and support for commercial properties across Greater London."
        : geo.metaDescription,
      h1: isLondon
        ? 'EntireFM London Regional Operations'
        : `Facilities Management & Engineering in ${geo.name}`,
      eyebrow: isLondon
        ? 'ENTIREFM LONDON · REGIONAL OPERATIONS HUB'
        : `${geo.name.toUpperCase()} REGIONAL HUB · ${geo.region.toUpperCase()}`,
      heroIntro: isLondon
        ? "Explore EntireFM's London operational coverage, engineering services, local FM delivery model and support for commercial properties across Greater London."
        : geo.tagline,
      heroDescription: isLondon
        ? "From the City of London and Canary Wharf to Park Royal, Croydon, and the M25 corridor, EntireFM delivers regional FM coordination, mobile engineering response, statutory compliance, and planned maintenance tailored to London commercial property environments."
        : `EntireFM provides total facilities management, planned preventative maintenance (PPM), mechanical & electrical engineering, and specialist building services across ${geo.name} and the ${geo.region}.`,
      historicIntent: isLondon
        ? 'EntireFM London regional operations and coverage hub'
        : `Comprehensive ${geo.name} commercial facilities management and engineering operations hub`,
      primaryIntent: isLondon
        ? 'london regional operations'
        : `facilities management ${geo.name.toLowerCase()}`,
      secondaryIntents: isLondon
        ? [
            'entirefm london',
            'london service coverage',
            'london engineering coverage',
            'london fm operations',
            'london regional operations hub',
          ]
        : [
            `fm services ${geo.name.toLowerCase()}`,
            `commercial property maintenance ${geo.name.toLowerCase()}`,
            `m&e contractors ${geo.name.toLowerCase()}`,
            `ppm maintenance ${geo.name.toLowerCase()}`,
          ],
      pageType: 'location',
      service: null,
      sector: null,
      location: geo.name,
      historicTopics: isLondon
        ? [
            'London Regional Operations',
            'Mobile Engineering Coverage',
            'London Commercial Property Logistics',
            'SFG20 Statutory Compliance',
            '24/7 Response SLAs',
            'Greater London & M25 Delivery',
          ]
        : [
            'Facilities Management',
            'M&E Engineering',
            'Commercial Cleaning',
            'Statutory Compliance',
            'Planned Maintenance',
            geo.name,
          ],
      requiredSections: [
        'hero',
        'commercialContext',
        'regionalCapability',
        'services',
        'legacyLinks',
        'sectors',
        'compliance',
        'cafm',
        'districts',
        'faqs',
        'regionalContact',
        'relatedLocations',
      ],
      sections: isLondon
        ? [
            {
              heading: 'London Commercial Property Logistics & Operating Constraints',
              body: geo.operatingContext,
            },
            {
              heading: 'Regional Engineering Coverage & Mobile Service Fleet',
              body: `Our London mobile engineering fleet provides scheduled M&E maintenance, commercial HVAC & chiller servicing, fixed wire electrical testing (EICR), gas safety (CP12/CP17), and contracted 24/7 priority emergency response across Central London, outer boroughs, and the M25 corridor.`,
            },
            {
              heading: 'SFG20 Asset Maintenance & Digital Compliance Vault',
              body: `All statutory building maintenance across London premises is managed through EntireCAFM. Assets are barcoded during mobilisation, tasks are aligned to SFG20 industry standards, and digital audit certificates are archived with 24/7 client access.`,
            },
          ]
        : [
            {
              heading: `Commercial Property Environment in ${geo.name}`,
              body: geo.operatingContext,
            },
            {
              heading: `Technical Engineering & Hard FM in ${geo.name}`,
              body: `Our mobile engineering fleet delivers scheduled M&E servicing, HVAC maintenance, gas safety (CP15/CP17), electrical testing (EICR), and 24/7 priority emergency response across ${geo.districts.slice(0, 4).join(', ')}.`,
            },
            {
              heading: `Statutory Compliance & SFG20 Standards`,
              body: `All maintenance activities across ${geo.name} commercial properties are scheduled to SFG20 standards with electronic proof of compliance stored immutably in the EntireCAFM Compliance Vault.`,
            },
          ],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Locations', url: '/locations' },
        { name: isLondon ? 'London Operations' : geo.name, url: hubPath },
      ],
      relatedRoutes: [
        '/facilities-management-london',
        '/facilities-management-services-london',
        servicesPath,
        ...geo.legacyUrls.slice(0, 4),
        '/client-portal',
        '/compliance',
      ],
      conversionGoal: `Book a regional operational review with our ${geo.name} operations desk via ${geo.email}`,
      verificationRequirements: [
        `Regional email ${geo.email} verified and operational`,
        `Districts and property types verified against local commercial profile`,
        `Zero cross-canonicalisation to legacy routes`,
      ],
      contentStatus: 'CONTENT_COMPLETE',
    };

    // 2. Local Service Overview Record (/locations/{city}/services)
    records[servicesPath] = {
      path: servicesPath,
      title: `FM Services in ${geo.name} | Facilities Management Catalogue | EntireFM`,
      metaDescription: `Explore our complete catalogue of facilities management services in ${geo.name}: M&E engineering, PPM schedules, commercial cleaning, working at height, and compliance.`,
      h1: `Facilities Management Services Available in ${geo.name}`,
      eyebrow: `${geo.name.toUpperCase()} SERVICE CATALOGUE · TOTAL FM`,
      heroIntro: `Comprehensive Hard & Soft Facilities Management Services Delivered Across ${geo.name}`,
      heroDescription: `From statutory planned maintenance and HVAC engineering to high-level rope access and daily commercial cleaning, explore our complete service capability in ${geo.name}.`,
      historicIntent: `Full service catalogue and capability directory for ${geo.name}`,
      primaryIntent: `facilities management services ${geo.name.toLowerCase()}`,
      secondaryIntents: [
        `commercial cleaning ${geo.name.toLowerCase()}`,
        `building maintenance ${geo.name.toLowerCase()}`,
        `hvac maintenance ${geo.name.toLowerCase()}`,
        `ppm services ${geo.name.toLowerCase()}`,
      ],
      pageType: 'geographic-service',
      service: 'Total Facilities Management Services',
      sector: null,
      location: geo.name,
      historicTopics: [
        'Hard FM',
        'Soft FM',
        'Specialist Services',
        'Statutory Compliance',
        geo.name,
      ],
      requiredSections: [
        'hero',
        'categoryNavigator',
        'hardFm',
        'ppmCompliance',
        'softFm',
        'specialist',
        'serviceLinks',
        'cafmIntegration',
        'faqs',
        'proposalCta',
      ],
      sections: [
        {
          heading: `Hard FM & Engineering Services in ${geo.name}`,
          body: `Direct delivery of mechanical & electrical engineering, commercial gas heating, ventilation and air conditioning (HVAC), plumbing, and fire safety systems.`,
        },
        {
          heading: `Planned Preventative Maintenance & Compliance`,
          body: `Asset-led maintenance schedules built to SFG20 specifications, ensuring 100% statutory compliance for emergency lighting, EICR fixed wiring, and water hygiene.`,
        },
        {
          heading: `Soft FM, Cleaning & Specialist Solutions`,
          body: `Contract commercial cleaning, heavy factory degreasing, high-level façade cleaning, rope access / BMU operations, and mobile crane lifting.`,
        },
      ],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Locations', url: '/locations' },
        { name: geo.name, url: hubPath },
        { name: 'Services', url: servicesPath },
      ],
      relatedRoutes: [
        hubPath,
        ...geo.legacyUrls.slice(0, 4),
        '/services',
        '/client-portal',
      ],
      conversionGoal: `Request a service proposal from our ${geo.name} regional desk via ${geo.email}`,
      verificationRequirements: [
        `Catalogue reflects verified EntireFM service capabilities`,
        `Links directly to existing legacy landing pages without duplicate URL creation`,
      ],
      contentStatus: 'CONTENT_COMPLETE',
    };
  }

  return records;
}

export const GEO_EXPANSION_CONTENT = generateGeoContentRecords();
