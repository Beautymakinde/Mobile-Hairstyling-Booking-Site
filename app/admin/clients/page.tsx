'use client'

export default function AdminClientsPage() {
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
        <p className="text-gray-600 text-center py-12">Coming soon...</p>
      </div>
    </main>
  )
}
