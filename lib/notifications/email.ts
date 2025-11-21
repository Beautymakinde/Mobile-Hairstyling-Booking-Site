// Email notification templates and service
// Uses EmailJS - https://www.emailjs.com/

export const emailTemplates = {
  // Client confirmation email
  bookingConfirmation: (clientName: string, serviceName: string, dateTime: string, bookingId: string) => ({
    subject: `Booking Confirmation - ${serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ec4899;">Booking Confirmed!</h2>
        <p>Hi ${clientName},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date & Time:</strong> ${dateTime}</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
        </div>
        
        <p>Please arrive 5-10 minutes early. If you need to reschedule, please let us know as soon as possible.</p>
        
        <p>Thank you for booking with us!</p>
        <p style="color: #666;">Best regards,<br>Your Hairstylist</p>
      </div>
    `,
  }),

  // Client pending approval email
  bookingPending: (clientName: string, serviceName: string, dateTime: string) => ({
    subject: `Booking Submitted - Awaiting Confirmation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Booking Received!</h2>
        <p>Hi ${clientName},</p>
        <p>We've received your booking request. We're reviewing your deposit and will confirm your appointment shortly.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Requested Date & Time:</strong> ${dateTime}</p>
        </div>
        
        <p>You'll receive a confirmation email once we've verified your payment.</p>
        <p style="color: #666;">Thank you for your patience!</p>
      </div>
    `,
  }),

  // Client appointment reminder
  appointmentReminder: (clientName: string, serviceName: string, dateTime: string, address: string) => ({
    subject: `Reminder: Your appointment is tomorrow`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ec4899;">Appointment Reminder</h2>
        <p>Hi ${clientName},</p>
        <p>This is a friendly reminder about your upcoming appointment tomorrow!</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date & Time:</strong> ${dateTime}</p>
          <p><strong>Location:</strong> ${address}</p>
        </div>
        
        <p>Please arrive 5-10 minutes early. If you need to cancel or reschedule, please let us know as soon as possible.</p>
        <p style="color: #666;">Looking forward to seeing you!</p>
      </div>
    `,
  }),

  // Admin new booking alert
  adminNewBooking: (clientName: string, clientEmail: string, serviceName: string, dateTime: string, phone: string) => ({
    subject: `New Booking Submitted - ${clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">New Booking Received</h2>
        <p>You have a new booking request!</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Requested Date & Time:</strong> ${dateTime}</p>
        </div>
        
        <p>Please review the receipt and approve or reject the booking in your admin dashboard.</p>
        <p style="color: #666;">Visit your dashboard to manage this booking.</p>
      </div>
    `,
  }),

  // Admin booking approved notification
  adminBookingApproved: (clientName: string, serviceName: string, dateTime: string) => ({
    subject: `Booking Approved - ${clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">Booking Approved</h2>
        <p>The following booking has been approved:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date & Time:</strong> ${dateTime}</p>
        </div>
        
        <p>The client has been notified.</p>
      </div>
    `,
  }),
}

export const notificationService = {
  // Helper to format date and time
  formatDateTime: (date: string, time: string): string => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  // Initialize EmailJS (call once on app startup)
  initEmailJS: () => {
    if (typeof window !== 'undefined') {
      // This would be called in a useEffect or at app startup
      // emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)
    }
  },

  // Send email using EmailJS
  sendEmail: async (to: string, subject: string, _html?: string, _adminEmail?: string) => {
    // This requires EmailJS setup
    // For now, returns a promise that could be implemented
    return new Promise((resolve) => {
      // Implementation would go here
      console.log(`Email sent to ${to}:`, subject)
      resolve(true)
    })
  },
}
