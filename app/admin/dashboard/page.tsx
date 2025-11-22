'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayBookings: 0,
    pendingBookings: 0,
    totalClients: 0,
    monthRevenue: 0,
  })

  const [recentBookings, setRecentBookings] = useState<any[]>([])

  useEffect(() => {
    // TODO: Load actual data from Supabase
    setStats({
      todayBookings: 3,
      pendingBookings: 5,
      totalClients: 24,
      monthRevenue: 3240,
    })

    setRecentBookings([
      { id: 1, client: 'Sarah Johnson', service: 'Knotless Braids', time: '10:00 AM', status: 'confirmed' },
      { id: 2, client: 'Maria Garcia', service: 'Quickweave', time: '2:30 PM', status: 'pending' },
      { id: 3, client: 'Aisha Williams', service: 'Fulani Braids', time: '5:00 PM', status: 'confirmed' },
    ])
  }, [])

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-heading mb-2">Dashboard</h1>
        <p className="text-body text-muted">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Bookings */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="badge badge-success">{stats.todayBookings > 0 ? '+' : ''}{stats.todayBookings}</span>
          </div>
          <div>
            <p className="text-3xl font-playfair font-bold text-heading mb-1">{stats.todayBookings}</p>
            <p className="text-body-sm text-muted">Today&apos;s Appointments</p>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="badge badge-warning">Action Needed</span>
          </div>
          <div>
            <p className="text-3xl font-playfair font-bold text-heading mb-1">{stats.pendingBookings}</p>
            <p className="text-body-sm text-muted">Pending Bookings</p>
          </div>
        </div>

        {/* Total Clients */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-3xl font-playfair font-bold text-heading mb-1">{stats.totalClients}</p>
            <p className="text-body-sm text-muted">Total Clients</p>
          </div>
        </div>

        {/* Month Revenue */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-3xl font-playfair font-bold text-heading mb-1">${stats.monthRevenue.toLocaleString()}</p>
            <p className="text-body-sm text-muted">This Month&apos;s Revenue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/bookings" className="card-interactive">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-raleway font-semibold text-heading mb-1">Manage Bookings</h3>
              <p className="text-body-sm text-muted">View and update appointments</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/services" className="card-interactive">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-raleway font-semibold text-heading mb-1">Services & Pricing</h3>
              <p className="text-body-sm text-muted">Update your service catalog</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/calendar" className="card-interactive">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-raleway font-semibold text-heading mb-1">Calendar View</h3>
              <p className="text-body-sm text-muted">See your schedule at a glance</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h3 font-playfair text-heading">Today&apos;s Appointments</h2>
          <Link href="/admin/bookings" className="btn-ghost btn-sm">
            View All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-body text-muted">No appointments scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                booking.status === 'confirmed' ? 'border-success bg-success/5' : 'border-warning bg-warning/5'
              }`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">{booking.client.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-raleway font-semibold text-heading">{booking.client}</h4>
                    <p className="text-body-sm text-muted">{booking.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-raleway font-medium text-heading">{booking.time}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-badge font-semibold uppercase ${
                      booking.status === 'confirmed' ? 'status-confirmed' : 'status-pending'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <button className="btn-ghost btn-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
