/**
 * ENTIRECAFM FIELD INTELLIGENCE & TALK-TO-QUOTE DOMAIN TYPES
 * ==========================================================
 * Strict schemas for contextual extraction, asset intelligence,
 * work scope differentiation, parts & labour resolution, and quote draft generation.
 */

export type AIConfidenceLevel = 'HIGH' | 'REVIEW' | 'LOW';

export interface FieldContextInput {
  sessionEngineerId: string;
  sessionEngineerName: string;
  sessionOrgId: string;
  clientAccountId?: string;
  clientName?: string;
  siteId?: string;
  siteName?: string;
  locationId?: string;
  locationName?: string;
  assetId?: string;
  assetReference?: string;
  workOrderId?: string;
  workOrderNumber?: string;
}

export interface ConversationTurn {
  id: string;
  speaker: 'ENGINEER' | 'AI';
  text: string;
  audioDurationSeconds?: number;
  timestamp: string;
  extractedUpdates?: Partial<StructuredUnderstanding>;
}

export interface StructuredUnderstanding {
  clientName?: string;
  clientAccountId?: string;
  siteName?: string;
  siteId?: string;
  locationName?: string;
  locationId?: string;
  assetName?: string;
  assetReference?: string;
  assetId?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  faultDescription?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  likelyFailureCause?: string;
  requiredTrade?: string;
  tradeCode?: string;
  isUrgent?: boolean;
}

export interface WorkScopeItem {
  id: string;
  title: string;
  source: 'ENGINEER_STATED' | 'AI_INFERRED';
  isChargeable: boolean;
  requiresConfirmation: boolean;
}

export interface IdentifiedPart {
  id?: string;
  itemCode?: string;
  description: string;
  manufacturer?: string;
  quantity: number;
  unit: string;
  unitCostGbp?: number;
  unitSellGbp?: number;
  isFromCatalogue: boolean;
  requiresConfirmation: boolean;
  stalePriceWarning?: boolean;
  notes?: string;
}

export interface LabourEstimate {
  trade: string;
  tradeCode: string;
  engineersCount: number;
  estimatedHours: number;
  hourlyRateGbp: number;
  calloutRateGbp?: number;
  totalLabourGbp: number;
  basis: string; // e.g. "Rate Card: Mechanical Engineer £65/h. Basis: Historical jobs average 2.5h"
  confidence: number;
  requiresConfirmation: boolean;
}

export interface AdditionalCostItem {
  id: string;
  category: 'CONSUMABLES' | 'ACCESS' | 'ISOLATION' | 'TESTING' | 'TRAVEL' | 'WASTE_DISPOSAL' | 'OTHER';
  description: string;
  quantity: number;
  unit: string;
  unitPriceGbp: number;
  totalGbp: number;
  status: 'INCLUDED' | 'AUTO_APPLIED' | 'REQUIRES_CONFIRMATION';
  justification: string;
}

export interface AmbiguityResolution {
  type: 'ASSET' | 'SITE' | 'PART' | 'WORK_SCOPE';
  promptQuestion: string;
  options: Array<{
    id: string;
    title: string;
    description?: string;
    metadata?: Record<string, any>;
  }>;
}

export interface FieldIntelligenceResult {
  sessionId: string;
  understanding: StructuredUnderstanding;
  assetIntelligence?: {
    identified: boolean;
    assetId?: string;
    assetReference?: string;
    name?: string;
    category?: string;
    manufacturer?: string;
    model?: string;
    location?: string;
    previousMaintenanceCount?: number;
    previousFailuresCount?: number;
    lastServiceDate?: string;
    activeWarranty?: boolean;
  };
  scopeOfWorks: WorkScopeItem[];
  parts: IdentifiedPart[];
  labour: LabourEstimate;
  additionalCosts: AdditionalCostItem[];
  financials: {
    materialsNetGbp: number;
    labourNetGbp: number;
    additionalCostsNetGbp: number;
    subtotalNetGbp: number;
    vatRatePct: number;
    vatAmountGbp: number;
    totalGrossGbp: number;
    estimatedCostGbp: number;
    estimatedMarginGbp: number;
    estimatedMarginPct: number;
  };
  confidenceLevel: AIConfidenceLevel;
  confidenceScore: number;
  flags: string[];
  ambiguities?: AmbiguityResolution[];
  draftQuoteReady: boolean;
  quoteId?: string;
  quoteNumber?: string;
  aiResponseNarrative: string;
}
