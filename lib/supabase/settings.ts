import { supabase } from './client'

export const settingsQueries = {
  // Get admin settings (using key-value structure)
  async getSettings(): Promise<any> {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('setting_key, setting_value')

    if (error) {
      console.error('Error fetching settings:', error)
      return null
    }

    // Convert key-value pairs to object
    const settings: any = {}
    if (data) {
      data.forEach((row: any) => {
        try {
          settings[row.setting_key] = JSON.parse(row.setting_value)
        } catch {
          settings[row.setting_key] = row.setting_value
        }
      })
    }

    return settings
  },

  // Create or update admin settings (using key-value structure)
  async upsertSettings(settings: any): Promise<any> {
    // Convert settings object to key-value array
    const updates = Object.entries(settings).map(([key, value]) => ({
      setting_key: key,
      setting_value: typeof value === 'string' ? value : JSON.stringify(value),
      updated_at: new Date().toISOString(),
    }))

    // Upsert each setting
    for (const update of updates) {
      const { error } = await supabase
        .from('admin_settings')
        .upsert(update, { 
          onConflict: 'setting_key',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Error upserting setting:', error)
        throw error
      }
    }

    return settings
  },
}
