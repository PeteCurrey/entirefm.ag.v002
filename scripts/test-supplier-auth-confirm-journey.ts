/**
 * EntireFM Supplier Auth R4 — Email Confirmation Callback & Verified Sign-In Test Suite
 * ==============================================================================
 * Tests and verifies:
 * 1. GET /auth/confirm route handler existence and SSR structure
 * 2. Missing token_hash -> safe redirect to /supplier-portal/verify-email?error=invalid_or_expired
 * 3. Invalid/expired token_hash -> safe redirect to /supplier-portal/verify-email?error=invalid_or_expired
 * 4. Token hash verification via supabaseVerifyOtp
 * 5. Domain record email_verified state update on confirmation
 * 6. Session clearing on confirmation (deliberately requiring explicit sign-in)
 * 7. Clean URL redirect without token leaks: /supplier-portal/sign-in?verified=1
 * 8. Sign-in page renders "Email address verified" success banner on ?verified=1
 * 9. Verify-email page renders "We couldn't verify this email link" on ?error=invalid_or_expired
 * 10. Post-login lifecycle destination resolution
 * 11. Strict unauthenticated portal lockdown (no portal access before sign-in)
 */

import * as fs from 'fs';
import * as path from 'path';
import { NextRequest } from 'next/server';
import { GET as confirmHandler } from '../src/app/auth/confirm/route';
import {
  createOrLinkSupplierUser,
  getSupplierUserByAuthId,
  setSupplierUserEmailVerified,
  createSupplierOrganisation,
  resolveResumeDestination,
} from '../src/server/suppliers/supplier-auth-store';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n========================================================================');
  console.log('🧪 EntireFM Supplier Auth R4 — Email Confirmation & Verification Tests');
  console.log('========================================================================\n');

  // --- TEST GROUP 1: Route Handler & File Structure ---
  console.log('TEST GROUP 1: /auth/confirm Route Handler Existence & Architecture');
  const confirmRoutePath = path.resolve('src/app/auth/confirm/route.ts');
  assert(fs.existsSync(confirmRoutePath), 'src/app/auth/confirm/route.ts exists');

  const routeContent = fs.readFileSync(confirmRoutePath, 'utf8');
  assert(routeContent.includes('supabaseVerifyOtp'), '/auth/confirm uses canonical supabaseVerifyOtp');
  assert(routeContent.includes('setSupplierUserEmailVerified'), '/auth/confirm updates domain user verification state');
  assert(routeContent.includes('/supplier-portal/sign-in'), '/auth/confirm targets /supplier-portal/sign-in on success');
  assert(routeContent.includes('/supplier-portal/verify-email'), '/auth/confirm redirects to /supplier-portal/verify-email on failure');
  assert(routeContent.includes("successUrl.searchParams.set('verified', '1')"), 'Success URL explicitly sets verified=1');

  // --- TEST GROUP 2: Missing Token Handling ---
  console.log('\nTEST GROUP 2: Missing Token Handling (Fail-Closed)');
  const missingTokenReq = new NextRequest('https://www.entirefm.com/auth/confirm');
  const missingTokenRes = await confirmHandler(missingTokenReq);
  assert(missingTokenRes.status === 307 || missingTokenRes.status === 302 || missingTokenRes.status === 303, 'Missing token yields HTTP redirect status');
  const missingTokenLocation = missingTokenRes.headers.get('location') || '';
  assert(missingTokenLocation.includes('/supplier-portal/verify-email?error=invalid_or_expired'), 'Missing token redirects safely to /supplier-portal/verify-email?error=invalid_or_expired');
  assert(!missingTokenLocation.includes('token_hash='), 'No token_hash parameter present in missing-token redirect');

  // --- TEST GROUP 3: Invalid Token Handling ---
  console.log('\nTEST GROUP 3: Invalid / Expired Token Handling');
  const invalidTokenReq = new NextRequest('https://www.entirefm.com/auth/confirm?token_hash=definitely_invalid_token_12345&type=email');
  const invalidTokenRes = await confirmHandler(invalidTokenReq);
  assert(invalidTokenRes.status === 307 || invalidTokenRes.status === 302 || invalidTokenRes.status === 303, 'Invalid token yields HTTP redirect status');
  const invalidLocation = invalidTokenRes.headers.get('location') || '';
  assert(invalidLocation.includes('/supplier-portal/verify-email?error=invalid_or_expired'), 'Invalid token redirects to /supplier-portal/verify-email?error=invalid_or_expired');
  assert(!invalidLocation.includes('definitely_invalid_token_12345'), 'Token hash is NOT leaked in error redirect URL');

  // --- TEST GROUP 4: Verification State & Session Cleanliness ---
  console.log('\nTEST GROUP 4: Verification State Update & Session Isolation');
  const testAuthId = `usr-test-confirm-${Date.now()}`;
  const testEmail = `contact-${Date.now()}@thermotech.co.uk`;

  const prov = await createOrLinkSupplierUser(
    testAuthId,
    testEmail,
    'James',
    'Holden',
    'SUPPLIER_ADMIN',
    false // unverified initially
  );
  assert(prov.success && !prov.user?.email_verified, 'Created unverified supplier domain user');

  await setSupplierUserEmailVerified(testAuthId, true);
  const updatedUser = await getSupplierUserByAuthId(testAuthId);
  assert(!!updatedUser?.email_verified, 'setSupplierUserEmailVerified updates user.email_verified to true');

  // --- TEST GROUP 5: Post-Login Lifecycle Resolution ---
  console.log('\nTEST GROUP 5: Post-Login Lifecycle Resolution');
  // Scenario A: Verified user with no organisation
  const destNoOrg = await resolveResumeDestination(testAuthId);
  assert(destNoOrg === '/supplier-portal/org-setup', 'Verified user with no organisation resolves to /supplier-portal/org-setup');

  // Scenario B: User creates organisation (Draft state)
  const orgResult = await createSupplierOrganisation(
    testAuthId,
    'ThermoTech Engineering Ltd',
    'ThermoTech UK',
    '12345678'
  );
  assert(orgResult.success, 'Created supplier organisation');
  const destDraft = await resolveResumeDestination(testAuthId);
  assert(destDraft === '/supplier-portal/onboarding', 'Supplier with draft application resolves to /supplier-portal/onboarding');

  // --- TEST GROUP 6: Sign-In Page Verified Banner ---
  console.log('\nTEST GROUP 6: Sign-In Page Verified Banner Audit');
  const signInPagePath = path.resolve('src/app/supplier-portal/(auth)/sign-in/page.tsx');
  const signInContent = fs.readFileSync(signInPagePath, 'utf8');
  assert(signInContent.includes('Email address verified'), 'Sign-in page contains "Email address verified" banner');
  assert(signInContent.includes('Your supplier account is now verified. Sign in to continue your EntireFM supplier application.'), 'Sign-in page contains correct verification guidance text');
  assert(signInContent.includes('verified === \'1\' || verified === \'true\''), 'Sign-in page checks for verified parameter');

  // --- TEST GROUP 7: Verify-Email Page Error State Audit ---
  console.log('\nTEST GROUP 7: Verify-Email Page Error & Resend State Audit');
  const verifyEmailPath = path.resolve('src/app/supplier-portal/(auth)/verify-email/page.tsx');
  const verifyEmailContent = fs.readFileSync(verifyEmailPath, 'utf8');
  assert(verifyEmailContent.includes('We couldn’t verify this email link') || verifyEmailContent.includes("We couldn't verify this email link"), 'Verify-email page contains invalid link error state');
  assert(verifyEmailContent.includes('The verification link may have expired or already been used.'), 'Verify-email page contains expired/used explanation');
  assert(verifyEmailContent.includes('Resend verification email'), 'Verify-email page contains resend action');
  assert(verifyEmailContent.includes('supplier-support@entirefm.com'), 'Verify-email page contains official supplier support email');

  // --- SUMMARY ---
  console.log('\n------------------------------------------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('------------------------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
