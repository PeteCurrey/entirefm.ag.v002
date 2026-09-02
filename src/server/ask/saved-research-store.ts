/**
 * ENTIREFM LOBBY SAVED RESEARCH STORE — DATABASE-BACKED
 * ======================================================
 * Durable Member-owned research repository.
 * Preserves immutable answer snapshots and cited source provenance at the time of research.
 * Strictly gated per authenticated Member.
 * Every exported function signature is identical to the prior in-memory implementation.
 */

import crypto from 'crypto';
import type { SavedLobbyResearch, StructuredAskAnswer } from './types';
import { dbQuery } from '@/server/db/client';

function mapRecord(row: any): SavedLobbyResearch {
  return {
    id: row.id,
    memberId: row.member_id,
    askSessionId: row.ask_session_id,
    question: row.question,
    mode: row.mode,
    title: row.title,
    answerSnapshot: row.answer_snapshot,
    jurisdiction: row.jurisdiction,
    createdAt: row.created_at,
    savedAt: row.saved_at,
    modelUsed: row.model_used,
    sourceCount: row.source_count,
    version: row.version,
  };
}

/**
 * Saves a completed Ask The Lobby answer snapshot for an authenticated member.
 */
export async function saveResearch(
  memberId: string,
  answer: StructuredAskAnswer
): Promise<SavedLobbyResearch> {
  const now = new Date().toISOString();

  // Check for existing record for this member + session or question
  const { data: existing } = await dbQuery<any[]>(
    `lobby_saved_research?member_id=eq.${encodeURIComponent(memberId)}&ask_session_id=eq.${encodeURIComponent(answer.id)}&limit=1`
  );

  if (existing && existing.length > 0) {
    const row = existing[0];
    const newVersion = (row.version || 1) + 1;
    await dbQuery(
      `lobby_saved_research?id=eq.${encodeURIComponent(row.id)}`,
      {
        method: 'PATCH',
        body: { answer_snapshot: answer, saved_at: now, version: newVersion },
      }
    );
    return mapRecord({ ...row, answer_snapshot: answer, saved_at: now, version: newVersion });
  }

  const id = `res-${crypto.randomUUID()}`;
  const row = {
    id,
    member_id: memberId,
    ask_session_id: answer.id,
    question: answer.question,
    mode: answer.mode,
    title: answer.question.length > 80 ? `${answer.question.slice(0, 77)}...` : answer.question,
    answer_snapshot: answer,
    jurisdiction: answer.jurisdiction?.join(', ') || 'United Kingdom',
    created_at: answer.generatedAt || now,
    saved_at: now,
    model_used: answer.modelUsed || 'EntireFM Intelligence Engine',
    source_count: answer.citations?.length || 0,
    version: 1,
  };

  await dbQuery('lobby_saved_research', {
    method: 'POST',
    body: row,
  });

  return mapRecord(row);
}

/**
 * Retrieves all saved research records for a specific member.
 */
export async function getSavedResearchByMember(
  memberId: string,
  options?: { mode?: string; search?: string }
): Promise<SavedLobbyResearch[]> {
  let endpoint = `lobby_saved_research?member_id=eq.${encodeURIComponent(memberId)}&order=saved_at.desc`;

  if (options?.mode && options.mode !== 'all') {
    endpoint += `&mode=eq.${encodeURIComponent(options.mode)}`;
  }

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  let results = data.map(mapRecord);

  if (options?.search) {
    const q = options.search.toLowerCase();
    results = results.filter(
      (r) => r.question.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)
    );
  }

  return results;
}

/**
 * Retrieves a single saved research record, strictly validating member ownership.
 */
export async function getSavedResearchById(
  id: string,
  memberId: string
): Promise<SavedLobbyResearch | null> {
  const { data } = await dbQuery<any[]>(
    `lobby_saved_research?id=eq.${encodeURIComponent(id)}&member_id=eq.${encodeURIComponent(memberId)}&limit=1`
  );
  if (!data || data.length === 0) return null;
  return mapRecord(data[0]);
}

/**
 * Deletes a saved research record, strictly validating member ownership.
 */
export async function deleteSavedResearch(
  id: string,
  memberId: string
): Promise<boolean> {
  // Verify ownership before deleting
  const record = await getSavedResearchById(id, memberId);
  if (!record) return false;

  await dbQuery(
    `lobby_saved_research?id=eq.${encodeURIComponent(id)}&member_id=eq.${encodeURIComponent(memberId)}`,
    { method: 'DELETE' }
  );

  return true;
}
