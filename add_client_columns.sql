-- Add missing columns to clients table
-- Run this in your Supabase SQL editor

-- Add hair_info column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'hair_info'
  ) THEN
    ALTER TABLE clients ADD COLUMN hair_info TEXT;
  END IF;
END $$;

-- Add notes column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'notes'
  ) THEN
    ALTER TABLE clients ADD COLUMN notes TEXT;
  END IF;
END $$;

-- Notify the API to reload schema
NOTIFY pgrst, 'reload schema';
