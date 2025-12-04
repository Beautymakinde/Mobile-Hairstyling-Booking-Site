/**
 * Migration script to create client records from existing bookings
 * Run this once to populate the clients table from bookings that have client info
 */

import { supabase } from '../lib/supabase/client'

async function migrateClients() {
  console.log('Starting client migration...')

  try {
    // Get all bookings that have client info but no client_id
    const { data: bookings, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .not('client_email', 'is', null)
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Error fetching bookings:', fetchError)
      return
    }

    console.log(`Found ${bookings?.length || 0} bookings to process`)

    if (!bookings || bookings.length === 0) {
      console.log('No bookings to migrate')
      return
    }

    // Group bookings by email to avoid duplicates
    const clientMap = new Map<string, any>()

    for (const booking of bookings) {
      if (booking.client_email && !clientMap.has(booking.client_email)) {
        clientMap.set(booking.client_email, {
          name: booking.client_name,
          email: booking.client_email,
          phone: booking.client_phone,
          address: booking.location || '',
          hair_info: null,
          notes: booking.notes || null,
        })
      }
    }

    console.log(`Found ${clientMap.size} unique clients to create`)

    // Create client records
    const clientsToInsert = Array.from(clientMap.values())
    const { data: createdClients, error: insertError } = await supabase
      .from('clients')
      .upsert(clientsToInsert, {
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select()

    if (insertError) {
      console.error('Error creating clients:', insertError)
      return
    }

    console.log(`Created/updated ${createdClients?.length || 0} client records`)

    // Now update bookings to link to client records
    let updatedCount = 0
    for (const booking of bookings) {
      if (booking.client_email) {
        // Find the client by email
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .eq('email', booking.client_email)
          .single()

        if (client && !clientError) {
          // Update the booking with client_id
          const { error: updateError } = await supabase
            .from('bookings')
            .update({ client_id: client.id })
            .eq('id', booking.id)

          if (!updateError) {
            updatedCount++
          }
        }
      }
    }

    console.log(`Updated ${updatedCount} bookings with client_id`)
    console.log('Migration complete!')

  } catch (error) {
    console.error('Migration error:', error)
  }
}

// Run the migration
migrateClients()
