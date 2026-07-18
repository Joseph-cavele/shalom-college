# Shalom Training School

Website + admin dashboard for **Shalom Training School** — built with
**Next.js 15 (App Router)**, **TypeScript**, **TailwindCSS** and **MongoDB (Mongoose)**.

## Features

**Public site**
- Home, About, Courses (filter by category), Apply Online (with ID upload), Contact
- Content driven from MongoDB — courses, contact details and homepage copy are all editable from the admin
- Google Maps iframe for both campuses on the Contact page

**Integrations**
- **Cloudinary** — application ID documents upload to Cloudinary when configured (falls back to local `/public/uploads` otherwise)
- **Resend** — the admin (`ADMIN_EMAIL`) is emailed on every new application and contact message

**Admin dashboard** (`/admin`)
- Secure login (JWT httpOnly cookie, route protected by middleware)
- Dashboard with KPI cards + applications-over-time line chart + status donut
- Applications management (search, filter, change status, view uploaded doc, delete)
- Courses CRUD (add / edit / hide / delete)
- Website content & banner management
- Contact messages inbox
- Settings (school details, contacts, mission/vision, social)
- Profile & change password

## Getting started

### 1. Prerequisites
- Node.js 18.18+ (tested on Node 20)
- A running MongoDB — local (`mongodb://localhost:27017`) or MongoDB Atlas

### 2. Configure environment
Copy `.env.example` to `.env` and set values:

```env
MONGO_URI=mongodb://localhost:27017/shalom
AUTH_SECRET=use-a-long-random-string
# optional — enable Cloudinary uploads
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
# optional — enable email notifications
RESEND_API_KEY=...
FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=you@example.com
```

Both Cloudinary and Resend are optional — the app runs without them (local
file storage, no emails). See `.env.example` for the full list.

### 3. Install, seed, run
```bash
npm install
npm run seed     # loads courses, settings, admin user + sample data
npm run dev      # http://localhost:3000
```

### Admin login
- URL: http://localhost:3000/admin/login
- Email: `admin@shalomtrainingschool.co.za`
- Password: `shalom2025`  _(change it on the Profile page after first login)_

## Project structure

```
app/
  (public)/            public marketing pages (shared layout)
  admin/
    login/             admin sign-in
    (panel)/           protected dashboard pages (shared shell)
  api/                 route handlers (public + admin + auth)
components/
  ui/                  reusable primitives (Button, Modal, Alert, Toast, badges)
  layout/              public Navbar, TopBar, Footer, WhatsApp
  sections/            Hero, Features, CTA, SectionTitle
  admin/               Sidebar, AdminShell, StatCard, charts/
lib/
  models/              Mongoose schemas
  data/                seed course catalogue
  mongodb.ts auth.ts guard.ts site.ts client.ts utils.ts types.ts
scripts/seed.ts        database seeder
middleware.ts          protects /admin routes
```
