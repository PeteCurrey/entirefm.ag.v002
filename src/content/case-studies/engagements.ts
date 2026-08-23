/**
 * CASE STUDIES — ENGAGEMENT PROFILES
 * ==================================
 * WHAT THESE ARE, AND WHAT THEY ARE NOT
 * -------------------------------------
 * These are anonymised profiles of the *kinds* of estate EntireFM maintains
 * and how the work is approached on each. They are not client case studies.
 *
 * That distinction is deliberate and it is a constraint, not a style choice:
 *
 *   · The client register marks every client name TO_VERIFY (Permission), so
 *     no client may be identified until permission is on file.
 *   · `STATS_PORTFOLIO_METRICS` is DO_NOT_USE. The previous site carried
 *     "reduced reactive call-outs by 32%", "£47k annual saving", "98% SLA",
 *     "tenant satisfaction up 34%" — none of which was evidenced. Inventing
 *     replacements here would repeat exactly the problem the claim register
 *     exists to stop.
 *
 * So every "outcome" below describes what the *approach* produces, phrased so
 * it is true of the method rather than asserting a measured result for a
 * client who has not agreed to it. Where a number would obviously strengthen
 * the page, its absence is the point: the number has to come from the
 * business with evidence behind it before it can be published.
 *
 * TO TURN ONE OF THESE INTO A REAL CASE STUDY
 * -------------------------------------------
 * Supply: the client name plus written permission to use it, the contract
 * scope, and any figure you can evidence from your own records. Each profile
 * then becomes its own page.
 */

export interface Engagement {
  slug: string;
  /** Sector label shown on the card. */
  sector: string;
  /** Anonymised description of the client — never a name. */
  client: string;
  /** The headline on the card and at the top of the detail panel. */
  title: string;
  /** One sentence, used as the card summary. */
  summary: string;
  /** What the estate is and what makes it awkward. */
  situation: string;
  /** What the work actually involves. */
  approach: string[];
  /** What the approach produces. Method-true, never a claimed client metric. */
  outcome: string;
  /** Service pages relevant to this engagement. */
  services: string[];
  /** Editorial image key for the card and panel. */
  imageKey: string;
}

export const ENGAGEMENTS: Engagement[] = [
  {
    slug: 'motorway-services',
    sector: 'Roadside & Motorway Services',
    client: 'A motorway service area operator',
    title: 'The estate that never closes',
    summary:
      'Catering, retail and forecourt plant on a site with no overnight window and no tolerance for a closed unit.',
    situation:
      'A service area trades continuously. There is no quiet period to work in, no way to take a kitchen offline for a morning, and a failed unit is lost revenue for every hour it stays shut. Gas catering equipment, extraction, refrigeration, forecourt lighting and drainage all sit on the same site with different statutory obligations and different failure consequences.',
    approach: [
      'Asset survey first, so the maintenance plan reflects what is installed rather than a template',
      'Works sequenced around trading patterns rather than around engineer convenience',
      'Catering gas, extraction and interlock testing treated as one system, because that is how it fails',
      'Refrigeration leak checking scheduled against each system\'s CO2 equivalent charge, not a single site interval',
      'Priority bands agreed per asset — a failed fryer and a failed car park light are not the same call',
    ],
    outcome:
      'Statutory testing, certification and job history held in one place, so the operator can evidence compliance for the whole site without assembling it from four suppliers after the fact.',
    services: ['/plumbing-gas', '/hvac-contractor', '/ppm', '/mechanical-electrical'],
    imageKey: 'site-arrival',
  },
  {
    slug: 'logistics-distribution',
    sector: 'Logistics & Distribution',
    client: 'A national distribution operator',
    title: 'Where failure is measured in lost hours',
    summary:
      'Dock levellers, shutters, three-phase power and yard lighting across a large-format site running to a delivery schedule.',
    situation:
      'A distribution centre is a machine with a timetable. A dock leveller out of service does not inconvenience anyone — it removes a bay from the schedule and pushes the backlog downstream for the rest of the shift. The equipment is heavy, in constant use, and largely invisible until it stops.',
    approach: [
      'Loading equipment surveyed and put on a planned regime rather than run to failure',
      'Thorough examination for lifting equipment scheduled to the statutory six and twelve month intervals',
      'High-bay and yard lighting maintained on access-equipment visits rather than piecemeal',
      'Three-phase distribution inspected and tested with the certificate recorded against the asset',
      'Reactive priorities set by what the failure costs, not by how urgent the caller sounds',
    ],
    outcome:
      'Planned attention on the assets that stop the operation, and a record that shows which ones keep coming back — which is what turns a reactive spend into a replacement decision.',
    services: ['/logistics-facilities-management', '/mechanical-electrical', '/ppm'],
    imageKey: 'external-distribution-dusk',
  },
  {
    slug: 'multi-let-offices',
    sector: 'Commercial Offices & Managing Agents',
    client: 'A property management and consultancy firm',
    title: 'Answering to tenants, line by line',
    summary:
      'Multi-tenant estates where response times are written into the lease and the service charge is examined in detail.',
    situation:
      'A managing agent is accountable twice over: to the landlord for the building and to the tenants for the service charge. Every hour of engineering time eventually appears on a schedule someone will question, and common-part presentation is part of the product being let.',
    approach: [
      'A named account manager and a defined escalation route, rather than a general inbox',
      'Planned maintenance and statutory testing on a single calendar the agent can see',
      'Job history and spend reported by site, so service charge questions can be answered with evidence',
      'Common-part works scheduled around occupancy rather than around the engineering rota',
      'The delivery model for each service line confirmed in writing at proposal stage',
    ],
    outcome:
      'The agent can account for what was done, when, and why it cost what it cost — without waiting on a supplier to assemble the answer.',
    services: ['/commercial-facilities-management', '/ppm', '/cleaning-services'],
    imageKey: 'engineers-office-testing',
  },
  {
    slug: 'manufacturing-process',
    sector: 'Manufacturing & Process',
    client: 'A manufacturing operation',
    title: 'Maintenance windows set by production',
    summary:
      'Process plant, LEV, compressed air and high-load distribution, maintained around a production schedule rather than office hours.',
    situation:
      'On a production site the maintenance window is whatever production says it is. Statutory obligations do not move to suit that — LEV thorough examination, pressure systems and electrical testing all have their own intervals — so the plan has to fit both, and the two are frequently in conflict.',
    approach: [
      'Statutory intervals mapped against the production calendar before a schedule is agreed',
      'Shutdown periods used properly: the work that genuinely cannot be done live, planned months out',
      'LEV, pressure systems and lifting equipment tracked as separate statutory regimes, not one bucket',
      'High-level and confined-space cleaning planned with the access equipment it requires',
      'Defects raised with a route to closure, not logged and left',
    ],
    outcome:
      'A maintenance plan that production can actually live with, and a compliance position that does not depend on a shutdown being available at the right moment.',
    services: ['/industrial-facilities-management', '/industrial-cleaning', '/mechanical-electrical'],
    imageKey: 'hvac-plantroom-pumps',
  },
  {
    slug: 'multi-site-retail',
    sector: 'Supermarket & Multi-Site Retail',
    client: 'A supermarket group',
    title: 'The same standard, in ninety places',
    summary:
      'Refrigeration, lighting, fabric and compliance across a dispersed estate where consistency is the hard part.',
    situation:
      'A single store is straightforward. A dispersed estate is a coverage problem: response times have to be honest for the site that is an hour from anywhere, refrigerant obligations differ system by system, and the standard has to be the same in a flagship and in the smallest unit on the list.',
    approach: [
      'Response times set from genuine travel capability per site, not from a marketing radius',
      'Refrigerant leak checking calculated per system from CO2 equivalent charge',
      'One asset register across the estate, so a recurring fault is visible as a pattern',
      'Fabric and presentation works batched by geography to keep travel out of the invoice',
      'Reporting by site, so a regional manager can see their own estate',
    ],
    outcome:
      'Coverage that is described honestly at tender stage rather than discovered afterwards, and an estate-wide view of where the money is actually going.',
    services: ['/retail-facilities-management', '/hvac-contractor', '/building-maintenance'],
    imageKey: 'hvac-cassette-service',
  },
  {
    slug: 'clinical-environments',
    sector: 'Healthcare & Clinical',
    client: 'A healthcare provider',
    title: 'Buildings that cannot have an outage',
    summary:
      'Water hygiene, ventilation validation and electrical resilience where an unplanned failure is an incident, not an inconvenience.',
    situation:
      'A two-hour outage is a nuisance in a warehouse. In a clinical building it is a reportable event. Water systems, ventilation and electrical resilience carry obligations that are both stricter and less forgiving, and the evidence trail matters as much as the work.',
    approach: [
      'Written scheme of control for water systems, with monitoring against it rather than a generic interval',
      'Ventilation validated to its intended performance, not just serviced',
      'Electrical testing and resilience checks planned so no area loses supply unexpectedly',
      'Certification and test results filed against the asset and available to the client',
      'Escalation routes agreed before they are needed',
    ],
    outcome:
      'A compliance position that can be demonstrated on request, and planned work that does not create the outage it was meant to prevent.',
    services: ['/healthcare-facilities-management', '/compliance/legionella-water-hygiene', '/hvac-contractor'],
    imageKey: 'plumbing-booster-set',
  },
];

export const ENGAGEMENT_BY_SLUG: Record<string, Engagement> = Object.fromEntries(
  ENGAGEMENTS.map((e) => [e.slug, e])
);

/**
 * Shown on the lobby. Being explicit about anonymity is better than letting a
 * reader assume these are named references and then notice that none of them
 * is — the second reading is worse for trust than the disclosure.
 */
export const ANONYMITY_NOTE =
  'Client names are withheld. These profiles describe the type of estate and how the work is approached on it; figures are not quoted because we publish only what we can evidence. Named references and contract detail are available under NDA during procurement.';
