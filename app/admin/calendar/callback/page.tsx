'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GoogleCalendarCallback() {
  const router = useRouter()

  useEffect(() => {
    // Extract access token from URL hash
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')

    if (accessToken) {
      // Store token in localStorage
      localStorage.setItem('google_calendar_token', accessToken)
      
      // Redirect back to calendar
      router.push('/admin/calendar')
    } else {
      // Handle error
      alert('Failed to connect Google Calendar. Please try again.')
      router.push('/admin/calendar')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-heading font-raleway">Connecting Google Calendar...</p>
      </div>
    </div>
  )
}
