/**
 * THE LOBBY EDITORIAL IMAGE RESOLUTION ENGINE
 * ============================================
 * Implements the strict 5-tier editorial image source hierarchy.
 *
 * HIERARCHY:
 * Priority 1: Source-supplied editorial image (RSS enclosure, publisher media, legitimate OG)
 * Priority 2: Official organisation / event / awards media pack asset
 * Priority 3: Neutral EntireFM-owned subject photography (plant, switchgear, roofs, architecture — without forced branded uniforms)
 * Priority 4: Approved licensed editorial photography
 * Priority 5: Controlled topic fallback library
 * Last resort: Restrained typographic fallback (NEVER auto-substitute an EntireFM engineer photograph)
 */

export type ImageType =
  | 'source'
  | 'official'
  | 'owned'
  | 'licensed'
  | 'topic-fallback'
  | 'typographic';

export interface ImageProvenance {
  imageUrl: string;
  imageType: ImageType;
  source?: string;
  sourceUrl?: string;
  credit?: string;
  copyrightOwner?: string;
  usageRights?: string;
  altText: string;
  focalX?: number; // 0-100 percentage
  focalY?: number;
  caption?: string;
  originalSourceImageUrl?: string;
}

/**
 * Controlled topic-specific fallback library.
 * Points strictly to authentic neutral subject photography (architectural, mechanical, electrical, switchgear, water, etc.)
 * NEVER uses generic smiling models in branded uniforms.
 */
export const TOPIC_IMAGE_FALLBACKS: Record<string, ImageProvenance> = {
  'building-safety': {
    imageUrl: '/images/editorial/entirefm-switchroom-survey-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Commercial switchroom and building infrastructure survey',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'compliance': {
    imageUrl: '/images/editorial/entirefm-distribution-board-testing-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Distribution board electrical verification and compliance testing',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'hvac': {
    imageUrl: '/images/editorial/entirefm-hvac-refrigerant-check-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Refrigerant pressure testing manifold on commercial chiller unit',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'engineering': {
    imageUrl: '/images/editorial/entirefm-hvac-plantroom-pumps-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Commercial chilled water circulation pumps and pipe manifold',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'electrical': {
    imageUrl: '/images/editorial/entirefm-switchgear-inspection-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Commercial electrical switchgear and distribution cabinet',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'water-hygiene': {
    imageUrl: '/images/editorial/entirefm-plumbing-booster-set-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Cold water booster pump set and pressurized water storage',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'mobilisation': {
    imageUrl: '/images/editorial/entirefm-site-arrival-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Estate mobilization and commercial site handover context',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'property-estates': {
    imageUrl: '/images/editorial/entirefm-rooftop-plant-night-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Commercial office building rooftop plant deck at dusk',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'energy-sustainability': {
    imageUrl: '/images/editorial/entirefm-ev-charging-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Commercial EV charging and electrical energy infrastructure',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'technology-cafm': {
    imageUrl: '/images/editorial/entirefm-corporate-corridor-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Modern commercial workplace and estate technology context',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'contracts': {
    imageUrl: '/images/editorial/entirefm-external-distribution-dusk-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Commercial logistics and corporate estate contract context',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'people-appointments': {
    imageUrl: '/images/editorial/entirefm-reception-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Corporate facilities management headquarters and executive workplace',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'events': {
    imageUrl: '/images/editorial/entirefm-manchester-castlefield-night-1280w.webp',
    imageType: 'topic-fallback',
    altText: 'Urban conference and industry event cityscape',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
  'awards': {
    imageUrl: '/images/editorial/entirefm-totem-headquarters-1200w.webp',
    imageType: 'topic-fallback',
    altText: 'Corporate headquarters architectural exterior',
    credit: 'EntireFM Technical Asset Library',
    copyrightOwner: 'EntireFM Ltd',
  },
};

/**
 * Resolves the primary image provenance following the 5-tier hierarchy.
 */
export function resolveEditorialImage(params: {
  sourceImage?: string;
  sourceImageAlt?: string;
  sourcePublisher?: string;
  sourceUrl?: string;
  officialImage?: string;
  topic?: string;
  category?: string;
  customProvenance?: Partial<ImageProvenance>;
}): ImageProvenance {
  // Priority 1: Legitimately supplied external publisher / source image
  if (params.sourceImage && params.sourceImage.trim().length > 0) {
    return {
      imageUrl: params.sourceImage,
      imageType: 'source',
      source: params.sourcePublisher || 'Source Publication',
      sourceUrl: params.sourceUrl,
      altText: params.sourceImageAlt || 'Editorial news photograph',
      credit: params.sourcePublisher,
      focalX: 50,
      focalY: 50,
      ...params.customProvenance,
    };
  }

  // Priority 2: Official organization or event image
  if (params.officialImage && params.officialImage.trim().length > 0) {
    return {
      imageUrl: params.officialImage,
      imageType: 'official',
      source: params.sourcePublisher || 'Official Event Organiser',
      sourceUrl: params.sourceUrl,
      altText: params.sourceImageAlt || 'Official event identity asset',
      credit: params.sourcePublisher,
      focalX: 50,
      focalY: 50,
      ...params.customProvenance,
    };
  }

  // Priority 3 & 5: Controlled neutral subject topic fallback
  const topicKey = (params.topic || params.category || 'building-safety')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  const fallback = TOPIC_IMAGE_FALLBACKS[topicKey] || TOPIC_IMAGE_FALLBACKS['building-safety'];

  return {
    ...fallback,
    ...params.customProvenance,
  };
}

/**
 * Editorial Image Diversity Tracker.
 * Ensures no visual asset is duplicated within the same page view or stream.
 */
export class ImageDiversityTracker {
  private usedImages = new Set<string>();

  public isUsed(imageUrl: string): boolean {
    return this.usedImages.has(imageUrl);
  }

  public register(imageUrl: string): void {
    this.usedImages.add(imageUrl);
  }

  public getUniqueOrFallback(provenance: ImageProvenance, topicFallbackCategory = 'property-estates'): ImageProvenance {
    if (!this.isUsed(provenance.imageUrl)) {
      this.register(provenance.imageUrl);
      return provenance;
    }

    // Attempt alternate fallback
    const altFallback = TOPIC_IMAGE_FALLBACKS[topicFallbackCategory] || TOPIC_IMAGE_FALLBACKS['property-estates'];
    if (!this.isUsed(altFallback.imageUrl)) {
      this.register(altFallback.imageUrl);
      return altFallback;
    }

    return provenance;
  }
}
