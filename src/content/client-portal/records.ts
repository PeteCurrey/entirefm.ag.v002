import type { ContentRecord } from '@/lib/routes/route-schema';

export const CLIENT_PORTAL_CONTENT: Record<string, ContentRecord> = {
  '/client-portal': {
    path: '/client-portal',
    title: 'EntireCAFM Client Portal | Real-Time Estate Intelligence & Transparency',
    metaDescription:
      'Experience Total FM transparency. Live work orders, engineer tracking, statutory compliance health, and interactive Site 360 workspaces for commercial estates.',
    h1: 'Client Portal & CAFM Operations',
    eyebrow: 'EntireCAFM · Technology Platform',
    heroIntro:
      'Total operational visibility across your commercial property portfolio. Track jobs in real time, monitor compliance, and inspect building telemetry.',
    heroDescription:
      'Real-time facilities management intelligence, live GPS engineer dispatch, and statutory compliance certification.',
    historicIntent: 'Client portal overview and product experience',
    primaryIntent: 'facilities management client portal',
    secondaryIntents: ['cafm client access', 'property management dashboard', 'facilities tracking'],
    pageType: 'service',
    service: 'Client Portal',
    sector: null,
    location: null,
    historicTopics: ['CAFM', 'Client Portal', 'Estate Transparency'],
    requiredSections: ['hero', 'features', 'tour', 'personas', 'cta'],
    sections: [
      {
        heading: 'Total Operational Clarity',
        body: 'Eliminate friction and guesswork. View every reactive callout, planned maintenance visit, and compliance certification in real time.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Client Portal', url: '/client-portal' },
    ],
    relatedRoutes: [
      '/client-portal/real-time-operations',
      '/client-portal/compliance-reporting',
      '/client-portal/site-360',
      '/contact-us',
    ],
    conversionGoal: 'Book a live platform tour or access client login',
    verificationRequirements: [
      'EntireCAFM platform capabilities verified against Phase 0B CAFM specifications',
      'Client portal navigation and real-time operations architecture approved',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  '/client-portal/real-time-operations': {
    path: '/client-portal/real-time-operations',
    title: 'Real-Time Operations & Live Ticket Tracking | EntireCAFM',
    metaDescription:
      'Track facilities management work orders from dispatch to completion with live engineer GPS, photographic evidence, and SLA countdowns.',
    h1: 'Real-Time Operations Tracking',
    eyebrow: 'Live Workload Pipeline',
    heroIntro:
      'Track reactive tickets and scheduled maintenance as they happen across your estate.',
    heroDescription:
      'Live engineer telemetry, photographic sign-offs, and SLA breach prevention.',
    historicIntent: 'Real-time work order tracking and engineer dispatch',
    primaryIntent: 'real-time facilities tracking',
    secondaryIntents: ['work order tracking', 'engineer dispatch tracker', 'facilities sla tracking'],
    pageType: 'service',
    service: 'Live Operations',
    sector: null,
    location: null,
    historicTopics: ['Operations', 'Tickets', 'SLA'],
    requiredSections: ['hero', 'workflow', 'evidence', 'cta'],
    sections: [
      {
        heading: 'End-to-End Job Visibility',
        body: 'From first triage to completed certification, every action is logged with cryptographic audit assurance.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Client Portal', url: '/client-portal' },
      { name: 'Real-Time Operations', url: '/client-portal/real-time-operations' },
    ],
    relatedRoutes: ['/client-portal', '/client-portal/compliance-reporting', '/client-portal/site-360'],
    conversionGoal: 'Request a demo of real-time operations',
    verificationRequirements: [
      'Real-time operations tracking verified with CAFM telemetry pipeline',
      'SLA countdown and evidence gates approved',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  '/client-portal/compliance-reporting': {
    path: '/client-portal/compliance-reporting',
    title: 'Statutory Compliance & Automated Reporting | EntireCAFM',
    metaDescription:
      'Automated PPM scheduling, statutory compliance monitoring, and one-click audit pack exports for commercial property estates.',
    h1: 'Statutory Compliance & Reporting',
    eyebrow: 'Audit-Ready Compliance Engine',
    heroIntro:
      'Continuous compliance oversight across fire safety, water hygiene, electrical systems, and vertical transport.',
    heroDescription:
      'Real-time statutory expiry tracking, automated PPM schedules, and instant compliance audit packs.',
    historicIntent: 'Compliance tracking and audit reporting',
    primaryIntent: 'statutory compliance reporting software',
    secondaryIntents: ['ppm compliance dashboard', 'facilities audit export', 'sfgl20 maintenance software'],
    pageType: 'service',
    service: 'Compliance & Reporting',
    sector: null,
    location: null,
    historicTopics: ['Compliance', 'SFG20', 'Audit', 'PPM'],
    requiredSections: ['hero', 'matrix', 'reports', 'cta'],
    sections: [
      {
        heading: 'Complete Statutory Assurance',
        body: 'Never miss an inspection. Automated compliance radar flags upcoming and overdue obligations with deterministic accuracy.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Client Portal', url: '/client-portal' },
      { name: 'Compliance & Reporting', url: '/client-portal/compliance-reporting' },
    ],
    relatedRoutes: ['/client-portal', '/client-portal/real-time-operations', '/client-portal/site-360'],
    conversionGoal: 'Request compliance demo',
    verificationRequirements: [
      'Statutory compliance matrix verified against UK regulatory obligations',
      'SFG20 maintenance schedule automation verified',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  '/client-portal/site-360': {
    path: '/client-portal/site-360',
    title: 'Site 360 Interactive Building Interface | EntireCAFM',
    metaDescription:
      'Operate physical buildings with precision. Interactive architectural site models, live telemetry overlays, and deep asset hierarchy inspection.',
    h1: 'Site 360 Building Workspace',
    eyebrow: 'Physical Asset Interface',
    heroIntro:
      'Transform complex physical buildings into intuitive, interactive workspaces.',
    heroDescription:
      'Architectural photo workspaces, CAD schematic mode, and deep component telemetry.',
    historicIntent: 'Site 360 building workspace interface',
    primaryIntent: 'interactive building management software',
    secondaryIntents: ['digital twin fm', 'interactive property workspace', 'asset hierarchy software'],
    pageType: 'service',
    service: 'Site 360',
    sector: null,
    location: null,
    historicTopics: ['Site 360', 'Digital Twin', 'Asset Management'],
    requiredSections: ['hero', 'modes', 'inspectors', 'cta'],
    sections: [
      {
        heading: 'The Physical Building as Your Interface',
        body: 'Switch seamlessly between high-resolution architectural photography, CAD floor layout schematics, and deep asset hierarchies.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Client Portal', url: '/client-portal' },
      { name: 'Site 360', url: '/client-portal/site-360' },
    ],
    relatedRoutes: ['/client-portal', '/client-portal/real-time-operations', '/client-portal/compliance-reporting'],
    conversionGoal: 'Explore Site 360',
    verificationRequirements: [
      'Site 360 spatial architectural interface specifications verified',
      'Interactive visual mode switching confirmed',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },
};
