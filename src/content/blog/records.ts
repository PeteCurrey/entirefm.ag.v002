import type { ContentRecord } from '@/lib/routes/route-schema';
import {
  BLOG_POSTS,
  BLOG_VARIANTS,
  POSTS_BY_DATE,
  POST_BY_PATH,
  readingTime,
  type BlogPost,
} from './posts';

/**
 * BLOG — CONTENT RECORDS
 * ======================
 * Projects the post data into the ContentRecord shape the route resolver,
 * metadata generator and schema builder expect.
 *
 * DATES REACH THE SCHEMA THROUGH `customData`
 * -------------------------------------------
 * `buildPageGraph` reads `customData.datePublished` and
 * `customData.dateModified` when a route is an article, and emits them in the
 * Article node. Without them every post shipped an Article schema with no
 * dates at all — which is the single most useful property on that type, and
 * the reason a post can show a date in search results.
 */

function postRecord(post: BlogPost, variantOf?: string): ContentRecord {
  const canonicalNote = variantOf
    ? ` This URL is retained from the previous site; the fuller version lives at ${variantOf}.`
    : '';

  // Variants are held at noindex, but they must still not ship the same
  // <title> and <h1> strings as the page they duplicate: identical titles are
  // a duplicate signal on their own, independent of the robots directive, and
  // they make the pages indistinguishable in any crawl report.
  const title = variantOf ? `${post.metaTitle.split(' | ')[0]} (archive) | EntireFM` : post.metaTitle;
  const h1 = variantOf ? `${post.h1} — archived version` : post.h1;

  return {
    path: post.path,
    title,
    metaDescription: post.metaDescription,
    h1,
    eyebrow: variantOf ? `${post.category} · archive` : post.category,
    heroIntro: post.dek,
    heroDescription: post.metaDescription,
    historicIntent: `Legacy blog intent recovered from the Wix estate: ${post.title}`,
    primaryIntent: post.title.toLowerCase(),
    secondaryIntents: post.tags.map((t) => t.toLowerCase()),
    pageType: 'post',
    service: null,
    sector: null,
    location: null,
    historicTopics: post.tags,
    requiredSections: ['hero', 'body', 'cta'],
    sections: post.sections.map((s) => ({
      heading: s.heading ?? '',
      body: (s.body ?? '') + (s.heading ? '' : canonicalNote),
      bullets: s.bullets,
    })),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.title, url: post.path },
    ],
    relatedRoutes: post.related.slice(0, 6),
    conversionGoal: `Establish authority and generate enquiries from ${post.category.toLowerCase()} intent`,
    verificationRequirements: [
      'Legislation and standards cited must be accurate',
      'Dates must reflect genuine publication and revision',
    ],
    contentStatus: 'CONTENT_COMPLETE',
    customData: {
      datePublished: post.published,
      dateModified: post.updated,
      readingTime: readingTime(post),
      category: post.category,
      tags: post.tags,
      imageKey: post.imageKey,
      isVariant: Boolean(variantOf),
    },
  };
}

/**
 * The blog index. Two paths carry it — `/blog` and the longer legacy
 * `/facilities-management-blog` — so each gets its own framing rather than
 * the same page twice.
 */
function indexRecord(path: string, h1: string, title: string, intro: string): ContentRecord {
  return {
    path,
    title,
    metaDescription:
      'Articles on facilities management, statutory compliance and building engineering from EntireFM: what the law requires, what standards advise, and what actually happens on site.',
    h1,
    eyebrow: 'Insight',
    heroIntro: intro,
    heroDescription:
      'Written for the people who carry the duty: facilities managers, property managers and duty holders.',
    historicIntent: 'Legacy blog index intent from the Wix estate',
    primaryIntent: 'facilities management blog',
    secondaryIntents: [
      'facilities management articles',
      'fm industry insight uk',
      'building maintenance guides',
    ],
    pageType: 'post',
    service: null,
    sector: null,
    location: null,
    historicTopics: ['Facilities management', 'Compliance', 'Maintenance'],
    requiredSections: ['hero', 'body', 'cta'],
    sections: [
      {
        heading: 'Articles',
        body: 'Every article below was published on the previous EntireFM site and has been rewritten and expanded for this one. Original publication dates are kept because they are true.',
        bullets: POSTS_BY_DATE.map((p) => `${p.title} — ${p.dek}`),
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: path },
    ],
    relatedRoutes: ['/compliance', '/resources', '/services', '/contact-us'],
    conversionGoal: 'Establish authority and route readers into services and compliance',
    verificationRequirements: ['Every listed post must resolve to a live page'],
    contentStatus: 'CONTENT_COMPLETE',
    customData: { isBlogIndex: true },
  };
}

export const BLOG_CONTENT: Record<string, ContentRecord> = {
  ...Object.fromEntries(BLOG_POSTS.map((p) => [p.path, postRecord(p)])),
  ...Object.fromEntries(
    BLOG_VARIANTS.map((v) => {
      const source = POST_BY_PATH[`/post/${v.source}`];
      return [v.path, postRecord({ ...source, path: v.path }, `/post/${v.source}`)];
    })
  ),
  '/blog': indexRecord(
    '/blog',
    'Insight',
    'Blog | Facilities Management & Compliance Insight | EntireFM',
    'Articles on facilities management, statutory compliance and building engineering, including where the industry states a habit as though it were the law.'
  ),
  '/facilities-management-blog': indexRecord(
    '/facilities-management-blog',
    'The facilities management blog',
    'Facilities Management Blog | Guides & Industry Insight | EntireFM',
    'Guides and explainers on facilities management: what the function covers, how contracts are structured, and what separates a maintenance regime that works from one that merely exists.'
  ),
};

export { POSTS_BY_DATE, readingTime };
