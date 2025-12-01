-- First, add the missing columns to the services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_path text;

-- Update existing services with categories
UPDATE services SET category = 'Extensions' WHERE name IN ('Quickweave', 'Ponytail', 'Traditional Sew-in');
UPDATE services SET category = 'Braids' WHERE name IN ('Medium Knotless Braids', 'French Curls', 'Boho Braids');
UPDATE services SET category = 'Weave' WHERE name IN ('Big Stitch Braids', 'Small Stitch Braids', 'Lemonade Braids', 'Weaved Ponytail', 'Fulani Braids');
UPDATE services SET category = 'Others' WHERE name IN ('Softlocs', 'Crochet', 'Kinky Twist', 'Passion Twist', 'Boho Twist');

-- Insert all services with correct pricing and durations
-- Extension Services
INSERT INTO services (name, description, price, duration_minutes, is_active) VALUES
('Quickweave', 'Fast and beautiful weave installation for a quick style transformation', 140, 180, true),
('Ponytail', 'Sleek and stylish ponytail with extensions for added length and volume', 100, 120, true),
('Traditional Sew-in', 'Classic sew-in weave installation for long-lasting style', 180, 180, true);

-- Braids Services  
INSERT INTO services (name, description, price, duration_minutes, is_active) VALUES
('Medium Knotless Braids', 'Protective knotless braids for a natural, comfortable look without tension', 200, 360, true),
('French Curls', 'Elegant French curl braids with beautiful texture and definition', 200, 300, true),
('Boho Braids', 'Trendy bohemian-style braids with curly ends for a carefree, stylish look', 250, 540, true);

-- Weave Services
INSERT INTO services (name, description, price, duration_minutes, is_active) VALUES
('Big Stitch Braids', 'Bold, chunky stitch braids for a statement protective style', 150, 240, true),
('Small Stitch Braids', 'Intricate small stitch braids for detailed, long-lasting beauty', 250, 360, true),
('Lemonade Braids', 'Side-swept lemonade braids inspired by iconic styles, perfect for any occasion', 200, 360, true),
('Weaved Ponytail', 'High ponytail with weave for dramatic length and volume', 200, 300, true),
('Fulani Braids', 'Traditional Fulani-style braids with center part and decorative beads', 200, 300, true);

-- Other Services
INSERT INTO services (name, description, price, duration_minutes, is_active) VALUES
('Softlocs', 'Soft, lightweight locs for a natural textured protective style', 150, 300, true),
('Crochet', 'Versatile crochet braids with various hair textures and styles available', 130, 240, true),
('Kinky Twist', 'Textured kinky twists for a natural, protective hairstyle', 150, 300, true),
('Passion Twist', 'Beautiful passion twists with defined coils and bohemian flair', 170, 300, true),
('Boho Twist', 'Trendy boho-style twists with curly accents for added dimension', 200, 420, true);
