/**
 * RECOVERED ORPHAN WIX PAGES
 * ==========================
 * Content records for the 15 legacy URLs that neither Wix sitemap listed, found
 * by extracting Wix's own internal `pageUriSEO` page manifest from the rendered
 * HTML of both estates. See scripts/recover-orphan-wix-pages.js for the method
 * and for the verified exclusions.
 *
 * WHY THESE ARE REAL PAGES AND NOT REDIRECTS
 * ------------------------------------------
 * Several of these are flat forms of a URL that also exists nested —
 * /sheffield alongside /mobile-crane-hire/sheffield, /access-control alongside
 * /mechanical-electrical/access-control. Wix served both. The rule is that a
 * legacy URL keeps its own page, so both forms are built and neither redirects
 * to the other. The flat form is given a different job from the nested one so
 * they are not simply the same page twice: the flat page is written for the
 * short, direct query, the nested page keeps its position in the service
 * hierarchy.
 *
 * The homepage variants (/home, /homeab, /home-1-1, /home-1-1-1) are genuine
 * duplicates of / with no distinct job. They are restored as live 200 pages
 * because they existed, and the indexation tier gate is expected to hold them
 * noindex — which keeps the URL alive and its links flowing without offering
 * four copies of the homepage for indexing.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';

const CRANE_FLEET = [
  'Truck-mounted cranes for restricted-access and street-side lifts',
  'City-centre lifts with traffic management and permit coordination',
  'Rooftop plant lifts, including replacement chillers and AHUs',
  'Contract lift and lift supervision under BS 7121',
  'Appointed person, lift planning and method statements',
  'Out-of-hours and weekend lifting to avoid trading disruption',
];

const base = (r: Partial<ContentRecord> & Pick<ContentRecord, 'path' | 'title' | 'metaDescription' | 'h1' | 'historicIntent' | 'primaryIntent' | 'pageType' | 'conversionGoal'>): ContentRecord =>
  ({
    secondaryIntents: [],
    service: null,
    sector: null,
    location: null,
    historicTopics: [],
    requiredSections: ['hero', 'body', 'cta'],
    relatedRoutes: ['/services', '/contact-us'],
    verificationRequirements: [
      'Legacy Wix URL recovered from the Wix internal page manifest',
      'Must return 200: never redirect, never 404',
      'No claim of physical premises in any city',
    ],
    contentStatus: 'CONTENT_COMPLETE',
    ...r,
  }) as ContentRecord;

export const RECOVERED_PAGES: Record<string, ContentRecord> = {
  // ── Specialist services (flat forms) ──────────────────────────────────────

  '/access-control': base({
    path: '/access-control',
    title: 'Access Control Systems | Installation & Maintenance | EntireFM',
    metaDescription:
      'Commercial access control installation, maintenance and fault response: door entry, fobs, readers, barriers and integration with fire and intruder systems.',
    h1: 'Commercial Access Control Systems',
    eyebrow: 'Electronic security',
    heroIntro:
      'Access control fails quietly until the day it fails loudly: a reader that stops writing to the audit log, a fail-safe door that has quietly become fail-secure, or a leaver whose fob still opens the plant room.',
    heroDescription:
      'EntireFM installs, maintains and repairs commercial access control, and keeps it correctly interfaced with fire detection so egress works when it matters.',
    historicIntent: 'Historic access control service intent from the Wix estate',
    primaryIntent: 'commercial access control systems',
    secondaryIntents: ['access control installation', 'door entry system maintenance', 'access control repair'],
    pageType: 'service',
    service: 'Access Control',
    historicTopics: ['Access control', 'Door entry', 'Electronic security'],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta'],
    sections: [
      {
        heading: 'What we install and maintain',
        body: 'Access control is rarely a single product. Most commercial estates run several generations of hardware at once, and the maintenance problem is usually integration rather than any one device.',
        bullets: [
          'Proximity, fob and card reader systems',
          'Door entry, intercom and video entry',
          'Electronic locking: maglocks, strikes and motorised locks',
          'Barrier, gate and vehicle access control',
          'Integration with fire alarm systems for fail-safe release',
          'Access rights administration, audit logs and leaver management',
        ],
      },
      {
        heading: 'The fire interface is the part that gets missed',
        body: 'Every electronically locked door on an escape route must release on fire alarm activation. That interface is tested far less often than the alarm itself, and it is the single most common defect found on access control surveys. It is a life-safety issue, not a maintenance preference.',
      },
      {
        heading: 'Leaver management is a security control, not admin',
        body: 'Access rights that outlive employment are one of the most common findings in commercial security audits. Where EntireFM holds the maintenance contract, credential removal can be built into the service rather than left to whoever remembers.',
      },
    ],
    capabilities: [
      { name: 'Installation and upgrade', description: 'New systems and staged replacement of ageing hardware without losing site security during changeover.', tag: 'Install' },
      { name: 'Planned maintenance', description: 'Scheduled testing of readers, locks, power supplies, batteries and fire interfaces.', tag: 'PPM' },
      { name: 'Reactive repair', description: 'Response to lock, reader, controller and power failures, including doors failing insecure.', tag: 'Reactive' },
      { name: 'Fire interface testing', description: 'Verification that every locked escape route door releases on alarm activation.', tag: 'Life safety' },
    ],
    faqs: [
      { question: 'How often should access control be serviced?', answer: 'Typically twice a year for a commercial system, with the fire interface tested at least as often as the fire alarm. Frequency should follow risk and usage; a high-traffic entrance and a rarely used plant room door do not need the same interval.' },
      { question: 'Can you maintain a system you did not install?', answer: 'Yes, and that is the usual case. The first visit is a survey: what is installed, what condition it is in, whether the fire interface works, and whether the access rights on the system still match the people who should have them.' },
      { question: 'What happens if a door fails insecure?', answer: 'It is treated as an emergency. A door that will not lock is a security breach in progress, and it carries a different response priority from a door that will not open on a fob.' },
    ],
    relatedRoutes: ['/mechanical-electrical/access-control', '/security-services', '/gates-barriers', '/fire-emergency-systems', '/mechanical-electrical'],
    conversionGoal: 'Generate an access control survey, maintenance or repair enquiry',
  }),

  '/emergency-light-testing': base({
    path: '/emergency-light-testing',
    title: 'Emergency Lighting Testing | Monthly & Annual | EntireFM',
    metaDescription:
      'Emergency lighting testing to BS 5266: monthly function tests, annual 3-hour duration tests, certification, remedial repairs and a compliant logbook.',
    h1: 'Emergency Lighting Testing and Certification',
    eyebrow: 'Statutory testing',
    heroIntro:
      'Emergency lighting is one of the few compliance obligations where the evidence matters as much as the equipment: an untested luminaire and an untested record are treated the same way after an incident.',
    heroDescription:
      'EntireFM carries out monthly function testing and annual full-duration testing to BS 5266, with certification, defect reporting and remedial repair under one contract.',
    historicIntent: 'Historic emergency lighting testing intent from the Wix estate',
    primaryIntent: 'emergency lighting testing',
    secondaryIntents: ['emergency light testing', 'BS 5266 testing', 'emergency lighting certificate', 'emergency lighting compliance'],
    pageType: 'service',
    service: 'Emergency Lighting',
    historicTopics: ['Emergency lighting', 'BS 5266', 'Statutory testing'],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta'],
    sections: [
      {
        heading: 'What the testing regime actually requires',
        body: 'BS 5266 sets two routine tests. Both must be recorded, and the record is what an enforcing authority asks for first.',
        bullets: [
          'Monthly: a short function test confirming every luminaire illuminates on loss of supply',
          'Annual: a full-duration test (normally three hours) proving the battery holds up for its rated period',
          'Both recorded in the emergency lighting logbook with defects and remedial action noted',
          'Certification issued on completion, with any non-compliance stated plainly',
        ],
      },
      {
        heading: 'The annual test is where systems fail',
        body: 'A monthly flick test proves a lamp lights. It proves nothing about the battery. Batteries degrade steadily and typically need replacement every four to five years, so a system that passes every monthly test can still fail at forty minutes into a three-hour test. That is why the duration test cannot be skipped or shortened.',
      },
      {
        heading: 'Testing has to be planned around occupancy',
        body: 'A full-duration test leaves the system with no charge until it recovers, so it should not be run immediately before a high-occupancy period. In practice that means scheduling around trading hours, events and shift patterns rather than at the engineer’s convenience.',
      },
    ],
    capabilities: [
      { name: 'Monthly function testing', description: 'Routine short-duration testing across all luminaires, recorded in the logbook.', tag: 'Monthly' },
      { name: 'Annual duration testing', description: 'Full three-hour discharge test proving rated battery performance.', tag: 'Annual' },
      { name: 'Certification and records', description: 'Compliant certification and a maintained logbook that stands up to inspection.', tag: 'Evidence' },
      { name: 'Remedial repair', description: 'Failed luminaires, batteries and drivers replaced under the same contract.', tag: 'Remedial' },
    ],
    faqs: [
      { question: 'How often must emergency lighting be tested?', answer: 'Monthly function tests and an annual full-duration test, under BS 5266. The monthly test is brief; the annual test runs for the full rated duration, normally three hours.' },
      { question: 'Who is responsible for emergency lighting testing?', answer: 'The Responsible Person under the Regulatory Reform (Fire Safety) Order (in most commercial buildings the employer, owner or occupier). Testing can be delegated to a contractor, but the duty cannot.' },
      { question: 'What happens if a luminaire fails the test?', answer: 'It is recorded as a defect and repaired. A failed test is not itself a compliance breach; an unrecorded or unactioned failure is.' },
      { question: 'Do self-testing systems remove the need for this?', answer: 'They reduce the labour but not the duty. Automatic test systems still need the results reviewed, recorded and acted on, and the hardware itself still needs maintaining.' },
    ],
    relatedRoutes: ['/mechanical-electrical/emergency-light-testing', '/fire-emergency-systems', '/safety-critical-emergency-systems', '/mechanical-electrical', '/ppm'],
    conversionGoal: 'Generate an emergency lighting testing contract enquiry',
  }),

  '/truck-mount-crane-hire': base({
    path: '/truck-mount-crane-hire',
    title: 'Truck Mount Crane Hire | Contract Lifts | EntireFM',
    metaDescription:
      'Truck-mounted crane hire for restricted-access and street-side lifts, covering rooftop plant, contract lifts under BS 7121, appointed person and lift planning.',
    h1: 'Truck Mount Crane Hire',
    eyebrow: 'Lifting operations',
    heroIntro:
      'Truck-mounted cranes exist for the lifts that a conventional crane cannot reach, such as tight street frontages, restricted yards, and rooftop plant replacement where the only viable set-up point is the public highway.',
    heroDescription:
      'EntireFM provides truck-mounted crane hire with lift planning, appointed person and traffic management, most often for plant replacement on occupied commercial buildings.',
    historicIntent: 'Historic truck mount crane hire intent from the Wix estate',
    primaryIntent: 'truck mount crane hire',
    secondaryIntents: ['lorry loader crane hire', 'contract lift', 'rooftop plant lift', 'crane hire for plant replacement'],
    pageType: 'service',
    service: 'Crane Hire',
    historicTopics: ['Truck mounted crane hire', 'Contract lifts', 'Plant replacement'],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta'],
    sections: [
      { heading: 'What we lift', body: 'Most work is plant replacement on buildings that stay occupied throughout, which makes planning and timing as important as the lift itself.', bullets: CRANE_FLEET },
      {
        heading: 'Contract lift or crane hire',
        body: 'On a contract lift the crane provider plans the lift, supplies the appointed person and carries responsibility for the lifting operation. On a basic crane hire the client holds that duty. For most commercial clients replacing rooftop plant, a contract lift is the appropriate arrangement; if a provider does not raise the distinction before quoting, that is worth noticing.',
      },
      {
        heading: 'The permits usually set the programme',
        body: 'Street-side lifts need road closures, parking suspensions or highway licences, and those lead times are longer than the lift takes. Booking the crane before the permits is the most common cause of a postponed lift.',
      },
    ],
    capabilities: [
      { name: 'Contract lifts', description: 'Full lift planning, appointed person and supervision under BS 7121.', tag: 'BS 7121' },
      { name: 'Restricted access', description: 'Truck-mounted plant for street frontages and yards a conventional crane cannot use.', tag: 'Access' },
      { name: 'Rooftop plant replacement', description: 'Chiller, AHU and condenser lifts on occupied commercial buildings.', tag: 'Plant' },
      { name: 'Traffic management', description: 'Road closures, parking suspensions and highway permits arranged as part of the job.', tag: 'Permits' },
    ],
    faqs: [
      { question: 'What is the difference between a contract lift and crane hire?', answer: 'On a contract lift the provider plans and supervises the operation and carries the duty holder responsibility. On crane hire the client does. Most commercial plant replacement should be a contract lift.' },
      { question: 'How much notice do you need?', answer: 'The crane itself can often be arranged quickly; the permits cannot. Where a road closure or parking suspension is needed, allow several weeks.' },
      { question: 'Can you lift over an occupied building?', answer: 'Lifting over occupied areas is avoided wherever the geometry allows. Where it cannot be, the lift plan defines exclusion zones and the timing is set so the area beneath is empty.' },
    ],
    relatedRoutes: ['/mobile-crane-hire/truck-mount-crane-hire', '/mobile-crane-hire', '/working-at-heights', '/hvac-contractor', '/mechanical-electrical'],
    conversionGoal: 'Generate a crane hire or contract lift enquiry',
  }),

  '/sheffield': base({
    path: '/sheffield',
    title: 'Crane Hire Sheffield | Contract Lifts | EntireFM',
    metaDescription:
      'Crane hire in Sheffield for rooftop plant replacement and restricted-access lifts, including contract lifts, appointed person, lift planning and traffic management.',
    h1: 'Crane Hire in Sheffield',
    eyebrow: 'Lifting operations',
    heroIntro:
      'Sheffield’s gradients and constrained industrial access roads make crane positioning a real planning problem rather than a formality: the set-up point often decides whether a lift is possible at all.',
    heroDescription:
      'Truck-mounted and mobile crane hire across Sheffield and South Yorkshire, most often for rooftop plant replacement on occupied commercial and industrial buildings.',
    historicIntent: 'Historic Sheffield crane hire intent from the Wix estate',
    primaryIntent: 'crane hire sheffield',
    secondaryIntents: ['contract lift sheffield', 'mobile crane hire sheffield', 'plant lift sheffield'],
    pageType: 'geographic-service',
    service: 'Crane Hire',
    location: 'Sheffield',
    historicTopics: ['Crane hire Sheffield', 'Contract lifts', 'Plant replacement'],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta'],
    sections: [
      { heading: 'Lifting services across Sheffield', body: 'Work across the city centre, the Lower Don Valley industrial corridor and the Advanced Manufacturing Park.', bullets: CRANE_FLEET },
      {
        heading: 'Sheffield-specific constraints',
        body: 'Gradient is the recurring issue. Crane set-up needs level, load-bearing ground, and a great many Sheffield sites have neither immediately adjacent to the lift point. Older Lower Don Valley industrial buildings also frequently have unknown roof loadings and legacy structures, which needs establishing before a plant lift is planned rather than discovered on the day.',
      },
      { heading: 'Contract lift or crane hire', body: 'For plant replacement on an occupied building, a contract lift (where EntireFM plans the lift and supplies the appointed person) is normally the correct arrangement. Basic crane hire leaves that duty with the client.' },
    ],
    capabilities: [
      { name: 'Contract lifts', description: 'Lift planning, appointed person and supervision under BS 7121 across Sheffield.', tag: 'BS 7121' },
      { name: 'Industrial site lifts', description: 'Lifting on Lower Don Valley and Attercliffe industrial sites with constrained access.', tag: 'Industrial' },
      { name: 'Rooftop plant replacement', description: 'Chiller, AHU and condenser replacement on occupied buildings.', tag: 'Plant' },
      { name: 'Traffic management', description: 'Road closures and permits arranged with Sheffield City Council as part of the job.', tag: 'Permits' },
    ],
    faqs: [
      { question: 'Do you cover the whole of South Yorkshire?', answer: 'Yes: Sheffield, Rotherham, Barnsley and Doncaster, extending to Chesterfield and the north Derbyshire border.' },
      { question: 'What do you need to know before quoting a lift?', answer: 'Weight and dimensions of the load, where it is going, what the crane can stand on, and what is between the two. A site visit usually settles all four faster than an exchange of emails.' },
      { question: 'How far ahead should a lift be booked?', answer: 'Where a road closure or parking suspension is required, allow several weeks, as the permit lead time (not crane availability) normally sets the date.' },
    ],
    relatedRoutes: ['/mobile-crane-hire/sheffield', '/mobile-crane-hire', '/truck-mount-crane-hire', '/fm-sheffield', '/facilities-management-sheffield'],
    conversionGoal: 'Generate a Sheffield crane hire or contract lift enquiry',
  }),

  '/chesterfield': base({
    path: '/chesterfield',
    title: 'Crane Hire Chesterfield | Contract Lifts | EntireFM',
    metaDescription:
      'Crane hire in Chesterfield and north Derbyshire, providing contract lifts, rooftop plant replacement, restricted-access lifting, appointed person and lift planning.',
    h1: 'Crane Hire in Chesterfield',
    eyebrow: 'Lifting operations',
    heroIntro:
      'Chesterfield sits between the Sheffield industrial corridor and the Derbyshire county road network, which makes it a practical base for lifting work across both, as well as a genuinely challenging town centre to lift in.',
    heroDescription:
      'Truck-mounted and mobile crane hire across Chesterfield and north Derbyshire, for plant replacement, industrial lifting and restricted-access work.',
    historicIntent: 'Historic Chesterfield crane hire intent from the Wix estate',
    primaryIntent: 'crane hire chesterfield',
    secondaryIntents: ['contract lift chesterfield', 'mobile crane hire derbyshire', 'plant lift chesterfield'],
    pageType: 'geographic-service',
    service: 'Crane Hire',
    location: 'Chesterfield',
    historicTopics: ['Crane hire Chesterfield', 'Contract lifts', 'North Derbyshire'],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta'],
    sections: [
      { heading: 'Lifting services across Chesterfield', body: 'Covering the town centre, the surrounding industrial estates and the wider north Derbyshire area.', bullets: CRANE_FLEET },
      {
        heading: 'Chesterfield-specific constraints',
        body: 'The historic town centre has narrow approaches and a conservation area around the parish church, which limits crane size and set-up options close to the core. Outside the centre the constraint reverses: the industrial estates have space, but the rural approach roads to sites further into Derbyshire restrict vehicle size and add real travel time to an emergency lift.',
      },
      { heading: 'Contract lift or crane hire', body: 'For plant replacement on an occupied building a contract lift is normally correct, with EntireFM planning the lift and supplying the appointed person under BS 7121.' },
    ],
    capabilities: [
      { name: 'Contract lifts', description: 'Lift planning, appointed person and supervision under BS 7121.', tag: 'BS 7121' },
      { name: 'Restricted town-centre access', description: 'Truck-mounted plant for narrow approaches and conservation-area constraints.', tag: 'Access' },
      { name: 'Industrial estate lifting', description: 'Plant and equipment lifts across Chesterfield’s industrial sites.', tag: 'Industrial' },
      { name: 'North Derbyshire coverage', description: 'Lifting across the wider county, priced honestly for travel.', tag: 'Coverage' },
    ],
    faqs: [
      { question: 'What areas do you cover from Chesterfield?', answer: 'Chesterfield, north Derbyshire and the Sheffield and Rotherham corridor. Sites further into rural Derbyshire are covered, with travel reflected in the response time rather than absorbed into an unrealistic figure.' },
      { question: 'Can you lift in the town centre conservation area?', answer: 'Yes, with planning. Crane size and set-up position are constrained there, so a site visit before quoting is worth the time it takes.' },
      { question: 'Is a contract lift more expensive?', answer: 'It costs more than bare crane hire because it includes the planning, the appointed person and the responsibility. For an occupied commercial building it is usually the appropriate arrangement rather than an upsell.' },
    ],
    relatedRoutes: ['/mobile-crane-hire/chesterfield', '/mobile-crane-hire', '/truck-mount-crane-hire', '/fm-chesterfield', '/facilities-management-chesterfield'],
    conversionGoal: 'Generate a Chesterfield crane hire or contract lift enquiry',
  }),

  // ── Sector / index pages ─────────────────────────────────────────────────

  '/arena-facilities-management-1': base({
    path: '/arena-facilities-management-1',
    title: 'Arena & Venue Facilities Management | EntireFM',
    metaDescription:
      'Facilities management for arenas and live venues, covering event-day readiness, overnight turnarounds, crowd-load plant, and maintenance that fits an immovable calendar.',
    h1: 'Arena and Live Venue Facilities Management',
    eyebrow: 'Sector',
    heroIntro:
      'An arena cannot move its event date. That single fact changes every maintenance decision: work happens in the gaps between events, or it does not happen at all.',
    heroDescription:
      'EntireFM maintains arenas and live venues around the event calendar, with overnight turnarounds, event-day standby cover and planned work scheduled into dark periods.',
    historicIntent: 'Historic arena facilities management intent from the Wix estate',
    primaryIntent: 'arena facilities management',
    secondaryIntents: ['venue facilities management', 'stadium facilities management', 'event venue maintenance'],
    pageType: 'sector',
    sector: 'Arenas and venues',
    historicTopics: ['Arena FM', 'Venue maintenance', 'Event-day operations'],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta'],
    sections: [
      {
        heading: 'Maintenance runs on the event calendar',
        body: 'Planned maintenance in a venue is scheduled backwards from the fixture list. Dark periods are short and heavily contested between FM, production and cleaning, so PPM that assumes ordinary access windows will simply not be delivered.',
      },
      {
        heading: 'Plant is sized for peak, not average',
        body: 'Ventilation, cooling and drainage in a venue are sized for a full house. They spend most of their life lightly loaded and are then asked for everything on a handful of nights, which is a demanding duty cycle and an unforgiving one: a fault that never shows at low load appears at capacity, with an audience in the building.',
      },
      {
        heading: 'Event-day cover is a different service',
        body: 'Standby engineering during an event is not reactive maintenance with a faster clock. It means having the right trades already on site, knowing the escalation route, and being able to make a safe call quickly about whether a fault stops the show.',
      },
    ],
    capabilities: [
      { name: 'Event-day standby', description: 'On-site engineering cover during events, with defined escalation and decision authority.', tag: 'Event day' },
      { name: 'Overnight turnarounds', description: 'Maintenance and repair delivered in the hours between events.', tag: 'Turnaround' },
      { name: 'Peak-load plant care', description: 'Ventilation, cooling and drainage maintained for capacity performance, not average load.', tag: 'Plant' },
      { name: 'Statutory compliance', description: 'Fire systems, emergency lighting, egress and lifting equipment kept current across the venue.', tag: 'Compliance' },
    ],
    faqs: [
      { question: 'Can maintenance be done without closing the venue?', answer: 'Most of it, yes: scheduled into dark periods and overnight windows. Work that genuinely needs the building empty is planned into the calendar months ahead rather than requested at short notice.' },
      { question: 'Do you provide engineers during events?', answer: 'Yes. Event-day standby is arranged per event or as a standing arrangement across a season, depending on the venue’s pattern.' },
      { question: 'How is compliance handled with such a compressed schedule?', answer: 'By treating statutory testing as fixed and everything else as flexible. Compliance dates go into the calendar first; discretionary work fills the remaining windows.' },
    ],
    relatedRoutes: ['/arena-facilities-management', '/sport-centre-facilities-management', '/hotel-facilities-management', '/sectors', '/ppm'],
    conversionGoal: 'Generate an arena or venue FM enquiry',
  }),

  '/facilities-management-industries': base({
    path: '/facilities-management-industries',
    title: 'Facilities Management by Industry | Sectors | EntireFM',
    metaDescription:
      'Facilities management by industry: industrial, logistics, retail, healthcare, education, hospitality, aviation and commercial property, each with its own compliance profile.',
    h1: 'Facilities Management by Industry',
    eyebrow: 'Sector index',
    heroIntro:
      'Sector experience matters where it changes the compliance profile and the tolerance for disruption. In a warehouse a two-hour outage is a nuisance; in a clinical environment it is an incident.',
    heroDescription:
      'An index of the industries EntireFM works in, and what tends to drive the maintenance requirement in each.',
    historicIntent: 'Historic sector index intent from the Wix estate',
    primaryIntent: 'facilities management industries',
    secondaryIntents: ['facilities management sectors', 'fm by industry', 'industry facilities management'],
    pageType: 'sector',
    historicTopics: ['Sector index', 'Industries served'],
    requiredSections: ['hero', 'body', 'cta'],
    sections: [
      {
        heading: 'Industries we work in',
        body: 'Each sector below brings a different balance of compliance exposure, operating hours and consequence of failure.',
        bullets: [
          'Industrial and manufacturing: process plant, LEV, high-load power, production-shift maintenance windows',
          'Logistics and warehousing: dock levellers, shutters, yard lighting, 24-hour operation',
          'Retail and shopping centres: public realm, trading hours, presentation standards',
          'Healthcare and clinical: infection control, ventilation validation, continuous operation',
          'Education: vacation turnaround, safeguarding, statutory testing at scale',
          'Hospitality and hotels: guest experience, out-of-hours working, water hygiene',
          'Aviation and transport: security clearance, airside constraints, timetable-driven access',
          'Commercial offices: service-charge scrutiny, multi-tenant access, EPC and MEES obligations',
        ],
      },
      {
        heading: 'What changes between sectors',
        body: 'The trades are broadly the same. What changes is the maintenance window, the evidence required, the consequence of a failure, and who has to be satisfied that the work was done properly. A logistics operator measures FM in production hours; a hospital estates team measures it in validated ventilation performance and infection risk.',
      },
    ],
    relatedRoutes: ['/sectors', '/industrial-facilities-management', '/logistics-facilities-management', '/retail-facilities-management', '/healthcare-facilities-management', '/education-facilities-management'],
    conversionGoal: 'Route the visitor to the relevant sector page and generate a sector-specific enquiry',
  }),

  '/facilities-management-glossary': base({
    path: '/facilities-management-glossary',
    title: 'Facilities Management Glossary | FM Terms Explained | EntireFM',
    metaDescription:
      'A plain-English glossary of facilities management terms: PPM, SFG20, L8, LOLER, SLA, NTE, CAFM, hard and soft services, and what each actually means in practice.',
    h1: 'Facilities Management Glossary',
    eyebrow: 'Reference',
    heroIntro:
      'FM runs on abbreviations, and most of them are used loosely. This glossary gives the plain meaning of the terms that appear in contracts, tenders and compliance records.',
    heroDescription:
      'Written for property and operations managers who have to read an FM proposal and work out what is actually being offered.',
    historicIntent: 'Historic FM glossary reference intent from the Wix estate',
    primaryIntent: 'facilities management glossary',
    secondaryIntents: ['fm terms explained', 'facilities management definitions', 'what does PPM mean'],
    pageType: 'post',
    historicTopics: ['FM glossary', 'Terminology', 'Definitions'],
    requiredSections: ['hero', 'body', 'cta'],
    sections: [
      {
        heading: 'Contract and commercial terms',
        body: 'The terms that decide what you are actually buying.',
        bullets: [
          'PPM: Planned Preventative Maintenance. Scheduled work intended to prevent failure, as opposed to fixing it afterwards.',
          'Reactive maintenance: unplanned work in response to a fault. High reactive spend usually indicates weak PPM.',
          'SLA: Service Level Agreement. The response and completion times the provider is contractually held to.',
          'KPI: Key Performance Indicator. What gets measured and reported, which is not always the same as what matters.',
          'NTE: Not To Exceed. A spend limit above which the provider must seek approval before proceeding.',
          'SOR: Schedule of Rates. Pre-agreed prices for defined tasks, used to price work without a fresh quote each time.',
          'TFM: Total Facilities Management. Hard and soft services delivered under a single contract.',
          'Self-delivery: work carried out by the provider’s own employed staff rather than subcontracted.',
        ],
      },
      {
        heading: 'Service categories',
        body: 'How FM scope is normally divided.',
        bullets: [
          'Hard services: the building’s engineering and fabric: M&E, HVAC, fire systems, plumbing, lifts, roofing.',
          'Soft services: services to the occupants and presentation: cleaning, security, grounds, waste, front of house.',
          'CAFM: Computer-Aided Facilities Management. The system holding assets, jobs, schedules and history.',
          'Asset register: the list of what is in the building, its condition and its obligations. Without one, a PPM schedule is guesswork.',
          'Mobilisation: the transition period when a new provider takes over, surveys the estate and stands up the schedules.',
        ],
      },
      {
        heading: 'Compliance and statutory terms',
        body: 'The obligations that carry legal consequence.',
        bullets: [
          'SFG20: the industry standard maintenance specification, defining tasks and frequencies by asset type.',
          'L8 / ACOP L8: the HSE approved code of practice for controlling Legionella in water systems.',
          'LOLER: Lifting Operations and Lifting Equipment Regulations. Governs thorough examination of lifts and lifting equipment.',
          'LEV: Local Exhaust Ventilation. Extraction controlling airborne contaminants; requires thorough examination and testing.',
          'EICR: Electrical Installation Condition Report. Periodic inspection of the fixed electrical installation.',
          'BS 5266: the standard governing emergency lighting, including monthly function and annual duration testing.',
          'F-Gas: regulations covering fluorinated refrigerant gases, including leak checking and record keeping.',
          'Responsible Person: the duty holder under fire safety legislation. The duty can be delegated in practice but not in law.',
          'MEES: Minimum Energy Efficiency Standards. Sets the minimum EPC rating at which a property may be let.',
        ],
      },
    ],
    relatedRoutes: ['/fm-support-n-contact/facilities-management-glossary', '/what-is-facilities-management', '/ppm', '/hard-services', '/soft-services'],
    conversionGoal: 'Build topical authority and route readers into service and compliance pages',
  }),

  // ── Portal and account ───────────────────────────────────────────────────

  '/account-registration': base({
    path: '/account-registration',
    title: 'Client Account Registration | EntireFM',
    metaDescription:
      'Register for an EntireFM client account to log jobs, track progress, access compliance certificates and view planned maintenance schedules for your sites.',
    h1: 'Client Account Registration',
    eyebrow: 'Client access',
    heroIntro:
      'A client account gives site contacts a direct route to log and track jobs, rather than depending on whoever happens to pick up an email.',
    heroDescription:
      'Registration is for existing EntireFM contract clients. If you are not yet a client, the contact route is the right starting point.',
    historicIntent: 'Historic client account registration intent from the Wix estate',
    primaryIntent: 'entirefm account registration',
    secondaryIntents: ['client account registration', 'fm client portal registration'],
    pageType: 'company',
    historicTopics: ['Account registration', 'Client portal'],
    requiredSections: ['hero', 'body', 'cta'],
    sections: [
      {
        heading: 'What a client account gives you',
        body: 'Account access is aimed at the people who actually run the buildings: site managers, facilities coordinators and managing agents.',
        bullets: [
          'Log a job and track it through to completion',
          'View planned maintenance schedules for your sites',
          'Access compliance certificates and statutory records',
          'See job history and previous faults by asset',
          'Raise and review quotations',
        ],
      },
      {
        heading: 'Who can register',
        body: 'Registration is available to named contacts at organisations holding an EntireFM contract. Access is granted per site, so a managing agent with several buildings sees only the sites they are responsible for.',
      },
    ],
    relatedRoutes: ['/client-login/account-registration', '/client-login', '/portal', '/helpdesk', '/contact-us'],
    conversionGoal: 'Convert an existing client contact into a registered portal user',
  }),

  '/portal': base({
    path: '/portal',
    title: 'Client Portal | Jobs, PPM & Compliance Records | EntireFM',
    metaDescription:
      'The EntireFM client portal: log and track jobs, view PPM schedules, download compliance certificates and see spend and performance across your sites.',
    h1: 'EntireFM Client Portal',
    eyebrow: 'Client access',
    heroIntro:
      'Most FM frustration comes from not knowing where something has got to. The portal exists to remove that, bringing job status, maintenance schedules and compliance records into one place without having to ask.',
    heroDescription:
      'Available to contract clients, with access granted per site so each contact sees the buildings they are responsible for.',
    historicIntent: 'Historic client portal intent from the Wix estate',
    primaryIntent: 'entirefm client portal',
    secondaryIntents: ['fm client portal', 'facilities management portal login', 'client login'],
    pageType: 'company',
    historicTopics: ['Client portal', 'Job tracking', 'Compliance records'],
    requiredSections: ['hero', 'capabilities', 'body', 'cta'],
    sections: [
      {
        heading: 'What the portal covers',
        body: 'The portal reflects the same operational record EntireFM works from, rather than a separate client-facing summary compiled afterwards.',
        bullets: [
          'Job logging, status and completion evidence',
          'Planned maintenance schedules and completion status',
          'Compliance certificates and statutory records by site',
          'Asset history, including previous faults and remedial work',
          'Quotation review and approval',
          'Spend and performance reporting across sites',
        ],
      },
      {
        heading: 'Access is granted per site',
        body: 'A single portfolio contact can see everything; a site manager sees their building. That matters for managing agents, where the same contract spans landlords and tenants who should not see each other’s data.',
      },
    ],
    capabilities: [
      { name: 'Job tracking', description: 'Raise a job and follow it to completion, with the evidence attached.', tag: 'Jobs' },
      { name: 'PPM visibility', description: 'See what is scheduled, what is done and what is outstanding.', tag: 'PPM' },
      { name: 'Compliance records', description: 'Certificates and statutory records available without having to request them.', tag: 'Compliance' },
      { name: 'Per-site permissions', description: 'Access scoped to the sites each contact is responsible for.', tag: 'Access' },
    ],
    relatedRoutes: ['/client-login', '/account-registration', '/client-login/account-registration', '/helpdesk', '/fm-client-info'],
    conversionGoal: 'Drive client portal adoption and reduce inbound status-chasing',
  }),

  '/search': base({
    path: '/search',
    title: 'Search | EntireFM',
    metaDescription:
      'Search EntireFM for facilities management services, sectors, locations and compliance guidance across the site.',
    h1: 'Search EntireFM',
    eyebrow: 'Site search',
    heroIntro: 'Find services, sectors, locations and compliance guidance across the site.',
    historicIntent: 'Historic site search intent from the Wix estate',
    primaryIntent: 'entirefm site search',
    pageType: 'company',
    historicTopics: ['Site search'],
    requiredSections: ['hero', 'body'],
    sections: [
      {
        heading: 'Popular destinations',
        body: 'If you already know roughly what you need, these are the most common starting points.',
        bullets: [
          'Services: the full hard and soft services list',
          'Sectors: facilities management by industry',
          'Locations: coverage by city and region',
          'Compliance: statutory testing and certification',
          'Contact: enquiries, helpdesk and emergency support',
        ],
      },
    ],
    relatedRoutes: ['/services', '/sectors', '/locations', '/resources', '/contact-us'],
    conversionGoal: 'Route the visitor to the page they were looking for',
    verificationRequirements: [
      'Legacy Wix URL recovered from the Wix internal page manifest',
      'Must return 200: never redirect, never 404',
      'Search results pages should not be indexed',
    ],
  }),
};

/**
 * Homepage variants. Wix kept four addressable copies of the homepage across
 * the two estates. They are restored as live pages because they existed and may
 * hold links, but they are genuinely the same page as / — so each says so
 * plainly and points at the canonical home, and the indexation tier gate is
 * expected to hold them noindex rather than offering four homepages.
 */
const HOME_VARIANTS: Array<{ path: string; label: string; estate: string }> = [
  { path: '/home', label: 'Home', estate: 'the original Wix estate' },
  { path: '/homeab', label: 'Home AB', estate: 'the original Wix estate' },
  { path: '/home-1-1', label: 'Home', estate: 'the Wix Studio estate' },
  { path: '/home-1-1-1', label: 'New Home Design', estate: 'the Wix Studio estate' },
];

for (const variant of HOME_VARIANTS) {
  RECOVERED_PAGES[variant.path] = base({
    path: variant.path,
    title: 'Entire FM | Total Facilities Management & Engineering',
    metaDescription:
      'EntireFM provides total facilities management, mechanical and electrical engineering, planned maintenance and statutory compliance for UK commercial property.',
    h1: 'Total Facilities Management and Specialist Engineering',
    eyebrow: 'EntireFM',
    heroIntro:
      'EntireFM maintains commercial property across the UK, delivering planned maintenance, mechanical and electrical engineering, statutory compliance and reactive cover under one contract.',
    heroDescription:
      'Hard and soft services, coordinated through a single point of accountability.',
    historicIntent: `Historic homepage variant (${variant.label}) retained on ${variant.estate}`,
    primaryIntent: 'total facilities management uk',
    secondaryIntents: ['facilities management company', 'commercial facilities management uk'],
    pageType: 'home',
    historicTopics: ['Homepage variant'],
    requiredSections: ['hero', 'body', 'cta'],
    sections: [
      {
        heading: 'What EntireFM does',
        body: 'Planned maintenance, reactive repairs, mechanical and electrical engineering, statutory compliance, cleaning and specialist services, all held under one contract so responsibility for a problem does not move between suppliers while a building sits unusable.',
        bullets: [
          'Planned preventative maintenance built from a real asset survey',
          'Reactive and emergency response with agreed priority bands',
          'Statutory compliance testing, certification and records',
          'Mechanical, electrical, HVAC and building fabric',
          'Commercial and industrial cleaning',
          'Multi-site estates maintained to one standard',
        ],
      },
      {
        heading: 'About this page',
        body: `This is a retained homepage variant (${variant.label}) from ${variant.estate}, kept live so the URL and any links to it continue to work. The current EntireFM homepage is the canonical version of this content.`,
      },
    ],
    relatedRoutes: ['/', '/services', '/sectors', '/locations', '/contact-us'],
    conversionGoal: 'Preserve the legacy URL and route visitors to the canonical homepage',
    verificationRequirements: [
      'Legacy Wix URL recovered from the Wix internal page manifest',
      'Must return 200: never redirect, never 404',
      'Duplicate of /: expected to be held noindex by the indexation tier gate',
    ],
  });
}
