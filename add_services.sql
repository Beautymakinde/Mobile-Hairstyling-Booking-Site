-- Insert all services with correct pricing and duration
-- First, clear existing services (optional - comment out if you want to keep existing ones)
-- DELETE FROM services;

-- Extension Services
INSERT INTO services (name, description, price, duration, category, is_active) VALUES
('Quickweave', 'Fast and beautiful weave installation for a quick style transformation', 140, 180, 'Extensions', true),
('Ponytail', 'Sleek and stylish ponytail with extensions for added length and volume', 100, 120, 'Extensions', true),
('Traditional Sew-in', 'Classic sew-in weave installation for long-lasting style', 180, 180, 'Extensions', true);

-- Braids Services  
INSERT INTO services (name, description, price, duration, category, is_active) VALUES
('Medium Knotless Braids', 'Protective knotless braids for a natural, comfortable look without tension', 200, 360, 'Braids', true),
('French Curls', 'Elegant French curl braids with beautiful texture and definition', 200, 300, 'Braids', true),
('Boho Braids', 'Trendy bohemian-style braids with curly ends for a carefree, stylish look', 250, 540, 'Braids', true);

-- Weave Services
INSERT INTO services (name, description, price, duration, category, is_active) VALUES
('Big Stitch Braids', 'Bold, chunky stitch braids for a statement protective style', 150, 240, 'Weaves', true),
('Small Stitch Braids', 'Intricate small stitch braids for detailed, long-lasting beauty', 250, 360, 'Weaves', true),
('Lemonade Braids', 'Side-swept lemonade braids inspired by iconic styles, perfect for any occasion', 200, 360, 'Weaves', true),
('Weaved Ponytail', 'High ponytail with weave for dramatic length and volume', 200, 300, 'Weaves', true),
('Fulani Braids', 'Traditional Fulani-style braids with center part and decorative beads', 200, 300, 'Weaves', true);

-- Other Services
INSERT INTO services (name, description, price, duration, category, is_active) VALUES
('Softlocs', 'Soft, lightweight locs for a natural textured protective style', 150, 300, 'Others', true),
('Crochet', 'Versatile crochet braids with various hair textures and styles available', 130, 240, 'Others', true),
('Kinky Twist', 'Textured kinky twists for a natural, protective hairstyle', 150, 300, 'Others', true),
('Passion Twist', 'Beautiful passion twists with defined coils and bohemian flair', 170, 300, 'Others', true),
('Boho Twist', 'Trendy boho-style twists with curly accents for added dimension', 200, 420, 'Others', true);
