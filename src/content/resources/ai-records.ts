/**
 * AI IN FACILITIES MANAGEMENT CONTENT RECORDS
 * ===========================================
 * Content records for the AI in FM Pillar and 10 supporting resource guides.
 * Grounded in practical UK engineering standards, statutory duty baselines,
 * commercial reality, and transparent technical capabilities.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';

export const AI_RESOURCES_CONTENT: Record<string, ContentRecord> = {
  '/resources/ai-in-facilities-management': {
    path: '/resources/ai-in-facilities-management',
    title: 'AI in Facilities Management: Practical Guide for FM Teams | Entire FM',
    metaDescription: 'An authoritative, fluff-free guide to artificial intelligence in commercial facilities management. Predictive maintenance, CAFM automation, energy analytics and governance.',
    h1: 'AI in Facilities Management',
    eyebrow: 'Technical & Operational Guide',
    heroIntro: 'A practical, engineering-led examination of artificial intelligence in commercial estate operations, facilities management software, and building maintenance.',
    heroDescription: 'Cutting through vendor marketing to explain what machine learning, language models, predictive analytics, and autonomous agents actually deliver for property managers, estates directors, and engineering teams today.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for AI applications in facilities management, commercial estate technology and building automation',
    primaryIntent: 'AI in facilities management',
    secondaryIntents: [
      'facilities management artificial intelligence',
      'AI FM guide',
      'smart building AI',
      'AI CAFM automation',
      'predictive maintenance AI'
    ],
    pageType: 'company',
    historicTopics: [
      'Artificial intelligence in FM',
      'Predictive maintenance',
      'CAFM automation',
      'Energy management AI',
      'Building operations technology'
    ],
    requiredSections: [
      'hero',
      'definitions',
      'practical-reality',
      'use-case-map',
      'interactive-work-order',
      'core-disciplines',
      'limitations',
      'readiness-pathway',
      'faq',
      'cta'
    ],
    sections: [
      {
        heading: 'What AI Actually Means in Building Operations',
        body: 'Facilities management software vendors frequently label standard rules-based triggers or basic cron schedules as "artificial intelligence". In reality, AI in FM encompasses distinct disciplines: supervised machine learning for anomaly detection, large language models for helpdesk triage and document retrieval, computer vision for facade inspections, and statistical predictive models for mean-time-between-failure analysis.'
      },
      {
        heading: 'Separating Marketing from Operational Reality',
        body: 'Autonomous self-healing buildings do not exist in standard commercial property. Practical AI delivers tangible value where high-volume, structured data already exists, such as triaging email work orders, spotting temperature drift across BMS sensors, and searching unstructured PDF compliance certificates. It does not replace physical engineering inspections, statutory certification, or trade craftsmanship.'
      }
    ],
    capabilities: [
      {
        name: 'Predictive & Condition-Based Maintenance',
        description: 'Vibration, temperature, and run-hour anomaly detection on critical HVAC and pumping plant to catch mechanical degradation before catastrophic failure.',
        tag: 'Asset Engineering'
      },
      {
        name: 'Helpdesk & Work Order Triage',
        description: 'Natural-language processing to classify tenant tickets, extract location and asset tags, assign urgency, and generate pre-scoped work orders.',
        tag: 'Operations'
      },
      {
        name: 'Energy & BMS Optimisation',
        description: 'Multi-variable regression models comparing weather forecasts, occupancy schedules, and thermal mass to eliminate out-of-hours energy waste.',
        tag: 'Sustainability'
      },
      {
        name: 'Compliance Document Intelligence',
        description: 'Automated extraction of expiry dates, remedial recommendations, and asset IDs from scanned statutory inspection certificates and EICRs.',
        tag: 'Statutory Safety'
      }
    ],
    faqs: [
      {
        question: 'Does AI replace planned preventative maintenance (PPM)?',
        answer: 'No. AI-driven predictive maintenance complements statutory and standard PPM schedules by identifying early failure indicators on monitored assets. It cannot legally or practically eliminate mandatory inspections required by UK law (such as LOLER lift examinations, BS 7671 electrical testing, or ACOP L8 water hygiene checks).'
      },
      {
        question: 'Can AI legally sign off compliance certificates?',
        answer: 'Absolutely not. Under UK safety legislation (including the Health and Safety at Work Act 1974 and the Regulatory Reform (Fire Safety) Order 2005), statutory certifications must be signed by an accredited, competent person (e.g. Gas Safe engineer, NICEIC electrician, or qualified fire risk assessor). AI is strictly an administrative and analytical aid.'
      },
      {
        question: 'What is the biggest barrier to deploying AI in FM?',
        answer: 'Data hygiene. Most commercial estates suffer from fragmented asset registers, inconsistent equipment naming, missing serial numbers, and unstandardised failure codes. Without clean, structured baseline data, AI algorithms generate false positives and incorrect routing.'
      },
      {
        question: 'How is EntireCAFM approaching AI capabilities?',
        answer: 'EntireCAFM is focused on practical, high-utility automation: automated helpdesk ticket classification, intelligent contractor routing, and automated compliance calendar reminders. We distinguish clearly between live features and long-term industry research.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in Facilities Management', url: '/resources/ai-in-facilities-management' }
    ],
    relatedRoutes: [
      '/resources/ai-in-facilities-management/predictive-maintenance',
      '/resources/ai-in-facilities-management/ai-helpdesk-work-orders',
      '/resources/ai-in-facilities-management/ai-cafm',
      '/resources/ai-in-facilities-management/energy-optimisation',
      '/resources/ai-in-facilities-management/digital-twins',
      '/resources/ai-in-facilities-management/ai-agents',
      '/resources/ai-in-facilities-management/computer-vision',
      '/resources/ai-in-facilities-management/ai-compliance',
      '/resources/ai-in-facilities-management/fm-data-readiness',
      '/resources/ai-in-facilities-management/ai-governance',
      '/ppm',
      '/compliance',
      '/tools/ppm-schedule-builder',
      '/facilities-management-glossary'
    ],
    conversionGoal: 'Establish authoritative trust as the premier UK facilities partner combining modern technology with practical engineering delivery.',
    verificationRequirements: [
      'Zero unsupported vendor claims',
      'Clear separation of legal competence vs algorithmic assistance',
      'Clean interactive work order sequence module',
      'All sub-guide links return valid 200 routes'
    ],
    contentStatus: 'COMPLETE'
  },

  '/resources/ai-in-facilities-management/predictive-maintenance': {
    path: '/resources/ai-in-facilities-management/predictive-maintenance',
    title: 'AI Predictive Maintenance in Facilities Management | Entire FM',
    metaDescription: 'How predictive maintenance uses IoT vibration, BMS sensors, and machine learning to detect equipment degradation alongside statutory PPM schedules.',
    h1: 'AI Predictive Maintenance in Facilities Management',
    eyebrow: 'Asset Engineering & Reliability',
    heroIntro: 'An engineering perspective on machine-learning-driven condition monitoring, failure prediction, and its true relationship with Planned Preventative Maintenance (PPM).',
    heroDescription: 'Explore the mechanics of sensor-driven anomaly detection, vibration analysis, BMS trend parsing, and where predictive models succeed (and fail) across commercial plant.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for predictive maintenance algorithms, condition-based monitoring, and FM asset reliability',
    primaryIntent: 'predictive maintenance facilities management',
    secondaryIntents: [
      'AI predictive maintenance',
      'condition-based maintenance vs PPM',
      'IoT vibration monitoring FM',
      'HVAC failure prediction'
    ],
    pageType: 'company',
    historicTopics: ['Predictive maintenance', 'Asset reliability', 'BMS analytics', 'PPM optimisation'],
    requiredSections: ['hero', 'predictive-vs-preventative', 'sensor-architecture', 'asset-criticality', 'ppm-relationship', 'faq', 'cta'],
    sections: [
      {
        heading: 'Predictive vs Preventative: A Complementary Model',
        body: 'Preventative maintenance (PPM) services assets at fixed calendar or run-hour intervals regardless of condition. Predictive maintenance (PdM) continuously monitors physical parameters (temperature, vibration, acoustic emissions, current draw) using machine learning to identify mechanical deterioration before an operational threshold is crossed. PdM does not eliminate PPM; it optimises intervention timing on high-criticality assets.'
      },
      {
        heading: 'Where Predictive Maintenance Delivers Real ROI',
        body: 'Predictive monitoring is commercially viable on high-capital, high-consequence plant where unplanned downtime causes major business disruption: centrifugal chillers, central air handling units, primary heating pumps, and data centre CRAC units. Applying IoT vibration sensors to secondary extract fans or standard fan coil units rarely generates a positive return on investment.'
      }
    ],
    capabilities: [
      {
        name: 'Vibration & Bearing Analysis',
        description: 'High-frequency accelerometer monitoring on chiller compressors and primary circulation pumps to catch bearing wear weeks before catastrophic seizure.',
        tag: 'Mechanical'
      },
      {
        name: 'Thermal & Current Signature Analysis',
        description: 'Continuous monitoring of motor winding temperatures and 3-phase electrical balance to prevent insulation breakdown and motor burnout.',
        tag: 'Electrical'
      },
      {
        name: 'BMS Delta-T & Flow Trend Tracking',
        description: 'Algorithmic analysis of supply/return water temperature differentials to detect heat exchanger fouling and valve bypass leakage.',
        tag: 'HVAC'
      }
    ],
    faqs: [
      {
        question: 'Does predictive maintenance allow us to cancel statutory inspections?',
        answer: 'No. Statutory requirements under UK law (such as Pressure Systems Safety Regulations 2000, Gas Safety Regulations 1998, and LOLER 1998) mandate periodic physical examinations by certified engineers. Predictive data provides operational insight but has no legal standing to replace statutory inspection certificates.'
      },
      {
        question: 'What infrastructure is needed for AI predictive maintenance?',
        answer: 'You need three layers: edge sensors or BMS trend logging (capturing vibration, temperature, or pressure), a secure telemetry gateway (MQTT or cellular IoT), and an analytical platform with baseline training data for that specific equipment model.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
      { name: 'Predictive Maintenance', url: '/resources/ai-in-facilities-management/predictive-maintenance' }
    ],
    relatedRoutes: [
      '/ppm',
      '/mechanical-electrical',
      '/hvac-contractor',
      '/tools/ppm-schedule-builder',
      '/resources/ai-in-facilities-management'
    ],
    conversionGoal: 'Drive enquiries for commercial planned maintenance and plant condition auditing.',
    verificationRequirements: ['Clear comparison table', 'No claims that PdM eliminates statutory PPM'],
    contentStatus: 'COMPLETE'
  },

  '/resources/ai-in-facilities-management/ai-helpdesk-work-orders': {
    path: '/resources/ai-in-facilities-management/ai-helpdesk-work-orders',
    title: 'AI in the FM Helpdesk: From Request to Work Order | Entire FM',
    metaDescription: 'How natural language processing and AI triage automate tenant ticket intake, asset identification, priority routing, and human escalation safeguards.',
    h1: 'AI in the FM Helpdesk: From Request to Work Order',
    eyebrow: 'Helpdesk & Service Desk Operations',
    heroIntro: 'Transforming unstructured tenant emails and portal requests into accurate, pre-scoped work orders using natural language processing and intelligent routing.',
    heroDescription: 'An operational breakdown of automated issue classification, location parsing, trade selection, duplicate detection, and the critical human-in-the-loop safeguards required for building safety.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for automated helpdesk triage, CAFM ticket classification, and FM dispatch workflows',
    primaryIntent: 'AI FM helpdesk work orders',
    secondaryIntents: [
      'automated work order dispatch',
      'CAFM ticket triage AI',
      'facilities management helpdesk automation',
      'tenant request NLP'
    ],
    pageType: 'company',
    historicTopics: ['Helpdesk automation', 'Work order dispatch', 'CAFM triage', 'Service desk operations'],
    requiredSections: ['hero', 'intake-workflow', 'nlp-classification', 'human-safeguards', 'duplicate-detection', 'faq', 'cta'],
    sections: [
      {
        heading: 'The End-to-End Automated Triage Pipeline',
        body: 'When a building occupant emails "The boardroom is boiling and making a buzzing noise", natural language models extract four key entities: issue type (HVAC temperature / acoustics), location (Floor 3 Boardroom), urgency (comfort complaint), and required trade (AC / HVAC engineer). The system maps this against the asset register, identifies FCU-03-04, and prepares a draft work order within seconds.'
      },
      {
        heading: 'Non-Negotiable Human Escalation Safeguards',
        body: 'AI must never have unchecked authority to dispatch emergency or safety-critical jobs. Reports containing keywords associated with gas smells, water pouring through electrical fittings, fire alarm faults, or trapped lift occupants must bypass standard automated batching and trigger instantaneous visual and SMS alerts to the human duty manager.'
      }
    ],
    capabilities: [
      {
        name: 'Multi-Channel Ingestion',
        description: 'Unified intake parsing free-text emails, tenant web forms, and voice transcripts into structured ticket parameters.',
        tag: 'Intake'
      },
      {
        name: 'Intelligent Deduplication',
        description: 'Cluster analysis grouping multiple reports from different occupants about the same building event (e.g. 15 tickets for "lift out of service on Block B").',
        tag: 'Triage'
      },
      {
        name: 'Skill & Geolocation Routing',
        description: 'Matching trade skill requirements, compliance accreditations (e.g. Gas Safe, F-Gas), and engineer GPS locations to dispatch the optimal technician.',
        tag: 'Dispatch'
      }
    ],
    faqs: [
      {
        question: 'Can AI completely replace human FM helpdesk coordinators?',
        answer: 'No. AI handles 60-80% of repetitive data entry, triage, and trade categorisation. However, human coordinators are essential for complex client communications, emergency escalation, contractor rate negotiations, and resolving ambiguous site access issues.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
      { name: 'Helpdesk & Work Orders', url: '/resources/ai-in-facilities-management/ai-helpdesk-work-orders' }
    ],
    relatedRoutes: [
      '/helpdesk',
      '/24-7-fm-support',
      '/resources/ai-in-facilities-management',
      '/resources/ai-in-facilities-management/ai-cafm'
    ],
    conversionGoal: 'Showcase EntireFM 24/7 helpdesk capabilities and technology-driven service desk efficiency.',
    verificationRequirements: ['Detailed emergency escalation protocols', 'Step-by-step triage diagram'],
    contentStatus: 'COMPLETE'
  },

  '/resources/ai-in-facilities-management/ai-cafm': {
    path: '/resources/ai-in-facilities-management/ai-cafm',
    title: 'AI and CAFM: How Facilities Management Software Is Changing | Entire FM',
    metaDescription: 'Traditional CAFM vs AI-enhanced CAFM. Natural language asset interrogation, automated scheduling, exception reporting, and EntireCAFM technology.',
    h1: 'AI and CAFM: The Evolution of Facilities Software',
    eyebrow: 'Software & Technology Architecture',
    heroIntro: 'How modern Computer-Aided Facility Management (CAFM) systems are integrating machine learning, vector search, and intelligent workflow automation.',
    heroDescription: 'A technical evaluation of modern CAFM architecture, comparing legacy relational databases with AI-enhanced platforms that parse documents, predict SLA breaches, and automate supplier coordination.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for AI CAFM software, smart facilities management platforms, and CAFM roadmap',
    primaryIntent: 'AI CAFM software',
    secondaryIntents: ['smart CAFM platforms', 'next generation CAFM', 'EntireCAFM technology', 'CAFM automation'],
    pageType: 'company',
    historicTopics: ['CAFM software', 'Facilities management technology', 'IWMS', 'Asset tracking'],
    requiredSections: ['hero', 'legacy-vs-modern', 'core-capabilities', 'entirecafm-vision', 'faq', 'cta'],
    sections: [
      {
        heading: 'From Passive Database to Active Operational Assistant',
        body: 'Legacy CAFM systems operate as passive data repositories, requiring users to click through deep menu hierarchies to log tickets, find assets, or run reports. AI-enhanced CAFM transforms this into an active operational engine capable of natural-language querying ("Show all chillers due F-Gas inspection in Q3 with outstanding remedials"), proactive SLA breach warnings, and automatic contractor performance scoring.'
      },
      {
        heading: 'EntireCAFM: Practical Innovation Rooted in Field Engineering',
        body: 'At EntireFM, EntireCAFM is built from direct operational contractor experience rather than abstract software design. We focus on high-reliability features that eliminate manual friction: automated compliance certificate attachment, instant asset history lookups for mobile engineers, and transparent client reporting dashboards.'
      }
    ],
    capabilities: [
      {
        name: 'Natural Language Asset Search',
        description: 'Vector-indexed search allowing engineers and property managers to interrogate thousands of assets using plain conversational phrases.',
        tag: 'Search'
      },
      {
        name: 'Predictive SLA Risk Scoring',
        description: 'Real-time algorithms analysing engineer workloads, travel times, and part availability to flag work orders at risk of breaching client SLAs.',
        tag: 'Performance'
      },
      {
        name: 'Automated Invoice Reconciliation',
        description: 'OCR matching contractor invoices against approved work order rates and logged timesheet geofences to eliminate billing discrepancies.',
        tag: 'Finance'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between an IWMS and an AI-powered CAFM?',
        answer: 'An Integrated Workplace Management System (IWMS) typically covers real estate portfolios, lease accounting, and space planning alongside maintenance. AI-powered CAFM focuses deeply on maintenance execution, compliance tracking, and engineering workflow speed.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
      { name: 'AI & CAFM', url: '/resources/ai-in-facilities-management/ai-cafm' }
    ],
    relatedRoutes: [
      '/client-login',
      '/resources/ai-in-facilities-management',
      '/resources/ai-in-facilities-management/fm-data-readiness',
      '/tools/ppm-schedule-builder'
    ],
    conversionGoal: 'Demonstrate EntireCAFM software superiority and client transparency.',
    verificationRequirements: ['Clean separation of industry trends vs EntireCAFM current live features'],
    contentStatus: 'COMPLETE'
  },

  '/resources/ai-in-facilities-management/energy-optimisation': {
    path: '/resources/ai-in-facilities-management/energy-optimisation',
    title: 'AI Energy Optimisation in Commercial Buildings | Entire FM',
    metaDescription: 'How machine learning algorithms analyse BMS telemetry, weather forecasts, and occupancy data to eliminate commercial building energy waste.',
    h1: 'AI Energy Optimisation in Commercial Buildings',
    eyebrow: 'Sustainability & Energy Engineering',
    heroIntro: 'Leveraging algorithmic building controls, weather regression, and occupancy tracking to drive down kWh consumption and carbon emissions across commercial estates.',
    heroDescription: 'A balanced engineering assessment of AI energy management systems, HVAC setpoint modulation, peak demand shaving, and the operational constraints of older commercial building fabric.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for building energy AI, smart HVAC optimisation, and commercial decarbonisation analytics',
    primaryIntent: 'AI commercial building energy optimisation',
    secondaryIntents: [
      'BMS energy AI',
      'HVAC machine learning optimisation',
      'smart building energy management',
      'commercial estate decarbonisation'
    ],
    pageType: 'company',
    historicTopics: ['Building energy efficiency', 'BMS optimisation', 'Commercial decarbonisation', 'HVAC controls'],
    requiredSections: ['hero', 'energy-mechanics', 'hvac-controls', 'data-constraints', 'faq', 'cta'],
    sections: [
      {
        heading: 'How Algorithmic Energy Tuning Works in Practice',
        body: 'Commercial HVAC systems account for 40-60% of commercial building energy consumption. Conventional BMS systems run on rigid static time schedules and fixed setpoints. AI energy algorithms continuously evaluate external ambient temperatures, solar irradiance forecasts, internal thermal decay rates, and badge-swipe occupancy numbers to dynamically adjust chiller flow rates, boiler flow temperatures, and AHU fan speeds.'
      },
      {
        heading: 'Realistic Energy Reductions Without Unrealistic Promises',
        body: 'Energy savings from AI supervisory software are highly dependent on baseline plant efficiency and controls maturity. In buildings with uncalibrated pneumatic actuators or failing dampers, software optimisation cannot overcome mechanical faults. A thorough physical M&E and controls audit must always precede algorithmic tuning.'
      }
    ],
    capabilities: [
      {
        name: 'Dynamic Pre-Cooling & Pre-Heating',
        description: 'Calculating optimal plant start times based on thermal inertia and electricity tariff pricing to avoid expensive peak morning grid charges.',
        tag: 'Peak Shaving'
      },
      {
        name: 'Simultaneous Heating & Cooling Detection',
        description: 'Automated algorithms flagging zones where FCUs or VAV boxes are fighting each other due to incorrect deadband configuration.',
        tag: 'Fault Detection'
      },
      {
        name: 'Occupancy-Based Setpoint Drift',
        description: 'Widening comfort deadbands automatically in unoccupied zones and floor plates to minimise fan and compressor cycle counts.',
        tag: 'Comfort & Efficiency'
      }
    ],
    faqs: [
      {
        question: 'Can AI energy optimisation compromise tenant comfort?',
        answer: 'When configured with strict boundary conditions (e.g. maintaining 21°C ± 1.5°C during core business hours), AI optimisation actually reduces hot/cold complaints by preventing temperature hunting and over-shooting.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
      { name: 'Energy Optimisation', url: '/resources/ai-in-facilities-management/energy-optimisation' }
    ],
    relatedRoutes: [
      '/hvac-contractor',
      '/mechanical-electrical',
      '/resources/ai-in-facilities-management',
      '/fm-intelligence'
    ],
    conversionGoal: 'Generate M&E and energy auditing enquiries for commercial property portfolios.',
    verificationRequirements: ['No fixed percentage guarantee claims; emphasizes physical plant health prerequisite'],
    contentStatus: 'COMPLETE'
  },

  '/resources/ai-in-facilities-management/digital-twins': {
    path: '/resources/ai-in-facilities-management/digital-twins',
    title: 'Digital Twins in Facilities Management: Realities & Value | Entire FM',
    metaDescription: 'A grounded guide to digital twins in building operations. BIM models vs Digital Twins vs CAFM vs BMS vs AI: practical value vs over-engineering.',
    h1: 'Digital Twins in Facilities Management',
    eyebrow: 'Building Information & Operational Models',
    heroIntro: 'De-mystifying 3D digital twins in commercial estate management: where spatial models add genuine operational value and where simpler CAFM data suffices.',
    heroDescription: 'An objective breakdown of 3D spatial geometry, IoT telemetry integration, Building Information Modelling (BIM), and the total cost of ownership required to maintain a digital twin throughout a building lifecycle.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for digital twin facilities management, BIM to FM handover, and 3D building models',
    primaryIntent: 'digital twins facilities management',
    secondaryIntents: ['BIM to CAFM integration', 'building digital twin reality', 'smart building spatial models', 'digital twin ROI FM'],
    pageType: 'company',
    historicTopics: ['Digital twins', 'BIM to FM', 'Building information modelling', 'Smart buildings'],
    requiredSections: ['hero', 'technology-distinctions', 'value-matrix', 'maintenance-overhead', 'faq', 'cta'],
    sections: [
      {
        heading: 'Distinguishing BIM, Digital Twins, CAFM, and BMS',
        body: 'A static 3D BIM model represents the design and construction geometry. A CAFM holds asset records and maintenance histories. A BMS executes real-time control loops. A true Digital Twin unifies all three: combining spatial 3D geometry with real-time IoT telemetry, simulation engines, and maintenance logs into a dynamic, updating digital replica.'
      },
      {
        heading: 'When is a Digital Twin Justified?',
        body: 'Digital twins offer substantial return on investment in highly complex, mission-critical environments: hospitals, pharmaceutical laboratories, multi-terminal airports, and Tier 3/4 data centres where spatial clash detection, airflow simulation, and remote contractor orientation are critical. For standard commercial offices and retail parks, maintaining a 3D digital twin is often an expensive distraction compared to a clean, well-indexed 2D CAFM asset register.'
      }
    ],
    capabilities: [
      {
        name: 'Spatial Asset Navigation',
        description: 'Enabling remote engineers and contractors to locate hidden valves, dampers, and isolators within ceiling voids prior to site arrival.',
        tag: 'Spatial'
      },
      {
        name: 'Dynamic Airflow & Thermal Simulation',
        description: 'Simulating thermal distribution changes when reorganising floor plate layouts or adjusting server rack densities.',
        tag: 'Simulation'
      },
      {
        name: 'Golden Thread Building Safety Compliance',
        description: 'Linking fire doors, dampers, and compartmentation boundaries directly to physical 3D locations under Building Safety Act requirements.',
        tag: 'Safety'
      }
    ],
    faqs: [
      {
        question: 'Why do so many digital twin projects fail in FM?',
        answer: 'The primary cause of failure is lack of operational maintenance. When minor plant alterations, office reconfigurations, or fit-outs occur without updating the 3D model, the twin rapidly diverges from physical reality and loses operational trust.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
      { name: 'Digital Twins', url: '/resources/ai-in-facilities-management/digital-twins' }
    ],
    relatedRoutes: [
      '/building-walk',
      '/resources/ai-in-facilities-management',
      '/resources/ai-in-facilities-management/fm-data-readiness',
      '/case-studies'
    ],
    conversionGoal: 'Demonstrate pragmatic technology leadership that saves clients from expensive over-engineering.',
    verificationRequirements: ['Clear comparison table across BIM, Digital Twin, CAFM, BMS, and AI'],
    contentStatus: 'COMPLETE'
  },

  '/resources/ai-in-facilities-management/ai-agents': {
    path: '/resources/ai-in-facilities-management/ai-agents',
    title: 'AI Agents in Facilities Management: Practical Applications | Entire FM',
    metaDescription: 'What autonomous AI agents actually mean for commercial FM. Helpdesk, planning, compliance evidence, contractor coordination, and governance controls.',
    h1: 'AI Agents in Facilities Management',
    eyebrow: 'Autonomous Workflows & Multi-Agent Architecture',
    heroIntro: 'Beyond chatbots: how autonomous AI agents execute multi-step facilities tasks across helpdesk triage, compliance tracking, and contractor coordination.',
    heroDescription: 'An operational guide to agentic workflows in building management, explaining goal-directed execution, API tool usage, permission boundaries, and the human oversight necessary for safe operation.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for autonomous AI agents in FM, automated property management workflows, and agentic CAFM',
    primaryIntent: 'AI agents facilities management',
    secondaryIntents: [
      'agentic AI FM workflows',
      'autonomous maintenance planning agents',
      'compliance verification agents',
      'AI contractor coordination'
    ],
    pageType: 'company',
    historicTopics: ['AI agents', 'Autonomous workflows', 'Process automation', 'Facilities software'],
    requiredSections: ['hero', 'what-is-an-agent', 'practical-agent-roles', 'governance-boundaries', 'faq', 'cta'],
    sections: [
      {
        heading: 'What Separates an AI Agent from a Basic Chatbot?',
        body: 'A standard chatbot answers questions based on a fixed context. An AI agent is given an operational objective ("Coordinate the annual fire damper inspection across 3 buildings before October 31st"), reasons through the required steps, queries the CAFM for asset counts, verifies contractor accreditations, drafts work orders, sends availability requests, and updates the compliance calendar, pausing only for human sign-off.'
      },
      {
        heading: 'Strict Operational Boundaries & Safeguards',
        body: 'Autonomous agents must never have unilateral authority to execute financial commitments above pre-set thresholds, modify life-safety system settings, or close compliance records without verified engineering documentation attached. Every agent action must produce an immutable audit log.'
      }
    ],
    capabilities: [
      {
        name: 'Compliance Verification Agent',
        description: 'Continuously monitors certificate expiration dates, parses contractor upload files for accreditation badges, and flags non-compliant documents.',
        tag: 'Compliance'
      },
      {
        name: 'Maintenance Scheduling Agent',
        description: 'Balances planned asset tasks against seasonal weather windows, engineer skill matrices, and building access constraints.',
        tag: 'Planning'
      },
      {
        name: 'Contractor Chaser & Coordination Agent',
        description: 'Automates follow-up emails, job acceptance requests, and RAMS submission tracking for specialist sub-contractors.',
        tag: 'Coordination'
      }
    ],
    faqs: [
      {
        question: 'Are autonomous building management agents ready for production today?',
        answer: 'Specialised, single-domain agents (such as ticket triage and document verification) are production-ready. Broad, fully autonomous agents managing entire building systems without human oversight remain in research and testing phases due to safety and liability constraints.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
      { name: 'AI Agents', url: '/resources/ai-in-facilities-management/ai-agents' }
    ],
    relatedRoutes: [
      '/resources/ai-in-facilities-management',
      '/resources/ai-in-facilities-management/ai-governance',
      '/resources/ai-in-facilities-management/ai-helpdesk-work-orders',
      '/compliance'
    ],
    conversionGoal: 'Demonstrate EntireFM operational efficiency and cutting-edge process automation.',
    verificationRequirements: ['Explicit boundaries and human approval checkpoints documented'],
    contentStatus: 'COMPLETE'
  },

  '/resources/ai-in-facilities-management/computer-vision': {
    path: '/resources/ai-in-facilities-management/computer-vision',
    title: 'Computer Vision in Facilities Management & Inspection | Entire FM',
    metaDescription: 'How computer vision transforms drone facade inspections, thermal imaging, meter readings, and asset defect detection across commercial estates.',
    h1: 'Computer Vision in Facilities Management',
    eyebrow: 'Visual AI & Condition Inspection',
    heroIntro: 'Automating visual estate condition surveys, drone roof inspections, thermal leak detection, and mechanical wear identification using convolutional neural networks.',
    heroDescription: 'A technical exploration of computer vision in facilities engineering, from high-resolution drone photogrammetry on historic facades to automated gauge digitisation in plantrooms.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for computer vision building inspection, drone roof analysis AI, and thermal image defect detection',
    primaryIntent: 'computer vision facilities management',
    secondaryIntents: [
      'drone building inspection AI',
      'thermal imaging defect detection',
      'automated meter reading vision AI',
      'facade condition analysis'
    ],
    pageType: 'company',
    historicTopics: ['Building inspection', 'Drone surveys', 'Computer vision', 'Condition monitoring'],
    requiredSections: ['hero', 'vision-applications', 'drone-facade-surveys', 'thermal-analysis', 'accuracy-safeguards', 'faq', 'cta'],
    sections: [
      {
        heading: 'Automating Visual Defect Recognition at Scale',
        body: 'Building surveying traditionally requires manual inspection from cherry pickers, scaffolding, or rope access. High-resolution drone imagery combined with computer vision algorithms can scan thousands of square metres of roof membrane, cladding panels, and masonry in hours, automatically identifying spalling brickwork, missing flashing, vegetative growth, and gutter blockages with millimetre precision.'
      },
      {
        heading: 'Thermal Imaging & Energy Leak Detection',
        body: 'Infrared radiometric vision models analyse building envelopes to identify missing insulation, thermal bridging, and fenestration seal failures. In electrical switchrooms, thermographic vision systems detect hot spots in distribution boards before switchgear flashover occurs.'
      }
    ],
    capabilities: [
      {
        name: 'Drone Roof & Cladding Surveys',
        description: 'Automated defect tagging across thousands of high-resolution aerial images with geolocation coordinates for targeted contractor repair.',
        tag: 'Building Envelope'
      },
      {
        name: 'Analog Gauge & Meter Digitisation',
        description: 'Mobile app optical capture instantly reading analog pressure gauges, water meters, and temperature dials into CAFM databases.',
        tag: 'Plantroom'
      },
      {
        name: 'Electrical Thermography Analysis',
        description: 'Algorithmic delta-T calculation on thermal captures of busbars and breakers to highlight overloaded circuits.',
        tag: 'Electrical Safety'
      }
    ],
    faqs: [
      {
        question: 'Can computer vision replace human structural surveyors?',
        answer: 'No. Computer vision is an exceptional triage tool that rapidly flags surface anomalies across vast surface areas. Structural safety determinations and remedial repair specifications must always be signed off by a qualified structural engineer or chartered surveyor.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
      { name: 'Computer Vision', url: '/resources/ai-in-facilities-management/computer-vision' }
    ],
    relatedRoutes: [
      '/aerial-drone-building-inspection',
      '/building-inspecting-testing',
      '/resources/ai-in-facilities-management',
      '/building-walk'
    ],
    conversionGoal: 'Drive enquiries for aerial drone building surveys and commercial condition inspections.',
    verificationRequirements: ['Direct cross-linking to /aerial-drone-building-inspection service'],
    contentStatus: 'COMPLETE'
  },

  '/resources/ai-in-facilities-management/ai-compliance': {
    path: '/resources/ai-in-facilities-management/ai-compliance',
    title: 'AI and Statutory Compliance in Facilities Management | Entire FM',
    metaDescription: 'How document intelligence helps FM teams manage certificates, audit trails, and compliance calendars without compromising legal accountability.',
    h1: 'AI & Statutory Compliance in Facilities Management',
    eyebrow: 'Statutory Governance & Document Intelligence',
    heroIntro: 'Leveraging document AI to search compliance archives, extract remedial actions, and map certificates to assets while maintaining strict legal accountability.',
    heroDescription: 'A compliance-first analysis of natural language document processing, certificate validation, and digital audit trails under UK health and safety legislation.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for AI statutory compliance FM, compliance certificate OCR, and safety document management',
    primaryIntent: 'AI statutory compliance facilities management',
    secondaryIntents: [
      'statutory compliance document AI',
      'building safety certificate parsing',
      'fire safety document intelligence',
      'FM compliance audit automation'
    ],
    pageType: 'company',
    historicTopics: ['Statutory compliance', 'Building safety', 'Compliance document management', 'Audit trails'],
    requiredSections: ['hero', 'ai-compliance-role', 'legal-competence-boundary', 'document-intelligence', 'faq', 'cta'],
    sections: [
      {
        heading: 'Where Document Intelligence Solves Compliance Headaches',
        body: 'Commercial property estates accumulate thousands of multi-page PDF certificates annually: EICRs, fire risk assessments, gas safety records, TM44 reports, and legionella water test sheets. Document AI parses unstructured PDFs to automatically extract inspection dates, re-test due dates, engineer accreditation numbers, and C1/C2/C3 defect codes, eliminating manual data entry.'
      },
      {
        heading: 'The Non-Negotiable Legal Competence Boundary',
        body: 'AI cannot legally certify a building system as safe or compliant. Under the Regulatory Reform (Fire Safety) Order 2005, Electricity at Work Regulations 1989, and ACOP L8, duty holders are legally bound to engage qualified "Competent Persons". AI assists with record-keeping, gap detection, and calendar reminders, but legal responsibility remains entirely human.'
      }
    ],
    capabilities: [
      {
        name: 'Automated Remedial Code Extraction',
        description: 'Instant parsing of EICR certificates to pull out all C1 (danger present) and C2 (potentially dangerous) items into actionable work orders.',
        tag: 'Electrical Safety'
      },
      {
        name: 'Missing Certificate Gap Detection',
        description: 'Comparing building asset registers against mandatory statutory schedules to identify properties lacking active water hygiene or gas certificates.',
        tag: 'Gap Analysis'
      },
      {
        name: 'Accreditation Body Verification',
        description: 'Cross-checking contractor certificate numbers against NICEIC, Gas Safe, and BAFE register formats to detect fraudulent paperwork.',
        tag: 'Governance'
      }
    ],
    faqs: [
      {
        question: 'Does having an AI compliance tool protect a building owner from prosecution?',
        answer: 'No. The legal duty holder (landlord, employer, or managing agent) is held accountable for statutory compliance. Software tools are evidence management aids; they do not absolve duty holders of their legal obligations.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
      { name: 'AI & Compliance', url: '/resources/ai-in-facilities-management/ai-compliance' }
    ],
    relatedRoutes: [
      '/compliance',
      '/compliance/fire-risk-assessment',
      '/compliance/fixed-wire-testing-eicr',
      '/compliance/legionella-water-hygiene',
      '/tools/compliance-calendar',
      '/resources/ai-in-facilities-management'
    ],
    conversionGoal: 'Position EntireFM as the premier compliance partner backed by robust digital systems.',
    verificationRequirements: ['Prominent statutory disclaimer: AI does not replace the Competent Person'],
    contentStatus: 'COMPLETE'
  },

  '/resources/ai-in-facilities-management/fm-data-readiness': {
    path: '/resources/ai-in-facilities-management/fm-data-readiness',
    title: 'Is Your FM Data Ready for AI? Data Quality Guide | Entire FM',
    metaDescription: 'Why asset register quality, hierarchy, and failure coding determine AI success. An operational data audit guide and readiness checklist for FM teams.',
    h1: 'Is Your FM Data Ready for AI?',
    eyebrow: 'Data Architecture & Estate Asset Registers',
    heroIntro: 'Why artificial intelligence fails without clean asset data: a practical guide to auditing asset registers, naming hierarchies, and maintenance histories.',
    heroDescription: 'Step-by-step guidance on transforming fragmented spreadsheets, legacy CAFM databases, and unstructured document silos into a standardised data foundation ready for machine learning.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for FM asset data quality, AI data readiness checklist, and CAFM data cleaning',
    primaryIntent: 'FM data readiness for AI',
    secondaryIntents: [
      'asset register data cleaning',
      'facilities management data hierarchy',
      'AI readiness checklist FM',
      'CAFM asset data standards'
    ],
    pageType: 'company',
    historicTopics: ['Asset data management', 'Asset register', 'CAFM data', 'Data quality'],
    requiredSections: ['hero', 'garbage-in-garbage-out', 'five-pillars', 'readiness-checklist', 'remediation-steps', 'faq', 'cta'],
    sections: [
      {
        heading: 'Garbage In, Hallucination Out: The Reality of FM Data',
        body: 'Most commercial portfolios suffer from dirty data: duplicate assets, vague descriptions ("AC Unit in Hallway"), missing serial numbers, unmapped parent-child hierarchies, and free-text maintenance logs with no standard failure coding. Feeding this data into AI models produces incorrect routing, false anomaly alerts, and unreliable cost forecasts.'
      },
      {
        heading: 'The Five Pillars of AI-Ready FM Data',
        body: 'To leverage machine learning effectively, an estate requires: 1) Standardised spatial hierarchy (Site > Building > Floor > Space); 2) Uniform asset taxonomy (e.g. Uniclass or SFG20 codes); 3) Standardised failure mode coding; 4) Clean, tagged time-series telemetry; 5) Structured document metadata.'
      }
    ],
    capabilities: [
      {
        name: 'Asset Register Standardisation',
        description: 'Converting inconsistent spreadsheets into uniform ISO 55000-aligned asset registers with complete equipment attributes.',
        tag: 'Asset Data'
      },
      {
        name: 'Hierarchy & Spatial Mapping',
        description: 'Establishing parent-child relationships between central plant (chillers, boilers) and terminal units (FCUs, radiators).',
        tag: 'Spatial Structure'
      },
      {
        name: 'Standardised Failure Coding',
        description: 'Replacing free-text engineer notes with structured failure cause and remedy codes for reliable machine learning training.',
        tag: 'Analytics'
      }
    ],
    faqs: [
      {
        question: 'How long does a data cleaning project take for a mid-sized portfolio?',
        answer: 'For a commercial portfolio of 10-25 properties, a structured asset verification and data normalisation audit typically takes 4 to 8 weeks depending on access and historical record availability.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
      { name: 'Data Readiness', url: '/resources/ai-in-facilities-management/fm-data-readiness' }
    ],
    relatedRoutes: [
      '/resources/document-vault',
      '/resources/ai-in-facilities-management',
      '/resources/ai-in-facilities-management/ai-cafm',
      '/tools/ppm-schedule-builder'
    ],
    conversionGoal: 'Drive enquiries for professional asset register surveys and data auditing.',
    verificationRequirements: ['Actionable self-audit checklist included', 'Prepares foundation for future /tools/ai-fm-readiness'],
    contentStatus: 'COMPLETE'
  },

  '/resources/ai-in-facilities-management/ai-governance': {
    path: '/resources/ai-in-facilities-management/ai-governance',
    title: 'AI Governance & Cybersecurity in Facilities Management | Entire FM',
    metaDescription: 'Data privacy, OT cybersecurity, and risk management when adopting AI in FM. Includes 10 critical questions to ask AI software suppliers.',
    h1: 'AI Governance & Cybersecurity in Facilities Management',
    eyebrow: 'Cybersecurity, Privacy & Vendor Risk',
    heroIntro: 'Managing cybersecurity risk, tenant data privacy, and vendor accountability when implementing artificial intelligence across commercial estate systems.',
    heroDescription: 'An executive procurement framework covering operational technology (OT) security, data residency, model training isolation, and a 10-point vendor questionnaire for FM buyers.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Search intent for FM AI governance, smart building cybersecurity, and AI software procurement questions',
    primaryIntent: 'AI governance facilities management',
    secondaryIntents: [
      'smart building cybersecurity AI',
      'AI vendor procurement questions FM',
      'OT network security facilities',
      'FM data privacy compliance'
    ],
    pageType: 'company',
    historicTopics: ['Cybersecurity', 'AI governance', 'Vendor risk management', 'Data protection'],
    requiredSections: ['hero', 'threat-landscape', 'ot-it-boundary', 'ten-questions', 'governance-framework', 'faq', 'cta'],
    sections: [
      {
        heading: 'The Intersection of AI, Cloud Services, and Building OT',
        body: 'Connecting building management systems (BMS), access control panels, and IoT sensors to cloud-hosted AI engines expands a property’s digital attack surface. Weak API security or compromised supplier credentials can provide malicious actors with a pivot point into corporate IT networks or allow remote tampering with critical building plant.'
      },
      {
        heading: 'Ten Questions Every FM Director Must Ask Software Vendors',
        body: 'Before procuring AI-powered FM software, buyers must verify: 1) Is tenant data used to train foundation models? 2) Where is building telemetry physically stored (UK/EEA residency)? 3) Does the software hold ISO 27001 or Cyber Essentials Plus? 4) What access permissions exist for third-party contractors? 5) How are model hallucinations prevented in safety-critical workflows?'
      }
    ],
    capabilities: [
      {
        name: 'Air-Gapped OT Network Architecture',
        description: 'Implementing unidirectional data diodes and read-only telemetry gateways to prevent cloud AI systems from directly altering life-safety plant.',
        tag: 'Network Security'
      },
      {
        name: 'Role-Based Access & Audit Logging',
        description: 'Immutable, cryptographically verifiable logs recording every algorithmic recommendation, contractor action, and human override.',
        tag: 'Auditability'
      },
      {
        name: 'GDPR & Tenant Privacy Compliance',
        description: 'Anonymising badge-swipe and computer vision streams to prevent tracking individual employee movements or occupancy behaviours.',
        tag: 'Data Privacy'
      }
    ],
    faqs: [
      {
        question: 'Should cloud AI systems have direct write access to building BMS controllers?',
        answer: 'In commercial facilities, direct automated write access should be strictly limited to non-critical setpoint adjustments with hard-coded min/max safety limits. Life-safety systems (fire alarms, smoke extract, emergency power) must never be remotely writable by cloud algorithms.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
      { name: 'AI Governance', url: '/resources/ai-in-facilities-management/ai-governance' }
    ],
    relatedRoutes: [
      '/resources/ai-in-facilities-management',
      '/resources/ai-in-facilities-management/ai-agents',
      '/resources/ai-in-facilities-management/ai-compliance',
      '/legal/privacy-policy'
    ],
    conversionGoal: 'Establish trust as a security-conscious, enterprise-grade facilities partner.',
    verificationRequirements: ['Complete 10 Questions to Ask an AI/FM Supplier section with high procurement value'],
    contentStatus: 'COMPLETE'
  }
};
