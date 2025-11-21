import { supabase } from './client'

export const settingsQueries = {
  // Get admin settings
  async getSettings(): Promise<any> {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .single()

    if (error && error.code === 'PGRST116') {
      // No settings yet, return defaults
      return null
    }
    if (error) throw error
    return data
  },

  // Create or update admin settings
  async upsertSettings(settings: any): Promise<any> {
    const existing = await this.getSettings()

    if (existing) {
      const { data, error } = await supabase
        .from('admin_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      const { data, error } = await supabase
        .from('admin_settings')
        .insert([settings])
        .select()
        .single()

      if (error) throw error
      return data
    }
  },
}
