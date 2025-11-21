// SMS notification templates
// Uses Twilio - https://www.twilio.com/

export const smsTemplates = {
  // Client booking confirmation
  bookingConfirmation: (clientName: string, serviceName: string, dateTime: string) => 
    `Hi ${clientName}! Your booking for ${serviceName} on ${dateTime} has been confirmed. Reply STOP to unsubscribe.`,

  // Client booking pending approval
  bookingPending: (clientName: string) => 
    `Hi ${clientName}! We received your booking request. We'll confirm shortly after verifying your deposit.`,

  // Appointment reminder (24 hours before)
  appointmentReminder: (serviceName: string, dateTime: string) => 
    `Reminder: Your ${serviceName} appointment is tomorrow at ${dateTime}. Reply with any questions!`,

  // Client booking rejected
  bookingRejected: (clientName: string, serviceName: string) => 
    `Hi ${clientName}, we were unable to process your ${serviceName} booking. Please contact us to reschedule.`,

  // Admin alert - new booking
  adminNewBooking: (clientName: string, serviceName: string) => 
    `New booking from ${clientName} for ${serviceName}. Check your dashboard to approve.`,
}

export const smsService = {
  // Format time for SMS (shorter format)
  formatTimeForSMS: (date: string, time: string): string => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  // Send SMS using Twilio
  sendSMS: async (toPhone: string, message: string) => {
    // This requires Twilio setup with backend API
    // Frontend would call an API endpoint
    return new Promise((resolve) => {
      console.log(`SMS sent to ${toPhone}:`, message)
      resolve(true)
    })
  },

  // Validate phone number format
  validatePhoneNumber: (phone: string): boolean => {
    // Basic validation for US phone numbers
    const phoneRegex = /^\+?1?\d{10}$/
    return phoneRegex.test(phone.replace(/[^\d+]/g, ''))
  },
}
