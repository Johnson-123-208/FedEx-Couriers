# Sample Output - Module 3 Jobs

## Example 1: Successful Tracking Update

### Command:
```bash
node scripts/run-update.js
```

### Output:
```json
{
  "timestamp": "2025-12-07T02:30:00.000Z",
  "job": "tracking-update",
  "status": "success",
  "duration_seconds": 245.32,
  "summary": {
    "checked": 150,
    "delivered_now": 12,
    "failed": 3,
    "logs": [
      "✓ 886520976940: Delivered",
      "✓ 99195357: In Transit",
      "✓ 30363525: Out for Delivery",
      "✗ 6002844640: Timeout error",
      "✓ 99194198: Delivered",
      "✓ 8086567683: In Transit",
      "... (144 more)",
      "\nCompleted in 245.32s"
    ]
  }
}
```

---

## Example 2: WhatsApp Alerts Job

### Command:
```bash
node scripts/wa-send.js
```

### Output:
```json
{
  "timestamp": "2025-12-07T02:35:00.000Z",
  "job": "whatsapp-alerts",
  "status": "success",
  "duration_seconds": 180.45,
  "summary": {
    "processed": 45,
    "succeeded": 42,
    "failed": 3,
    "errors": [
      "30363525: Session expired",
      "6002844640: Invalid phone number",
      "8086567683: Rate limit exceeded"
    ]
  },
  "details": {
    "rate_limit": "20 messages/minute",
    "retry_attempts": {
      "30363525": 4,
      "6002844640": 1,
      "8086567683": 2
    },
    "escalated_to_email": [
      "30363525"
    ]
  }
}
```

---

## Example 3: GitHub Actions Scheduler Log

### Workflow Run Output:

```
Run node scripts/run-update.js
🚀 Starting tracking update...
Endpoint: https://adyam-logistics.vercel.app/api/tracking/update-all

✅ Update completed successfully
Duration: 245.32s

Summary:
  Checked: 150
  Delivered: 12
  Failed: 3

Logs:
  ✓ 886520976940: Delivered
  ✓ 99195357: In Transit
  ✓ 30363525: Out for Delivery
  ✗ 6002844640: Timeout error
  ✓ 99194198: Delivered
  ✓ 8086567683: In Transit
  ✓ 12345678: Delivered
  ✓ 87654321: In Transit
  ✓ 11223344: Delivered
  ✓ 44332211: Out for Delivery
  ... and 140 more

::set-output name=summary::{"checked":150,"delivered_now":12,"failed":3}
```

---

## Example 4: Alert Manager Logs (Supabase)

### Query:
```sql
SELECT * FROM job_logs 
WHERE job_name = 'whatsapp-alerts' 
ORDER BY started_at DESC 
LIMIT 1;
```

### Result:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "job_name": "whatsapp-alerts",
  "started_at": "2025-12-07T02:35:00.000Z",
  "finished_at": "2025-12-07T02:38:00.000Z",
  "status": "success",
  "details": {
    "processed": 45,
    "succeeded": 42,
    "failed": 3,
    "errors": [
      "30363525: Session expired",
      "6002844640: Invalid phone number",
      "8086567683: Rate limit exceeded"
    ]
  },
  "error_message": null,
  "created_at": "2025-12-07T02:35:00.000Z"
}
```

---

## Example 5: Individual Alert Log

### Query:
```sql
SELECT * FROM alerts 
WHERE awb_no = '886520976940' 
ORDER BY attempted_at DESC 
LIMIT 1;
```

### Result:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "awb_no": "886520976940",
  "phone_number": "+919876543210",
  "attempted_at": "2025-12-07T02:36:15.000Z",
  "status": "success",
  "medium": "whatsapp",
  "message_snippet": "📦 Shipment Update\n\nAWB: 886520976940\nCustomer: John Doe\nStatus: Delivered\nLocation: Mumbai, MH\nLast...",
  "error_message": null,
  "created_at": "2025-12-07T02:36:15.000Z"
}
```

---

## Example 6: Failed Alert with Retry

### Alert Logs for AWB with Retries:
```sql
SELECT attempted_at, status, error_message 
FROM alerts 
WHERE awb_no = '30363525' 
ORDER BY attempted_at DESC;
```

### Result:
```
| attempted_at              | status  | error_message                    |
|---------------------------|---------|----------------------------------|
| 2025-12-07T02:36:45.000Z | failed  | Attempt 4: Session expired       |
| 2025-12-07T02:36:37.000Z | failed  | Attempt 3: Session expired       |
| 2025-12-07T02:36:29.000Z | failed  | Attempt 2: Session expired       |
| 2025-12-07T02:36:21.000Z | failed  | Attempt 1: Session expired       |
```

**Note**: After 4 failed attempts, escalated to email fallback.

---

## Example 7: Metrics Dashboard

### Query:
```sql
SELECT 
  metric_name,
  SUM(metric_value) as total,
  DATE(timestamp) as date
FROM metrics
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY metric_name, DATE(timestamp)
ORDER BY date DESC, metric_name;
```

### Result:
```
| metric_name      | total | date       |
|------------------|-------|------------|
| alerts_sent      | 168   | 2025-12-07 |
| alerts_failed    | 12    | 2025-12-07 |
| alerts_sent      | 152   | 2025-12-06 |
| alerts_failed    | 8     | 2025-12-06 |
| alerts_sent      | 145   | 2025-12-05 |
| alerts_failed    | 15    | 2025-12-05 |
```

---

## Example 8: Dry Run Output

### Command:
```bash
node scripts/wa-dryrun.js
```

### Output:
```
🧪 WhatsApp Alert Dry Run
=========================

Found 5 candidates:

1. AWB: 886520976940
   Customer: John Doe
   Phone: +919876543210
   Status: In Transit
   Location: Mumbai, MH

2. AWB: 99195357
   Customer: Jane Smith
   Phone: +919876543211
   Status: Out for Delivery
   Location: Delhi, DL

3. AWB: 30363525
   Customer: Bob Johnson
   Phone: +919876543212
   Status: In Transit
   Location: Bangalore, KA

4. AWB: 6002844640
   Customer: Alice Williams
   Phone: +919876543213
   Status: Delayed
   Location: Chennai, TN

5. AWB: 99194198
   Customer: Charlie Brown
   Phone: +919876543214
   Status: In Transit
   Location: Hyderabad, TG

✓ Dry run completed (no messages sent)
```

---

## Example 9: Test Send Output

### Command:
```bash
node scripts/wa-test-send.js "+919876543210" "Test from Adyam"
```

### Output:
```
📱 WhatsApp Test Send
=====================

Phone: +919876543210
Message: Test from Adyam

Sending message...

✅ Message sent successfully!
```

---

## Example 10: Error Scenario - Session Expired

### GitHub Actions Log:
```
Run node scripts/wa-send.js
📱 Starting WhatsApp alert job...

❌ Alert job failed: Session expired

Error Details:
  - WhatsApp session not found or expired
  - Please re-initialize session using: node scripts/wa-init.js
  - Or upload session artifact to GitHub Actions

::error::Alert job failed: Session expired

Exit code: 1
```

### Recovery Steps:
1. Run `node scripts/wa-init.js` locally
2. Scan QR code
3. Upload `.whatsapp/session.json` as GitHub artifact
4. Re-run workflow

---

These examples demonstrate the complete logging and output format for all Module 3 jobs and operations.
