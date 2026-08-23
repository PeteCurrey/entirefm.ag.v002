import {
  createSessionToken,
  verifySessionToken,
  hasPermission,
  getPostLoginRedirect,
  getRolePermissions,
  UserSession,
} from '../../server/identity';
import { mapLegacyAssetToCanonical } from '../../server/migration';
import { isDbConfigured } from '../../server/db/client';

describe('EntireFM Unified Platform — Phase 0A Foundation Tests', () => {
  const sampleSession: UserSession = {
    personId: '11111111-1111-1111-1111-111111111111',
    email: 'ceo@entirefm.com',
    name: 'Chief Executive',
    role: 'CEO',
    orgId: '22222222-2222-2222-2222-222222222222',
    orgName: 'EntireFM Headquarters',
    orgType: 'ENTIREFM',
    permissions: getRolePermissions('CEO'),
    scopes: [{ type: 'ORGANISATION', id: '22222222-2222-2222-2222-222222222222' }],
    expiresAt: Date.now() + 1000 * 60 * 60,
  };

  test('generates and verifies tamper-proof session tokens', () => {
    const token = createSessionToken(sampleSession);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe('ceo@entirefm.com');
    expect(decoded?.role).toBe('CEO');
    expect(decoded?.orgType).toBe('ENTIREFM');
  });

  test('rejects tampered or forged session tokens', () => {
    const validToken = createSessionToken(sampleSession);
    const tampered = validToken.slice(0, -5) + 'abcde';
    expect(verifySessionToken(tampered)).toBeNull();
  });

  test('enforces role-based permissions correctly', () => {
    expect(hasPermission(sampleSession, 'command:access')).toBe(true);
    expect(hasPermission(sampleSession, 'command:ceo')).toBe(true);
    expect(hasPermission(sampleSession, 'operations:dispatch')).toBe(true);
    expect(hasPermission(sampleSession, 'ai:control')).toBe(true);

    const clientSession: UserSession = {
      ...sampleSession,
      role: 'CLIENT_USER',
      orgType: 'CLIENT',
      permissions: getRolePermissions('CLIENT_USER'),
    };
    expect(hasPermission(clientSession, 'operations:read')).toBe(true);
    expect(hasPermission(clientSession, 'command:ceo')).toBe(false);
    expect(hasPermission(clientSession, 'ai:control')).toBe(false);
  });

  test('routes authenticated users to appropriate role destination', () => {
    expect(getPostLoginRedirect('CEO', 'ENTIREFM')).toBe('/admin');
    expect(getPostLoginRedirect('OPERATIONS_MANAGER', 'ENTIREFM')).toBe('/admin');
    expect(getPostLoginRedirect('CLIENT_ADMIN', 'CLIENT')).toBe('/client');
    expect(getPostLoginRedirect('CONTRACTOR_DISPATCHER', 'CONTRACTOR')).toBe('/contractor');
    expect(getPostLoginRedirect('ENGINEER', 'ENTIREFM')).toBe('/engineer');
  });

  test('legacy asset mapping preserves canonical domain schema integrity', () => {
    const legacyItem = {
      legacyId: 'LEG-9988',
      siteName: 'Meadowhall Centre',
      assetDescription: 'Main Boiler Unit 1',
      category: 'HVAC',
      serialNumber: 'SN-44321',
      installDate: '2022-04-15',
    };
    const canonical = mapLegacyAssetToCanonical(legacyItem, 'site-uuid-123');
    expect(canonical.site_id).toBe('site-uuid-123');
    expect(canonical.asset_reference).toBe('AST-LEG-9988');
    expect(canonical.name).toBe('Main Boiler Unit 1');
    expect(canonical.condition).toBe('GOOD');
    expect(canonical.status).toBe('IN_SERVICE');
    expect(canonical.metadata.migratedFromLegacy).toBe(true);
  });
});
