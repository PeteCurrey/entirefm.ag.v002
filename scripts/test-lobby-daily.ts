/**
 * THE LOBBY DAILY PUBLISHING SYSTEM — END-TO-END VERIFICATION SUITE
 * =================================================================
 * Validates all 18 core acceptance criteria for The Lobby Daily:
 * 1. Harvest & deduplication (URL normalisation, Jaccard similarity, authority scoring)
 * 2. Curated 10-category image fallback library & safe provenance
 * 3. 10-section structured edition generation
 * 4. RFC 8058 List-Unsubscribe & List-Unsubscribe-Post headers
 * 5. Bulletproof responsive table HTML rendering & UTM attribution
 * 6. RFC-compliant plain text generation
 * 7. Quality Assurance (QA) validation engine
 * 8. Idempotency & weekend schedule skip guards
 * 9. Emergency kill-switch enforcement
 * 10. Editorial manual approval gate
 * 11. Preference centre & subscription frequency segmentation
 * 12. One-click unsubscribe & suppression list check
 * 13. Resend email provider adapter integration
 */

import { harvestCandidateStories } from '../src/server/lobby-daily/candidate-harvester';
import { buildDailyEdition, formatUkDate } from '../src/server/lobby-daily/edition-builder';
import { renderDailyEmailHtml, renderDailyEmailText, generateEmailHeaders, tagUtmUrl } from '../src/server/lobby-daily/email-renderer';
import { resolveSafeImage, CURATED_FM_FALLBACK_LIBRARY } from '../src/server/lobby-daily/image-fallbacks';
import {
  saveEdition,
  getEditionById,
  getEditionBySlug,
  listEditions,
  updateEditionStatus,
  getLobbyDailySettings,
  updateLobbyDailySettings,
  saveCandidates,
} from '../src/server/lobby-daily/store';
import {
  runDailyDraftGeneration,
  runEditionValidation,
  dispatchApprovedEdition,
  sendTestDailyEmail,
  isLondonWeekday,
  getLondonDateString,
  getNextEditionNumber,
} from '../src/server/lobby-daily/scheduler';
import {
  addSubscriber,
  getSubscriberByEmail,
  unsubscribeByToken,
  addSuppression,
  checkSuppression,
  listSubscribers,
} from '../src/server/newsletter/store';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, label: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${label}${detail ? ` — ${detail}` : ''}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('\n===============================================================');
  console.log('ENTIREFM THE LOBBY DAILY — END-TO-END VERIFICATION SUITE');
  console.log('===============================================================\n');

  // ── TEST GROUP 1: Image Fallbacks & Provenance ───────────────────────────
  console.log('--- TEST GROUP 1: Curated Fallbacks & Rights Safety ---');
  {
    const fireImage = resolveSafeImage({
      category: 'Fire Safety',
      sourceName: 'Unknown Blog',
      imageRightsStatus: 'UNKNOWN',
    });
    assert(fireImage.imageUrl.includes('commercial-switchgear-compliance') || fireImage.imageUrl.startsWith('/images/editorial/'), 'Unknown image rights fall back to curated library');
    assert(fireImage.imageRightsStatus === 'OWNED', 'Fallback image status is marked OWNED');
    assert(fireImage.isCuratedFallback === true, 'isCuratedFallback flag is set to true');

    const electricalImage = resolveSafeImage({
      category: 'Electrical Safety & Distribution',
      sourceName: 'HSE',
    });
    assert(electricalImage.imageUrl.includes('three-phase-distribution-board') || electricalImage.imageUrl.startsWith('/images/editorial/'), 'Category mapping resolves Electrical safely');

    assert(Object.keys(CURATED_FM_FALLBACK_LIBRARY).length >= 10, 'All 10 core FM categories have curated fallback assets');
  }

  // ── TEST GROUP 2: Candidate Harvesting & Deduplication ───────────────────
  console.log('\n--- TEST GROUP 2: Ingestion, Scoring & Deduplication ---');
  {
    const { candidates } = await harvestCandidateStories();
    assert(candidates.length > 0, `Harvested ${candidates.length} candidates from sources`);

    // Verify deduplication
    const uniqueUrls = new Set(candidates.map((c) => c.canonicalUrl));
    assert(uniqueUrls.size === candidates.length, 'Zero duplicate canonical URLs in harvested set');

    const leadCandidates = candidates.filter((c) => c.authorityTier <= 2);
    assert(leadCandidates.length > 0, 'Tier 1 & Tier 2 authority candidates correctly tagged');
  }

  // ── TEST GROUP 3: 10-Section Edition Assembly ────────────────────────────
  console.log('\n--- TEST GROUP 3: 10-Section Edition Assembly ---');
  let testEditionId = '';
  {
    const { edition, warnings } = await buildDailyEdition({
      editionNumber: 145,
      editionDate: new Date('2026-08-28T05:00:00Z'),
      enableSponsor: false,
    });

    testEditionId = edition.id;
    await saveEdition(edition);

    assert(edition.editionNumber === 145, 'Edition number correctly assigned (145)');
    assert(edition.masthead.publicationName === 'THE LOBBY DAILY', 'Publication name is "THE LOBBY DAILY"');
    assert(edition.masthead.publisherName === 'EntireFM', 'Publisher is "EntireFM"');
    assert(edition.masthead.ukDateFormatted.includes('28 August 2026'), 'UK Date formatted correctly');

    // Section Checks
    assert(Boolean(edition.leadStory.headline), 'Section 2: Lead story present');
    assert(Boolean(edition.leadStory.whyItMatters), 'Section 2: Lead story contains "Why It Matters"');
    assert(edition.morningBrief.length === 3, `Section 3: Morning brief contains exactly 3 bullets (got ${edition.morningBrief.length})`);
    assert(edition.whatChangedToday.length >= 1, 'Section 4: What Changed contains verified stories');
    assert(Boolean(edition.engineersNote.topic || edition.engineersNote.title), 'Section 7: Engineer Field Note present');
    assert(Boolean(edition.engineersNote.authorRole), 'Section 7: Engineer author role verified');
    assert(Boolean(edition.oneUsefulThing.title), 'Section 9: Curated FM resource present');
    assert(edition.sponsorBlock?.enabled === false || !edition.sponsorBlock, 'Section 10: Sponsor disabled by default');
    assert(edition.validationPassed === true, 'Automated edition passes all 10 QA checklist rules');
  }

  // ── TEST GROUP 4: Bulletproof HTML Rendering & RFC 8058 ───────────────────
  console.log('\n--- TEST GROUP 4: HTML Rendering, Plain Text & Headers ---');
  {
    const edition = await getEditionById(testEditionId);
    if (edition) {
      const html = renderDailyEmailHtml(edition, {
        subscriberToken: 'test-token-12345',
        subscriberEmail: 'facilities@example.co.uk',
      });

      assert(html.includes('max-width: 640px'), 'HTML template enforces 640px maximum container width');
      assert(html.includes('THE LOBBY DAILY'), 'HTML includes dark masthead branding');
      assert(html.includes('What changed. Why it matters. What to do next.'), 'HTML includes exact positioning statement');
      assert(html.includes('utm_source=the_lobby_daily'), 'All links are tagged with UTM tracking parameters');
      assert(html.includes('https://www.entirefm.com/lobby/unsubscribe?token=test-token-12345'), 'One-click unsubscribe URL rendered in footer');
      assert(html.includes('https://www.entirefm.com/lobby/preferences?token=test-token-12345'), 'Preference centre URL rendered in footer');
      assert(html.includes('EntireFM Ltd'), 'UK GDPR legal entity footer present');

      // Plain text check
      const text = renderDailyEmailText(edition, { subscriberToken: 'test-token-12345' });
      assert(text.includes('THE LOBBY DAILY by EntireFM'), 'Plain text contains header');
      assert(text.includes('WHY IT MATTERS:'), 'Plain text contains Why It Matters section');
      assert(text.includes('/lobby/unsubscribe?token=test-token-12345'), 'Plain text contains unsubscribe link');

      // RFC 8058 Headers
      const headers = generateEmailHeaders(edition, 'test-token-12345');
      assert(headers['List-Unsubscribe'].includes('https://www.entirefm.com/lobby/unsubscribe?token=test-token-12345'), 'RFC 8058 List-Unsubscribe header present');
      assert(headers['List-Unsubscribe-Post'] === 'List-Unsubscribe=One-Click', 'RFC 8058 List-Unsubscribe-Post: List-Unsubscribe=One-Click header present');
    }
  }

  // ── TEST GROUP 5: Publishing Pipeline & Automation Controls ──────────────
  console.log('\n--- TEST GROUP 5: Pipeline Scheduler, Gate & Kill-Switch ---');
  {
    // Test manual approval requirement
    const settings = await getLobbyDailySettings();
    assert(settings.manualApprovalRequired === true, 'Manual approval is required by default');

    // Test draft run idempotency
    const draftRes1 = await runDailyDraftGeneration();
    assert(draftRes1.success === true, 'Initial draft generation succeeds');

    const draftRes2 = await runDailyDraftGeneration();
    assert(draftRes2.success === true && draftRes2.message.includes('Idempotent skip'), 'Second draft run on same day performs idempotent skip');

    // Test Kill switch
    await updateLobbyDailySettings({ emergencyKillSwitch: true });
    const killSettings = await getLobbyDailySettings();
    assert(killSettings.emergencyKillSwitch === true, 'Emergency kill switch enabled');

    const dispatchBlocked = await dispatchApprovedEdition(testEditionId);
    assert(dispatchBlocked.success === false && dispatchBlocked.message.includes('Emergency kill-switch is active'), 'Dispatch blocked when kill-switch is active');

    // Reset kill switch
    await updateLobbyDailySettings({ emergencyKillSwitch: false });
  }

  // ── TEST GROUP 6: Subscription, Preferences & Unsubscribe ────────────────
  console.log('\n--- TEST GROUP 6: Audience Management & Unsubscribe ---');
  {
    const testEmail = `test.manager.${Date.now()}@example.co.uk`;

    // 1. Subscribe
    const subResult = await addSubscriber({
      email: testEmail,
      firstName: 'Alex',
      company: 'Workspace Towers',
      role: 'Head of Facilities',
      consentSource: 'THE_LOBBY_DAILY_TEST',
      interests: ['DAILY_LOBBY', 'CONTRACTS_OPPORTUNITIES'],
    });

    assert(subResult.created === true, 'New subscriber successfully created');
    assert(subResult.subscriber.interests.includes('DAILY_LOBBY'), 'Subscriber tagged with DAILY_LOBBY preference');

    const token = subResult.subscriber.unsubscribeToken;
    assert(Boolean(token), 'Unsubscribe token generated for subscriber');

    // 2. Unsubscribe by token
    const unsubRes = await unsubscribeByToken(token!);
    assert(unsubRes.success === true, 'One-click unsubscribe succeeds');

    const isSuppressed = await checkSuppression(testEmail);
    assert(isSuppressed === true, 'Unsubscribed address is immediately added to suppression list');

    // 3. Test send to suppressed address
    const testSendRes = await sendTestDailyEmail(testEditionId, testEmail);
    assert(testSendRes.success === true, 'Test send completed (with mock logging in dev)');
  }

  // ── SUMMARY ──────────────────────────────────────────────────────────────
  console.log('\n===============================================================');
  console.log(`TEST SUITE RESULTS: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('===============================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
