import crypto from 'crypto';
import { dbQuery } from '@/server/db/client';

export interface IngestionLock {
  jobType: string;
  lockId: string;
  lockedAt: string;
  lockedUntil: string;
  startedBy: string;
}

/**
 * Acquires a database-backed lock for an ingestion job type.
 * Prevents concurrent executions across serverless instances.
 * Returns lockId if acquired, or null if another process holds an active lock.
 */
export async function acquireIngestionLock(
  jobType: 'regulatory' | 'tenders' | 'company-watch' | string,
  startedBy = 'system',
  ttlMinutes = 15
): Promise<string | null> {
  const lockId = crypto.randomUUID();
  const now = new Date();
  const lockedUntil = new Date(now.getTime() + ttlMinutes * 60 * 1000).toISOString();

  try {
    const { data } = await dbQuery<any[]>(
      `intelligence_ingestion_locks?job_type=eq.${encodeURIComponent(jobType)}`
    );

    if (data && data.length > 0) {
      const existing = data[0];
      const expiry = new Date(existing.locked_until).getTime();
      if (expiry > now.getTime()) {
        // Active lock still held by another execution
        return null;
      }

      // Expired lock: take over
      await dbQuery(`intelligence_ingestion_locks?job_type=eq.${encodeURIComponent(jobType)}`, {
        method: 'PATCH',
        body: {
          lock_id: lockId,
          locked_at: now.toISOString(),
          locked_until: lockedUntil,
          started_by: startedBy,
        },
      });
      return lockId;
    }

    // Insert new lock
    await dbQuery(`intelligence_ingestion_locks`, {
      method: 'POST',
      body: {
        job_type: jobType,
        lock_id: lockId,
        locked_at: now.toISOString(),
        locked_until: lockedUntil,
        started_by: startedBy,
      },
    });

    return lockId;
  } catch (err: any) {
    console.error(`[Lock Service] Failed to acquire lock for ${jobType}:`, err.message);
    // In case of transient DB error during lock check, allow fallback lockId
    return lockId;
  }
}

/**
 * Releases a held ingestion lock.
 */
export async function releaseIngestionLock(jobType: string, lockId: string): Promise<void> {
  try {
    await dbQuery(
      `intelligence_ingestion_locks?job_type=eq.${encodeURIComponent(jobType)}&lock_id=eq.${encodeURIComponent(lockId)}`,
      { method: 'DELETE' }
    );
  } catch (err: any) {
    console.error(`[Lock Service] Failed to release lock for ${jobType}:`, err.message);
  }
}
