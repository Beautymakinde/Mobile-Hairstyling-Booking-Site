'use client'

import { useState, useEffect } from 'react'
import { serviceQueries } from '@/lib/supabase/services'
import { storageQueries } from '@/lib/supabase/storage'
import Image from 'next/image'

type Service = {
  id: string
  name: string
  description?: string
  category?: string
  price: number
  duration: number
  active: boolean
  image_url?: string
  image_path?: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const categories = ['all', 'Extensions', 'Braids', 'Weave', 'Others']

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Extensions',
    price: '',
    duration: '',
    active: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const data = await serviceQueries.getAllServices()
      setServices(data as any)
    } catch (error) {
      console.error('Error loading services:', error)
      alert('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory || (!s.category && selectedCategory === 'Others'))

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Extensions': 'badge-primary',
      'Braids': 'badge-secondary',
      'Weave': 'status-confirmed',
      'Others': 'badge-warning'
    }
    return colors[category] || 'badge-primary'
  }

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        description: service.description || '',
        category: service.category || 'Extensions',
        price: service.price.toString(),
        duration: service.duration.toString(),
        active: service.active,
      })
      setImagePreview(service.image_url || '')
    } else {
      setEditingService(null)
      setFormData({
        name: '',
        description: '',
        category: 'Extensions',
        price: '',
        duration: '',
        active: true,
      })
      setImagePreview('')
    }
    setImageFile(null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingService(null)
    setFormData({
      name: '',
      description: '',
      category: 'Extensions',
      price: '',
      duration: '',
      active: true,
    })
    setImageFile(null)
    setImagePreview('')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5242880) {
        alert('File size must be less than 5MB')
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.duration) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setUploading(true)

      let imageUrl = editingService?.image_url
      let imagePath = editingService?.image_path

      // Upload new image if selected
      if (imageFile) {
        // Delete old image if exists
        if (editingService?.image_path) {
          try {
            await storageQueries.deleteServiceImage(editingService.image_path)
          } catch (error) {
            console.error('Error deleting old image:', error)
          }
        }

        // Upload new image
        const serviceId = editingService?.id || `temp-${Date.now()}`
        const uploaded = await storageQueries.uploadServiceImage(serviceId, imageFile)
        imageUrl = uploaded.url
        imagePath = uploaded.path
      }

      const serviceData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        active: formData.active,
        image_url: imageUrl,
        image_path: imagePath,
      }

      if (editingService) {
        await serviceQueries.updateService(editingService.id, serviceData)
      } else {
        await serviceQueries.createService(serviceData as any)
      }

      await loadServices()
      handleCloseModal()
      alert(editingService ? 'Service updated successfully!' : 'Service created successfully!')
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Failed to save service. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete "${service.name}"?`)) {
      return
    }

    try {
      // Delete image if exists
      if (service.image_path) {
        try {
          await storageQueries.deleteServiceImage(service.image_path)
        } catch (error) {
          console.error('Error deleting image:', error)
        }
      }

      await serviceQueries.deleteService(service.id)
      await loadServices()
      alert('Service deleted successfully!')
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
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
          onClick={() => handleOpenModal()}
          className="btn-primary w-full sm:w-auto"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      {/* Stats Cards */}
      {!loading && (
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
            <p className="text-2xl font-bold text-heading mt-1">
              {services.length > 0 ? `$${Math.min(...services.map(s => s.price))} - $${Math.max(...services.map(s => s.price))}` : '$0'}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-body-sm text-muted">Categories</p>
            <p className="text-2xl font-bold text-heading mt-1">4</p>
          </div>
        </div>
      )}

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
              ({cat === 'all' ? services.length : services.filter(s => s.category === cat || (!s.category && cat === 'Others')).length})
            </span>
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-48 w-full" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-6 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="card overflow-hidden hover:shadow-card-hover transition-shadow">
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/20">
                {service.image_url ? (
                  <Image
                    src={service.image_url}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`status ${service.active ? 'status-confirmed' : 'bg-gray-100 text-gray-600'}`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Service Info */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-raleway font-semibold text-heading mb-1">{service.name}</h3>
                  {service.category && (
                    <span className={`badge ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                  )}
                </div>

                {service.description && (
                  <p className="text-body-sm text-muted mb-3 line-clamp-2">{service.description}</p>
                )}

                <div className="flex items-center gap-4 text-body-sm text-muted mb-4">
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
                  <button 
                    onClick={() => handleOpenModal(service)}
                    className="btn-secondary btn-sm flex-1"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(service)}
                    className="btn-ghost btn-sm text-error hover:bg-error/5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <p className="text-muted">No services found in this category</p>
          <button onClick={() => handleOpenModal()} className="btn-primary mt-4">
            Add Your First Service
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-playfair text-h3">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-background rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-body-sm font-semibold text-heading mb-2">
                  Service Image
                </label>
                <div className="space-y-3">
                  {imagePreview && (
                    <div className="relative h-48 w-full rounded-lg overflow-hidden border border-border">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-field"
                  />
                  <p className="text-body-sm text-muted">
                    Upload a service image (max 5MB, JPG/PNG/GIF/WEBP)
                  </p>
                </div>
              </div>

              {/* Service Name */}
              <div>
                <label className="block text-body-sm font-semibold text-heading mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Medium Knotless Braids"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-body-sm font-semibold text-heading mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="Describe this service..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-body-sm font-semibold text-heading mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="Extensions">Extensions</option>
                  <option value="Braids">Braids</option>
                  <option value="Weave">Weave</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm font-semibold text-heading mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                    placeholder="140"
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-semibold text-heading mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="input-field"
                    placeholder="180"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="active" className="text-body-sm font-medium text-heading cursor-pointer">
                  Active (visible to clients)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary flex-1"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={uploading}
                >
                  {uploading ? 'Saving...' : (editingService ? 'Update Service' : 'Create Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
