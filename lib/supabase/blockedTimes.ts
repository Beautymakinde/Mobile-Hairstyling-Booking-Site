import { supabase } from './client'
import { BlockedTime } from '../types/database'

export const blockedTimeQueries = {
  // Get blocked times for a date
  async getBlockedTimes(date: string): Promise<BlockedTime[]> {
    const { data, error } = await supabase
      .from('blocked_times')
      .select('*')
      .eq('date', date)

    if (error) throw error
    return data || []
  },

  // Create blocked time slot
  async createBlockedTime(blockedTime: Omit<BlockedTime, 'id'>): Promise<BlockedTime> {
    const { data, error } = await supabase
      .from('blocked_times')
      .insert([blockedTime])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete blocked time
  async deleteBlockedTime(id: string): Promise<void> {
    const { error } = await supabase
      .from('blocked_times')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
