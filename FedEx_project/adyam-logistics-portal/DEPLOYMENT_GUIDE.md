# 🚀 Complete Step-by-Step Deployment Guide
## Adyam Logistics Platform - From Zero to Production

**Last Updated**: 2025-12-07  
**Estimated Time**: 2-3 hours  
**Difficulty**: Intermediate

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Local Setup](#phase-1-local-setup)
3. [Phase 2: Database Setup](#phase-2-database-setup)
4. [Phase 3: Application Configuration](#phase-3-application-configuration)
5. [Phase 4: Testing Locally](#phase-4-testing-locally)
6. [Phase 5: Vercel Deployment](#phase-5-vercel-deployment)
7. [Phase 6: GitHub Actions Setup](#phase-6-github-actions-setup)
8. [Phase 7: WhatsApp Integration (Optional)](#phase-7-whatsapp-integration-optional)
9. [Phase 8: Production Verification](#phase-8-production-verification)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [ ] GitHub account
- [ ] Vercel account (free tier)
- [ ] Supabase account (free tier)
- [ ] WhatsApp account (optional, for alerts)

### Required Software
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt

### Required Knowledge
- Basic command line usage
- Basic understanding of environment variables
- GitHub basics (clone, commit, push)

---

## Phase 1: Local Setup

### Step 1.1: Clone the Repository

```bash
# Navigate to your projects folder
cd "F:\Free Lancing\Naveen\FedEx-Couriers\FedEx_project"

# If not already cloned, clone the repository
git clone <your-repo-url> adyam-logistics-portal
cd adyam-logistics-portal
```

**Expected Output**: Repository cloned successfully

---

### Step 1.2: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# This will take 2-3 minutes
```

**Expected Output**:
```
added 500+ packages in 2m
```

**Verify Installation**:
```bash
npm list --depth=0
```

You should see:
- next@16.0.7
- react@19.2.0
- @supabase/supabase-js@^2.86.2
- playwright@^1.57.0

---

### Step 1.3: Install Playwright Browsers

```bash
# Install Chromium for web scraping
npx playwright install chromium

# This will download ~300MB
```

**Expected Output**:
```
Downloading Chromium 123.0.6312.4
Chromium 123.0.6312.4 downloaded to ...
```

---

## Phase 2: Database Setup

### Step 2.1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Name**: `adyam-logistics`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., Mumbai)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

**Screenshot Location**: Project should appear in dashboard

---

### Step 2.2: Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them soon):

```
Project URL: https://odhnrnmbcmtmpmkykdxl.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANT**: Keep `service_role` key secret!

---

### Step 2.3: Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Run migrations **in this exact order**:

#### Migration 1: Base Schema
```sql
-- Copy entire contents of db/migrations/0000_initial_schema.sql
-- Paste in SQL Editor
-- Click "Run"
```

**Expected Output**: `Success. No rows returned`

#### Migration 2: Initial Data
```sql
-- Copy entire contents of db/migrations/0001_initial_data.sql
-- Paste in SQL Editor
-- Click "Run"
```

**Expected Output**: `Success. Inserted 150 rows` (or your dataset size)

#### Migration 3: Alert Tables
```sql
-- Copy entire contents of db/migrations/0002_module3_alerts.sql
-- Paste in SQL Editor
-- Click "Run"
```

**Expected Output**: `Success. No rows returned`

#### Migration 4: Atomic Claiming
```sql
-- Copy entire contents of db/migrations/0003_atomic_claiming.sql
-- Paste in SQL Editor
-- Click "Run"
```

**Expected Output**: `Success. No rows returned`

---

### Step 2.4: Verify Database Setup

In SQL Editor, run:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Expected Output**: You should see:
- `adyam_tracking`
- `profiles`
- `alerts`
- `job_logs`
- `metrics`

```sql
-- Check data imported
SELECT COUNT(*) FROM adyam_tracking;
```

**Expected Output**: `150` (or your dataset size)

---

### Step 2.5: Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **"Add User"** → **"Create new user"**
3. Fill in:
   - **Email**: `admin@adyam.com` (or your email)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✓ Check this
4. Click **"Create user"**
5. Copy the **User UID** (you'll need it next)

Now, in **SQL Editor**, run:

```sql
-- Replace 'USER_UID_HERE' with the actual UID you copied
INSERT INTO public.profiles (id, email, role)
VALUES ('USER_UID_HERE', 'admin@adyam.com', 'admin');
```

**Expected Output**: `Success. 1 row inserted`

**Verify**:
```sql
SELECT * FROM profiles WHERE role = 'admin';
```

You should see your admin user.

---

## Phase 3: Application Configuration

### Step 3.1: Create Environment File

In your project root, create `.env.local`:

```bash
# In terminal
cd adyam-logistics-portal
notepad .env.local
```

Paste this content (replace with your actual values):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://odhnrnmbcmtmpmkykdxl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application URL (for local testing)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# WhatsApp Configuration (optional for now)
WA_RATE_LIMIT_PER_MIN=20
ADMIN_EMAIL=admin@adyam.com

# Courier API Keys (optional - will use scrapers if not provided)
# FEDEX_API_KEY=your_key_here
# FEDEX_API_SECRET=your_secret_here
# DHL_API_KEY=your_key_here
```

**Save the file** (Ctrl+S)

⚠️ **NEVER commit `.env.local` to Git!** (It's already in `.gitignore`)

---

### Step 3.2: Verify Environment Variables

```bash
# Check if file exists
dir .env.local

# Should show the file
```

---

## Phase 4: Testing Locally

### Step 4.1: Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
  ▲ Next.js 16.0.7
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 3.2s
```

**Keep this terminal open!**

---

### Step 4.2: Test Login Page

1. Open browser: `http://localhost:3000`
2. You should be redirected to `/login`
3. Enter your admin credentials:
   - Email: `admin@adyam.com`
   - Password: (the one you created)
4. Click **"Sign In"**

**Expected Result**: Redirected to `/dashboard`

---

### Step 4.3: Test Dashboard

On the dashboard, you should see:
- Welcome message
- Navigation sidebar
- Shipment statistics (if data imported)

**Verify Navigation**:
- Click **"Dashboard"** - Should show overview
- Click **"Admin Table"** - Should show data table
- Click **"Track"** - Should show tracking form

---

### Step 4.4: Test Tracking

1. Go to `/track` page
2. Enter a sample AWB from your dataset (e.g., `886520976940`)
3. Click **"Track Shipment"**

**Expected Result**: 
- Loading indicator appears
- Tracking details display
- Status, location, events shown

⚠️ **Note**: First tracking may take 15-30 seconds (Playwright initialization)

---

### Step 4.5: Test Tracking Update Script

Open a **new terminal** (keep dev server running):

```bash
# Test the update script
node scripts/run-update.js
```

**Expected Output**:
```
🚀 Starting tracking update...
Endpoint: http://localhost:3000/api/tracking/update-all

✅ Update completed successfully
Duration: 45.32s

Summary:
  Checked: 150
  Delivered: 12
  Failed: 3

Logs:
  ✓ 886520976940: Delivered
  ✓ 99195357: In Transit
  ...
```

---

### Step 4.6: Test Provider Adapters

```bash
# Test all tracking providers
npm run test:tracking
```

**Expected Output**:
```
🚀 Starting Tracking Provider Tests
============================================================

📦 Testing FedEx - AWB: 886520976940
✅ Success!
   Provider: FedEx
   Status: Delivered
   Events: 8

📦 Testing DHL - AWB: 99195357
✅ Success!
   Provider: DHL
   Status: In Transit
   Events: 5

... (tests for all 6 providers)
```

---

## Phase 5: Vercel Deployment

### Step 5.1: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Adyam Logistics Platform"

# Create GitHub repository (via GitHub website)
# Then add remote and push:
git remote add origin https://github.com/YOUR_USERNAME/adyam-logistics-portal.git
git branch -M main
git push -u origin main
```

**Verify**: Check GitHub - all files should be uploaded

---

### Step 5.2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

**Don't click Deploy yet!**

---

### Step 5.3: Add Environment Variables in Vercel

In the Vercel import screen:

1. Click **"Environment Variables"**
2. Add these variables **one by one**:

```
NEXT_PUBLIC_SUPABASE_URL = https://odhnrnmbcmtmpmkykdxl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app (will update after deploy)
WA_RATE_LIMIT_PER_MIN = 20
ADMIN_EMAIL = admin@adyam.com
```

**Important**: 
- Select **"Production"**, **"Preview"**, and **"Development"** for each
- Click **"Add"** after each variable

---

### Step 5.4: Deploy to Vercel

1. Click **"Deploy"**
2. Wait 2-3 minutes for build

**Expected Output**:
```
Building...
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Deployment Ready!
```

3. Click **"Visit"** to see your live site

---

### Step 5.5: Update App URL

1. Copy your Vercel URL (e.g., `https://adyam-logistics.vercel.app`)
2. In Vercel dashboard, go to **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_APP_URL`:
   - Change from `https://your-app.vercel.app`
   - To your actual URL: `https://adyam-logistics.vercel.app`
4. Click **"Save"**
5. Go to **Deployments** → Click **"Redeploy"** on latest deployment

---

### Step 5.6: Verify Production Deployment

1. Visit your Vercel URL
2. Test login with admin credentials
3. Test tracking a shipment
4. Verify dashboard loads

**All should work exactly like local!**

---

## Phase 6: GitHub Actions Setup

### Step 6.1: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these secrets **one by one**:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://odhnrnmbcmtmpmkykdxl.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Name: VERCEL_URL
Value: https://adyam-logistics.vercel.app

Name: WA_RATE_LIMIT_PER_MIN
Value: 20

Name: ADMIN_EMAIL
Value: admin@adyam.com

Name: TEST_PHONE (for WhatsApp testing later)
Value: +919876543210
```

Click **"Add secret"** for each.

---

### Step 6.2: Enable GitHub Actions

1. In your repository, go to **Actions** tab
2. You should see workflows:
   - **Scheduled Tracking Update**
   - **WhatsApp Playwright**
   - **CI**
3. Click **"I understand my workflows, go ahead and enable them"**

---

### Step 6.3: Test Manual Workflow Run

1. Go to **Actions** tab
2. Click **"Scheduled Tracking Update"**
3. Click **"Run workflow"** → **"Run workflow"**
4. Wait 5-10 minutes
5. Click on the running workflow to see logs

**Expected Output**:
```
Run node scripts/run-update.js
🚀 Starting tracking update...
✅ Update completed successfully
Duration: 245.32s
Summary:
  Checked: 150
  Delivered: 12
  Failed: 3
```

---

### Step 6.4: Verify Scheduled Runs

The workflow is configured to run **every 6 hours**:
- 00:00 UTC (05:30 IST)
- 06:00 UTC (11:30 IST)
- 12:00 UTC (17:30 IST)
- 18:00 UTC (23:30 IST)

**Check next run**:
1. Go to **Actions** → **Scheduled Tracking Update**
2. You'll see next scheduled run time

---

## Phase 7: WhatsApp Integration (Optional)

⚠️ **Legal Notice**: WhatsApp Web automation may violate ToS. Use official API for production.

### Step 7.1: Initialize WhatsApp Session Locally

```bash
# Make sure dev server is NOT running
# Close it with Ctrl+C if needed

# Run initialization script
node scripts/wa-init.js
```

**Expected Output**:
```
🔐 WhatsApp Session Initialization
===================================

1. Launching browser...
2. Opening WhatsApp Web...
Waiting for QR code scan...
Please scan the QR code in the browser window
```

**Action Required**:
1. Browser window opens with WhatsApp Web
2. Open WhatsApp on your phone
3. Go to **Settings** → **Linked Devices**
4. Tap **"Link a Device"**
5. Scan the QR code in the browser

**Expected Output** (after scan):
```
✓ Successfully logged in to WhatsApp Web
📁 Session saved to: .whatsapp/session.json

⚠️  IMPORTANT:
  - Keep session.json secure (never commit to public repo)
  - Upload as GitHub Actions artifact or use self-hosted runner
  - Session expires after ~2 weeks of inactivity
```

---

### Step 7.2: Test WhatsApp Send

```bash
# Test sending a message to yourself
node scripts/wa-test-send.js "+919876543210" "Test from Adyam Logistics"
```

**Expected Output**:
```
📱 WhatsApp Test Send
=====================

Phone: +919876543210
Message: Test from Adyam Logistics

Sending message...

✅ Message sent successfully!
```

**Verify**: Check your WhatsApp - you should receive the message

---

### Step 7.3: Upload Session to GitHub Actions

**Option A: Manual Upload (Simple)**

1. Compress `.whatsapp/session.json`
2. Go to GitHub → **Actions** → **WhatsApp Playwright**
3. Click **"Run workflow"**
4. Select **"test"** action
5. This will create an artifact placeholder

**Option B: Self-Hosted Runner (Recommended for Production)**

See `DOCS/WHATSAPP.md` Section "Option B: Self-Hosted Runner"

---

### Step 7.4: Set Phone Numbers for Alerts

See `DOCS/PHONE_NUMBERS.md` for detailed instructions.

**Quick method** (SQL):

```sql
-- In Supabase SQL Editor
UPDATE public.adyam_tracking
SET alert_phone = '+919876543210'
WHERE awb_no = '886520976940';

-- Or set for all records (for testing)
UPDATE public.adyam_tracking
SET alert_phone = '+919876543210'
WHERE alert_phone IS NULL
LIMIT 10; -- Start with 10 for testing
```

---

### Step 7.5: Test Alert System

```bash
# Dry run (no messages sent)
node scripts/wa-dryrun.js
```

**Expected Output**:
```
🧪 WhatsApp Alert Dry Run
=========================

Found 10 candidates:

1. AWB: 886520976940
   Customer: John Doe
   Phone: +919876543210
   Status: In Transit
   Location: Mumbai, MH

... (9 more)

✓ Dry run completed (no messages sent)
```

**If looks good, send real alerts**:

```bash
node scripts/wa-send.js
```

**Expected Output**:
```
📱 Starting WhatsApp alert job...

✅ Alert job completed
Duration: 180.45s

Summary:
  Processed: 10
  Succeeded: 10
  Failed: 0
```

---

## Phase 8: Production Verification

### Step 8.1: Verify All Systems

**Checklist**:

- [ ] **Website**: Visit Vercel URL, login works
- [ ] **Dashboard**: Shows data correctly
- [ ] **Tracking**: Can track shipments
- [ ] **Admin Table**: Can view/edit data
- [ ] **Database**: All migrations applied
- [ ] **GitHub Actions**: Scheduled workflow enabled
- [ ] **Logs**: Check Supabase logs for errors
- [ ] **WhatsApp** (if enabled): Test messages sent

---

### Step 8.2: Monitor First Scheduled Run

Wait for the next scheduled run (every 6 hours):

1. Go to GitHub → **Actions**
2. Watch for new workflow run
3. Check logs for success
4. Verify database updated:

```sql
-- In Supabase SQL Editor
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE last_checked_at > NOW() - INTERVAL '1 hour') as updated_recently
FROM adyam_tracking;
```

---

### Step 8.3: Check Metrics

```sql
-- Alert success rate
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM alerts
WHERE attempted_at > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

**Target**: >95% success rate

```sql
-- Job logs
SELECT * FROM job_logs 
ORDER BY started_at DESC 
LIMIT 10;
```

**Verify**: All jobs show `status = 'success'`

---

### Step 8.4: Set Up Monitoring Alerts (Optional)

**Option 1: Vercel Notifications**
1. Vercel Dashboard → **Settings** → **Notifications**
2. Enable **"Deployment Failed"** notifications

**Option 2: GitHub Actions Notifications**
1. GitHub → **Settings** → **Notifications**
2. Enable **"Actions"** notifications

**Option 3: Sentry (Advanced)**
See `DOCS/DEPLOY.md` Section "Monitoring"

---

## Troubleshooting

### Issue: Build Fails on Vercel

**Error**: `Module not found`

**Solution**:
```bash
# Locally, verify build works
npm run build

# If fails, check package.json dependencies
npm install

# Commit and push
git add package-lock.json
git commit -m "Update dependencies"
git push
```

---

### Issue: Database Connection Error

**Error**: `Invalid Supabase URL`

**Solution**:
1. Verify `.env.local` has correct URL
2. Check Vercel environment variables
3. Ensure no extra spaces in env vars
4. Redeploy Vercel

---

### Issue: Login Not Working

**Error**: `Invalid login credentials`

**Solution**:
1. Verify user exists in Supabase → **Authentication** → **Users**
2. Check profile exists:
```sql
SELECT * FROM profiles WHERE email = 'admin@adyam.com';
```
3. If missing, create profile (see Step 2.5)

---

### Issue: Tracking Timeout

**Error**: `Timeout exceeded`

**Solution**:
1. Increase timeout in `vercel.json`:
```json
{
  "functions": {
    "api/tracking/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```
2. Commit and redeploy

---

### Issue: WhatsApp Session Expired

**Error**: `Please scan QR code`

**Solution**:
```bash
# Re-initialize session
node scripts/wa-init.js

# Upload new session to GitHub Actions
# See Step 7.3
```

---

### Issue: GitHub Actions Failing

**Error**: `SUPABASE_SERVICE_ROLE_KEY is not defined`

**Solution**:
1. Verify secret exists: GitHub → **Settings** → **Secrets**
2. Check secret name matches exactly (case-sensitive)
3. Re-add secret if needed
4. Re-run workflow

---

## Next Steps

### Immediate (First Week)
1. Monitor scheduled runs daily
2. Check alert success rate
3. Verify no errors in logs
4. Test with real customer data

### Short Term (First Month)
1. Populate phone numbers for all customers
2. Optimize scraper selectors if needed
3. Add more courier providers if required
4. Set up proper monitoring (Sentry)

### Long Term
1. Migrate to official WhatsApp Business API
2. Add email notifications
3. Implement advanced analytics
4. Mobile app integration

---

## Support Resources

- **Documentation**: Check `DOCS/` folder
- **Audit Report**: `PRODUCTION_AUDIT_REPORT.md`
- **Module Guides**: `MODULE_1_README.md`, `MODULE_2_README.md`, `MODULE_3_COMPLETE.md`
- **Troubleshooting**: `DOCS/DEPLOY.md` Section "Troubleshooting"

---

## Success Criteria

✅ **Deployment Successful** when:
- Website accessible at Vercel URL
- Login works for admin user
- Tracking updates run every 6 hours
- Database shows updated data
- No critical errors in logs
- Alert success rate >90%

---

**🎉 Congratulations!** Your Adyam Logistics Platform is now live in production!

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Production URL**: _______________

---

**Last Updated**: 2025-12-07  
**Version**: 1.0.0
