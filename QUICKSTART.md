# Quick Start

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

1. Create a free account at https://supabase.com
2. Create a new project
3. Copy your project URL and anon key
4. Create `.env.local` and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

## 3. Create Database Tables

Copy and run the SQL from `SETUP.md` in your Supabase SQL editor.

## 4. Start Development

```bash
npm run dev
```

Then visit http://localhost:3000

## Pages to Test

- **Homepage**: http://localhost:3000
- **Services**: http://localhost:3000/client/services
- **Book Appointment**: http://localhost:3000/client/services → "Book Now"
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Manage Services**: http://localhost:3000/admin/services

## Current Features (Phase 1 Complete)

### Client Features ✅
- View available services
- Multi-step booking process
- Date/time selection with calendar
- Client information form
- Booking confirmation

### Admin Features ✅
- Service management (add, edit, delete)
- Dashboard overview
- Navigation to other sections

## What's Next

1. **Before Phase 2**: Set up authentication for admin login
2. **Phase 2**: Receipt upload and booking approval
3. **Phase 3**: Email/SMS notifications
4. **Phase 4**: In-app messaging and polish
