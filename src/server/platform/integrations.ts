/**
 * ENTIREFM CANONICAL PLATFORM INTEGRATION STATE SERVICE
 * ======================================================
 * Single authoritative source for all external integration states.
 * CEO Command, executive briefs, and platform health panels all read
 * from this service — never from hardcoded values.
 *
 * States:
 *   LIVE            — actively connected and operational
 *   TEST            — connected to sandbox/test environment
 *   INTERFACE_ONLY  — interface built, awaiting per-client activation
 *   NOT_CONFIGURED  — not yet set up
 *   DEGRADED        — connected but errors detected
 *   FAILED          — connection failed
 *   DISABLED        — intentionally switched off
 */

import { dbQuery } from '../db/client';

export type IntegrationState =
  | 'LIVE'
  | 'TEST'
  | 'INTERFACE_ONLY'
  | 'NOT_CONFIGURED'
  | 'DEGRADED'
  | 'FAILED'
  | 'DISABLED';

export type IntegrationType = 'ACCOUNTING' | 'CRM' | 'ERP' | 'FIELD' | 'PAYMENT' | 'COMMS';

export interface PlatformIntegration {
  name: string;
  type: IntegrationType;
  state: IntegrationState;
  note: string;
  is_active: boolean;
}

/**
 * Default integration states when no DB configuration exists.
 * These represent the known truth at platform launch: all accounting
 * connectors are interface-only pending per-client activation.
 */
const INTEGRATION_DEFAULTS: PlatformIntegration[] = [
  { name: 'Xero', type: 'ACCOUNTING', state: 'INTERFACE_ONLY', note: 'Pending per-client activation.', is_active: true },
  { name: 'QuickBooks', type: 'ACCOUNTING', state: 'INTERFACE_ONLY', note: 'Pending per-client activation.', is_active: true },
  { name: 'Sage', type: 'ACCOUNTING', state: 'INTERFACE_ONLY', note: 'Pending per-client activation.', is_active: true },
  { name: 'NetSuite', type: 'ACCOUNTING', state: 'INTERFACE_ONLY', note: 'Pending per-client activation.', is_active: true },
];

/**
 * Returns all platform integration states from DB, falling back to
 * hardcoded defaults only if the DB table is unavailable.
 *
 * This is the ONLY place in the codebase that reads integration state.
 */
export async function getPlatformIntegrationStates(): Promise<PlatformIntegration[]> {
  try {
    const { data, error } = await dbQuery<PlatformIntegration[]>(
      'platform_integration_configs?select=name,type,state,note,is_active&order=name'
    );
    if (error || !data || data.length === 0) {
      return INTEGRATION_DEFAULTS;
    }
    return data;
  } catch {
    // DB unavailable — return known defaults rather than crash
    return INTEGRATION_DEFAULTS;
  }
}

/**
 * Returns the state of a single named integration.
 */
export async function getPlatformIntegrationByName(name: string): Promise<PlatformIntegration | null> {
  const all = await getPlatformIntegrationStates();
  return all.find(i => i.name === name) ?? null;
}

/**
 * Summary string for executive context.
 */
export function summariseIntegrations(integrations: PlatformIntegration[]): string {
  const live = integrations.filter(i => i.state === 'LIVE').map(i => i.name);
  const ifOnly = integrations.filter(i => i.state === 'INTERFACE_ONLY').map(i => i.name);
  const degraded = integrations.filter(i => i.state === 'DEGRADED' || i.state === 'FAILED').map(i => i.name);

  const parts: string[] = [];
  if (live.length > 0) parts.push(`${live.join(', ')}: LIVE`);
  if (ifOnly.length > 0) parts.push(`${ifOnly.join(', ')}: INTERFACE_ONLY — pending activation`);
  if (degraded.length > 0) parts.push(`${degraded.join(', ')}: DEGRADED — attention required`);
  return parts.join('. ') || 'No integrations configured.';
}
