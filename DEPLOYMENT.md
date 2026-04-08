# Deployment Guide

This guide walks you through deploying the PS Assessments Portal to Vercel with a Neon PostgreSQL database.

## Prerequisites

- [Vercel account](https://vercel.com)
- [Neon account](https://neon.tech) (or existing Neon project)
- [Google Cloud Console](https://console.cloud.google.com) project for OAuth
- Domain `productschool.net` access for DNS configuration

## Step 1: Set Up Neon Database

1. **Create a Neon project** (or use an existing one)

   - Go to [Neon Console](https://console.neon.tech)
   - Create a new project or select an existing project
   - **Enable connection pooling** for serverless compatibility

2. **Get your connection string**

   - In the Neon dashboard, go to your project
   - Navigate to the "Connection Details" section
   - Copy the **pooled connection string** (it should include `?sslmode=require`)
   - Save this for later as `DATABASE_URL`

## Step 2: Set Up Google OAuth

1. **Go to Google Cloud Console**

   - Navigate to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one

2. **Enable Google+ API**

   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth 2.0 credentials**

   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "PS Assessments Portal"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local development)
     - `https://productschool.net` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (local)
     - `https://productschool.net/api/auth/callback/google` (production)
   - Click "Create"

4. **Save your credentials**
   - Copy the **Client ID** → save as `GOOGLE_CLIENT_ID`
   - Copy the **Client Secret** → save as `GOOGLE_CLIENT_SECRET`

## Step 3: Generate Secrets

Generate random secrets for JWT signing:

```bash
# For NEXTAUTH_SECRET
openssl rand -base64 32

# For ASSESSMENT_SESSION_SECRET
openssl rand -base64 32
```

Save these values for the next step.

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Push your code to GitHub** (if not already done)

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import project to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Framework Preset: Next.js (auto-detected)

3. **Configure environment variables**

   In the Vercel project settings, add the following environment variables:

   | Variable                     | Value                                      |
   | ---------------------------- | ------------------------------------------ |
   | `DATABASE_URL`               | Your Neon pooled connection string         |
   | `NEXTAUTH_SECRET`            | Generated secret (step 3)                  |
   | `NEXTAUTH_URL`               | `https://productschool.net`                |
   | `GOOGLE_CLIENT_ID`           | From Google OAuth (step 2)                 |
   | `GOOGLE_CLIENT_SECRET`       | From Google OAuth (step 2)                 |
   | `ASSESSMENT_SESSION_SECRET`  | Generated secret (step 3)                  |

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add ASSESSMENT_SESSION_SECRET

# Deploy to production
vercel --prod
```

## Step 5: Run Database Migrations

After the first deployment, you need to run Prisma migrations:

```bash
# In your local terminal, with DATABASE_URL set in .env.local
npx prisma migrate deploy
```

Alternatively, you can add a build command in Vercel:

1. Go to Project Settings → General → Build & Development Settings
2. Build Command: `npx prisma migrate deploy && next build`
3. Redeploy the project

## Step 6: Configure Custom Domain

1. **Add domain in Vercel**

   - Go to your project → Settings → Domains
   - Add `productschool.net`
   - Vercel will provide DNS records

2. **Update DNS records**

   - Go to your domain registrar or DNS provider
   - Add the DNS records provided by Vercel (usually A and CNAME records)
   - Wait for DNS propagation (can take up to 48 hours, usually much faster)

3. **Verify HTTPS**
   - Vercel automatically provisions SSL certificates
   - Once DNS is configured, `https://productschool.net` should work

## Step 7: Update Google OAuth Redirect URIs

1. Go back to Google Cloud Console
2. Update the OAuth client to ensure `https://productschool.net/api/auth/callback/google` is in the authorized redirect URIs
3. Remove localhost URLs if deploying to production only

## Step 8: Test the Deployment

1. **Test admin access**

   - Navigate to `https://productschool.net/assessments/admin`
   - Sign in with a @productschool.com Google account
   - Verify you can access the dashboard

2. **Create a test assessment**

   - Add a new assessment in the admin dashboard
   - Use a real Vercel URL for testing

3. **Test customer access**
   - Navigate to the assessment slug URL
   - Enter the password
   - Verify the iframe loads correctly

## Troubleshooting

### Database Connection Issues

- Ensure you're using the **pooled connection string** from Neon
- Verify the connection string includes `?sslmode=require`
- Check that connection pooling is enabled in Neon

### OAuth Not Working

- Verify redirect URIs match exactly (including trailing slashes)
- Ensure `NEXTAUTH_URL` matches your production domain
- Check that Google+ API is enabled

### Environment Variables Not Loading

- Environment variables are only loaded after deployment
- If you add new variables, you must redeploy
- Check spelling and formatting of variable names

### Prisma Migrate Issues

- Ensure `DATABASE_URL` is set correctly
- Run `npx prisma generate` before `prisma migrate deploy`
- Check Vercel build logs for errors

## Maintenance

### Updating the Application

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push origin main

# Vercel will automatically deploy
```

### Database Migrations

When you modify the Prisma schema:

```bash
# Create a new migration
npx prisma migrate dev --name description_of_change

# Commit the migration files
git add prisma/migrations
git commit -m "Add database migration"
git push origin main

# Vercel will automatically run migrations during build
```

### Monitoring

- View deployment logs in Vercel Dashboard
- Check Neon Dashboard for database metrics
- Monitor Google OAuth usage in Google Cloud Console

## Security Checklist

- [ ] All environment variables are set in Vercel (not committed to git)
- [ ] `NEXTAUTH_SECRET` and `ASSESSMENT_SESSION_SECRET` are strong random strings
- [ ] Google OAuth is restricted to @productschool.com domain
- [ ] Database connection uses SSL (`sslmode=require`)
- [ ] Custom domain has HTTPS enabled
- [ ] Test OAuth flow with multiple @productschool.com accounts
- [ ] Verify non-@productschool.com accounts cannot sign in
- [ ] Test that assessment URLs are not exposed in the browser

## Support

For issues or questions:

1. Check the [README.md](./README.md) for general documentation
2. Review Vercel deployment logs
3. Check Neon database status
4. Contact Product School development team

## Next Steps

After successful deployment:

1. Create your first assessment
2. Share the assessment URL with a client
3. Monitor access logs
4. Plan for Phase 2 features (see README.md)
