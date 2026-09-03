-- ====================================================================
-- ENTIREFM THE LOBBY — PUBLIC PULSE VOTE LEDGER
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.lobby_pulse_votes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id     TEXT NOT NULL REFERENCES public.community_polls(id) ON DELETE CASCADE,
  option_id   TEXT NOT NULL,
  voter_hash  TEXT NOT NULL,
  voted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_pulse_voter UNIQUE (poll_id, voter_hash)
);

CREATE INDEX IF NOT EXISTS lobby_pulse_votes_poll_idx ON public.lobby_pulse_votes(poll_id);

ALTER TABLE public.lobby_pulse_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_lobby_pulse_votes" ON public.lobby_pulse_votes;
CREATE POLICY "service_role_lobby_pulse_votes"
  ON public.lobby_pulse_votes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
