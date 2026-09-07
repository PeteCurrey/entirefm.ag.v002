/**
 * ABOUT ENTIREFM — PPM PACK DOCUMENT CONTENT
 * ==========================================
 * Dedicated content source for the Complete PPM Pack (PDF).
 * Marketing & commercial teams can edit copy here without touching
 * PDF layout engines or document builders.
 */

export interface AboutSection {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  bulletHeading?: string;
  bullets?: string[];
}

export interface PpmPackAboutContent {
  documentHeading: string;
  documentSubheading: string;
  sections: AboutSection[];
  cta: {
    heading: string;
    description: string;
    actionLabel: string;
    phone: string;
    phoneDisplay: string;
    email: string;
    website: string;
  };
}

export const PPM_PACK_ABOUT_CONTENT: PpmPackAboutContent = {
  documentHeading: 'About Entire Facilities Management',
  documentSubheading: 'Contract delivery model, engineering methodology, and operational governance.',

  sections: [
    // ── PAGE 1 OF ABOUT APPENDIX: SECTIONS 1 & 2 ────────────────────────────
    {
      title: '1. Who We Are',
      subtitle: 'Independently owned facilities management and building maintenance',
      paragraphs: [
        'Entire Facilities Management is an independently owned facilities management provider founded in 2009. We provide planned preventative maintenance, statutory compliance management, and reactive building services to commercial property owners, managing agents, and estate managers across the United Kingdom.',
        'Our operations span single-site commercial headquarters through to national multi-site portfolios, including corporate offices, logistics hubs, retail developments, and industrial facilities. We operate with direct accountability: clients work with dedicated contract managers and technical engineers rather than anonymous call centre queues.',
      ],
      bulletHeading: 'Core Disciplines Maintained:',
      bullets: [
        'Mechanical & Electrical (M&E) systems and power distribution',
        'Heating, ventilation, and air conditioning (HVAC & refrigeration)',
        'Fire safety systems, emergency lighting, and compartmentation',
        'Water hygiene, Legionella monitoring, and temperature logs (ACOP L8)',
        'Lifting operations and pressure vessel statutory inspections (LOLER/PSSR)',
        'Building fabric, automated access, and external grounds care',
      ],
    },
    {
      title: '2. How We Work — The Asset-Survey-First Model',
      subtitle: 'Bespoke maintenance regimes validated against physical site conditions',
      paragraphs: [
        'Many planned maintenance agreements fail because schedules are priced from desk exercises or generic building templates. EntireFM operates an asset-survey-first model: before any contract commences or final PPM pricing is fixed, our technical engineers attend site to conduct a comprehensive asset verification survey.',
        'We locate, tag, and inspect every physical plant item, cross-referencing nameplates, serial numbers, installed age, operating condition, and access practicalities against current manufacturer instructions and SFG20 task schedules.',
      ],
      bulletHeading: 'Operating Commitments:',
      bullets: [
        'Asset registers verified on site before contract commencement',
        'Maintenance tasks matched to actual plant condition and duty cycles',
        'Digital certificates and service visit sheets logged within 24 hours of attendance',
        'Direct notification of defect observations (C1/C2 classifications) with photographic evidence',
        'Transparent statutory audit trails ready for insurers and local enforcing authorities',
      ],
    },

    // ── PAGE 2 OF ABOUT APPENDIX: SECTION 3 & COMMERCIAL CTA ───────────────
    {
      title: '3. National Coverage & Helpdesk Operations',
      subtitle: 'Regional engineering deployment supported by 24/7 technical control',
      paragraphs: [
        'EntireFM delivers nationwide coverage through a network of regionally based mobile engineers and technical specialists. This regional operating structure provides local response times backed by the systems, health and safety accreditation, and reporting rigor of a national contractor.',
        'All client sites are supported by our 24/7/365 technical operations desk. Incoming requests, emergency call-outs, and scheduled maintenance attendances are coordinated through our centralized CAFM platform, giving duty holders live visibility over job progression, statutory certification, and contractor sign-offs.',
      ],
      bulletHeading: 'Operational Infrastructure:',
      bullets: [
        '24/7/365 staffed technical helpdesk and emergency response dispatch',
        'Dedicated contract managers with direct phone and email access',
        'Real-time client portal access to maintenance records and statutory registers',
        'ISO-aligned health, safety, quality, and environmental management systems',
        'Vetted supply chain partners for specialist statutory inspections and OEM overhauls',
      ],
    },
  ],

  cta: {
    heading: 'Request a Proposal',
    description: 'To arrange an on-site asset verification survey or discuss a planned maintenance agreement for your estate, contact our commercial engineering team directly:',
    actionLabel: 'Request a Proposal',
    phone: '02046170228',
    phoneDisplay: '020 4617 0228',
    email: 'commercial@entirefm.com',
    website: 'www.entirefm.com',
  },
};
