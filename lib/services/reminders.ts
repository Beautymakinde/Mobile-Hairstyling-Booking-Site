import { bookingQueries } from '@/lib/supabase/bookings';
import { clientQueries } from '@/lib/supabase/clients';
import { serviceQueries } from '@/lib/supabase/services';

/**
 * Appointment Reminder Service
 * 
 * Sends email and SMS reminders 24 hours before appointments
 * 
 * Usage:
 * - Call this function in a scheduled job (cron)
 * - Can be triggered via: /api/cron/send-reminders
 */

export async function sendAppointmentReminders() {
  try {
    // Get all confirmed bookings for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    console.log(`[Reminders] Checking for appointments on ${tomorrowStr}`);

    // Get bookings for tomorrow with status 'confirmed'
    const bookings = await bookingQueries.getBookings({
      status: 'confirmed',
    });

    const tomorrowBookings = bookings.filter(
      (booking) => booking.date === tomorrowStr
    );

    console.log(`[Reminders] Found ${tomorrowBookings.length} appointments for tomorrow`);

    let emailsSent = 0;
    let smsSent = 0;
    let errors: string[] = [];

    // Send reminders for each booking
    for (const booking of tomorrowBookings) {
      try {
        // Get client details
        const client = await clientQueries.getClient(booking.client_id);
        if (!client) continue;

        // Get service details
        const service = await serviceQueries.getService(booking.service_id);
        if (!service) continue;

        // Send email reminder
        if (client.email) {
          try {
            const emailData = {
              clientName: client.name,
              serviceName: service.name,
              date: booking.date,
              time: booking.start_time,
              bookingId: booking.id,
            };

            const emailResponse = await fetch(
              `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  clientEmail: client.email,
                  clientName: client.name,
                  templateType: 'appointment_reminder',
                  templateData: emailData,
                }),
              }
            );

            if (emailResponse.ok) {
              emailsSent++;
            } else {
              errors.push(`Email failed for ${client.email}: ${emailResponse.statusText}`);
            }
          } catch (err) {
            errors.push(`Email error for ${client.email}: ${String(err)}`);
          }
        }

        // Send SMS reminder
        if (client.phone) {
          try {
            const smsData = {
              clientName: client.name,
              serviceName: service.name,
              date: booking.date,
              time: booking.start_time,
            };

            const smsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-sms`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  phoneNumber: client.phone,
                  templateId: 'APPOINTMENT_REMINDER',
                  templateData: smsData,
                }),
              }
            );

            if (smsResponse.ok) {
              smsSent++;
            } else {
              errors.push(`SMS failed for ${client.phone}: ${smsResponse.statusText}`);
            }
          } catch (err) {
            errors.push(`SMS error for ${client.phone}: ${String(err)}`);
          }
        }
      } catch (err) {
        errors.push(`Processing error for booking ${booking.id}: ${String(err)}`);
      }
    }

    console.log(`[Reminders] Sent ${emailsSent} emails and ${smsSent} SMS messages`);

    if (errors.length > 0) {
      console.error('[Reminders] Errors:', errors);
    }

    return {
      success: true,
      date: tomorrowStr,
      bookingsFound: tomorrowBookings.length,
      emailsSent,
      smsSent,
      errors,
    };
  } catch (err) {
    console.error('[Reminders] Fatal error:', err);
    return {
      success: false,
      error: String(err),
    };
  }
}

/**
 * Mark booking as completed after appointment
 * Useful for automatic status updates
 */
export async function markCompletedAppointments() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    const bookings = await bookingQueries.getBookings({
      status: 'confirmed',
    });

    let completed = 0;

    for (const booking of bookings) {
      // Check if booking is in the past
      if (
        booking.date < today ||
        (booking.date === today && booking.end_time <= currentTime)
      ) {
        await bookingQueries.updateBookingStatus(booking.id, 'completed');
        completed++;
      }
    }

    console.log(`[Completed] Marked ${completed} bookings as completed`);

    return {
      success: true,
      completed,
    };
  } catch (err) {
    console.error('[Completed] Error:', err);
    return {
      success: false,
      error: String(err),
    };
  }
}
