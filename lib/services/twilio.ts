/**
 * Twilio SMS Service Configuration
 * Handles SMS sending for booking notifications and reminders
 * 
 * Setup:
 * 1. Create Twilio account at twilio.com
 * 2. Get Account SID, Auth Token, and Twilio Phone Number
 * 3. Add to .env.local:
 *    - TWILIO_ACCOUNT_SID
 *    - TWILIO_AUTH_TOKEN
 *    - TWILIO_PHONE_NUMBER
 */

// SMS Templates with validation
export const SMS_TEMPLATES = {
  BOOKING_PENDING: 'BOOKING_PENDING',
  BOOKING_CONFIRMED: 'BOOKING_CONFIRMED',
  BOOKING_REJECTED: 'BOOKING_REJECTED',
  APPOINTMENT_REMINDER: 'APPOINTMENT_REMINDER',
  ADMIN_ALERT: 'ADMIN_ALERT',
};

// Validate phone number format (US format: +1XXXXXXXXXX)
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?1?\d{10}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
};

// Format phone number to E.164 format (+1XXXXXXXXXX)
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  } else if (cleaned.length === 11) {
    return `+1${cleaned.slice(1)}`;
  }
  
  return `+1${cleaned.slice(-10)}`;
};

// Generate SMS message from template
export const generateSMSMessage = (
  templateId: string,
  data: Record<string, string>
): string => {
  switch (templateId) {
    case SMS_TEMPLATES.BOOKING_PENDING:
      return `Hi ${data.clientName}, we received your booking for ${data.serviceName}! We'll confirm shortly. Thank you!`;

    case SMS_TEMPLATES.BOOKING_CONFIRMED:
      return `Great! Your ${data.serviceName} booking is confirmed for ${data.date} at ${data.time}. See you then!`;

    case SMS_TEMPLATES.BOOKING_REJECTED:
      return `Sorry, we couldn't confirm your booking. Please contact us at ${data.phone} for more info.`;

    case SMS_TEMPLATES.APPOINTMENT_REMINDER:
      return `Reminder: Your ${data.serviceName} appointment is tomorrow at ${data.time}. See you then!`;

    case SMS_TEMPLATES.ADMIN_ALERT:
      return `New booking from ${data.clientName} for ${data.serviceName} on ${data.date} at ${data.time}. Check your dashboard.`;

    default:
      return 'Notification from HairStyle Booking';
  }
};

// Send SMS via API (client-side calls API route)
export const sendSMS = async (
  phoneNumber: string,
  templateId: string,
  templateData: Record<string, string>
) => {
  try {
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      return { success: false, error: 'Invalid phone number format' };
    }

    // Call API route to send SMS
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: formatPhoneNumber(phoneNumber),
        templateId,
        templateData,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send SMS');
    }

    return { success: true, messageSid: result.messageSid };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: String(error) };
  }
};

// Batch SMS sending
export const sendBatchSMS = async (
  recipients: Array<{ phone: string; templateId: string; data: Record<string, string> }>
) => {
  const results = await Promise.allSettled(
    recipients.map((item) => sendSMS(item.phone, item.templateId, item.data))
  );

  return {
    total: results.length,
    succeeded: results.filter((r) => r.status === 'fulfilled').length,
    failed: results.filter((r) => r.status === 'rejected').length,
    results,
  };
};

// Get formatted SMS preview (for testing)
export const getSMSPreview = (
  templateId: string,
  templateData: Record<string, string>
): string => {
  return generateSMSMessage(templateId, templateData);
};
