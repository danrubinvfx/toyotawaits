-- Add country and market-specific pricing fields to submissions
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT 'CA',
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'CAD',
ADD COLUMN IF NOT EXISTS adm_markup NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS pricing_type TEXT DEFAULT 'at_msrp';

-- Index country and region for fast aggregate filtering
CREATE INDEX IF NOT EXISTS idx_submissions_country_province ON submissions(country, province);
