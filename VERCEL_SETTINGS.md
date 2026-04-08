# Vercel Settings - Visual Guide

Quick visual reference for correct Vercel project settings.

## ⚙️ Build & Development Settings

Navigate to: **Your Project → Settings → General → Build & Development Settings**

### Correct Configuration

```
┌─────────────────────────────────────────────────────┐
│ Framework Preset                                    │
│ ● Next.js                              [Auto-detected]│
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Build Command                                        │
│ ○ Override: [ Leave empty or: npm run build      ] │
│ (Recommended: Leave empty to use default)           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Output Directory                                     │
│ [ .next                                           ] │
│ (Default - do not change)                           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Install Command                                      │
│ [ npm install                                     ] │
│ (Default - do not change)                           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Development Command                                  │
│ [ npm run dev                                     ] │
│ (Default - do not change)                           │
└─────────────────────────────────────────────────────┘
```

### ❌ Common Mistakes

**Don't use these build commands:**
```
❌ npx prisma migrate deploy && next build
❌ prisma migrate deploy && next build
❌ prisma generate && npx prisma migrate deploy && next build
```

**Why?** These commands:
- Have shell escaping issues in Vercel
- `migrate deploy` shouldn't run during build (run manually instead)
- Already handled by `package.json` scripts

## 🔐 Environment Variables

Navigate to: **Your Project → Settings → Environment Variables**

### Required Variables

Set these for **all three environments** (Production, Preview, Development):

```
┌─────────────────────────────────────────────────────┐
│ DATABASE_URL                                         │
│ [postgresql://user:pass@host/db?sslmode=require   ] │
│ ☑ Production  ☑ Preview  ☑ Development            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ NEXTAUTH_SECRET                                      │
│ [your-randomly-generated-secret                   ] │
│ ☑ Production  ☑ Preview  ☑ Development            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ NEXTAUTH_URL                                         │
│ Production:   [https://productschool.net          ] │
│ Preview/Dev:  [https://your-preview.vercel.app    ] │
│ ☑ Production  ☑ Preview  ☑ Development            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ GOOGLE_CLIENT_ID                                     │
│ [your-google-oauth-client-id                      ] │
│ ☑ Production  ☑ Preview  ☑ Development            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ GOOGLE_CLIENT_SECRET                                 │
│ [your-google-oauth-client-secret                  ] │
│ ☑ Production  ☑ Preview  ☑ Development            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ASSESSMENT_SESSION_SECRET                            │
│ [your-randomly-generated-secret                   ] │
│ ☑ Production  ☑ Preview  ☑ Development            │
└─────────────────────────────────────────────────────┘
```

### 🎯 Key Points

1. **All environments**: Check all three boxes for each variable
2. **DATABASE_URL**: Use **pooled connection string** from Neon
3. **NEXTAUTH_URL**: Adjust for Preview/Dev branches (or use same)
4. **Secrets**: Generate with `openssl rand -base64 32`

## 🚀 Deployment Flow

```
┌─────────────────┐
│  Push to GitHub │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Vercel detects  │
│ new commit      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ npm install                 │
│ └─> prisma generate (auto) │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ npm run build               │
│ └─> prisma generate         │
│ └─> next build              │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐
│ Deploy to Edge  │
└─────────────────┘
```

## 📋 Deployment Checklist

Before deploying, ensure:

- [ ] Latest code pushed to GitHub
- [ ] `package.json` has updated build script
- [ ] Build command in Vercel is empty or `npm run build`
- [ ] All 6 environment variables are set
- [ ] All variables checked for all 3 environments
- [ ] `DATABASE_URL` is pooled connection string
- [ ] Google OAuth redirect URIs include production domain

After deploying:

- [ ] Build completes without errors
- [ ] Admin login works (`/assessments/admin`)
- [ ] Can create assessment
- [ ] Customer password flow works
- [ ] Logs show no errors

## 🐛 Quick Troubleshooting

### Build fails immediately
→ Check environment variables are set

### "Prisma: command not found"
→ Remove custom build command, use default

### "Failed to collect page data"
→ Verify all environment variables are set for all environments

### "Can't reach database"
→ Check `DATABASE_URL` is correct pooled connection string

### 404 on routes
→ Verify build completed successfully, check Vercel build logs

## 📞 Need Help?

1. Check build logs: **Deployments → [Latest] → Building**
2. Check function logs: **Deployments → [Latest] → Functions**
3. Review: `VERCEL_BUILD_FIX.md` for detailed troubleshooting

---

**TL;DR:**
1. Leave build command **empty** in Vercel settings
2. Set **all 6 environment variables** for all environments
3. Push to GitHub and let Vercel do its thing
