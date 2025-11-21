import { NextRequest, NextResponse } from 'next/server';
import { generateSMSMessage } from '@/lib/services/twilio';

/**
 * POST /api/send-sms
 * 
 * Sends SMS notifications via Twilio
 * 
 * Request body:
 * {
 *   phoneNumber: string (E.164 format: +1XXXXXXXXXX),
 *   templateId: 'BOOKING_PENDING' | 'BOOKING_CONFIRMED' | 'BOOKING_REJECTED' | 'APPOINTMENT_REMINDER' | 'ADMIN_ALERT',
 *   templateData: {
 *     clientName: string,
 *     serviceName: string,
 *     date: string,
 *     time: string,
 *     phone?: string
 *   }
 * }
 */

export async function POST(request: NextRequest) {
  try {
    // Verify request comes from same origin
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (origin && !origin.includes(host || 'localhost')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { phoneNumber, templateId, templateData } = body;

    // Validate required fields
    if (!phoneNumber || !templateId || !templateData) {
      return NextResponse.json(
        { error: 'Missing required fields: phoneNumber, templateId, templateData' },
        { status: 400 }
      );
    }

    // Validate phone number format (E.164)
    const phoneRegex = /^\+1\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Expected: +1XXXXXXXXXX' },
        { status: 400 }
      );
    }

    // Generate message from template
    const message = generateSMSMessage(templateId, templateData);

    if (!message) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    // Validate message length (SMS max 160 characters, or 1600 for multiple segments)
    if (message.length > 1600) {
      return NextResponse.json(
        { error: 'Message too long' },
        { status: 400 }
      );
    }

    // In production, this would call Twilio API
    // For now, we'll log the SMS and return success
    console.log('SMS to send:', {
      to: phoneNumber,
      message,
      templateId,
      templateData,
      timestamp: new Date().toISOString(),
      segments: Math.ceil(message.length / 160),
    });

    // Simulate sending with delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json(
      {
        success: true,
        messageSid: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'SMS queued for sending',
        to: phoneNumber,
        template: templateId,
        messageLength: message.length,
        segments: Math.ceil(message.length / 160),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('SMS API error:', error);
    return NextResponse.json(
      { error: 'Failed to send SMS', details: String(error) },
      { status: 500 }
    );
  }
}
