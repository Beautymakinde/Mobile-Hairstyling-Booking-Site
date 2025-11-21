'use client'

import { useState, useEffect } from 'react'
import { serviceQueries } from '@/lib/supabase/services'
import { Service } from '@/lib/types/database'

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    image_url: '',
    active: true,
  })

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const data = await serviceQueries.getAllServices()
      setServices(data)
    } catch (err) {
      console.error('Failed to load services:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        await serviceQueries.updateService(editingId, formData)
      } else {
        await serviceQueries.createService(formData)
      }
      setFormData({
        name: '',
        description: '',
        duration: 30,
        price: 0,
        image_url: '',
        active: true,
      })
      setShowForm(false)
      setEditingId(null)
      await loadServices()
    } catch (err) {
      console.error('Failed to save service:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceQueries.deleteService(id)
        await loadServices()
      } catch (err) {
        console.error('Failed to delete service:', err)
      }
    }
  }

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      image_url: service.image_url || '',
      active: service.active,
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-secondary">Services Management</h1>
            <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            if (showForm) {
              setFormData({
                name: '',
                description: '',
                duration: 30,
                price: 0,
                image_url: '',
                active: true,
              })
            }
          }}
          className="mb-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              <button
                type="submit"
                className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition"
              >
                {editingId ? 'Update Service' : 'Create Service'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-600">No services yet. Create your first service!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    service.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>{service.duration} mins</span>
                  <span className="font-bold text-primary">${service.price.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 bg-secondary text-white py-2 rounded hover:bg-cyan-600 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
