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
  | 'DISABLED'
  | 'UNAVAILABLE';

export type IntegrationType = 'ACCOUNTING' | 'CRM' | 'ERP' | 'FIELD' | 'PAYMENT' | 'COMMS' | 'PLATFORM_REGISTRY';

export interface PlatformIntegration {
  name: string;
  type: IntegrationType;
  state: IntegrationState;
  note: string;
  is_active: boolean;
}

/**
 * Returns all platform integration states directly from DB.
 * If the integration registry is unavailable, it does NOT substitute
 * plausible default connector states. It returns an explicit UNAVAILABLE/DEGRADED state.
 */
export async function getPlatformIntegrationStates(): Promise<PlatformIntegration[]> {
  try {
    const { data, error } = await dbQuery<PlatformIntegration[]>(
      'platform_integration_configs?select=name,type,state,note,is_active&order=name'
    );
    if (error || !data || data.length === 0) {
      return [
        {
          name: 'Integration Registry',
          type: 'PLATFORM_REGISTRY',
          state: 'UNAVAILABLE',
          note: 'Integration state unavailable because the platform integration registry could not be read or is empty.',
          is_active: false,
        },
      ];
    }
    return data;
  } catch (err: any) {
    // DB unavailable — do NOT fabricate plausible states like Xero INTERFACE_ONLY
    return [
      {
        name: 'Integration Registry',
        type: 'PLATFORM_REGISTRY',
        state: 'UNAVAILABLE',
        note: `Integration state unavailable because the platform integration registry could not be read: ${err?.message || 'Database unreachable'}`,
        is_active: false,
      },
    ];
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
  const unavailable = integrations.find(i => i.state === 'UNAVAILABLE');
  if (unavailable) {
    return 'Integration state unavailable because the platform integration registry could not be read.';
  }

  const live = integrations.filter(i => i.state === 'LIVE').map(i => i.name);
  const ifOnly = integrations.filter(i => i.state === 'INTERFACE_ONLY').map(i => i.name);
  const degraded = integrations.filter(i => i.state === 'DEGRADED' || i.state === 'FAILED').map(i => i.name);

  const parts: string[] = [];
  if (live.length > 0) parts.push(`${live.join(', ')}: LIVE`);
  if (ifOnly.length > 0) parts.push(`${ifOnly.join(', ')}: INTERFACE_ONLY — pending activation`);
  if (degraded.length > 0) parts.push(`${degraded.join(', ')}: DEGRADED — attention required`);
  return parts.join('. ') || 'No integrations configured.';
}

