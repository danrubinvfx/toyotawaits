-- ============================================================================
-- Migration: 20261021000003_vehicle_images_and_inventory_cards.sql
-- Description:
-- Adds 3-tier vehicle image support to dealer_listings table:
--   - image_url TEXT (with https:// check constraint)
--   - has_real_photo BOOLEAN DEFAULT FALSE NOT NULL
--   - image_source VARCHAR(32) DEFAULT 'feed' NOT NULL
--   - Partial index idx_dealer_inventory_has_real_photo on has_real_photo = TRUE
-- ============================================================================

ALTER TABLE dealer_listings
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS has_real_photo BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN IF NOT EXISTS image_source VARCHAR(32) DEFAULT 'feed' NOT NULL;

-- Ensure check constraint on image_url enforcing valid https:// protocol if not null
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'dealer_listings_image_url_https_check'
    ) THEN
        ALTER TABLE dealer_listings
            ADD CONSTRAINT dealer_listings_image_url_https_check
            CHECK (image_url IS NULL OR image_url ~* '^https://');
    END IF;
END $$;

-- Partial index for fast queries filtering or sorting vehicles with verified lot photos
CREATE INDEX IF NOT EXISTS idx_dealer_inventory_has_real_photo
    ON dealer_listings (has_real_photo)
    WHERE has_real_photo = TRUE;

-- Verify public SELECT policy is maintained on dealer_listings
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'dealer_listings' AND policyname = 'Public read access for dealer listings'
    ) THEN
        CREATE POLICY "Public read access for dealer listings" ON dealer_listings
            FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;
