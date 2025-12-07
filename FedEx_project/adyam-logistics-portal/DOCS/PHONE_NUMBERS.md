# Set Phone Numbers for Alerts

This script allows bulk setting of phone numbers for alert notifications.

## Option 1: Via SQL (Recommended for bulk)

```sql
-- Set phone number for specific AWB
UPDATE public.adyam_tracking
SET alert_phone = '+919876543210'
WHERE awb_no = '886520976940';

-- Set same phone for multiple AWBs (e.g., same customer)
UPDATE public.adyam_tracking
SET alert_phone = '+919876543210'
WHERE receiver = 'John Doe';

-- Bulk update from CSV
-- First, create temp table and import CSV
CREATE TEMP TABLE phone_mapping (
  awb_no TEXT,
  phone TEXT
);

-- Import CSV (use Supabase dashboard or psql \copy)
-- Then update:
UPDATE public.adyam_tracking t
SET alert_phone = m.phone
FROM phone_mapping m
WHERE t.awb_no = m.awb_no;
```

## Option 2: Via Admin UI (Future Enhancement)

Add to `app/admin/table/page.tsx`:

```tsx
// Add phone number column with inline edit
<input
  type="tel"
  value={row.alert_phone || ''}
  onChange={(e) => updatePhone(row.id, e.target.value)}
  placeholder="+91..."
/>
```

## Option 3: Via Script

Create `scripts/set-phones.js`:

```javascript
const { supabaseAdmin } = require('../lib/supabase');

async function setPhones() {
  // Example: Set default phone for all records
  const { error } = await supabaseAdmin
    .from('adyam_tracking')
    .update({ alert_phone: '+919876543210' })
    .is('alert_phone', null);

  if (error) {
    console.error('Failed:', error);
  } else {
    console.log('✓ Phone numbers updated');
  }
}

setPhones();
```

## Phone Number Format

- **Required format**: E.164 international format
- **Example**: `+919876543210` (India)
- **Pattern**: `+[country code][number]`
- **No spaces or dashes**

## Testing

```bash
# Test with single record
node scripts/wa-test-send.js "+919876543210" "Test alert"
```

## Production Workflow

1. Import customer data with phone numbers
2. Run phone mapping script
3. Verify with dry-run: `node scripts/wa-dryrun.js`
4. Enable alerts in scheduler
