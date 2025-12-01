import { supabase } from './client'
import { Service } from '../types/database'

// Map database columns to TypeScript interface
function mapDbToService(dbRow: any): Service {
  return {
    id: dbRow.id,
    name: dbRow.name,
    description: dbRow.description,
    duration: dbRow.duration_minutes, // Map duration_minutes to duration
    price: dbRow.price,
    image_url: dbRow.image_url,
    active: dbRow.is_active, // Map is_active to active
    created_at: dbRow.created_at,
  }
}

// Map TypeScript interface to database columns
function mapServiceToDb(service: Partial<Service>): any {
  const dbData: any = {}
  if (service.name !== undefined) dbData.name = service.name
  if (service.description !== undefined) dbData.description = service.description
  if (service.duration !== undefined) dbData.duration_minutes = service.duration // Map duration to duration_minutes
  if (service.price !== undefined) dbData.price = service.price
  if (service.image_url !== undefined) dbData.image_url = service.image_url
  if (service.active !== undefined) dbData.is_active = service.active // Map active to is_active
  return dbData
}

export const serviceQueries = {
  // Fetch all active services
  async getActiveServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) throw error
    return (data || []).map(mapDbToService)
  },

  // Fetch all services (admin)
  async getAllServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return (data || []).map(mapDbToService)
  },

  // Fetch single service
  async getService(id: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data ? mapDbToService(data) : null
  },

  // Create service
  async createService(service: Omit<Service, 'id' | 'created_at'>): Promise<Service> {
    const dbData = mapServiceToDb(service)
    const { data, error } = await supabase
      .from('services')
      .insert([dbData])
      .select()
      .single()

    if (error) throw error
    return mapDbToService(data)
  },

  // Update service
  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const dbData = mapServiceToDb(updates)
    const { data, error } = await supabase
      .from('services')
      .update(dbData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return mapDbToService(data)
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

// Convenience exports for client-facing pages
export const getServices = serviceQueries.getActiveServices
export const getServiceById = serviceQueries.getService
