# Browser Cache Fix - Not Seeing UI Changes

## Issue
Changes were made to the UI but they're not appearing in the browser.

## Root Cause
Browser is showing cached version of the pages. Next.js hot reload sometimes doesn't force a hard refresh.

## ✅ Quick Fix

### Option 1: Hard Refresh (Recommended)

**On Mac:**
- Chrome/Edge: `Cmd + Shift + R` or `Cmd + Option + R`
- Safari: `Cmd + Option + E` (empty cache), then `Cmd + R`
- Firefox: `Cmd + Shift + R`

**On Windows:**
- Chrome/Edge/Firefox: `Ctrl + Shift + R` or `Ctrl + F5`

### Option 2: Clear Browser Cache

**Chrome/Edge:**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Safari:**
1. Go to Develop menu
2. Click "Empty Caches"
3. Refresh page (Cmd + R)

**Firefox:**
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Disable Cache" checkbox
4. Keep DevTools open and refresh

### Option 3: Incognito/Private Window

Open the site in a new incognito/private window:
- Chrome: `Cmd + Shift + N` (Mac) or `Ctrl + Shift + N` (Windows)
- Safari: `Cmd + Shift + N`
- Firefox: `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows)

Then visit: http://localhost:3000/assessments/admin/signin

### Option 4: Force Full Rebuild

If hard refresh doesn't work:

```bash
# Stop server
./scripts/stop.sh

# Clear all caches
rm -rf .next
rm -rf node_modules/.cache

# Restart
./scripts/start.sh
```

Then hard refresh your browser.

---

## What You Should See

### Sign-In Page
✅ Product School logo at the top (not just "PS" box)
✅ Cleaner, rounder card design
✅ "Assessments Portal" title
✅ Enhanced Google sign-in button

### Admin Dashboard (after sign-in)
✅ Product School logo in upper left corner
✅ "Assessments Portal | Admin" with divider
✅ Modern table with rounded corners
✅ "New Assessment" button (not "Add Assessment")

### If You Still See:
❌ Just "PS" box instead of full logo
❌ "Add Assessment" button
❌ "PS Assessments Portal" as title
❌ Basic rounded corners

Then the cache needs to be cleared.

---

## Verification Steps

1. **Check the URL:**
   - Make sure you're on `http://localhost:3000`
   - NOT on `http://localhost:3001` or `3002`

2. **Check server is running:**
   ```bash
   ./scripts/status.sh
   ```

3. **Hard refresh browser:**
   - `Cmd + Shift + R` (Mac)
   - `Ctrl + Shift + R` (Windows)

4. **Open DevTools Console:**
   - F12 → Console tab
   - Look for any red errors
   - If you see errors about ProductSchoolLogo, the component isn't loading

5. **Check Network tab:**
   - F12 → Network tab
   - Refresh page
   - Look for files being loaded
   - If you see "304 Not Modified" everywhere, cache is being used

---

## Nuclear Option

If nothing else works:

```bash
# Stop server
./scripts/stop.sh

# Clean everything
rm -rf .next
rm -rf node_modules/.cache

# Kill any other Next.js processes
pkill -f "next dev"

# Restart
./scripts/start.sh

# Open in incognito
# Then visit: http://localhost:3000/assessments/admin/signin
```

---

## Expected Changes Summary

| Element | Old | New |
|---------|-----|-----|
| Logo | "PS" box | Full Product School logo |
| Header | "PS Assessments Portal" | "Assessments Portal │ Admin" |
| Button | "Add Assessment" | "New Assessment" |
| Corners | rounded-md | rounded-lg/xl |
| Card shadow | Basic | Enhanced with hover |

---

**Most common solution:** Hard refresh with `Cmd + Shift + R` or `Ctrl + Shift + R`
