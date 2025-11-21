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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading services...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Our Services</h1>

        {services.length === 0 ? (
          <p className="text-center text-gray-600">No services available yet</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                )}
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
