import type { ImageProvenance } from '@/lib/lobby/image-resolver';

export type NewsCategory =
  | 'building-safety'
  | 'compliance'
  | 'engineering'
  | 'property-estates'
  | 'energy-sustainability'
  | 'technology-cafm'
  | 'contracts-mobilisations'
  | 'people-appointments'
  | 'suppliers-industry'
  | 'events-conferences'
  | 'awards-recognition';

export interface NewsCategoryMeta {
  slug: NewsCategory;
  name: string;
  description: string;
  color: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  standfirst: string;
  bodyParagraphs?: string[];
  whyItMatters?: string; // EntireFM Editorial Interpretation
  category: NewsCategory;
  topics: string[];
  publishedAt: string; // ISO 8601 string
  sourceName: string; // e.g. "HSE", "Building Safety Regulator", "IWFM", "CIBSE", "Crown Commercial Service"
  sourceUrl?: string;
  provenance: ImageProvenance;
  isExternal: boolean; // if true, can link to source or dedicated summary
  isCurated: boolean;
  isFeatured: boolean;
  isLeadStory?: boolean;
  readingTimeMinutes: number;
  
  // Structured contract fields (for contracts & mobilisations)
  contractValue?: string;
  contractWinner?: string;
  contractClient?: string;
  contractTermYears?: number;

  // Structured appointment fields (for people & moves)
  personName?: string;
  personNewRole?: string;
  personPreviousOrg?: string;
  personCompany?: string;

  // Cross-linkage into Community and Tools
  relatedTopicSlug?: string;
  relatedDiscussionSlug?: string;
  relatedToolUrl?: string;
}

export interface NewsQueryOptions {
  category?: NewsCategory | 'all';
  topic?: string;
  limit?: number;
  offset?: number;
  featuredOnly?: boolean;
  search?: string;
}
