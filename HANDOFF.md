# PS Assessments Portal - Project Handoff

## What Is This?

A secure gateway for Product School enterprise clients to access hosted assessments. Assessments are external Vercel apps that are embedded via iframe—customers never see the real URLs.

**Live URLs:**
- Production: https://productschool.net
- Admin: `/assessments/admin`
- Customer: `/assessments/{slug}`

---

## Key Features

### Admin (Google OAuth - @productschool.com only)
- ✅ Create/edit/delete assessments
- ✅ Generate unique slugs and passwords
- ✅ Toggle public/private access (passwordRequired flag)
- ✅ View access logs and export to CSV
- ✅ Archive/activate assessments (soft delete)
- ✅ Copy passwords and URLs to clipboard

### Customer (Public or Password-protected)
- ✅ **Public assessments**: Direct iframe access (no password required)
- ✅ **Private assessments**: Password entry screen, then iframe access
- ✅ Assessment loads in iframe via proxy
- ✅ Real URLs never exposed to client
- ✅ Session cookie (24hr, HTTP-only, Secure)
- ✅ Access logging (no PII)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** Neon PostgreSQL (serverless pooling)
- **ORM:** Prisma v5
- **Auth:** NextAuth.js v5 (Auth.js)
- **Styling:** Tailwind CSS v3 (blue theme)
- **Deployment:** Vercel

---

## Project Structure

```
app/
├── assessments/
│   ├── admin/                  # Admin dashboard (protected)
│   │   ├── layout.tsx          # Header with PS logo, sign out
│   │   ├── page.tsx            # Assessment table
│   │   ├── signin/page.tsx     # Google OAuth login
│   │   ├── new/page.tsx        # Create assessment form
│   │   └── [id]/
│   │       ├── page.tsx        # Edit assessment
│   │       ├── edit/page.tsx   # (redirects to [id])
│   │       └── logs/page.tsx   # Access logs + CSV export
│   └── [slug]/page.tsx         # Customer password entry + iframe
├── api/
│   ├── auth/[...nextauth]/     # NextAuth.js routes
│   └── assessments/
│       ├── auth/route.ts       # Password validation
│       └── proxy/[slug]/       # URL proxy (redirects to real URL)

components/
├── ProductSchoolLogo.tsx       # PS logo (blue box + text)
├── admin/                      # Admin UI components
└── customer/                   # Customer UI components

lib/
├── auth.ts                     # NextAuth config
├── session.ts                  # JWT session signing/validation
├── db.ts                       # Prisma client
└── actions/assessments.ts      # Server actions for CRUD

prisma/
└── schema.prisma               # Assessment + AccessLog models

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
- `id` (cuid), `clientName`, `clientDescription`, `assessmentType`
- `assessmentUrl` (hidden from client), `slug` (public)
- `passwordRequired` (boolean), `password` (plaintext for Phase 1)
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
DIRECT_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
ASSESSMENT_SESSION_SECRET="..."
```

**Vercel:** Set all env vars in project settings

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
- http://localhost:3000/assessments/admin/signin
- http://localhost:3000/assessments/admin

---

## Important Files

### Authentication
- **lib/auth.ts** - NextAuth config, email domain restriction
- **lib/session.ts** - JWT signing for customer sessions (lazy env var loading)
- **middleware.ts** - Route protection for `/assessments/admin`

### Core Logic
- **lib/actions/assessments.ts** - Server actions for CRUD (createAssessment, updateAssessment, etc.)
- **app/api/assessments/auth/route.ts** - Password validation API (handles both public and private assessments)
- **app/api/assessments/proxy/[slug]/route.ts** - Validates session, redirects to real URL
- **components/customer/PasswordEntry.tsx** - Auto-submits for public assessments, shows password form for private

### UI
- **components/ProductSchoolLogo.tsx** - Blue PS logo (HTML/CSS, not SVG)
- **tailwind.config.js** - Custom blue theme (#2563eb)

---

## Recent Changes

### Public/Private Assessments (Latest - April 8, 2026)
- ✅ **Fixed public assessment access** - Assessments with `passwordRequired=false` now bypass password screen
- ✅ Updated API validation logic to allow empty passwords for public assessments
- ✅ Auto-submit authentication for public assessments via client-side useEffect
- ✅ Loading state shown during public assessment authentication
- ✅ Private assessments (`passwordRequired=true`) still require password entry

### UI Updates
- ✅ Changed color scheme from purple to **blue** (#2563eb)
- ✅ Fixed ProductSchoolLogo to use HTML/CSS (SVG text elements don't render in React)
- ✅ Updated all components to use `primary-600` (now blue)
- ✅ Matches PS Campaign Manager design aesthetic

### Deployment Fixes
- ✅ Updated package.json build script: `prisma generate && next build`
- ✅ Added postinstall script for Prisma client generation
- ✅ Fixed lazy env var loading in lib/session.ts (prevents build errors)

### Documentation Created
- `DATABASE_SETUP.md` - Database migration steps
- `GOOGLE_OAUTH_FIX.md` - OAuth redirect URI setup
- `VERCEL_BUILD_FIX.md` - Deployment troubleshooting
- `BROWSER_CACHE_FIX.md` - Hard refresh instructions
- `UI_UPDATES.md` - UI changes summary
- `QUICK_FIX_CHECKLIST.md` - Common issues

---

## Known Issues / Next Steps

### ✅ Completed
- Database schema and migrations
- Google OAuth with email restriction
- Admin CRUD operations
- **Public and private assessment access** (passwordRequired toggle)
- Customer password authentication for private assessments
- Access logging and CSV export
- Development scripts
- Vercel deployment
- UI matching Campaign Manager (blue theme)

### 🔄 Optional Enhancements
- **Real Product School logo SVG** (currently using HTML/CSS placeholder)
- **Dark mode support**
- **Email notifications** for new assessments
- **Password hashing** (currently plaintext)
- **Rate limiting** on password attempts
- **Analytics dashboard** (access metrics)

---

## Testing the Flow

### Admin Flow
1. Visit `/assessments/admin/signin`
2. Sign in with Google (@productschool.com email)
3. View dashboard with assessments table
4. Click "New Assessment" to create
5. Copy password and customer URL
6. View logs, edit, or archive

### Customer Flow (Private Assessment)
1. Visit `/assessments/{slug}` for a password-protected assessment
2. Enter password on entry screen
3. Assessment loads in iframe
4. Access logged (timestamp only, no PII)

### Customer Flow (Public Assessment)
1. Visit `/assessments/{slug}` for a public assessment
2. Brief loading state ("Loading assessment...")
3. Assessment loads in iframe automatically (no password required)
4. Access logged (timestamp only, no PII)

---

## Troubleshooting

### Browser Cache Issues
Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

### Database Not Found
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Google OAuth Error
Add redirect URI to Google Cloud Console:
`http://localhost:3000/api/auth/callback/google`

### Vercel Build Fails
- Ensure all env vars are set in Vercel project settings
- Check build command: `npm run build` (not custom)
- Verify `ASSESSMENT_SESSION_SECRET` is set

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

### Data Flow

**Public Assessments (`passwordRequired=false`):**
1. Customer visits `/assessments/{slug}` → Component auto-submits with empty password
2. API validates assessment is public → Sets session cookie → Returns success
3. Page refreshes → Iframe loads `/api/assessments/proxy/{slug}` → Redirects to real URL
4. Client never sees real URL (only proxy URL in iframe src)

**Private Assessments (`passwordRequired=true`):**
1. Customer visits `/assessments/{slug}` → Shows password entry form
2. Customer enters password → API validates password → Sets session cookie → Returns success
3. Page refreshes → Iframe loads `/api/assessments/proxy/{slug}` → Redirects to real URL
4. Client never sees real URL (only proxy URL in iframe src)

### Performance
- Neon PostgreSQL with connection pooling for serverless
- Server Components for reduced client JS
- Server Actions for mutations (no API routes needed)
- Static generation where possible

---

## Contact & Support

**Documentation:**
- See `/docs` folder for detailed guides
- Check `QUICK_FIX_CHECKLIST.md` for common issues

**Development:**
- Framework: Next.js 14 docs (nextjs.org)
- Database: Neon docs (neon.tech/docs)
- Auth: NextAuth.js docs (authjs.dev)

---

**Last Updated:** April 8, 2026
**Status:** ✅ Production-ready with blue theme and public/private assessment support
**Next Session:** Ready to pick up optional enhancements or new features
