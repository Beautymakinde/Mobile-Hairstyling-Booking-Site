import { NextRequest, NextResponse } from 'next/server';
import { sendAppointmentReminders, markCompletedAppointments } from '@/lib/services/reminders';

/**
 * GET /api/cron/send-reminders
 * 
 * Sends appointment reminders (24 hours before)
 * 
 * This endpoint should be called by an external cron service:
 * - Vercel Cron (RECOMMENDED): https://vercel.com/docs/cron-jobs
 * - AWS Lambda with CloudWatch Events
 * - Google Cloud Scheduler
 * - Custom cron server (curl to this endpoint)
 * 
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/send-reminders",
 *     "schedule": "0 8 * * *"
 *   }]
 * }
 */

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret token (prevent unauthorized access)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Send reminders
    const reminderResult = await sendAppointmentReminders();

    // Also check for completed appointments
    const completedResult = await markCompletedAppointments();

    console.log('Cron job executed:', {
      reminders: reminderResult,
      completed: completedResult,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        reminders: reminderResult,
        completed: completedResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cron/send-reminders
 * 
 * Manual trigger (for testing or immediate execution)
 */

export async function POST(request: NextRequest) {
  try {
    // Verify request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Send reminders
    const reminderResult = await sendAppointmentReminders();

    // Also check for completed appointments
    const completedResult = await markCompletedAppointments();

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        reminders: reminderResult,
        completed: completedResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
