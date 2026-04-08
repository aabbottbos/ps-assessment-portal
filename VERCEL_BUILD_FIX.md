# Vercel Build Fix - Complete Guide

## Current Error

```
> Build error occurred
Error: Failed to collect page data for /api/assessments/auth
sh: line 1: Prisma: command not found
Error: Command "`npx prisma migrate deploy && next build`" exited with 127
```

## Root Causes

1. **Custom build command syntax issue** in Vercel settings
2. **Prisma not being generated** before Next.js build
3. **Environment variables** potentially missing during build

## ✅ Solution (Already Applied)

The `package.json` has been updated with the correct build configuration:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

**Key changes:**
- `build` script now runs `prisma generate` before `next build`
- `postinstall` script ensures Prisma client is generated after `npm install`

## 🚀 Vercel Configuration Steps

### Step 1: Remove Custom Build Command

1. Go to your Vercel project
2. Navigate to: **Settings → General → Build & Development Settings**
3. **Build Command**: Leave **EMPTY** or set to: `npm run build`
   - ❌ **DO NOT** use: ~~`npx prisma migrate deploy && next build`~~
   - ❌ **DO NOT** use: ~~`prisma migrate deploy && next build`~~
   - ✅ **USE**: `npm run build` (or leave empty to use default)
4. **Install Command**: Leave as default (`npm install`)

### Step 2: Verify Environment Variables

Ensure ALL required environment variables are set in Vercel:

**Go to: Settings → Environment Variables**

Required variables for **Production**, **Preview**, and **Development**:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://productschool.net
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ASSESSMENT_SESSION_SECRET=your-assessment-secret
```

**Important:**
- Set variables for **all three environments** (Production, Preview, Development)
- Use the **same values** across all environments (or adjust URLs for Preview/Dev)
- Ensure `DATABASE_URL` uses the **pooled connection string** from Neon

### Step 3: Trigger Redeploy

After making changes:

1. Go to: **Deployments** tab
2. Click on the latest deployment
3. Click: **⋯ (three dots) → Redeploy**
4. Select: **Use existing Build Cache** (unchecked for clean build)
5. Click: **Redeploy**

## 🔍 Why This Happens

### Issue 1: Custom Build Commands
Vercel's custom build command field can have issues with:
- Shell escaping
- Command chaining with `&&`
- Direct `prisma` calls without `npx`

**Solution:** Use `package.json` scripts instead of custom commands.

### Issue 2: Prisma Client Not Generated
Next.js build tries to import `@prisma/client` before it's generated, causing:
```
Error: @prisma/client did not initialize yet
```

**Solution:** Generate Prisma client in `postinstall` and before build.

### Issue 3: Page Data Collection
The error "Failed to collect page data" happens when:
- API routes import modules with environment variable checks at module load time
- Database connections fail during build
- Prisma client isn't available

**Solution:** We've already fixed the lazy environment variable loading in `lib/session.ts`.

## ✅ Verification Checklist

After deploying, verify:

- [ ] Build completes without errors
- [ ] All environment variables are set
- [ ] Database connection works
- [ ] Admin sign-in works
- [ ] Assessment creation works
- [ ] Customer password flow works

## 🧪 Test Build Locally

Before deploying, test the build locally:

```bash
# Clean install (simulates Vercel)
rm -rf node_modules .next
npm install

# Test build
npm run build

# Should see:
# ✓ Prisma client generated
# ✓ Compiled successfully
# ✓ Generating static pages
```

## 🐛 Troubleshooting

### Build still failing?

**1. Check Vercel Build Logs**

Look for these lines in order:
```
> npm install
> prisma generate      # Should appear here (from postinstall)
> npm run build
> prisma generate      # Should appear here (from build script)
> next build
✓ Compiled successfully
```

**2. Verify Prisma in package.json**

Check that `prisma` is in `devDependencies`:
```json
"devDependencies": {
  "prisma": "^5.22.0"
}
```

**3. Environment Variables Missing?**

Build will fail if required env vars aren't set. Check:
- Settings → Environment Variables
- Ensure set for all environments (Production, Preview, Dev)

**4. Database Connection Issues?**

```
Error: Can't reach database server
```

- Verify `DATABASE_URL` is correct
- Use **pooled connection string** from Neon
- Ensure connection string includes `?sslmode=require`

### "Prisma: command not found"

This means:
1. Custom build command has wrong syntax
2. **Fix:** Remove custom build command, use default

### "Failed to collect page data"

This means:
1. Environment variables accessed at module load time
2. API routes failing during build-time rendering
3. **Fix:** Already applied (lazy loading in `lib/session.ts`)

### Clean Slate Approach

If nothing works:

```bash
# 1. Delete the project in Vercel
# 2. Push latest code to GitHub
git add .
git commit -m "Fix Vercel build with updated package.json"
git push

# 3. Import project again in Vercel
# 4. Set environment variables
# 5. Deploy
```

## 📚 Reference

### Correct Vercel Settings

**Framework Preset:** Next.js (auto-detected) ✅

**Build Settings:**
- Build Command: `npm run build` (or leave empty)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)
- Development Command: `npm run dev` (default)

**Root Directory:** `./` (leave as root)

### package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

**Why this works:**
1. `postinstall` runs after `npm install` → generates Prisma client
2. `build` script explicitly generates Prisma client again (safety)
3. Then runs `next build` which can now import `@prisma/client`

## 🎯 Expected Build Output

```
Cloning completed in 1s
Analyzing source code...
Installing build runtime...
Build runtime installed: 2s
Looking for the latest version of Next.js...
Detected Next.js version: 14.2.35
Installing dependencies...
Running "npm install"
✓ Dependencies installed: 15s

Running "npm run build"
> prisma generate
✓ Generated Prisma Client

> next build
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (9/9)
✓ Collecting build traces
✓ Finalizing page optimization

Build completed in 45s
```

---

**Status:** ✅ Fixed
**Changes Made:** Updated `package.json` build scripts
**Action Required:** Update Vercel settings and redeploy
