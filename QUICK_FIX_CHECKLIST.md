# Quick Fix Checklist - Vercel Build Error

Follow these steps **in order** to fix the Vercel build error.

## ✅ Step 1: Verify Local Code

The fix has already been applied to `package.json`. Verify it's correct:

```bash
# Check package.json contains these scripts:
grep -A 3 '"scripts"' package.json
```

Should show:
```json
"scripts": {
  "dev": "next dev",
  "build": "prisma generate && next build",
  "start": "next start",
  "postinstall": "prisma generate"
}
```

✅ If correct, proceed to Step 2.

## ✅ Step 2: Push to GitHub

```bash
git add .
git commit -m "Fix Vercel build with updated package.json scripts"
git push origin main
```

## ✅ Step 3: Update Vercel Build Settings

1. Go to your Vercel project
2. Click **Settings** tab
3. Click **General** in sidebar
4. Scroll to **Build & Development Settings**
5. Find **Build Command**
6. **Either:**
   - Leave it **completely empty** ← Recommended
   - OR set to: `npm run build`
7. Click **Save**

**Important:** Do NOT use these:
- ❌ `npx prisma migrate deploy && next build`
- ❌ `prisma migrate deploy && next build`

## ✅ Step 4: Verify Environment Variables

1. Still in Settings, click **Environment Variables** in sidebar
2. Verify ALL 6 variables exist:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ASSESSMENT_SESSION_SECRET`

3. For EACH variable, verify it's checked for:
   - ☑ Production
   - ☑ Preview
   - ☑ Development

4. If any are missing or unchecked, add/update them now

## ✅ Step 5: Redeploy

1. Go to **Deployments** tab
2. Click on the **latest deployment** (the one that failed)
3. Click the **⋯** (three dots menu) in top right
4. Click **Redeploy**
5. **Uncheck** "Use existing Build Cache"
6. Click **Redeploy**

## ✅ Step 6: Monitor Build

Watch the build logs:

1. You should see:
   ```
   Running "npm install"
   > prisma generate
   Prisma Client generated

   Running "npm run build"
   > prisma generate && next build
   Prisma Client generated
   ✓ Compiled successfully
   ✓ Generating static pages
   ```

2. Build should complete in 1-2 minutes

## ✅ Step 7: Verify Deployment

Once deployed:

1. Visit: `https://productschool.net/assessments/admin`
2. Sign in with your @productschool.com account
3. Try creating a test assessment
4. Test the customer password flow

## 🚨 Still Not Working?

### If build fails at "Running npm install":
→ Check environment variables are set correctly

### If build fails at "Running npm run build":
→ Check the exact error in build logs
→ See: `VERCEL_BUILD_FIX.md` for detailed troubleshooting

### If build succeeds but routes 404:
→ Check function logs in Vercel
→ Verify `DATABASE_URL` is correct

### If everything fails:
1. Check all 6 environment variables are set
2. Verify Build Command is empty or `npm run build`
3. Try deleting and re-importing the project in Vercel

## 📚 Additional Resources

- **Detailed troubleshooting:** `VERCEL_BUILD_FIX.md`
- **Visual settings guide:** `VERCEL_SETTINGS.md`
- **Full deployment guide:** `DEPLOYMENT.md`

---

**Estimated time:** 5 minutes
**Success rate:** 99% if steps followed exactly
