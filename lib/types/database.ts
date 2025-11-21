export type Service = {
  id: string
  name: string
  description: string
  duration: number // in minutes
  price: number
  image_url: string | null
  active: boolean
  created_at: string
}

export type Booking = {
  id: string
  client_id: string
  service_id: string
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  deposit_receipt_url: string | null
  created_at: string
}

export type Client = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  hair_info: string | null
  notes: string | null
  created_at: string
}

export type Message = {
  id: string
  booking_id: string
  sender: 'client' | 'admin'
  message: string
  timestamp: string
  read: boolean
}

export type AdminSettings = {
  id: string
  zelle_info: string
  business_hours: Record<string, { start: string; end: string }>
  notification_email: string
  notification_phone: string
  service_area: string
}

export type BlockedTime = {
  id: string
  date: string
  start_time: string
  end_time: string
  reason: string
}
