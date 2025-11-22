'use client'

import { useState, useEffect } from 'react'
import { serviceQueries } from '@/lib/supabase/services'
import { Service } from '@/lib/types/database'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await serviceQueries.getActiveServices()
        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <a href="/" className="btn-primary">Go Home</a>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-purple-700 py-16">
        <div className="container mx-auto px-4 max-w-container">
          <div className="max-w-3xl">
            <a href="/" className="text-white/80 hover:text-white mb-4 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </a>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mt-4">
              Our Services
            </h1>
            <p className="text-white/90 text-lg mt-4">
              Choose from our range of professional hairstyling services
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16 max-w-container">
        {services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg">No services available yet</p>
            <p className="text-muted mt-2">Please check back soon</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => (
              <div key={service.id} className="card group hover:scale-[1.02] transform transition-all duration-300">
                {/* Service Image */}
                <div className="relative h-56 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-20 h-20 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                    <p className="text-primary font-bold text-lg">${service.price}</p>
                  </div>
                </div>

                {/* Service Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-heading font-semibold text-heading mb-2">
                    {service.name}
                  </h3>
                  <p className="text-muted mb-4 line-clamp-2">
                    {service.description || 'Professional hairstyling service'}
                  </p>
                  
                  <div className="flex items-center gap-2 text-muted mb-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{service.duration_minutes} minutes</span>
                  </div>

                  <a 
                    href={`/client/booking?serviceId=${service.id}`}
                    className="block w-full text-center btn-primary"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {service.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-gray-500">{service.duration} mins</span>
                    <span className="text-2xl font-bold text-primary">
                      ${service.price.toFixed(2)}
                    </span>
                  </div>
                  <a
                    href={`/client/booking?serviceId=${service.id}`}
                    className="block text-center bg-primary text-white py-2 rounded-lg hover:bg-pink-600 transition"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
