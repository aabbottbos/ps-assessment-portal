# Database Setup Guide

## Error

```
Invalid `prisma.assessment.findMany()` invocation:
The table `public.Assessment` does not exist in the current database.
```

## Root Cause

The database tables haven't been created yet. Prisma migrations need to be run to set up the schema.

## ✅ Quick Fix

### Step 1: Verify DATABASE_URL

Check that your `.env.local` file has a valid DATABASE_URL:

```bash
cat .env.local | grep DATABASE_URL
```

Should look like:
```
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

**If missing or incorrect:**
1. Get your connection string from [Neon Console](https://console.neon.tech)
2. Copy the **pooled connection string**
3. Add to `.env.local`:
   ```bash
   DATABASE_URL="your-neon-connection-string-here"
   ```

### Step 2: Create Initial Migration

```bash
# Create and run migrations
npx prisma migrate dev --name init
```

This will:
1. Connect to your database
2. Create the `Assessment` and `AccessLog` tables
3. Generate the Prisma client

**Expected output:**
```
Environment variables loaded from .env.local
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database

Applying migration `20240408_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240408_init/
      └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client
```

### Step 3: Verify Tables Created

```bash
# Check that tables exist
npx prisma db push --accept-data-loss
```

Or connect to your database and verify:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Should show:
- `Assessment`
- `AccessLog`

### Step 4: Restart Dev Server

```bash
./scripts/restart.sh
```

### Step 5: Test

Visit: http://localhost:3000/assessments/admin

You should now see the admin dashboard (empty, with "No assessments yet" message).

---

## 🗄️ What Gets Created

The migrations create these tables:

### Assessment Table
```sql
CREATE TABLE "Assessment" (
  id TEXT PRIMARY KEY,
  clientName TEXT NOT NULL,
  clientDescription TEXT,
  assessmentType TEXT NOT NULL,
  assessmentUrl TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  passwordRequired BOOLEAN DEFAULT true,
  password TEXT,
  status TEXT DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);
```

### AccessLog Table
```sql
CREATE TABLE "AccessLog" (
  id TEXT PRIMARY KEY,
  assessmentId TEXT NOT NULL,
  accessedAt TIMESTAMP DEFAULT now(),
  FOREIGN KEY (assessmentId) REFERENCES Assessment(id)
);
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Cause:** DATABASE_URL is incorrect or database is unreachable.

**Fix:**
1. Verify connection string in `.env.local`
2. Check Neon database is running (visit Neon Console)
3. Ensure you're using the **pooled connection string**
4. Verify connection string includes `?sslmode=require`

### Error: "Environment variable not found: DATABASE_URL"

**Cause:** `.env.local` file doesn't exist or DATABASE_URL is not set.

**Fix:**
```bash
# Copy example file
cp .env.local.example .env.local

# Edit and add your DATABASE_URL
nano .env.local  # or use your editor
```

### Error: "Migration already applied"

**Cause:** Migrations were already run.

**Solution:** This is fine! Skip to Step 4 (restart server).

### Error: "relation 'Assessment' already exists"

**Cause:** Tables already exist in the database.

**Solution:**
```bash
# Reset Prisma client
npx prisma generate

# Restart server
./scripts/restart.sh
```

### Tables exist but still getting error?

**Try:**
```bash
# Regenerate Prisma client
npx prisma generate

# Restart dev server
./scripts/restart.sh

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📋 Complete Setup Checklist

For a fresh database setup:

- [ ] Create Neon database project
- [ ] Copy pooled connection string
- [ ] Add `DATABASE_URL` to `.env.local`
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify tables created
- [ ] Restart dev server
- [ ] Test admin dashboard loads
- [ ] Try creating a test assessment

---

## 🔄 Alternative: Push Schema (Without Migration History)

If you just want to create the tables without migration history:

```bash
# Push schema directly to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Restart server
./scripts/restart.sh
```

**Note:** This is fine for development, but for production you should use migrations (`prisma migrate`).

---

## 🚀 Next Steps

After database is set up:

1. **Create your first assessment:**
   - Go to http://localhost:3000/assessments/admin
   - Click "Add Assessment"
   - Fill in the form
   - Save

2. **Test customer flow:**
   - Copy the assessment slug
   - Visit: http://localhost:3000/assessments/[your-slug]
   - Enter password
   - Verify iframe loads

3. **Check access logs:**
   - In admin dashboard, click "View Logs" on an assessment
   - Verify access was logged

---

**Estimated time:** 2 minutes
**Common issue:** Forgetting to set DATABASE_URL in .env.local
