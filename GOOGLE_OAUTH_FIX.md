# Google OAuth Fix - Redirect URI Mismatch

## Error

```
Access blocked: This app's request is invalid
Error 400: redirect_uri_mismatch

Request details: redirect_uri=http://localhost:3000/api/auth/callback/google
```

## Root Cause

The redirect URI `http://localhost:3000/api/auth/callback/google` is not registered in your Google Cloud Console OAuth application.

## ✅ Quick Fix (5 minutes)

### Step 1: Go to Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create one if needed)

### Step 2: Navigate to OAuth Credentials

1. Click the **☰** menu (top left)
2. Go to: **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID in the list
4. Click on the client ID name to edit it

### Step 3: Add Redirect URIs

In the **Authorized redirect URIs** section, add BOTH:

```
http://localhost:3000/api/auth/callback/google
https://productschool.net/api/auth/callback/google
```

**Important:** Add the exact URLs above, including:
- ✅ `http://` for localhost (NOT https)
- ✅ `https://` for production
- ✅ The exact path: `/api/auth/callback/google`
- ✅ No trailing slashes

### Step 4: Add JavaScript Origins (Optional but Recommended)

In the **Authorized JavaScript origins** section, add:

```
http://localhost:3000
https://productschool.net
```

### Step 5: Save

1. Click **Save** at the bottom
2. Wait 5-10 seconds for changes to propagate

### Step 6: Test

1. Restart your local dev server:
   ```bash
   ./scripts/restart.sh
   # or
   npm run dev
   ```

2. Try signing in again at: http://localhost:3000/assessments/admin/signin

## 📋 Complete Redirect URI List

For reference, here's what you should have configured:

### Authorized redirect URIs

```
http://localhost:3000/api/auth/callback/google
https://productschool.net/api/auth/callback/google
```

If you're using Vercel preview deployments, also add:
```
https://your-preview-domain.vercel.app/api/auth/callback/google
```

### Authorized JavaScript origins

```
http://localhost:3000
https://productschool.net
```

## 🖼️ Visual Guide

Your Google Cloud Console should look like this:

```
┌─────────────────────────────────────────────────────┐
│ OAuth 2.0 Client ID                                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Name: PS Assessments Portal                         │
│                                                      │
│ Client ID: [your-client-id].apps.googleusercontent..│
│                                                      │
│ Client secret: [your-secret]                        │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Authorized JavaScript origins                        │
│                                                      │
│  http://localhost:3000                              │
│  https://productschool.net                          │
│                                                      │
│  [+ ADD URI]                                        │
├─────────────────────────────────────────────────────┤
│ Authorized redirect URIs                             │
│                                                      │
│  http://localhost:3000/api/auth/callback/google     │
│  https://productschool.net/api/auth/callback/google │
│                                                      │
│  [+ ADD URI]                                        │
└─────────────────────────────────────────────────────┘

                      [SAVE]
```

## 🔍 Verification Steps

After saving:

1. **Check the URL format:**
   - ✅ `http://localhost:3000/api/auth/callback/google`
   - ❌ `http://localhost:3000/api/auth/callback/google/` (no trailing slash)
   - ❌ `https://localhost:3000/...` (use http for localhost)

2. **Verify environment variables:**
   ```bash
   # Check .env.local
   cat .env.local | grep GOOGLE
   ```

   Should show:
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

3. **Verify NEXTAUTH_URL:**
   ```bash
   cat .env.local | grep NEXTAUTH_URL
   ```

   Should show for local development:
   ```
   NEXTAUTH_URL=http://localhost:3000
   ```

## 🐛 Still Not Working?

### Issue: Same error after adding URIs

**Wait 5-10 seconds** after saving in Google Cloud Console. Changes need to propagate.

Then:
```bash
# Restart your dev server
./scripts/restart.sh
```

### Issue: Different port (3001, 3002, etc.)

If your dev server is running on a different port:

1. Check which port you're using:
   ```bash
   ./scripts/status.sh
   ```

2. Add that port to Google Cloud Console:
   ```
   http://localhost:3001/api/auth/callback/google
   http://localhost:3002/api/auth/callback/google
   ```

### Issue: Wrong client ID or secret

1. Verify your credentials in Google Cloud Console
2. Copy the **entire** Client ID (should end in `.apps.googleusercontent.com`)
3. Copy the **entire** Client secret
4. Update `.env.local`:
   ```bash
   GOOGLE_CLIENT_ID=your-full-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-full-client-secret-here
   ```
5. Restart dev server

### Issue: OAuth consent screen not configured

If you see errors about consent screen:

1. Go to: **APIs & Services** → **OAuth consent screen**
2. Choose **Internal** (if in Google Workspace) or **External**
3. Fill in required fields:
   - App name: PS Assessments Portal
   - User support email: your@productschool.com
   - Developer contact: your@productschool.com
4. Save and continue
5. Skip scopes (default is fine)
6. Save

## 📝 Common Mistakes

| Mistake | Correct |
|---------|---------|
| ❌ `https://localhost:3000/...` | ✅ `http://localhost:3000/...` |
| ❌ `.../google/` (trailing slash) | ✅ `.../google` (no slash) |
| ❌ Wrong port number | ✅ Check actual port with `./scripts/status.sh` |
| ❌ Missing `/api/auth/callback/google` | ✅ Include full path |
| ❌ Typo in environment variable | ✅ Check `.env.local` spelling |

## 🎯 Quick Checklist

- [ ] Opened Google Cloud Console
- [ ] Found my OAuth 2.0 Client ID
- [ ] Added `http://localhost:3000/api/auth/callback/google` to redirect URIs
- [ ] Added `https://productschool.net/api/auth/callback/google` to redirect URIs
- [ ] Clicked Save
- [ ] Waited 10 seconds
- [ ] Restarted dev server
- [ ] Tested sign-in

---

**Estimated time:** 5 minutes
**Success rate:** 100% when URIs match exactly
