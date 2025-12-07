// Run tracking update - Can be called from GitHub Actions or locally

const fetch = require('node-fetch');

const VERCEL_URL = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const API_ENDPOINT = `${VERCEL_URL}/api/tracking/update-all`;

async function runUpdate() {
    console.log('🚀 Starting tracking update...');
    console.log(`Endpoint: ${API_ENDPOINT}`);

    const startTime = Date.now();

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n✅ Update completed successfully');
        console.log(`Duration: ${duration}s`);
        console.log('\nSummary:');
        console.log(`  Checked: ${result.checked || 0}`);
        console.log(`  Delivered: ${result.delivered_now || 0}`);
        console.log(`  Failed: ${result.failed || 0}`);

        if (result.logs && result.logs.length > 0) {
            console.log('\nLogs:');
            result.logs.slice(0, 10).forEach(log => console.log(`  ${log}`));
            if (result.logs.length > 10) {
                console.log(`  ... and ${result.logs.length - 10} more`);
            }
        }

        // Output JSON for GitHub Actions
        console.log('\n::set-output name=summary::' + JSON.stringify(result));

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Update failed:', error.message);
        console.error('::error::Update failed: ' + error.message);
        process.exit(1);
    }
}

runUpdate();
