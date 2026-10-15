-- ============================================================================
-- MIGRATION: 20261015000002_regional_partitioning_us.sql
-- Description:
-- Support regional schema partitioning for U.S. and Canadian markets:
-- 1. Add country_code ('CA' | 'US', default 'CA') to submissions and orders.
-- 2. Make province nullable to support U.S. entries.
-- 3. Add U.S.-specific fields: dealer_markup_adm, state, port_destination.
-- ============================================================================

DO $$
BEGIN
    -- 1. Modify submissions table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'submissions') THEN
        -- Allow province to be nullable for U.S. records (where state is used instead)
        ALTER TABLE submissions 
        ALTER COLUMN province DROP NOT NULL;

        -- Add country_code column
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'submissions' AND column_name = 'country_code'
        ) THEN
            ALTER TABLE submissions 
            ADD COLUMN country_code VARCHAR(2) NOT NULL DEFAULT 'CA';

            ALTER TABLE submissions 
            ADD CONSTRAINT chk_submissions_country_code 
            CHECK (country_code IN ('CA', 'US'));
        END IF;

        -- Add dealer_markup_adm for ADM tracking above MSRP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'submissions' AND column_name = 'dealer_markup_adm'
        ) THEN
            ALTER TABLE submissions 
            ADD COLUMN dealer_markup_adm NUMERIC(10, 2);
        END IF;

        -- Add 2-letter U.S. state code
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'submissions' AND column_name = 'state'
        ) THEN
            ALTER TABLE submissions 
            ADD COLUMN state VARCHAR(2);
        END IF;

        -- Add port_destination text
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'submissions' AND column_name = 'port_destination'
        ) THEN
            ALTER TABLE submissions 
            ADD COLUMN port_destination TEXT;
        END IF;

        -- Create indexes for efficient regional query partitioning
        CREATE INDEX IF NOT EXISTS idx_submissions_country_code ON submissions(country_code);
        CREATE INDEX IF NOT EXISTS idx_submissions_state ON submissions(state);
    END IF;

    -- 2. Modify orders table if present
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'country_code'
        ) THEN
            ALTER TABLE orders 
            ADD COLUMN country_code VARCHAR(2) NOT NULL DEFAULT 'CA';

            ALTER TABLE orders 
            ADD CONSTRAINT chk_orders_country_code 
            CHECK (country_code IN ('CA', 'US'));
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'dealer_markup_adm'
        ) THEN
            ALTER TABLE orders 
            ADD COLUMN dealer_markup_adm NUMERIC(10, 2);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'state'
        ) THEN
            ALTER TABLE orders 
            ADD COLUMN state VARCHAR(2);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'port_destination'
        ) THEN
            ALTER TABLE orders 
            ADD COLUMN port_destination TEXT;
        END IF;

        CREATE INDEX IF NOT EXISTS idx_orders_country_code ON orders(country_code);
        CREATE INDEX IF NOT EXISTS idx_orders_state ON orders(state);
    END IF;
END $$;
