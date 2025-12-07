# Adyam Logistics Portal

Production-grade logistics automation platform with real-time tracking, automated alerts, and comprehensive monitoring.

## ⚠️ IMPORTANT LEGAL NOTICE - WhatsApp Automation

**This project includes WhatsApp Web automation which may violate WhatsApp's Terms of Service.**

### Recommended for Production:

We **strongly recommend** using official WhatsApp Business API for production deployments:

1. **Twilio WhatsApp Business API** (Recommended)
   - Cost: ~$0.005-0.01 per message
   - Official, reliable, compliant
   - Setup: https://www.twilio.com/whatsapp

2. **Meta WhatsApp Business Platform**
   - Conversation-based pricing
   - Official API with templates
   - Setup: https://developers.facebook.com/docs/whatsapp

### Current Implementation:

The free WhatsApp Web automation (using Playwright) is provided for:
- **Educational purposes**
- **Small-scale personal use** (<50 messages/day)
- **Development/testing**

**Risks**:
- Account suspension/ban
- Session expiration
- UI changes breaking automation
- No delivery guarantees

See `DOCS/WHATSAPP.md` for migration guide to paid APIs.

---

## Features

- ✅ **Multi-Courier Tracking**: FedEx, DHL, ICL, United Express, Courier Wala, Atlantic
- ✅ **Automated Updates**: Scheduled tracking every 6 hours via GitHub Actions
- ✅ **WhatsApp Alerts**: Customer notifications with retry logic
- ✅ **Role-Based Access**: Admin and Employee roles with RLS
- ✅ **Real-Time Dashboard**: Interactive maps and tracking interface
- ✅ **Comprehensive Logging**: Job logs, metrics, and alerts tracking
- ✅ **Production-Ready**: Error handling, retries, monitoring

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_ORG/adyam-logistics-portal.git
cd adyam-logistics-portal
```

### 2. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 3. Configure Environment

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Documentation

- **[Deployment Guide](DOCS/DEPLOY.md)** - Complete deployment to Vercel
- **[WhatsApp Setup](DOCS/WHATSAPP.md)** - WhatsApp integration & alternatives
- **[Module 1](MODULE_1_README.md)** - Foundation & database
- **[Module 2](MODULE_2_README.md)** - Tracking engine
- **[Module 3](MODULE_3_COMPLETE.md)** - Scheduling & alerts

---

## Architecture

```
┌─────────────────┐
│  Next.js 14     │
│  (Frontend)     │
└────────┬────────┘
         │
    ┌────▼────────────────┐
    │  Supabase           │
    │  (Database + Auth)  │
    └────────┬────────────┘
             │
    ┌────────▼────────────┐
    │  Tracking Engine    │
    │  (6 Providers)      │
    └────────┬────────────┘
             │
    ┌────────▼────────────┐
    │  GitHub Actions     │
    │  (Scheduler)        │
    └────────┬────────────┘
             │
    ┌────────▼────────────┐
    │  WhatsApp Alerts    │
    │  (Playwright)       │
    └─────────────────────┘
```

---

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth with RLS
- **Tracking**: Playwright, Courier APIs
- **Alerts**: WhatsApp Web (Playwright) / Twilio (recommended)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel
- **Monitoring**: Supabase logs, Sentry (optional)

---

## Project Structure

```
adyam-logistics-portal/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Employee dashboard
│   ├── admin/             # Admin interface
│   └── track/             # Public tracking
├── components/            # React components
│   ├── ui/               # Atomic components
│   ├── tracking/         # Tracking components
│   └── providers/        # Context providers
├── lib/                   # Core libraries
│   ├── tracking/         # Tracking engine
│   ├── scraper/          # Playwright scrapers
│   ├── whatsapp/         # WhatsApp client
│   ├── alerts/           # Alert manager
│   ├── geo/              # Geocoding
│   └── logs/             # Logging
├── db/                    # Database
│   └── migrations/       # SQL migrations
├── scripts/               # Automation scripts
├── .github/workflows/     # CI/CD workflows
└── DOCS/                  # Documentation
```

---

## Testing

### Test Tracking Providers

```bash
npm run test:tracking
```

### Test WhatsApp (Dry Run)

```bash
node scripts/wa-dryrun.js
```

### Test Single Message

```bash
node scripts/wa-test-send.js "+919876543210" "Test message"
```

---

## Deployment

See [DOCS/DEPLOY.md](DOCS/DEPLOY.md) for complete deployment guide.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Configure GitHub Actions

1. Add secrets to repository
2. Enable workflows
3. Monitor scheduled runs

---

## Security

- ✅ Environment variables for secrets
- ✅ Supabase RLS policies
- ✅ Service role key server-side only
- ✅ GitHub Actions secrets
- ✅ Encrypted WhatsApp session
- ✅ HTTPS (Vercel automatic)

---

## Monitoring

### Check Job Logs

```sql
SELECT * FROM job_logs 
ORDER BY started_at DESC 
LIMIT 20;
```

### Alert Statistics

```sql
SELECT 
  status,
  COUNT(*) as count
FROM alerts
WHERE attempted_at > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

---

## Support

For issues:
1. Check logs (Vercel, GitHub Actions, Supabase)
2. Review documentation
3. Test locally
4. Open GitHub issue

---

## License

MIT License - See LICENSE file

---

## Contributors

Built with ❤️ for Adyam Logistics

---

**Production Readiness**: ✅ Ready for deployment

**Last Updated**: 2025-12-07
