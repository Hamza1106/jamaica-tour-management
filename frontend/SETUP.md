# Irie Island Tours — Setup Guide

## 1. Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://rjkvcfhfkfqvpzmqitcb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your_anon_key>
```

Get your anon key from:
👉 https://supabase.com/dashboard/project/rjkvcfhfkfqvpzmqitcb/settings/api

## 2. Supabase Auth Settings

In Supabase Dashboard → Authentication → Settings:
- **Confirm email**: OFF (so users can sign up and log in immediately)
- **Site URL**: `http://localhost:5173` (dev) or your production URL

## 3. Run the project

```bash
bun install
bun dev
```

## 4. What's working now (Phase 1)

✅ User signup / login / logout — Supabase Auth (email + password)
✅ Protected `/book` route — redirects to `/auth` if not logged in
✅ Tour detail pages — click any tour card to see full details
✅ Tours page filter pills — All, Waterfall, Beach, Coffee, Sunset, Private
✅ Page transition animations + scroll reveal + progress bar
✅ Tour card hover interactions (overlay CTA, highlights preview)
✅ FAQ accordion on tour detail page
✅ Social proof widget on booking sidebar

## 5. Phase 2 (next up)

- [ ] Save bookings to Supabase database
- [ ] Admin auth guard (admin role check)
- [ ] Real map integration (Google Maps / Mapbox)
- [ ] Email confirmation on booking
