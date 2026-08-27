/**
 * THE LOBBY — CONTENT & PUBLISHING MODEL
 * =======================================
 * Robust, typed editorial content schema separating:
 * 1. Content (data & specialist metadata)
 * 2. Presentation (reusable UI components)
 * 3. Homepage Curation (explicit editorial slot assignments)
 */

export type ContentType =
  | 'analysis'
  | 'briefing'
  | 'technical-note'
  | 'q-and-a'
  | 'field-note'
  | 'event'
  | 'resource-feature'
  | 'update';

export type Franchise =
  | 'week-that-matters'
  | 'compliance-watch'
  | 'engineers-note'
  | 'useful-thing'
  | 'ask-entirefm'
  | 'worth-attending'
  | 'from-the-field';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type ContentLifecycle = 'evergreen' | 'time-sensitive';

export type ComplianceClassification =
  | 'LEGAL DUTY'
  | 'REGULATION'
  | 'APPROVED CODE / GUIDANCE'
  | 'BRITISH STANDARD'
  | 'INDUSTRY STANDARD'
  | 'MANUFACTURER REQUIREMENT'
  | 'BEST PRACTICE'
  | 'RISK-BASED REQUIREMENT';

export interface Author {
  id: string;
  name: string;
  role: string;
  credentials?: string;
  shortBio?: string;
  avatarUrl?: string;
  profileSlug?: string;
}

export interface Topic {
  slug: string;
  name: string;
  description: string;
  category?: 'engineering' | 'compliance' | 'operations' | 'technology';
}

export interface SourceReference {
  title: string;
  authority: string;
  url: string;
  publishedDate?: string;
  accessedDate?: string;
  citationNotes?: string;
}

export interface RelatedResourceLink {
  title: string;
  description: string;
  url: string;
  type: 'tool' | 'guide' | 'template' | 'compliance' | 'academy' | 'blog';
  badge?: string;
}

export interface EditorialBlock {
  type:
    | 'paragraph'
    | 'heading2'
    | 'heading3'
    | 'keyPoint'
    | 'pullQuote'
    | 'bulletList'
    | 'numberedList'
    | 'callout'
    | 'technicalRule'
    | 'checklist'
    | 'table';
  content?: string;
  items?: string[];
  quoteAuthor?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

/** Specialist fields for Compliance Watch */
export interface ComplianceWatchData {
  statute: string;
  governingBody: string;
  urgency: 'HIGH' | 'MEDIUM' | 'MONITORING';
  effectiveDate: string;
  actionDeadline?: string;
  whatChanged: string;
  whoItAffects: string;
  whatYouNeedToDo: string;
  whenItMatters: string;
  complianceClassification: ComplianceClassification;
  officialSourceUrl?: string;
}

/** Specialist fields for Engineer's Note */
export interface EngineersNoteData {
  assetType: string;
  discipline: string;
  symptom: string;
  technicalObservation: string;
  fieldRule: string;
  diagramNote?: string;
  engineerTip?: string;
}

/** Specialist fields for Ask EntireFM */
export interface AskEntireFMData {
  question: string;
  askedBy: string;
  role?: string;
  organisation?: string;
  estateProfile: string;
  shortAnswer: string;
  fullAnswer: string;
  keyAnswerPoints: string[];
  whatToDoNext?: string;
}

/** Specialist fields for From The Field */
export interface FromTheFieldData {
  imageSrc: string;
  imageAlt: string;
  locationDescription: string;
  environmentType: string;
  challengeTitle: string;
  observation: string;
  problem: string;
  answer: string;
  technicalExplanation: string;
}

/** Specialist fields for Worth Attending */
export interface WorthAttendingData {
  eventName: string;
  organiser: string;
  eventDate: string;
  endDate?: string;
  location: string;
  eventType: 'Webinar' | 'Conference' | 'Briefing' | 'Technical Round';
  externalLink: string;
  whyItMatters: string;
}

/** Specialist fields for One Useful Thing */
export interface UsefulThingData {
  assetFormat: 'Spreadsheet (.xlsx)' | 'Interactive Matrix' | 'Specification Template' | 'Checklist (.pdf)';
  downloadUrl: string;
  existingResourceUrl?: string;
  whyItMatters: string;
  keyPoints: string[];
}

/** Specialist fields for The Week That Matters */
export interface WeekThatMattersData {
  weekCommencing: string;
  editionNumber: string;
  leadTakeaway: string;
  keyPoints: string[];
  wireSummaryItems?: {
    headline: string;
    summary: string;
    sector: string;
    impactLevel: 'Direct Duty' | 'Operational' | 'Market Shift';
  }[];
}

/** Main Lobby Article / Item Entity */
export interface LobbyArticle {
  id: string;
  slug: string;
  title: string;
  standfirst: string;
  contentType: ContentType;
  franchise: Franchise;
  topics: string[]; // Topic slugs
  author: Author;
  publishedAt: string; // ISO 8601 or YYYY-MM-DD
  updatedAt?: string;
  reviewedAt?: string;
  reviewBy?: string;
  status: ContentStatus;
  contentLifecycle: ContentLifecycle;
  heroImage?: string;
  heroImageAlt?: string;
  readingTimeMinutes: number;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;

  // Body content
  bodyBlocks: EditorialBlock[];

  // Specialist Franchise Extensions (discriminated by franchise)
  complianceData?: ComplianceWatchData;
  engineersNoteData?: EngineersNoteData;
  askEntireFMData?: AskEntireFMData;
  fromTheFieldData?: FromTheFieldData;
  worthAttendingData?: WorthAttendingData;
  usefulThingData?: UsefulThingData;
  weekThatMattersData?: WeekThatMattersData;

  // External & Cross-Site Relationships
  sources?: SourceReference[];
  relatedContentSlugs?: string[];
  relatedResources?: RelatedResourceLink[];
}

/** Homepage Curation Manifest */
export interface LobbyHomepageCuration {
  updatedAt: string;
  editionLabel: string;
  leadStorySlug: string;
  complianceWatchSlug: string;
  engineersNoteSlug: string;
  usefulThingSlug: string;
  fromTheFieldSlug: string;
  askEntireFMSlug: string;
  worthAttendingSlug: string;
  featuredToolkitUrls: string[];
  activeQuestionId: string;
  activePulseId: string;
}
