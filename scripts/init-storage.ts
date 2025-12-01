import { storageQueries } from '../lib/supabase/storage'

async function initializeStorage() {
  try {
    console.log('Initializing service images bucket...')
    await storageQueries.initializeServicesBucket()
    console.log('✓ Service images bucket initialized successfully!')
    
    console.log('Initializing booking receipts bucket...')
    await storageQueries.initializeBucket()
    console.log('✓ Booking receipts bucket initialized successfully!')
    
    console.log('\n✓ All storage buckets initialized!')
  } catch (error) {
    console.error('Error initializing storage:', error)
    process.exit(1)
  }
}

initializeStorage()
