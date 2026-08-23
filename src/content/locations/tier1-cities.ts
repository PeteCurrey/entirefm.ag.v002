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
};

export const TIER1_CITY_LIST = Object.values(TIER1_CITIES);
