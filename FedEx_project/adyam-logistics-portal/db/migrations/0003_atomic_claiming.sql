-- Add atomic row claiming function for alerts

CREATE OR REPLACE FUNCTION public.claim_alert_candidates(
  batch_size INT DEFAULT 50,
  claim_duration_minutes INT DEFAULT 15
)
RETURNS SETOF public.adyam_tracking AS $$
  UPDATE public.adyam_tracking
  SET next_alert_at = NOW() + (claim_duration_minutes || ' minutes')::INTERVAL
  WHERE id IN (
    SELECT id FROM public.adyam_tracking
    WHERE delivered = false
      AND alert_phone IS NOT NULL
      AND (next_alert_at IS NULL OR next_alert_at <= NOW())
      AND alert_attempts < 4
    ORDER BY last_checked_at DESC
    LIMIT batch_size
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

-- Grant execute to service role
GRANT EXECUTE ON FUNCTION public.claim_alert_candidates TO service_role;
