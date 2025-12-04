import { supabase } from './client'
import { Client } from '../types/database'

export const clientQueries = {
  // Create or get client
  async upsertClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
    try {
      // First check if client exists
      const { data: existing, error: selectError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', client.email)
        .maybeSingle()

      // If client exists, return it
      if (existing && !selectError) {
        console.log('Found existing client:', existing.id)
        return existing
      }

      // Create new client
      console.log('Creating new client:', client.email)
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single()

      if (error) {
        console.error('Error creating client:', JSON.stringify(error, null, 2))
        throw error
      }
      
      console.log('Created new client:', data.id)
      return data
    } catch (error) {
      console.error('upsertClient error:', error)
      throw error
    }
  },

  // Get all clients (admin)
  async getAllClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get client by id
  async getClient(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  },

  // Update client info
  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
