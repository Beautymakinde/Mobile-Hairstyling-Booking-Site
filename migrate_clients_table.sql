-- Ensure clients table has proper structure and constraints
-- Run this in your Supabase SQL editor

-- Add unique constraint on email if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'clients_email_key'
  ) THEN
    ALTER TABLE clients ADD CONSTRAINT clients_email_key UNIQUE (email);
  END IF;
END $$;

-- Update any existing bookings to link to client records
-- This will find clients by email and update the client_id
WITH client_mapping AS (
  SELECT b.id as booking_id, c.id as client_id
  FROM bookings b
  JOIN clients c ON c.email = b.client_email
  WHERE b.client_email IS NOT NULL
)
UPDATE bookings
SET client_id = client_mapping.client_id
FROM client_mapping
WHERE bookings.id = client_mapping.booking_id;

-- Notify the API to reload schema
NOTIFY pgrst, 'reload schema';
