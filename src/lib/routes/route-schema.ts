import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE PROVENANCE
// Every route must declare how it was verified to exist.
// ─────────────────────────────────────────────────────────────────────────────

export const RouteProvenanceSchema = z.enum([
  /**
   * The route has been directly verified as existing on a historic Wix site,
   * historic manifest or equivalent reliable source.
   */
  'LEGACY_VERIFIED',

  /**
   * The route must be protected because it is known from previous SEO work,
   * migration planning, Search Console history, prior domain behaviour, or
   * explicit human instruction. The Wix staging copies do not conclusively
   * expose it, but it is still fully protected.
   */
  'LEGACY_PROTECTED_BY_DIRECTIVE',

  /**
   * Genuinely new routes added as part of future SEO expansion.
   * Must never be misrepresented as historic.
   */
  'NEW_GROWTH',
]);
export type RouteProvenance = z.infer<typeof RouteProvenanceSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE TYPE
// ─────────────────────────────────────────────────────────────────────────────

export const RouteTypeSchema = z.enum([
  'home',
  'service',
  'sector',
  'location',
  'geographic-service',
  'post',
  'company',
  'legal',
]);
export type RouteType = z.infer<typeof RouteTypeSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE PRIORITY
// Used for build sequencing ONLY. Lower priority does not reduce implementation
// requirements. All protected routes must still return 200 regardless of tier.
// ─────────────────────────────────────────────────────────────────────────────

export const RoutePrioritySchema = z.enum([
  'P0', // Core traffic drivers — build first
  'P1', // Supporting architecture — build second
  'P2', // Growth and expansion — build third
  'P3', // Long-tail and legacy recovery — build fourth
]);
export type RoutePriority = z.infer<typeof RoutePrioritySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT STATUS
// ─────────────────────────────────────────────────────────────────────────────

export const ContentStatusSchema = z.enum([
  'COMPLETE',         // Full content written and validated
  'CONTENT_PENDING',  // Page spec exists, body copy not yet written (acceptable at this stage)
  'SPEC_MISSING',     // No page specification exists yet (BUILD FAILURE trigger)
]);
export type ContentStatus = z.infer<typeof ContentStatusSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN STATUS
// ─────────────────────────────────────────────────────────────────────────────

export const DesignStatusSchema = z.enum([
  'COMPLETE',
  'IN_PROGRESS',
  'NOT_STARTED',
]);
export type DesignStatus = z.infer<typeof DesignStatusSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP GROUP
// Every indexable route belongs to exactly one sitemap group.
// ─────────────────────────────────────────────────────────────────────────────

export const SitemapGroupSchema = z.enum([
  'core',
  'hard-fm',
  'soft-fm',
  'cleaning',
  'maintenance',
  'specialist-services',
  'sectors',
  'locations',
  'local-services',
  'insights',
  'company',
]);
export type SitemapGroup = z.infer<typeof SitemapGroupSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE RECORD
// The canonical schema for a single route in /config/route-registry.json
// ─────────────────────────────────────────────────────────────────────────────

export const RouteRecordSchema = z.object({
  /** The exact path on the new EntireFM website, e.g. "/mechanical-electrical" */
  path: z.string().startsWith('/'),

  /** How this route was identified and verified */
  routeProvenance: RouteProvenanceSchema,

  /** Broad category of this page */
  routeType: RouteTypeSchema,

  /** Whether this route existed on a historic Wix site */
  historic: z.boolean(),

  /**
   * Protected routes may not be redirected, removed, merged, or canonicalised
   * elsewhere. Build validation enforces this.
   */
  protected: z.boolean(),

  /**
   * Whether Google may index this page. Protected routes default true.
   * Changing to false triggers a build validation error unless explicitly
   * approved with a justification field.
   */
  indexable: z.boolean(),

  /** Must return exactly this HTTP status code. Protected routes require 200. */
  statusRequired: z.literal(200),

  /**
   * Canonical URL behaviour. Protected routes must be 'self'.
   * Changing to 'other' triggers a build validation error.
   */
  canonical: z.literal('self'),

  /**
   * Whether this route requires its own unique page content record.
   * A generic template with only {CITY}/{SERVICE} variables does NOT satisfy this.
   */
  uniquePageRequired: z.boolean(),

  /** Which XML sitemap group this route belongs to */
  sitemapGroup: SitemapGroupSchema,

  /** Build sequencing priority — does NOT affect implementation requirements */
  priority: RoutePrioritySchema,

  /** Current status of the content specification for this page */
  contentStatus: ContentStatusSchema,

  /** Current status of the visual design for this page */
  designStatus: DesignStatusSchema,

  /** Which historic Wix generations this route appeared on */
  historicSources: z.array(z.enum(['wix-generation-1', 'wix-generation-2'])),

  /** Historic Wix Generation 1 URL if verified */
  g1_url: z.string().url().nullable().optional(),

  /** Historic Wix Generation 2 URL if verified */
  g2_url: z.string().url().nullable().optional(),

  /** Primary city/region this route targets (if applicable) */
  location: z.string().optional(),
});

export type RouteRecord = z.infer<typeof RouteRecordSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE REGISTRY (the full file structure)
// ─────────────────────────────────────────────────────────────────────────────

export const RouteRegistrySchema = z.object({
  $schema: z.string(),
  description: z.string(),
  version: z.string(),
  generated: z.string(),
  authority: z.string(),
  warning: z.string(),
  counts: z.object({
    total: z.number(),
    LEGACY_VERIFIED: z.number(),
    LEGACY_PROTECTED_BY_DIRECTIVE: z.number(),
    NEW_GROWTH: z.number(),
    protected: z.number(),
    historic: z.number(),
  }),
  routes: z.array(RouteRecordSchema),
});

export type RouteRegistry = z.infer<typeof RouteRegistrySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT RECORD
// Every protected route requires its own content record in /src/content/pages/
// A generic template does NOT satisfy this requirement.
// ─────────────────────────────────────────────────────────────────────────────

export const ContentSectionSchema = z.object({
  heading: z.string(),
  body: z.string(),
  bullets: z.array(z.string()).optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
});

export const CapabilityItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  tag: z.string().optional(),
  icon: z.string().optional(),
});

export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const RelatedLinkItemSchema = z.object({
  title: z.string(),
  path: z.string(),
  category: z.string().optional(),
  description: z.string().optional(),
});

export const BreadcrumbItemSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const ContentRecordSchema = z.object({
  /** Must match the route path exactly */
  path: z.string().startsWith('/'),

  /** Unique page <title> tag */
  title: z.string().min(10).max(85),

  /** Unique meta description */
  metaDescription: z.string().min(50).max(180),

  /** Unique H1 heading */
  h1: z.string().min(5),

  /** Optional subtitle or eyebrow tag */
  eyebrow: z.string().optional(),

  /** Hero introduction paragraph */
  heroIntro: z.string().optional(),

  /** Extended hero overview */
  heroDescription: z.string().optional(),

  /** Hero image path */
  heroImage: z.string().optional(),

  /** The historic search intent this page was designed to capture */
  historicIntent: z.string().min(10),

  /** The primary commercial search intent this page targets */
  primaryIntent: z.string().min(5),

  /** Secondary search intents */
  secondaryIntents: z.array(z.string()),

  /** Page archetype */
  pageType: RouteTypeSchema,

  /** Primary service association (if applicable) */
  service: z.string().nullable().optional(),

  /** Primary sector association (if applicable) */
  sector: z.string().nullable().optional(),

  /** Primary location association (if applicable) */
  location: z.string().nullable().optional(),

  /** Historic topics and content themes from Wix versions */
  historicTopics: z.array(z.string()),

  /** Content sections that must appear on this page */
  requiredSections: z.array(z.string()).min(1),

  /** Rendered body content sections */
  sections: z.array(ContentSectionSchema).optional(),

  /** Capabilities / Feature pillars */
  capabilities: z.array(CapabilityItemSchema).optional(),

  /** Asset types or equipment managed */
  assetTypes: z.array(CapabilityItemSchema).optional(),

  /** FAQs for this specific route */
  faqs: z.array(FAQItemSchema).optional(),

  /** Related links / Hub cards */
  relatedLinks: z.array(RelatedLinkItemSchema).optional(),

  /** Breadcrumb navigation */
  breadcrumbs: z.array(BreadcrumbItemSchema).optional(),

  /** Primary CTA button */
  primaryCTA: z.object({ text: z.string(), href: z.string() }).optional(),

  /** Secondary CTA button */
  secondaryCTA: z.object({ text: z.string(), href: z.string() }).optional(),

  /** Custom page data */
  customData: z.record(z.any()).optional(),

  /**
   * Related routes for internal linking.
   * Must be explicit — no automated keyword matching.
   */
  relatedRoutes: z.array(z.string().startsWith('/')),

  /** Primary conversion goal for this page */
  conversionGoal: z.string().min(10),

  /** What must be true for this page to pass verification */
  verificationRequirements: z.array(z.string()),

  /** Current content status */
  contentStatus: ContentStatusSchema,
});

export type ContentRecord = z.infer<typeof ContentRecordSchema>;
export type ContentSection = z.infer<typeof ContentSectionSchema>;
export type CapabilityItem = z.infer<typeof CapabilityItemSchema>;
export type FAQItem = z.infer<typeof FAQItemSchema>;
export type RelatedLinkItem = z.infer<typeof RelatedLinkItemSchema>;
export type BreadcrumbItem = z.infer<typeof BreadcrumbItemSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// REDIRECT RECORD
// Only approved redirects may appear in /config/redirects.json.
// Protected route paths may NOT appear as redirect sources.
// ─────────────────────────────────────────────────────────────────────────────

export const RedirectRecordSchema = z.object({
  source: z.string(),
  destination: z.string(),
  permanent: z.boolean(),
});

export type RedirectRecord = z.infer<typeof RedirectRecordSchema>;
