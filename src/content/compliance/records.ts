import type { ContentRecord } from '@/lib/routes/route-schema';
import { COMPLIANCE_TOPICS, COMPLIANCE_TOPIC_BY_SLUG } from './topics';

/**
 * COMPLIANCE CENTRE — CONTENT RECORDS
 * ===================================
 * Built from the topic data rather than written twice. The topic file is the
 * single source for the copy; this projects it into the ContentRecord shape
 * the route resolver, metadata generator and schema builder all expect.
 *
 * FAQs are carried through deliberately: they drive the FAQPage schema, and
 * these are exactly the questions people search — "how often is an EICR
 * required", "is annual emergency lighting testing a legal requirement".
 */

function topicRecord(slug: string): ContentRecord {
  const topic = COMPLIANCE_TOPIC_BY_SLUG[slug];
  return {
    path: `/compliance/${slug}`,
    title: topic.metaTitle,
    metaDescription: topic.metaDescription,
    h1: topic.h1,
    eyebrow: 'Compliance',
    heroIntro: topic.answer,
    heroDescription: topic.intro,
    historicIntent: `Compliance guidance intent for ${topic.name.toLowerCase()}`,
    primaryIntent: `${topic.shortName.toLowerCase()} requirements`,
    secondaryIntents: [
      `how often ${topic.shortName.toLowerCase()}`,
      `${topic.shortName.toLowerCase()} legal requirement`,
      `${topic.shortName.toLowerCase()} frequency uk`,
      `who is responsible for ${topic.shortName.toLowerCase()}`,
    ],
    pageType: 'company',
    service: null,
    sector: null,
    location: null,
    historicTopics: [topic.name, 'Statutory compliance', 'Duty holder responsibilities'],
    requiredSections: ['hero', 'body', 'faq', 'cta'],
    sections: [
      { heading: 'The short answer', body: topic.answer },
      { heading: 'Why it is misunderstood', body: topic.intro },
      { heading: 'Who holds the duty', body: topic.dutyHolder },
      {
        heading: 'What is required',
        body: 'Each requirement below is labelled with whether it comes from legislation, a standard or approved code, common industry practice, or a risk-based assessment.',
        bullets: topic.requirements.map((r) => `${r.statement} (${r.source})`),
      },
      {
        heading: 'What proves it was done',
        body: 'Compliance is demonstrated with records, not intentions.',
        bullets: topic.evidence,
      },
      {
        heading: 'Where this usually goes wrong',
        body: 'The failings below account for most of the gaps found during compliance reviews.',
        bullets: topic.commonFailings,
      },
      { heading: 'What happens if it is missed', body: topic.consequences },
    ],
    faqs: topic.faqs,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Compliance Centre', url: '/compliance' },
      { name: topic.shortName, url: `/compliance/${slug}` },
    ],
    relatedRoutes: [...topic.relatedServices, '/compliance'].slice(0, 6),
    conversionGoal: `Generate a compliance review enquiry from ${topic.shortName.toLowerCase()} intent`,
    verificationRequirements: [
      'Legislation cited must be accurate and current',
      'Requirement levels must not overstate guidance as law',
      'Disclaimer must render on the page',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  };
}

const hubRecord: ContentRecord = {
  path: '/compliance',
  title: 'Compliance Centre | Statutory Obligations Explained | EntireFM',
  metaDescription:
    'What the law actually requires for commercial property compliance across fire, emergency lighting, EICR, Legionella, LOLER and asbestos, with law separated from guidance.',
  h1: 'The Compliance Centre',
  eyebrow: 'Compliance Centre',
  heroIntro:
    'Statutory obligations for commercial property, with the law separated from the guidance and the guidance separated from the habit. Most FM websites state a frequency as though it were legislation. Usually it is not, and knowing the difference changes what you have to do.',
  heroDescription:
    'Written for the people who carry the duty: facilities managers, property managers and duty holders who need to know what applies, what evidences it, and what happens if it slips.',
  historicIntent: 'New authority content — statutory compliance guidance for commercial property',
  primaryIntent: 'commercial property compliance requirements uk',
  secondaryIntents: [
    'facilities management statutory compliance',
    'building compliance checklist uk',
    'landlord statutory compliance commercial',
  ],
  pageType: 'company',
  service: null,
  sector: null,
  location: null,
  historicTopics: ['Statutory compliance', 'Duty holder responsibilities', 'Evidence and records'],
  requiredSections: ['hero', 'body', 'cta'],
  sections: [
    {
      heading: 'Four kinds of requirement',
      body: 'Every requirement in this section is labelled with where it comes from, because the distinction changes what you must do.',
      bullets: [
        'Legal requirement: set out in legislation, not optional',
        'Standard or approved code: the recognised technical basis; departing from it means justifying the alternative',
        'Typical practice: what competent providers commonly do, and what is most often mistaken for law',
        'Risk-based: genuinely depends on the building, its use and its condition',
      ],
    },
    {
      heading: 'Topics covered',
      body: 'Each page states the answer first, then the requirements, the evidence that proves them, and the failings that come up most often in review.',
      bullets: COMPLIANCE_TOPICS.map((t) => `${t.name} — ${t.shortName}`),
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Compliance Centre', url: '/compliance' },
  ],
  relatedRoutes: ['/ppm', '/fire-emergency-systems', '/mechanical-electrical', '/resources', '/services', '/contact-us'],
  conversionGoal: 'Establish authority and generate compliance review enquiries',
  verificationRequirements: [
    'Legislation cited must be accurate and current',
    'Disclaimer must render on the page',
  ],
  contentStatus: 'CONTENT_COMPLETE',
};

export const COMPLIANCE_CONTENT: Record<string, ContentRecord> = {
  '/compliance': hubRecord,
  ...Object.fromEntries(COMPLIANCE_TOPICS.map((t) => [`/compliance/${t.slug}`, topicRecord(t.slug)])),
};
