# Product School Portal - Project Handoff

## What Is This?

A secure gateway for Product School enterprise clients to access hosted assessments and proposals. Both are external Vercel apps that are embedded via iframe—customers never see the real URLs.

**Live URLs:**
- Production: https://productschool.net
- Admin: `/admin`
- Customer Assessments: `/assessment/{slug}`
- Customer Proposals: `/proposal/{slug}`

---

## Key Features

### Admin (Google OAuth - @productschool.com only)
- ✅ Create/edit/delete assessments and proposals
- ✅ Tabbed interface for Assessments and Proposals
- ✅ Upload client logos (Vercel Blob storage)
- ✅ Generate unique slugs and passwords
- ✅ Toggle public/private access (passwordRequired flag)
- ✅ View access logs and export to CSV
- ✅ Archive/activate items (soft delete)
- ✅ Copy passwords and URLs to clipboard
- ✅ Open portal in new window for testing

### Customer (Public or Password-protected)
- ✅ **Public portals**: Direct iframe access (no password required)
- ✅ **Private portals**: Password entry screen, then iframe access
- ✅ Portal loads in iframe via proxy
- ✅ Real URLs never exposed to client
- ✅ Session cookie (24hr, HTTP-only, Secure)
- ✅ Access logging (no PII)
- ✅ Custom logo display (if configured)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** Neon PostgreSQL (serverless pooling)
- **ORM:** Prisma v5
- **Auth:** NextAuth.js v5 (Auth.js)
- **Storage:** Vercel Blob (logos)
- **Styling:** Tailwind CSS v3 (blue theme)
- **Deployment:** Vercel

---

## Project Structure

```
app/
├── admin/                      # Admin dashboard (protected)
│   ├── layout.tsx              # Header with PS logo, sign out
│   ├── page.tsx                # Tabbed dashboard (assessments/proposals)
│   ├── signin/page.tsx         # Google OAuth login
│   ├── new/page.tsx            # Create assessment/proposal form
│   └── [id]/
│       ├── page.tsx            # Edit assessment/proposal
│       └── logs/page.tsx       # Access logs + CSV export
├── assessment/[slug]/page.tsx  # Customer assessment portal
├── proposal/[slug]/page.tsx    # Customer proposal portal
├── assessments/[slug]/page.tsx # Legacy route (backward compatibility)
├── api/
│   ├── auth/[...nextauth]/     # NextAuth.js routes
│   ├── proxy/[slug]/           # URL proxy (redirects to real URL)
│   └── upload/logo/            # Logo upload API (Vercel Blob)
└── layout.tsx                  # Root layout with metadata

components/
├── ProductSchoolLogo.tsx       # PS logo (blue box + text)
├── admin/
│   ├── AssessmentForm.tsx      # Create/edit form (handles both types)
│   ├── LogoUpload.tsx          # Logo upload component
│   ├── CopyButton.tsx          # Copy to clipboard button
│   ├── StatusBadge.tsx         # Status display badge
│   └── DeleteAssessmentButton.tsx
└── customer/
    ├── PasswordEntry.tsx       # Password entry + auto-submit
    └── AssessmentIframe.tsx    # Iframe wrapper

lib/
├── auth.ts                     # NextAuth config
├── session.ts                  # JWT session signing/validation
├── db.ts                       # Prisma client
└── actions/assessments.ts      # Server actions for CRUD

prisma/
├── schema.prisma               # Assessment + AccessLog models
└── migrations/
    ├── 20260408161212_init
    └── 20260411200741_add_type_and_logo

scripts/
├── start.sh                    # Start dev server
├── stop.sh                     # Stop dev server
├── status.sh                   # Check server status
├── logs.sh                     # View server logs
└── restart.sh                  # Restart server
```

---

## Database Schema

### Assessment
- `id` (cuid), `type` (assessment | proposal), `clientName`, `clientDescription`
- `assessmentType` (e.g., "Initial Audit", "Follow-up")
- `assessmentUrl` (hidden from client), `slug` (public)
- `passwordRequired` (boolean), `password` (plaintext for Phase 1)
- `logoUrl` (Vercel Blob URL, nullable)
- `status` (active, inactive, archived)
- `createdAt`, `updatedAt`

### AccessLog
- `id` (cuid), `assessmentId` (FK), `accessedAt` (timestamp)
- **No PII** (privacy-focused)

---

## Environment Variables

```bash
# .env.local (local dev)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
ASSESSMENT_SESSION_SECRET="..."
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

**Vercel:** Set all env vars in project settings
**Important:** Configure Vercel Blob store as "Public" for logo URLs to work

---

## Quick Start

```bash
# Install dependencies
npm install

# Setup database (first time only)
npx prisma migrate dev --name init
npx prisma generate

# Start dev server
./scripts/start.sh

# View status
./scripts/status.sh

# View logs
./scripts/logs.sh

# Stop server
./scripts/stop.sh
```

**URLs:**
- http://localhost:3000/admin/signin
- http://localhost:3000/admin

---

## Important Files

### Authentication
- **lib/auth.ts** - NextAuth config, email domain restriction
- **lib/session.ts** - JWT signing for customer sessions (lazy env var loading)
- **middleware.ts** - Route protection for `/admin`

### Core Logic
- **lib/actions/assessments.ts** - Server actions for CRUD (createAssessment, updateAssessment, etc.)
- **app/api/proxy/[slug]/route.ts** - Universal proxy for both assessments and proposals
- **app/api/upload/logo/route.ts** - Vercel Blob upload handler
- **components/customer/PasswordEntry.tsx** - Auto-submits for public portals, shows password form for private

### UI
- **components/ProductSchoolLogo.tsx** - Blue PS logo (HTML/CSS, not SVG)
- **components/admin/LogoUpload.tsx** - Logo upload with preview
- **tailwind.config.ts** - Custom blue theme using Product School colors
- **app/globals.css** - CSS variables and Product School design system
- **app/icon.png** - Official Product School favicon

---

## Recent Changes

### Proposals & Portal Support (Latest - April 12, 2026)
- ✅ **Unified portal system** - Supports both assessments and proposals
- ✅ **Type field** - Database `type` column distinguishes assessments from proposals
- ✅ **Tabbed admin interface** - Separate tabs for Assessments and Proposals
- ✅ **Route restructure** - Admin moved from `/assessments/admin` to `/admin`
- ✅ **Customer routes** - `/assessment/{slug}` and `/proposal/{slug}`
- ✅ **Logo upload** - Vercel Blob integration with public access
- ✅ **Open in new window** - Quick preview button in admin table
- ✅ **Tab-aware redirects** - Form submissions return to correct tab
- ✅ **Application branding** - "Product School Portal" title and official favicon

### Bug Fixes (April 12, 2026)
- ✅ Fixed logo upload 403 errors (switched to public Blob access)
- ✅ Fixed Next.js Image component conflicts (use regular `<img>` for admin)
- ✅ Fixed button visibility (updated from `bg-primary-600` to `bg-ps-blue`)
- ✅ Fixed webpack module errors (cleared .next cache)
- ✅ Added Vercel Blob hostname to Next.js image config

### UI Updates (April 8-12, 2026)
- ✅ Changed color scheme from purple to **blue** (#3B82F6)
- ✅ Updated all components to use `bg-ps-blue` and `hover:bg-ps-navy`
- ✅ Matches Product School brand aesthetic
- ✅ Product School favicon and branding

### Deployment Fixes
- ✅ Updated package.json build script: `prisma generate && next build`
- ✅ Added postinstall script for Prisma client generation
- ✅ Fixed lazy env var loading in lib/session.ts (prevents build errors)

---

## Known Issues / Next Steps

### ✅ Completed
- Database schema with type and logo fields
- Google OAuth with email restriction
- Admin CRUD operations for assessments and proposals
- **Logo upload via Vercel Blob**
- **Tabbed admin interface**
- Public and private portal access (passwordRequired toggle)
- Customer password authentication for private portals
- Access logging and CSV export
- Development scripts
- Vercel deployment
- UI matching Product School brand (blue theme)
- Official Product School favicon

### 🔄 Optional Enhancements
- **Dark mode support**
- **Email notifications** for new assessments/proposals
- **Password hashing** (currently plaintext)
- **Rate limiting** on password attempts
- **Analytics dashboard** (access metrics)
- **Logo display in customer portal** (currently admin-only)

---

## Testing the Flow

### Admin Flow
1. Visit `/admin/signin`
2. Sign in with Google (@productschool.com email)
3. View dashboard with Assessments/Proposals tabs
4. Click "New Assessment" or "New Proposal"
5. Upload logo (optional)
6. Fill form and submit (redirects to correct tab)
7. Click "Open in new window" icon to preview
8. View logs, edit, or archive

### Customer Flow (Private Portal)
1. Visit `/assessment/{slug}` or `/proposal/{slug}` for password-protected portal
2. Enter password on entry screen
3. Portal loads in iframe
4. Access logged (timestamp only, no PII)

### Customer Flow (Public Portal)
1. Visit `/assessment/{slug}` or `/proposal/{slug}` for public portal
2. Brief loading state ("Loading...")
3. Portal loads in iframe automatically (no password required)
4. Access logged (timestamp only, no PII)

---

## Troubleshooting

### Logo Upload 403 Errors
**Solution:** Configure Vercel Blob store as "Public" access mode
1. Go to Vercel Dashboard → Storage → Blob
2. Select your blob store
3. Change access from "Private" to "Public"
4. Re-upload logos

### Browser Cache Issues
Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

### Database Migration for Production
```bash
# Apply migrations to production database
npx prisma migrate deploy

# Or run SQL directly in Neon Console:
ALTER TABLE "Assessment" ADD COLUMN "logoUrl" TEXT;
ALTER TABLE "Assessment" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'assessment';
CREATE INDEX "Assessment_type_idx" ON "Assessment"("type");
```

### Google OAuth Error
Add redirect URI to Google Cloud Console:
`http://localhost:3000/api/auth/callback/google`

### Vercel Build Fails
- Ensure all env vars are set in Vercel project settings
- Check build command: `npm run build` (not custom)
- Verify `ASSESSMENT_SESSION_SECRET` and `BLOB_READ_WRITE_TOKEN` are set

### Port Already in Use
```bash
./scripts/stop.sh
# Or force kill:
lsof -ti:3000 | xargs kill -9
```

---

## Architecture Notes

### Security
- **Admin:** NextAuth session cookies, middleware protection
- **Customer:** JWT-signed HTTP-only cookies (24hr expiry)
- **URLs:** Never sent to client (proxy pattern)
- **Passwords:** Plaintext for Phase 1 (upgrade to bcrypt later)
- **Logos:** Public Vercel Blob URLs (no authentication required)

### Data Flow

**Public Portals (`passwordRequired=false`):**
1. Customer visits `/assessment/{slug}` or `/proposal/{slug}` → Auto-submits with empty password
2. API validates portal is public → Sets session cookie → Returns success
3. Page refreshes → Iframe loads `/api/proxy/{slug}` → Redirects to real URL
4. Client never sees real URL (only proxy URL in iframe src)

**Private Portals (`passwordRequired=true`):**
1. Customer visits `/assessment/{slug}` or `/proposal/{slug}` → Shows password form
2. Customer enters password → API validates → Sets session cookie → Returns success
3. Page refreshes → Iframe loads `/api/proxy/{slug}` → Redirects to real URL
4. Client never sees real URL (only proxy URL in iframe src)

### Performance
- Neon PostgreSQL with connection pooling for serverless
- Server Components for reduced client JS
- Server Actions for mutations (minimal API routes)
- Static generation where possible
- Vercel Blob for optimized image delivery

---

## Vercel Blob Configuration

### Required Setup
1. Create Blob store in Vercel dashboard
2. Set access mode to **Public** (required for logo URLs)
3. Copy `BLOB_READ_WRITE_TOKEN` to environment variables
4. Upload endpoint: `/api/upload/logo` (accepts PNG, JPG, SVG, WebP)

### Next.js Image Config
```javascript
// next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.blob.vercel-storage.com',
    },
  ],
}
```

---

## Contact & Support

**Documentation:**
- See this file for complete project overview
- Check git commit history for detailed change log

**Development:**
- Framework: Next.js 14 docs (nextjs.org)
- Database: Neon docs (neon.tech/docs)
- Auth: NextAuth.js docs (authjs.dev)
- Storage: Vercel Blob docs (vercel.com/docs/storage/vercel-blob)

---

**Last Updated:** April 12, 2026
**Status:** ✅ Production-ready with proposals, logo upload, and Product School branding
**Next Session:** Ready for optional enhancements or new features
