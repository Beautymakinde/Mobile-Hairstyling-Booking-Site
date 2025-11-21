'use client'

import { useState, useEffect } from 'react'
import { messageQueries } from '@/lib/supabase/messages'
import { bookingQueries } from '@/lib/supabase/bookings'
import Link from 'next/link'

interface Conversation {
  booking_id: string
  booking: any
  last_message: string
  last_message_time: string
  sender_type: string
  is_read: boolean
  unread_count: number
}

interface Message {
  id: string
  sender_id: string
  sender_type: string
  receiver_id: string
  content: string
  created_at: string
  is_read: boolean
}

export default function ClientMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)

  // Initialize
  useEffect(() => {
    // In production, get userId from auth context
    const clientId = localStorage.getItem('client_id') || 'client_' + Math.random().toString(36).substr(2, 9)
    setUserId(clientId)
    loadConversations(clientId)
    loadUnreadCount(clientId)
  }, [])

  // Load conversations
  const loadConversations = async (clientId: string) => {
    try {
      setLoading(true)
      const convos = await messageQueries.getConversations(clientId, 'client')
      setConversations(convos)
      if (convos.length > 0 && !selectedBooking) {
        setSelectedBooking(convos[0].booking_id)
      }
    } catch (err) {
      console.error('Failed to load conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load messages for selected booking
  useEffect(() => {
    if (selectedBooking && userId) {
      loadMessages(selectedBooking, userId)
    }
  }, [selectedBooking, userId])

  const loadMessages = async (bookingId: string, clientId: string) => {
    try {
      const msgs = await messageQueries.getMessagesByBooking(bookingId)
      setMessages(msgs)
      // Mark as read
      await messageQueries.markAsRead(bookingId, clientId)
      loadUnreadCount(clientId)
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const loadUnreadCount = async (clientId: string) => {
    try {
      const count = await messageQueries.getUnreadCount(clientId, 'client')
      setUnreadCount(count)
    } catch (err) {
      console.error('Failed to load unread count:', err)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedBooking || !userId) return

    try {
      // Get admin ID (in production, would come from booking data)
      const booking = await bookingQueries.getBookingWithClient(selectedBooking)
      const adminId = 'admin_default'

      await messageQueries.createMessage({
        sender_id: userId,
        sender_type: 'client',
        receiver_id: adminId,
        receiver_type: 'admin',
        booking_id: selectedBooking,
        content: newMessage,
      })

      setNewMessage('')
      await loadMessages(selectedBooking, userId)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-primary mt-1">{unreadCount} unread</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No messages yet</p>
                <Link href="/client/booking" className="text-primary hover:underline">
                  Book an appointment
                </Link>
              </div>
            ) : (
              conversations.map((convo) => (
                <button
                  key={convo.booking_id}
                  onClick={() => setSelectedBooking(convo.booking_id)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                    selectedBooking === convo.booking_id ? 'bg-primary bg-opacity-10 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {convo.booking?.services?.name || 'Service'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {convo.booking?.date} at {convo.booking?.start_time}
                      </p>
                    </div>
                    {convo.unread_count > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                        {convo.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 truncate">
                    {convo.last_message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(convo.last_message_time).toLocaleTimeString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages View */}
        <div className="flex-1 flex flex-col">
          {selectedBooking && conversations.find((c) => c.booking_id === selectedBooking) ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                {conversations
                  .filter((c) => c.booking_id === selectedBooking)
                  .map((convo) => (
                    <div key={convo.booking_id}>
                      <h2 className="text-lg font-bold text-gray-900">
                        {convo.booking?.services?.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {convo.booking?.date} at {convo.booking?.start_time}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_type === 'client' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-sm px-4 py-2 rounded-lg ${
                          msg.sender_type === 'client'
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender_type === 'client'
                              ? 'text-primary-light'
                              : 'text-gray-500'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSendMessage()
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
