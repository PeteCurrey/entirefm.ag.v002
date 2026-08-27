/**
 * ENTIREFM SAVED LOBBY RESEARCH STORE
 * =====================================
 * Durable Member-owned research repository.
 * Preserves immutable answer snapshots and cited source provenance at the time of research.
 * Strictly gated per authenticated Member.
 */

import crypto from 'crypto';
import type { SavedLobbyResearch, StructuredAskAnswer } from './types';

// In-memory store for member research records (isolated per member)
const SAVED_RESEARCH: Map<string, SavedLobbyResearch> = new Map();

/**
 * Saves a completed Ask The Lobby answer snapshot for an authenticated member.
 */
export async function saveResearch(
  memberId: string,
  answer: StructuredAskAnswer
): Promise<SavedLobbyResearch> {
  const existing = Array.from(SAVED_RESEARCH.values()).find(
    (r) => r.memberId === memberId && (r.askSessionId === answer.id || r.question === answer.question)
  );

  const now = new Date().toISOString();

  if (existing) {
    // Update existing snapshot
    existing.answerSnapshot = { ...answer };
    existing.savedAt = now;
    existing.version = (existing.version || 1) + 1;
    SAVED_RESEARCH.set(existing.id, existing);
    return { ...existing };
  }

  const id = `res-${crypto.randomUUID()}`;
  const record: SavedLobbyResearch = {
    id,
    memberId,
    askSessionId: answer.id,
    question: answer.question,
    mode: answer.mode,
    title: answer.question.length > 80 ? `${answer.question.slice(0, 77)}...` : answer.question,
    answerSnapshot: { ...answer },
    jurisdiction: answer.jurisdiction?.join(', ') || 'United Kingdom',
    createdAt: answer.generatedAt || now,
    savedAt: now,
    modelUsed: answer.modelUsed || 'EntireFM Intelligence Engine',
    sourceCount: answer.citations?.length || 0,
    version: 1,
  };

  SAVED_RESEARCH.set(id, record);
  return { ...record };
}

/**
 * Retrieves all saved research records for a specific member.
 */
export async function getSavedResearchByMember(
  memberId: string,
  options?: { mode?: string; search?: string }
): Promise<SavedLobbyResearch[]> {
  const results = Array.from(SAVED_RESEARCH.values()).filter(
    (r) => r.memberId === memberId
  );

  let filtered = results;

  if (options?.mode && options.mode !== 'all') {
    filtered = filtered.filter((r) => r.mode === options.mode);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (r) => r.question.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)
    );
  }

  return filtered.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
}

/**
 * Retrieves a single saved research record, strictly validating member ownership.
 */
export async function getSavedResearchById(
  id: string,
  memberId: string
): Promise<SavedLobbyResearch | null> {
  const record = SAVED_RESEARCH.get(id);
  if (!record) return null;

  // Authorization check: Only owning member can access
  if (record.memberId !== memberId) {
    return null;
  }

  return { ...record };
}

/**
 * Deletes a saved research record, strictly validating member ownership.
 */
export async function deleteSavedResearch(
  id: string,
  memberId: string
): Promise<boolean> {
  const record = SAVED_RESEARCH.get(id);
  if (!record || record.memberId !== memberId) {
    return false;
  }

  SAVED_RESEARCH.delete(id);
  return true;
}
