/**
 * ENTIREFM THE LOBBY DAILY — CURATED IMAGE RIGHTS & FALLBACK RESOLVER
 * ====================================================================
 * Strict 10-category verified asset collection.
 * Protects against copyright infringement, hotlinking unverified publisher images,
 * and generic irrelevant stock photography.
 */

import { ImageProvenanceRecord, ImageRightsStatus } from './types';

export interface CategoryFallback {
  categorySlug: string;
  categoryName: string;
  imageUrl: string;
  imageAlt: string;
  credit: string;
  rightsStatus: ImageRightsStatus;
  rightsBasis: string;
}

export const CURATED_FM_FALLBACK_LIBRARY: Record<string, CategoryFallback> = {
  'fire-safety': {
    categorySlug: 'fire-safety',
    categoryName: 'Fire & Life Safety',
    imageUrl: '/images/editorial/commercial-switchgear-compliance.jpg',
    imageAlt: 'Commercial fire alarm interface panel and containment testing',
    credit: 'EntireFM Technical Asset Library',
    rightsStatus: 'OWNED',
    rightsBasis: 'Direct EntireFM asset library ownership',
  },
  'hvac-mechanical': {
    categorySlug: 'hvac-mechanical',
    categoryName: 'HVAC & Mechanical',
    imageUrl: '/images/editorial/refrigerant-pressure-gauges-r410a.jpg',
    imageAlt: 'Refrigerant pressure testing manifold on commercial chiller unit',
    credit: 'EntireFM Technical Asset Library',
    rightsStatus: 'OWNED',
    rightsBasis: 'Direct EntireFM asset library ownership',
  },
  'electrical': {
    categorySlug: 'electrical',
    categoryName: 'Electrical & Switchgear',
    imageUrl: '/images/editorial/three-phase-distribution-board-eicr.jpg',
    imageAlt: 'Commercial electrical three-phase distribution board and circuit protection',
    credit: 'EntireFM Technical Asset Library',
    rightsStatus: 'OWNED',
    rightsBasis: 'Direct EntireFM asset library ownership',
  },
  'water-hygiene': {
    categorySlug: 'water-hygiene',
    categoryName: 'Water Hygiene & Legionella',
    imageUrl: '/images/editorial/potable-water-booster-pump-set.jpg',
    imageAlt: 'Cold water booster pump set and pressurized water storage for commercial building',
    credit: 'EntireFM Technical Asset Library',
    rightsStatus: 'OWNED',
    rightsBasis: 'Direct EntireFM asset library ownership',
  },
  'building-safety': {
    categorySlug: 'building-safety',
    categoryName: 'Building Safety & Facades',
    imageUrl: '/images/editorial/building-safety-facade-inspection.jpg',
    imageAlt: 'Commercial building envelope access and structural facade inspection survey',
    credit: 'EntireFM Technical Asset Library',
    rightsStatus: 'OWNED',
    rightsBasis: 'Direct EntireFM asset library ownership',
  },
  'cleaning-workplace': {
    categorySlug: 'cleaning-workplace',
    categoryName: 'Cleaning & Workplace',
    imageUrl: '/images/editorial/entirefm-reception-1200w.webp',
    imageAlt: 'Corporate workplace environment and front-of-house facilities standards',
    credit: 'EntireFM Technical Asset Library',
    rightsStatus: 'OWNED',
    rightsBasis: 'Direct EntireFM asset library ownership',
  },
  'energy-sustainability': {
    categorySlug: 'energy-sustainability',
    categoryName: 'Energy & Sustainability',
    imageUrl: '/images/editorial/entirefm-ev-charging-1200w.webp',
    imageAlt: 'Commercial EV charging infrastructure and sub-metered energy management',
    credit: 'EntireFM Technical Asset Library',
    rightsStatus: 'OWNED',
    rightsBasis: 'Direct EntireFM asset library ownership',
  },
  'procurement-contracts': {
    categorySlug: 'procurement-contracts',
    categoryName: 'Procurement & Contracts',
    imageUrl: '/images/editorial/entirefm-external-distribution-dusk-1200w.webp',
    imageAlt: 'Commercial estate infrastructure and logistics facilities management',
    credit: 'EntireFM Technical Asset Library',
    rightsStatus: 'OWNED',
    rightsBasis: 'Direct EntireFM asset library ownership',
  },
  'engineering-maintenance': {
    categorySlug: 'engineering-maintenance',
    categoryName: 'Engineering & Maintenance',
    imageUrl: '/images/editorial/rooftop-condenser-plant-deck.jpg',
    imageAlt: 'Commercial rooftop HVAC plant deck and chilled water pipework',
    credit: 'EntireFM Technical Asset Library',
    rightsStatus: 'OWNED',
    rightsBasis: 'Direct EntireFM asset library ownership',
  },
  'technology-cafm': {
    categorySlug: 'technology-cafm',
    categoryName: 'Technology & CAFM',
    imageUrl: '/images/editorial/entirefm-corporate-corridor-1200w.webp',
    imageAlt: 'Modern commercial facility with digital asset management and sensor monitoring',
    credit: 'EntireFM Technical Asset Library',
    rightsStatus: 'OWNED',
    rightsBasis: 'Direct EntireFM asset library ownership',
  },
};

/**
 * Normalises category keys to match the curated library
 */
export function normaliseCategoryKey(category: string): string {
  const norm = category.toLowerCase().trim();
  if (norm.includes('fire') || norm.includes('life-safety')) return 'fire-safety';
  if (norm.includes('hvac') || norm.includes('chiller') || norm.includes('ventilation') || norm.includes('f-gas')) return 'hvac-mechanical';
  if (norm.includes('electric') || norm.includes('power') || norm.includes('switchgear') || norm.includes('eicr')) return 'electrical';
  if (norm.includes('water') || norm.includes('legionella') || norm.includes('acop') || norm.includes('plumb')) return 'water-hygiene';
  if (norm.includes('building-safety') || norm.includes('bsr') || norm.includes('golden-thread') || norm.includes('facade')) return 'building-safety';
  if (norm.includes('clean') || norm.includes('workplace') || norm.includes('soft-fm') || norm.includes('janitorial')) return 'cleaning-workplace';
  if (norm.includes('energy') || norm.includes('sustainab') || norm.includes('carbon') || norm.includes('net-zero') || norm.includes('solar')) return 'energy-sustainability';
  if (norm.includes('contract') || norm.includes('procurement') || norm.includes('tender') || norm.includes('mobilis')) return 'procurement-contracts';
  if (norm.includes('tech') || norm.includes('cafm') || norm.includes('ai') || norm.includes('software') || norm.includes('iot')) return 'technology-cafm';
  return 'engineering-maintenance';
}

/**
 * Resolves rights-safe image for an editorial candidate.
 * If rights are unknown or restricted -> automatically uses curated EntireFM fallback.
 */
export function resolveSafeImage(params: {
  candidateImageUrl?: string;
  rightsStatus?: ImageRightsStatus;
  rightsBasis?: string;
  credit?: string;
  altText?: string;
  category: string;
  headline?: string;
}): ImageProvenanceRecord {
  const normCategory = normaliseCategoryKey(params.category);
  const fallback = CURATED_FM_FALLBACK_LIBRARY[normCategory] || CURATED_FM_FALLBACK_LIBRARY['engineering-maintenance'];

  // Check if candidate image has verified approved rights
  const approvedStatuses: ImageRightsStatus[] = [
    'OWNED',
    'LICENSED',
    'PRESS_ASSET_APPROVED',
    'OPEN_ATTRIBUTION',
    'MANUALLY_APPROVED',
  ];

  if (
    params.candidateImageUrl &&
    params.rightsStatus &&
    approvedStatuses.includes(params.rightsStatus)
  ) {
    return {
      imageUrl: params.candidateImageUrl,
      imageAlt: params.altText || params.headline || fallback.imageAlt,
      imageRightsStatus: params.rightsStatus,
      imageRightsBasis: params.rightsBasis || 'Approved editorial asset',
      imageCredit: params.credit || 'Source Publication / Press Asset',
      originalSourceImageUrl: params.candidateImageUrl,
      isCuratedFallback: false,
    };
  }

  // Fallback to verified EntireFM curated asset
  return {
    imageUrl: fallback.imageUrl,
    imageAlt: params.altText || fallback.imageAlt,
    imageRightsStatus: fallback.rightsStatus,
    imageRightsBasis: fallback.rightsBasis,
    imageCredit: fallback.credit,
    originalSourceImageUrl: params.candidateImageUrl,
    isCuratedFallback: true,
  };
}
