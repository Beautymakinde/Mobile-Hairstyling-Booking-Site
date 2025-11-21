# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Git

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase project settings.

### 3. Set Up Supabase Database

Run the following SQL in your Supabase SQL editor to create the necessary tables:

```sql
-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  hair_info TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id),
  service_id UUID NOT NULL REFERENCES services(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  deposit_receipt_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blocked times table
CREATE TABLE blocked_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);

-- Admin settings table
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zelle_info TEXT,
  business_hours JSONB,
  notification_email TEXT,
  notification_phone TEXT,
  service_area TEXT
);
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

## Folder Structure

- `/app` - Next.js app router pages
  - `/client` - Customer-facing pages (services, booking)
  - `/admin` - Admin dashboard pages
- `/lib` - Utility functions and Supabase queries
  - `/supabase` - Database query functions
  - `/types` - TypeScript types
  - `/utils` - Helper functions
- `/components` - Reusable React components
- `/styles` - Global and component styles
- `/public` - Static assets

## Current Phase 1 Implementation

### Client Side
✅ Homepage with CTAs
✅ Services listing page
✅ Multi-step booking flow:
  - Service selection
  - Date & time selection with calendar
  - Client information form
  - Payment instructions
  - Receipt upload
  - Confirmation page

### Admin Side
✅ Login page (stub)
✅ Dashboard overview
✅ Services management (CRUD)
✅ Placeholder pages for:
  - Bookings
  - Calendar
  - Clients
  - Messages
  - Settings

## Next Steps

### Phase 2: Deposit System
- [ ] Complete receipt upload functionality (Supabase Storage)
- [ ] Implement booking approval workflow
- [ ] Add receipt validation UI

### Phase 3: Notifications
- [ ] Set up EmailJS for email confirmations
- [ ] Set up Twilio for SMS reminders
- [ ] Create notification templates

### Phase 4: Messaging & Polish
- [ ] Implement in-app messaging system
- [ ] Complete calendar view for admin
- [ ] Add client database view
- [ ] Mobile responsiveness optimization

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run type-check # Run TypeScript check
```

## Styling

The project uses Tailwind CSS with custom colors:
- Primary (pink): `#ec4899`
- Secondary (cyan): `#06b6d4`

## API Integration

Database queries are located in `/lib/supabase/`:
- `services.ts` - Service operations
- `bookings.ts` - Booking operations
- `clients.ts` - Client operations
- `blockedTimes.ts` - Blocked time operations

All queries use the Supabase JavaScript client for type-safe database access.

## Deployment

Ready for deployment to Vercel (recommended for Next.js):
1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!
