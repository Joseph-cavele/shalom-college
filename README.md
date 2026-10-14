# Shalom Training School

Website + admin dashboard for **Shalom Training School** — built with
**Next.js 15 (App Router)**, **TypeScript**, **TailwindCSS** and **MongoDB (Mongoose)**.

## Features

**Public site**
- Home, About, Courses (filter by category), Apply Online (with ID upload), Contact
- Content driven from MongoDB — courses, contact details and homepage copy are all editable from the admin
- Google Maps iframe for the Rustenburg campus on the Contact page

**Integrations**
- **Cloudinary** — application ID documents upload to Cloudinary when configured (falls back to local `/public/uploads` otherwise)
- **Resend** — the owner (`OWNER_EMAIL`) is emailed on every new application and contact message

**Admin dashboard** (`/admin`)
- Passwordless owner sign-in: a 6-digit code is emailed to the owner (Auth.js v5), with an optional backup password
- Dashboard with KPI cards + applications-over-time line chart + status donut
- Applications management (search, filter, change status, view uploaded doc, delete)
- Courses CRUD (add / edit / hide / delete)
- Website content & banner management
- Contact messages inbox
- Settings (school details, contacts, mission/vision, social)
- Profile & backup password

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
FROM_EMAIL="Shalom Training School <info@shalomtrainingschool.co.za>"
OWNER_EMAIL=you@example.com
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

## Owner sign-in

There is exactly one account — the school owner — and no public registration.

1. **Create / update the owner** (normalises the email, sets role `OWNER`, status `active`):
   ```bash
   npm run owner:setup -- --email owner@example.com --name "Owner Name"
   ```
   If that email isn't found but one account already exists, the script moves that
   account to the new email (keeping its name and backup password).
   - Lock the account: `npm run owner:setup -- --email owner@example.com --disable` (re-enable with `--enable`)
   - Set the backup password: `OWNER_PASSWORD='…' npm run owner:setup -- --email owner@example.com --set-password`
2. **Sign in** at `/admin/login`: enter the owner email, then the 6-digit code from the email.
   "Use password instead" signs in with the backup password, if one is set (Profile → Change Password).

**How it's protected**
- Codes come from `crypto.randomInt`, are stored only as an HMAC-SHA256 (keyed by `AUTH_SECRET`),
  expire after 10 minutes, allow 5 wrong attempts, and are deleted the moment they are used.
  Each check reserves an attempt atomically before comparing, and only the request that deletes the
  code wins, so a code can't be guessed in parallel or redeemed twice. Requesting a new code replaces
  the old one; codes for one email can be requested at most once a minute.
- MongoDB-backed rate limits (shared by all serverless instances): code requests 5/email and 10/IP,
  code checks 15/email and 30/IP, password attempts 5/email and 10/IP — per 15 minutes.
  Counters and codes are removed automatically by TTL indexes.
- The login page answers the same way whether or not an email belongs to the owner; codes are issued
  and emailed after the response is sent.
- Sessions are encrypted Auth.js JWT cookies (httpOnly, SameSite=Lax, Secure on HTTPS) lasting 8 hours.
  Every admin page and API route re-reads the account (`getSession()` in `lib/auth.ts`), so a disabled
  owner is locked out on their next request; middleware only does a convenience redirect.
- No transactions are needed (single-document atomic updates), so any MongoDB deployment works,
  including a standalone server or Atlas free tier.

**Production checklist (Vercel → Settings → Environment Variables):** `MONGO_URI`, `AUTH_SECRET`,
`RESEND_API_KEY`, `EMAIL_FROM` (verified Resend domain), `OWNER_EMAIL`; then redeploy.

