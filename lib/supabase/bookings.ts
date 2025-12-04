import { supabase } from './client'
import { Booking, Client } from '../types/database'

export const bookingQueries = {
  // Create a new booking
  async createBooking(booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get bookings for a date
  async getBookingsByDate(date: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('start_time', `${date} 00:00:00`)
      .lte('start_time', `${date} 23:59:59`)
      .neq('status', 'cancelled')

    if (error) throw error
    return data || []
  },

  // Get booking with client info
  async getBookingWithClient(id: string): Promise<(Booking & { clients: Client }) | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, clients(*)')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  },

  // Update booking status
  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update booking (any fields)
  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get all bookings with filters (admin)
  async getBookings(filters?: {
    status?: Booking['status']
    dateStart?: string
    dateEnd?: string
  }): Promise<(Booking & { clients: Client })[]> {
    let query = supabase.from('bookings').select('*, clients(*)')

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.dateStart && filters?.dateEnd) {
      query = query
        .gte('start_time', filters.dateStart)
        .lte('start_time', filters.dateEnd)
    }

    const { data, error } = await query.order('start_time', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get bookings by date range (for calendar)
  async getBookingsByDateRange(startDate: string, endDate: string): Promise<(Booking & { clients: Client })[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, clients(*)')
      .gte('start_time', startDate)
      .lte('start_time', endDate)
      .neq('status', 'cancelled')
      .order('start_time', { ascending: true })

    if (error) throw error
    return data || []
  },
}

// Simpler booking creation for client-facing booking form
export interface BookingRequest {
  service_id: string
  client_name: string
  client_email: string
  client_phone: string
  date: string
  preferred_time: string
  location: string
  notes?: string
}

export async function createBookingRequest(request: BookingRequest): Promise<any> {
  // Combine date and time into proper timestamp format
  const startDateTime = `${request.date}T${request.preferred_time}:00`
  
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      service_id: request.service_id,
      client_id: null, // No client record yet, storing info directly in booking
      client_name: request.client_name,
      client_email: request.client_email,
      client_phone: request.client_phone,
      booking_date: request.date, // Add the booking_date field
      preferred_time: request.preferred_time,
      location: request.location,
      notes: request.notes || '',
      status: 'pending',
      start_time: startDateTime,
      end_time: startDateTime,
    }])
    .select()
    .single()

  if (error) {
    console.error('Supabase booking error details:', JSON.stringify(error, null, 2))
    throw error
  }
  return data
}
