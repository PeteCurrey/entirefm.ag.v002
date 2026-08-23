/**
-- ============================================================================
-- ENTIREFM NEWSLETTER & CONTENT DISTRIBUTION TYPES
-- ============================================================================
*/

export type SubscriberStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'UNSUBSCRIBED'
  | 'BOUNCED'
  | 'COMPLAINED'
  | 'SUPPRESSED'
  | 'BLOCKED';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  company?: string;
  role?: string;
  status: SubscriberStatus;
  consentSource: string;
  consentTextVersion: string;
  consentedAt: string;
  signupPage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  unsubscribeToken: string;
  interests: string[];
  lastEmailSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus =
  | 'DRAFT'
  | 'READY'
  | 'SCHEDULED'
  | 'SENDING'
  | 'SENT'
  | 'FAILED'
  | 'CANCELLED';

export type ContentBlockType =
  | 'OPENING_NOTE'
  | 'FEATURED_ARTICLE'
  | 'ARTICLE_GRID'
  | 'RESOURCE_TOOL'
  | 'COMPLIANCE_UPDATE'
  | 'AI_TECHNOLOGY'
  | 'INDUSTRY_DEVELOPMENT'
  | 'KEY_TAKEAWAY'
  | 'COMMERCIAL_CTA'
  | 'CUSTOM_TEXT'
  | 'DIVIDER';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  eyebrow?: string;
  heading?: string;
  body?: string;
  bullets?: string[];
  linkUrl?: string;
  linkText?: string;
  imageUrl?: string;
  imageAlt?: string;
  authorNote?: string;
  takeaway?: string;
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  senderName: string;
  replyTo: string;
  status: CampaignStatus;
  scheduledAt?: string;
  sentAt?: string;
  utmCampaign: string;
  contentBlocks: ContentBlock[];
  targetAudience: {
    all?: boolean;
    interests?: string[];
  };
  totalRecipients: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalUnsubscribed: number;
  totalBounced: number;
  validationPassed: boolean;
  validationDetails?: {
    errors?: string[];
    warnings?: string[];
    linkChecks?: Array<{ url: string; status: number; valid: boolean }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSuppression {
  id: string;
  email: string;
  reason: 'UNSUBSCRIBED' | 'BOUNCE_HARD' | 'SPAM_COMPLAINT' | 'ADMIN_MANUAL' | 'LEGAL_REQUEST';
  source: string;
  notes?: string;
  createdAt: string;
}

export interface NewsletterAutomationSettings {
  id: string;
  autoDraftEnabled: boolean;
  autoScheduleEnabled: boolean;
  autoSendEnabled: boolean;
  draftDayOfWeek: number; // 2 = Tuesday
  draftHourUtc: number; // 8 = 08:00 UTC
  killSwitchPaused: boolean;
  emailDeliveryProvider: 'RESEND' | 'POSTMARK' | 'SENDGRID' | 'MOCK';
  sendingDomain: string;
  updatedAt: string;
}

export interface SocialDistributionDraft {
  id: string;
  sourcePath: string;
  sourceTitle: string;
  channel: 'LINKEDIN' | 'TWITTER' | 'NEWSLETTER';
  postCopy: string;
  keyPoints: string[];
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED';
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteFeaturePlacement {
  id: string;
  location: 'HOMEPAGE' | 'BLOG_HOME' | 'RESOURCES_HUB' | 'AI_HUB' | 'COMPLIANCE_HUB';
  contentPath: string;
  contentTitle: string;
  eyebrow?: string;
  imageKey?: string;
  sortOrder: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
