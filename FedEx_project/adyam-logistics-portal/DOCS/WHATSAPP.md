# WhatsApp Integration Guide

## ⚠️ IMPORTANT LEGAL NOTICE

**WhatsApp Web automation may violate WhatsApp's Terms of Service.** This implementation is provided for educational purposes and small-scale personal use only. For production use, we **strongly recommend** using official APIs:

### Recommended Paid Alternatives:

1. **Twilio WhatsApp Business API** (Recommended)
   - Cost: ~$0.005-0.01 per message
   - Pros: Official, reliable, scalable, compliant
   - Setup: https://www.twilio.com/whatsapp
   - Integration: Replace `whatsappClient.ts` with Twilio SDK

2. **Meta (Facebook) WhatsApp Business Platform**
   - Cost: Conversation-based pricing (~$0.01-0.05)
   - Pros: Official, feature-rich, templates
   - Setup: https://developers.facebook.com/docs/whatsapp
   - Requires: Business verification

3. **360Dialog**
   - Cost: €0.01-0.03 per message
   - Pros: Easy setup, good for EU
   - Setup: https://www.360dialog.com

---

## Free Approach: WhatsApp Web + Playwright

### Architecture

This implementation uses Playwright to automate WhatsApp Web:
- **Session Persistence**: Saves login state to avoid repeated QR scans
- **Rate Limiting**: Max 20 messages/minute (configurable)
- **Idempotency**: Prevents duplicate messages
- **Fallback**: Email escalation on failures

### Prerequisites

1. **WhatsApp Account**: Personal or Business
2. **Phone**: Must be accessible for initial QR scan
3. **Stable Session**: Keep session alive (self-hosted runner recommended)

---

## Setup Guide

### Option A: GitHub Actions with Artifacts (Free, Limited)

**Pros**: Completely free
**Cons**: Session expires frequently, requires manual re-auth

#### Steps:

1. **Initialize Session Locally**

```bash
cd adyam-logistics-portal
npm install
npx playwright install chromium
node scripts/wa-init.js
```

This will:
- Open a browser window
- Display WhatsApp Web QR code
- Wait for you to scan with your phone
- Save session to `.whatsapp/session.json`

2. **Upload Session to GitHub**

```bash
# Encrypt session file (recommended)
gpg --symmetric --cipher-algo AES256 .whatsapp/session.json

# Upload encrypted file as GitHub secret
# Go to: Settings → Secrets → Actions → New repository secret
# Name: WHATSAPP_SESSION_ENCRYPTED
# Value: <paste encrypted content>
```

3. **Configure GitHub Actions**

The session will be:
- Downloaded before each alert job
- Re-uploaded after completion
- Expires after ~14 days of inactivity

#### Limitations:
- Session expires if not used regularly
- Requires manual re-initialization
- GitHub Actions has 6-hour timeout

---

### Option B: Self-Hosted Runner (Recommended)

**Pros**: Persistent session, reliable, faster
**Cons**: Requires a small VPS (~$5/month)

#### Steps:

1. **Setup VPS** (DigitalOcean, Linode, Hetzner)
   - Minimum: 1GB RAM, 1 CPU
   - OS: Ubuntu 22.04 LTS

2. **Install Dependencies**

```bash
# On VPS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git
sudo npx playwright install-deps chromium
```

3. **Setup GitHub Runner**

```bash
# On VPS
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure (get token from GitHub repo → Settings → Actions → Runners)
./config.sh --url https://github.com/YOUR_ORG/YOUR_REPO --token YOUR_TOKEN

# Run as service
sudo ./svc.sh install
sudo ./svc.sh start
```

4. **Initialize WhatsApp Session on VPS**

```bash
# Clone repo on VPS
git clone https://github.com/YOUR_ORG/YOUR_REPO.git
cd YOUR_REPO
npm install
npx playwright install chromium

# Initialize session (use X11 forwarding or VNC)
DISPLAY=:0 node scripts/wa-init.js
```

5. **Update GitHub Workflow**

Modify `.github/workflows/scheduler.yml`:

```yaml
send-alerts:
  runs-on: self-hosted  # Use your runner
  # Remove artifact download/upload steps
```

---

## Configuration

### Environment Variables

Add to `.env.local` (local) and GitHub Secrets (CI):

```env
# WhatsApp Configuration
WA_RATE_LIMIT_PER_MIN=20          # Messages per minute
ADMIN_EMAIL=admin@adyam.com       # Fallback email

# App URL for tracking links
NEXT_PUBLIC_APP_URL=https://adyam-logistics.vercel.app
```

### GitHub Secrets

Required secrets in GitHub repository:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
VERCEL_URL
WA_RATE_LIMIT_PER_MIN (optional, default: 20)
ADMIN_EMAIL
TEST_PHONE (for testing, format: +919876543210)
```

---

## Usage

### 1. Test Connection

```bash
# Dry run (no messages sent)
node scripts/wa-dryrun.js

# Send test message
node scripts/wa-test-send.js "+919876543210" "Test message"
```

### 2. Send Alerts Manually

```bash
node scripts/wa-send.js
```

### 3. Trigger from GitHub Actions

Go to: Actions → WhatsApp Playwright → Run workflow

---

## Message Format

Messages are sent in this format:

```
📦 Shipment Update

AWB: 886520976940
Customer: John Doe
Status: In Transit
Location: Mumbai, MH
Last checked: 2025-12-07 02:30
Provider: FedEx

Track: https://adyam-logistics.vercel.app/track?awb=886520976940
```

---

## Troubleshooting

### Session Expired

**Symptoms**: "Please scan QR code" error

**Solution**:
```bash
# Re-initialize session
node scripts/wa-init.js

# Upload new session to GitHub (if using artifacts)
```

### Rate Limit Exceeded

**Symptoms**: Messages fail with "Too many requests"

**Solution**:
```bash
# Increase delay in .env
WA_RATE_LIMIT_PER_MIN=10  # Slower rate
```

### WhatsApp UI Changed

**Symptoms**: Selectors not found

**Solution**:
1. Inspect WhatsApp Web in browser
2. Update selectors in `lib/whatsapp/whatsappClient.ts`
3. Common selectors:
   - Input: `div[contenteditable="true"][data-tab="10"]`
   - Send button: `button[data-testid="compose-btn-send"]`

### Browser Crashes

**Symptoms**: Playwright timeout errors

**Solution**:
```bash
# Increase memory on VPS or GitHub Actions
# In vercel.json:
{
  "functions": {
    "api/alerts/**/*.ts": {
      "memory": 2048
    }
  }
}
```

---

## Monitoring

### Check Alert Logs

```sql
-- Recent alerts
SELECT * FROM alerts 
ORDER BY attempted_at DESC 
LIMIT 50;

-- Failed alerts
SELECT awb_no, error_message, attempted_at 
FROM alerts 
WHERE status = 'failed' 
ORDER BY attempted_at DESC;

-- Success rate
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM alerts
WHERE attempted_at > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

### Check Job Logs

```sql
SELECT * FROM job_logs 
WHERE job_name = 'whatsapp-alerts' 
ORDER BY started_at DESC 
LIMIT 10;
```

---

## Escalation Path

### When to Escalate to Paid API

1. **Session expires frequently** (>2 times/week)
2. **Message volume >100/day**
3. **Need guaranteed delivery**
4. **Compliance requirements**
5. **WhatsApp blocks automation**

### Migration to Twilio

1. **Install Twilio SDK**
```bash
npm install twilio
```

2. **Replace `whatsappClient.ts`**
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendMessage(phone: string, text: string) {
  await client.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${phone}`,
    body: text,
  });
}
```

3. **Update environment variables**
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

---

## Security Best Practices

1. **Never commit session.json** to public repos
2. **Encrypt session** before storing as secret
3. **Use self-hosted runner** for production
4. **Rotate sessions** every 2 weeks
5. **Monitor for suspicious activity**
6. **Limit access** to WhatsApp account
7. **Use 2FA** on WhatsApp account

---

## FAQ

**Q: How long does a session last?**
A: ~14 days of inactivity, longer if used regularly

**Q: Can I use multiple phone numbers?**
A: No, one WhatsApp account per session

**Q: What if WhatsApp blocks me?**
A: Switch to official API immediately

**Q: Can I send media (images, PDFs)?**
A: Yes, but requires additional Playwright logic

**Q: Is this production-ready?**
A: For small scale (<50 messages/day), yes. For larger scale, use official API.

---

## Support

For issues:
1. Check logs in Supabase `alerts` and `job_logs` tables
2. Review GitHub Actions logs
3. Test locally with `wa-test-send.js`
4. Consider migrating to Twilio for reliability
