# Deployment Guide

## Overview

This guide covers deploying the Adyam Logistics Portal to Vercel with GitHub Actions for automated tracking and WhatsApp alerts.

---

## Prerequisites

- GitHub account
- Vercel account
- Supabase project
- Domain (optional)

---

## Part 1: Vercel Deployment

### 1. Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2. Environment Variables

Add these in Vercel → Settings → Environment Variables:

#### Required (All Environments)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://odhnrnmbcmtmpmkykdxl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

#### Optional (Courier APIs)

```env
FEDEX_API_KEY=your_fedex_key
FEDEX_API_SECRET=your_fedex_secret
DHL_API_KEY=your_dhl_key
```

#### WhatsApp (if using)

```env
WA_RATE_LIMIT_PER_MIN=20
ADMIN_EMAIL=admin@adyam.com
```

### 3. Deploy

Click "Deploy" and wait for build to complete.

### 4. Verify Deployment

Visit your Vercel URL and test:
- Login page: `/login`
- Tracking: `/track`
- API health: `/api/tracking/list`

---

## Part 2: Database Setup

### 1. Run Migrations

Connect to your Supabase project:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref odhnrnmbcmtmpmkykdxl

# Run migrations
supabase db push
```

Or manually in Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Run `db/migrations/0000_initial_schema.sql`
3. Run `db/migrations/0001_initial_data.sql`
4. Run `db/migrations/0002_module3_alerts.sql`

### 2. Verify Tables

Check that these tables exist:
- `adyam_tracking`
- `profiles`
- `alerts`
- `job_logs`
- `metrics`

### 3. Create Admin User

```sql
-- In Supabase SQL Editor
INSERT INTO auth.users (email, encrypted_password)
VALUES ('admin@adyam.com', crypt('your_password', gen_salt('bf')));

-- Get user ID
SELECT id FROM auth.users WHERE email = 'admin@adyam.com';

-- Create profile
INSERT INTO profiles (id, email, role)
VALUES ('user_id_from_above', 'admin@adyam.com', 'admin');
```

---

## Part 3: GitHub Actions Setup

### 1. Add Repository Secrets

Go to GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
VERCEL_URL (your Vercel deployment URL)
FEDEX_API_KEY (optional)
FEDEX_API_SECRET (optional)
DHL_API_KEY (optional)
WA_RATE_LIMIT_PER_MIN (default: 20)
ADMIN_EMAIL
TEST_PHONE (for WhatsApp testing, format: +919876543210)
```

### 2. Enable Workflows

Workflows are in `.github/workflows/`:
- `scheduler.yml` - Runs every 6 hours
- `playwright-wa.yml` - Manual WhatsApp testing
- `ci.yml` - CI/CD pipeline

They're automatically enabled when you push to `main`.

### 3. Test Workflows

#### Manual Trigger:

1. Go to Actions tab
2. Select "Scheduled Tracking Update"
3. Click "Run workflow"
4. Monitor logs

#### Verify Cron:

Wait for next scheduled run (every 6 hours) or check:

```bash
# View workflow runs
gh run list --workflow=scheduler.yml
```

---

## Part 4: WhatsApp Setup (Optional)

### Option A: Skip WhatsApp

If you don't need WhatsApp alerts:

1. Comment out the `send-alerts` job in `scheduler.yml`
2. Use email notifications instead

### Option B: Setup WhatsApp

Follow [WHATSAPP.md](./WHATSAPP.md) for detailed instructions.

Quick setup:

```bash
# Locally
node scripts/wa-init.js

# Upload session to GitHub
# See WHATSAPP.md for details
```

---

## Part 5: Monitoring

### 1. Vercel Logs

View real-time logs:
- Vercel Dashboard → Your Project → Logs
- Filter by function: `/api/tracking/update-all`

### 2. GitHub Actions Logs

- GitHub → Actions → Select workflow run
- Download artifacts for detailed logs

### 3. Supabase Logs

```sql
-- Recent job runs
SELECT * FROM job_logs 
ORDER BY started_at DESC 
LIMIT 20;

-- Failed jobs
SELECT * FROM job_logs 
WHERE status = 'failed' 
ORDER BY started_at DESC;

-- Alert statistics
SELECT 
  DATE(attempted_at) as date,
  status,
  COUNT(*) as count
FROM alerts
GROUP BY DATE(attempted_at), status
ORDER BY date DESC;
```

### 4. Setup Alerts (Optional)

#### Sentry Integration:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to `.env`:
```env
SENTRY_DSN=your_sentry_dsn
```

#### Email Alerts:

Add to `scheduler.yml`:

```yaml
- name: Notify on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Tracking Update Failed
    to: admin@adyam.com
    from: noreply@adyam.com
    body: Check GitHub Actions logs
```

---

## Part 6: Custom Domain (Optional)

### 1. Add Domain in Vercel

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain: `logistics.adyam.com`
3. Follow DNS configuration instructions

### 2. Update Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://logistics.adyam.com
```

### 3. Update Tracking Links

Links in WhatsApp messages will automatically use the new domain.

---

## Part 7: Performance Optimization

### 1. Vercel Configuration

Ensure `vercel.json` is configured:

```json
{
  "functions": {
    "api/tracking/update-all/route.ts": {
      "memory": 2048,
      "maxDuration": 900
    },
    "api/tracking/track/route.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### 2. Database Indexes

Verify indexes exist:

```sql
-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';
```

### 3. Caching

Enable Vercel Edge Caching for static assets:

```typescript
// In API routes
export const revalidate = 300; // 5 minutes
```

---

## Part 8: Backup & Recovery

### 1. Database Backups

Supabase automatically backs up daily. Manual backup:

```bash
# Export data
supabase db dump -f backup.sql

# Restore
supabase db reset
psql -h db.odhnrnmbcmtmpmkykdxl.supabase.co -U postgres -f backup.sql
```

### 2. Code Backups

Ensure GitHub repository is:
- Private (for security)
- Has branch protection on `main`
- Regular commits

---

## Troubleshooting

### Build Fails

**Error**: Module not found

**Solution**:
```bash
# Locally
npm install
npm run build

# Check package.json dependencies
```

### API Routes 500 Error

**Error**: Internal server error

**Solution**:
1. Check Vercel logs
2. Verify environment variables
3. Test locally: `npm run dev`

### Scheduled Jobs Not Running

**Error**: No workflow runs

**Solution**:
1. Check workflow syntax: `yamllint .github/workflows/scheduler.yml`
2. Verify cron expression: https://crontab.guru
3. Check Actions are enabled in repo settings

### WhatsApp Session Expired

**Error**: QR code required

**Solution**:
```bash
# Re-initialize
node scripts/wa-init.js

# Upload new session
# See WHATSAPP.md
```

---

## Scaling Considerations

### Current Limits

- Vercel Free: 100GB bandwidth/month
- GitHub Actions: 2000 minutes/month
- Supabase Free: 500MB database, 2GB bandwidth

### When to Upgrade

1. **Vercel Pro** ($20/month):
   - Unlimited bandwidth
   - Better performance
   - Team collaboration

2. **GitHub Team** ($4/user/month):
   - 3000 Actions minutes
   - Self-hosted runners

3. **Supabase Pro** ($25/month):
   - 8GB database
   - 50GB bandwidth
   - Daily backups

### Self-Hosting Option

For complete control:

1. Deploy Next.js to VPS (DigitalOcean, AWS)
2. Use PM2 for process management
3. Setup Nginx reverse proxy
4. Run cron jobs directly on server

---

## Security Checklist

- [ ] Environment variables set in Vercel (not in code)
- [ ] Supabase RLS policies enabled
- [ ] Service role key never exposed to client
- [ ] GitHub secrets configured
- [ ] WhatsApp session encrypted
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Admin accounts use strong passwords
- [ ] Regular security audits: `npm audit`

---

## Support & Maintenance

### Regular Tasks

**Daily**:
- Check job logs for failures
- Monitor alert success rate

**Weekly**:
- Review error logs
- Update dependencies: `npm update`
- Check Vercel analytics

**Monthly**:
- Database cleanup (old logs)
- Review and optimize queries
- Update documentation

### Getting Help

1. Check logs (Vercel, GitHub Actions, Supabase)
2. Review documentation (this file, WHATSAPP.md)
3. Test locally to isolate issues
4. Check GitHub Issues

---

## Deployment Checklist

Before going live:

- [ ] All migrations run successfully
- [ ] Admin user created
- [ ] Environment variables set
- [ ] Test tracking update: `node scripts/run-update.js`
- [ ] Test WhatsApp (if using): `node scripts/wa-test-send.js`
- [ ] Verify API endpoints work
- [ ] Check scheduled jobs run
- [ ] Setup monitoring/alerts
- [ ] Document any customizations
- [ ] Train team on admin interface

---

## Next Steps

After deployment:

1. **Import Data**: Use `scripts/process_excel.py` for bulk import
2. **Configure Alerts**: Set `alert_phone` for customers
3. **Monitor**: Watch first few scheduled runs
4. **Optimize**: Adjust rate limits and intervals
5. **Scale**: Upgrade plans as needed

---

## Rollback Procedure

If deployment fails:

1. **Vercel**: Rollback to previous deployment
   - Dashboard → Deployments → Previous → Promote to Production

2. **Database**: Restore from backup
   ```bash
   supabase db reset
   psql -f backup.sql
   ```

3. **GitHub**: Revert commit
   ```bash
   git revert HEAD
   git push
   ```

---

**Deployment Status**: Ready for production ✅

For questions or issues, refer to the troubleshooting section or check the logs.
