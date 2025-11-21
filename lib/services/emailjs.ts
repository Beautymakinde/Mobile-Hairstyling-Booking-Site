import emailjs from '@emailjs/browser';

// Initialize EmailJS (should be called once on app startup)
export const initializeEmailJS = () => {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  
  if (!publicKey) {
    console.error('EmailJS public key not configured');
    return false;
  }

  try {
    emailjs.init(publicKey);
    return true;
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    return false;
  }
};

// EmailJS Template IDs (configure these after creating templates)
export const EMAIL_TEMPLATES = {
  BOOKING_PENDING: 'template_booking_pending',      // Sent to client when booking submitted
  BOOKING_CONFIRMED: 'template_booking_confirmed',  // Sent to client when admin approves
  BOOKING_REJECTED: 'template_booking_rejected',    // Sent to client when rejected
  APPOINTMENT_REMINDER: 'template_reminder',        // Sent 24 hours before appointment
  ADMIN_NEW_BOOKING: 'template_admin_new',          // Sent to admin when new booking
  ADMIN_APPROVED: 'template_admin_approved',        // Sent to admin when approved
};

// Service and User IDs (from EmailJS dashboard)
export const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_default',
  USER_ID: process.env.NEXT_PUBLIC_EMAILJS_USER_ID || 'user_default',
};

// Email sending function for client notifications
export const sendClientEmail = async (
  clientEmail: string,
  clientName: string,
  templateId: string,
  templateData: Record<string, any>
) => {
  try {
    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      templateId,
      {
        to_email: clientEmail,
        to_name: clientName,
        ...templateData,
      },
      EMAILJS_CONFIG.USER_ID
    );

    console.log('Email sent successfully:', result.status);
    return { success: true, messageId: result.response };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: String(error) };
  }
};

// Email sending function for admin notifications
export const sendAdminEmail = async (
  templateId: string,
  templateData: Record<string, any>
) => {
  try {
    // Get admin email from environment or settings
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@hairstyling.local';
    const adminName = 'Admin';

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      templateId,
      {
        to_email: adminEmail,
        to_name: adminName,
        ...templateData,
      },
      EMAILJS_CONFIG.USER_ID
    );

    console.log('Admin email sent successfully:', result.status);
    return { success: true, messageId: result.response };
  } catch (error) {
    console.error('Failed to send admin email:', error);
    return { success: false, error: String(error) };
  }
};

// Batch email sending (for multiple recipients)
export const sendBatchEmails = async (
  emails: Array<{ email: string; name: string; templateId: string; data: Record<string, any> }>
) => {
  const results = await Promise.allSettled(
    emails.map((item) =>
      sendClientEmail(item.email, item.name, item.templateId, item.data)
    )
  );

  return {
    total: results.length,
    succeeded: results.filter((r) => r.status === 'fulfilled').length,
    failed: results.filter((r) => r.status === 'rejected').length,
    results,
  };
};
