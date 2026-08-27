/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — DEDUPLICATION & EVENT CLUSTERING ENGINE
 * =============================================================================
 * Groups multi-source articles reporting on the same underlying real-world event.
 * Tier 1 (Statutory/Regulator) sources always outrank Tier 3/4 sources to become
 * the canonical Primary Source.
 */

import type { CanonicalIntelligenceItem, SecondarySourceReference } from './types';

export class DeduplicationEngine {
  /**
   * Cluster items by semantic similarity / underlying event.
   * If GNews (Tier 4) and GOV.UK (Tier 1) both report on "Building Safety Secondary Legislation",
   * GOV.UK becomes the Primary Source and GNews becomes Secondary Coverage.
   */
  public static clusterEvents(items: CanonicalIntelligenceItem[]): CanonicalIntelligenceItem[] {
    const clustered: CanonicalIntelligenceItem[] = [];
    const processedIds = new Set<string>();

    // Sort by authority tier ascending (Tier 1 first) so primary authority leads
    const sorted = [...items].sort((a, b) => a.authorityTier - b.authorityTier);

    for (let i = 0; i < sorted.length; i++) {
      const base = sorted[i];
      if (processedIds.has(base.id)) continue;
      processedIds.add(base.id);

      const secondaryReferences: SecondarySourceReference[] = [...base.secondarySources];

      for (let j = i + 1; j < sorted.length; j++) {
        const candidate = sorted[j];
        if (processedIds.has(candidate.id)) continue;

        if (this.isSameEvent(base, candidate)) {
          processedIds.add(candidate.id);

          // Add candidate as secondary source coverage
          secondaryReferences.push({
            sourceName: candidate.primarySource.name,
            sourceUrl: candidate.canonicalUrl,
            authorityTier: candidate.authorityTier,
            title: candidate.title,
            publishedAt: candidate.publishedAt,
            summarySnippet: candidate.standfirst,
          });
        }
      }

      clustered.push({
        ...base,
        secondarySources: secondaryReferences,
      });
    }

    return clustered;
  }

  /** Check if two items represent the same underlying event */
  public static isSameEvent(a: CanonicalIntelligenceItem, b: CanonicalIntelligenceItem): boolean {
    // 1. Same canonical URL
    if (a.canonicalUrl === b.canonicalUrl) return true;

    // 2. Same statutory citation if available
    if (a.relatedStatuteCitation && b.relatedStatuteCitation && a.relatedStatuteCitation === b.relatedStatuteCitation) {
      return true;
    }

    // 3. High Jaccard title token similarity
    const titleSim = this.calculateTitleSimilarity(a.title, b.title);
    if (titleSim >= 0.40) {
      // Check if published within 7 days of each other
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      if (Math.abs(dateA - dateB) < 7 * 24 * 3600 * 1000) {
        return true;
      }
    }

    return false;
  }

  private static calculateTitleSimilarity(titleA: string, titleB: string): number {
    const wordsA = new Set(
      titleA
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );
    const wordsB = new Set(
      titleB
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );

    if (wordsA.size === 0 || wordsB.size === 0) return 0;

    let intersection = 0;
    for (const w of Array.from(wordsA)) {
      if (wordsB.has(w)) intersection++;
    }

    const union = new Set([...Array.from(wordsA), ...Array.from(wordsB)]).size;
    return intersection / union;
  }
}
