'use client';
/**
 * ENTIREFM FIELD OFFLINE STORE (Phase 0C)
 * =========================================
 * Client-side offline action queue with idempotency keys.
 * Queued actions are persisted in localStorage and synced
 * when the device comes back online.
 *
 * Key principle: every action has a unique idempotency key.
 * The server rejects duplicates — re-plays are safe.
 */

export type SyncStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNC_FAILED';

export interface QueuedAction {
  localId: string;
  idempotencyKey: string;
  actionType: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  payload: Record<string, any>;
  deviceTimestamp: string;
  syncStatus: 'PENDING' | 'SYNCING' | 'SYNCED' | 'CONFLICT' | 'REJECTED';
  conflictNotes?: string;
  retryCount: number;
  createdAt: string;
}

const STORAGE_KEY = 'efm_field_queue';
const DEVICE_ID_KEY = 'efm_device_id';

function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `device-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getQueuedActions(): QueuedAction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(actions: QueuedAction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
  } catch {
    // Storage quota exceeded — cannot persist
    console.warn('[EFM Field] Cannot persist offline queue: storage quota exceeded');
  }
}

export function enqueueAction(
  actionType: string,
  relatedEntityType: string | null,
  relatedEntityId: string | null,
  payload: Record<string, any>,
  engineerPersonId: string
): QueuedAction {
  const localId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const action: QueuedAction = {
    localId,
    idempotencyKey: `${engineerPersonId}:${actionType}:${localId}`,
    actionType,
    relatedEntityType: relatedEntityType ?? undefined,
    relatedEntityId: relatedEntityId ?? undefined,
    payload,
    deviceTimestamp: new Date().toISOString(),
    syncStatus: 'PENDING',
    retryCount: 0,
    createdAt: new Date().toISOString(),
  };

  const queue = getQueuedActions();
  queue.push(action);
  saveQueue(queue);
  return action;
}

export function markSynced(localId: string): void {
  const queue = getQueuedActions().map(a =>
    a.localId === localId ? { ...a, syncStatus: 'SYNCED' as const } : a
  );
  saveQueue(queue);
}

export function markConflict(localId: string, notes: string): void {
  const queue = getQueuedActions().map(a =>
    a.localId === localId ? { ...a, syncStatus: 'CONFLICT' as const, conflictNotes: notes } : a
  );
  saveQueue(queue);
}

export function markRejected(localId: string, reason: string): void {
  const queue = getQueuedActions().map(a =>
    a.localId === localId ? { ...a, syncStatus: 'REJECTED' as const, conflictNotes: reason } : a
  );
  saveQueue(queue);
}

export function clearSyncedActions(): void {
  const queue = getQueuedActions().filter(a => a.syncStatus !== 'SYNCED');
  saveQueue(queue);
}

export function getPendingCount(): number {
  return getQueuedActions().filter(a => a.syncStatus === 'PENDING').length;
}

export function getSyncStatus(): SyncStatus {
  if (typeof window === 'undefined') return 'ONLINE';
  return navigator.onLine ? 'ONLINE' : 'OFFLINE';
}

export async function syncQueue(
  engineerPersonId: string
): Promise<{ synced: number; conflicts: number; errors: number }> {
  const pending = getQueuedActions().filter(a => a.syncStatus === 'PENDING');
  if (pending.length === 0) return { synced: 0, conflicts: 0, errors: 0 };
  if (!navigator.onLine) return { synced: 0, conflicts: 0, errors: 0 };

  // Mark as syncing
  const queue = getQueuedActions().map(a =>
    pending.some(p => p.localId === a.localId) ? { ...a, syncStatus: 'SYNCING' as const, retryCount: a.retryCount + 1 } : a
  );
  saveQueue(queue);

  let synced = 0;
  let conflicts = 0;
  let errors = 0;

  try {
    const response = await fetch('/api/field/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        engineerPersonId,
        deviceId: getDeviceId(),
        actions: pending.map(a => ({
          idempotencyKey: a.idempotencyKey,
          actionType: a.actionType,
          relatedEntityType: a.relatedEntityType,
          relatedEntityId: a.relatedEntityId,
          payload: a.payload,
          deviceTimestamp: a.deviceTimestamp,
        })),
      }),
    });

    if (!response.ok) {
      errors = pending.length;
      const failedQueue = getQueuedActions().map(a =>
        pending.some(p => p.localId === a.localId) ? { ...a, syncStatus: 'PENDING' as const } : a
      );
      saveQueue(failedQueue);
      return { synced: 0, conflicts: 0, errors };
    }

    const result = await response.json();

    for (const actionResult of (result.results || [])) {
      const action = pending.find(a => a.idempotencyKey === actionResult.idempotencyKey);
      if (!action) continue;
      if (actionResult.status === 'PROCESSED' || actionResult.status === 'DUPLICATE') {
        markSynced(action.localId);
        synced++;
      } else if (actionResult.status === 'CONFLICT') {
        markConflict(action.localId, actionResult.notes || 'Server conflict');
        conflicts++;
      } else {
        markRejected(action.localId, actionResult.notes || 'Rejected by server');
        errors++;
      }
    }
  } catch {
    errors = pending.length;
    const failedQueue = getQueuedActions().map(a =>
      pending.some(p => p.localId === a.localId) ? { ...a, syncStatus: 'PENDING' as const } : a
    );
    saveQueue(failedQueue);
  }

  return { synced, conflicts, errors };
}
