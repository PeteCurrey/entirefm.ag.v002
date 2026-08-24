import type { ContentRecord } from '@/lib/routes/route-schema';

export const WORKING_AT_HEIGHT_CONTENT: Record<string, ContentRecord> = {
  '/working-at-height-rope-access-bmu': {
    path: '/working-at-height-rope-access-bmu',
    title: 'Working at Height, Rope Access & BMU Services | EntireFM',
    metaDescription:
      'Safe, certified high-level access, industrial rope access, BMU cradle operations and commercial façade maintenance across UK buildings and complex estates.',
    h1: 'Working at Height, Rope Access & BMU Services',
    eyebrow: 'Specialist Access & Façade Care',
    heroIntro:
      'Safe, efficient high-level access for inspection, maintenance, cleaning and façade works across commercial buildings and complex estates.',
    heroDescription:
      'Industrial rope access, BMU cradle support, technical façade maintenance, and planned high-level building care for commercial property managers and estates teams.',
    historicIntent: 'Commercial high-level access and rope access building maintenance',
    primaryIntent: 'working at height rope access bmu services',
    secondaryIntents: [
      'rope access building maintenance uk',
      'bmu cradle facade services',
      'high level commercial maintenance',
      'commercial facade inspection and repairs',
    ],
    pageType: 'service',
    service: 'Working at Height & Rope Access',
    sector: null,
    location: null,
    historicTopics: [
      'Working at Height',
      'Rope Access',
      'BMU Services',
      'Façade Maintenance',
      'Building Envelope',
    ],
    requiredSections: ['hero', 'positioning', 'services', 'differentiator', 'bmu', 'safety', 'sectors', 'cta'],
    sections: [
      {
        heading: 'Safe access for the work most contractors cannot easily reach',
        body: 'EntireFM delivers planned and reactive high-level access services across commercial estates, deploying industrial rope access, BMU cradles, and engineered rigging to inspect, maintain, repair, and clean difficult-to-access building envelopes.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Working at Height & Rope Access', url: '/working-at-height-rope-access-bmu' },
    ],
    relatedRoutes: [
      '/services',
      '/building-maintenance',
      '/industrial-cleaning',
      '/aerial-drone-building-inspection',
      '/mobile-crane-hire',
      '/contact-us',
    ],
    conversionGoal: 'Drive qualified commercial enquiries for rope access, BMU, and high-level maintenance',
    verificationRequirements: [
      'Working at height services verified against UK Work at Height Regulations 2005 standards',
      'IRATA and BMU operational capabilities approved',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },
};
