# PS Assessments Portal

A secure, branded gateway for Product School enterprise customers to access their product assessments. Assessments are hosted externally and proxied via iframe — the underlying URL is never exposed to customers.

## Overview

The PS Assessments Portal provides:

- **Admin Dashboard**: Manage client assessments with Google OAuth authentication
- **Customer Access**: Secure password-protected assessment access
- **Access Logging**: Track when assessments are viewed (no PII collected)
- **URL Masking**: Real assessment URLs are never exposed to end users

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict mode)
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Admin Auth**: NextAuth.js v5 with Google OAuth
- **Customer Auth**: Custom password + HTTP-only cookies
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
ps-assessments-portal/
├── app/
│   ├── assessments/
│   │   ├── [slug]/           # Customer-facing assessment pages
│   │   └── admin/            # Admin dashboard and management
│   ├── api/
│   │   └── assessments/      # Auth and proxy API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/                # Admin UI components
│   └── customer/             # Customer-facing components
├── lib/
│   ├── actions/              # Server actions
│   ├── auth.ts               # NextAuth configuration
│   ├── db.ts                 # Prisma client
│   └── session.ts            # Session/cookie utilities
├── prisma/
│   └── schema.prisma         # Database schema
└── middleware.ts             # Route protection
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Neon PostgreSQL database
- Google OAuth credentials
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ps-assessments-portal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.local.example` to `.env.local` and fill in the values:

   ```bash
   cp .env.local.example .env.local
   ```

   See [Environment Variables](#environment-variables) section below.

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

All required environment variables are documented in `.env.local.example`. Here's what each one does:

### Database

- `DATABASE_URL`: Neon PostgreSQL connection string (with SSL enabled)

### NextAuth.js (Admin Authentication)

- `NEXTAUTH_SECRET`: Random secret for JWT signing (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: The base URL of your application (e.g., `http://localhost:3000` or `https://productschool.net`)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### Assessment Session Cookies

- `ASSESSMENT_SESSION_SECRET`: Random secret for customer session tokens (generate with `openssl rand -base64 32`)

## Features

### Admin Dashboard

- **Authentication**: Google OAuth restricted to @productschool.com emails
- **Assessment Management**: Create, edit, and archive assessments
- **Access Logs**: View when assessments were accessed
- **CSV Export**: Export access logs for reporting

### Customer Experience

- **Password Protection**: Each assessment can have its own password
- **Clean URLs**: Customers access assessments via `productschool.net/assessments/[slug]`
- **Secure Sessions**: 24-hour session cookies (HTTP-only, Secure, SameSite=Strict)
- **URL Masking**: Real Vercel URLs are never exposed to the client browser

### Security Features

- Google OAuth with email domain restriction
- HTTP-only session cookies
- JWT-signed assessment sessions
- Server-side URL resolution (customers never see real assessment URLs)
- No PII in access logs

## Database Schema

The application uses two main models:

### Assessment

Stores client assessment information including:

- Client details (name, description, type)
- Assessment URL (real Vercel URL, never exposed)
- Slug (for customer-facing URL)
- Password protection settings
- Status (active/inactive/archived)

### AccessLog

Tracks assessment access events:

- Timestamp only
- No PII (no IP addresses or user agents)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Phase 2 Features (Out of Scope)

The following features are planned for Phase 2:

- Admin email allowlist (specific addresses)
- bcrypt password hashing
- Assessment expiry dates
- Full streaming proxy (complete URL hiding)
- Multi-assessment per client relationships
- Email draft generation
- Multi-admin roles and permissions

## License

Copyright © 2024 Product School. All rights reserved.
