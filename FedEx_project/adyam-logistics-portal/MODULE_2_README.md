# MODULE 2: Tracking & Automation Engine

## 📁 New Folder Structure

```
adyam-logistics-portal/
├── lib/
│   ├── tracking/
│   │   ├── index.ts                 # Master tracking router
│   │   ├── types.ts                 # Unified types
│   │   └── providers/
│   │       ├── fedex.ts             # FedEx API + scraper
│   │       ├── dhl.ts               # DHL API + scraper
│   │       ├── icl.ts               # ICL scraper
│   │       ├── unitedexpress.ts     # United Express scraper
│   │       ├── courierwala.ts       # Courier Wala scraper
│   │       └── atlantic.ts          # Atlantic scraper
│   ├── scraper/
│   │   ├── playwrightClient.ts      # Browser automation client
│   │   ├── scrapeUtils.ts           # Scraping utilities
│   │   ├── fedexScraper.ts          # FedEx web scraper
│   │   ├── dhlScraper.ts            # DHL web scraper
│   │   ├── iclScraper.ts            # ICL web scraper
│   │   ├── unitedexpressScraper.ts  # United Express scraper
│   │   ├── courierwalaScraper.ts    # Courier Wala scraper
│   │   └── atlanticScraper.ts       # Atlantic scraper
│   ├── geo/
│   │   └── geocode.ts               # Geocoding service
│   └── logs/
│       └── logger.ts                # Production logging
├── app/api/tracking/
│   ├── track/route.ts               # Single tracking endpoint
│   └── update-all/route.ts          # Batch update endpoint
├── app/track/
│   └── page.tsx                     # Public tracking page
├── components/tracking/
│   ├── TrackingForm.tsx             # Tracking input form
│   ├── TrackingDetails.tsx          # Results display
│   └── TrackingMap.tsx              # Interactive map
└── scripts/
    └── testTracking.ts              # Provider test script
```

## 🚀 How to Use

### 1. Install Dependencies

```bash
npm install playwright react-leaflet leaflet
npx playwright install chromium
```

### 2. Set Environment Variables

Create `.env.local` with:

```env
# Existing Supabase vars
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Optional API Keys (fallback to scrapers if not provided)
FEDEX_API_KEY=your_fedex_api_key
FEDEX_API_SECRET=your_fedex_api_secret
DHL_API_KEY=your_dhl_api_key
```

### 3. Test Individual Providers

```bash
npx ts-node scripts/testTracking.ts
```

This will test all 6 providers with sample AWB numbers.

### 4. Run Auto-Update Locally

```bash
curl -X POST http://localhost:3000/api/tracking/update-all
```

Or use the admin dashboard to trigger updates.

### 5. Track Single Shipment

Navigate to `/track` or use the API:

```bash
curl -X POST http://localhost:3000/api/tracking/track \
  -H "Content-Type: application/json" \
  -d '{"awb":"886520976940","provider":"fedex"}'
```

## 🏗️ Architecture Overview

### Provider Adapter Pattern

Each courier has a dedicated provider class implementing the `TrackingProvider` interface:

```typescript
interface TrackingProvider {
  name: string;
  track(awb: string): Promise<TrackingResult>;
}
```

Providers automatically choose between:
- **API mode**: If credentials are available
- **Scraper mode**: Fallback using Playwright

### Unified Response Format

All providers return a standardized `TrackingResult`:

```typescript
{
  awb_no: string;
  provider: string;
  status: string;
  last_location: string | null;
  last_event_time: string | null;
  events: TrackingEvent[];
  delivered: boolean;
  scraped_at: string;
}
```

### Auto-Update Flow

1. Fetch all undelivered shipments from Supabase
2. For each shipment:
   - Detect provider from `service_provider` field
   - Call appropriate tracking adapter
   - Normalize response
   - Update database with new status/events
   - Mark as delivered if applicable
3. Return summary with stats

### Geocoding

Locations are geocoded using OpenStreetMap Nominatim:
- In-memory caching to reduce API calls
- Rate-limited to respect API limits
- Fallback to null if geocoding fails

## 🔧 Configuration

### Playwright Settings

Configured for production in `playwrightClient.ts`:
- Headless mode by default
- Anti-detection measures
- Automatic retry (3 attempts)
- Timeout handling (30s default)
- Browser pooling for efficiency

### Scraper Customization

Each scraper can be customized by editing the respective file in `lib/scraper/`:

```typescript
export async function scrapeFedEx(awb: string): Promise<TrackingResult> {
  return withBrowser(async (page) => {
    // Your scraping logic
  }, {
    headless: true,
    timeout: 30000,
  });
}
```

## 📊 API Endpoints

### POST `/api/tracking/track`

Track a single shipment.

**Request:**
```json
{
  "awb": "886520976940",
  "provider": "fedex"  // optional
}
```

**Response:**
```json
{
  "result": {
    "awb_no": "886520976940",
    "provider": "FedEx",
    "status": "In Transit",
    "last_location": "Memphis, TN",
    "events": [...]
  }
}
```

### POST `/api/tracking/update-all`

Update all undelivered shipments.

**Response:**
```json
{
  "checked": 150,
  "delivered_now": 12,
  "failed": 3,
  "logs": [
    "✓ 886520976940: Delivered",
    "✗ 99195357: Timeout"
  ]
}
```

## 🧪 Testing

### Manual Testing

1. **Test single provider:**
   ```bash
   npx ts-node -e "
   import { trackShipment } from './lib/tracking';
   trackShipment('886520976940', 'fedex').then(console.log);
   "
   ```

2. **Test auto-update:**
   - Add test data to Supabase
   - Run `POST /api/tracking/update-all`
   - Check database for updates

### Automated Testing

Run the comprehensive test suite:

```bash
npx ts-node scripts/testTracking.ts
```

## 🔐 Security Considerations

1. **API Keys**: Store in environment variables, never commit
2. **Rate Limiting**: Implemented 1s delay between requests
3. **Timeout Protection**: All scrapers have 30s timeout
4. **Error Isolation**: Failed tracking doesn't crash batch updates
5. **RLS Policies**: Database updates respect Supabase RLS

## 🚀 GitHub Actions Integration (Module 3)

The tracking engine is designed to run in GitHub Actions:

```yaml
# .github/workflows/auto-update.yml
name: Auto Update Tracking
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install chromium
      - run: |
          curl -X POST ${{ secrets.VERCEL_URL }}/api/tracking/update-all
```

## 📈 Performance

- **Single tracking**: ~5-15 seconds (depending on provider)
- **Batch update (100 shipments)**: ~10-15 minutes
- **Memory usage**: ~200MB per browser instance
- **Concurrent limit**: 5 simultaneous scrapers recommended

## 🐛 Troubleshooting

### Playwright Issues

If browser fails to launch:
```bash
npx playwright install-deps chromium
```

### Timeout Errors

Increase timeout in provider config:
```typescript
return withBrowser(async (page) => {
  // ...
}, { timeout: 60000 });  // 60 seconds
```

### Geocoding Failures

Check Nominatim API status or implement fallback:
```typescript
const coords = await geocodeLocation(location) || DEFAULT_COORDS;
```

## 🎯 Next Steps (Module 3)

- WhatsApp notifications via Twilio
- Email alerts for delivery
- Advanced analytics dashboard
- Real-time WebSocket updates
- Mobile app integration
