'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getServiceById } from '@/lib/supabase/services'

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  category: string | null
  is_active: boolean
  image_url: string | null
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadService()
  }, [params.id])

  const loadService = async () => {
    try {
      const data = await getServiceById(params.id as string)
      if (!data || !data.is_active) {
        router.push('/services')
        return
      }
      setService(data)
    } catch (error) {
      console.error('Error loading service:', error)
      router.push('/services')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted">Loading service...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return null
  }

  return (
    <main className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-body hover:text-primary mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Services
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <div className="relative h-96 md:h-full min-h-[400px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl overflow-hidden sticky top-24">
              {service.image_url ? (
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            {service.category && (
              <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
                {service.category}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-heading font-bold text-heading mb-4">
              {service.name}
            </h1>

            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              <div>
                <div className="text-3xl font-bold text-primary">${service.price}</div>
                <div className="text-sm text-muted">Starting price</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div>
                <div className="text-2xl font-semibold text-heading">{service.duration} min</div>
                <div className="text-sm text-muted">Duration</div>
              </div>
            </div>

            {service.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-semibold mb-4">Description</h2>
                <p className="text-body text-lg leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            )}

            <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 p-6 mb-8">
              <h3 className="font-heading font-semibold text-lg mb-3">What&apos;s Included</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Professional mobile service</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>High-quality products included</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Consultation and aftercare advice</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Flexible scheduling</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`/booking?service=${service.id}`}
                className="btn-primary flex-1 text-center"
              >
                Book This Service
              </a>
              <a 
                href="/contact"
                className="btn-secondary flex-1 text-center"
              >
                Ask Questions
              </a>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Mobile Service</p>
                  <p>I come to your location within the Greater Metro Area. Travel fees may apply for locations outside the standard service area.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
