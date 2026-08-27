/**
 * ENTIREFM ASK THE LOBBY — ENGINE TEST SUITE
 * ===========================================
 * Unit tests verifying intent classification, time-awareness,
 * jurisdiction handling, citation assembly, and zero-hallucination guardrails.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AskTheLobbyEngine } from '../ask-engine';
import { intelligenceStore } from '../../intelligence/intelligence-store';
import type { CanonicalIntelligenceItem } from '../../intelligence/types';

describe('AskTheLobbyEngine Intent Classification', () => {
  const engine = new AskTheLobbyEngine();

  it('classifies procurement and tender queries correctly', () => {
    assert.equal(engine.classifyIntent('Show me open HVAC maintenance tenders in London'), 'PROCUREMENT');
    assert.equal(engine.classifyIntent('Who won the £4m cleaning contract last month?'), 'CONTRACT_AWARDS');
  });

  it('classifies building safety and compliance queries correctly', () => {
    assert.equal(engine.classifyIntent('What changed in UK building safety this week?'), 'COMPLIANCE');
    assert.equal(engine.classifyIntent('What are the statutory requirements under the Building Safety Act?'), 'COMPLIANCE');
  });

  it('classifies technical M&E queries correctly', () => {
    assert.equal(engine.classifyIntent('What do I need to know about F-gas quotas if I manage chillers?'), 'TECHNICAL');
    assert.equal(engine.classifyIntent('What is the standard testing frequency for EICR fixed wiring?'), 'TECHNICAL');
  });
});

describe('AskTheLobbyEngine Grounding & Guardrails', () => {
  const engine = new AskTheLobbyEngine();

  it('handles unknown or ungrounded queries with a graceful knowledge gap instead of inventing facts', async () => {
    const res = await engine.answerQuestion('What are the Martian space elevator regulations for 2099?');
    assert.equal(res.isGrounded, false);
    assert.equal(res.knowledgeGapIdentified, true);
    assert.ok(res.shortAnswer.includes('could not find a verified statutory requirement'));
    assert.equal(res.citations.length, 0);
    assert.ok(res.relatedActions.some((a) => a.type === 'ask_community'));
  });

  it('includes professional safety disclaimers on technical and compliance answers', async () => {
    // Seed a test item to test grounded synthesis
    const testItem: CanonicalIntelligenceItem = {
      id: 'test-bsr-01',
      canonicalUrl: 'https://www.gov.uk/guidance/building-safety',
      sourceContentId: 'test-bsr-01',
      title: 'Building Safety Guidance Update',
      standfirst: 'New duty holder guidance issued by the Building Safety Regulator.',
      whyItMatters: 'Mandatory compliance requirements.',
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
      contentHash: 'hash-test-01',
      firstSeenAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };

    intelligenceStore.ingestBatch([testItem], [], {
      sourceId: 'src-test',
      sourceName: 'Test Source',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 10,
      status: 'success',
      recordsFetched: 1,
      recordsCreated: 1,
      recordsUpdated: 0,
      duplicatesDetected: 0,
      parserVersion: 'v1',
    });

    const res = await engine.answerQuestion('What changed in building safety?');
    assert.ok(res.disclaimer !== undefined);
    assert.ok(res.disclaimer.includes('does not replace site-specific competent person inspection'));
    assert.ok(res.citations.length > 0);
  });
});
