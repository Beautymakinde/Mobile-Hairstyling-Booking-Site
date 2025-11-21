import { NextRequest, NextResponse } from 'next/server';
import { emailTemplates } from '@/lib/notifications/email';

/**
 * POST /api/send-email
 * 
 * Sends email notifications via EmailJS
 * 
 * Request body:
 * {
 *   clientEmail: string,
 *   clientName: string,
 *   templateType: 'booking_pending' | 'booking_confirmed' | 'appointment_reminder' | 'admin_new_booking' | 'admin_approved',
 *   templateData: {
 *     serviceName: string,
 *     date: string,
 *     time: string,
 *     price?: number,
 *     bookingId?: string,
 *     receiptUrl?: string
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
    const {
      clientEmail,
      clientName,
      templateType,
      templateData,
      _isAdmin = false,
    } = body;

    // Validate required fields
    if (!clientEmail || !templateType || !templateData) {
      return NextResponse.json(
        { error: 'Missing required fields: clientEmail, templateType, templateData' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get email template
    const template = emailTemplates[templateType];
    if (!template) {
      return NextResponse.json(
        { error: 'Invalid template type' },
        { status: 400 }
      );
    }

    // In production, this would call EmailJS API
    // For now, we'll log the email and return success
    console.log('Email to send:', {
      to: clientEmail,
      name: clientName,
      template: templateType,
      data: templateData,
      timestamp: new Date().toISOString(),
    });

    // Simulate sending with delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json(
      {
        success: true,
        messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Email queued for sending',
        to: clientEmail,
        templateType,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: String(error) },
      { status: 500 }
    );
  }
}
