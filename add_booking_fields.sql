-- Add client info fields directly to bookings table for simpler booking flow
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_name text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_email text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_phone text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS preferred_time text;

-- Make client_id optional since we're storing client info directly
ALTER TABLE bookings ALTER COLUMN client_id DROP NOT NULL;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
