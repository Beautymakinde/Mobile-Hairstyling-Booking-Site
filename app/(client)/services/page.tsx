'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getServices } from '@/lib/supabase/services'

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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const data = await getServices()
      setServices(data.filter((s: Service) => s.is_active))
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))]
  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(s => s.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4 max-w-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-heading mb-4">
            Our Services
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Professional hairstyling services tailored to your unique beauty
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-body hover:bg-primary/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No services found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Link 
                key={service.id} 
                href={`/services/${service.id}`}
                className="card group hover:scale-105 transform transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Service Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                  {service.image_url ? (
                    <img 
                      src={service.image_url} 
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-20 h-20 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-secondary text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    ${service.price}
                  </div>
                </div>

                {/* Service Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-heading font-semibold text-heading group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                  </div>

                  {service.description && (
                    <p className="text-muted mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-body">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{service.duration} min</span>
                    </div>

                    <span className="text-primary font-medium group-hover:underline flex items-center gap-1">
                      View Details
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="card max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
            <h2 className="text-3xl font-heading font-bold text-heading mb-4">
              Ready to Book?
            </h2>
            <p className="text-body mb-6">
              Choose a service and select your preferred date and time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/booking" className="btn-primary">
                Book Appointment
              </a>
              <a href="/contact" className="btn-secondary">
                Ask a Question
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
