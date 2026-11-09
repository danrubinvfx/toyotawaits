-- ============================================================================
-- Migration: 20261109000001_extend_alert_default_180d.sql
-- Description: Extend default inventory drop alert subscription pass duration
--              from 30 days to 180 days (6 months) for all future signups.
--              Existing records are intentionally left untouched.
-- ============================================================================

ALTER TABLE public.inventory_alert_subscriptions
ALTER COLUMN expires_at SET DEFAULT (now() + interval '180 days');
