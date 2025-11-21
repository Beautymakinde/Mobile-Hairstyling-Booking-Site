import { supabase } from './client';
import { Message } from '@/lib/types/database';

/**
 * Message Query Functions
 * Handles all database operations for in-app messaging
 */

export const messageQueries = {
  /**
   * Create a new message
   */
  async createMessage({
    sender_id,
    sender_type,
    receiver_id,
    receiver_type,
    booking_id,
    content,
    is_read = false,
  }: {
    sender_id: string;
    sender_type: 'client' | 'admin';
    receiver_id: string;
    receiver_type: 'client' | 'admin';
    booking_id: string;
    content: string;
    is_read?: boolean;
  }): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id,
        sender_type,
        receiver_id,
        receiver_type,
        booking_id,
        content,
        is_read,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all messages for a booking (conversation thread)
   */
  async getMessagesByBooking(bookingId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get unread message count for a user
   */
  async getUnreadCount(userId: string, userType: 'client' | 'admin'): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('receiver_type', userType)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Get all conversations (unique booking threads) for a user
   */
  async getConversations(userId: string, _userType: 'client' | 'admin'): Promise<any[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        id,
        booking_id,
        sender_id,
        sender_type,
        receiver_id,
        receiver_type,
        content,
        is_read,
        created_at,
        bookings (id, date, start_time, clients (id, name, email, phone), services (id, name)),
        profiles:sender_id (id, email, name)
      `
      )
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by booking_id and get latest message
    const conversations = new Map();
    data?.forEach((msg) => {
      if (!conversations.has(msg.booking_id)) {
        conversations.set(msg.booking_id, {
          booking_id: msg.booking_id,
          booking: msg.bookings,
          last_message: msg.content,
          last_message_time: msg.created_at,
          sender_type: msg.sender_type,
          is_read: msg.is_read,
          unread_count: 0,
        });
      }
      // Count unread messages from the other person
      if (msg.receiver_id === userId && !msg.is_read) {
        const conv = conversations.get(msg.booking_id);
        conv.unread_count += 1;
      }
    });

    return Array.from(conversations.values());
  },

  /**
   * Get all unread conversations
   */
  async getUnreadConversations(
    userId: string,
    userType: 'client' | 'admin'
  ): Promise<string[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('booking_id')
      .eq('receiver_id', userId)
      .eq('receiver_type', userType)
      .eq('is_read', false)
      .select('distinct booking_id')

    if (error) throw error;
    return data?.map((m: any) => m.booking_id) || [];
  },

  /**
   * Mark messages as read
   */
  async markAsRead(bookingId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('booking_id', bookingId)
      .eq('receiver_id', userId);

    if (error) throw error;
  },

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  },

  /**
   * Search messages
   */
  async searchMessages(
    userId: string,
    query: string,
    _userType: 'client' | 'admin'
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get message statistics for a user
   */
  async getMessageStats(userId: string, userType: 'client' | 'admin'): Promise<any> {
    // Total messages sent
    const { count: sent } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', userId)
      .eq('sender_type', userType);

    // Total messages received
    const { count: received } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('receiver_type', userType);

    // Unread count
    const unread = await this.getUnreadCount(userId, userType);

    return {
      total_sent: sent || 0,
      total_received: received || 0,
      unread_count: unread,
      total_conversations: 0, // Will be populated separately
    };
  },

  /**
   * Subscribe to real-time messages for a booking
   */
  subscribeToBookingMessages(
    bookingId: string,
    callback: (message: Message) => void
  ): (() => void) {
    const subscription = supabase
      .channel(`booking-${bookingId}-messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload: any) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  /**
   * Subscribe to real-time unread count changes
   */
  subscribeToUnreadChanges(
    userId: string,
    userType: 'client' | 'admin',
    callback: (count: number) => void
  ): (() => void) {
    const subscription = supabase
      .channel(`unread-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        async () => {
          const count = await this.getUnreadCount(userId, userType);
          callback(count);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },
};
