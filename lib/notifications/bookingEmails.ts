import { sendClientEmail, EMAIL_TEMPLATES } from '../services/emailjs'

interface BookingEmailData {
  clientName: string
  clientEmail: string
  serviceName: string
  servicePrice: number
  date: string
  time: string
  location: string
  zelleEmail?: string
  zellePhone?: string
}

// Send booking confirmation to client
export async function sendBookingConfirmation(data: BookingEmailData): Promise<boolean> {
  try {
    await sendClientEmail(
      data.clientEmail,
      data.clientName,
      EMAIL_TEMPLATES.BOOKING_PENDING,
      {
        client_name: data.clientName,
        service_name: data.serviceName,
        service_price: data.servicePrice,
        booking_date: data.date,
        booking_time: data.time,
        location: data.location,
        zelle_email: data.zelleEmail || 'Layzcentral@gmail.com',
        zelle_phone: data.zellePhone || '(872) 360-4239',
        business_email: 'Layzcentral@gmail.com',
        business_phone: '(872) 360-4239',
      }
    )
    return true
  } catch (error) {
    console.error('Failed to send booking confirmation:', error)
    return false
  }
}

// Send new booking notification to admin
export async function sendAdminBookingNotification(data: BookingEmailData): Promise<boolean> {
  try {
    await sendClientEmail(
      'Layzcentral@gmail.com', // Admin email
      'Admin',
      EMAIL_TEMPLATES.ADMIN_NEW_BOOKING,
      {
        client_name: data.clientName,
        client_email: data.clientEmail,
        service_name: data.serviceName,
        service_price: data.servicePrice,
        booking_date: data.date,
        booking_time: data.time,
        location: data.location,
      }
    )
    return true
  } catch (error) {
    console.error('Failed to send admin notification:', error)
    return false
  }
}

// Simplified email sending for when EmailJS is not configured
// Falls back to console logging
export async function sendSimpleBookingEmails(data: BookingEmailData): Promise<void> {
  console.log('=== Booking Confirmation Email ===')
  console.log(`To: ${data.clientEmail}`)
  console.log(`Subject: Booking Confirmation - ${data.serviceName}`)
  console.log(`
Dear ${data.clientName},

Thank you for your booking request!

Service: ${data.serviceName}
Price: $${data.servicePrice}
Date: ${new Date(data.date).toLocaleDateString()}
Time: ${data.time}
Location: ${data.location}

To confirm your appointment, please send your deposit via Zelle to:
${data.zelleEmail || 'Layzcentral@gmail.com'}
${data.zellePhone || '(872) 360-4239'}

After sending the deposit, please text or email a screenshot of the payment confirmation.

Contact us with any questions:
Email: Layzcentral@gmail.com
Phone: (872) 360-4239

Best regards,
Layz Central
  `)

  console.log('=== Admin Notification Email ===')
  console.log(`To: Layzcentral@gmail.com`)
  console.log(`Subject: New Booking Request - ${data.serviceName}`)
  console.log(`
New booking request received:

Client: ${data.clientName}
Email: ${data.clientEmail}
Service: ${data.serviceName}
Price: $${data.servicePrice}
Date: ${new Date(data.date).toLocaleDateString()}
Time: ${data.time}
Location: ${data.location}

Log in to the admin dashboard to manage this booking.
  `)
}
