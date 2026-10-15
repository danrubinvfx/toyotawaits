-- ============================================================================
-- MIGRATION: 20261015000001_order_lifecycle_vin_assigned.sql
-- Description:
-- Support 'vin_assigned' in submissions.stage check constraint
-- Order lifecycle progression:
-- 1. deposit_placed (Deposit Placed / Waiting on Allocation)
-- 2. vin_assigned (Build Assigned / VIN Generated)
-- 3. in_transit (In Transit / Freight)
-- 4. delivered (Delivered / Keys in Hand)
-- ============================================================================

DO $$
BEGIN
    -- Drop existing check constraint if present
    ALTER TABLE submissions
    DROP CONSTRAINT IF EXISTS submissions_stage_check;

    -- Recreate check constraint supporting both modern 4-stage lifecycle and backwards compatibility
    ALTER TABLE submissions
    ADD CONSTRAINT submissions_stage_check
    CHECK (stage IN ('deposit_placed', 'vin_assigned', 'allocation_confirmed', 'in_transit', 'delivered', 'cancelled'));
END $$;
