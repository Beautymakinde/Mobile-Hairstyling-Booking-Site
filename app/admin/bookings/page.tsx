'use client'

import { useState, useEffect } from 'react'
import { bookingQueries } from '@/lib/supabase/bookings'
import { Booking } from '@/lib/types/database'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<(Booking & { clients: any })[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<(Booking & { clients: any }) | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    loadBookings()
  }, [statusFilter])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingQueries.getBookings(
        statusFilter !== 'all' ? { status: statusFilter as any } : undefined
      )
      setBookings(data)
    } catch (err) {
      console.error('Failed to load bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (bookingId: string) => {
    try {
      await bookingQueries.updateBookingStatus(bookingId, 'confirmed')

      // Send confirmation email to client
      if (selectedBooking?.clients?.email && selectedBooking?.services) {
        try {
          const emailData = {
            clientName: selectedBooking.clients.name,
            serviceName: selectedBooking.services.name,
            date: selectedBooking.date,
            time: selectedBooking.start_time,
            bookingId: bookingId,
          }

          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientEmail: selectedBooking.clients.email,
              clientName: selectedBooking.clients.name,
              templateType: 'booking_confirmed',
              templateData: emailData,
            }),
          })
        } catch (err) {
          console.error('Failed to send confirmation email:', err)
        }
      }

      // Send confirmation SMS to client
      if (selectedBooking?.clients?.phone && selectedBooking?.services) {
        try {
          const smsData = {
            clientName: selectedBooking.clients.name,
            serviceName: selectedBooking.services.name,
            date: selectedBooking.date,
            time: selectedBooking.start_time,
          }

          await fetch('/api/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber: selectedBooking.clients.phone,
              templateId: 'BOOKING_CONFIRMED',
              templateData: smsData,
            }),
          })
        } catch (err) {
          console.error('Failed to send confirmation SMS:', err)
        }
      }

      await loadBookings()
      setSelectedBooking(null)
    } catch (err) {
      console.error('Failed to approve booking:', err)
    }
  }

  const handleReject = async (bookingId: string) => {
    try {
      await bookingQueries.updateBookingStatus(bookingId, 'cancelled')

      // Send rejection email to client
      if (selectedBooking?.clients?.email) {
        try {
          const emailData = {
            clientName: selectedBooking.clients.name,
            reason: 'Unable to confirm at this time. Please contact us for more information.',
          }

          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientEmail: selectedBooking.clients.email,
              clientName: selectedBooking.clients.name,
              templateType: 'booking_rejected',
              templateData: emailData,
            }),
          })
        } catch (err) {
          console.error('Failed to send rejection email:', err)
        }
      }

      // Send rejection SMS to client
      if (selectedBooking?.clients?.phone) {
        try {
          const smsData = {
            clientName: selectedBooking.clients.name,
            phone: process.env.NEXT_PUBLIC_ADMIN_PHONE || '(555) 123-4567',
          }

          await fetch('/api/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber: selectedBooking.clients.phone,
              templateId: 'BOOKING_REJECTED',
              templateData: smsData,
            }),
          })
        } catch (err) {
          console.error('Failed to send rejection SMS:', err)
        }
      }

      await loadBookings()
      setSelectedBooking(null)
    } catch (err) {
      console.error('Failed to reject booking:', err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary">Bookings Management</h1>
          <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Back
          </a>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition capitalize ${
                statusFilter === status
                  ? 'bg-secondary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All Bookings' : status}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No bookings found</p>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{booking.clients.name}</h3>
                    <p className="text-sm text-gray-600">{booking.clients.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.date).toLocaleDateString()} at {booking.start_time}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{booking.clients.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">{booking.clients.address}</p>
                  </div>
                </div>

                {booking.deposit_receipt_url && (
                  <div className="text-sm mb-4">
                    <p className="text-gray-600">Receipt Status</p>
                    <p className="font-medium text-green-600">✓ Receipt Uploaded</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-600 hover:text-gray-900 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Client Name</p>
                  <p className="font-medium text-gray-900">{selectedBooking.clients.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{selectedBooking.clients.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{selectedBooking.clients.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.start_time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{selectedBooking.clients.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hair Info</p>
                  <p className="font-medium text-gray-900">{selectedBooking.clients.hair_info || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="font-medium text-gray-900">{selectedBooking.clients.notes || 'None'}</p>
                </div>
              </div>

              {selectedBooking.deposit_receipt_url && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Receipt</p>
                  <img
                    src={selectedBooking.deposit_receipt_url}
                    alt="Payment receipt"
                    className="max-h-64 rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {selectedBooking.status === 'pending' && (
                <div className="border-t pt-4 flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedBooking.id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Approve Booking
                  </button>
                  <button
                    onClick={() => handleReject(selectedBooking.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Reject Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

