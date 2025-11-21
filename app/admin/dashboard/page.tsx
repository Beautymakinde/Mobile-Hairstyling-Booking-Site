'use client'

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary">Admin Dashboard</h1>
          <a href="/admin/login" className="text-gray-600 hover:text-gray-900">
            Logout
          </a>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Today's Appointments</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Pending Bookings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Clients</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">This Month Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">$0</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <a
            href="/admin/services"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">Services</h2>
            <p className="text-gray-600 text-sm">Manage your services and pricing</p>
          </a>

          <a
            href="/admin/bookings"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">Bookings</h2>
            <p className="text-gray-600 text-sm">View and manage all bookings</p>
          </a>

          <a
            href="/admin/calendar"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">Calendar</h2>
            <p className="text-gray-600 text-sm">View your schedule and availability</p>
          </a>

          <a
            href="/admin/clients"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">Clients</h2>
            <p className="text-gray-600 text-sm">View your client database</p>
          </a>

          <a
            href="/admin/messages"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">Messages</h2>
            <p className="text-gray-600 text-sm">Communicate with clients</p>
          </a>

          <a
            href="/admin/settings"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600 text-sm">Configure business settings</p>
          </a>
        </div>
      </div>
    </main>
  )
}
