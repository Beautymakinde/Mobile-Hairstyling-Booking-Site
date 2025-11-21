'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { serviceQueries } from '@/lib/supabase/services'
import { bookingQueries } from '@/lib/supabase/bookings'
import { clientQueries } from '@/lib/supabase/clients'
import { storageQueries } from '@/lib/supabase/storage'
import { settingsQueries } from '@/lib/supabase/settings'
import { Service } from '@/lib/types/database'
import { getTimeSlots, addMinutesToTime } from '@/lib/utils/time'
import '../../../styles/calendar.css'

type BookingStep = 'service' | 'datetime' | 'info' | 'payment' | 'upload' | 'confirmation'

export default function BookingPage() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('serviceId')

  const [currentStep, setCurrentStep] = useState<BookingStep>('service')
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    hair_info: '',
    notes: '',
  })

  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [zelleInfo, setZelleInfo] = useState<{ email?: string; phone?: string } | null>(null)
  const [zelleLoading, setZelleLoading] = useState(true)

  useEffect(() => {
    loadServices()
    loadZelleInfo()
  }, [])

  const loadZelleInfo = async () => {
    try {
      setZelleLoading(true)
      const settings = await settingsQueries.getSettings()
      if (settings?.zelle_info) {
        setZelleInfo(settings.zelle_info)
      }
    } catch (err) {
      console.error('Failed to load Zelle info:', err)
    } finally {
      setZelleLoading(false)
    }
  }

  useEffect(() => {
    if (serviceId) {
      serviceQueries.getService(serviceId).then((service) => {
        if (service) {
          setSelectedService(service)
          setCurrentStep('datetime')
        }
      })
    }
  }, [serviceId])

  const loadServices = async () => {
    try {
      const data = await serviceQueries.getActiveServices()
      setServices(data)
    } catch (err) {
      console.error('Failed to load services:', err)
    }
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service)
    setCurrentStep('datetime')
  }

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setLoading(true)

    try {
      const dateStr = date.toISOString().split('T')[0]
      const bookings = await bookingQueries.getBookingsByDate(dateStr)

      // Calculate available time slots
      const slots = getTimeSlots(9, 17) // 9 AM to 5 PM
      const filtered = slots.filter((time) => {
        if (!selectedService) return false
        const endTime = addMinutesToTime(time, selectedService.duration)
        const isBooked = bookings.some(
          (b) => b.start_time === time && b.end_time === endTime && b.status !== 'cancelled'
        )
        return !isBooked
      })

      setAvailableTimeSlots(filtered)
    } catch (err) {
      console.error('Failed to load available times:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleNextStep = () => {
    if (currentStep === 'datetime' && selectedTime) {
      setCurrentStep('info')
    }
  }

  const handleSubmitInfo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentStep('payment')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      const preview = URL.createObjectURL(file)
      setReceiptPreview(preview)
    }
  }

  const handleCompleteBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientInfo.name) return

    try {
      setLoading(true)

      // Create or get client
      const client = await clientQueries.upsertClient({
        name: clientInfo.name,
        email: clientInfo.email,
        phone: clientInfo.phone,
        address: clientInfo.address,
        hair_info: clientInfo.hair_info,
        notes: clientInfo.notes,
      })

      // Create booking first
      const dateStr = selectedDate.toISOString().split('T')[0]
      const endTime = addMinutesToTime(selectedTime, selectedService.duration)

      const booking = await bookingQueries.createBooking({
        client_id: client.id,
        service_id: selectedService.id,
        date: dateStr,
        start_time: selectedTime,
        end_time: endTime,
        status: 'pending',
        deposit_receipt_url: null,
      })

      // Booking created successfully

      // Upload receipt if provided
      if (receiptFile) {
        try {
          const { url } = await storageQueries.uploadReceipt(booking.id, receiptFile)
          // Update booking with receipt URL
          await bookingQueries.updateBooking(booking.id, {
            deposit_receipt_url: url,
          })
        } catch (err) {
          console.error('Failed to upload receipt:', err)
          // Booking created successfully even if receipt upload fails
        }
      }

      // Send booking pending email to client
      if (clientInfo.email) {
        try {
          const emailData = {
            clientName: clientInfo.name,
            serviceName: selectedService.name,
            date: dateStr,
            time: selectedTime,
            bookingId: booking.id,
            price: selectedService.price,
          }

          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientEmail: clientInfo.email,
              clientName: clientInfo.name,
              templateType: 'booking_pending',
              templateData: emailData,
            }),
          })
        } catch (err) {
          console.error('Failed to send confirmation email:', err)
          // Don't block booking if email fails
        }
      }

      // Send booking pending SMS to client
      if (clientInfo.phone) {
        try {
          const smsData = {
            clientName: clientInfo.name,
            serviceName: selectedService.name,
            date: dateStr,
            time: selectedTime,
          }

          await fetch('/api/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber: clientInfo.phone,
              templateId: 'BOOKING_PENDING',
              templateData: smsData,
            }),
          })
        } catch (err) {
          console.error('Failed to send SMS notification:', err)
          // Don't block booking if SMS fails
        }
      }

      // Send admin alert email
      try {
        const adminData = {
          clientName: clientInfo.name,
          serviceName: selectedService.name,
          date: dateStr,
          time: selectedTime,
          bookingId: booking.id,
          clientEmail: clientInfo.email,
          clientPhone: clientInfo.phone,
        }

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientEmail: clientInfo.email,
            clientName: clientInfo.name,
            templateType: 'admin_new_booking',
            templateData: adminData,
            isAdmin: true,
          }),
        })
      } catch (err) {
        console.error('Failed to send admin notification:', err)
        // Don't block booking if admin notification fails
      }

      setCurrentStep('confirmation')
    } catch (err) {
      console.error('Failed to create booking:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {(['service', 'datetime', 'info', 'payment', 'upload', 'confirmation'] as BookingStep[]).map(
              (step, idx) => (
                <div
                  key={step}
                  className={`flex-1 h-2 mx-1 rounded ${
                    ['service', 'datetime', 'info', 'payment', 'upload', 'confirmation'].indexOf(
                      currentStep
                    ) >= idx
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  }`}
                />
              )
            )}
          </div>
        </div>

        {/* Step 1: Select Service */}
        {currentStep === 'service' && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
            <div className="space-y-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition"
                >
                  <h3 className="font-bold text-gray-900">{service.name}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-500">{service.duration} mins</span>
                    <span className="font-bold text-primary">${service.price.toFixed(2)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {currentStep === 'datetime' && selectedService && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Choose Date & Time</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-4">Select a Date</h3>
                <Calendar
                  onChange={(value) => {
                    if (value instanceof Date) {
                      handleDateSelect(value)
                    }
                  }}
                  value={selectedDate}
                  minDate={new Date()}
                />
              </div>
              <div>
                <h3 className="font-bold mb-4">Available Times</h3>
                {selectedDate && (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      {selectedDate.toDateString()}
                    </p>
                    {loading ? (
                      <p className="text-gray-600">Loading available times...</p>
                    ) : availableTimeSlots.length === 0 ? (
                      <p className="text-gray-600">No available times for this date</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`p-3 rounded font-medium transition ${
                              selectedTime === time
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
                {selectedTime && (
                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 bg-primary text-white py-2 rounded-lg hover:bg-pink-600 transition"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Client Information */}
        {currentStep === 'info' && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Your Information</h2>
            <form onSubmit={handleSubmitInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Address *
                </label>
                <input
                  type="text"
                  value={clientInfo.address}
                  onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hair Type/Length
                </label>
                <input
                  type="text"
                  value={clientInfo.hair_info}
                  onChange={(e) => setClientInfo({ ...clientInfo, hair_info: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests/Notes
                </label>
                <textarea
                  value={clientInfo.notes}
                  onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Payment Instructions */}
        {currentStep === 'payment' && selectedService && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Deposit Payment</h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="text-gray-900 mb-2">
                <strong>Deposit Required:</strong> ${(selectedService.price * 0.5).toFixed(2)}
              </p>
              <p className="text-gray-600 text-sm">
                Please send your deposit via Zelle to confirm your booking
              </p>
            </div>

            {zelleLoading ? (
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6 text-gray-600">
                Loading payment information...
              </div>
            ) : zelleInfo ? (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <p className="text-green-900 font-semibold mb-2">Zelle Information:</p>
                {zelleInfo.email && (
                  <p className="text-green-800">
                    <strong>Email:</strong> {zelleInfo.email}
                  </p>
                )}
                {zelleInfo.phone && (
                  <p className="text-green-800">
                    <strong>Phone:</strong> {zelleInfo.phone}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>Zelle Information:</strong> Please contact us for payment details
                </p>
              </div>
            )}

            <button
              onClick={() => setCurrentStep('upload')}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-pink-600 transition"
            >
              I&apos;ve Sent the Deposit
            </button>
          </div>
        )}

        {/* Step 5: Upload Receipt */}
        {currentStep === 'upload' && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Upload Payment Receipt</h2>
            <p className="text-gray-600 mb-6">
              Please upload a screenshot of your Zelle payment confirmation
            </p>
            <div className="mb-6">
              <label className="block mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div>
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF, WebP (Max 5MB)</p>
                  </div>
                </div>
              </label>
              {receiptPreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="max-h-64 rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => handleCompleteBooking()}
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        {/* Step 6: Confirmation */}
        {currentStep === 'confirmation' && selectedService && selectedDate && selectedTime && (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-6">✓ Booking Confirmed!</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Service:</strong> {selectedService.name}</p>
                <p><strong>Date:</strong> {selectedDate.toDateString()}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Name:</strong> {clientInfo.name}</p>
                <p><strong>Email:</strong> {clientInfo.email}</p>
                <p><strong>Phone:</strong> {clientInfo.phone}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              A confirmation email has been sent to {clientInfo.email}
            </p>
            <a
              href="/"
              className="inline-block bg-secondary text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition"
            >
              Back to Home
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
