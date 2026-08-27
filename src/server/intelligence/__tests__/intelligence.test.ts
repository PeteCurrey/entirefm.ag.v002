/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — TEST SUITE
 * =================================================
 * Unit tests verifying taxonomy classification, CPV mapping,
 * jurisdiction assignment, event deduplication clustering,
 * and intelligence store invariants.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FMTaxonomyClassifier } from '../fm-classifier';
import { DeduplicationEngine } from '../deduplication-engine';
import { IntelligenceStore } from '../intelligence-store';
import { OpportunityStore } from '../opportunity-store';
import { SourceRegistry } from '../source-registry';
import type { CanonicalIntelligenceItem, ProcurementOpportunity } from '../types';

describe('FMTaxonomyClassifier', () => {
  it('classifies building safety content accurately', () => {
    const text = 'The Building Safety Regulator has issued secondary legislation on the Golden Thread for higher-risk buildings.';
    const result = FMTaxonomyClassifier.classifyText(text);
    assert.equal(result.primaryCategory, 'building-safety');
    assert.ok(result.confidence >= 0.7);
  });

  it('classifies HVAC refrigerant content accurately', () => {
    const text = 'F-gas phase-down quotas for R410A virgin refrigerant on commercial rooftop chillers.';
    const result = FMTaxonomyClassifier.classifyText(text);
    assert.equal(result.primaryCategory, 'hvac');
  });

  it('maps CPV codes to correct FM service disciplines', () => {
    assert.equal(FMTaxonomyClassifier.classifyCPV('50700000'), 'mechanical');
    assert.equal(FMTaxonomyClassifier.classifyCPV('45331000'), 'hvac');
    assert.equal(FMTaxonomyClassifier.classifyCPV('45310000'), 'electrical');
    assert.equal(FMTaxonomyClassifier.classifyCPV('45343000'), 'fire-safety');
    assert.equal(FMTaxonomyClassifier.classifyCPV('90910000'), 'cleaning-soft-fm');
  });

  it('identifies legal status correctly', () => {
    assert.equal(FMTaxonomyClassifier.determineLegalStatus('The Building Safety Act 2022', 'govuk'), 'LAW');
    assert.equal(FMTaxonomyClassifier.determineLegalStatus('Statutory Instrument 2026 No. 445', 'legislation'), 'STATUTORY_INSTRUMENT');
    assert.equal(FMTaxonomyClassifier.determineLegalStatus('Open Consultation on MEES Standards', 'govuk'), 'CONSULTATION');
    assert.equal(FMTaxonomyClassifier.determineLegalStatus('Renters Rights Bill Second Reading', 'parliament'), 'PROPOSED_LEGISLATION');
  });

  it('infers UK devolved jurisdictions correctly', () => {
    assert.deepEqual(FMTaxonomyClassifier.inferJurisdictions('New guidance for buildings in England and Wales.'), ['England', 'Wales']);
    assert.deepEqual(FMTaxonomyClassifier.inferJurisdictions('Scottish Building Standards agency update.'), ['Scotland']);
    assert.deepEqual(FMTaxonomyClassifier.inferJurisdictions('UK-wide statutory instrument.'), ['United Kingdom']);
  });
});

describe('DeduplicationEngine', () => {
  it('clusters multi-coverage articles around the Tier 1 statutory authority', () => {
    const itemGovUk: CanonicalIntelligenceItem = {
      id: 'gov-01',
      canonicalUrl: 'https://www.gov.uk/guidance/building-safety-regulator-occurrence-reporting',
      sourceContentId: 'gov-01',
      title: 'Building Safety Regulator releases mandatory occurrence reporting guidance',
      standfirst: 'Official guidance on digital occurrence reporting.',
      eventType: 'statutory_change',
      legalStatus: 'APPROVED_DOCUMENT',
      authorityTier: 1,
      primarySource: { name: 'Building Safety Regulator', url: 'https://www.gov.uk', authorityTier: 1 },
      secondarySources: [],
      publishedAt: new Date().toISOString(),
      jurisdictions: ['England'],
      tradeTags: ['building-safety'],
      topics: ['BSR'],
      provenance: { imageUrl: '/test.jpg', imageType: 'topic-fallback', altText: 'Test' },
      isStatutory: true,
      requiresReview: false,
      reviewStatus: 'auto_published',
      contentHash: 'hash-gov-01',
      firstSeenAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };

    const itemGNews: CanonicalIntelligenceItem = {
      id: 'gnews-01',
      canonicalUrl: 'https://www.fmj.co.uk/news/building-safety-occurrence-reporting-guidance',
      sourceContentId: 'gnews-01',
      title: 'Building Safety occurrence reporting guidance published for facilities managers',
      standfirst: 'FM industry reporting on the new BSR rules.',
      eventType: 'trade_news',
      legalStatus: 'NEWS',
      authorityTier: 4,
      primarySource: { name: 'FMJ Magazine', url: 'https://www.fmj.co.uk', authorityTier: 3 },
      secondarySources: [],
      publishedAt: new Date().toISOString(),
      jurisdictions: ['England'],
      tradeTags: ['building-safety'],
      topics: ['FMJ'],
      provenance: { imageUrl: '/test.jpg', imageType: 'topic-fallback', altText: 'Test' },
      isStatutory: false,
      requiresReview: false,
      reviewStatus: 'auto_published',
      contentHash: 'hash-gnews-01',
      firstSeenAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };

    const clustered = DeduplicationEngine.clusterEvents([itemGNews, itemGovUk]);
    assert.equal(clustered.length, 1);
    assert.equal(clustered[0].id, 'gov-01'); // Tier 1 leads as primary
    assert.equal(clustered[0].secondarySources.length, 1);
    assert.equal(clustered[0].secondarySources[0].sourceName, 'FMJ Magazine');
  });
});

describe('OpportunityStore', () => {
  it('stores and retrieves tenders and contract awards separately', () => {
    const store = new OpportunityStore();

    const tender: ProcurementOpportunity = {
      id: 'opp-1',
      ocid: 'ocds-1',
      source: 'Contracts Finder',
      noticeType: 'tender',
      title: 'Commercial HVAC Maintenance Contract',
      description: 'PPM maintenance for 12 commercial sites.',
      whyItMattersForFM: 'Major tender',
      buyerName: 'Crown Commercial Service',
      buyerRegion: 'London',
      cpvCodes: ['50720000'],
      serviceCategory: 'hvac',
      publishedAt: new Date().toISOString(),
      status: 'active',
      officialNoticeUrl: 'https://contractsfinder.service.gov.uk/1',
    };

    const award: ProcurementOpportunity = {
      id: 'opp-2',
      ocid: 'ocds-2',
      source: 'Find a Tender',
      noticeType: 'award',
      title: 'Total Facilities Management Award',
      description: 'Award of 5-year TFM contract.',
      whyItMattersForFM: 'Major award',
      buyerName: 'Ministry of Justice',
      buyerRegion: 'National',
      cpvCodes: ['79993000'],
      serviceCategory: 'procurement-contracts',
      publishedAt: new Date().toISOString(),
      status: 'awarded',
      officialNoticeUrl: 'https://find-tender.service.gov.uk/2',
      awardDetails: {
        supplierName: 'EntireFM Ltd',
        awardedValue: '£4,200,000',
        awardedDate: new Date().toISOString(),
      },
    };

    store.upsertBatch([tender, award]);

    const activeTenders = store.getActiveTenders();
    assert.equal(activeTenders.length, 1);
    assert.equal(activeTenders[0].title, 'Commercial HVAC Maintenance Contract');

    const awards = store.getContractAwards();
    assert.equal(awards.length, 1);
    assert.equal(awards[0].awardDetails?.supplierName, 'EntireFM Ltd');
  });
});
