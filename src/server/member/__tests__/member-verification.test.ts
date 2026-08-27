import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  createMemberVerificationToken,
  verifyMemberVerificationToken,
  checkVerificationRateLimit,
} from '../verification';
import {
  createMember,
  getMemberById,
  activateMember,
  authenticateMemberCredentials,
} from '../member-store';

describe('Lobby Member Email Verification', () => {
  it('generates and validates signed HMAC verification tokens', () => {
    const memberId = 'mem-test-12345';
    const email = 'test.engineer@example.co.uk';

    const token = createMemberVerificationToken(memberId, email);
    assert.ok(token);
    assert.ok(token.includes('.'));

    const payload = verifyMemberVerificationToken(token);
    assert.ok(payload);
    assert.strictEqual(payload.memberId, memberId);
    assert.strictEqual(payload.email, email);
  });

  it('rejects tampered or malformed verification tokens', () => {
    const validToken = createMemberVerificationToken('mem-1', 'user@example.com');
    const tampered = validToken.replace(/^ey/, 'ez');

    const result = verifyMemberVerificationToken(tampered);
    assert.strictEqual(result, null);

    assert.strictEqual(verifyMemberVerificationToken(''), null);
    assert.strictEqual(verifyMemberVerificationToken('not-a-token'), null);
  });

  it('enforces server-side rate limiting on verification resends', () => {
    const email = `rate-test-${Date.now()}@example.com`;

    const first = checkVerificationRateLimit(email);
    assert.strictEqual(first.allowed, true);
    assert.strictEqual(first.remainingSeconds, 0);

    const second = checkVerificationRateLimit(email);
    assert.strictEqual(second.allowed, false);
    assert.ok(second.remainingSeconds > 0 && second.remainingSeconds <= 60);
  });

  it('creates new members in pending_verification status and prevents unverified sign-in', async () => {
    const testEmail = `engineer-${Date.now()}@entirefm-test.com`;
    const newMember = await createMember({
      first_name: 'Alex',
      last_name: 'Davies',
      email: testEmail,
      password: 'StrongPassword2026!',
      job_title: 'Facilities Manager',
      company: 'Apex Commercial Estates',
      termsVersion: '2026.1',
      privacyVersion: '2026.1',
    });

    assert.strictEqual(newMember.member_status, 'pending_verification');

    // Attempt sign-in with valid credentials but unverified email
    const authResult = await authenticateMemberCredentials(testEmail, 'StrongPassword2026!');
    assert.strictEqual(authResult.success, false);
    assert.strictEqual(authResult.requiresVerification, true);

    // Activate the member
    const activated = await activateMember(newMember.id);
    assert.ok(activated);
    assert.strictEqual(activated.member_status, 'active');
    assert.ok(activated.email_verified_at);

    // Sign in again after verification
    const verifiedAuth = await authenticateMemberCredentials(testEmail, 'StrongPassword2026!');
    assert.strictEqual(verifiedAuth.success, true);
    assert.strictEqual(verifiedAuth.member?.member_status, 'active');
  });
});
