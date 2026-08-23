/**
 * TIER 1 CITY DATA
 * ================
 * The nine cities that Search Console shows carrying real demand, plus the
 * genuinely local material that makes each page a different page.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The generated location records in /src/content/pages are ~74% identical to
 * one another (measured 8-gram overlap) because they are one template with the
 * city name substituted in. That is the doorway-page pattern the rebuild plan
 * explicitly forbids. Everything here is city-specific by construction: the
 * districts, the building stock, the operating constraints and the sector mix
 * are different facts about different places, not rephrasings.
 *
 * CLAIM GOVERNANCE
 * ----------------
 * Two geographic claims, and the difference matters.
 * `GEO_NATIONAL_REGIONAL_OPS` is VERIFIED — EntireFM runs nationally through
 * regional operations, which is a mix of offices, storage bases and
 * engineering teams working to each area. `GEO_REGIONAL_CENTRES` stays
 * DO_NOT_USE — no page may name a facility in a specific city, because the
 * provision is uneven and a per-city premises claim cannot be supported.
 * Describe the operating model; never give a named town a building.
 *
 * `searchDemand` figures are measured, from the Google Search Console export
 * for 2026-05-07 → 2026-08-20 (docs/seo-rebuild/verified/).
 */

export interface CityDistrict {
  name: string;
  note: string;
}

export interface OperatingCondition {
  title: string;
  detail: string;
}

export interface Tier1City {
  /** Display name, as written in copy. */
  name: string;
  /** URL slug fragment used across variants. */
  slug: string;
  /** Wider region used for coverage language. */
  region: string;
  /** Measured Search Console demand (impressions / avg position). */
  searchDemand: { impressions: number; avgPosition: number };
  /** One-line positioning specific to this city's commercial estate. */
  positioning: string;
  /** Commercial districts, estates and corridors actually served. */
  districts: CityDistrict[];
  /** The building stock that dominates the local commercial estate. */
  propertyStock: string[];
  /** FM problems that are genuinely particular to this city. */
  operatingConditions: OperatingCondition[];
  /** Sectors over-represented in this city's commercial estate. */
  sectors: string[];
  /** Neighbouring towns covered on the same travel pattern. */
  travelPattern: string;
  /** City image folder slug, or null where correct photography is missing. */
  imageSlug: string | null;
}

export const TIER1_CITIES: Record<string, Tier1City> = {
  london: {
    name: 'London',
    slug: 'london',
    region: 'Greater London and the M25 corridor',
    searchDemand: { impressions: 34339, avgPosition: 50.4 },
    positioning:
      'London commercial property carries the tightest access rules, the heaviest compliance load and the least tolerance for disruption of any UK market.',
    districts: [
      { name: 'City of London (EC2, EC3, EC4)', note: 'Dense multi-tenant towers with shared risers and strict out-of-hours working windows.' },
      { name: 'Canary Wharf and the Isle of Dogs (E14)', note: 'Estate-managed towers where access is controlled by the landlord, not the occupier.' },
      { name: 'Bankside and Southwark (SE1)', note: 'Mixed 1980s refurbishment stock alongside new-build offices and hotels.' },
      { name: "King's Cross and Euston (N1C, NW1)", note: 'Recent large-floorplate development with modern BMS and high plant density.' },
      { name: 'Westminster and Victoria (SW1)', note: 'Listed and conservation-area buildings where plant replacement needs consent.' },
      { name: 'Shoreditch and Clerkenwell (EC1, EC2A)', note: 'Converted warehouses and workspace with retrofitted, often undocumented services.' },
      { name: 'Park Royal and Greenford (NW10, UB6)', note: "London's largest industrial area — logistics, food production and trade counters." },
      { name: 'Croydon, Stratford and Hammersmith', note: 'Regional office clusters with their own out-of-town operating patterns.' },
    ],
    propertyStock: [
      'Multi-tenant office towers with landlord-controlled risers and shared plant',
      '1960s–1980s office stock in mid-life mechanical and electrical refurbishment',
      'Listed and conservation-area buildings where plant changes need consent',
      'Converted warehouse and workspace with undocumented retrofitted services',
      'High-rise residential and build-to-rent with complex water systems',
    ],
    operatingConditions: [
      { title: 'ULEZ and Congestion Charge affect every attendance', detail: 'Vehicle compliance and charging windows change the true cost and timing of a callout. Response planning that ignores them produces quotes that do not survive contact with a London site.' },
      { title: 'Access is negotiated, not assumed', detail: 'Permits to work, landlord approval, lift bookings and restricted loading windows routinely add a day to what looks like a two-hour job. Out-of-hours working is the default for anything disruptive.' },
      { title: 'Tall-building water systems raise the Legionella burden', detail: 'Long pipe runs, roof tanks and intermittently occupied floors make L8 monitoring, temperature regimes and dead-leg management materially harder than in low-rise stock.' },
      { title: 'MEES and EPC deadlines are driving plant replacement', detail: 'Minimum energy efficiency standards are pulling forward HVAC, lighting and controls upgrades across older London office stock, often on tenanted floors.' },
      { title: 'Service charge scrutiny is intense', detail: 'Managing agents and tenants examine FM spend line by line. Evidence, certification and cost transparency matter as much as the work itself.' },
    ],
    sectors: ['Corporate offices and co-working', 'Managing agents and landlords', 'Hotels and hospitality', 'Retail and leisure', 'Build-to-rent and prime residential', 'Logistics and light industrial'],
    travelPattern: 'Greater London within the M25, extending to Watford, Slough, Croydon, Romford and the Thames Gateway.',
    imageSlug: 'london',
  },

  manchester: {
    name: 'Manchester',
    slug: 'manchester',
    region: 'Greater Manchester and the North West',
    searchDemand: { impressions: 21598, avgPosition: 52.6 },
    positioning:
      'Manchester combines converted Victorian mill stock, a decade of new Grade A development and Europe’s largest industrial estate inside one travel pattern.',
    districts: [
      { name: 'City centre and Spinningfields (M1, M2, M3)', note: 'Grade A offices and professional services with concierge-managed access.' },
      { name: 'Ancoats and NOMA (M4)', note: 'Mill conversions and new mixed-use, frequently with hybrid old/new services.' },
      { name: 'MediaCityUK and Salford Quays (M50)', note: 'Broadcast and tech occupiers with low tolerance for power interruption.' },
      { name: 'Trafford Park (M17)', note: 'One of the largest industrial estates in Europe — manufacturing, logistics and distribution at scale.' },
      { name: 'Oxford Road corridor (M13, M15)', note: 'Universities, teaching hospitals and research buildings with critical environments.' },
      { name: 'Airport City and Wythenshawe (M90, M22)', note: 'Logistics, hotels and aviation-adjacent facilities running to flight schedules.' },
      { name: 'Stockport, Salford and Bury', note: 'Established trade, industrial and office parks across the wider conurbation.' },
    ],
    propertyStock: [
      'Victorian mill and warehouse conversions with layered, part-documented M&E',
      'New-build Grade A offices with modern BMS and metering',
      'Large-format industrial and distribution units in Trafford Park and beyond',
      '2000s city-centre apartment blocks, many in cladding and fire-safety remediation',
      'University and hospital estates with critical and research environments',
    ],
    operatingConditions: [
      { title: 'Mill conversions hide their services', detail: 'Plant is often retrofitted into structures never designed for it — restricted risers, awkward plant rooms and asset registers that do not match what is actually installed. Surveying properly is the difference between a working PPM plan and a fictional one.' },
      { title: 'Clean air and city-centre access', detail: 'Greater Manchester’s air quality measures, Metrolink routes and pedestrianised streets restrict vehicle access across the core. Loading windows shape attendance planning.' },
      { title: 'Cladding and fire-safety remediation is live work', detail: 'Many city-centre residential and mixed-use blocks are mid-remediation. FM has to work alongside remediation contractors without breaking compartmentation or invalidating fire strategy.' },
      { title: 'Trafford Park runs on uptime', detail: 'Manufacturing and distribution occupiers measure failure in production hours. Dock levellers, shutters, yard lighting, extraction and three-phase power need planned attention, not reactive callouts.' },
      { title: 'Student and BTR density drives seasonal peaks', detail: 'Turnaround windows in student and build-to-rent stock compress a year of maintenance into a few summer weeks.' },
    ],
    sectors: ['Manufacturing and logistics', 'Corporate offices and professional services', 'Media and technology', 'Higher education and healthcare', 'Build-to-rent and student accommodation', 'Hotels and leisure'],
    travelPattern: 'Greater Manchester including Salford, Trafford, Stockport, Oldham, Bolton and Bury, extending to Warrington and Wigan.',
    imageSlug: 'manchester',
  },

  sheffield: {
    name: 'Sheffield',
    slug: 'sheffield',
    region: 'South Yorkshire',
    searchDemand: { impressions: 22978, avgPosition: 61.4 },
    positioning:
      'Sheffield’s commercial estate is weighted toward advanced manufacturing and heavy industrial process, which changes what facilities management actually has to be good at.',
    districts: [
      { name: 'City centre and Heart of the City (S1)', note: 'Offices, civic buildings and recent mixed-use redevelopment.' },
      { name: 'Lower Don Valley and Attercliffe (S9)', note: 'Heavy industrial and engineering works with substantial power and extraction loads.' },
      { name: 'Advanced Manufacturing Park, Catcliffe (S60)', note: 'Research and high-specification production with controlled environments.' },
      { name: 'Meadowhall and surrounds (S9)', note: 'Major retail with public-realm cleaning and long trading hours.' },
      { name: 'University and hospital quarter (S10)', note: 'Research laboratories, teaching space and clinical environments.' },
      { name: 'Rotherham, Chesterfield and the Dearne Valley', note: 'Distribution, manufacturing and trade estates on the same travel pattern.' },
    ],
    propertyStock: [
      'Heavy industrial and engineering works with high-load electrical infrastructure',
      'Advanced manufacturing facilities with controlled and clean environments',
      'Older city-centre office stock alongside recent civic redevelopment',
      'Large-format retail with intensive public-realm requirements',
      'University research buildings with specialist ventilation and extraction',
    ],
    operatingConditions: [
      { title: 'Industrial power is the defining asset class', detail: 'HV and LV distribution, transformers, standby generation and three-phase supplies dominate the risk profile. Thermographic surveys and fixed-wire testing carry more weight here than in an office-led estate.' },
      { title: 'Extraction and LEV are a statutory constant', detail: 'Local exhaust ventilation in engineering and manufacturing environments requires thorough examination and testing at defined intervals. Missing an LEV inspection is a health-and-safety failure, not a housekeeping one.' },
      { title: 'Topography affects access and attendance', detail: 'Sheffield’s gradients and constrained industrial access roads change vehicle routing, lifting operations and winter response planning.' },
      { title: 'Controlled environments do not tolerate ad-hoc work', detail: 'On the Advanced Manufacturing Park, maintenance affecting temperature, humidity or particulate control has to be planned around production and validated afterwards.' },
      { title: 'Legacy heavy-industrial buildings carry legacy risk', detail: 'Asbestos management surveys, ageing roof structures and original distribution boards are common in Lower Don Valley stock and need to be known before work starts.' },
    ],
    sectors: ['Advanced manufacturing and engineering', 'Heavy industrial and process', 'Higher education and research', 'Retail and shopping centres', 'Public sector and civic', 'Logistics and distribution'],
    travelPattern: 'Sheffield and South Yorkshire including Rotherham, Barnsley and Doncaster, extending to Chesterfield and the north Derbyshire border.',
    imageSlug: 'sheffield',
  },

  leeds: {
    name: 'Leeds',
    slug: 'leeds',
    region: 'West Yorkshire',
    searchDemand: { impressions: 16021, avgPosition: 35.1 },
    positioning:
      'Leeds is the largest financial and legal centre outside London, and its estate is dominated by multi-tenant offices where service standards are contractual.',
    districts: [
      { name: 'City centre and Wellington Place (LS1)', note: 'Grade A multi-tenant offices with formal service-level expectations.' },
      { name: 'Leeds Dock and Holbeck (LS10, LS11)', note: 'Digital and creative occupiers in converted and new-build mixed-use space.' },
      { name: 'Aire Valley Enterprise Zone (LS9, LS10)', note: 'Distribution and manufacturing on large-format sites.' },
      { name: 'Thorpe Park and east Leeds (LS15)', note: 'Out-of-town office and retail park with its own access and parking pattern.' },
      { name: 'White Rose and south Leeds (LS11)', note: 'Retail and office campus with long public trading hours.' },
      { name: 'University and hospital quarter (LS2)', note: 'Teaching, research and clinical estates with critical services.' },
    ],
    propertyStock: [
      'Grade A multi-tenant offices with landlord-managed common parts',
      'Victorian mill and warehouse conversions in Holbeck and the south bank',
      'Large distribution and manufacturing units in the Aire Valley',
      'Out-of-town office and retail campuses',
      'Build-to-rent towers and student accommodation at scale',
    ],
    operatingConditions: [
      { title: 'Multi-tenant service standards are contractual', detail: 'In Wellington Place-grade buildings, response times, common-part presentation and reporting are written into occupational leases. FM performance is measured against the lease, not against goodwill.' },
      { title: 'Financial and legal occupiers need continuity', detail: 'Trading floors, data rooms and secure document areas make unplanned power or cooling loss expensive. UPS, standby generation and cooling resilience carry the risk.' },
      { title: 'Conversion stock complicates compliance', detail: 'Holbeck and south-bank mill conversions frequently have original structure with modern occupancy, which affects fire strategy, compartmentation and means of escape.' },
      { title: 'Aire Valley sites run long operating hours', detail: 'Distribution occupiers work shift patterns that leave narrow maintenance windows, usually overnight or at weekends.' },
      { title: 'Seasonal turnaround in student and BTR stock', detail: 'Large student and build-to-rent portfolios compress reactive repairs, redecoration and statutory testing into short summer windows.' },
    ],
    sectors: ['Financial, legal and professional services', 'Corporate offices and managing agents', 'Logistics and distribution', 'Higher education and healthcare', 'Retail parks and shopping centres', 'Build-to-rent and student accommodation'],
    travelPattern: 'Leeds and West Yorkshire including Bradford, Wakefield, Huddersfield and Halifax, extending to Harrogate and York.',
    // Source folder for Leeds duplicates Sheffield's images — see
    // scripts/build-location-images.js. No Leeds imagery until it is reshot.
    imageSlug: null,
  },

  birmingham: {
    name: 'Birmingham',
    slug: 'birmingham',
    region: 'the West Midlands',
    searchDemand: { impressions: 6459, avgPosition: 39.6 },
    positioning:
      'Birmingham is a charging Clean Air Zone with a city centre in sustained redevelopment, and both facts change how facilities work is planned and priced.',
    districts: [
      { name: 'Colmore Business District (B3)', note: 'Professional services offices, much of it listed or in conservation area.' },
      { name: 'Brindleyplace and Broad Street (B1)', note: 'Canal-side offices, hotels and leisure with heavy public footfall.' },
      { name: 'Snow Hill and Eastside (B4)', note: 'Redevelopment zone affected by ongoing infrastructure works.' },
      { name: 'Digbeth and the Custard Factory (B5, B9)', note: 'Creative and workspace occupiers in converted industrial buildings.' },
      { name: 'Aston, Witton and Nechells (B6, B7)', note: 'Established manufacturing and trade estates.' },
      { name: 'NEC, Airport and Solihull (B40, B37)', note: 'Events, aviation-adjacent and business park facilities.' },
      { name: 'Jewellery Quarter (B18)', note: 'Small-unit listed stock with constrained access and specialist occupiers.' },
    ],
    propertyStock: [
      'Listed and conservation-area offices in and around Colmore Row',
      'Canal-side mixed-use with hospitality and leisure occupiers',
      'Converted industrial buildings in Digbeth and the Jewellery Quarter',
      'Manufacturing and trade units across the northern industrial belt',
      'Business park and events infrastructure around the NEC and airport',
    ],
    operatingConditions: [
      { title: 'The Clean Air Zone charges non-compliant vehicles daily', detail: 'Birmingham operates a charging CAZ covering the city centre inside the A4540 ring road. Fleet compliance directly affects attendance cost, and any provider quoting without accounting for it is understating the price.' },
      { title: 'Infrastructure works disrupt access continuously', detail: 'Sustained city-centre redevelopment and transport works change road access, loading and parking at short notice. Attendance planning has to assume disruption rather than treat it as exceptional.' },
      { title: 'Listed stock constrains plant replacement', detail: 'Colmore Row and the Jewellery Quarter contain substantial listed and conservation-area buildings where external plant, flues and roof works require consent and sympathetic specification.' },
      { title: 'Canal-side buildings have water and damp exposure', detail: 'Brindleyplace and Gas Street stock sits directly on the canal network, which affects damp management, drainage, pumping and basement plant.' },
      { title: 'Events venues work to fixed, immovable dates', detail: 'NEC and arena occupiers cannot move an event. Planned maintenance has to fit the calendar, and reactive response has to be fast enough to protect a live event.' },
    ],
    sectors: ['Corporate offices and professional services', 'Manufacturing and trade', 'Events, arenas and exhibition venues', 'Hotels, hospitality and leisure', 'Retail and shopping centres', 'Public sector and civic'],
    travelPattern: 'Birmingham and the West Midlands including Solihull, Wolverhampton, Walsall, Dudley and Coventry.',
    imageSlug: 'birmingham',
  },

  nottingham: {
    name: 'Nottingham',
    slug: 'nottingham',
    region: 'Nottinghamshire and the East Midlands',
    searchDemand: { impressions: 1527, avgPosition: 38.5 },
    positioning:
      'Nottingham is the only UK city with a Workplace Parking Levy, which makes site access and staff parking an explicit line in every facilities budget.',
    districts: [
      { name: 'City centre and Old Market Square (NG1)', note: 'Retail, civic and office space with pedestrianised access.' },
      { name: 'Lace Market (NG1)', note: 'Listed Victorian warehouse conversions with constrained servicing.' },
      { name: 'NG2 Business Park and Castle Marina (NG2, NG7)', note: 'Modern office and trade units close to the ring road.' },
      { name: 'Beeston and the Boots campus (NG9)', note: 'Large corporate and life-science campus with controlled environments.' },
      { name: 'University Park and Jubilee Campus (NG7)', note: 'Higher-education estate with research and residential buildings.' },
      { name: 'Queen’s Medical Centre and City Hospital (NG7, NG5)', note: 'Clinical estates with continuous operation and strict infection control.' },
    ],
    propertyStock: [
      'Listed Victorian lace warehouses converted to office and residential use',
      'Modern business park offices and trade counter units',
      'Corporate and life-science campus buildings with controlled environments',
      'University teaching, research and accommodation estate',
      'Clinical buildings operating continuously',
    ],
    operatingConditions: [
      { title: 'The Workplace Parking Levy is charged per space', detail: 'Nottingham levies an annual charge on employers providing workplace parking above a threshold. It affects how sites allocate spaces, and it affects contractor attendance and welfare arrangements on site.' },
      { title: 'Tram routes restrict city-centre vehicle access', detail: 'NET tram alignment and pedestrianisation across the city core limit where vehicles can stop and for how long, which shapes loading and equipment delivery.' },
      { title: 'Lace Market conversions are listed and tightly serviced', detail: 'Original warehouse structures with modern occupancy create constrained risers, limited plant space and consent requirements for external changes.' },
      { title: 'Clinical and life-science environments need validated work', detail: 'Ventilation, pressure regimes, water hygiene and temperature control in clinical and laboratory settings require documented, validated maintenance rather than general building work.' },
      { title: 'Student turnaround compresses the maintenance year', detail: 'Large university accommodation portfolios concentrate statutory testing and repair into short vacation windows.' },
    ],
    sectors: ['Higher education and research', 'Healthcare and life sciences', 'Corporate offices and business parks', 'Retail and city-centre leisure', 'Public sector and civic', 'Logistics and trade'],
    travelPattern: 'Nottingham and Nottinghamshire including Beeston, Arnold, Hucknall and Mansfield, extending to Derby and Loughborough.',
    imageSlug: 'nottingham',
  },

  derby: {
    name: 'Derby',
    slug: 'derby',
    region: 'Derbyshire and the East Midlands',
    searchDemand: { impressions: 6254, avgPosition: 71.8 },
    positioning:
      'Derby has the highest concentration of advanced engineering employment in the country, and its facilities requirements follow production rather than office hours.',
    districts: [
      { name: 'City centre and Cathedral Quarter (DE1)', note: 'Professional offices and civic buildings, much of it conservation area.' },
      { name: 'Pride Park (DE24)', note: 'Modern office, stadium and business park estate close to the ring road.' },
      { name: 'Infinity Park and Sinfin (DE24)', note: 'Advanced manufacturing and aerospace supply chain.' },
      { name: 'Derwent Valley corridor (DE1, DE56)', note: 'World Heritage mill buildings in commercial and mixed use.' },
      { name: 'Spondon and Raynesway (DE21)', note: 'Process, chemical and heavy engineering sites.' },
      { name: 'Burton, Ilkeston and Ripley', note: 'Manufacturing and distribution across the wider county.' },
    ],
    propertyStock: [
      'Advanced manufacturing and aerospace facilities with specialist services',
      'Process and chemical plant with high compliance exposure',
      'World Heritage mill buildings in commercial reuse',
      'Modern business park offices around Pride Park',
      'Distribution and trade units across the county',
    ],
    operatingConditions: [
      { title: 'Maintenance windows follow production, not the working day', detail: 'Aerospace and automotive supply-chain sites run shift patterns that leave narrow, fixed maintenance windows. Planned work that overruns stops a line, so scheduling discipline matters more than headline rates.' },
      { title: 'Process environments carry heavy statutory exposure', detail: 'Pressure systems, LEV, COSHH-relevant ventilation and specialist extraction all carry defined examination regimes with real legal consequence if missed.' },
      { title: 'World Heritage status constrains the Derwent Valley', detail: 'Mill buildings in commercial reuse sit within a World Heritage Site. External plant, flues, roofing and glazing changes need sympathetic specification and consent.' },
      { title: 'Clean and controlled areas need validated maintenance', detail: 'Aerospace and precision manufacturing include controlled environments where particulate, temperature and humidity control must be maintained and evidenced.' },
      { title: 'Supply-chain sites inherit their client’s audit regime', detail: 'Tier 1 manufacturers audit their suppliers. Facilities records, competence evidence and compliance certification are examined as part of that audit, not just by the site itself.' },
    ],
    sectors: ['Aerospace and advanced manufacturing', 'Process and chemical', 'Rail and transport engineering', 'Corporate offices and business parks', 'Logistics and distribution', 'Public sector and civic'],
    travelPattern: 'Derby and Derbyshire including Pride Park, Spondon, Ilkeston and Ripley, extending to Burton upon Trent and Nottingham.',
    imageSlug: 'derby',
  },

  lincoln: {
    name: 'Lincoln',
    slug: 'lincoln',
    region: 'Lincolnshire',
    searchDemand: { impressions: 1845, avgPosition: 25.0 },
    positioning:
      'Lincolnshire is a large, largely rural county, so facilities coverage here is judged on genuine travel capability rather than a city-centre postcode.',
    districts: [
      { name: 'Uphill and the Cathedral Quarter (LN1, LN2)', note: 'Conservation-area and listed buildings with severely constrained access.' },
      { name: 'Downhill city centre (LN1, LN5)', note: 'Retail, office and civic space on the level ground below the hill.' },
      { name: 'Lincoln Science and Innovation Park (LN6)', note: 'Research and technology space with laboratory environments.' },
      { name: 'Teal Park and Whisby (LN6)', note: 'Modern distribution and manufacturing on the western edge.' },
      { name: 'Witham St Hughs and Swinderby (LN6)', note: 'Large-format logistics close to the A46.' },
      { name: 'Sleaford, Newark, Gainsborough and Grantham', note: 'County towns covered on the same travel pattern.' },
    ],
    propertyStock: [
      'Listed and conservation-area buildings in the Cathedral Quarter',
      'Modern distribution and manufacturing units on the city fringe',
      'Food production and agricultural processing facilities',
      'University and science park research buildings',
      'Retail and civic stock in the downhill centre and county towns',
    ],
    operatingConditions: [
      { title: 'Coverage is a travel problem before it is a technical one', detail: 'Lincolnshire is geographically large with limited dual carriageway. Realistic response times depend on where engineers actually are, and any provider quoting uniform county-wide response times should be asked how.' },
      { title: 'Steep Hill and the uphill quarter restrict everything', detail: 'The gradient and narrow historic streets of the uphill area limit vehicle size, lifting operations and material handling. Work that is routine elsewhere needs planning here.' },
      { title: 'Food production carries its own hygiene regime', detail: 'Food and agricultural processing sites impose hygiene, segregation and audit requirements on maintenance work, including on the equipment and clothing engineers bring on site.' },
      { title: 'Listed fabric constrains plant and services', detail: 'Cathedral Quarter buildings need consent for external plant, flues and roof work, and sympathetic specification for anything visible.' },
      { title: 'Rural sites often have private infrastructure', detail: 'Private water supplies, package treatment plant, LPG and standby generation are far more common here than in an urban estate, and each carries its own maintenance and testing regime.' },
    ],
    sectors: ['Food production and agriculture', 'Logistics and distribution', 'Higher education and research', 'Retail and city-centre commercial', 'Public sector and civic', 'Manufacturing and engineering'],
    travelPattern: 'Lincoln and Lincolnshire including North Hykeham, Sleaford, Newark, Gainsborough, Grantham and the surrounding county.',
    imageSlug: null,
  },

  liverpool: {
    name: 'Liverpool',
    slug: 'liverpool',
    region: 'Merseyside',
    searchDemand: { impressions: 9, avgPosition: 5.0 },
    positioning:
      'Liverpool’s commercial estate sits on an exposed estuary, and salt-laden air measurably shortens the life of external plant, roofing and metalwork.',
    districts: [
      { name: 'Commercial district (L2, L3)', note: 'Historic and modern office stock around Castle Street and Old Hall Street.' },
      { name: 'Waterfront and Pier Head (L3)', note: 'Landmark listed buildings with heavy public footfall and full weather exposure.' },
      { name: 'Baltic Triangle (L1, L8)', note: 'Converted warehouse and creative workspace with retrofitted services.' },
      { name: 'Knowledge Quarter (L3, L7)', note: 'Universities, teaching hospitals and life-science research buildings.' },
      { name: 'Liverpool ONE and city retail (L1)', note: 'Large managed retail estate with extensive public realm.' },
      { name: 'Port of Liverpool, Seaforth and Speke (L21, L24)', note: 'Port logistics, manufacturing and aviation-adjacent facilities.' },
    ],
    propertyStock: [
      'Listed waterfront and commercial-district buildings with exposed fabric',
      'Converted warehouse and creative workspace in the Baltic Triangle',
      'University, hospital and life-science research estate',
      'Managed retail estate with large public realm',
      'Port, logistics and manufacturing facilities along the estuary',
    ],
    operatingConditions: [
      { title: 'Salt-air corrosion shortens external asset life', detail: 'Estuary and dockside exposure accelerates corrosion in external condensers, roof plant, fixings, handrails and metalwork. Inspection intervals and material specification should reflect that, not a generic national schedule.' },
      { title: 'Wind and driving rain drive fabric failures', detail: 'Exposure on the waterfront produces water ingress at roof edges, curtain walling and flashings more often than in inland cities. Fabric inspection carries more weight in the maintenance plan.' },
      { title: 'Listed waterfront buildings limit intervention', detail: 'Pier Head and commercial-district stock includes significant listed fabric where plant, flues and roofing changes require consent and sympathetic detailing.' },
      { title: 'Port and logistics sites run continuously', detail: 'Port-adjacent operations work around shipping and distribution schedules, leaving narrow planned-maintenance windows and requiring genuine out-of-hours capability.' },
      { title: 'Dense student accommodation concentrates turnaround', detail: 'Liverpool has one of the highest student accommodation densities in the country, compressing statutory testing and repair into short summer windows.' },
    ],
    sectors: ['Port, logistics and distribution', 'Higher education and life sciences', 'Retail and managed public realm', 'Hotels, hospitality and leisure', 'Corporate offices and managing agents', 'Student accommodation and residential'],
    travelPattern: 'Liverpool and Merseyside including Bootle, Birkenhead, St Helens and Southport, extending to Warrington and Chester.',
    imageSlug: 'liverpool',
  },

  chesterfield: {
    name: 'Chesterfield',
    slug: 'chesterfield',
    region: 'North Derbyshire and the Peak District fringe',
    searchDemand: { impressions: 1200, avgPosition: 28.0 },
    positioning: 'Chesterfield combines historic market-town commercial stock with major engineering, manufacturing and logistics along the A61 and M1 corridor.',
    districts: [
      { name: 'Town centre and Church Way (S40)', note: 'Historic retail, civic and professional offices with constrained access.' },
      { name: 'Chesterfield Waterside and Brimington (S41)', note: 'Mixed-use regeneration and commercial workspace.' },
      { name: 'Sheepbridge Industrial Estate (S41)', note: 'Heavy engineering, manufacturing and industrial trade counters.' },
      { name: 'Holmewood Industrial Park (S42)', note: 'Large-scale warehousing, logistics and distribution close to M1 J29.' },
      { name: 'Clay Cross and Staveley (S45, S43)', note: 'Established manufacturing, fabrication and trade estates.' },
    ],
    propertyStock: [
      'Heavy engineering and precision manufacturing works',
      'Modern logistics and distribution hubs at Holmewood and Markham Vale',
      'Historic town-centre commercial and professional office stock',
      'Industrial trade counter and workshop developments',
    ],
    operatingConditions: [
      { title: 'Logistics access along the M1 corridor', detail: 'Holmewood and Markham Vale distribution operations require reliable out-of-hours attendance and scheduled PPM around freight shift patterns.' },
      { title: 'Manufacturing and extraction safety', detail: 'Local exhaust ventilation (LEV), pressure vessels and three-phase power require documented statutory examination.' },
      { title: 'Topography and regional connectivity', detail: 'Derbyshire terrain and A619/A61 arterial corridors dictate responsive attendance windows.' },
    ],
    sectors: ['Engineering and manufacturing', 'Logistics and distribution', 'Commercial offices and professional services', 'Retail and market town commercial'],
    travelPattern: 'Chesterfield and North Derbyshire including Dronfield, Staveley, Bolsover, Clay Cross and the Peak District border, linking directly into Sheffield.',
    imageSlug: null,
  },

  doncaster: {
    name: 'Doncaster',
    slug: 'doncaster',
    region: 'South Yorkshire and the Humber corridor',
    searchDemand: { impressions: 1450, avgPosition: 32.0 },
    positioning: 'Doncaster is one of the UK’s premier logistics and rail-freight hubs, where warehouse uptime and continuous building operation are paramount.',
    districts: [
      { name: 'iPort and Rossington (DN11)', note: 'Strategic rail-freight and national distribution hub.' },
      { name: 'Doncaster town centre and Waterdale (DN1)', note: 'Civic, commercial and retail offices.' },
      { name: 'Lakeside and Carr Hill (DN4)', note: 'Business parks, corporate headquarters and leisure facilities.' },
      { name: 'Kirk Sandall and Wheatley (DN3, DN2)', note: 'Established industrial and manufacturing estates.' },
      { name: 'Armthorpe and Redhouse (DN3, DN6)', note: 'Large-format logistics and e-commerce distribution.' },
    ],
    propertyStock: [
      'High-bay distribution centres and automated logistics hubs',
      'Rail-adjacent manufacturing and fabrication facilities',
      'Modern business park offices at Lakeside',
      'Multi-tenant commercial and retail developments',
    ],
    operatingConditions: [
      { title: 'High-bay warehouse M&E and lighting', detail: 'High-level lighting, dock levellers, fast-acting doors and high-capacity ventilation require planned maintenance around 24/7 operating schedules.' },
      { title: 'Critical power and distribution continuity', detail: 'Uninterrupted power supplies and standby generation are essential for automated logistics sortation.' },
      { title: 'Yard maintenance and drainage resilience', detail: 'Heavy vehicle movements demand robust exterior drainage, interceptor maintenance and surface upkeep.' },
    ],
    sectors: ['Logistics, warehousing and freight', 'Manufacturing and rail engineering', 'Corporate offices and business parks', 'Retail and commercial leisure'],
    travelPattern: 'Doncaster and South Yorkshire including Armthorpe, Thorne, Mexborough and Bawtry, extending along the M18 and A1(M).',
    imageSlug: null,
  },

  rotherham: {
    name: 'Rotherham',
    slug: 'rotherham',
    region: 'South Yorkshire',
    searchDemand: { impressions: 1150, avgPosition: 30.0 },
    positioning: 'Rotherham’s economy is powered by advanced engineering, metal fabrication and large-scale industrial manufacturing centered around the Don Valley.',
    districts: [
      { name: 'Templeborough and Ickles (S60)', note: 'Advanced engineering, precision manufacturing and steel technology.' },
      { name: 'Parkgate and Rawmarsh (S62)', note: 'Major retail park and industrial trade corridor.' },
      { name: 'Wath upon Dearne and Manvers (S63)', note: 'Logistics, distribution and commercial business parks.' },
      { name: 'Town centre and Minster Quarter (S60)', note: 'Commercial offices, civic amenities and heritage retail.' },
    ],
    propertyStock: [
      'Advanced manufacturing and materials processing facilities',
      'Industrial business parks and distribution units across the Dearne Valley',
      'Commercial offices and call-centre developments',
      'Retail park destinations and trade counters',
    ],
    operatingConditions: [
      { title: 'Heavy electrical loads and substations', detail: 'High-load three-phase supplies and private sub-stations require rigorous statutory testing and thermal imaging.' },
      { title: 'Environmental compliance and LEV testing', detail: 'Stringent emissions and workplace ventilation rules require scheduled maintenance of extraction and filtration systems.' },
    ],
    sectors: ['Advanced engineering and metals', 'Logistics and distribution', 'Commercial offices', 'Retail and leisure'],
    travelPattern: 'Rotherham and the Dearne Valley including Parkgate, Maltby, Dinnington, Swinton and direct links into Sheffield.',
    imageSlug: null,
  },

  bradford: {
    name: 'Bradford',
    slug: 'bradford',
    region: 'West Yorkshire',
    searchDemand: { impressions: 1800, avgPosition: 34.0 },
    positioning: 'Bradford features a mix of converted Victorian textile mill estates, modern manufacturing corridors and major commercial distribution centres.',
    districts: [
      { name: 'City centre and Little Germany (BD1)', note: 'Listed Victorian commercial architecture and modern civic offices.' },
      { name: 'Low Moor and Euroway (BD12, BD4)', note: 'Major industrial manufacturing and distribution adjacent to the M606.' },
      { name: 'Bowling and Tong (BD4)', note: 'Established manufacturing, engineering and trade parks.' },
      { name: 'Shipley and Saltaire (BD18)', note: 'World heritage mill conversions and modern tech workspace.' },
    ],
    propertyStock: [
      'Listed stone mill conversions housing offices and mixed commercial',
      'Modern logistics and manufacturing parks along the M606 corridor',
      'City-centre civic and educational buildings',
    ],
    operatingConditions: [
      { title: 'Heritage building fabric and listed constraints', detail: 'Stone masonry, timber-joist floorplates and retrofitted M&E require sympathetic planned maintenance.' },
      { title: 'M606 / M62 arterial connectivity', detail: 'Euroway logistics sites require responsive attendance and out-of-hours coverage.' },
    ],
    sectors: ['Manufacturing and engineering', 'Logistics and distribution', 'Corporate offices', 'Education and public sector'],
    travelPattern: 'Bradford and the Aire Valley including Shipley, Bingley, Keighley and direct connectivity to Leeds.',
    imageSlug: null,
  },

  bolton: {
    name: 'Bolton',
    slug: 'bolton',
    region: 'Greater Manchester North',
    searchDemand: { impressions: 980, avgPosition: 29.0 },
    positioning: 'Bolton is a key Greater Manchester industrial and commercial hub, combining large retail parks, manufacturing estates and town-centre regeneration.',
    districts: [
      { name: 'Middlebrook (BL6)', note: 'One of the UK’s largest integrated retail, leisure and business parks.' },
      { name: 'Town centre (BL1)', note: 'Commercial offices, civic buildings and professional services.' },
      { name: 'Wingates and Lostock (BL5, BL6)', note: 'Major industrial manufacturing and distribution estates.' },
      { name: 'Farnworth and Moses Gate (BL4)', note: 'Manufacturing, trade parks and transport facilities.' },
    ],
    propertyStock: [
      'Out-of-town business park offices and large retail format',
      'Industrial manufacturing plants and distribution warehouses',
      'Victorian mill conversions and commercial workspace',
    ],
    operatingConditions: [
      { title: 'Retail park footfall and public safety', detail: 'High customer footfall demands rigorous emergency lighting, fire safety and grounds upkeep.' },
      { title: 'Industrial plant and HVAC reliability', detail: 'Continuous manufacturing processes along the M61 require robust planned preventative maintenance.' },
    ],
    sectors: ['Retail and commercial leisure', 'Manufacturing and engineering', 'Logistics and distribution', 'Corporate offices'],
    travelPattern: 'Bolton, Horwich, Farnworth, Westhoughton and seamless integration across Greater Manchester.',
    imageSlug: null,
  },

  bury: {
    name: 'Bury',
    slug: 'bury',
    region: 'Greater Manchester North East',
    searchDemand: { impressions: 850, avgPosition: 31.0 },
    positioning: 'Bury provides a robust industrial base across paper, chemical and precision manufacturing alongside bustling town-centre retail and commerce.',
    districts: [
      { name: 'Town centre and The Rock (BL9)', note: 'High-density retail, civic and commercial office facilities.' },
      { name: 'Pilsworth and Roach Bank (BL9)', note: 'Large-scale industrial, distribution and retail logistics adjacent to the M66.' },
      { name: 'Radcliffe and Whitefield (M26, M45)', note: 'Manufacturing, trade parks and commercial workshops.' },
    ],
    propertyStock: [
      'Modern shopping and retail centre facilities',
      'Industrial manufacturing and chemical processing units',
      'Multi-tenant office developments and commercial yards',
    ],
    operatingConditions: [
      { title: 'M66 corridor logistics and manufacturing', detail: 'Scheduled PPM for heating, ventilation and three-phase power around shift handovers.' },
      { title: 'Statutory compliance across retail and manufacturing', detail: 'Water hygiene, fire safety systems and air quality testing.' },
    ],
    sectors: ['Manufacturing and processing', 'Retail and town-centre commercial', 'Logistics and trade', 'Public sector'],
    travelPattern: 'Bury, Radcliffe, Ramsbottom, Whitefield and Prestwich with direct links to Manchester.',
    imageSlug: null,
  },

  preston: {
    name: 'Preston',
    slug: 'preston',
    region: 'Central Lancashire',
    searchDemand: { impressions: 1100, avgPosition: 33.0 },
    positioning: 'Preston is Lancashire’s administrative and commercial centre, home to major aerospace supply chains, university estates and distribution hubs.',
    districts: [
      { name: 'City centre and Winckley Square (PR1)', note: 'Professional services, legal offices and heritage commercial stock.' },
      { name: 'Preston Docks and Riversway (PR2)', note: 'Business parks, leisure facilities and maritime commercial.' },
      { name: 'Red Scar and Roman Way (PR2)', note: 'Major industrial, manufacturing and logistics close to the M6.' },
      { name: 'Samlesbury Aerospace Enterprise Zone (PR5)', note: 'Advanced aerospace and high-security defense engineering.' },
    ],
    propertyStock: [
      'Advanced engineering and aerospace manufacturing facilities',
      'Modern business park office suites and data facilities',
      'University teaching and student accommodation estates',
      'Logistics and transport hubs along the M6/M55 junction',
    ],
    operatingConditions: [
      { title: 'High-specification cleanrooms and defense security', detail: 'Stringent access protocols, air filtration and environmental validation.' },
      { title: 'Strategic M6 connectivity', detail: 'Distribution and commercial fleets operating round-the-clock.' },
    ],
    sectors: ['Aerospace and advanced engineering', 'Higher education and research', 'Logistics and freight', 'Professional services and civic'],
    travelPattern: 'Preston, South Ribble, Leyland, Chorley and Lancashire corridors extending to Blackpool and Lancaster.',
    imageSlug: null,
  },

  wigan: {
    name: 'Wigan',
    slug: 'wigan',
    region: 'Greater Manchester West',
    searchDemand: { impressions: 920, avgPosition: 27.0 },
    positioning: 'Wigan is a key strategic distribution and food manufacturing hub positioned at the crossroads of the M6 and M58 motorways.',
    districts: [
      { name: 'Pemberton and Westwood Park (WN3, WN5)', note: 'Modern commercial offices and business parks.' },
      { name: 'Locketts Bridge and South Lancashire Industrial Estate (WN4)', note: 'Logistics, heavy warehousing and manufacturing.' },
      { name: 'Martland Park (WN5)', note: 'Food processing, manufacturing and specialized cold storage.' },
      { name: 'Town centre and Wallgate (WN1)', note: 'Commercial offices, retail and civic facilities.' },
    ],
    propertyStock: [
      'Food-grade production facilities with specialized hygiene requirements',
      'Large logistics distribution centres and ambient warehouses',
      'Commercial trade counters and engineering workshops',
    ],
    operatingConditions: [
      { title: 'Food processing hygiene and refrigeration maintenance', detail: 'Temperature monitoring, chillers and strict hygiene protocols.' },
      { title: 'Heavy freight access and loading equipment', detail: 'Continuous maintenance of dock levellers, rapid shutters and yard lighting.' },
    ],
    sectors: ['Food manufacturing and cold chain', 'Logistics and distribution', 'Manufacturing', 'Commercial offices'],
    travelPattern: 'Wigan, Leigh, Ashton-in-Makerfield, Standish and direct access to both Manchester and Liverpool.',
    imageSlug: null,
  },

  oxford: {
    name: 'Oxford',
    slug: 'oxford',
    region: 'Oxfordshire and the Thames Valley',
    searchDemand: { impressions: 1650, avgPosition: 36.0 },
    positioning: 'Oxford’s commercial estate is world-renowned for life sciences, biotechnology, science parks and prestigious educational and heritage property.',
    districts: [
      { name: 'Oxford Science Park and Begbroke (OX4, OX5)', note: 'Biotechnology, life sciences, laboratories and cleanrooms.' },
      { name: 'Milton Park and Harwell Campus (OX14, OX11)', note: 'Science, technology, quantum computing and energy research.' },
      { name: 'City centre and University Quarter (OX1)', note: 'Historic university colleges, libraries and conservation offices.' },
      { name: 'Cowley and Oxford Business Park (OX4)', note: 'Automotive manufacturing, corporate headquarters and tech space.' },
    ],
    propertyStock: [
      'Specialist laboratory and clinical research buildings with containment ventilation',
      'High-specification science park office and lab hybrid facilities',
      'Listed heritage architecture with severe planning and access constraints',
      'Automotive manufacturing and assembly plants',
    ],
    operatingConditions: [
      { title: 'Critical lab environments and HVAC validation', detail: 'Fume extraction, temperature control, HEPA filtration and medical gases require zero downtime.' },
      { title: 'Zero Emission Zone (ZEZ) and historic congestion', detail: 'Central Oxford vehicle restrictions dictate strict logistical attendance windows.' },
      { title: 'Strict compliance and asset management', detail: 'Auditable statutory records for pharmaceutical, research and university clients.' },
    ],
    sectors: ['Life sciences and biotechnology', 'Higher education and academic research', 'Advanced technology and automotive', 'Heritage and corporate offices'],
    travelPattern: 'Oxford and Oxfordshire including Abingdon, Didcot, Bicester, Witney and the wider Thames Valley corridor.',
    imageSlug: null,
  },

  telford: {
    name: 'Telford',
    slug: 'telford',
    region: 'Shropshire and the West Midlands West',
    searchDemand: { impressions: 1050, avgPosition: 35.0 },
    positioning: 'Telford is Shropshire’s industrial and manufacturing powerhouse, supporting automotive supply chains, plastics, electronics and defense engineering.',
    districts: [
      { name: 'Stafford Park (TF3)', note: 'Major industrial, manufacturing and commercial trade park.' },
      { name: 'Halesfield (TF7)', note: 'Plastics, metal fabrication and heavy manufacturing.' },
      { name: 'Hortonwood (TF1)', note: 'Automotive manufacturing, electronics and food technology.' },
      { name: 'Telford Town Centre and Southwater (TF3)', note: 'Modern commercial offices, convention centres and retail.' },
    ],
    propertyStock: [
      'High-specification automotive manufacturing plants',
      'Plastics, extrusion and industrial fabrication facilities',
      'Commercial office buildings and conference venues',
      'Logistics distribution units along the M54 corridor',
    ],
    operatingConditions: [
      { title: 'Manufacturing shift patterns and production uptime', detail: 'Plant room and electrical maintenance planned to minimize production stops.' },
      { title: 'Compressed air, extraction and power systems', detail: 'Statutory testing of pressure systems, LEV and high-voltage switchgear.' },
    ],
    sectors: ['Automotive and precision engineering', 'Plastics and industrial manufacturing', 'Commercial offices and exhibitions', 'Logistics and distribution'],
    travelPattern: 'Telford and Shropshire including Shrewsbury, Newport, Bridgnorth and direct M54 connection to the West Midlands.',
    imageSlug: null,
  },

  grimsby: {
    name: 'Grimsby',
    slug: 'grimsby',
    region: 'North East Lincolnshire and the Humber',
    searchDemand: { impressions: 720, avgPosition: 30.0 },
    positioning: 'Grimsby is a global leader in offshore renewable energy operations, port logistics, cold storage and food processing.',
    districts: [
      { name: 'Port of Grimsby and Docks (DN31)', note: 'Offshore wind O&M bases, maritime freight and port facilities.' },
      { name: 'Europarc (DN37)', note: 'Flagship business and food manufacturing park.' },
      { name: 'South Humberside Industrial Estate (DN31)', note: 'Chemical, industrial manufacturing and logistics.' },
      { name: 'Immingham and Killingholme (DN40)', note: 'Major petrochemical refining, bulk port handling and logistics.' },
    ],
    propertyStock: [
      'Cold storage and temperature-controlled food processing units',
      'Port-side marine and renewable energy maintenance hubs',
      'Chemical and heavy industrial processing facilities',
    ],
    operatingConditions: [
      { title: 'Refrigeration and cold-chain resilience', detail: 'Critical chillers, ammonia systems and continuous temperature monitoring.' },
      { title: 'Marine and coastal corrosion protection', detail: 'Salt air and exposure require aggressive planned fabric and plant maintenance.' },
    ],
    sectors: ['Renewable energy and marine', 'Food processing and cold storage', 'Chemicals and port logistics', 'Commercial trade'],
    travelPattern: 'Grimsby, Cleethorpes, Immingham, Scunthorpe and the Humber Energy Estuary.',
    imageSlug: null,
  },

  matlock: {
    name: 'Matlock',
    slug: 'matlock',
    region: 'Derbyshire Dales',
    searchDemand: { impressions: 450, avgPosition: 25.0 },
    positioning: 'Matlock is the administrative heart of the Derbyshire Dales, combining quarrying, tourism, light manufacturing and heritage commercial property.',
    districts: [
      { name: 'Town centre and Crown Square (DE4)', note: 'County civic headquarters, commercial offices and retail.' },
      { name: 'Cawdor Quarry and Matlock Green (DE4)', note: 'Commercial redevelopments and trade facilities.' },
      { name: 'Bakewell and Wirksworth corridors (DE45, DE4)', note: 'Food processing, engineering, tourism and heritage estates.' },
    ],
    propertyStock: [
      'Stone civic and heritage office buildings',
      'Light manufacturing and mineral processing facilities',
      'Hospitality and commercial tourism estates',
    ],
    operatingConditions: [
      { title: 'Rural Peak District access and travel', detail: 'Weather resilience and winter planning across upland routes.' },
      { title: 'Heritage building fabric care', detail: 'Specialist stonework, roofing and conservation compliance.' },
    ],
    sectors: ['Public sector and civic', 'Tourism and hospitality', 'Light manufacturing and quarrying', 'Commercial retail'],
    travelPattern: 'Matlock, Bakewell, Wirksworth, Ashbourne and the Peak District National Park.',
    imageSlug: null,
  },

  midlands: {
    name: 'Midlands',
    slug: 'midlands',
    region: 'the West and East Midlands',
    searchDemand: { impressions: 3200, avgPosition: 42.0 },
    positioning: 'The Midlands is the industrial heartland and logistics golden triangle of the UK, demanding multi-site facilities management across major motorway corridors.',
    districts: [
      { name: 'M1 and M6 Golden Triangle', note: 'National logistics distribution centres and supply-chain hubs.' },
      { name: 'West Midlands Conurbation (Birmingham, Black Country, Coventry)', note: 'Dense industrial, manufacturing and commercial offices.' },
      { name: 'East Midlands Growth Corridor (Nottingham, Derby, Leicester)', note: 'Advanced engineering, life sciences and aerospace.' },
    ],
    propertyStock: [
      'Multi-site commercial and corporate office portfolios',
      'High-bay logistics and distribution centres',
      'Automotive, aerospace and heavy industrial manufacturing works',
    ],
    operatingConditions: [
      { title: 'Multi-site estate consistency and unified SLA', detail: 'Centralized CAFM reporting, consolidated compliance tracking and single contract accountability.' },
      { title: '24/7 reactive cover across major motorways', detail: 'Mobile engineering units deployed across M1, M6, M42 and A38 corridors.' },
    ],
    sectors: ['Logistics and distribution', 'Automotive and advanced manufacturing', 'Commercial offices and managing agents', 'Healthcare and public sector'],
    travelPattern: 'Comprehensive Midlands-wide coverage spanning Birmingham, Nottingham, Derby, Leicester, Coventry, Stoke and surrounding counties.',
    imageSlug: null,
  },
};

export const TIER1_CITY_LIST = Object.values(TIER1_CITIES);
