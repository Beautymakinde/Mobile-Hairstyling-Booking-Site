#!/bin/bash

# Phase 3 Part 2: Email & SMS Notification Setup Guide
# This script provides step-by-step setup instructions

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Phase 3 Part 2: Email & SMS Notification Configuration       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# EmailJS Setup
echo "STEP 1: SET UP EMAILJS"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "1. Go to: https://www.emailjs.com/"
echo "2. Sign up for a FREE account"
echo "3. Verify your email address"
echo "4. Go to: Dashboard → Email Services"
echo "5. Click: Add Service"
echo "6. Choose your email provider (Gmail recommended)"
echo "7. Connect your email account"
echo "8. Copy your Service ID"
echo ""
echo "9. Go to: Dashboard → Email Templates"
echo "10. Create 6 new templates with IDs:"
echo "    - template_booking_pending"
echo "    - template_booking_confirmed"
echo "    - template_booking_rejected"
echo "    - template_reminder"
echo "    - template_admin_new"
echo "    - template_admin_approved"
echo ""
echo "11. Go to: Dashboard → Account → API"
echo "12. Copy: Public Key, Service ID, User ID"
echo ""
echo "ENTER YOUR EMAILJS CREDENTIALS:"
read -p "  Public Key: " EMAILJS_PUBLIC_KEY
read -p "  Service ID: " EMAILJS_SERVICE_ID
read -p "  User ID: " EMAILJS_USER_ID
read -p "  Admin Email: " ADMIN_EMAIL
echo ""

# Twilio Setup
echo "STEP 2: SET UP TWILIO"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "1. Go to: https://www.twilio.com/"
echo "2. Sign up (free trial with $15 credit)"
echo "3. Verify your phone number"
echo "4. Go to: Console → Phone Numbers → Buy a Number"
echo "5. Choose a US number with SMS capability"
echo "6. Copy the phone number (e.g., +15551234567)"
echo "7. Go to: Console → Account Info"
echo "8. Copy: Account SID, Auth Token"
echo ""
echo "ENTER YOUR TWILIO CREDENTIALS:"
read -p "  Account SID: " TWILIO_ACCOUNT_SID
read -p "  Auth Token: " TWILIO_AUTH_TOKEN
read -p "  Twilio Phone: " TWILIO_PHONE_NUMBER
read -p "  Admin Phone (e.g., +12125551234): " ADMIN_PHONE
echo ""

# Cron Secret
echo "STEP 3: GENERATE CRON SECRET"
echo "─────────────────────────────────────────────────────────────────"
CRON_SECRET=$(openssl rand -hex 32)
echo "Generated Cron Secret: $CRON_SECRET"
echo ""

# Create .env.local
echo "STEP 4: UPDATE .env.local"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "Creating .env.local with your credentials..."
echo ""

cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=$EMAILJS_PUBLIC_KEY
NEXT_PUBLIC_EMAILJS_SERVICE_ID=$EMAILJS_SERVICE_ID
NEXT_PUBLIC_EMAILJS_USER_ID=$EMAILJS_USER_ID
NEXT_PUBLIC_ADMIN_EMAIL=$ADMIN_EMAIL

# Twilio
TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN
NEXT_PUBLIC_TWILIO_PHONE_NUMBER=$TWILIO_PHONE_NUMBER
NEXT_PUBLIC_ADMIN_PHONE=$ADMIN_PHONE

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security
CRON_SECRET=$CRON_SECRET
EOF

echo "✅ .env.local created"
echo ""

# Testing
echo "STEP 5: TEST YOUR SETUP"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "Run the development server:"
echo "  npm run dev"
echo ""
echo "Then test endpoints:"
echo ""
echo "Test Email:"
echo "  curl -X POST http://localhost:3000/api/send-email \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"clientEmail\":\"test@example.com\",\"clientName\":\"Test\",\"templateType\":\"booking_pending\",\"templateData\":{\"serviceName\":\"Test\",\"date\":\"2025-12-15\",\"time\":\"14:00\",\"bookingId\":\"test\"}}'"
echo ""
echo "Test SMS:"
echo "  curl -X POST http://localhost:3000/api/send-sms \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"phoneNumber\":\"+12125551234\",\"templateId\":\"BOOKING_PENDING\",\"templateData\":{\"clientName\":\"Test\",\"serviceName\":\"Test\",\"date\":\"2025-12-15\",\"time\":\"14:00\"}}'"
echo ""
echo "Test Reminders:"
echo "  curl -X GET http://localhost:3000/api/cron/send-reminders \\"
echo "    -H 'Authorization: Bearer $CRON_SECRET'"
echo ""

# Deployment
echo "STEP 6: DEPLOY TO VERCEL"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "1. Push code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Phase 3 Part 2: Email & SMS Integration'"
echo "   git push origin main"
echo ""
echo "2. Go to: https://vercel.com"
echo "3. Import your GitHub repository"
echo "4. Add environment variables (from .env.local)"
echo "5. Deploy"
echo ""
echo "6. Enable Cron Jobs:"
echo "   - Create vercel.json (included in project)"
echo "   - Add to git: git add vercel.json && git commit && git push"
echo ""

# Completion
echo "✅ SETUP COMPLETE!"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "Summary of what's been set up:"
echo "  ✓ EmailJS for email notifications"
echo "  ✓ Twilio for SMS notifications"
echo "  ✓ Appointment reminders (24-hour before)"
echo "  ✓ Booking confirmations"
echo "  ✓ Admin notifications"
echo "  ✓ Rejection notifications"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start development"
echo "  2. Test booking flow to verify emails/SMS send"
echo "  3. Deploy to Vercel"
echo "  4. Configure cron jobs"
echo ""
echo "For more details, see: PHASE3_PART2_COMPLETE.md"
echo ""
