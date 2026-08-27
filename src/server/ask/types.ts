/**
 * ENTIREFM ASK THE LOBBY — TYPE DEFINITIONS
 * ==========================================
 * Data structures for grounded query understanding, intent classification,
 * multi-tier authority retrieval, structured answer synthesis, citations,
 * and multi-stage Deep Research execution.
 */

import type { AuthorityTier, UKJurisdiction, FMTradeCategory } from '../intelligence/types';

export type AskMode = 'ask' | 'deep_research';

export type AskIntent =
  | 'CURRENT_UPDATE'
  | 'COMPLIANCE'
  | 'LEGAL_REGULATORY'
  | 'TECHNICAL'
  | 'PROCUREMENT'
  | 'CONTRACT_AWARDS'
  | 'COMPANY'
  | 'EVENT'
  | 'AWARDS'
  | 'PEOPLE'
  | 'COMMUNITY'
  | 'TOOL_RESOURCE'
  | 'LEARNING'
  | 'COMPARISON'
  | 'TIMELINE'
  | 'GENERAL_FM';

export interface AskCitation {
  id: string;
  sourceName: string;
  sourceUrl: string;
  authorityTier: AuthorityTier;
  authorityLabel: string;
  title: string;
  publishedAt?: string;
  updatedAt?: string;
  jurisdiction?: UKJurisdiction | UKJurisdiction[];
  isStatutory: boolean;
  citationNumber: number;
}

export interface AskRelatedAction {
  type: 'tool' | 'resource' | 'community' | 'room' | 'ask_entirefm' | 'ask_community' | 'compliance_watch';
  title: string;
  description: string;
  url: string;
  badge?: string;
}

export interface DeepResearchStage {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  findingsCount?: number;
}

export interface StructuredAskAnswer {
  id: string;
  question: string;
  mode: AskMode;
  intent: AskIntent;
  jurisdiction: UKJurisdiction[];
  timeframeDescription?: string;
  
  shortAnswer: string;
  whatChanged: string[];
  whyItMatters: string;
  whatYouNeedToDo: string[];
  onTheHorizon?: string;
  
  // Extended Deep Research Sections
  deepResearchReport?: {
    executiveSummary: string;
    statutoryRequirements: string[];
    technicalGuidance: string[];
    commercialMarketImpact: string[];
    timelineEvents: { date: string; title: string; significance: string }[];
    unresolvedQuestions?: string[];
  };
  
  researchStages?: DeepResearchStage[];
  
  citations: AskCitation[];
  relatedActions: AskRelatedAction[];
  
  confidenceScore: number;
  isGrounded: boolean;
  knowledgeGapIdentified?: boolean;
  
  disclaimer?: string;
  generatedAt: string;
}

export interface AskMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  structuredAnswer?: StructuredAskAnswer;
  timestamp: string;
}

export interface AskSession {
  id: string;
  memberId?: string;
  title: string;
  messages: AskMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeGapRecord {
  id: string;
  query: string;
  intent: AskIntent;
  reason: 'NO_RECORDS_FOUND' | 'LOW_CONFIDENCE' | 'STATUTORY_UNVERIFIED';
  loggedAt: string;
  resolved: boolean;
}
