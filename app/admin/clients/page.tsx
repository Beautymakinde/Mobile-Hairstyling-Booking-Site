'use client'

import { useEffect, useState } from 'react'
import { clientQueries } from '@/lib/supabase/clients'
import { bookingQueries } from '@/lib/supabase/bookings'
import { Client } from '@/lib/types/database'

interface ClientWithStats extends Client {
  bookingCount?: number
  lastBooking?: string
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientWithStats[]>([])
  const [filteredClients, setFilteredClients] = useState<ClientWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<ClientWithStats | null>(null)
  const [showClientModal, setShowClientModal] = useState(false)

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.phone.includes(term)
      )
      setFilteredClients(filtered)
    }
  }, [searchTerm, clients])

  const loadClients = async () => {
    try {
      setLoading(true)
      const clientsData = await clientQueries.getAllClients()
      
      // Load booking stats for each client
      const clientsWithStats = await Promise.all(
        clientsData.map(async (client) => {
          try {
            const bookings = await bookingQueries.getBookings({ clientId: client.id })
            return {
              ...client,
              bookingCount: bookings.length,
              lastBooking: bookings.length > 0 
                ? new Date(Math.max(...bookings.map(b => new Date(b.created_at).getTime()))).toLocaleDateString()
                : undefined
            }
          } catch {
            return { ...client, bookingCount: 0 }
          }
        })
      )

      setClients(clientsWithStats)
      setFilteredClients(clientsWithStats)
    } catch (error) {
      console.error('Error loading clients:', error)
      alert('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const handleViewClient = (client: ClientWithStats) => {
    setSelectedClient(client)
    setShowClientModal(true)
  }

  const handleUpdateClient = async (id: string, updates: Partial<Client>) => {
    try {
      await clientQueries.updateClient(id, updates)
      await loadClients()
      setShowClientModal(false)
      alert('Client updated successfully')
    } catch (error) {
      console.error('Error updating client:', error)
      alert('Failed to update client')
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary">Client Database</h1>
          <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Back
          </a>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {clients.filter(c => c.lastBooking && new Date(c.lastBooking).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">
                  {clients.reduce((sum, c) => sum + (c.bookingCount || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-secondary"></div>
                <p className="mt-4 text-gray-600">Loading clients...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-600">
                  {searchTerm ? 'No clients found matching your search' : 'No clients yet'}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Booking</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-semibold">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {client.bookingCount || 0} bookings
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.lastBooking || 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewClient(client)}
                          className="text-secondary hover:text-secondary-dark"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Client Detail Modal */}
      {showClientModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Client since {new Date(selectedClient.created_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setShowClientModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href={`mailto:${selectedClient.email}`} className="text-sm text-secondary hover:underline">{selectedClient.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href={`tel:${selectedClient.phone}`} className="text-sm text-secondary hover:underline">{selectedClient.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm text-gray-900">{selectedClient.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hair Info */}
              {selectedClient.hair_info && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hair Information</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedClient.hair_info}</p>
                </div>
              )}

              {/* Notes */}
              {selectedClient.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedClient.notes}</p>
                </div>
              )}

              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedClient.bookingCount || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Last Booking</p>
                    <p className="text-2xl font-bold text-green-900">{selectedClient.lastBooking || 'Never'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowClientModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
