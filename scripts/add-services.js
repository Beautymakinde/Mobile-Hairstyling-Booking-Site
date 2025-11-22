// Script to add all services to Supabase
// Run with: node scripts/add-services.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const services = [
  // Extension Services
  { name: 'Quickweave', description: 'Fast and beautiful weave installation for a quick style transformation', price: 140, duration: 180, active: true },
  { name: 'Ponytail', description: 'Sleek and stylish ponytail with extensions for added length and volume', price: 100, duration: 120, active: true },
  { name: 'Traditional Sew-in', description: 'Classic sew-in weave installation for long-lasting style', price: 180, duration: 180, active: true },
  
  // Braids Services
  { name: 'Medium Knotless Braids', description: 'Protective knotless braids for a natural, comfortable look without tension', price: 200, duration: 360, active: true },
  { name: 'French Curls', description: 'Elegant French curl braids with beautiful texture and definition', price: 200, duration: 300, active: true },
  { name: 'Boho Braids', description: 'Trendy bohemian-style braids with curly ends for a carefree, stylish look', price: 250, duration: 540, active: true },
  
  // Weave Services
  { name: 'Big Stitch Braids', description: 'Bold, chunky stitch braids for a statement protective style', price: 150, duration: 240, active: true },
  { name: 'Small Stitch Braids', description: 'Intricate small stitch braids for detailed, long-lasting beauty', price: 250, duration: 360, active: true },
  { name: 'Lemonade Braids', description: 'Side-swept lemonade braids inspired by iconic styles, perfect for any occasion', price: 200, duration: 360, active: true },
  { name: 'Weaved Ponytail', description: 'High ponytail with weave for dramatic length and volume', price: 200, duration: 300, active: true },
  { name: 'Fulani Braids', description: 'Traditional Fulani-style braids with center part and decorative beads', price: 200, duration: 300, active: true },
  
  // Other Services
  { name: 'Softlocs', description: 'Soft, lightweight locs for a natural textured protective style', price: 150, duration: 300, active: true },
  { name: 'Crochet', description: 'Versatile crochet braids with various hair textures and styles available', price: 130, duration: 240, active: true },
  { name: 'Kinky Twist', description: 'Textured kinky twists for a natural, protective hairstyle', price: 150, duration: 300, active: true },
  { name: 'Passion Twist', description: 'Beautiful passion twists with defined coils and bohemian flair', price: 170, duration: 300, active: true },
  { name: 'Boho Twist', description: 'Trendy boho-style twists with curly accents for added dimension', price: 200, duration: 420, active: true },
]

async function addServices() {
  console.log('Starting to add services to Supabase...')
  
  try {
    // First, let's check what services already exist
    const { data: existingServices, error: fetchError } = await supabase
      .from('services')
      .select('name')
    
    if (fetchError) {
      console.error('Error fetching existing services:', fetchError)
      return
    }

    console.log(`Found ${existingServices.length} existing services`)
    
    // Filter out services that already exist
    const existingNames = new Set(existingServices.map(s => s.name))
    const newServices = services.filter(s => !existingNames.has(s.name))
    
    if (newServices.length === 0) {
      console.log('All services already exist in the database!')
      return
    }

    console.log(`Adding ${newServices.length} new services...`)

    // Insert new services
    const { data, error } = await supabase
      .from('services')
      .insert(newServices)
      .select()

    if (error) {
      console.error('Error inserting services:', error)
      return
    }

    console.log(`✅ Successfully added ${data.length} services!`)
    console.log('\nAdded services:')
    data.forEach(service => {
      console.log(`  - ${service.name}: $${service.price} - ${service.duration}min`)
    })

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

addServices()
