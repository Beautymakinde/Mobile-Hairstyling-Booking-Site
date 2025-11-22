'use client'

import { useState, useEffect } from 'react'

type Service = {
  id: number
  name: string
  category: string
  price: number
  duration: number
  active: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const categories = ['all', 'Extensions', 'Braids', 'Weave', 'Others']

  useEffect(() => {
    // Mock data - Replace with real Supabase fetch
    const mockServices: Service[] = [
      // Extensions
      { id: 1, name: 'Quickweave', category: 'Extensions', price: 140, duration: 180, active: true },
      { id: 2, name: 'Ponytail Extension', category: 'Extensions', price: 100, duration: 120, active: true },
      { id: 3, name: 'Traditional Sew-in', category: 'Extensions', price: 180, duration: 180, active: true },
      // Braids
      { id: 4, name: 'Medium Knotless Braids', category: 'Braids', price: 200, duration: 360, active: true },
      { id: 5, name: 'French Curls', category: 'Braids', price: 200, duration: 300, active: true },
      { id: 6, name: 'Boho Braids', category: 'Braids', price: 250, duration: 540, active: true },
      // Weave
      { id: 7, name: 'Big Stitch Braids', category: 'Weave', price: 150, duration: 240, active: true },
      { id: 8, name: 'Small Stitch Braids', category: 'Weave', price: 250, duration: 360, active: true },
      { id: 9, name: 'Lemonade Braids', category: 'Weave', price: 200, duration: 360, active: true },
      { id: 10, name: 'Weaved Ponytail', category: 'Weave', price: 200, duration: 300, active: true },
      { id: 11, name: 'Fulani Braids', category: 'Weave', price: 200, duration: 300, active: true },
      // Others
      { id: 12, name: 'Softlocs', category: 'Others', price: 150, duration: 300, active: true },
      { id: 13, name: 'Crochet', category: 'Others', price: 130, duration: 240, active: true },
      { id: 14, name: 'Kinky Twist', category: 'Others', price: 150, duration: 300, active: true },
      { id: 15, name: 'Passion Twist', category: 'Others', price: 170, duration: 300, active: true },
      { id: 16, name: 'Boho Twist', category: 'Others', price: 200, duration: 420, active: true },
    ]
    setServices(mockServices)
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
      'Extensions': 'badge-primary',
      'Braids': 'badge-secondary',
      'Weave': 'badge-success',
      'Others': 'badge-warning'
    }
    return colors[category] || 'badge-primary'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2-mobile md:text-h2-desktop font-playfair text-heading">Services & Pricing</h1>
          <p className="text-body-sm text-muted mt-1">Manage your service catalog and pricing</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary w-full sm:w-auto"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-body-sm text-muted">Total Services</p>
          <p className="text-2xl font-bold text-heading mt-1">{services.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-body-sm text-muted">Active</p>
          <p className="text-2xl font-bold text-success mt-1">{services.filter(s => s.active).length}</p>
        </div>
        <div className="card p-4">
          <p className="text-body-sm text-muted">Price Range</p>
          <p className="text-2xl font-bold text-heading mt-1">${Math.min(...services.map(s => s.price))} - ${Math.max(...services.map(s => s.price))}</p>
        </div>
        <div className="card p-4">
          <p className="text-body-sm text-muted">Categories</p>
          <p className="text-2xl font-bold text-heading mt-1">4</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-4 py-2 rounded-lg font-raleway font-medium transition-all whitespace-nowrap
              ${selectedCategory === cat 
                ? 'bg-primary text-white shadow-button' 
                : 'bg-white text-muted hover:bg-primary/5 hover:text-heading'
              }
            `}
          >
            {cat === 'all' ? 'All Services' : cat}
            <span className="ml-2 text-xs opacity-75">
              ({cat === 'all' ? services.length : services.filter(s => s.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* Services Table/Cards */}
      <div className="card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Service Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-raleway font-semibold text-heading">{service.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-raleway font-semibold text-heading">${service.price}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-body-sm text-muted">{formatDuration(service.duration)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`status ${service.active ? 'status-confirmed' : 'bg-gray-100 text-gray-600'}`}>
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 text-error hover:bg-error/5 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-border">
          {filteredServices.map((service) => (
            <div key={service.id} className="p-4 hover:bg-background/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-raleway font-semibold text-heading mb-1">{service.name}</h3>
                  <span className={`badge ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                </div>
                <span className={`status ${service.active ? 'status-confirmed' : 'bg-gray-100 text-gray-600'}`}>
                  {service.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-6 text-body-sm text-muted mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-heading">${service.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatDuration(service.duration)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost btn-sm flex-1">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button className="btn-ghost btn-sm text-error hover:bg-error/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <p className="text-muted">No services found in this category</p>
        </div>
      )}
    </div>
  )
}
