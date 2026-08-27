/**
 * ENTIREFM ASK THE LOBBY — ENGINE TEST SUITE
 * ===========================================
 * Unit tests verifying intent classification, time-awareness,
 * jurisdiction handling, citation assembly, Deep Research mode,
 * saved research snapshotting, and PDF export definition.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AskTheLobbyEngine } from '../ask-engine';
import { saveResearch, getSavedResearchByMember, deleteSavedResearch } from '../saved-research-store';
import { buildAskLobbyPdfDefinition } from '@/lib/pdf/ask-lobby-pdf';

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
    assert.equal(engine.classifyIntent('What is the standard testing interval for commercial EICRs?'), 'TECHNICAL');
  });
});

describe('AskTheLobbyEngine Grounding & EICR Researched Answers', () => {
  const engine = new AskTheLobbyEngine();

  it('researches commercial EICR testing intervals in Quick Ask mode with genuine citations', async () => {
    const res = await engine.answerQuestion('What is the standard testing interval for commercial EICRs?', {
      mode: 'ask',
    });

    assert.equal(res.isGrounded, true);
    assert.ok(res.citations.length >= 3);
    assert.ok(res.shortAnswer.includes('5 years'));
    assert.ok(res.shortAnswer.includes('EICR') || res.shortAnswer.includes('Electrical Installation Condition Report'));
    assert.ok(res.officialPosition !== undefined);
    assert.ok(res.officialPosition.includes('Electricity at Work Regulations 1989'));
    assert.ok(res.technicalGuidance !== undefined);
    assert.ok(res.technicalGuidance.includes('BS 7671'));

    // Check citations
    const cit1 = res.citations.find((c) => c.sourceName.includes('IET') || c.title.includes('BS 7671'));
    assert.ok(cit1 !== undefined);
    assert.ok(cit1.sourceUrl.startsWith('https://'));

    const cit2 = res.citations.find((c) => c.sourceName.includes('legislation.gov.uk') || c.title.includes('Electricity at Work'));
    assert.ok(cit2 !== undefined);
  });

  it('researches commercial EICR testing intervals in Deep Research mode with genuine execution stages', async () => {
    const res = await engine.answerQuestion('What is the standard testing interval for commercial EICRs?', {
      mode: 'deep_research',
    });

    assert.equal(res.mode, 'deep_research');
    assert.equal(res.isGrounded, true);
    assert.ok(res.citations.length >= 3);
    assert.ok(res.researchStages !== undefined);
    assert.ok(res.researchStages.length >= 4);

    // Verify stages are completed (not fake or pending)
    for (const stage of res.researchStages) {
      assert.ok(stage.status === 'completed' || stage.status === 'skipped');
    }

    assert.ok(res.deepResearchReport !== undefined);
    assert.ok(res.deepResearchReport.statutoryRequirements.length > 0);
    assert.ok(res.deepResearchReport.technicalGuidance.length > 0);
  });

  it('handles unknown ungrounded queries gracefully without fabricating citations', async () => {
    const res = await engine.answerQuestion('What are the Martian hyperloop regulations for year 2099?');
    assert.equal(res.isGrounded, false);
    assert.equal(res.citations.length, 0);
    assert.ok(
      res.shortAnswer.includes('INSUFFICIENT VERIFIED EVIDENCE') ||
      res.shortAnswer.includes('could not') ||
      res.shortAnswer.includes('No direct match') ||
      res.shortAnswer.includes('temporarily unavailable')
    );
  });
});

describe('Saved Research Store & PDF Document Generation', () => {
  const engine = new AskTheLobbyEngine();

  it('saves an immutable research snapshot to the member library', async () => {
    const memberId = 'mem-test-researcher';
    const answer = await engine.answerQuestion('What is the standard testing interval for commercial EICRs?');

    const saved = await saveResearch(memberId, answer);
    assert.ok(saved.id.startsWith('res-'));
    assert.equal(saved.memberId, memberId);
    assert.equal(saved.sourceCount, answer.citations.length);
    assert.equal(saved.answerSnapshot.shortAnswer, answer.shortAnswer);

    const memberList = await getSavedResearchByMember(memberId);
    assert.ok(memberList.length >= 1);
    assert.equal(memberList[0].id, saved.id);

    // Clean up
    const deleted = await deleteSavedResearch(saved.id, memberId);
    assert.equal(deleted, true);
  });

  it('builds a high-fidelity EntireFM-branded PDF document definition from answer snapshot', async () => {
    const answer = await engine.answerQuestion('What is the standard testing interval for commercial EICRs?');
    const { doc, filename } = buildAskLobbyPdfDefinition(answer);

    assert.ok(filename.startsWith('EntireFM_Ask_The_Lobby_'));
    assert.ok(filename.endsWith('.pdf'));
    assert.equal(doc.title, 'THE LOBBY · RESEARCH BRIEF');
    assert.ok(doc.sections.length >= 4);

    const citationsSection = doc.sections.find((s) => s.heading === 'Verified Sourced Citations');
    assert.ok(citationsSection !== undefined);
    assert.equal(citationsSection.type, 'table');
  });
});
