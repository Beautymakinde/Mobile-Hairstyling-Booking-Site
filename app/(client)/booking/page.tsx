'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getServiceById } from '@/lib/supabase/services'
import { createBookingRequest } from '@/lib/supabase/bookings'
import { getSettings } from '@/lib/supabase/settings'

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  category?: string | null
  active: boolean
  image_url: string | null
}

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service')
  
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [zelleInfo, setZelleInfo] = useState<{ email?: string; phone?: string } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    location: '',
    notes: ''
  })

  useEffect(() => {
    if (serviceId) {
      loadService()
    } else {
      setLoading(false)
    }
  }, [serviceId])

  const loadService = async () => {
    try {
      const data = await getServiceById(serviceId!)
      if (!data || !data.active) {
        router.push('/services')
        return
      }
      setService(data as Service)
    } catch (error) {
      console.error('Error loading service:', error)
      router.push('/services')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!service) return
    
    try {
      setSubmitting(true)
      
      // Create booking request
      await createBookingRequest({
        service_id: service.id,
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        date: formData.date,
        preferred_time: formData.time,
        location: formData.location,
        notes: formData.notes
      })
      
      // Load Zelle payment info
      const settings = await getSettings()
      if (settings.zelle_info) {
        setZelleInfo(settings.zelle_info)
      }
      
      setSuccess(true)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to submit booking request. Please try again or contact us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <button onClick={() => router.push('/services')} className="btn-primary">
            Browse Services
          </button>
        </div>
      </div>
    )
  }

  // Success screen with payment info
  if (success) {
    return (
      <main className="min-h-screen py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="card p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-playfair font-bold text-heading mb-4">
              Booking Request Received!
            </h1>
            
            <p className="text-body mb-8">
              Thank you for your booking request. We&apos;ve received your information and will review it shortly.
            </p>

            {/* Service Summary */}
            <div className="bg-background p-6 rounded-lg mb-8 text-left">
              <h2 className="font-semibold text-lg mb-4">Booking Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Service:</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Date:</span>
                  <span className="font-medium">{new Date(formData.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Time:</span>
                  <span className="font-medium">{formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Price:</span>
                  <span className="font-medium text-primary">${service.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            {zelleInfo && (zelleInfo.email || zelleInfo.phone) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Next Steps: Send Deposit
                </h2>
                <p className="text-sm text-blue-900 mb-4">
                  To confirm your appointment, please send a deposit via Zelle to:
                </p>
                <div className="bg-white rounded-lg p-4 space-y-2">
                  {zelleInfo.email && (
                    <div>
                      <span className="text-xs text-muted">Email:</span>
                      <div className="font-mono font-semibold text-blue-600">{zelleInfo.email}</div>
                    </div>
                  )}
                  {zelleInfo.phone && (
                    <div>
                      <span className="text-xs text-muted">Phone:</span>
                      <div className="font-mono font-semibold text-blue-600">{zelleInfo.phone}</div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-blue-800 mt-4">
                  Once we receive your deposit, we&apos;ll send you a confirmation email with all the details.
                </p>
              </div>
            )}

            {/* Confirmation Email Notice */}
            <div className="bg-background p-4 rounded-lg mb-6 text-sm">
              <p className="text-muted">
                A confirmation email has been sent to <strong className="text-heading">{formData.email}</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/services')}
                className="btn-secondary flex-1"
              >
                Browse More Services
              </button>
              <button
                onClick={() => router.push('/')}
                className="btn-primary flex-1"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <button onClick={() => router.push('/services')} className="btn-primary">
            Browse Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-body hover:text-primary mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-heading mb-2">Book Your Appointment</h1>
          <p className="text-muted">Fill out the form below to request an appointment</p>
        </div>

        {/* Service Summary */}
        <div className="card mb-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="flex items-start gap-4">
            {service.image_url && (
              <img 
                src={service.image_url} 
                alt={service.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-playfair font-bold text-heading mb-1">{service.name}</h2>
              {service.category && (
                <span className="inline-block text-xs bg-primary/10 text-primary px-3 py-1 rounded-full mb-2">
                  {service.category}
                </span>
              )}
              <div className="flex items-center gap-4 text-sm text-muted">
                <span className="font-semibold text-primary text-lg">${service.price}</span>
                <span>•</span>
                <span>{service.duration} minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-heading mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-heading mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-heading mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-heading mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-heading mb-2">
                Preferred Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-heading mb-2">
                Service Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your address"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-heading mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Any special requests or requirements..."
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Booking Confirmation</p>
                <p>After submitting this request, you&apos;ll receive a confirmation email with deposit payment instructions. Your appointment will be confirmed once the deposit is received.</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Request Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
