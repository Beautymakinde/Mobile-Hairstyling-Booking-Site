'use client'

import { useEffect, useState } from 'react'
import { bookingQueries } from '@/lib/supabase/bookings'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

interface Booking {
  id: string
  date: string
  time_slot: string
  service_id: string
  client_id: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  clients?: {
    name: string
    email: string
  }
}

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false)

  useEffect(() => {
    loadMonthBookings()
    checkGoogleCalendarConnection()
  }, [currentDate])

  const loadMonthBookings = async () => {
    try {
      setLoading(true)
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd')
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd')
      
      const data = await bookingQueries.getBookingsByDateRange(start, end)
      setBookings(data as any)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkGoogleCalendarConnection = () => {
    const token = localStorage.getItem('google_calendar_token')
    setGoogleCalendarConnected(!!token)
  }

  const connectGoogleCalendar = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/admin/calendar/callback`
    const scope = 'https://www.googleapis.com/auth/calendar.events'
    
    if (!clientId) {
      alert('Google Calendar is not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your environment variables.')
      return
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=token&` +
      `scope=${encodeURIComponent(scope)}&` +
      `prompt=consent`

    window.location.href = authUrl
  }

  const disconnectGoogleCalendar = () => {
    localStorage.removeItem('google_calendar_token')
    setGoogleCalendarConnected(false)
  }

  const syncToGoogleCalendar = async (booking: Booking) => {
    const token = localStorage.getItem('google_calendar_token')
    if (!token) {
      alert('Please connect Google Calendar first')
      return
    }

    try {
      const event = {
        summary: `Hair Appointment - ${booking.clients?.name}`,
        description: `Booking ID: ${booking.id}\nClient: ${booking.clients?.name}\nEmail: ${booking.clients?.email}`,
        start: {
          dateTime: `${booking.date}T${booking.time_slot}:00`,
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: `${booking.date}T${booking.time_slot}:00`,
          timeZone: 'America/New_York',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      }

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })

      if (response.ok) {
        alert('Successfully synced to Google Calendar!')
      } else {
        throw new Error('Failed to sync')
      }
    } catch (error) {
      console.error('Error syncing to Google Calendar:', error)
      alert('Failed to sync. You may need to reconnect your Google Calendar.')
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return bookings.filter(b => b.date === dateStr)
  }

  const dayBookings = selectedDate ? getBookingsForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="font-playfair text-h2-mobile md:text-h2-desktop mb-2">Calendar</h1>
          <p className="text-body-lg text-muted">View and manage your appointments</p>
        </div>

        {/* Google Calendar Integration */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-raleway font-semibold text-heading mb-1">Google Calendar Sync</h3>
                <p className="text-body-sm text-muted">
                  {googleCalendarConnected 
                    ? 'Connected - Sync your bookings to Google Calendar' 
                    : 'Connect your Google Calendar to automatically sync appointments'}
                </p>
              </div>
            </div>
            {googleCalendarConnected ? (
              <button onClick={disconnectGoogleCalendar} className="btn-secondary btn-sm">
                Disconnect
              </button>
            ) : (
              <button onClick={connectGoogleCalendar} className="btn-primary btn-sm">
                Connect Google Calendar
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                <h2 className="font-playfair text-h3">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="btn-secondary btn-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setCurrentDate(new Date())}
                    className="btn-secondary btn-sm"
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="btn-secondary btn-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-body-sm font-semibold text-muted py-2">
                    {day}
                  </div>
                ))}

                {monthDays.map(day => {
                  const dayBookings = getBookingsForDate(day)
                  const isToday = isSameDay(day, new Date())
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  
                  return (
                    <button
                      key={day.toString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        aspect-square p-2 rounded-lg border text-left relative
                        ${isToday ? 'border-primary bg-primary/5' : 'border-border'}
                        ${isSelected ? 'bg-primary text-white' : 'bg-white hover:bg-gray-50'}
                        ${!isSameMonth(day, currentDate) ? 'opacity-40' : ''}
                        transition-all
                      `}
                    >
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-heading'}`}>
                        {format(day, 'd')}
                      </span>
                      {dayBookings.length > 0 && (
                        <div className="absolute bottom-1 left-1 right-1 flex gap-1 justify-center">
                          {dayBookings.slice(0, 3).map((_, i) => (
                            <div 
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <h3 className="font-playfair text-h4 mb-4">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </h3>

              {loading ? (
                <div className="space-y-3">
                  <div className="skeleton h-20 w-full" />
                  <div className="skeleton h-20 w-full" />
                </div>
              ) : dayBookings.length > 0 ? (
                <div className="space-y-3">
                  {dayBookings.map(booking => (
                    <div key={booking.id} className="p-4 bg-background rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-raleway font-semibold text-heading">{booking.clients?.name}</p>
                          <p className="text-body-sm text-muted">{booking.time_slot}</p>
                        </div>
                        <span className={`badge ${
                          booking.status === 'confirmed' ? 'status-confirmed' :
                          booking.status === 'pending' ? 'status-pending' :
                          booking.status === 'completed' ? 'status-completed' :
                          'status-cancelled'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      {googleCalendarConnected && booking.status === 'confirmed' && (
                        <button 
                          onClick={() => syncToGoogleCalendar(booking)}
                          className="btn-secondary btn-sm w-full mt-2"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Sync to Google
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <p className="text-muted text-center py-8">No bookings for this day</p>
              ) : (
                <p className="text-muted text-center py-8">Select a date to view bookings</p>
              )}
            </div>

            <div className="card mt-6">
              <h4 className="font-raleway font-semibold text-heading mb-3">Legend</h4>
              <div className="space-y-2 text-body-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted">Has bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border-2 border-primary"></div>
                  <span className="text-muted">Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
