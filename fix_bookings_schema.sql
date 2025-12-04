-- Check if date column exists, if not the bookings table might use a different structure
-- Let's ensure the bookings table has the date column
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_date date;

-- Update existing bookings to extract date from start_time if needed
UPDATE bookings 
SET booking_date = start_time::date 
WHERE booking_date IS NULL AND start_time IS NOT NULL;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
