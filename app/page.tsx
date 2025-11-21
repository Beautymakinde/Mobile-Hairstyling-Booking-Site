'use client'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900">
            Professional Mobile Hairstyling
          </h1>
          <p className="text-xl text-gray-600">
            Book your perfect hair appointment online with ease
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <h2 className="text-2xl font-bold text-primary mb-4">For Clients</h2>
              <p className="text-gray-600 mb-6">
                Browse services, choose your time, and book with confidence
              </p>
              <a
                href="/client/services"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition"
              >
                Book Now
              </a>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <h2 className="text-2xl font-bold text-secondary mb-4">For Stylists</h2>
              <p className="text-gray-600 mb-6">
                Manage your bookings, services, and payments all in one place
              </p>
              <a
                href="/admin/login"
                className="inline-block bg-secondary text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition"
              >
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
