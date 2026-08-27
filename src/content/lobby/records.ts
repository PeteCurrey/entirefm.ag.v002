import type { ContentRecord } from '@/lib/routes/route-schema';

export const LOBBY_CONTENT: Record<string, ContentRecord> = {
  '/lobby': {
    path: '/lobby',
    title: 'The Lobby | FM Intelligence, Compliance & Engineering | EntireFM',
    metaDescription:
      'The daily briefing room for UK facilities management professionals: regulatory updates, engineering notes, compliance watch, practical tools, Q&A, and industry intelligence.',
    h1: 'THE LOBBY — The Daily Briefing Room for Facilities Professionals',
    eyebrow: 'FM Intelligence & Editorial Authority',
    heroIntro:
      'Know what has changed. Understand what matters. Access practical tools. The Lobby is EntireFM’s editorial, regulatory intelligence, and professional knowledge destination for UK estate custodians.',
    heroDescription:
      'Engineered for facilities managers, property directors, building services engineers, and duty holders who require prioritised signal, statutory clarity, and operational utility.',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    historicIntent: 'Facilities management industry intelligence, compliance updates, and practical engineering resources',
    primaryIntent: 'the lobby facilities management',
    secondaryIntents: [
      'fm industry intelligence',
      'facilities management compliance watch',
      'uk building safety act updates fm',
      'commercial maintenance engineering notes',
      'facilities management toolkit',
    ],
    pageType: 'company',
    historicTopics: [
      'The Lobby',
      'FM Intelligence',
      'Compliance Watch',
      'Engineers Note',
      'The Week That Matters',
      'FM Tools',
    ],
    requiredSections: [
      'masthead',
      'lead-briefing',
      'compliance-watch',
      'briefing-strip',
      'engineers-note',
      'useful-thing',
      'from-the-field',
      'ask-entirefm',
      'toolkit',
      'lobby-question',
      'lobby-pulse',
      'worth-attending',
      'academy-teaser',
      'newsletter',
    ],
    sections: [
      {
        heading: 'Authoritative Intelligence for People Responsible for Buildings',
        body: 'The Lobby brings together real-world engineering observations, statutory compliance translation, curated practical assets, and weekly knowledge benchmarking for UK commercial estate decision-makers.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'The Lobby', url: '/lobby' },
    ],
    relatedRoutes: [
      '/resources',
      '/tools',
      '/compliance',
      '/fm-intelligence',
      '/tools/ppm-schedule-builder',
      '/tools/compliance-checker',
    ],
    conversionGoal:
      'Establish EntireFM as the undisputed digital authority and daily destination for UK facilities management professionals.',
    verificationRequirements: [
      'Zero unverified statutory claims',
      'Direct functional links to existing tools and resources',
    ],
    contentStatus: 'COMPLETE',
  },
};
