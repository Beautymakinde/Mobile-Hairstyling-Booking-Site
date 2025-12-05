-- Setup clients table with proper structure and RLS policies
-- Run this in your Supabase SQL editor
-- This is SAFE to run - it only creates policies if they don't exist

-- Create clients table if it doesn't exist
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT DEFAULT '',
  hair_info TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (safe to run multiple times)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (only if they don't exist)
DO $$ 
BEGIN
  -- Allow anyone to insert clients (for booking form)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' 
    AND policyname = 'Allow public insert for clients'
  ) THEN
    CREATE POLICY "Allow public insert for clients"
    ON clients FOR INSERT
    TO public
    WITH CHECK (true);
  END IF;

  -- Allow anyone to read clients (for admin dashboard)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' 
    AND policyname = 'Allow public read access to clients'
  ) THEN
    CREATE POLICY "Allow public read access to clients"
    ON clients FOR SELECT
    TO public
    USING (true);
  END IF;

  -- Allow authenticated users (admin) to update
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' 
    AND policyname = 'Allow authenticated users to update clients'
  ) THEN
    CREATE POLICY "Allow authenticated users to update clients"
    ON clients FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Notify the API to reload schema
NOTIFY pgrst, 'reload schema';
