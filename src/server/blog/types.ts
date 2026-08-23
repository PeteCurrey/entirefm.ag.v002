export type BlogPostStatus =
  | 'IDEA'
  | 'RESEARCHING'
  | 'DRAFT'
  | 'AI_DRAFT'
  | 'NEEDS_REVIEW'
  | 'SEO_REVIEW'
  | 'READY'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'UPDATED'
  | 'ARCHIVED'
  | 'FAILED';

export type BlogGenerationMode = 'manual' | 'ai' | 'ai_assisted';

export type ReviewStatus = 'PENDING' | 'PASSED' | 'REJECTED' | 'HUMAN_OVERRIDE';

export type SourceTrustLevel =
  | 'OFFICIAL_GOV'
  | 'INDUSTRY_STANDARD'
  | 'TRADE_PUBLICATION'
  | 'OEM_TECHNICAL'
  | 'CORPORATE_RESEARCH'
  | 'GENERAL_MEDIA';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  postCount?: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  isTechnicalTeam: boolean;
  isActive: boolean;
}

export interface BlogSource {
  id: string;
  name: string;
  url: string;
  publisher: string;
  title?: string;
  publicationDate?: string;
  dateAccessed: string;
  sourceType: string;
  trustLevel: SourceTrustLevel;
  notes?: string;
  postCount?: number;
}

export interface InternalLinkItem {
  anchorText: string;
  targetUrl: string;
  targetType: 'service' | 'sector' | 'location' | 'compliance' | 'glossary' | 'article';
}

export interface BlogPostBlock {
  type: 'paragraph' | 'h2' | 'h3' | 'h4' | 'bullets' | 'numbered' | 'quote' | 'callout' | 'table' | 'image' | 'separator';
  content?: string;
  bullets?: string[];
  caption?: string;
  imageUrl?: string;
  altText?: string;
  tableData?: { headers: string[]; rows: string[][] };
  calloutType?: 'info' | 'warning' | 'tip' | 'statutory';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string; // Clean markdown or rendered HTML
  contentJson?: BlogPostBlock[];
  categoryId?: string;
  category?: BlogCategory;
  authorId?: string;
  author?: BlogAuthor;

  // Media
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageCaption?: string;
  featuredImageSource?: string;

  // Status & Lifecycle
  status: BlogPostStatus;
  generationMode: BlogGenerationMode;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;

  // SEO
  primaryKeyword?: string;
  secondaryKeywords: string[];
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  sitemapInclude: boolean;
  schemaType: string;
  readingTime: number;

  // Quality & Fact Check
  reviewStatus: ReviewStatus;
  factCheckStatus: ReviewStatus;
  seoStatus: ReviewStatus;
  imageStatus: ReviewStatus;
  contentScore: number;
  seoScore: number;

  // Commercial Links & Sources
  primaryServiceHref?: string;
  primaryServiceCta?: string;
  internalLinks: InternalLinkItem[];
  sources?: BlogSource[];

  // Audit
  createdBy: string;
  updatedBy: string;
}

export interface BlogRevision {
  id: string;
  postId: string;
  revisionNumber: number;
  title: string;
  content: string;
  seoTitle?: string;
  metaDescription?: string;
  changedBy: string;
  changeType: string;
  changeSummary?: string;
  createdAt: string;
}

export interface BlogTopicOpportunity {
  id: string;
  title: string;
  topicTheme: string;
  whyNow: string;
  categoryId?: string;
  categoryName?: string;
  searchIntent: string;
  commercialRelevance: string;
  supportingSources: Array<{ name: string; url: string; publisher: string }>;
  collisionStatus: 'NO_COLLISION' | 'UPDATE_EXISTING' | 'MERGE_IDEA' | 'HUMAN_REVIEW';
  collidingUrl?: string;
  freshnessScore: number;
  overallScore: number;
  status: 'OPPORTUNITY' | 'QUEUED' | 'APPROVED' | 'GENERATED' | 'REJECTED' | 'BLOCKED';
  recommendedPublishDate?: string;
  createdAt: string;
}

export interface BlogAutomationSettings {
  automationEnabled: boolean;
  autoResearchEnabled: boolean;
  autoDraftEnabled: boolean;
  autoPublishEnabled: boolean;
  emergencyHold: boolean;
  minPostsPerWeek: number;
  targetPostsPerWeek: number;
  maxPostsPerWeek: number;
  allowedPublishDays: string[];
  preferredPublishTimes: string[];
  minQualityScore: number;
  minSourceConfidence: number;
  minSeoScore: number;
  maxSimilarityThreshold: number;
  imageGenerationEnabled: boolean;
  updatedAt: string;
}

export interface BlogGenerationJob {
  id: string;
  topicId?: string;
  postId?: string;
  jobType: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  failureReason?: string;
  retryCount: number;
  logJson: Array<{ timestamp: string; message: string; level: 'info' | 'warn' | 'error' }>;
  createdAt: string;
}

export interface BlogMediaItem {
  id: string;
  title: string;
  url: string;
  altText: string;
  caption?: string;
  sourceType: 'PHOTOGRAPHY' | 'LICENSED_EDITORIAL' | 'GENERATED';
  licenseInfo: string;
  tags: string[];
  usageCount: number;
  createdAt: string;
}
