/**
 * BLOG — POST CONTENT
 * ===================
 * WHY THIS FILE EXISTS
 * --------------------
 * Every one of the seventeen blog and post URLs carried over from Wix was
 * serving the same placeholder: an H1 reading "Post/What Is Facilities
 * Management — Facilities Management & Engineering", one section, eighteen
 * words, no date. Seventeen URLs that Google had indexed and that the business
 * says produced traffic, all rendering machine-titleised slugs.
 *
 * That is worse than a 404. A 404 is a clean signal; a thin, near-identical
 * page under a trusted URL is a quality signal, and it applies to the whole
 * site rather than to one page.
 *
 * These articles are rebuilt from the original Wix posts — recovered from the
 * live legacy estate — then substantially rewritten and expanded, with UK
 * spelling and the same standard the Compliance Centre works to: where a
 * requirement is stated, its source is named.
 *
 * DATES
 * -----
 * `published` is the original Wix publication date. `updated` is the day the
 * article was rewritten for this site.
 *
 * Both are true, and that matters. Google already crawled these URLs with
 * their original dates, and freshness in search is driven by `dateModified`,
 * not `datePublished` — so backdating the rewrite or forward-dating the
 * original would gain nothing that `updated` does not already give, while
 * asserting something false about work that genuinely was published in 2019.
 * The long publication history is an asset here, not a liability: it shows a
 * business that has been writing about this for six years.
 *
 * NEAR-DUPLICATE SLUGS
 * --------------------
 * Wix left several artefacts — `-1`, `-1-1` — and on inspection they were not
 * copies: each held a genuinely different article with its own title, date and
 * length. They are rebuilt as different articles for that reason. Where two
 * still measure as near-duplicates, `npm run tiers:generate` holds the weaker
 * one at noindex while it stays a live 200 page.
 */

export interface PostSection {
  heading?: string;
  body?: string;
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  /** Route path. Most are /post/{slug}; a few legacy paths differ. */
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** Standfirst — the paragraph under the headline. */
  dek: string;
  /** ISO date of original publication on the legacy estate. */
  published: string;
  /** ISO date this rewrite was published here. */
  updated: string;
  category: string;
  tags: string[];
  sections: PostSection[];
  /** Internal links that belong at the end of the piece. */
  related: string[];
  imageKey: string;
}

const REWRITTEN = '2026-08-23';

export const BLOG_POSTS: BlogPost[] = [
  /* ── The flagship explainer ───────────────────────────────────────────── */
  {
    slug: 'what-is-facilities-management',
    path: '/post/what-is-facilities-management',
    title: 'What is facilities management?',
    metaTitle: 'What is Facilities Management? | Definition & Scope | EntireFM',
    metaDescription:
      'A plain definition of facilities management, what facilities managers actually do, and where the boundary sits between hard services, soft services and everything else.',
    h1: 'What is facilities management?',
    dek: 'A question we are asked more often than you would expect, usually by someone who has just been made responsible for it.',
    published: '2020-01-05',
    updated: REWRITTEN,
    category: 'Explainer',
    tags: ['Facilities management', 'Hard services', 'Soft services'],
    imageKey: 'switchroom-survey',
    sections: [
      {
        body: 'Facilities management is the work required to keep a building functioning, as distinct from the work the building exists to house. If an activity is not part of what your business actually does, but your business cannot operate without it, it almost certainly falls under facilities management.',
      },
      {
        heading: 'The formal definition, and why it is worth reading twice',
        body: 'ISO 41011 defines facilities management as the "organizational function which integrates people, place and process within the built environment with the purpose of improving the quality of life of people and the productivity of the core business." That is a mouthful, but the important word is *integrates*. Facilities management is not a list of trades. It is the discipline of making a set of unrelated services behave as one, so that the building supports the work rather than interrupting it.',
      },
      {
        heading: 'What a facilities manager actually does',
        body: 'Facilities managers arrive in the profession by an unusual variety of routes (engineering, property, operations, health and safety, sometimes catering), and their job titles vary as much as their backgrounds. What they share is responsibility for the systems that make a building work together, and for what is often an organisation\'s largest asset after its people.',
        bullets: [
          'Occupancy and the human factors of how a space is used',
          'Operations and maintenance, planned and reactive',
          'Statutory compliance, and the evidence that proves it',
          'Risk management, from fire safety to business continuity',
          'Energy, sustainability and the cost of running the estate',
          'Procurement, contract management and supplier performance',
          'Projects, fit-outs and churn',
          'Budgeting, forecasting and the annual argument about capital',
        ],
      },
      {
        heading: 'Hard services and soft services',
        body: 'The services inside a facilities management contract are conventionally split in two. Hard services are the physical systems: mechanical and electrical, HVAC, plumbing and drainage, fire systems, building fabric, lifts. They are usually statutory, usually technical, and their failure tends to stop the building. Soft services are the services delivered to the people in it: cleaning, security, grounds, waste, front of house. They rarely close a building, but they are what occupants judge it by.',
      },
      {
        heading: 'Where the definition stops being useful',
        body: 'The categories matter less than the interfaces between them. Most of the expensive failures in facilities management happen in the gap between two suppliers who each believed the other held the certificate: the fire alarm contractor who tests the panel but not the door releases, the cleaning contractor who reports a leak to nobody, the maintenance provider whose asset register does not include the plant the landlord installed. Integration is not a nice-to-have in the definition; it is the entire point of it.',
      },
      {
        heading: 'Single service, bundled or total FM',
        body: 'Buyers usually meet three models. Single service means contracting each discipline separately and holding the coordination yourself. Bundled means grouping related services under fewer suppliers. Total facilities management places the whole scope with one provider. None is automatically correct: single service gives the most control and the most work, total FM the least work and the most dependence on getting the provider right. What matters is that the model is a deliberate choice rather than an accident of how contracts happened to be let.',
      },
    ],
    related: ['/what-is-facilities-management', '/services', '/hard-services', '/ppm'],
  },

  /* ── The 2024 guide — deeper, more current ────────────────────────────── */
  {
    slug: 'what-is-facilities-management-1',
    path: '/post/what-is-facilities-management-1',
    title: 'A guide to facilities management: functions, importance and practice',
    metaTitle: 'Guide to Facilities Management | Functions & Best Practice | EntireFM',
    metaDescription:
      'A fuller guide to facilities management covering the core functions, why it matters commercially, the standards that govern it, and what good practice looks like.',
    h1: 'A guide to facilities management',
    dek: 'The longer answer: what the function covers, what it is measured on, and what separates a maintenance contract that works from one that merely exists.',
    published: '2024-07-04',
    updated: REWRITTEN,
    category: 'Guide',
    tags: ['Facilities management', 'Standards', 'Procurement'],
    imageKey: 'client-review',
    sections: [
      {
        body: 'If the short answer is "everything a building needs in order to function", the useful answer is a great deal more specific. Facilities management has an international standard, a recognised body of practice, and a set of failure modes that repeat across almost every estate.',
      },
      {
        heading: 'The standards that actually govern it',
        body: 'ISO 41001 sets out the requirements for a facilities management system, and ISO 41011 provides the vocabulary. For maintenance itself, SFG20 is the industry standard library of task schedules in the UK, maintained by the Building Engineering Services Association, and it is what a competent provider builds a planned maintenance regime from. None of these is a legal requirement. All of them are what a buyer should expect to see referenced in a proposal, because the alternative is a schedule someone invented.',
      },
      {
        heading: 'The core functions',
        bullets: [
          'Planned preventative maintenance, built from an asset survey rather than a template',
          'Reactive maintenance, with priority bands agreed per site rather than one blanket response time',
          'Statutory compliance and the record that evidences it',
          'Asset management: knowing what is installed, its condition, and its remaining life',
          'Space and occupancy management',
          'Energy and environmental performance',
          'Supplier and subcontractor management',
          'Financial control: budget, forecast, and the variance conversation',
        ],
      },
      {
        heading: 'Why it matters commercially',
        body: 'Facilities management is usually one of the larger lines in an operating budget and almost always the least examined. That is because its value is mostly negative space: the outage that did not happen, the enforcement notice that was never issued, the plant that reached its design life instead of failing at eight years. Those are difficult to celebrate and easy to cut, which is why reactive spend so often rises quietly in the two years after a planned maintenance budget is reduced.',
      },
      {
        heading: 'What good practice looks like',
        bullets: [
          'An asset register that exists before the contract starts, not six months after',
          'Maintenance tasks referenced to SFG20 or an equivalent recognised basis',
          'Statutory obligations tracked separately from planned maintenance, because they are legally different',
          'Certificates and completion evidence held in one place and available to the client',
          'Reactive jobs categorised by consequence, not by how urgent the caller sounded',
          'A named point of contact with authority, not a ticket queue',
          'Recurring faults visible as a pattern, so they become replacement decisions',
        ],
      },
      {
        heading: 'The questions worth asking a provider',
        body: 'Three questions separate providers quickly. Which parts of this scope do you deliver directly and which do you subcontract, and will you put that in writing? How did you arrive at these response times for this site? And: when a statutory test fails, what happens next, and who owns closing it out? The answers are more revealing than any case study.',
      },
    ],
    related: ['/ppm', '/services', '/compliance', '/contact-us'],
  },

  /* ── Hard services, short original ────────────────────────────────────── */
  {
    slug: 'what-are-hard-services',
    path: '/post/what-are-hard-services',
    title: "What are 'hard services'?",
    metaTitle: "What are Hard Services? | FM Terminology Explained | EntireFM",
    metaDescription:
      'A short definition of hard services in facilities management, what they cover, and why the distinction from soft services affects how a contract is priced.',
    h1: "What are 'hard services'?",
    dek: 'A short answer to a term that appears in every FM proposal and is explained in almost none of them.',
    published: '2020-01-18',
    updated: REWRITTEN,
    category: 'Explainer',
    tags: ['Hard services', 'Terminology'],
    imageKey: 'distribution-board-testing',
    sections: [
      {
        body: 'Hard services are the physical systems of a building: the things that are bolted to it and that stop working. Mechanical and electrical installations, heating and ventilation, plumbing and drainage, fire detection and suppression, building fabric, and lifting equipment.',
      },
      {
        heading: 'Why the distinction exists',
        body: 'It exists because the two halves of a facilities management contract behave completely differently. Hard services are largely statutory, need qualified people, and fail in ways that close buildings. Soft services are largely discretionary, need managed people, and fail in ways that annoy occupants. Pricing them together without distinguishing them produces a number that cannot be interrogated.',
      },
      {
        heading: 'What is usually included',
        bullets: [
          'Mechanical and electrical installations, including fixed wire testing',
          'Heating, ventilation and air conditioning',
          'Plumbing, drainage and water systems',
          'Fire detection, alarms and emergency lighting',
          'Building fabric, roofing and structure',
          'Lifts, hoists and other lifting equipment',
          'Building management systems and controls',
        ],
      },
      {
        heading: 'The practical consequence',
        body: 'When you read a proposal, look at where the statutory obligations sit. A hard services scope that does not name the testing regimes it covers (fixed wire, emergency lighting, fire alarm, water hygiene, lifting equipment) is not a scope. It is a price.',
      },
    ],
    related: ['/hard-services', '/mechanical-electrical', '/compliance'],
  },

  /* ── Hard services, the long guide ────────────────────────────────────── */
  {
    slug: 'what-are-hard-services-in-facilities-management',
    path: '/post/what-are-hard-services-in-facilities-management',
    title: 'Hard services in facilities management: a complete guide',
    metaTitle: 'Hard Services in Facilities Management | Complete Guide | EntireFM',
    metaDescription:
      'What hard services cover, the statutory regimes attached to each, where managing them goes wrong, and the practices that keep a technical estate compliant.',
    h1: 'Hard services in facilities management',
    dek: 'The systems that keep a building standing, running and legal, and the obligations attached to each of them.',
    published: '2024-07-06',
    updated: REWRITTEN,
    category: 'Guide',
    tags: ['Hard services', 'Compliance', 'Maintenance'],
    imageKey: 'switchgear-inspection',
    sections: [
      {
        body: 'Hard services are the tangible, physical services that maintain a building\'s infrastructure. Unlike soft services, which address how a building is used, hard services address whether it works at all, and most of them carry statutory obligations that do not move when a budget does.',
      },
      {
        heading: 'Building fabric and structure',
        body: 'The upkeep of the structural elements: roofing, cladding, external envelope, doors and windows. Fabric maintenance is the most commonly deferred category in facilities management and the most expensive to defer, because water ingress does not stay a fabric problem: it becomes an electrical problem, then a mould problem, then a business continuity problem.',
      },
      {
        heading: 'Electrical services',
        body: 'Power distribution, lighting, emergency systems and small power. The governing duty is regulation 4(2) of the Electricity at Work Regulations 1989: systems must be maintained, so far as is reasonably practicable, to prevent danger. Fixed wire inspection and testing, reported as an EICR, is how that duty is normally evidenced; the interval comes from IET guidance and risk, not from statute.',
      },
      {
        heading: 'Plumbing, drainage and water systems',
        body: 'Water supply, drainage, and (the part most often underestimated) water hygiene. The Approved Code of Practice L8 requires a written scheme of control for Legionella risk. It sets no monitoring interval; the scheme does. A site running to a generic monthly regime with no written scheme behind it has bought testing, not compliance.',
      },
      {
        heading: 'Heating, ventilation and air conditioning',
        body: 'HVAC covers comfort, air quality and, increasingly, the largest single component of an estate\'s energy bill. Systems containing fluorinated gases carry leak-checking obligations that are genuinely set in law and calculated per system from the CO2 equivalent of the refrigerant charge; this is one of the few intervals in facilities management that is a legal maximum rather than an industry habit.',
      },
      {
        heading: 'Fire safety systems',
        body: 'Detection, alarms, emergency lighting, extinguishers and suppression. Under the Regulatory Reform (Fire Safety) Order 2005 the Responsible Person must maintain the relevant fire precautions in efficient working order. The familiar intervals (weekly alarm test, monthly emergency lighting function test, annual duration test) come from British Standards, principally BS 5839 and BS 5266, not from the Order itself.',
      },
      {
        heading: 'Lifts and lifting equipment',
        body: 'Passenger lifts, hoists, gantries and anything else that lifts loads or people. Here the intervals genuinely are statutory: under LOLER 1998, equipment used to lift people requires thorough examination at least every six months, and other lifting equipment at least every twelve.',
      },
      {
        heading: 'Where hard services management goes wrong',
        bullets: [
          'No asset register, so nobody can say what should have been maintained',
          'Statutory testing and planned maintenance treated as one list, when they are legally different obligations',
          'Failed tests logged and never closed out: the certificate exists, but the remedial does not',
          'Intervals inherited from a previous contract with nobody knowing why they were set',
          'Landlord and tenant plant maintained by different suppliers with no shared record',
          'Recurring faults repaired repeatedly instead of being escalated to a replacement decision',
        ],
      },
      {
        heading: 'What good looks like',
        bullets: [
          'A survey before a schedule, and a schedule referenced to SFG20',
          'One compliance calendar covering every statutory regime on the site',
          'Certificates filed against the asset, not against the invoice',
          'Remedial actions tracked to closure with an owner and a date',
          'Condition and remaining life recorded, so capital planning has an evidence base',
        ],
      },
    ],
    related: ['/hard-services', '/mechanical-electrical', '/hvac-contractor', '/compliance', '/ppm'],
  },

  /* ── Maintenance and inspections ──────────────────────────────────────── */
  {
    slug: 'the-importance-of-regular-maintenance-and-inspections',
    path: '/post/the-importance-of-regular-maintenance-and-inspections',
    title: 'Why regular maintenance and inspection actually pays',
    metaTitle: 'Why Regular Maintenance & Inspections Matter | EntireFM',
    metaDescription:
      'The commercial case for planned maintenance over reactive repair: what deferring maintenance really costs, and how to tell whether a regime is working.',
    h1: 'The importance of regular maintenance and inspections',
    dek: 'Planned maintenance is the easiest line to cut and the most expensive one to have cut. Here is where the money actually goes.',
    published: '2024-08-17',
    updated: REWRITTEN,
    category: 'Opinion',
    tags: ['PPM', 'Maintenance', 'Cost'],
    imageKey: 'hvac-plant-deck',
    sections: [
      {
        body: 'Every estate eventually runs the same experiment. Planned maintenance is reduced to protect a budget, nothing goes wrong for several months, and the reduction looks vindicated. The costs arrive later, in a different budget line, and are rarely attributed back.',
      },
      {
        heading: 'What deferring maintenance actually costs',
        bullets: [
          'Reactive call-outs at premium rates, often out of hours, often on the same asset repeatedly',
          'Shortened asset life: plant that should have reached fifteen years failing at nine',
          'Business interruption, which is almost never counted against the maintenance budget that caused it',
          'Compliance exposure, where a missed statutory test becomes an enforcement matter',
          'Insurance and warranty positions weakened by an absent maintenance record',
          'Capital surprises: unplanned replacement is the most expensive way to buy plant',
        ],
      },
      {
        heading: 'Inspection is not the same as maintenance',
        body: 'They are often bundled and they do different jobs. Maintenance is intervention (servicing, replacing, adjusting), whereas inspection is information (condition, compliance status, remaining life). An estate with good maintenance and poor inspection is well looked after and cannot prove it. An estate with good inspection and poor maintenance knows exactly how bad things are getting.',
      },
      {
        heading: 'Setting intervals honestly',
        body: 'Frequencies should come from three inputs: what the law requires, what the recognised standard advises, and what the asset\'s condition and criticality justify. A rooftop condenser on a coastal site does not belong on the same schedule as one in a sheltered plant room, and a schedule that treats them identically is a template rather than a plan.',
      },
      {
        heading: 'How to tell whether a regime is working',
        bullets: [
          'The ratio of planned to reactive spend is moving in the right direction over time',
          'Repeat failures on the same asset are visible and being escalated, not just repaired',
          'Statutory tests are being passed first time more often than they were',
          'Remedial actions have owners and closure dates, and the closure dates are met',
          'The asset register reflects what is actually installed today',
        ],
      },
      {
        heading: 'The honest caveat',
        body: 'Planned maintenance does not eliminate failure and any provider who implies otherwise is overselling. Plant fails, sometimes early and sometimes for reasons no schedule would have caught. What a good regime changes is the proportion: fewer surprises, more of the remaining ones caught while they are still cheap, and a record that shows which assets are telling you something.',
      },
    ],
    related: ['/ppm', '/building-inspecting-testing', '/compliance', '/mechanical-electrical'],
  },

  /* ── Sector agility ───────────────────────────────────────────────────── */
  {
    slug: 'facilities-management-in-different-sectors-similarities-differences-and-the-need-for-agility',
    path: '/post/facilities-management-in-different-sectors-similarities-differences-and-the-need-for-agility',
    title: 'Facilities management across sectors: what changes, and what does not',
    metaTitle: 'FM Across Sectors | Similarities, Differences & Agility | EntireFM',
    metaDescription:
      'The trades barely change between a warehouse and a clinical building. What changes is what failure costs, and that is what should shape the maintenance plan.',
    h1: 'Facilities management in different sectors',
    dek: 'Similarities, differences, and why the same scope of work needs a different plan in each.',
    published: '2024-09-12',
    updated: REWRITTEN,
    category: 'Sectors',
    tags: ['Sectors', 'Risk', 'Service design'],
    imageKey: 'hvac-plantroom-pumps',
    sections: [
      {
        body: 'An air handling unit is an air handling unit. The engineer servicing one in a distribution centre and one in a hospital is doing broadly the same work with the same tools. What differs is everything around it: when the work can happen, what evidence is required afterwards, and what it costs if the unit stops.',
      },
      {
        heading: 'What stays the same',
        bullets: [
          'The statutory regimes (electrical, fire, water, gas, lifting) apply across sectors',
          'The trades and the competencies required to carry them out',
          'The need for an asset register and a maintenance plan built from it',
          'The evidence obligations: a certificate is a certificate wherever it is issued',
        ],
      },
      {
        heading: 'What changes, and by how much',
        bullets: [
          'Access windows: a distribution centre has a shift pattern, a service area has none at all',
          'Consequence of failure: a two-hour outage is a nuisance in a warehouse and an incident in a clinical building',
          'Additional regimes: ventilation validation in healthcare, LEV in manufacturing, catering gas in hospitality',
          'Presentation standards: in retail the public realm is part of the product being sold',
          'Who the client answers to: a managing agent answers to tenants line by line, an operator answers to a regulator',
        ],
      },
      {
        heading: 'Why agility is the actual requirement',
        body: 'A provider working across sectors cannot run one operating model. The value is not in having a model for each; it is in being able to tell quickly which constraints apply to a new site and to reshape the plan around them. Most contracts that go wrong do so because a provider imposed the rhythm that worked on its last client onto an estate that runs differently.',
      },
      {
        heading: 'The question that sets the plan',
        body: 'It is not "what type of building is this". It is "what happens here when something fails". The answer determines the priority bands, the access strategy, the spares policy and the escalation route, which is a better starting point than any sector label.',
      },
    ],
    related: ['/sectors', '/industrial-facilities-management', '/healthcare-facilities-management', '/ppm'],
  },

  /* ── Location news pieces ─────────────────────────────────────────────── */
  {
    slug: 'facilities-management-to-birmingham',
    path: '/post/facilities-management-to-birmingham',
    title: 'Keeping Birmingham moving',
    metaTitle: 'Facilities Management in Birmingham | EntireFM',
    metaDescription:
      'Facilities management across Birmingham and the wider West Midlands: city-centre offices, industrial estates and the logistics corridor around the motorway network.',
    h1: 'Keeping Birmingham moving',
    dek: 'Why the West Midlands asks more of a maintenance plan than its size alone suggests.',
    published: '2019-09-24',
    updated: REWRITTEN,
    category: 'Locations',
    tags: ['Birmingham', 'West Midlands'],
    imageKey: 'external-distribution-dusk',
    sections: [
      {
        body: 'Birmingham packs an unusual range of building types into a short radius. Grade A city-centre offices, Victorian stock still in commercial use, industrial estates from every decade since the war, as well as some of the densest logistics property in the country within twenty minutes of the centre.',
      },
      {
        heading: 'What that means for maintenance',
        body: 'An estate spread across the West Midlands rarely shares an operating rhythm. City-centre offices need work outside trading hours and have restricted vehicle access; the distribution property around the motorway network runs continuously and measures a failed dock leveller in lost hours. A single blanket response time across both is a number that will be wrong in one direction or the other.',
      },
      {
        heading: 'How we work there',
        bullets: [
          'Response times set from genuine travel capability per site, not a radius on a map',
          'City-centre works planned around access and delivery restrictions before they are scheduled',
          'Industrial and logistics maintenance sequenced around production and despatch patterns',
          'One compliance calendar across the estate, whatever the building type',
        ],
      },
      {
        body: 'EntireFM maintains commercial property across Birmingham and the wider West Midlands as part of national coverage delivered through regional operations.',
      },
    ],
    related: ['/facilities-management-birmingham', '/commercial-facilities-management', '/contact-us'],
  },

  {
    slug: 'facilities-management-services-in-lincoln',
    path: '/post/facilities-management-services-in-lincoln',
    title: 'Facilities management in Lincoln and Lincolnshire',
    metaTitle: 'Facilities Management in Lincoln | EntireFM',
    metaDescription:
      'Facilities management across Lincoln and Lincolnshire: a dispersed county where honest response times matter more than a headline coverage claim.',
    h1: 'Facilities management in Lincoln and Lincolnshire',
    dek: 'A dispersed county, a long travel geometry, and why that changes what a response time should say.',
    published: '2019-08-21',
    updated: REWRITTEN,
    category: 'Locations',
    tags: ['Lincoln', 'Lincolnshire'],
    imageKey: 'site-arrival',
    sections: [
      {
        body: 'Lincolnshire is the second largest county in England and one of the least densely built. Commercial property is spread across market towns, agricultural and food processing sites, and the city itself, where the distance between them is the defining operational fact.',
      },
      {
        heading: 'Why coverage claims matter more here',
        body: 'On a dense urban estate, a four-hour response is a scheduling question. In Lincolnshire it is a geography question, and a provider quoting the same figure for Lincoln and for a site forty miles out on the coast is quoting a figure it has not thought about. We set response times per site from genuine travel capability, which sometimes means committing to something less impressive than a competitor and then meeting it.',
      },
      {
        heading: 'The property mix',
        bullets: [
          'Food processing and agricultural sites with their own hygiene and process obligations',
          'Market town retail and commercial premises',
          'Distribution property serving the east coast ports',
          'Public sector and education estates across the county',
        ],
      },
      {
        body: 'EntireFM maintains commercial property across Lincoln and Lincolnshire as part of national coverage delivered through regional operations.',
      },
    ],
    related: ['/facilities-management-lincoln', '/commercial-fm-lincoln', '/contact-us'],
  },

  /* ── 1. AI in Facilities Management in 2026 ───────────────────────────── */
  {
    slug: 'ai-in-facilities-management-2026',
    path: '/post/ai-in-facilities-management-2026',
    title: 'AI in Facilities Management in 2026: What Is Actually Useful?',
    metaTitle: 'AI in Facilities Management 2026: What Is Actually Useful? | EntireFM',
    metaDescription: 'A practical review of AI in commercial building operations in 2026: what delivers immediate ROI, what remains experimental, and what is pure marketing.',
    h1: 'AI in Facilities Management in 2026: What Is Actually Useful?',
    dek: 'Cutting through software vendor hype to assess where machine learning, language models and automation are delivering real operational value across UK commercial property.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'AI & Technology',
    tags: ['AI in FM', 'Smart Buildings', 'CAFM', 'Predictive Maintenance'],
    imageKey: 'chiller-plant-aerial',
    sections: [
      {
        body: 'In 2026, artificial intelligence in facilities management has moved past the initial cycle of inflated expectations. The promise of fully autonomous, self-healing commercial buildings has given way to a much more grounded reality: machine learning delivers high value where high-volume, structured data already exists, but cannot replace physical engineering craftsmanship or statutory legal accountability.',
      },
      {
        heading: 'What is genuinely delivering ROI today',
        body: 'Across UK commercial portfolios, three AI use cases are consistently demonstrating positive returns on investment:',
        bullets: [
          'Helpdesk request triage and entity extraction: Natural language models parsing free-text tenant emails to identify equipment, locations, urgency, and required trade skills within seconds.',
          'Condition-based anomaly detection on critical plant: High-frequency vibration and temperature tracking on primary chillers and pumps that catches mechanical degradation weeks before catastrophic failure.',
          'Document intelligence for statutory certificates: Optical character recognition and entity models extracting expiry dates and C1/C2 remedials from thousands of scanned EICRs, gas safety certificates, and fire risk assessments.',
        ],
      },
      {
        heading: 'What remains immature or over-marketed',
        body: 'Conversely, several widely promoted concepts remain difficult to justify for standard commercial portfolios. Complex 3D digital twins often suffer from rapid data decay when minor tenant alterations occur without updating the spatial model. Similarly, fully autonomous BMS control loops that adjust life-safety ventilation without human engineering sign-off present unacceptable legal and operational risks.',
      },
      {
        heading: 'The prerequisite nobody wants to talk about: Data hygiene',
        body: 'An AI model is only as reliable as the underlying estate data. Organisations attempting to deploy machine learning over fragmented asset registers with duplicate equipment tags and inconsistent maintenance notes inevitably experience high false-positive rates and dispatch errors.',
      },
    ],
    related: [
      '/resources/ai-in-facilities-management',
      '/resources/ai-in-facilities-management/fm-data-readiness',
      '/ppm',
      '/tools/ppm-schedule-builder',
    ],
  },

  /* ── 2. Predictive Maintenance vs PPM ─────────────────────────────────── */
  {
    slug: 'predictive-maintenance-vs-ppm',
    path: '/post/predictive-maintenance-vs-ppm',
    title: 'Predictive Maintenance vs PPM: Does AI Replace Planned Maintenance?',
    metaTitle: 'Predictive Maintenance vs PPM: Does AI Replace Planned Maintenance? | EntireFM',
    metaDescription: 'Why predictive maintenance and condition monitoring enhance planned preventative maintenance rather than eliminating it. Engineering analysis for FM teams.',
    h1: 'Predictive Maintenance vs PPM: Does AI Replace Planned Maintenance?',
    dek: 'Why the debate between planned preventative maintenance and AI predictive monitoring is based on a false dichotomy, and how top estates combine both.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'Maintenance & PPM',
    tags: ['Predictive Maintenance', 'PPM', 'Asset Management', 'Condition Monitoring'],
    imageKey: 'rooftop-plant-night',
    sections: [
      {
        body: 'A common claim in facilities technology marketing is that AI predictive maintenance (PdM) makes Planned Preventative Maintenance (PPM) obsolete. In commercial real estate, this claim collapses upon contact with UK statutory legislation and mechanical reality. Predictive maintenance does not replace PPM; it supercharges intervention timing on high-criticality assets while standard PPM protects life safety and building fabric.',
      },
      {
        heading: 'The fundamental difference in methodology',
        body: 'Preventative maintenance operates on time-based or run-hour intervals, such as servicing an air handling unit every quarter or testing emergency lights every month regardless of perceived condition. Predictive maintenance continuously measures operational variables (vibration spectrums, thermal delta-T, electrical harmonic distortion) to identify the specific onset of physical degradation.',
      },
      {
        heading: 'The statutory barrier to eliminating PPM',
        body: 'Under UK safety law, building duty holders cannot substitute sensor analytics for mandatory physical inspections. The Pressure Systems Safety Regulations 2000, Gas Safety (Installation and Use) Regulations 1998, and Lifting Operations and Lifting Equipment Regulations 1998 (LOLER) explicitly mandate physical examinations by certified competent persons. An AI algorithm cannot legally sign off a statutory compliance record.',
        bullets: [
          'LOLER 1998 mandates thorough examination of passenger lifts every 6 months',
          'BS 5266-1 requires monthly functional testing and annual 3-hour discharge testing for emergency lighting',
          'ACOP L8 requires monthly temperature monitoring at sentinel water outlets',
          'BS 7671 recommends periodic electrical inspection (EICR) every 1 to 5 years depending on premises type',
        ],
      },
      {
        heading: 'The hybrid maintenance model',
        body: 'The most effective commercial strategy uses PPM as the compliance and fabric baseline, while deploying IoT sensors and predictive algorithms selectively on high-capital plant (such as centrifugal chillers, main boiler burners, and primary water pumps), where unexpected failure carries severe financial or operational consequences.',
      },
    ],
    related: [
      '/resources/ai-in-facilities-management/predictive-maintenance',
      '/ppm',
      '/compliance',
      '/tools/ppm-schedule-builder',
    ],
  },

  /* ── 3. Can AI Run an FM Helpdesk? ────────────────────────────────────── */
  {
    slug: 'can-ai-run-an-fm-helpdesk',
    path: '/post/can-ai-run-an-fm-helpdesk',
    title: 'Can AI Run an FM Helpdesk?',
    metaTitle: 'Can AI Run an FM Helpdesk? Automation & Human Safeguards | EntireFM',
    metaDescription: 'Evaluating the reality of AI in FM service desk operations. Ticket intake, classification, trade dispatch, and why human escalations remain essential.',
    h1: 'Can AI Run an FM Helpdesk?',
    dek: 'Examining what automated intake and machine triage can achieve across high-volume service desks, and why human coordinators remain vital for estate safety.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'AI & Technology',
    tags: ['Helpdesk', 'Service Desk', 'Automation', 'CAFM'],
    imageKey: 'switchroom-survey',
    sections: [
      {
        body: 'The facilities management helpdesk is the operational frontline of any commercial estate. Processing hundreds of occupant requests daily (ranging from minor comfort complaints to emergency pipe bursts), helpdesks are prime candidates for AI workflow automation. But can language models and automated routing run an FM helpdesk autonomously?',
      },
      {
        heading: 'Where AI excels in service desk operations',
        body: 'Modern natural language processing (NLP) models dramatically reduce administrative friction in the intake phase:',
        bullets: [
          'Instant entity parsing: Extracting floor numbers, room names, and symptom keywords from unstructured emails without requiring occupants to fill out rigid 12-field forms.',
          'Intelligent ticket deduplication: Grouping 20 simultaneous occupant emails about a single air conditioning fault into a single parent incident, preventing duplicated contractor callouts.',
          'Skill and certification matching: Automatically identifying that a job involves non-domestic gas pipework and filtering dispatch options to Gas Safe registered technicians with commercial endorsements.',
        ],
      },
      {
        heading: 'Why human duty managers remain irreplaceable',
        body: 'Despite advanced automation, human coordinators remain critical for three core reasons: emergency risk recognition, commercial authorisation, and client communication. An occupant reporting a "slight hissing noise in the basement boiler room" might be classified as a minor acoustic complaint by a naive language model, whereas an experienced human coordinator immediately recognises the potential for a catastrophic steam or gas leak and initiates emergency site protocols.',
      },
    ],
    related: [
      '/resources/ai-in-facilities-management/ai-helpdesk-work-orders',
      '/helpdesk',
      '/24-7-fm-support',
      '/resources/ai-in-facilities-management/ai-cafm',
    ],
  },

  /* ── 4. AI Agents in Facilities Management ────────────────────────────── */
  {
    slug: 'ai-agents-in-facilities-management',
    path: '/post/ai-agents-in-facilities-management',
    title: 'AI Agents in FM: What Facilities Managers Need to Know',
    metaTitle: 'AI Agents in FM: What Facilities Managers Need to Know | EntireFM',
    metaDescription: 'What autonomous AI agents actually mean for commercial FM. Multi-step workflows, contractor chasing, compliance audits, and governance controls.',
    h1: 'AI Agents in FM: What Facilities Managers Need to Know',
    dek: 'Moving beyond passive chatbots to understand how goal-directed software agents execute multi-step facilities tasks within defined engineering guardrails.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'AI & Technology',
    tags: ['AI Agents', 'Automation', 'Workflows', 'Technology'],
    imageKey: 'hvac-survey-plantroom',
    sections: [
      {
        body: 'While conversational chatbots answer questions within a single dialog box, AI agents represent a significant evolutionary step in software capability. An AI agent is provided with an operational goal, access to software tools (APIs, databases, email gateways), and the ability to reason through multi-step execution paths to accomplish the objective.',
      },
      {
        heading: 'Practical examples of FM agents in production',
        body: 'Rather than theoretical general intelligence, high-utility FM agents operate in narrow, well-defined operational domains:',
        bullets: [
          'The Compliance Chaser Agent: Monitors contractor accreditation expiry dates, queries external accreditation databases (NICEIC, Gas Safe), and automatically requests updated insurance schedules 30 days prior to lapse.',
          'The Maintenance Bundling Agent: Analyses incoming reactive work orders and identifies opportunities to bundle minor non-urgent repairs with scheduled quarterly PPM visits, eliminating separate travel charges.',
          'The SLA Monitoring Agent: Continuously evaluates engineer GPS locations, travel times, and job complexity to alert dispatchers 60 minutes before an SLA response window breaches.',
        ],
      },
      {
        heading: 'Guardrails: The rules of autonomous engagement',
        body: 'Deploying agents in commercial estate operations requires strict governance. Agents must operate under role-based permissions, financial approval limits (e.g. no autonomous expenditure above £250), and mandatory human-in-the-loop sign-offs for safety-critical asset modifications.',
      },
    ],
    related: [
      '/resources/ai-in-facilities-management/ai-agents',
      '/resources/ai-in-facilities-management/ai-governance',
      '/compliance',
      '/tools/tender-brief',
    ],
  },

  /* ── 5. Asset Data Quality for FM AI ──────────────────────────────────── */
  {
    slug: 'asset-data-quality-for-fm-ai',
    path: '/post/asset-data-quality-for-fm-ai',
    title: 'Why Bad Asset Data Will Break Your FM AI Strategy',
    metaTitle: 'Why Bad Asset Data Will Break Your FM AI Strategy | EntireFM',
    metaDescription: 'How poor asset registers, duplicate tags, and unstructured maintenance logs cause AI models to hallucinate and fail. Data cleaning guide for FM teams.',
    h1: 'Why Bad Asset Data Will Break Your FM AI Strategy',
    dek: 'Why the success of machine learning, automated dispatch and predictive maintenance depends almost entirely on the unglamorous work of asset register hygiene.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'FM Strategy',
    tags: ['Asset Data', 'Asset Register', 'Data Hygiene', 'CAFM'],
    imageKey: 'switchroom-survey',
    sections: [
      {
        body: 'Every major facilities management technology initiative begins with high ambitions, but a significant portion stall or fail during deployment. In the vast majority of cases, the failure is not caused by algorithmic limitations; it is caused by dirty, incomplete, and unstructured asset data in the legacy CAFM.',
      },
      {
        heading: 'The four chronic data problems in commercial estates',
        body: 'When auditing property portfolios across the UK, we routinely encounter four data structural failures:',
        bullets: [
          'Vague asset descriptions: Equipment logged simply as "Pump 1" or "Extract Fan" with no manufacturer, model number, serial code, or duty rating.',
          'Broken spatial hierarchy: Assets assigned to a site without floor, room, or zone mapping, making automated routing impossible for visiting engineers.',
          'Free-text maintenance notes: Ten years of engineer callout logs written in shorthand ("Adjusted belt, running ok") without standardised failure cause codes.',
          'Orphaned plant: Equipment installed during tenant fit-outs that was never added to the landlord asset register or assigned a statutory PPM schedule.',
        ],
      },
      {
        heading: 'How to clean data before buying AI tools',
        body: 'Before investing in advanced analytics, estate managers should conduct a physical asset verification audit: barcode or QR-tag every maintainable asset, establish parent-child relationships between primary plant and terminal units, and align asset naming with standard UK classification conventions such as Uniclass 2015 or SFG20.',
      },
    ],
    related: [
      '/resources/ai-in-facilities-management/fm-data-readiness',
      '/resources/document-vault',
      '/tools/ppm-schedule-builder',
      '/building-walk',
    ],
  },

  /* ── 6. AI and the Future of CAFM ─────────────────────────────────────── */
  {
    slug: 'ai-and-the-future-of-cafm',
    path: '/post/ai-and-the-future-of-cafm',
    title: 'AI + CAFM: What the Next Generation of FM Software Looks Like',
    metaTitle: 'AI + CAFM: Next Generation Facilities Software | EntireFM',
    metaDescription: 'How modern CAFM platforms are shifting from passive record databases to active operational co-pilots. Architecture review and EntireCAFM context.',
    h1: 'AI + CAFM: What the Next Generation of FM Software Looks Like',
    dek: 'How facilities software is transforming from passive record-keeping databases into intelligent operational systems that anticipate bottlenecks and automate workflows.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'AI & Technology',
    tags: ['CAFM', 'Software', 'Automation', 'Technology'],
    imageKey: 'client-review',
    sections: [
      {
        body: 'For three decades, Computer-Aided Facility Management (CAFM) systems have served primarily as digital filing cabinets, storing asset records, logging work order dates, and recording contractor invoices. While effective for historical record-keeping, legacy CAFM platforms require intensive manual data entry and offer minimal operational foresight.',
      },
      {
        heading: 'The shift from passive storage to active assistance',
        body: 'Next-generation AI-powered CAFM systems fundamentally alter this dynamic by introducing active background reasoning:',
        bullets: [
          'Conversational querying: Allowing property managers to ask plain questions ("Which plantrooms have overdue statutory inspections across the North West?") without building complex SQL reports.',
          'Predictive work order generation: Automatically drafting remedial job packages when multiple minor sensor anomalies cluster around a specific mechanical system.',
          'Automated invoice cross-referencing: Matching engineer timesheets, GPS geofence arrival logs, and approved schedule-of-rates to verify contractor invoices before human approval.',
        ],
      },
      {
        heading: 'EntireCAFM: Designed by engineers for real estate operations',
        body: 'At EntireFM, our software strategy focuses on practical field utility rather than abstract complexity. EntireCAFM connects mobile engineering teams, 24/7 helpdesk dispatchers, and estate directors in real time, ensuring complete compliance visibility without administrative overhead.',
      },
    ],
    related: [
      '/resources/ai-in-facilities-management/ai-cafm',
      '/client-login',
      '/helpdesk',
      '/compliance',
    ],
  },

  /* ── 7. Digital Twins in Facilities Management ────────────────────────── */
  {
    slug: 'digital-twins-in-facilities-management',
    path: '/post/digital-twins-in-facilities-management',
    title: 'Digital Twins in Facilities Management: Useful Tool or Expensive Distraction?',
    metaTitle: 'Digital Twins in FM: Useful Tool or Expensive Distraction? | EntireFM',
    metaDescription: 'An objective look at 3D digital twins in commercial building management. Where spatial models deliver ROI and where standard CAFM is superior.',
    h1: 'Digital Twins in Facilities Management: Useful Tool or Expensive Distraction?',
    dek: 'Cutting through the 3D rendering hype to evaluate where building digital twins deliver measurable operational value versus unnecessary capital expense.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'Engineering',
    tags: ['Digital Twins', 'BIM', 'Engineering', 'Smart Buildings'],
    imageKey: 'commercial-facade-angle',
    sections: [
      {
        body: 'Few concepts in proptech generate as much visual excitement as the "Digital Twin": a photorealistic 3D virtual model of a building pulsing with real-time sensor data. However, for many commercial estate directors, digital twin projects have proven to be expensive, difficult to maintain, and disconnected from day-to-day maintenance realities.',
      },
      {
        heading: 'Where digital twins genuinely make financial sense',
        body: 'A digital twin is commercially justified when spatial geometry and complex environmental interactions directly impact operational continuity:',
        bullets: [
          'High-density data centres: Simulating airflow dynamics, thermal hotspots, and server rack power density changes before installing high-draw computing hardware.',
          'Complex industrial & healthcare facilities: Providing remote engineering specialists with exact 3D spatial orientation for hidden valves and medical gas lines prior to entering sterile or hazardous zones.',
          'Building Safety Act Golden Thread compliance: Visually linking physical fire dampers, compartment walls, and cavity barriers to digital inspection certificates in high-risk residential buildings (HRBs).',
        ],
      },
      {
        heading: 'Where standard CAFM architecture is far more cost-effective',
        body: 'For standard commercial offices, industrial warehouses, and retail parks, maintaining a dynamic 3D digital twin is rarely cost-effective. A robust 2D asset register linked to an intelligent CAFM and well-tagged BMS provides 95% of the operational value at a fraction of the setup and maintenance cost.',
      },
    ],
    related: [
      '/resources/ai-in-facilities-management/digital-twins',
      '/building-walk',
      '/case-studies',
      '/resources/ai-in-facilities-management/fm-data-readiness',
    ],
  },

  /* ── 8. 10 Questions to Ask AI FM Software Suppliers ──────────────────── */
  {
    slug: '10-questions-to-ask-ai-fm-software-suppliers',
    path: '/post/10-questions-to-ask-ai-fm-software-suppliers',
    title: '10 Questions to Ask Before Buying AI-Powered FM Software',
    metaTitle: '10 Questions to Ask Before Buying AI FM Software | EntireFM',
    metaDescription: 'A practical procurement checklist for facilities managers evaluating AI software vendors. Data privacy, OT security, model accuracy, and exit rights.',
    h1: '10 Questions to Ask Before Buying AI-Powered FM Software',
    dek: 'Essential procurement questions covering cybersecurity, model training isolation, operational technology safety, and data portability for FM leaders.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'Procurement',
    tags: ['Procurement', 'AI Governance', 'Cybersecurity', 'Software'],
    imageKey: 'switchroom-survey',
    sections: [
      {
        body: 'As artificial intelligence features proliferate across facilities management software, procurement teams face a confusing landscape of vendor claims. Evaluating software requires looking past glossy sales demonstrations to interrogate data residency, cybersecurity protocols, and operational safety boundaries.',
      },
      {
        heading: 'The 10 essential procurement questions',
        body: 'Demand clear, contractual answers to these critical questions before committing to an AI-enabled FM platform:',
        bullets: [
          '1. Is our proprietary building data or tenant communication used to train your multi-tenant models?',
          '2. Where is our data physically hosted, and does the environment comply with UK GDPR and ISO 27001 standards?',
          '3. What cybersecurity controls prevent your cloud software from being used as an attack vector into our building management network (OT)?',
          '4. Does the system have direct write access to building BMS controllers, or does it operate in an advisory / read-only capacity?',
          '5. Can we enforce mandatory human approval gates on high-consequence actions such as contractor dispatch and SLA completion?',
          '6. How does the system prevent language model hallucinations when extracting statutory compliance dates from PDF certificates?',
          '7. Is every algorithmic recommendation and human override recorded in an immutable, exportable audit log?',
          '8. What are the integration prerequisites, and what happens if our asset register has data gaps?',
          '9. If we terminate the contract, in what format will our historical data and trained operational parameters be returned?',
          '10. What is the vendor service level agreement regarding algorithmic uptime and response latency during emergency intake events?',
        ],
      },
    ],
    related: [
      '/resources/ai-in-facilities-management/ai-governance',
      '/tools/tender-brief',
      '/resources/ai-in-facilities-management',
      '/compliance',
    ],
  },

  /* ── 9. What Should Be Included in a Commercial PPM Schedule ─────────── */
  {
    slug: 'what-should-be-included-in-a-commercial-ppm-schedule',
    path: '/post/what-should-be-included-in-a-commercial-ppm-schedule',
    title: 'What Should Be Included in a Commercial PPM Schedule?',
    metaTitle: 'What Should Be Included in a Commercial PPM Schedule? | EntireFM',
    metaDescription: 'A comprehensive guide to structuring a commercial Planned Preventative Maintenance schedule. Mandatory statutory tasks, mechanical plant, and fabric care.',
    h1: 'What Should Be Included in a Commercial PPM Schedule?',
    dek: 'How to build a robust planned maintenance matrix that balances statutory legal obligations, British Standards, manufacturer guidance, and commercial risk.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'Maintenance & PPM',
    tags: ['PPM', 'Compliance', 'Planned Maintenance', 'Building Services'],
    imageKey: 'rooftop-plant-night',
    sections: [
      {
        body: 'A Planned Preventative Maintenance (PPM) schedule is the master operational blueprint for any commercial building. When designed correctly, it ensures statutory compliance, preserves asset capital value, and prevents catastrophic business interruptions. When poorly structured, it wastes budget on unnecessary visits while leaving major compliance liabilities unmanaged.',
      },
      {
        heading: 'The four core pillars of a complete schedule',
        body: 'A professional commercial PPM matrix must encompass four distinct categories of activity:',
        bullets: [
          'Statutory Life-Safety Inspections: Mandatory tasks mandated by UK legislation with strict legal frequencies (e.g. fire alarm weekly call point tests, emergency lighting monthly functional checks, 6-monthly LOLER lift examinations, annual gas safety certificates).',
          'Mechanical & Electrical Plant Servicing: Tasks required by British Standards and manufacturer guidelines to maintain efficiency and warranty (e.g. quarterly HVAC filter inspections, annual boiler combustion efficiency tuning, 5-yearly fixed wire EICR testing).',
          'Water Hygiene & Legionella Control: Ongoing monitoring mandated under HSE ACOP L8 (monthly sentinel temperature logging, quarterly showerhead disinfection, 6-monthly cold water storage tank inspections).',
          'Building Fabric & Envelope Inspections: Proactive checks preventing water ingress and structural decay (semi-annual gutter clearances, annual roof membrane surveys, fire door condition inspections).',
        ],
      },
      {
        heading: 'Structuring tasks by asset criticality',
        body: 'Not all building equipment warrants the same maintenance intensity. Applying an asset criticality matrix ensures high-consequence plant receives comprehensive condition checks while low-criticality, non-statutory items operate under run-to-maintain protocols.',
      },
    ],
    related: [
      '/tools/ppm-schedule-builder',
      '/ppm',
      '/compliance',
      '/facilities-management-glossary',
    ],
  },

  /* ── 10. How to Change FM Provider ───────────────────────────────────── */
  {
    slug: 'how-to-change-facilities-management-provider',
    path: '/post/how-to-change-facilities-management-provider',
    title: 'How to Change Facilities Management Provider Without Disrupting the Estate',
    metaTitle: 'How to Change FM Provider Smoothly | Mobilisation Guide | EntireFM',
    metaDescription: 'A step-by-step roadmap for switching commercial facilities management contractors. TUPE, asset audits, CAFM handover, and compliance continuity.',
    h1: 'How to Change Facilities Management Provider Without Disrupting the Estate',
    dek: 'A practical commercial guide to transitioning facilities contractors smoothly: protecting statutory compliance, managing staff transfers, and verifying asset data.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'FM Strategy',
    tags: ['FM Provider Transition', 'Mobilisation', 'TUPE', 'Procurement'],
    imageKey: 'client-review',
    sections: [
      {
        body: 'Changing facilities management provider is often regarded as a high-risk commercial undertaking. Concerns over service disruption, missed statutory compliance tests during the handover window, and complex staff transfers under TUPE frequently cause property owners to tolerate underperforming incumbents. With a structured mobilisation methodology, transitioning providers can be executed seamlessly.',
      },
      {
        heading: 'The five phases of successful contractor transition',
        body: 'A well-planned FM transition typically requires 60 to 90 days across five structured phases:',
        bullets: [
          '1. Discovery & Contract Baseline (Days 1–15): Formal contract termination notice, establishment of joint transition working groups, and request for complete historical maintenance logs.',
          '2. Asset & Compliance Audit (Days 15–35): Physical on-site surveys by incoming technical engineers to verify equipment operational status and identify missing statutory certificates.',
          '3. People & TUPE Consultation (Days 20–60): Transparent, professional consultation with on-site staff transferring under TUPE regulations, ensuring early buy-in and morale continuity.',
          '4. Systems & CAFM Integration (Days 40–75): Loading verified asset registers into the new CAFM, setting up automated client dashboards, and configuring emergency helpdesk routing.',
          '5. Go-Live & Day One Execution (Day 90+): On-site supervisory presence, emergency contractor inductions, and immediate execution of overdue compliance catch-up tasks.',
        ],
      },
    ],
    related: [
      '/post/fm-contract-mobilisation-checklist',
      '/about-entire-facilities-management',
      '/tools/tender-brief',
      '/compliance',
    ],
  },

  /* ── 11. FM Mobilisation Checklist ───────────────────────────────────── */
  {
    slug: 'fm-contract-mobilisation-checklist',
    path: '/post/fm-contract-mobilisation-checklist',
    title: 'The FM Mobilisation Checklist: What Needs to Happen Before Day One?',
    metaTitle: 'The FM Mobilisation Checklist: Day One Readiness | EntireFM',
    metaDescription: 'A comprehensive operational checklist for facilities management contract mobilisation. Access keys, compliance logs, RAMS, and CAFM onboarding.',
    h1: 'The FM Mobilisation Checklist: What Needs to Happen Before Day One?',
    dek: 'The complete pre-commencement checklist ensuring building operations, health and safety protocols, and statutory compliance are locked down before service starts.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'Procurement',
    tags: ['Mobilisation', 'Checklist', 'Procurement', 'Operations'],
    imageKey: 'switchroom-survey',
    sections: [
      {
        body: 'The success of a long-term facilities management partnership is largely determined during the pre-commencement mobilisation window. Overlooking basic operational details (such as plantroom access keys, lone worker protocols, or asbestos register handovers) creates immediate friction on Day One.',
      },
      {
        heading: 'The Day One operational readiness checklist',
        body: 'Ensure every item below is fully documented and signed off prior to contract commencement:',
        bullets: [
          'Estate Access & Security: Physical master keys, electronic fobs, intruder alarm codes, out-of-hours security contact protocols, and contractor parking arrangements.',
          'Health, Safety & Asbestos: Active Asbestos Management Plan and location register, Legionella Risk Assessment, Fire Risk Assessment, and site-specific emergency evacuation plans.',
          'Statutory Logbooks & Verification: Physical verification of on-site fire logbooks, gas safety inspection records, emergency lighting test sheets, and water hygiene temperature logs.',
          'CAFM & Asset Data: Verified asset register loaded into the CAFM with assigned statutory PPM tasks, SLA response timers, and client escalation contacts.',
          'Subcontractor RAMS & Accreditations: Risk Assessments and Method Statements (RAMS) approved for all specialist sub-contractors (e.g. lift engineers, water treatment specialists).',
        ],
      },
    ],
    related: [
      '/resources/document-vault',
      '/post/how-to-change-facilities-management-provider',
      '/compliance',
      '/helpdesk',
    ],
  },

  /* ── 12. Reactive Maintenance vs Over-Servicing PPM ───────────────────── */
  {
    slug: 'reactive-maintenance-vs-over-servicing-ppm',
    path: '/post/reactive-maintenance-vs-over-servicing-ppm',
    title: 'Reactive Maintenance Is Expensive. But Too Much PPM Can Be Too.',
    metaTitle: 'Reactive vs Over-Servicing PPM: Finding the Balance | EntireFM',
    metaDescription: 'How over-servicing low-risk assets wastes FM budgets while excessive reactive repair causes downtime. Finding the optimal maintenance equilibrium.',
    h1: 'Reactive Maintenance Is Expensive. But Too Much PPM Can Be Too.',
    dek: 'Why commercial facilities management requires balancing the cost of catastrophic failure against the hidden financial waste of over-servicing non-critical assets.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'Maintenance & PPM',
    tags: ['PPM Strategy', 'Cost Optimisation', 'Asset Care', 'Maintenance'],
    imageKey: 'rooftop-plant-night',
    sections: [
      {
        body: 'Every facilities professional knows that purely reactive maintenance is financially unsustainable; emergency callout premiums, out-of-hours labour rates, and expedited parts shipping cost significantly more than planned servicing. However, an equally common yet rarely discussed financial trap is over-servicing: applying exhaustive monthly preventative maintenance to non-critical, easily replaceable assets.',
      },
      {
        heading: 'The risk-criticality framework',
        body: 'To optimise maintenance spend, building assets should be classified into three operational tiers:',
        bullets: [
          'Tier 1: High Criticality / Statutory (Intensive PPM): Plant whose failure threatens life safety, violates UK law, or halts core business operations (fire systems, main chillers, passenger lifts). Must receive rigorous scheduled maintenance.',
          'Tier 2: Medium Criticality (Balanced PPM / Condition-Led): Equipment where failure causes inconvenience or localized discomfort (extract fans, standard split AC units, secondary circulation pumps). Service semi-annually or trigger via basic sensor thresholds.',
          'Tier 3: Low Criticality (Run-to-Failure / Minimal Care): Non-critical assets with minimal replacement cost and zero safety impact (small desk fans, standard internal door closers, non-emergency domestic lighting). Replace reactively upon failure.',
        ],
      },
    ],
    related: [
      '/tools/fm-roi-calculator',
      '/tools/ppm-estimator',
      '/ppm',
      '/mechanical-electrical',
    ],
  },

  /* ── 13. What Is an Asset Register in FM ──────────────────────────────── */
  {
    slug: 'what-is-an-asset-register-in-fm',
    path: '/post/what-is-an-asset-register-in-fm',
    title: 'What Is an Asset Register and Why Does Facilities Management Depend on It?',
    metaTitle: 'What Is an Asset Register in FM? Complete Guide | EntireFM',
    metaDescription: 'Understanding the asset register: structure, hierarchy, naming standards, and lifecycle tracking in commercial facilities management.',
    h1: 'What Is an Asset Register and Why Does Facilities Management Depend on It?',
    dek: 'A foundational look at the single most important document in facilities management, and why building operations stall without an accurate asset inventory.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'FM Strategy',
    tags: ['Asset Register', 'Asset Management', 'CAFM', 'FM Fundamentals'],
    imageKey: 'switchroom-survey',
    sections: [
      {
        body: 'An asset register is the comprehensive, indexed inventory of all physical equipment, building systems, and maintainable fabric elements across a property portfolio. Far more than a simple equipment list, an asset register records technical specifications, spatial locations, maintenance histories, statutory testing requirements, and replacement cost estimates.',
      },
      {
        heading: 'Key data fields every asset record must contain',
        body: 'A robust asset register formatted for modern CAFM platforms should capture:',
        bullets: [
          'Unique Asset Tag ID (e.g. AHU-02-01 with corresponding physical barcode/QR label)',
          'Spatial Hierarchy: Site > Building > Floor > Room / Zone',
          'Equipment Classification: Category, Type, and SFG20 / Uniclass reference',
          'Manufacturer, Model Number, and Serial Code',
          'Design Duty: Airflow m3/s, heating kW, electrical full load current',
          'Installation Date, Warranty Status, and Expected Useful Life (EUL)',
          'Statutory Maintenance Classifications (e.g. F-Gas threshold, Pressure System status)',
        ],
      },
    ],
    related: [
      '/resources/document-vault',
      '/resources/ai-in-facilities-management/fm-data-readiness',
      '/facilities-management-glossary',
      '/tools/ppm-schedule-builder',
    ],
  },

  /* ── 14. Hard FM vs Soft FM Scope Boundaries ──────────────────────────── */
  {
    slug: 'hard-fm-vs-soft-fm-scope-boundaries',
    path: '/post/hard-fm-vs-soft-fm-scope-boundaries',
    title: 'Hard FM vs Soft FM: Where Does One End and the Other Begin?',
    metaTitle: 'Hard FM vs Soft FM: Differences & Interfaces | EntireFM',
    metaDescription: 'A clear guide to the differences between hard facilities management and soft services, and why managing the interface between them prevents costly building failures.',
    h1: 'Hard FM vs Soft FM: Where Does One End and the Other Begin?',
    dek: 'Examining the technical, legal, and operational distinctions between building engineering and workplace services, and why the interface between them matters most.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'FM Strategy',
    tags: ['Hard FM', 'Soft FM', 'FM Scope', 'Total FM'],
    imageKey: 'chiller-plant-aerial',
    sections: [
      {
        body: 'The division of facilities management into "Hard" and "Soft" services is the standard framework used across commercial property procurement. While the distinction appears straightforward on paper, operational grey areas between the two categories frequently lead to neglected maintenance, missed safety hazards, and contractual disputes.',
      },
      {
        heading: 'Defining the boundary',
        body: 'Hard FM covers the physical, immovable building fabric and engineered systems: mechanical, electrical, plumbing, HVAC, fire detection, and structural elements. Soft FM encompasses services provided directly to the human occupants: commercial cleaning, security, grounds maintenance, waste management, and front-of-house concierge.',
      },
      {
        heading: 'The high-risk operational interfaces',
        body: 'The most frequent estate failures occur precisely where hard and soft services overlap:',
        bullets: [
          'Cleaning vs Drainage: Cleaners pouring mop water containing chemical residue into rainwater sumps or failing to report slow-draining gullies before basement flooding occurs.',
          'Security vs Fire Doors: Security guards wedging open fire-rated doors for convenience, invalidating the building Fire Risk Assessment.',
          'Grounds Maintenance vs Building Fabric: Landscaping contractors causing mechanical damage to external cladding panels or blocking low-level air intake louvres with vegetation.',
        ],
      },
    ],
    related: [
      '/hard-services',
      '/commercial-cleaning-services',
      '/facilities-management-glossary',
      '/compliance',
    ],
  },

  /* ── 15. What to Include in a Monthly FM Report ───────────────────────── */
  {
    slug: 'what-to-include-in-a-monthly-fm-report',
    path: '/post/what-to-include-in-a-monthly-fm-report',
    title: 'What Facilities Managers Should Ask for in a Monthly FM Report',
    metaTitle: 'What to Include in a Monthly FM Report | EntireFM',
    metaDescription: 'A practical framework for monthly facilities management reporting. PPM completion rates, statutory compliance logs, reactive SLA trends, and cost forecasting.',
    h1: 'What Facilities Managers Should Ask for in a Monthly FM Report',
    dek: 'How to structure monthly facilities management reporting that provides executive clarity on statutory compliance, contractor performance, and asset risk.',
    published: '2026-08-23',
    updated: '2026-08-23',
    category: 'FM Strategy',
    tags: ['Reporting', 'KPIs', 'Contract Management', 'FM Strategy'],
    imageKey: 'client-review',
    sections: [
      {
        body: 'Monthly facilities management reports are frequently filled with dozens of pages of raw ticket logs and generic charts that obscure rather than clarify estate health. An effective monthly FM report should be concise, data-driven, and focused on four core pillars: compliance assurance, operational performance, commercial spend, and forward risk.',
      },
      {
        heading: 'The five non-negotiable sections of an executive FM report',
        body: 'Every monthly report submitted by your facilities partner should clearly highlight:',
        bullets: [
          '1. Statutory Compliance Dashboard: 100% completion status of mandatory tests (fire, water, gas, electrical, lifts) with explicit tracking of any C1/C2 open remedials.',
          '2. PPM Completion vs Scheduled Target: Percentage of planned maintenance tasks completed on time against the annual master schedule.',
          '3. Reactive Work Order Metrics: Total reactive volume, Mean Time to Respond (MTTR), Mean Time to Repair, and SLA pass rates by priority level.',
          '4. Recurring Asset Failures: Identification of plant items requiring repeated reactive callouts, with root-cause analysis and replacement recommendations.',
          '5. Financial & Spend Tracking: Actual versus contracted budget, approved quotation remedials, and forecasted capital lifecycle expenditure for upcoming quarters.',
        ],
      },
    ],
    related: [
      '/tools/tender-brief',
      '/compliance',
      '/client-login',
      '/about-entire-facilities-management',
    ],
  },
];

/** Variants of the above at the legacy duplicate slugs. */
export const BLOG_VARIANTS: Array<{ path: string; source: string; angleNote: string }> = [
  {
    path: '/post/what-is-facilities-management-1-1',
    source: 'what-is-facilities-management-1',
    angleNote: 'Wix duplicate of the 2024 guide.',
  },
  {
    path: '/post/what-are-hard-services-in-facilities-management-1',
    source: 'what-are-hard-services-in-facilities-management',
    angleNote: 'Wix duplicate of the hard services guide.',
  },
  {
    path: '/post/the-importance-of-regular-maintenance-and-inspections-1',
    source: 'the-importance-of-regular-maintenance-and-inspections',
    angleNote: 'Wix duplicate of the maintenance article.',
  },
];

export const POST_BY_PATH: Record<string, BlogPost> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.path, p])
);

/** Newest first, by original publication date. */
export const POSTS_BY_DATE = [...BLOG_POSTS].sort((a, b) => b.published.localeCompare(a.published));

/** Rough reading time, at 220 words per minute. */
export function readingTime(post: BlogPost): number {
  const words = post.sections.reduce(
    (n, s) => n + (s.body?.split(/\s+/).length ?? 0) + (s.bullets?.join(' ').split(/\s+/).length ?? 0),
    0
  );
  return Math.max(1, Math.round(words / 220));
}
