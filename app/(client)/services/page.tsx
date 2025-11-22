'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Service = {
  id: number
  name: string
  category: string
  price: number
  duration: number
  description?: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'all', name: 'All Services', icon: '✨' },
    { id: 'Extensions', name: 'Extensions', icon: '💫' },
    { id: 'Braids', name: 'Braids', icon: '🌟' },
    { id: 'Weave', name: 'Weave', icon: '✨' },
    { id: 'Others', name: 'Others', icon: '💝' },
  ]

  useEffect(() => {
    // Mock data - Replace with real Supabase fetch
    setTimeout(() => {
      const mockServices: Service[] = [
        // Extensions
        { id: 1, name: 'Quickweave', category: 'Extensions', price: 140, duration: 180, description: 'Fast and fabulous sew-in weave installation' },
        { id: 2, name: 'Ponytail Extension', category: 'Extensions', price: 100, duration: 120, description: 'Sleek and stylish ponytail extensions' },
        { id: 3, name: 'Traditional Sew-in', category: 'Extensions', price: 180, duration: 180, description: 'Classic full sew-in weave installation' },
        // Braids
        { id: 4, name: 'Medium Knotless Braids', category: 'Braids', price: 200, duration: 360, description: 'Protective style with no tension on scalp' },
        { id: 5, name: 'French Curls', category: 'Braids', price: 200, duration: 300, description: 'Elegant curly braids with bouncy finish' },
        { id: 6, name: 'Boho Braids', category: 'Braids', price: 250, duration: 540, description: 'Trendy bohemian style with curly ends' },
        // Weave
        { id: 7, name: 'Big Stitch Braids', category: 'Weave', price: 150, duration: 240, description: 'Large cornrows for bold statement looks' },
        { id: 8, name: 'Small Stitch Braids', category: 'Weave', price: 250, duration: 360, description: 'Intricate small braids for detailed styles' },
        { id: 9, name: 'Lemonade Braids', category: 'Weave', price: 200, duration: 360, description: 'Side-swept braids inspired by Beyoncé' },
        { id: 10, name: 'Weaved Ponytail', category: 'Weave', price: 200, duration: 300, description: 'High ponytail with weave extensions' },
        { id: 11, name: 'Fulani Braids', category: 'Weave', price: 200, duration: 300, description: 'Traditional African braiding style with beads' },
        // Others
        { id: 12, name: 'Softlocs', category: 'Others', price: 150, duration: 300, description: 'Soft faux locs for natural protective style' },
        { id: 13, name: 'Crochet', category: 'Others', price: 130, duration: 240, description: 'Quick protective style using crochet method' },
        { id: 14, name: 'Kinky Twist', category: 'Others', price: 150, duration: 300, description: 'Natural looking twisted protective style' },
        { id: 15, name: 'Passion Twist', category: 'Others', price: 170, duration: 300, description: 'Soft and bouncy twisted style' },
        { id: 16, name: 'Boho Twist', category: 'Others', price: 200, duration: 420, description: 'Bohemian twists with curly accent pieces' },
      ]
      setServices(mockServices)
      setLoading(false)
    }, 500)
  }, [])

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory)

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Extensions': 'from-primary to-primary-dark',
      'Braids': 'from-secondary to-secondary-dark',
      'Weave': 'from-success to-success/80',
      'Others': 'from-warning to-warning/80'
    }
    return colors[category] || 'from-primary to-primary-dark'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary py-20 px-4">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-h1-mobile md:text-h1-desktop font-playfair text-white mb-6">
            Our Services
          </h1>
          <p className="text-body-lg text-white/90 max-w-2xl mx-auto">
            Professional mobile hairstyling services delivered to your doorstep. 
            Choose from our wide range of protective styles and extensions.
          </p>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FAFAFA"/>
          </svg>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section -mt-8 relative z-20">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id
              const count = cat.id === 'all' ? services.length : services.filter(s => s.category === cat.id).length
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-6 py-3 rounded-full font-raleway font-semibold transition-all
                    flex items-center gap-2 min-h-touch
                    ${isActive 
                      ? 'bg-primary text-white shadow-button scale-105' 
                      : 'bg-white text-heading hover:bg-primary/5 hover:scale-105 shadow-sm'
                    }
                  `}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="skeleton h-8 w-3/4 mb-4"></div>
                  <div className="skeleton-text mb-2"></div>
                  <div className="skeleton-text w-2/3 mb-4"></div>
                  <div className="flex gap-3 mb-4">
                    <div className="skeleton h-6 w-20"></div>
                    <div className="skeleton h-6 w-20"></div>
                  </div>
                  <div className="skeleton h-10 w-full"></div>
                </div>
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id} className="card-interactive group overflow-hidden">
                  {/* Category Badge */}
                  <div className={`h-2 bg-gradient-to-r ${getCategoryColor(service.category)}`}></div>
                  
                  <div className="p-6">
                    {/* Service Name */}
                    <h3 className="text-2xl font-playfair font-bold text-heading mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    
                    {/* Category Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3
                      ${service.category === 'Extensions' ? 'bg-primary/10 text-primary' : ''}
                      ${service.category === 'Braids' ? 'bg-secondary/10 text-secondary-dark' : ''}
                      ${service.category === 'Weave' ? 'bg-success/10 text-success' : ''}
                      ${service.category === 'Others' ? 'bg-warning/10 text-warning' : ''}
                    `}>
                      {service.category}
                    </span>
                    
                    {/* Description */}
                    {service.description && (
                      <p className="text-body-sm text-muted mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    
                    {/* Price & Duration */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                      <div className="flex items-center gap-2 text-muted">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-heading text-lg">${service.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted text-body-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatDuration(service.duration)}</span>
                      </div>
                    </div>
                    
                    {/* Book Button */}
                    <Link 
                      href={`/services/${service.id}`}
                      className="btn-primary w-full text-center group-hover:shadow-lg transition-all"
                    >
                      View Details & Book
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-playfair font-bold text-heading mb-2">No services found</h3>
              <p className="text-muted mb-6">Try selecting a different category</p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="btn-secondary"
              >
                View All Services
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-primary via-primary-dark to-secondary">
        <div className="container-custom text-center">
          <h2 className="text-h2-mobile md:text-h2-desktop font-playfair text-white mb-4">
            Ready to Transform Your Look?
          </h2>
          <p className="text-body-lg text-white/90 max-w-2xl mx-auto mb-8">
            Book your appointment today and experience professional hairstyling in the comfort of your home.
          </p>
          <Link href="/contact" className="btn-secondary inline-flex items-center gap-2">
            Contact Us
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
