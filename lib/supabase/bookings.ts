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
      .eq('date', date)
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
        .gte('date', filters.dateStart)
        .lte('date', filters.dateEnd)
    }

    const { data, error } = await query.order('date', { ascending: false })

    if (error) throw error
    return data || []
  },
}
