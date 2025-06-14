
-- Modifica la restricción para permitir el valor 'n/a' en proposal_status
ALTER TABLE public.opportunities
  DROP CONSTRAINT IF EXISTS opportunities_proposal_status_check;

ALTER TABLE public.opportunities
  ADD CONSTRAINT opportunities_proposal_status_check
  CHECK (proposal_status IN ('created', 'pitched', 'n/a'));
