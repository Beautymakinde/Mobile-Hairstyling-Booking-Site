-- Add missing image columns to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_path text;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
