import { BlogPost, BlogTopicOpportunity, BlogPostBlock, InternalLinkItem } from './types';
import { memoryStore } from './store';
import { analyzePostSeo } from './seo';
import { runFactCheck } from './factcheck';

/**
 * Generate a complete, high-quality editorial FM trade draft from an approved topic opportunity
 */
export async function generateDraftFromTopic(topic: BlogTopicOpportunity): Promise<BlogPost> {
  const category = memoryStore.categories.find(c => c.id === topic.categoryId) || memoryStore.categories[0];
  const author = memoryStore.authors.find(a => a.isTechnicalTeam) || memoryStore.authors[0];
  const defaultImage = memoryStore.media[0] || {
    url: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    altText: `EntireFM building services engineering team on site for ${topic.title}`,
  };

  const slug = topic.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 65);

  const excerpt = `${topic.whyNow} A technical analysis of ${topic.topicTheme.toLowerCase()} requirements, statutory obligations, and operational best practice for UK commercial property estates.`;

  // Build high-standard editorial content
  const content = `# ${topic.title}\n\n${topic.whyNow}\n\n## The Operational Reality in Commercial Estates\n\nWhen managing commercial property portfolios, statutory compliance is not an abstract bureaucratic exercise — it is the fundamental baseline that protects asset value, tenant life safety, and landlord insurance coverage. For ${topic.topicTheme.toLowerCase()}, managing agents and building managers frequently encounter operational friction between routine maintenance and statutory certification.\n\n## Statutory Obligations vs Recommended Maintenance\n\nIt is essential to distinguish between primary legal statutes (such as the Health and Safety at Work etc. Act 1974 and Electricity at Work Regulations 1989) and technical industry guidance (such as SFG20 or CIBSE design codes). While industry standards outline competent practice, failing to maintain an audit-proof log of statutory inspections exposes duty holders to strict liability enforcement.\n\n## Implementation in the CAFM Workflow\n\nTo ensure complete compliance traceability, all testing routines should be tracked within a centralized Computer-Aided Facilities Management (CAFM) system with direct mobile technician proof-of-presence and immediate digital certificate archiving.`;

  const blocks: BlogPostBlock[] = [
    { type: 'paragraph', content: topic.whyNow },
    { type: 'h2', content: 'The Operational Reality in Commercial Estates' },
    { type: 'paragraph', content: `When managing commercial property portfolios, statutory compliance is not an abstract bureaucratic exercise — it is the fundamental baseline that protects asset value, tenant life safety, and landlord insurance coverage. For ${topic.topicTheme.toLowerCase()}, managing agents and building managers frequently encounter operational friction between routine maintenance and statutory certification.` },
    { type: 'h2', content: 'Statutory Obligations vs Recommended Maintenance' },
    { type: 'paragraph', content: 'It is essential to distinguish between primary legal statutes and technical industry guidance. While industry standards outline competent practice, failing to maintain an audit-proof log of statutory inspections exposes duty holders to strict liability enforcement.' },
    { type: 'h2', content: 'Implementation in the CAFM Workflow' },
    { type: 'paragraph', content: 'To ensure complete compliance traceability, all testing routines should be tracked within a centralized Computer-Aided Facilities Management (CAFM) system with direct mobile technician proof-of-presence and immediate digital certificate archiving.' },
  ];

  const internalLinks: InternalLinkItem[] = [
    { anchorText: 'planned preventative maintenance (PPM)', targetUrl: '/ppm', targetType: 'service' },
    { anchorText: 'statutory compliance centre', targetUrl: '/compliance', targetType: 'compliance' },
    { anchorText: 'facilities management glossary', targetUrl: '/facilities-management-glossary', targetType: 'glossary' },
  ];

  const postDraft: BlogPost = {
    id: `post-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    slug,
    title: topic.title,
    subtitle: `A technical operational guide covering ${topic.topicTheme} and commercial estate governance.`,
    excerpt,
    content,
    contentJson: blocks,
    categoryId: category.id,
    category,
    authorId: author.id,
    author,
    featuredImage: defaultImage.url,
    featuredImageAlt: defaultImage.altText,
    featuredImageCaption: `EntireFM Technical Advisory · ${topic.topicTheme}`,
    featuredImageSource: 'EntireFM Proprietary Photography',
    status: 'AI_DRAFT',
    generationMode: 'ai',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    primaryKeyword: topic.searchIntent.split(/\s+/).slice(0, 3).join(' '),
    secondaryKeywords: [topic.topicTheme, 'facilities management compliance', 'commercial estate PPM'],
    seoTitle: `${topic.title.slice(0, 55)} | EntireFM`,
    metaDescription: excerpt.slice(0, 155),
    canonicalUrl: `https://www.entirefm.com/post/${slug}`,
    robotsIndex: true,
    robotsFollow: true,
    sitemapInclude: true,
    schemaType: 'Article',
    readingTime: 6,
    reviewStatus: 'PENDING',
    factCheckStatus: 'PENDING',
    seoStatus: 'PENDING',
    imageStatus: 'PENDING',
    contentScore: 88,
    seoScore: 92,
    primaryServiceHref: '/ppm',
    primaryServiceCta: 'Review Your Compliance & Maintenance Programme',
    internalLinks,
    createdBy: 'ai_editorial_engine',
    updatedBy: 'ai_editorial_engine',
  };

  // Run SEO and Fact Check Analysis
  const seoRes = analyzePostSeo(postDraft, Array.from(memoryStore.posts.values()));
  const factRes = runFactCheck(content);

  postDraft.seoScore = seoRes.seoScore;
  postDraft.seoStatus = seoRes.warnings.length === 0 ? 'PASSED' : 'PENDING';
  postDraft.factCheckStatus = factRes.passed ? 'PASSED' : 'REJECTED';

  if (!factRes.passed || seoRes.cannibalisationRisk === 'HIGH') {
    postDraft.status = 'NEEDS_REVIEW';
  } else {
    postDraft.status = 'READY';
  }

  // Save to memory store
  memoryStore.posts.set(postDraft.id, postDraft);

  // Update topic status
  topic.status = 'GENERATED';

  return postDraft;
}
