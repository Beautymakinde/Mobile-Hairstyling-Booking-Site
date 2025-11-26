# Google Calendar Integration Setup

Your admin calendar now supports synchronization with Google Calendar! Follow these steps to set it up.

## Features

- Visual month calendar showing all bookings
- One-click sync to push confirmed bookings to your Google Calendar
- Automatic reminders (24-hour email + 30-minute popup)
- View bookings by date with detailed information

## Setup Instructions

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it (e.g., "Hair Salon Bookings")
4. Click "Create"

### 2. Enable Google Calendar API

1. In your new project, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click on it and press **Enable**

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure OAuth consent screen:
   - User Type: **External** (unless you have Google Workspace)
   - App name: Your business name
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `.../auth/calendar.events` (should auto-configure)
   - Test users: Add your Gmail address
   - Click **Save and Continue**

4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: "Hair Salon Admin"
   - Authorized redirect URIs: Add these URLs:
     - `http://localhost:3000/admin/calendar/callback` (for local development)
     - `https://yourdomain.com/admin/calendar/callback` (replace with your actual domain)
   - Click **Create**

5. **Copy your Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)

### 4. Configure Environment Variables

1. Open `.env.local` in your project root
2. Add your Google Client ID:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
3. Save the file
4. Restart your development server: `npm run dev`

### 5. Test the Integration

1. Go to **Admin** → **Calendar**
2. Click **Connect Google Calendar**
3. Sign in with your Gmail account
4. Grant permissions to access your calendar
5. You'll be redirected back to the calendar
6. Click on a date with a confirmed booking
7. Click **Sync to Google** to add it to your calendar
8. Check your Google Calendar to verify!

## Usage

### Connecting Your Calendar

1. Navigate to the admin calendar page
2. Click "Connect Google Calendar"
3. Authorize with your Google account
4. Once connected, the button will change to "Disconnect"

### Syncing Bookings

1. Click on any date in the calendar
2. You'll see all bookings for that day in the sidebar
3. For confirmed bookings, click "Sync to Google"
4. The appointment will be added to your Google Calendar with:
   - Client name and details
   - Correct date and time
   - Email reminder (24 hours before)
   - Popup reminder (30 minutes before)

### Calendar Features

- **Month Navigation**: Use Previous/Next or "Today" button
- **Booking Indicators**: Dots appear on dates with bookings
- **Date Selection**: Click any date to see its bookings
- **Status Badges**: Visual indication of booking status (pending/confirmed/completed)
- **Quick Actions**: Sync confirmed bookings with one click

## Troubleshooting

### "Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID"

- Make sure you added the Client ID to `.env.local`
- Restart your dev server after adding it

### "Failed to sync"

- Your Google Calendar token may have expired
- Click "Disconnect" then "Connect Google Calendar" again

### OAuth Consent Screen Verification

- For testing, add your email as a test user in Google Cloud Console
- For production, submit your app for verification (if needed)

### Wrong Redirect URI Error

- Make sure the redirect URI in Google Cloud Console exactly matches:
  - Local: `http://localhost:3000/admin/calendar/callback`
  - Production: `https://yourdomain.com/admin/calendar/callback`

## Production Deployment

Before deploying to production:

1. Add your production domain to authorized redirect URIs in Google Cloud Console
2. Add the `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to your hosting platform's environment variables (e.g., Vercel)
3. Test the OAuth flow on your production domain
4. If using a custom domain, update all redirect URIs accordingly

## Security Notes

- Access tokens are stored in browser localStorage
- Tokens expire after some time (automatic by Google)
- Users need to reconnect when tokens expire
- Each admin user connects their own Google Calendar
- Only confirmed bookings can be synced

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Google Calendar API is enabled in Google Cloud Console
4. Check that redirect URIs match exactly

---

**That's it!** Your calendar is now integrated with Google Calendar. 🎉
