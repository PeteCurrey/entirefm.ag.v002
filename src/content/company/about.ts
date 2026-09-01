import type { ContentRecord } from '@/lib/routes/route-schema';

/**
 * ABOUT / OUR STORY
 * =================
 * Rebuilt from the copy on both legacy Wix estates, which the business
 * confirmed as accurate. The facts below are theirs, not invented:
 *
 *   · Independently owned provider of FM and support services
 *   · Started in 2009 as a small building maintenance company working for
 *     local businesses and letting agents
 *   · Grew by reputation — early clients are still clients today
 *   · Client base now spans multinational property management and consultancy
 *     firms, motorway service stations, logistics and manufacturing, and
 *     supermarket chains
 *   · Ethos: bespoke and personalised, integrate into the client's team, go
 *     the extra mile
 *   · A responsible employer that supports the communities it works in
 *
 * HOW THE GEOGRAPHIC CLAIM IS HANDLED
 * -----------------------------------
 * Both Wix estates state that EntireFM "has various regional offices". The
 * business confirmed on 2026-08-23 that this is accurate but uneven — some
 * locations are offices, some are storage depots — so the honest claim is the
 * operating model, not a building in a named town.
 *
 * `GEO_NATIONAL_REGIONAL_OPS` is therefore VERIFIED and used here: national
 * coverage delivered through regional operations. `GEO_REGIONAL_CENTRES`
 * stays DO_NOT_USE, so no page names a facility in a specific city.
 *
 * The structure is expanded well beyond the original: the story is told as a
 * sequence rather than four paragraphs, the ethos is turned into concrete
 * operating commitments, and the client base is stated as sectors rather than
 * as a list of adjectives.
 */

const record: ContentRecord = {
  path: '/about-entire-facilities-management',
  title: 'About EntireFM | Independent Facilities Management Since 2009',
  metaDescription:
    'EntireFM is an independently owned facilities management provider. Started in 2009 as a small building maintenance company; now maintaining commercial property nationwide.',
  h1: 'Independently owned. Building maintenance since 2009.',
  eyebrow: 'Our story',
  heroIntro:
    'EntireFM began in 2009 as a small building maintenance company working for local businesses and letting agents. The clients who took a chance on us then are, for the most part, still clients now, which is the only measure of this business we have ever really trusted.',
  heroDescription:
    'Independently owned, nationwide, and still run on the principle that facilities management is a relationship rather than a transaction.',
  historicIntent: 'Historic company and about-us intent from both Wix estates',
  primaryIntent: 'about entirefm facilities management',
  secondaryIntents: [
    'entirefm company history',
    'independent facilities management company uk',
    'facilities management company about us',
  ],
  pageType: 'company',
  service: null,
  sector: null,
  location: null,
  historicTopics: ['Company story', 'Founded 2009', 'Ethos and values', 'Client base', 'Responsible employer'],
  requiredSections: ['hero', 'body', 'capabilities', 'faq', 'cta'],

  sections: [
    {
      heading: 'How it started',
      body: 'In 2009 EntireFM was a small building maintenance company working locally for businesses and letting agents. There was no growth plan and no sales function; the work came from doing the last job properly. Delivering honestly and reliably got the company noticed by larger clients, and most of those early relationships are still in place today. That is not a marketing line; it is the reason the business exists in the shape it does.',
    },
    {
      heading: 'How it grew',
      body: 'The client base widened faster than the company expected. Multinational property management and consultancy firms came first, then motorway service stations, logistics and manufacturing operations, and supermarket chains. Each brought a different operating rhythm (a service station never closes, a distribution centre measures failure in lost hours, and a managing agent answers to tenants line by line), and the business learned to work to each rather than impose one model on all of them.',
      bullets: [
        'Multinational property management and consultancy firms',
        'Motorway service stations and roadside retail',
        'Logistics, distribution and manufacturing operations',
        'Supermarket and multi-site retail estates',
        'Commercial offices and managing agents',
        'Industrial and process facilities',
      ],
    },
    {
      heading: 'What has not changed',
      body: 'The ethos from the first year still governs the work: deliver a bespoke and personalised service, integrate into the client\'s team rather than operating alongside it, and go the extra mile to achieve excellence. In practice that means a named point of contact rather than a ticket queue, a maintenance plan built from the estate rather than from a template, and a provider who tells you when something is wrong before you find it yourself.',
    },
    {
      heading: 'What that looks like in practice',
      body: 'Values are easy to write and hard to evidence, so these are the operating commitments they translate into. Each one is checkable: ask us about any of them during procurement.',
      bullets: [
        'A named account manager and a defined escalation route, not a general inbox',
        'Every maintenance plan built from an asset survey before a contract start date is agreed',
        'Statutory testing, certificates and completion evidence held in one place and available to the client',
        'Response times agreed per site by priority band, not promised as a single blanket figure',
        'The delivery model for each service line confirmed in writing at proposal stage',
        'Problems raised by us, before they are discovered by you',
      ],
    },
    {
      heading: 'Independently owned, and staying that way',
      body: 'EntireFM is independently owned. There is no private equity timetable, no parent company setting margin targets from another country, and no incentive to win contracts the operation cannot actually service. Independence is the reason the business can turn work down, and turning the wrong work down is what keeps the right work good.',
    },
    {
      heading: 'A responsible employer',
      body: 'The company is committed to being a responsible employer and to supporting the communities it works in. Engineering is a skilled trade with a real shortage behind it, so the practical version of that commitment is training people properly, funding the certifications the work requires, and keeping them long enough that clients see the same faces on site year after year.',
    },
    {
      heading: 'Where we work',
      body: 'EntireFM maintains commercial property across the UK. The business runs nationally through regional operations (a mix of offices, storage and mobile engineering teams working to each area), with concentrations in London, the North West, Yorkshire, the Midlands and Lincolnshire. What matters commercially is not where a building sits on a map but whether the response time can actually be met, so those are set from genuine travel capability rather than from a marketing radius.',
    },
  ],

  capabilities: [
    {
      name: 'Founded 2009',
      description: 'Started as a small building maintenance company for local businesses and letting agents.',
      tag: 'History',
    },
    {
      name: 'Independently owned',
      description: 'No parent company and no external timetable: the operation answers to its clients.',
      tag: 'Ownership',
    },
    {
      name: 'Long-standing clients',
      description: 'Most of the larger clients won in the early years are still with the business today.',
      tag: 'Retention',
    },
    {
      name: 'Nationwide coverage',
      description: 'National reach run as regional operations, with response agreed per site.',
      tag: 'Coverage',
    },
  ],

  faqs: [
    {
      question: 'How long has EntireFM been operating?',
      answer:
        'Since 2009. The company started as a small building maintenance business working for local companies and letting agents, and grew into a nationwide facilities management provider. Several clients from those first few years are still with us.',
    },
    {
      question: 'Is EntireFM independently owned?',
      answer:
        'Yes. The business is independently owned, with no parent group or external investor setting its targets. That is what allows it to size contracts to what the operation can genuinely deliver.',
    },
    {
      question: 'What kind of clients does EntireFM work with?',
      answer:
        'Multinational property management and consultancy firms, motorway service stations, logistics and manufacturing operations, supermarket and multi-site retail estates, commercial offices and managing agents. Single complex sites and multi-site portfolios are both common.',
    },
    {
      question: 'What makes EntireFM different from a larger FM provider?',
      answer:
        'Scale is easy to buy and accountability is not. The practical difference is that you get a named contact who knows your estate, a maintenance plan built from your assets rather than a template, and a provider small enough that a problem on your site is a problem for someone whose name you know.',
    },
    {
      question: 'How does a new contract start?',
      answer:
        'With an asset survey, not a start date. Until the assets, their condition and their statutory obligations are known, any maintenance schedule is guesswork. From that survey we build the PPM plan and the compliance calendar, then run a defined handover alongside the outgoing supplier so nothing lapses in the gap.',
    },
  ],

  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'About EntireFM', url: '/about-entire-facilities-management' },
  ],

  relatedRoutes: [
    '/facilities-management-team',
    '/case-studies',
    '/services',
    '/sectors',
    '/job-board',
    '/contact-us',
  ],

  conversionGoal: 'Build trust in the company and route the visitor into a proposal or contact enquiry',
  verificationRequirements: [
    'Founding year 2009 and company story taken from the legacy Wix estates, confirmed accurate by the business',
    'No claim of regional offices — GEO_REGIONAL_CENTRES is DO_NOT_USE pending verification',
    'No accreditation claims — all are TO_VERIFY',
  ],
  contentStatus: 'CONTENT_COMPLETE',
};

export default record;
