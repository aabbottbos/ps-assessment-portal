# Vercel Build Fix

## Issue

When deploying to Vercel, you may encounter this error:

```
Build error occurred
Error: Failed to collect page data for /api/assessments/auth
```

## Root Cause

The `lib/session.ts` file was checking for the `ASSESSMENT_SESSION_SECRET` environment variable at **module load time** (when the file is imported), which happens during the build process. Since environment variables might not be available during build, this caused the build to fail.

## Solution Applied

The fix is to use **lazy evaluation** - only check for the environment variable when the functions are actually called (at runtime), not when the module loads.

### Before (Broken)

```typescript
// This runs at module load time (during build)
const SESSION_SECRET = process.env.ASSESSMENT_SESSION_SECRET || "";

if (!SESSION_SECRET) {
  throw new Error("ASSESSMENT_SESSION_SECRET environment variable is not set");
}

const secret = new TextEncoder().encode(SESSION_SECRET);
```

### After (Fixed)

```typescript
// This only runs when functions are called (at runtime)
function getSecret(): Uint8Array {
  const SESSION_SECRET = process.env.ASSESSMENT_SESSION_SECRET;

  if (!SESSION_SECRET) {
    throw new Error("ASSESSMENT_SESSION_SECRET environment variable is not set");
  }

  return new TextEncoder().encode(SESSION_SECRET);
}
```

## Verification

You can verify the build works locally:

```bash
npm run build
```

The build should complete successfully with output like:

```
✓ Compiled successfully
✓ Generating static pages (9/9)
Route (app)                              Size     First Load JS
┌ ○ /                                    149 B          87.4 kB
├ ƒ /api/assessments/auth                0 B                0 B
├ ƒ /api/assessments/proxy/[slug]        0 B                0 B
...
```

## Deploying to Vercel

After this fix, you can deploy successfully:

1. **Push the updated code to GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel build error with lazy env var evaluation"
   git push
   ```

2. **Redeploy on Vercel**
   - Vercel will automatically redeploy on push
   - Or manually trigger a redeploy in the Vercel dashboard

3. **Verify environment variables are set in Vercel**
   - Go to Project Settings → Environment Variables
   - Ensure all required variables are present:
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `ASSESSMENT_SESSION_SECRET`

## Important Notes

- Environment variables in Vercel are **only available at runtime**, not during build
- Always use lazy evaluation for runtime-only checks
- Test the build locally before pushing: `npm run build`

## Build Warnings (Expected)

You may see warnings about Edge Runtime and Node.js APIs:

```
⚠ A Node.js API is used (CompressionStream) which is not supported in the Edge Runtime.
```

These are **warnings, not errors** and are expected when using `jose` library with NextAuth.js. They don't affect functionality.

---

**Status**: ✅ Fixed and verified
**Tested**: Local build successful
**Ready for**: Vercel deployment
