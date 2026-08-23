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
    dek: 'A question we are asked more often than you would expect — usually by someone who has just been made responsible for it.',
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
        body: 'Facilities managers arrive in the profession by an unusual variety of routes — engineering, property, operations, health and safety, sometimes catering — and their job titles vary as much as their backgrounds. What they share is responsibility for the systems that make a building work together, and for what is often an organisation\'s largest asset after its people.',
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
        body: 'The services inside a facilities management contract are conventionally split in two. Hard services are the physical systems — mechanical and electrical, HVAC, plumbing and drainage, fire systems, building fabric, lifts. They are usually statutory, usually technical, and their failure tends to stop the building. Soft services are the services delivered to the people in it — cleaning, security, grounds, waste, front of house. They rarely close a building, but they are what occupants judge it by.',
      },
      {
        heading: 'Where the definition stops being useful',
        body: 'The categories matter less than the interfaces between them. Most of the expensive failures in facilities management happen in the gap between two suppliers who each believed the other held the certificate: the fire alarm contractor who tests the panel but not the door releases, the cleaning contractor who reports a leak to nobody, the maintenance provider whose asset register does not include the plant the landlord installed. Integration is not a nice-to-have in the definition — it is the entire point of it.',
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
      'A fuller guide to facilities management — the core functions, why it matters commercially, the standards that govern it, and what good practice looks like.',
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
          'Financial control — budget, forecast, and the variance conversation',
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
        body: 'Three questions separate providers quickly. Which parts of this scope do you deliver directly and which do you subcontract — and will you put that in writing? How did you arrive at these response times for this site? And: when a statutory test fails, what happens next, and who owns closing it out? The answers are more revealing than any case study.',
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
        body: 'Hard services are the physical systems of a building — the things that are bolted to it and that stop working. Mechanical and electrical installations, heating and ventilation, plumbing and drainage, fire detection and suppression, building fabric, and lifting equipment.',
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
        body: 'When you read a proposal, look at where the statutory obligations sit. A hard services scope that does not name the testing regimes it covers — fixed wire, emergency lighting, fire alarm, water hygiene, lifting equipment — is not a scope. It is a price.',
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
    dek: 'The systems that keep a building standing, running and legal — and the obligations attached to each of them.',
    published: '2024-07-06',
    updated: REWRITTEN,
    category: 'Guide',
    tags: ['Hard services', 'Compliance', 'Maintenance'],
    imageKey: 'switchgear-inspection',
    sections: [
      {
        body: 'Hard services are the tangible, physical services that maintain a building\'s infrastructure. Unlike soft services, which address how a building is used, hard services address whether it works at all — and most of them carry statutory obligations that do not move when a budget does.',
      },
      {
        heading: 'Building fabric and structure',
        body: 'The upkeep of the structural elements: roofing, cladding, external envelope, doors and windows. Fabric maintenance is the most commonly deferred category in facilities management and the most expensive to defer, because water ingress does not stay a fabric problem — it becomes an electrical problem, then a mould problem, then a business continuity problem.',
      },
      {
        heading: 'Electrical services',
        body: 'Power distribution, lighting, emergency systems and small power. The governing duty is regulation 4(2) of the Electricity at Work Regulations 1989: systems must be maintained, so far as is reasonably practicable, to prevent danger. Fixed wire inspection and testing, reported as an EICR, is how that duty is normally evidenced; the interval comes from IET guidance and risk, not from statute.',
      },
      {
        heading: 'Plumbing, drainage and water systems',
        body: 'Water supply, drainage, and — the part most often underestimated — water hygiene. The Approved Code of Practice L8 requires a written scheme of control for Legionella risk. It sets no monitoring interval; the scheme does. A site running to a generic monthly regime with no written scheme behind it has bought testing, not compliance.',
      },
      {
        heading: 'Heating, ventilation and air conditioning',
        body: 'HVAC covers comfort, air quality and, increasingly, the largest single component of an estate\'s energy bill. Systems containing fluorinated gases carry leak-checking obligations that are genuinely set in law and calculated per system from the CO2 equivalent of the refrigerant charge — one of the few intervals in facilities management that is a legal maximum rather than an industry habit.',
      },
      {
        heading: 'Fire safety systems',
        body: 'Detection, alarms, emergency lighting, extinguishers and suppression. Under the Regulatory Reform (Fire Safety) Order 2005 the Responsible Person must maintain the relevant fire precautions in efficient working order. The familiar intervals — weekly alarm test, monthly emergency lighting function test, annual duration test — come from British Standards, principally BS 5839 and BS 5266, not from the Order itself.',
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
          'Failed tests logged and never closed out — the certificate exists, the remedial does not',
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
      'The commercial case for planned maintenance over reactive repair — what deferring maintenance really costs, and how to tell whether a regime is working.',
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
          'Shortened asset life — plant that should have reached fifteen years failing at nine',
          'Business interruption, which is almost never counted against the maintenance budget that caused it',
          'Compliance exposure, where a missed statutory test becomes an enforcement matter',
          'Insurance and warranty positions weakened by an absent maintenance record',
          'Capital surprises: unplanned replacement is the most expensive way to buy plant',
        ],
      },
      {
        heading: 'Inspection is not the same as maintenance',
        body: 'They are often bundled and they do different jobs. Maintenance is intervention — servicing, replacing, adjusting. Inspection is information — condition, compliance status, remaining life. An estate with good maintenance and poor inspection is well looked after and cannot prove it. An estate with good inspection and poor maintenance knows exactly how bad things are getting.',
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
      'The trades barely change between a warehouse and a clinical building. What changes is what failure costs — and that is what should shape the maintenance plan.',
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
          'The statutory regimes — electrical, fire, water, gas, lifting — apply across sectors',
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
        body: 'A provider working across sectors cannot run one operating model. The value is not in having a model for each — it is in being able to tell quickly which constraints apply to a new site and to reshape the plan around them. Most contracts that go wrong do so because a provider imposed the rhythm that worked on its last client onto an estate that runs differently.',
      },
      {
        heading: 'The question that sets the plan',
        body: 'It is not "what type of building is this". It is "what happens here when something fails". The answer determines the priority bands, the access strategy, the spares policy and the escalation route — and it is a better starting point than any sector label.',
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
      'Facilities management across Birmingham and the wider West Midlands — city-centre offices, industrial estates and the logistics corridor around the motorway network.',
    h1: 'Keeping Birmingham moving',
    dek: 'Why the West Midlands asks more of a maintenance plan than its size alone suggests.',
    published: '2019-09-24',
    updated: REWRITTEN,
    category: 'Locations',
    tags: ['Birmingham', 'West Midlands'],
    imageKey: 'external-distribution-dusk',
    sections: [
      {
        body: 'Birmingham packs an unusual range of building types into a short radius. Grade A city-centre offices, Victorian stock still in commercial use, industrial estates from every decade since the war, and — within twenty minutes of the centre — some of the densest logistics property in the country.',
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
      'Facilities management across Lincoln and Lincolnshire — a dispersed county where honest response times matter more than a headline coverage claim.',
    h1: 'Facilities management in Lincoln and Lincolnshire',
    dek: 'A dispersed county, a long travel geometry, and why that changes what a response time should say.',
    published: '2019-08-21',
    updated: REWRITTEN,
    category: 'Locations',
    tags: ['Lincoln', 'Lincolnshire'],
    imageKey: 'site-arrival',
    sections: [
      {
        body: 'Lincolnshire is the second largest county in England and one of the least densely built. Commercial property is spread across market towns, agricultural and food processing sites, and the city itself — and the distance between them is the defining operational fact.',
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
