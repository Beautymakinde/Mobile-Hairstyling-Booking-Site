import { supabase } from './client'
import { Service } from '../types/database'

export const serviceQueries = {
  // Fetch all active services
  async getActiveServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Fetch all services (admin)
  async getAllServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Fetch single service
  async getService(id: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  },

  // Create service
  async createService(service: Omit<Service, 'id' | 'created_at'>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update service
  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete service
  async deleteService(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
