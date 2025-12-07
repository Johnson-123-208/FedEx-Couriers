// Send WhatsApp alerts - Called from GitHub Actions

const { processAlerts } = require('../lib/alerts/alertManager');
const { startJobLog, finishJobLog, recordMetric } = require('../lib/logs/alertLogger');

async function sendAlerts() {
    console.log('📱 Starting WhatsApp alert job...');

    const jobId = await startJobLog('whatsapp-alerts');
    const startTime = Date.now();

    try {
        const summary = await processAlerts();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n✅ Alert job completed');
        console.log(`Duration: ${duration}s`);
        console.log('\nSummary:');
        console.log(`  Processed: ${summary.processed}`);
        console.log(`  Succeeded: ${summary.succeeded}`);
        console.log(`  Failed: ${summary.failed}`);

        if (summary.errors.length > 0) {
            console.log('\nErrors:');
            summary.errors.forEach(err => console.log(`  - ${err}`));
        }

        // Log to Supabase
        await finishJobLog(jobId, summary.failed === 0 ? 'success' : 'failed', summary);

        // Record metrics
        await recordMetric('alerts_sent', summary.succeeded);
        await recordMetric('alerts_failed', summary.failed);

        // Output for GitHub Actions
        console.log('\n::set-output name=summary::' + JSON.stringify(summary));

        process.exit(summary.failed > 0 ? 1 : 0);

    } catch (error) {
        console.error('\n❌ Alert job failed:', error.message);
        await finishJobLog(jobId, 'failed', {}, error.message);
        console.error('::error::Alert job failed: ' + error.message);
        process.exit(1);
    }
}

sendAlerts();
