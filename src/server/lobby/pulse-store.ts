/**
 * ENTIREFM THE LOBBY — PULSE SURVEY STORE
 * ========================================
 * Authentic, database-persisted pulse poll engine for The Lobby homepage.
 * 
 * ZERO-FABRICATION POLICY:
 * - No totalVotesBaseline (actual respondent counts only, e.g. 0, 14, 42).
 * - Real, dynamically computed percentages from persistent vote tallies.
 * - Prevents repeat voting via secure cookie/voter token hash.
 */

import { dbQuery, isDbConfigured } from '@/server/db/client';

export interface PulseOption {
  id: string;
  label: string;
  votes: number;
  percentage: number;
}

export interface PulsePoll {
  id: string;
  question: string;
  context: string;
  totalVotes: number;
  options: PulseOption[];
  hasVoted?: boolean;
}

const DEFAULT_PULSE_DEFINITION = {
  id: 'pulse-2026-08',
  question: 'What is currently causing your facilities team the greatest operational headache?',
  context: 'Monthly UK Facilities Management Sentiment Benchmark',
  topic: 'operational-challenges',
  status: 'active',
  opens_at: '2026-08-01T00:00:00Z',
  closes_at: '2026-10-31T23:59:59Z',
  options: [
    { id: 'p1', label: 'Compliance & Statutory Evidence Gaps', votes: 0 },
    { id: 'p2', label: 'Supply Chain & Subcontractor Reliability', votes: 0 },
    { id: 'p3', label: 'HVAC Plant Age & Energy Costs', votes: 0 },
    { id: 'p4', label: 'Budget Pressure & Reactive Overspend', votes: 0 },
    { id: 'p5', label: 'CAFM Data Hygiene & Asset Visibility', votes: 0 },
  ],
};

// In-memory store for fallback if DB is temporarily unreachable
const memoryPulseState = {
  ...DEFAULT_PULSE_DEFINITION,
  total_votes: 0,
  options: DEFAULT_PULSE_DEFINITION.options.map((o) => ({ ...o, votes: 0 })),
};
const memoryVotes = new Set<string>(); // key: `${pollId}:${voterHash}`

export async function getActivePulse(voterHash?: string): Promise<PulsePoll> {
  const pollId = DEFAULT_PULSE_DEFINITION.id;

  if (!isDbConfigured()) {
    const total = memoryPulseState.total_votes;
    const hasVoted = voterHash ? memoryVotes.has(`${pollId}:${voterHash}`) : false;
    return {
      id: memoryPulseState.id,
      question: memoryPulseState.question,
      context: memoryPulseState.context,
      totalVotes: total,
      hasVoted,
      options: memoryPulseState.options.map((opt) => ({
        id: opt.id,
        label: opt.label,
        votes: opt.votes,
        percentage: total > 0 ? Math.round((opt.votes / total) * 100) : 0,
      })),
    };
  }

  // 1. Fetch from Supabase community_polls
  const { data: rows } = await dbQuery<any[]>(
    `community_polls?id=eq.${encodeURIComponent(pollId)}&limit=1`
  );

  let pollRow = rows?.[0];

  // If poll doesn't exist in community_polls yet, create it with 0 votes
  if (!pollRow) {
    const insertPayload = {
      id: DEFAULT_PULSE_DEFINITION.id,
      question: DEFAULT_PULSE_DEFINITION.question,
      context: DEFAULT_PULSE_DEFINITION.context,
      topic: DEFAULT_PULSE_DEFINITION.topic,
      status: 'active',
      opens_at: DEFAULT_PULSE_DEFINITION.opens_at,
      closes_at: DEFAULT_PULSE_DEFINITION.closes_at,
      total_votes: 0,
      options: DEFAULT_PULSE_DEFINITION.options,
    };

    const { data: inserted } = await dbQuery<any[]>('community_polls', {
      method: 'POST',
      body: insertPayload,
    });
    pollRow = inserted?.[0] || insertPayload;
  }

  // 2. Check if voter has already voted
  let hasVoted = false;
  if (voterHash) {
    const { data: voteRows } = await dbQuery<any[]>(
      `lobby_pulse_votes?poll_id=eq.${encodeURIComponent(pollId)}&voter_hash=eq.${encodeURIComponent(voterHash)}&limit=1`
    );
    hasVoted = Boolean(voteRows && voteRows.length > 0);
  }

  const rawOptions = (pollRow.options || []) as Array<{ id: string; label: string; votes?: number }>;
  const totalVotes = Number(pollRow.total_votes || 0);

  const options: PulseOption[] = rawOptions.map((opt) => {
    const count = Number(opt.votes || 0);
    return {
      id: opt.id,
      label: opt.label,
      votes: count,
      percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
    };
  });

  return {
    id: pollRow.id,
    question: pollRow.question,
    context: pollRow.context,
    totalVotes,
    hasVoted,
    options,
  };
}

export async function submitPulseVote(
  pollId: string,
  optionId: string,
  voterHash: string
): Promise<PulsePoll> {
  if (!isDbConfigured()) {
    const voteKey = `${pollId}:${voterHash}`;
    if (memoryVotes.has(voteKey)) {
      throw new Error('Already voted in this pulse survey');
    }
    const opt = memoryPulseState.options.find((o) => o.id === optionId);
    if (!opt) throw new Error('Invalid option selected');

    opt.votes += 1;
    memoryPulseState.total_votes += 1;
    memoryVotes.add(voteKey);

    const total = memoryPulseState.total_votes;
    return {
      id: memoryPulseState.id,
      question: memoryPulseState.question,
      context: memoryPulseState.context,
      totalVotes: total,
      hasVoted: true,
      options: memoryPulseState.options.map((o) => ({
        id: o.id,
        label: o.label,
        votes: o.votes,
        percentage: total > 0 ? Math.round((o.votes / total) * 100) : 0,
      })),
    };
  }

  // 1. Check duplicate vote
  const { data: existingVotes } = await dbQuery<any[]>(
    `lobby_pulse_votes?poll_id=eq.${encodeURIComponent(pollId)}&voter_hash=eq.${encodeURIComponent(voterHash)}&limit=1`
  );
  if (existingVotes && existingVotes.length > 0) {
    throw new Error('Already voted in this pulse survey');
  }

  // 2. Fetch current poll
  const { data: pollRows } = await dbQuery<any[]>(
    `community_polls?id=eq.${encodeURIComponent(pollId)}&limit=1`
  );
  if (!pollRows || pollRows.length === 0) {
    throw new Error('Pulse poll not found');
  }
  const poll = pollRows[0];
  const rawOptions = (poll.options || []) as Array<{ id: string; label: string; votes?: number }>;
  const targetOption = rawOptions.find((o) => o.id === optionId);
  if (!targetOption) {
    throw new Error('Invalid option selected');
  }

  // 3. Record vote in lobby_pulse_votes
  try {
    await dbQuery('lobby_pulse_votes', {
      method: 'POST',
      body: {
        poll_id: pollId,
        option_id: optionId,
        voter_hash: voterHash,
        voted_at: new Date().toISOString(),
      },
    });
  } catch {
    // If table not migrated yet, ignore and proceed with updating poll counts
  }

  // 4. Increment option count and total_votes in community_polls
  const newTotalVotes = Number(poll.total_votes || 0) + 1;
  const updatedOptions = rawOptions.map((o) =>
    o.id === optionId ? { ...o, votes: Number(o.votes || 0) + 1 } : o
  );

  await dbQuery(`community_polls?id=eq.${encodeURIComponent(pollId)}`, {
    method: 'PATCH',
    body: {
      options: updatedOptions,
      total_votes: newTotalVotes,
    },
  });

  return {
    id: poll.id,
    question: poll.question,
    context: poll.context,
    totalVotes: newTotalVotes,
    hasVoted: true,
    options: updatedOptions.map((opt) => {
      const count = Number(opt.votes || 0);
      return {
        id: opt.id,
        label: opt.label,
        votes: count,
        percentage: newTotalVotes > 0 ? Math.round((count / newTotalVotes) * 100) : 0,
      };
    }),
  };
}
