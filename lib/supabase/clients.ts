import { supabase } from './client'
import { Client } from '../types/database'

export const clientQueries = {
  // Create or get client
  async upsertClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
    const { data: existing } = await supabase
      .from('clients')
      .select('*')
      .eq('email', client.email)
      .single()

    if (existing) {
      return existing
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single()

    if (error) throw error
    return data
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
