export interface ContractorLocation {
  slug: string;
  name: string;
  county: string;
  region: string;
  tier: 1 | 2 | 3;
  status: "ACTIVE_NETWORK" | "EXPANSION_ZONE";
  heroImage: string;
  heroImageAlt: string;
  headline: string;
  subheadline: string;
  intro: string;
  commercialLandscape: {
    overview: string;
    keyCorridors: string[];
    propertySectors: Array<{ title: string; desc: string }>;
  };
  surroundingAreas: string[];
  activeDisciplines: Array<{
    name: string;
    tradeSlug: string;
    recruitmentStatus: "HIGH_DEMAND" | "ACTIVE_RECRUITMENT" | "ESTABLISHED";
    scopeDesc: string;
  }>;
  sampleWorkOrder: {
    title: string;
    ref: string;
    location: string;
    poValue: string;
    scope: string;
  };
  faqs: Array<{ question: string; answer: string }>;
}

export interface TradeLocationPairing {
  locationSlug: string;
  tradeSlug: string;
  locationName: string;
  tradeName: string;
  heroImage: string;
  heroImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subheadline: string;
  intro: string;
  localCommercialContext: string;
  keyCompliance: Array<{
    category: string;
    items: string[];
    mandatoryType: "Statutory & Insurance" | "Trade Competency" | "Operational Standard";
  }>;
  sampleJob: {
    title: string;
    ref: string;
    location: string;
    poValue: string;
    scope: string;
  };
  faqs: Array<{ question: string; answer: string }>;
}

export const CONTRACTOR_LOCATIONS: Record<string, ContractorLocation> = {
  sheffield: {
    slug: "sheffield",
    name: "Sheffield",
    county: "South Yorkshire",
    region: "Yorkshire & the Humber",
    tier: 1,
    status: "ACTIVE_NETWORK",
    heroImage: "/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp",
    heroImageAlt: "Commercial facilities management survey over Sheffield city centre",
    headline: "Commercial Contractor Network in Sheffield",
    subheadline: "Operating platform, compliance management &amp; regional FM delivery.",
    intro: "EntireFM operates its operational core in South Yorkshire. We collaborate with specialist trade contractors across Sheffield, Rotherham, and the M1 corridor delivering scheduled maintenance and reactive commercial facilities management.",
    commercialLandscape: {
      overview: "Sheffield combines advanced manufacturing centres (Advanced Manufacturing Park / Catcliffe), multi-tenant city centre office buildings, Meadowhall retail quarter, and extensive logistics distribution hubs along the Don Valley and Sheffield Parkway corridors.",
      keyCorridors: ["Don Valley & Sheaf Valley", "Advanced Manufacturing Innovation District", "Sheffield Parkway Commercial Corridor", "City Centre Commercial & University Campus Zone"],
      propertySectors: [
        { title: "Advanced Manufacturing & Engineering", desc: "Specialist manufacturing plants requiring high-capacity electrical supplies, compressed air systems, and plantroom maintenance." },
        { title: "Corporate Offices & Multi-Let Hubs", desc: "Grade A office buildings requiring regular HVAC servicing, emergency lighting, fire alarm maintenance, and daily contract cleaning." },
        { title: "Logistics & Distribution Warehousing", desc: "High-bay distribution centres requiring high-level gutter clearing, dock leveller servicing, and industrial floor cleaning." },
      ],
    },
    surroundingAreas: ["Rotherham", "Chesterfield", "Barnsley", "Dronfield", "Worksop", "Doncaster"],
    activeDisciplines: [
      { name: "Electrical Contractors", tradeSlug: "electrical", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "Commercial EICR testing, distribution board upgrades, and reactive power faults." },
      { name: "HVAC Contractors", tradeSlug: "hvac", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "Chiller servicing, rooftop VRF air conditioning, and quarterly AHU filter PPM." },
      { name: "Mechanical Contractors", tradeSlug: "mechanical", recruitmentStatus: "ACTIVE_RECRUITMENT", scopeDesc: "LTHW booster pump overhauls, pressurisation units, and plantroom repairs." },
      { name: "Plumbing Contractors", tradeSlug: "plumbing", recruitmentStatus: "ACTIVE_RECRUITMENT", scopeDesc: "Commercial water boosters, unvented cylinders, and TMV statutory checks." },
      { name: "Commercial Cleaning", tradeSlug: "cleaning", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "Office daily cleaning rounds, industrial machine scrubbing, and builders cleans." },
      { name: "Roofing Contractors", tradeSlug: "roofing", recruitmentStatus: "ACTIVE_RECRUITMENT", scopeDesc: "Industrial valley gutter clearing, flat roof repairs, and height safety surveys." },
    ],
    sampleWorkOrder: {
      title: "Commercial Distribution Centre Main LV Panel EICR & Remedials",
      ref: "WO-SHF-8812",
      location: "Sheffield Logistics Park, S9",
      poValue: "£1,750.00 PO",
      scope: "Carry out 5-year periodic electrical inspection across 3 sub-distribution boards. Replace 2 damaged contactors and issue digital certification with photo evidence.",
    },
    faqs: [
      {
        question: "Does EntireFM operate an active contractor network in Sheffield?",
        answer: "Yes. Sheffield and South Yorkshire form one of EntireFM's primary operating heartlands, supporting multiple corporate clients, industrial complexes, and commercial properties throughout the city and surrounding M1 corridor.",
      },
      {
        question: "What trades are currently being recruited in Sheffield?",
        answer: "We are actively onboarding commercial Electrical, HVAC, Mechanical, Plumbing, Commercial Cleaning, Roofing, and Drainage contractors across Sheffield, Rotherham, and Chesterfield.",
      },
      {
        question: "How does EntireFM allocate work to Sheffield contractors?",
        answer: "Work orders are dispatched based on trade competency, compliance verification in our Document Vault, geographical proximity, operative availability, and track record. Payment of membership (£295/yr) provides the operating platform; work dispatch remains merit-based without guarantees.",
      },
    ],
  },
  manchester: {
    slug: "manchester",
    name: "Manchester",
    county: "Greater Manchester",
    region: "North West",
    tier: 1,
    status: "ACTIVE_NETWORK",
    heroImage: "/images/editorial/entirefm-hvac-plant-deck-2000w.webp",
    heroImageAlt: "Commercial HVAC plant deck in Greater Manchester commercial zone",
    headline: "Commercial Contractor Network in Manchester",
    subheadline: "Connecting qualified trade contractors across Greater Manchester.",
    intro: "EntireFM manages commercial facilities across Greater Manchester, from central commercial towers in Spinningfields and MediaCityUK to industrial estates across Trafford Park and Stockport.",
    commercialLandscape: {
      overview: "Greater Manchester is the largest commercial and industrial property market in the North of England, characterized by premier Grade A office developments, high-density residential towers, and massive logistics hubs.",
      keyCorridors: ["Trafford Park & Logistics Gateway", "Spinningfields & Central Business District", "Salford Quays & MediaCityUK", "Stockport & South Manchester Commercial Belt"],
      propertySectors: [
        { title: "Commercial Towers & Office Campuses", desc: "Major corporate HQs requiring complex VRF/chiller maintenance, fire alarm matrix testing, and access control." },
        { title: "Industrial Parks & Warehousing", desc: "Heavy industrial and logistics facilities requiring high-pressure drainage jetting, high-level roof repairs, and booster pump maintenance." },
        { title: "Retail & Leisure Plazas", desc: "Busy consumer and retail destinations needing out-of-hours deep cleaning, reactive plumbing, and electrical emergency repairs." },
      ],
    },
    surroundingAreas: ["Salford", "Stockport", "Trafford", "Bolton", "Bury", "Oldham", "Rochdale", "Altrincham"],
    activeDisciplines: [
      { name: "Mechanical Contractors", tradeSlug: "mechanical", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "Chilled water circulation pumps, plate heat exchangers, and boiler plantrooms." },
      { name: "Electrical Contractors", tradeSlug: "electrical", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "Commercial switchgear, emergency lighting discharge testing, and power remedials." },
      { name: "HVAC Contractors", tradeSlug: "hvac", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "F-Gas quarterly inspections, rooftop chillers, and AHU inverter maintenance." },
      { name: "Commercial Cleaning", tradeSlug: "cleaning", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "High-spec corporate office cleaning, floor restoration, and builders cleans." },
      { name: "Fire & Security", tradeSlug: "fire-security", recruitmentStatus: "ACTIVE_RECRUITMENT", scopeDesc: "BS5839 fire alarms, access control gates, and CCTV maintenance." },
    ],
    sampleWorkOrder: {
      title: "Commercial Plantroom Chilled Water Pump Overhaul & Inverter Calibration",
      ref: "WO-MCR-9402",
      location: "Trafford Park Industrial Estate, Manchester M17",
      poValue: "£2,450.00 PO",
      scope: "Isolate primary chilled water loop. Replace dual mechanical seal on Armstrong pump, test VSD telemetry, and re-commission with water glycol concentration check.",
    },
    faqs: [
      {
        question: "What types of commercial clients does EntireFM serve in Greater Manchester?",
        answer: "We support corporate office portfolios, manufacturing plants in Trafford Park, retail developments, and multi-tenant commercial properties across Manchester, Salford, and Stockport.",
      },
      {
        question: "What compliance standards are expected for Manchester contractors?",
        answer: "Contractors must maintain £5m–£10m Public Liability insurance, valid SSIP membership (CHAS/SafeContractor), trade cards (ECS/CSCS/JIB), and task-specific RAMS logged in the EntireFM Document Vault.",
      },
    ],
  },
  leeds: {
    slug: "leeds",
    name: "Leeds",
    county: "West Yorkshire",
    region: "Yorkshire & the Humber",
    tier: 1,
    status: "ACTIVE_NETWORK",
    heroImage: "/images/editorial/entirefm-plumbing-booster-set-2000w.webp",
    heroImageAlt: "Commercial plumbing booster system in Leeds commercial district",
    headline: "Commercial Contractor Network in Leeds",
    subheadline: "Facilities management supply chain &amp; operating platform across West Yorkshire.",
    intro: "EntireFM collaborates with established trade contractors throughout Leeds, Bradford, and the West Yorkshire commercial belt, delivering planned preventive maintenance and reactive building repairs.",
    commercialLandscape: {
      overview: "Leeds is one of the UK's major financial and legal centres, supported by extensive industrial clusters across the Aire Valley, Morley, and Kirkstall corridors.",
      keyCorridors: ["Aire Valley Enterprise Zone", "Leeds City Centre Financial Quarter", "M621 / M1 Junction 45 Industrial Corridor", "North West Leeds Technology Parks"],
      propertySectors: [
        { title: "Financial & Professional Services Offices", desc: "Demanding high-spec corporate environments requiring precise climate control, pristine cleaning, and zero-disruption electrical maintenance." },
        { title: "Aire Valley Logistics & Manufacturing", desc: "Substantial industrial facilities requiring heavy mechanical maintenance, roof inspections, and drainage interceptor servicing." },
      ],
    },
    surroundingAreas: ["Bradford", "Wakefield", "Huddersfield", "Halifax", "Harrogate", "Morley"],
    activeDisciplines: [
      { name: "Plumbing Contractors", tradeSlug: "plumbing", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "Potable booster sets, unvented hot water systems, and reactive leak diagnostics." },
      { name: "Electrical Contractors", tradeSlug: "electrical", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "EICR inspections, LED lighting retrofits, and emergency lighting repairs." },
      { name: "HVAC Contractors", tradeSlug: "hvac", recruitmentStatus: "ACTIVE_RECRUITMENT", scopeDesc: "AHU maintenance, VRV systems, and F-Gas statutory leak checks." },
      { name: "Fabric Maintenance", tradeSlug: "fabric-maintenance", recruitmentStatus: "ACTIVE_RECRUITMENT", scopeDesc: "Fire door remediations (Building Safety Act), suspended ceilings, and joinery." },
    ],
    sampleWorkOrder: {
      title: "Potable Water Booster Pump Transducer Fault & Valve Replacement",
      ref: "WO-LDS-7321",
      location: "Wellington Place Commercial Zone, Leeds LS1",
      poValue: "£820.00 PO",
      scope: "Investigate pressure hunting on Lowara booster set. Replace faulty pressure sensor, replace 2" isolation ball valve, and test automatic pump rotation cycle.",
    },
    faqs: [
      {
        question: "Does EntireFM cover all of West Yorkshire?",
        answer: "Yes. Our contractor network spans Leeds, Bradford, Wakefield, Huddersfield, and the wider M62 / M1 corridor.",
      },
      {
        question: "How quickly are emergency work orders dispatched in Leeds?",
        answer: "Reactive work orders are dispatched digitally through the Contractor Portal in real-time to approved contractors with active coverage and verified compliance in that postcode.",
      },
    ],
  },
  nottingham: {
    slug: "nottingham",
    name: "Nottingham",
    county: "Nottinghamshire",
    region: "East Midlands",
    tier: 1,
    status: "ACTIVE_NETWORK",
    heroImage: "/images/editorial/entirefm-reception-2000w.webp",
    heroImageAlt: "Commercial reception and corporate facilities standard in Nottingham",
    headline: "Commercial Contractor Network in Nottingham",
    subheadline: "Commercial facilities management network across the East Midlands.",
    intro: "EntireFM delivers commercial facilities management services across Nottingham, Derby, and the East Midlands corridor, partnering with vetted trade businesses for planned and reactive works.",
    commercialLandscape: {
      overview: "Nottingham combines historic commercial districts, life-science innovation parks (BioCity), major retail hubs, and busy industrial corridors along the A52 and M1 Junction 24–26.",
      keyCorridors: ["A52 Nottingham–Derby Commercial Arc", "M1 Logistics & Distribution Hubs", "Nottingham City Centre Office Quarter", "Science & Innovation Campuses"],
      propertySectors: [
        { title: "Life Sciences & Innovation Parks", desc: "High-spec laboratory and technology spaces requiring meticulous cleaning standards, clean ventilation, and resilient power." },
        { title: "East Midlands Distribution Hubs", desc: "Large logistics centres requiring 24/7 reactive maintenance, grounds upkeep, and roof water management." },
      ],
    },
    surroundingAreas: ["Derby", "Mansfield", "Newark", "Loughborough", "Grantham", "Long Eaton"],
    activeDisciplines: [
      { name: "Commercial Cleaning", tradeSlug: "cleaning", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "Corporate daily cleaning, laboratory sanitisation, and window cleaning." },
      { name: "Grounds Maintenance", tradeSlug: "grounds-maintenance", recruitmentStatus: "HIGH_DEMAND", scopeDesc: "Business park landscaping, hedge pruning, weed spraying, and gritting." },
      { name: "Electrical Contractors", tradeSlug: "electrical", recruitmentStatus: "ACTIVE_RECRUITMENT", scopeDesc: "Commercial lighting, testing and inspection, and electrical repairs." },
      { name: "HVAC Contractors", tradeSlug: "hvac", recruitmentStatus: "ACTIVE_RECRUITMENT", scopeDesc: "Split AC units, VRF systems, and commercial heating plant." },
    ],
    sampleWorkOrder: {
      title: "Commercial Office Park Full Floor Deep Clean & Machine Scrub",
      ref: "WO-NTG-6190",
      location: "NG2 Business Park, Nottingham NG2",
      poValue: "£1,420.00 PO",
      scope: "Execute deep sanitisation and machine scrub across 950m² office floor. Apply anti-static floor seal, steam clean washroom tiling, and complete digital sign-off.",
    },
    faqs: [
      {
        question: "Does EntireFM cover both Nottingham and Derby?",
        answer: "Yes. Our East Midlands regional network covers Nottingham, Derby, Mansfield, and surrounding commercial corridors.",
      },
      {
        question: "What accreditations are required for cleaning contractors in Nottingham?",
        answer: "Cleaning contractors must provide £5m+ Public Liability insurance, COSHH safety assessments for chemicals used, and evidence of BICSc or equivalent hygiene standards.",
      },
    ],
  },
};

export const TRADE_LOCATION_PAIRINGS: Record<string, TradeLocationPairing> = {
  "sheffield/electrical": {
    locationSlug: "sheffield",
    tradeSlug: "electrical",
    locationName: "Sheffield",
    tradeName: "Electrical",
    heroImage: "/images/editorial/entirefm-distribution-board-testing-2000w.webp",
    heroImageAlt: "Commercial electrician testing distribution board in Sheffield",
    metaTitle: "Electrical Contractors in Sheffield | EntireFM Contractor Network",
    metaDescription: "Join the EntireFM Electrical Contractor Network in Sheffield. Manage 18th Edition credentials, EICR compliance, electrical RAMS, and commercial FM work orders.",
    headline: "Electrical Contractors in Sheffield",
    subheadline: "Commercial FM operating platform &amp; electrical network in South Yorkshire.",
    intro: "EntireFM is expanding its network of qualified commercial electrical contractors across Sheffield, Rotherham, and the Don Valley corridor. Manage your compliance, access calibrated tester logs, and receive applicable commercial work orders.",
    localCommercialContext: "Sheffield's commercial landscape spans high-load industrial plants in the Lower Don Valley and Advanced Manufacturing Park, Grade A offices across Sheffield city centre, and logistics hubs along the Parkway. Electrical contractors require verified 18th Edition competence, EICR testing capability, and strict Safe Isolation (LOTO) protocols.",
    keyCompliance: [
      {
        category: "Insurance & Scheme Membership",
        mandatoryType: "Statutory & Insurance",
        items: ["Public Liability Insurance (£5m minimum, £10m for industrial sites)", "NICEIC Approved Contractor or NAPIT Registration", "Valid SSIP Accreditation (CHAS / SafeContractor)"],
      },
      {
        category: "Operative Competency",
        mandatoryType: "Trade Competency",
        items: ["18th Edition BS 7671 certification", "City & Guilds 2391 Inspection & Testing", "JIB / ECS Gold Card for attending engineers"],
      },
      {
        category: "Safety Protocols",
        mandatoryType: "Operational Standard",
        items: ["Calibrated multi-function tester certificates", "Lock-Out Tag-Out (LOTO) safe isolation RAMS", "Asbestos awareness for pre-2000 properties"],
      },
    ],
    sampleJob: {
      title: "Commercial Office 5-Year EICR Periodic Inspection & Remedials",
      ref: "WO-SHF-ELEC-412",
      location: "St Paul's Place Commercial Tower, Sheffield S1",
      poValue: "£1,650.00 PO",
      scope: "Perform 100% inspection and testing on 4 three-phase sub-boards. Rectify C2 thermal overloads, replace worn RCBOs, and issue digital EICR certificate.",
    },
    faqs: [
      {
        question: "What electrical work orders are issued in Sheffield?",
        answer: "Work includes commercial EICR testing, emergency lighting 3-hour tests, distribution board replacements, LED retrofits, and 24/7 reactive power outage repairs across Sheffield, Rotherham, and Barnsley.",
      },
      {
        question: "Do Sheffield electrical contractors need to hold NICEIC accreditation?",
        answer: "Holding NICEIC, NAPIT, or ECA accreditation demonstrates verified competency to our commercial clients and is the standard requirement for high-integrity commercial work orders.",
      },
    ],
  },
  "sheffield/hvac": {
    locationSlug: "sheffield",
    tradeSlug: "hvac",
    locationName: "Sheffield",
    tradeName: "HVAC",
    heroImage: "/images/editorial/entirefm-hvac-plant-deck-2000w.webp",
    heroImageAlt: "Commercial HVAC plant deck overlooking Sheffield industrial zone",
    metaTitle: "HVAC Contractors in Sheffield | Air Conditioning & Ventilation Network | EntireFM",
    metaDescription: "Join the EntireFM HVAC Contractor Network in Sheffield. Manage Refcom/F-Gas compliance, rooftop chiller RAMS, AHU maintenance, and commercial FM work orders.",
    headline: "HVAC Contractors in Sheffield",
    subheadline: "Commercial air conditioning, chiller &amp; AHU operating platform in South Yorkshire.",
    intro: "Partner with EntireFM for commercial HVAC, air conditioning, and ventilation maintenance across Sheffield, Chesterfield, and the M1 corridor. Centralise F-Gas tracking and receive commercial work orders.",
    localCommercialContext: "From clean-air laboratory ventilation in Sheffield's university medical hubs to heavy rooftop chiller packages across Meadowhall and Don Valley corporate campuses, HVAC contractors require Refcom Elite standards, Working at Height safety, and rigorous refrigerant log management.",
    keyCompliance: [
      {
        category: "F-Gas & Company Certification",
        mandatoryType: "Trade Competency",
        items: ["Refcom Elite or Bureau Veritas Company F-Gas Certificate", "City & Guilds 2079 / BESA F-Gas Cat 1 for all engineers", "Hazardous waste transfer licence for recovered refrigerant"],
      },
      {
        category: "Insurance & Height Safety",
        mandatoryType: "Statutory & Insurance",
        items: ["Public Liability Insurance (£5m–£10m)", "Working at Height certification for rooftop plant decks", "IPAF 3a/3b for high-level cassette maintenance"],
      },
      {
        category: "Operational Standards",
        mandatoryType: "Operational Standard",
        items: ["Calibrated refrigerant scales and manifold gauges", "Task-specific rooftop access & wind threshold RAMS", "Digital leak test and asset log completion"],
      },
    ],
    sampleJob: {
      title: "Rooftop VRV Condenser Leak Test & AHU Filter Quarterly Service",
      ref: "WO-SHF-HVAC-309",
      location: "Meadowhall Trade & Retail Zone, Sheffield S9",
      poValue: "£1,280.00 PO",
      scope: "Carry out statutory F-Gas leak check on 3 Daikin VRV systems. Replace primary and secondary bag filters on AHU-01, inspect belt tension, and record airflow telemetry.",
    },
    faqs: [
      {
        question: "What F-Gas reporting is required for Sheffield HVAC jobs?",
        answer: "Contractors must upload digital F-Gas leak testing certificates and cylinder movement records directly through the EntireFM Contractor Portal upon job completion.",
      },
      {
        question: "What areas around Sheffield are included for HVAC coverage?",
        answer: "The Sheffield HVAC network covers Sheffield, Rotherham, Chesterfield, Barnsley, Doncaster, and the M1 corridor.",
      },
    ],
  },
  "manchester/mechanical": {
    locationSlug: "manchester",
    tradeSlug: "mechanical",
    locationName: "Manchester",
    tradeName: "Mechanical",
    heroImage: "/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp",
    heroImageAlt: "Commercial mechanical plantroom pump set in Greater Manchester",
    metaTitle: "Mechanical Contractors in Manchester | Commercial M&E Network | EntireFM",
    metaDescription: "Join the EntireFM Mechanical Contractor Network in Manchester. Manage plantroom compliance, booster pumps, mechanical RAMS, and commercial FM work orders.",
    headline: "Mechanical Contractors in Manchester",
    subheadline: "Commercial plantroom engineering, pump sets &amp; mechanical FM network.",
    intro: "Join EntireFM's commercial mechanical network in Greater Manchester. Manage lifting plans, store operative trade cards, and receive commercial plantroom work orders across Trafford Park and central Manchester.",
    localCommercialContext: "Greater Manchester's high-density commercial towers and massive industrial facilities in Trafford Park demand heavy mechanical competence — including commercial booster pump sets, chilled water loops, plate heat exchangers, and pressurisation units.",
    keyCompliance: [
      {
        category: "Insurance & Accreditations",
        mandatoryType: "Statutory & Insurance",
        items: ["Public Liability Insurance (£5m minimum, £10m preferred)", "BESA membership or equivalent building services scheme", "Valid SSIP Member Scheme accreditation"],
      },
      {
        category: "Operative Competency",
        mandatoryType: "Trade Competency",
        items: ["City & Guilds Mechanical Engineering / Building Services NVQ Level 3", "CSCS Skilled Worker / Mechanical Card", "Hot Works Passport & safe isolation competence"],
      },
      {
        category: "Plantroom Safety",
        mandatoryType: "Operational Standard",
        items: ["LOLER lifting gear inspection certificates", "Confined space & plantroom access RAMS", "Pressure testing and hydraulic isolation procedures"],
      },
    ],
    sampleJob: {
      title: "Commercial Chilled Water Pump Set Mechanical Seal Overhaul",
      ref: "WO-MCR-MECH-518",
      location: "Commercial Media Plaza, Salford Quays M50",
      poValue: "£2,100.00 PO",
      scope: "Isolate primary secondary CHW circuit. Dismantle Grundfos pump, install new silicon carbide mechanical seals, laser-align coupling, and re-commission under full system load.",
    },
    faqs: [
      {
        question: "What types of mechanical jobs are allocated in Manchester?",
        answer: "Work orders include pump replacements, pressurisation unit servicing, expansion vessel statutory testing, plate heat exchanger descaling, and commercial plantroom refurbishments.",
      },
      {
        question: "What safety permits are required for Manchester plantrooms?",
        answer: "Contractors must provide task-specific RAMS covering mechanical isolations, hot works permits (if brazing/welding), and heavy lifting plans for motor removals.",
      },
    ],
  },
  "leeds/plumbing": {
    locationSlug: "leeds",
    tradeSlug: "plumbing",
    locationName: "Leeds",
    tradeName: "Plumbing",
    heroImage: "/images/editorial/entirefm-plumbing-booster-set-2000w.webp",
    heroImageAlt: "Commercial plumbing booster system in Leeds",
    metaTitle: "Plumbing Contractors in Leeds | Commercial Water Services Network | EntireFM",
    metaDescription: "Join the EntireFM Plumbing Contractor Network in Leeds. Manage WRAS compliance, water hygiene, commercial booster RAMS, and reactive FM work orders.",
    headline: "Plumbing Contractors in Leeds",
    subheadline: "Commercial water systems, booster pumps &amp; reactive FM network in West Yorkshire.",
    intro: "EntireFM is onboarding commercial plumbing contractors across Leeds, Bradford, and West Yorkshire. Manage WRAS credentials, unvented G3 certificates, and receive commercial FM work orders.",
    localCommercialContext: "Commercial offices and retail centres across Leeds City Centre and the Aire Valley require rapid, dependable commercial plumbing response — covering multi-pump potable booster sets, commercial unvented calorifiers, TMV testing, and major escape-of-water investigations.",
    keyCompliance: [
      {
        category: "Insurance & Accreditations",
        mandatoryType: "Statutory & Insurance",
        items: ["Public Liability Insurance (£5m minimum, £10m for large facilities)", "WaterSafe / WRAS Approved Plumber Scheme registration", "CIPHE or APHC trade membership"],
      },
      {
        category: "Operative Qualifications",
        mandatoryType: "Trade Competency",
        items: ["NVQ Level 2/3 Plumbing and Heating / JIB-PMES Card", "Unvented Hot Water Storage Systems (G3 Building Regulations)", "Legionella Awareness (ACOP L8 / HSG274)"],
      },
      {
        category: "Operational Standards",
        mandatoryType: "Operational Standard",
        items: ["Water isolation and dynamic risk assessment procedures", "WRAS-approved replacement fittings and backflow preventers", "Photo evidence capture and digital sign-off"],
      },
    ],
    sampleJob: {
      title: "Commercial Potable Water Booster VSD Inverter Calibration & Check",
      ref: "WO-LDS-PLUMB-622",
      location: "Financial Quarter Commercial Plaza, Leeds LS1",
      poValue: "£750.00 PO",
      scope: "Investigate low pressure alarm on 3-pump booster set. Replace faulty pressure sensor, calibrate inverter setpoints, and verify smooth pump staging.",
    },
    faqs: [
      {
        question: "What response times are expected for reactive plumbing in Leeds?",
        answer: "Standard reactive jobs operate on 4-hour or 24-hour response SLAs depending on client severity (e.g. active water ingress vs routine fixture repair).",
      },
      {
        question: "How does the Contractor Portal assist plumbing contractors in Leeds?",
        answer: "The mobile-responsive portal lets plumbers view job scopes, review site access notes, upload before/after photos, and obtain digital customer sign-offs on site.",
      },
    ],
  },
  "nottingham/cleaning": {
    locationSlug: "nottingham",
    tradeSlug: "cleaning",
    locationName: "Nottingham",
    tradeName: "Cleaning",
    heroImage: "/images/editorial/entirefm-reception-2000w.webp",
    heroImageAlt: "Commercial office cleaning standard in Nottingham",
    metaTitle: "Commercial Cleaning Contractors in Nottingham | EntireFM Contractor Network",
    metaDescription: "Join the EntireFM Commercial Cleaning Network in Nottingham. Manage BICSc standards, COSHH assessments, operative DBS vetting, and commercial FM cleaning work.",
    headline: "Commercial Cleaning Contractors in Nottingham",
    subheadline: "Commercial cleaning, corporate offices &amp; FM network in the East Midlands.",
    intro: "EntireFM delivers commercial cleaning across Nottingham, Derby, and the East Midlands. We partner with established commercial cleaning contractors managing daily office rounds, deep cleans, and specialist hygiene services.",
    localCommercialContext: "Commercial facilities in Nottingham — from NG2 Business Park corporate offices to high-spec life science campuses and logistics parks along the M1 — require disciplined commercial cleaning adhering to strict BICSc colour-coding and COSHH chemical controls.",
    keyCompliance: [
      {
        category: "Insurance & Accreditations",
        mandatoryType: "Statutory & Insurance",
        items: ["Public Liability Insurance (£5m minimum, £10m preferred)", "BICSc Corporate / Individual Membership", "Valid SSIP Accreditation (CHAS / SafeContractor)"],
      },
      {
        category: "Chemical Safety & COSHH",
        mandatoryType: "Trade Competency",
        items: ["COSHH Assessments & Safety Data Sheets (SDS) for all chemicals", "BICSc Colour-Coding Compliance (Red/Blue/Green/Yellow)", "PAT testing certificates on all rotary scrubbers & vacuums"],
      },
      {
        category: "Operative Vetting",
        mandatoryType: "Operational Standard",
        items: ["Basic/Enhanced DBS screening for operatives on sensitive sites", "Right to Work verification records in Document Vault", "Slip/Trip hazard control RAMS"],
      },
    ],
    sampleJob: {
      title: "Commercial Office Post-Refurbishment Deep Clean & Carpet Extraction",
      ref: "WO-NTG-CLEAN-214",
      location: "NG2 Business Park, Nottingham NG2",
      poValue: "£1,650.00 PO",
      scope: "Complete 2-stage deep clean across 1,100m² office floor. Hot water extraction clean on commercial carpet tiles, machine-scrub washrooms, and wipe all internal glazed partitions.",
    },
    faqs: [
      {
        question: "What types of cleaning contracts are managed in Nottingham?",
        answer: "Work ranges from daily office cleaning rounds and commercial window cleaning to post-construction builders cleans and periodic floor stripping/resealing.",
      },
      {
        question: "How are cleaning operatives vetted?",
        answer: "Cleaning contractors register their attending operatives in the EntireFM workforce matrix, attaching verified DBS certificates and training credentials.",
      },
    ],
  },
};
