'use client'

import { useState, useEffect } from 'react'
import { messageQueries } from '@/lib/supabase/messages'
import { bookingQueries } from '@/lib/supabase/bookings'

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

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [adminId] = useState('admin_default')

  // Initialize
  useEffect(() => {
    loadConversations()
    loadUnreadCount()
  }, [])

  // Load conversations
  const loadConversations = async () => {
    try {
      setLoading(true)
      const convos = await messageQueries.getConversations(adminId, 'admin')
      const sorted = convos.sort(
        (a, b) =>
          new Date(b.last_message_time).getTime() -
          new Date(a.last_message_time).getTime()
      )
      setConversations(sorted)
      if (sorted.length > 0 && !selectedBooking) {
        setSelectedBooking(sorted[0].booking_id)
      }
    } catch (err) {
      console.error('Failed to load conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load messages for selected booking
  useEffect(() => {
    if (selectedBooking) {
      loadMessages(selectedBooking)
    }
  }, [selectedBooking])

  const loadMessages = async (bookingId: string) => {
    try {
      const msgs = await messageQueries.getMessagesByBooking(bookingId)
      setMessages(msgs)
      // Mark as read
      await messageQueries.markAsRead(bookingId, adminId)
      loadUnreadCount()
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const count = await messageQueries.getUnreadCount(adminId, 'admin')
      setUnreadCount(count)
    } catch (err) {
      console.error('Failed to load unread count:', err)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedBooking) return

    try {
      const booking = await bookingQueries.getBookingWithClient(selectedBooking)
      
      await messageQueries.createMessage({
        sender_id: adminId,
        sender_type: 'admin',
        receiver_id: booking.client_id,
        receiver_type: 'client',
        booking_id: selectedBooking,
        content: newMessage,
      })

      setNewMessage('')
      await loadMessages(selectedBooking)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  // Filter conversations
  const filteredConversations = conversations.filter((convo) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      convo.booking?.services?.name?.toLowerCase().includes(query) ||
      convo.booking?.clients?.name?.toLowerCase().includes(query) ||
      convo.last_message.toLowerCase().includes(query)
    )
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Conversations List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
              {unreadCount > 0 && (
                <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery ? 'No conversations match' : 'No conversations yet'}
              </div>
            ) : (
              filteredConversations.map((convo) => (
                <button
                  key={convo.booking_id}
                  onClick={() => setSelectedBooking(convo.booking_id)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                    selectedBooking === convo.booking_id
                      ? 'bg-primary bg-opacity-10 border-l-4 border-l-primary'
                      : ''
                  } ${!convo.is_read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {convo.booking?.clients?.name || 'Client'}
                        </h3>
                        {convo.unread_count > 0 && (
                          <span className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            {convo.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {convo.booking?.services?.name} • {convo.booking?.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 truncate">
                    {convo.sender_type === 'admin' ? 'You: ' : ''}
                    {convo.last_message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(convo.last_message_time).toLocaleDateString()}
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
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            {convo.booking?.clients?.name}
                          </h2>
                          <p className="text-sm text-gray-600 mt-1">
                            {convo.booking?.services?.name} •{' '}
                            {convo.booking?.date} at {convo.booking?.start_time}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            📧 {convo.booking?.clients?.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            📱 {convo.booking?.clients?.phone}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="inline-block px-3 py-1 bg-cyan-100 text-cyan-900 rounded-full text-xs font-semibold">
                            Status: {convo.booking?.status || 'pending'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-lg ${
                          msg.sender_type === 'admin'
                            ? 'bg-cyan-500 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            msg.sender_type === 'admin'
                              ? 'text-cyan-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
                    placeholder="Type a response..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-2 bg-cyan text-white rounded-lg hover:bg-cyan-dark disabled:opacity-50 transition"
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
