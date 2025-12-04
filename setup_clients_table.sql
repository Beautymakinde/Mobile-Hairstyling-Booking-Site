-- Setup clients table with proper structure and RLS policies
-- Run this in your Supabase SQL editor

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

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to clients" ON clients;
DROP POLICY IF EXISTS "Allow public insert for clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users full access to clients" ON clients;

-- Create RLS policies
-- Allow anyone to insert clients (for booking form)
CREATE POLICY "Allow public insert for clients"
ON clients FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to read clients (for admin dashboard)
CREATE POLICY "Allow public read access to clients"
ON clients FOR SELECT
TO public
USING (true);

-- Allow authenticated users (admin) to update
CREATE POLICY "Allow authenticated users to update clients"
ON clients FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Notify the API to reload schema
NOTIFY pgrst, 'reload schema';
