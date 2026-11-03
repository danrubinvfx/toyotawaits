-- Migration: 20261102000001_bump_model_year_constraint.sql
-- Description: Update model_year check constraints on wait_times and submissions tables to include 2027 and 2028.

DO $$
BEGIN
    -- Update wait_times model_year constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage
        WHERE table_name = 'wait_times' AND constraint_name = 'wait_times_model_year_check'
    ) THEN
        ALTER TABLE wait_times DROP CONSTRAINT wait_times_model_year_check;
        ALTER TABLE wait_times ADD CONSTRAINT wait_times_model_year_check CHECK (model_year BETWEEN 2020 AND 2028);
    END IF;

    -- Update submissions model_year constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage
        WHERE table_name = 'submissions' AND constraint_name = 'submissions_model_year_check'
    ) THEN
        ALTER TABLE submissions DROP CONSTRAINT submissions_model_year_check;
        ALTER TABLE submissions ADD CONSTRAINT submissions_model_year_check CHECK (model_year BETWEEN 2020 AND 2028);
    END IF;
END $$;
