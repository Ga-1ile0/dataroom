/*
  # Remove downloads column from documents table

  1. Changes
    - Remove `downloads` column from documents table
    - Add `pinned` column for quick access functionality

  2. Security
    - Maintain existing RLS policies
*/

-- Remove downloads column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'downloads'
  ) THEN
    ALTER TABLE documents DROP COLUMN downloads;
  END IF;
END $$;

-- Add pinned column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'pinned'
  ) THEN
    ALTER TABLE documents ADD COLUMN pinned boolean DEFAULT false;
  END IF;
END $$;