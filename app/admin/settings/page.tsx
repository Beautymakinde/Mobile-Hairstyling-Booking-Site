'use client'

import { useState, useEffect } from 'react'
import { settingsQueries } from '@/lib/supabase/settings'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [formData, setFormData] = useState({
    zelle_email: '',
    zelle_phone: '',
    business_hours: JSON.stringify({
      Monday: { start: '09:00', end: '17:00' },
      Tuesday: { start: '09:00', end: '17:00' },
      Wednesday: { start: '09:00', end: '17:00' },
      Thursday: { start: '09:00', end: '17:00' },
      Friday: { start: '09:00', end: '17:00' },
      Saturday: { start: '10:00', end: '15:00' },
      Sunday: { start: 'Closed', end: 'Closed' },
    }),
    notification_email: '',
    notification_phone: '',
    service_area: '',
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await settingsQueries.getSettings()
      if (data) {
        setSettings(data)
        setFormData({
          zelle_email: data.zelle_info?.email || '',
          zelle_phone: data.zelle_info?.phone || '',
          business_hours: typeof data.business_hours === 'string' 
            ? data.business_hours 
            : JSON.stringify(data.business_hours),
          notification_email: data.notification_email || '',
          notification_phone: data.notification_phone || '',
          service_area: data.service_area || '',
        })
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      await settingsQueries.upsertSettings({
        zelle_info: {
          email: formData.zelle_email,
          phone: formData.zelle_phone,
        },
        business_hours: JSON.parse(formData.business_hours),
        notification_email: formData.notification_email,
        notification_phone: formData.notification_phone,
        service_area: formData.service_area,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      await loadSettings()
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <p className="text-center text-gray-600 py-12">Loading settings...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary">Business Settings</h1>
          <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Back
          </a>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              ✓ Settings saved successfully!
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Zelle Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zelle Email Address
                </label>
                <input
                  type="email"
                  value={formData.zelle_email}
                  onChange={(e) => setFormData({ ...formData, zelle_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zelle Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.zelle_phone}
                  onChange={(e) => setFormData({ ...formData, zelle_phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Business Contact</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Email
                </label>
                <input
                  type="email"
                  value={formData.notification_email}
                  onChange={(e) => setFormData({ ...formData, notification_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="notifications@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.notification_phone}
                  onChange={(e) => setFormData({ ...formData, notification_phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Service Area</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Area / Travel Radius
              </label>
              <input
                type="text"
                value={formData.service_area}
                onChange={(e) => setFormData({ ...formData, service_area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="e.g., Within 15 miles of downtown"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">Note:</h3>
          <p className="text-sm text-blue-800">
            These settings will be displayed to clients when they book appointments. Make sure to update your Zelle information so clients know where to send deposits.
          </p>
        </div>
      </div>
    </main>
  )
}

