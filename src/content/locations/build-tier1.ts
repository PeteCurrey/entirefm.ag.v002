/**
 * TIER 1 LOCATION CONTENT BUILDER
 * ===============================
 * Builds a ContentRecord for each Tier 1 city URL variant.
 *
 * THE POINT OF THE VARIANTS
 * -------------------------
 * The legacy estate kept several URLs per city — /fm-leeds,
 * /facilities-management-leeds, /leeds-facilities-management. Search Console
 * shows these are not the same query. "facilities management leeds" is a head
 * commercial term; "leeds facilities management" skews local-first; "fm leeds"
 * and "leeds fm services" are short-form provider searches. Keeping the URLs
 * is only defensible if each one does a genuinely different job.
 *
 * So each variant draws on a *different slice* of the city data and is
 * structured differently, rather than restating the same page:
 *
 *   /fm-{city}                        commercial proposition — contract,
 *                                     consolidation, mobilisation
 *   /facilities-management-{city}     head term — the local operating
 *                                     conditions, which is the real
 *                                     differentiator
 *   /{city}-facilities-management     regional — districts, building stock,
 *                                     multi-site estate coverage
 *   /{city}-facilities-management-areas  coverage detail, district by district
 *   /fm-services-{city}               service catalogue scoped to the city
 *
 * Shared boilerplate is deliberately kept to a minimum. Where two variants
 * would otherwise say the same thing, only one of them says it.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';
import { TIER1_CITIES, type Tier1City } from './tier1-cities';
import locationImages from '@/config/location-images.json';

type ImageManifest = {
  cities: Record<string, { city: string; images: Array<{ src: string; alt: string }> }>;
};

const IMAGES = locationImages as ImageManifest;

/** Nth curated image for a city, or undefined when the city has no verified photography. */
function cityImage(city: Tier1City, index = 0): string | undefined {
  if (!city.imageSlug) return undefined;
  return IMAGES.cities[city.imageSlug]?.images[index]?.src;
}

const CORE_SERVICES = [
  'Planned preventative maintenance (PPM)',
  'Reactive and emergency repairs',
  'Mechanical and electrical engineering',
  'HVAC and air conditioning',
  'Statutory compliance and testing',
  'Fire and emergency systems',
  'Plumbing, drainage and gas',
  'Building fabric and roofing',
  'Commercial and industrial cleaning',
  'Grounds, external areas and security',
];

const baseCrumbs = (city: Tier1City, label: string, path: string) => [
  { name: 'Home', url: '/' },
  { name: 'Locations', url: '/locations' },
  { name: label, url: path },
];

/** Related routes for a city, filtered to those that actually exist in the registry. */
function relatedFor(city: Tier1City, self: string, registryPaths: Set<string>): string[] {
  const candidates = [
    `/fm-${city.slug}`,
    `/facilities-management-${city.slug}`,
    `/${city.slug}-facilities-management`,
    '/ppm',
    '/hard-services',
    '/mechanical-electrical',
    '/commercial-facilities-management',
    '/contact-us',
  ];
  return candidates.filter((p) => p !== self && registryPaths.has(p)).slice(0, 6);
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT A — /fm-{city}   short-form commercial intent
// ─────────────────────────────────────────────────────────────────────────────

function buildShortForm(city: Tier1City, registryPaths: Set<string>): ContentRecord {
  const path = `/fm-${city.slug}`;
  return {
    path,
    title: `FM ${city.name} | Outsourced Facilities Management | EntireFM`,
    metaDescription: `Outsourced facilities management in ${city.name} under one contract — planned maintenance, reactive repairs, compliance and reporting from a single provider.`,
    h1: `FM ${city.name}: Outsourced Facilities Management Under One Contract`,
    eyebrow: 'Contracted FM',
    heroIntro: `EntireFM provides contracted facilities management to commercial property across ${city.name}, consolidating planned maintenance, reactive repairs, statutory compliance and reporting into a single accountable contract.`,
    heroDescription: `If you are currently running ${city.name} sites through a spread of individual trade suppliers, this page covers what changes when that moves to one provider — and how the transition is handled without losing service.`,
    heroImage: cityImage(city, 0),
    historicIntent: `Historic short-form FM provider search intent for ${city.name}`,
    primaryIntent: `fm ${city.slug}`,
    secondaryIntents: [
      `${city.slug} fm services`,
      `outsourced facilities management ${city.slug}`,
      `facilities management companies ${city.slug}`,
      `fm contractor ${city.slug}`,
    ],
    pageType: 'location',
    service: null,
    sector: null,
    location: city.name,
    historicTopics: [
      `Outsourced FM in ${city.name}`,
      'Supplier consolidation',
      'Contract mobilisation',
      'Service level agreements',
    ],
    requiredSections: ['hero', 'body', 'capabilities', 'faq', 'cta'],
    sections: [
      {
        heading: `What a single FM contract covers in ${city.name}`,
        body: `One contract replaces the separate arrangements most estates accumulate — a maintenance firm, an electrical contractor, a cleaning supplier, a compliance provider and whoever attends when something fails out of hours. EntireFM holds the whole scope, so responsibility for an issue does not move between suppliers while a building sits unusable.`,
        bullets: CORE_SERVICES,
      },
      {
        heading: 'Why estates consolidate suppliers',
        body: `Fragmented supply is expensive in ways that do not appear on any single invoice. Compliance gaps open up between providers who each assume someone else holds the certificate. Reactive costs rise because nobody is accountable for the underlying fault recurring. Management time is spent chasing rather than deciding. Consolidation is usually justified on those three lines rather than on headline rates.`,
      },
      {
        heading: `What that means for a ${city.name} estate specifically`,
        body: `${city.positioning} ${city.operatingConditions[0].detail}`,
        bullets: [
          `Dominant building types: ${city.propertyStock.slice(0, 3).join('; ')}`,
          `Sectors most represented locally: ${city.sectors.slice(0, 4).join(', ')}`,
          `Coverage: ${city.travelPattern}`,
        ],
      },
      {
        heading: `The local constraints that shape the contract`,
        body: `A contract priced without these produces a rate that looks competitive and an operation that cannot deliver it. Each of these is a live cost or scheduling factor in ${city.name}.`,
        bullets: city.operatingConditions.slice(1, 4).map((c) => `${c.title} — ${c.detail.split('. ')[0]}.`),
      },
      {
        heading: `How mobilisation works`,
        body: `Mobilisation starts with an asset survey rather than a contract start date. Until the assets, their condition and their statutory obligations are known, any maintenance schedule is guesswork. From that survey EntireFM builds the PPM plan, the compliance calendar and the reactive response arrangements, then runs a defined handover period alongside outgoing suppliers so nothing lapses in the gap.`,
        bullets: [
          'Asset survey and condition assessment across all in-scope sites',
          'Statutory obligation mapping and compliance calendar',
          'PPM schedule built from actual assets, not a generic template',
          'Agreed response times by priority and site criticality',
          'Handover period alongside outgoing suppliers',
          'Reporting and escalation routes agreed before go-live',
        ],
      },
    ],
    capabilities: [
      { name: 'Single point of accountability', description: `One contract and one escalation route for every service line across your ${city.name} estate.`, tag: 'Contract' },
      { name: `Priced for ${city.name} conditions`, description: city.operatingConditions[0].title, tag: 'Commercial' },
      { name: `Built around ${city.sectors[0].toLowerCase()}`, description: `The sector mix across ${city.region} weights the contract toward the compliance and engineering lines that actually apply here.`, tag: 'Sector' },
      { name: 'Compliance held in one place', description: 'Statutory testing, certification and records managed centrally, so gaps between suppliers cannot open up.', tag: 'Compliance' },
    ],
    faqs: [
      {
        question: `Can EntireFM take over an existing FM contract in ${city.name}?`,
        answer: `Yes. Most mobilisations are transitions rather than new starts. The critical part is the handover window — EntireFM surveys the estate and builds the maintenance and compliance schedules before the outgoing provider stands down, so statutory testing does not lapse in the gap.`,
      },
      {
        question: 'Is there a minimum contract size?',
        answer: `No fixed minimum. Single-site contracts work where the site is complex enough to justify one, and multi-site estates across ${city.region} are the more common case. What matters is whether consolidating actually improves the outcome, which the initial survey establishes.`,
      },
      {
        question: `What drives the cost of an FM contract in ${city.name}?`,
        answer: `Asset count and condition set the baseline, but local factors move it more than most buyers expect. In ${city.name} the significant one is that ${city.operatingConditions[0].title.toLowerCase()} — ${city.operatingConditions[0].detail.split('. ')[0].toLowerCase()}.`,
      },
      {
        question: 'How are response times agreed?',
        answer: `Response times are set by priority band and site criticality rather than as a single blanket figure, and for ${city.name} they also have to account for access: ${city.operatingConditions[1].detail.split('. ')[0].toLowerCase()}.`,
      },
      {
        question: 'What happens to our existing supplier relationships?',
        answer: 'Where an incumbent supplier performs well and knows the site, retaining them within the managed structure is often the right answer. Consolidation is about accountability and coordination, not about replacing everyone by default.',
      },
    ],
    breadcrumbs: baseCrumbs(city, `FM ${city.name}`, path),
    relatedRoutes: relatedFor(city, path, registryPaths),
    conversionGoal: `Generate a contracted FM proposal enquiry for a ${city.name} estate`,
    verificationRequirements: [
      'No facility claimed in a named city — GEO_REGIONAL_CENTRES stays DO_NOT_USE',
      'No unverified accreditation or SLA claim',
      'Distinct from the head-term and regional variants for this city',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT B — /facilities-management-{city}   head term
// This variant carries the local operating conditions. They are the reason
// the page is not interchangeable with any other city's page.
// ─────────────────────────────────────────────────────────────────────────────

function buildHeadTerm(city: Tier1City, registryPaths: Set<string>): ContentRecord {
  const path = `/facilities-management-${city.slug}`;
  return {
    path,
    title: `Facilities Management ${city.name} | Commercial FM | EntireFM`,
    metaDescription: `Commercial facilities management in ${city.name}. Planned maintenance, M&E, compliance and reactive cover, planned around how ${city.name} buildings actually operate.`,
    h1: `Facilities Management in ${city.name}`,
    eyebrow: 'Commercial FM',
    heroIntro: city.positioning,
    heroDescription: `EntireFM maintains commercial property across ${city.name} — planned maintenance, mechanical and electrical engineering, statutory compliance and reactive cover, scheduled around the constraints that apply here rather than a national template.`,
    heroImage: city.slug === 'manchester' ? '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp' : (cityImage(city, 1) ?? cityImage(city, 0)),
    historicIntent: `Historic head-term commercial search intent for facilities management in ${city.name}`,
    primaryIntent: `facilities management ${city.slug}`,
    secondaryIntents: [
      `facilities management companies ${city.slug}`,
      `facilities maintenance ${city.slug}`,
      `commercial facilities management ${city.slug}`,
      `building maintenance ${city.slug}`,
    ],
    pageType: 'location',
    service: null,
    sector: null,
    location: city.name,
    historicTopics: [
      `Facilities management in ${city.name}`,
      'Local operating conditions',
      'Statutory compliance',
      'Planned and reactive maintenance',
    ],
    requiredSections: ['hero', 'body', 'capabilities', 'faq', 'cta'],
    sections: [
      {
        heading: `What makes facilities management in ${city.name} different`,
        body: `Most FM propositions read identically from city to city, which is a reasonable signal that the provider has not thought about the difference. These are the conditions that actually change how work is planned, priced and delivered in ${city.name}.`,
      },
      ...city.operatingConditions.map((c) => ({
        heading: c.title,
        body: c.detail,
      })),
      {
        heading: `Services delivered across ${city.name}`,
        body: `Hard and soft services are delivered under one contract, so planned maintenance, statutory testing and reactive response are coordinated rather than competing for the same access windows.`,
        bullets: CORE_SERVICES,
      },
      {
        heading: `Sectors we work in across ${city.region}`,
        body: `The commercial estate in ${city.name} is weighted toward particular sectors, and each brings its own compliance profile and tolerance for disruption.`,
        bullets: city.sectors,
      },
    ],
    capabilities: city.operatingConditions.slice(0, 4).map((c) => ({
      name: c.title,
      description: c.detail.length > 190 ? `${c.detail.slice(0, 187)}…` : c.detail,
      tag: 'Local condition',
    })),
    faqs: [
      {
        question: `Which areas of ${city.name} does EntireFM cover?`,
        answer: `${city.travelPattern} EntireFM runs nationally through regional operations, with engineering teams working to the area, and response planning is based on genuine travel capability rather than a marketing radius.`,
      },
      {
        question: `What are the main compliance obligations for commercial buildings in ${city.name}?`,
        answer: `The statutory framework is national — fixed wire testing, emergency lighting, fire alarm and detection, water hygiene under L8, gas safety and lifting equipment among others. What changes locally is the exposure: ${city.operatingConditions[0].title.toLowerCase()} is a live factor for ${city.name} estates in a way it is not everywhere.`,
      },
      {
        question: 'How quickly can engineers attend an emergency?',
        answer: `Attendance depends on priority band, site criticality and time of day, and on ${city.name} specifically it depends on the access constraints described above. Contracted response times are agreed per site during mobilisation rather than promised as a single headline figure.`,
      },
      {
        question: 'Do you work on listed or conservation-area buildings?',
        answer: 'Yes. The practical constraint is that visible external changes — plant, flues, roofing, glazing — need consent and sympathetic specification, which lengthens lead times. Planning for that up front avoids work being stopped once it has started.',
      },
      {
        question: 'Can you work alongside our existing in-house team?',
        answer: 'Yes. A common arrangement is in-house staff handling day-to-day site presence with EntireFM covering specialist engineering, statutory compliance and out-of-hours response. The split is defined during mobilisation so nothing sits in the gap between the two.',
      },
    ],
    breadcrumbs: baseCrumbs(city, `Facilities Management ${city.name}`, path),
    relatedRoutes: relatedFor(city, path, registryPaths),
    conversionGoal: `Generate a commercial FM enquiry or site survey request from ${city.name}`,
    verificationRequirements: [
      'Operating conditions must be factually accurate for this city',
      'No facility claimed in a named city — GEO_REGIONAL_CENTRES stays DO_NOT_USE',
      'No unverified accreditation or SLA claim',
      'Structurally distinct from the short-form and regional variants',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT C — /{city}-facilities-management   regional / multi-site
// ─────────────────────────────────────────────────────────────────────────────

function buildRegional(city: Tier1City, registryPaths: Set<string>): ContentRecord {
  const path = `/${city.slug}-facilities-management`;
  return {
    path,
    title: `${city.name} Facilities Management | Multi-Site Estates | EntireFM`,
    metaDescription: `Multi-site facilities management across ${city.name} and ${city.region}. Consistent standards, one reporting line and coordinated maintenance across every site.`,
    h1: `${city.name} Facilities Management for Multi-Site Estates`,
    eyebrow: 'Estate coverage',
    heroIntro: `Managing several buildings across ${city.name} creates a different problem from managing one: keeping standards, compliance and reporting consistent when every site has its own age, occupancy and constraints.`,
    heroDescription: `EntireFM covers ${city.region} as a single operating area, so a portfolio spread across the city and its surrounding towns is maintained to one standard and reported through one line.`,
    heroImage: cityImage(city, 2) ?? cityImage(city, 0),
    historicIntent: `Historic regional and portfolio search intent for ${city.name} facilities management`,
    primaryIntent: `${city.slug} facilities management`,
    secondaryIntents: [
      `multi site facilities management ${city.slug}`,
      `${city.slug} facilities management company`,
      `commercial property maintenance ${city.slug}`,
      `estate facilities management ${city.region}`,
    ],
    pageType: 'location',
    service: null,
    sector: null,
    location: city.name,
    historicTopics: [
      `${city.name} regional coverage`,
      'Multi-site estate management',
      'Commercial districts and property stock',
      'Consistent reporting',
    ],
    requiredSections: ['hero', 'body', 'capabilities', 'faq', 'cta'],
    sections: [
      {
        heading: `Commercial districts covered across ${city.name}`,
        body: `Each part of the city presents a different operating problem. These are the areas EntireFM works in and what tends to characterise the buildings there.`,
        bullets: city.districts.map((d) => `${d.name} — ${d.note}`),
      },
      {
        heading: `The building stock across ${city.name}`,
        body: `Maintenance planning depends more on what a building is than on where it sits. The ${city.name} commercial estate is dominated by these types, and each carries a different failure profile and compliance load.`,
        bullets: city.propertyStock,
      },
      {
        heading: 'Running a portfolio to one standard',
        body: `The difficulty with a multi-site estate is not the individual buildings, it is the variance between them — different suppliers, different record-keeping, different assumptions about who holds which certificate. A single provider across the portfolio removes the variance, which is usually where the cost and the compliance risk actually sit.`,
        bullets: [
          'One asset register and compliance calendar covering every site',
          'Consistent PPM standards applied across the portfolio',
          'Portfolio-level reporting with per-site detail underneath',
          'Single escalation route regardless of which site raises the issue',
          'Comparable cost data across sites, making outliers visible',
        ],
      },
      {
        heading: `Coverage beyond the city`,
        body: `${city.travelPattern} Sites outside the city core are covered on the same contract and to the same standards, which matters for estates that are not neatly contained within one boundary.`,
      },
    ],
    capabilities: [
      { name: 'Portfolio-wide asset register', description: `A single register covering every site across ${city.region}, so estate-level compliance can actually be evidenced.`, tag: 'Estate' },
      { name: 'Consistent standards across sites', description: 'The same maintenance specification and quality expectations applied everywhere, rather than inherited site by site.', tag: 'Quality' },
      { name: 'One reporting line', description: 'Portfolio reporting with per-site breakdown, so outliers in cost or failure rate are visible rather than buried.', tag: 'Reporting' },
      { name: 'Coordinated scheduling', description: 'Planned visits sequenced across nearby sites to reduce travel, disruption and cost.', tag: 'Efficiency' },
    ],
    faqs: [
      {
        question: `How many sites do we need before a portfolio contract makes sense?`,
        answer: `There is no threshold number. The question is whether the sites currently run to different standards with different suppliers — if they do, consolidation usually pays for itself in compliance certainty and management time before it shows up in the rate.`,
      },
      {
        question: `Do all our sites have to be inside ${city.name}?`,
        answer: `No. ${city.travelPattern} Estates rarely respect city boundaries, and a portfolio contract covers the sites where they actually are.`,
      },
      {
        question: 'How is reporting handled across multiple sites?',
        answer: 'Reporting works at two levels: portfolio-wide performance for whoever holds the budget, and per-site detail for the people running each building. Both draw on the same records, so the numbers reconcile.',
      },
      {
        question: 'Can sites be added or removed during the contract?',
        answer: 'Yes. Estates change through acquisition, disposal and lease events. Adding a site triggers the same survey and compliance-mapping process as the original mobilisation, so a new building does not join the contract as an unknown.',
      },
    ],
    breadcrumbs: baseCrumbs(city, `${city.name} Facilities Management`, path),
    relatedRoutes: relatedFor(city, path, registryPaths),
    conversionGoal: `Generate a multi-site estate FM enquiry across ${city.region}`,
    verificationRequirements: [
      'District descriptions must be factually accurate',
      'No facility claimed in a named city — GEO_REGIONAL_CENTRES stays DO_NOT_USE',
      'Structurally distinct from the short-form and head-term variants',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT D — /{city}-facilities-management-areas   coverage detail
// ─────────────────────────────────────────────────────────────────────────────

function buildAreas(city: Tier1City, registryPaths: Set<string>): ContentRecord {
  const path = `/${city.slug}-facilities-management-areas`;
  return {
    path,
    title: `${city.name} FM Coverage Areas | Districts Served | EntireFM`,
    metaDescription: `Where EntireFM delivers facilities management across ${city.name} — district by district, with the access and building constraints that apply in each.`,
    h1: `${city.name} Facilities Management Coverage Areas`,
    eyebrow: 'Coverage',
    heroIntro: `A district-by-district view of where EntireFM works across ${city.name}, and what tends to characterise the commercial buildings in each area.`,
    heroDescription: `Coverage claims are only useful if they say something specific. This page sets out the areas served across ${city.region} and the constraints that apply in each one.`,
    heroImage: cityImage(city, 3) ?? cityImage(city, 0),
    historicIntent: `Historic coverage-area lookup intent for ${city.name} facilities management`,
    primaryIntent: `${city.slug} facilities management areas`,
    secondaryIntents: [
      `facilities management coverage ${city.slug}`,
      `fm service areas ${city.slug}`,
      `${city.slug} areas covered facilities management`,
    ],
    pageType: 'location',
    service: null,
    sector: null,
    location: city.name,
    historicTopics: [`${city.name} coverage areas`, 'Districts served', 'Access constraints'],
    requiredSections: ['hero', 'body', 'faq', 'cta'],
    sections: [
      {
        heading: `Areas covered across ${city.name}`,
        body: `EntireFM works across the following commercial districts and estates. The note against each is what tends to matter operationally when maintaining buildings there.`,
        bullets: city.districts.map((d) => `${d.name} — ${d.note}`),
      },
      {
        heading: 'Beyond the city boundary',
        body: `${city.travelPattern}`,
      },
      {
        heading: 'How coverage actually works',
        body: `EntireFM operates nationally through regional operations. What that means in practice varies by area — some locations are staffed offices, some are storage and equipment bases, and all are supported by engineering teams working to the region. What matters commercially is not which of those sits nearest to you, but whether the response time can actually be met: those are agreed per site during mobilisation from genuine travel capability. Where a site needs guaranteed short-notice attendance, that is designed into the contract explicitly.`,
      },
    ],
    faqs: [
      {
        question: `Is my building inside your ${city.name} coverage area?`,
        answer: `${city.travelPattern} If a site sits outside that pattern it can usually still be covered — it just needs to be priced honestly for travel rather than absorbed into a headline response time that would not be met.`,
      },
      {
        question: 'How is the region actually resourced?',
        answer: 'Through regional operations rather than a uniform branch network — a mix of offices, storage and equipment bases, and engineering teams working to the area. Rather than publish a map of buildings, we agree the response time for your specific site and commit to it contractually, because that is the part that affects you.',
      },
      {
        question: 'How are response times set for outlying sites?',
        answer: 'By measuring realistic travel, not by applying the same figure everywhere. A site an hour from the city core cannot carry the same response commitment as one in the centre, and a contract that says it can will not hold.',
      },
    ],
    breadcrumbs: baseCrumbs(city, `${city.name} Coverage Areas`, path),
    relatedRoutes: relatedFor(city, path, registryPaths),
    conversionGoal: `Confirm coverage and generate a site enquiry within ${city.region}`,
    verificationRequirements: [
      'Describes regional operations without naming a facility in this city',
      'District list must be factually accurate',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT E — /fm-services-{city}   service catalogue scoped to the city
// ─────────────────────────────────────────────────────────────────────────────

function buildServiceCatalogue(city: Tier1City, registryPaths: Set<string>): ContentRecord {
  const path = `/fm-services-${city.slug}`;
  return {
    path,
    title: `FM Services ${city.name} | Hard & Soft Services | EntireFM`,
    metaDescription: `The full facilities management service list available in ${city.name} — hard services, soft services, statutory compliance and specialist engineering.`,
    h1: `FM Services in ${city.name}`,
    eyebrow: 'Service list',
    heroIntro: `A straightforward list of what EntireFM delivers in ${city.name}, for buyers who already know they need a provider and want to check the scope covers what they have.`,
    heroDescription: `Hard services, soft services, statutory compliance and specialist engineering, available individually or consolidated into a single contract.`,
    heroImage: cityImage(city, 1) ?? cityImage(city, 0),
    historicIntent: `Historic service-listing search intent for FM services in ${city.name}`,
    primaryIntent: `fm services ${city.slug}`,
    secondaryIntents: [
      `facilities management services ${city.slug}`,
      `${city.slug} fm service list`,
      `hard and soft services ${city.slug}`,
    ],
    pageType: 'location',
    service: null,
    sector: null,
    location: city.name,
    historicTopics: [`FM services in ${city.name}`, 'Hard services', 'Soft services', 'Statutory compliance'],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta'],
    sections: [
      {
        heading: `Hard services in ${city.name}`,
        body: 'Engineering and building services — the systems whose failure stops a building working.',
        bullets: [
          'Mechanical and electrical engineering',
          'HVAC, air conditioning and ventilation',
          'Fixed wire testing and electrical compliance',
          'Fire alarm, detection and emergency lighting',
          'Plumbing, drainage, gas and water hygiene',
          'Building fabric, roofing and glazing',
          'Lifts, lifting equipment and access systems',
        ],
      },
      {
        heading: `Soft services in ${city.name}`,
        body: 'The services that determine how a building presents and how it is experienced day to day.',
        bullets: [
          'Commercial and office cleaning',
          'Industrial and specialist cleaning',
          'Window cleaning and external facade',
          'Washroom and hygiene services',
          'Grounds and external area maintenance',
          'Security, concierge and front of house',
          'Waste management and recycling',
        ],
      },
      {
        heading: 'Statutory compliance',
        body: `Compliance is where fragmented supply fails most often, because each provider assumes another holds the record. Held in one place, the calendar and the evidence stay complete.`,
        bullets: [
          'Fixed wire and portable appliance testing',
          'Emergency lighting and fire system testing',
          'Water hygiene and Legionella control (L8)',
          'Gas safety and pressure systems',
          'LEV thorough examination and testing',
          'Asbestos management and re-inspection',
          'Lifting equipment examination (LOLER)',
        ],
      },
      {
        heading: `Sectors served across ${city.region}`,
        body: `Sector experience matters where compliance profiles and tolerance for disruption differ sharply.`,
        bullets: city.sectors,
      },
    ],
    capabilities: [
      { name: 'Hard services', description: 'M&E, HVAC, fire systems, plumbing, fabric and lifting equipment.', tag: 'Engineering' },
      { name: 'Soft services', description: 'Cleaning, grounds, security, washrooms, waste and front of house.', tag: 'Support' },
      { name: 'Statutory compliance', description: 'Testing, certification and record-keeping held centrally with a single compliance calendar.', tag: 'Compliance' },
      { name: 'Out-of-hours cover', description: 'Emergency response for contracted sites, by agreed priority band.', tag: 'Response' },
    ],
    faqs: [
      {
        question: 'Can we take individual services rather than the full contract?',
        answer: 'Yes. Single service lines are common where an estate has an existing arrangement it wants to keep. The consolidation argument is worth making, but it is not a precondition.',
      },
      {
        question: 'Do you use your own engineers or subcontractors?',
        answer: 'It varies by service line and location. Rather than claim that every trade is employed in-house, EntireFM confirms the delivery model for each service line at proposal stage so it can be verified rather than taken on trust.',
      },
      {
        question: `Which services are most commonly needed in ${city.name}?`,
        answer: `That follows the building stock. ${city.propertyStock[0]} dominates locally, which tends to weight demand toward the engineering and compliance lines rather than the presentation ones.`,
      },
    ],
    breadcrumbs: baseCrumbs(city, `FM Services ${city.name}`, path),
    relatedRoutes: relatedFor(city, path, registryPaths),
    conversionGoal: `Generate a scoped service enquiry from ${city.name}`,
    verificationRequirements: [
      'No universal self-delivery claim — OPS_SELF_DELIVERY is TO_VERIFY',
      'No facility claimed in a named city',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ASSEMBLY
// ─────────────────────────────────────────────────────────────────────────────

const BUILDERS: Record<string, (c: Tier1City, r: Set<string>) => ContentRecord> = {
  shortForm: buildShortForm,
  headTerm: buildHeadTerm,
  regional: buildRegional,
  areas: buildAreas,
  serviceCatalogue: buildServiceCatalogue,
};

/**
 * Build every Tier 1 record whose path exists in the route registry.
 * A variant is only produced where the legacy URL actually exists — this
 * never invents new routes.
 */
export function buildTier1Records(registryPaths: Set<string>): Record<string, ContentRecord> {
  const out: Record<string, ContentRecord> = {};

  for (const city of Object.values(TIER1_CITIES)) {
    const candidates: Array<[string, keyof typeof BUILDERS]> = [
      [`/fm-${city.slug}`, 'shortForm'],
      [`/facilities-management-${city.slug}`, 'headTerm'],
      [`/${city.slug}-facilities-management`, 'regional'],
      [`/${city.slug}-facilities-management-areas`, 'areas'],
      [`/fm-services-${city.slug}`, 'serviceCatalogue'],
    ];

    for (const [path, builder] of candidates) {
      if (!registryPaths.has(path)) continue;
      out[path] = BUILDERS[builder](city, registryPaths);
    }
  }

  return out;
}
