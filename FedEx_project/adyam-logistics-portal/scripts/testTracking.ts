// Test tracking providers with sample AWB numbers

import { trackShipment } from '../lib/tracking';
import { logger } from '../lib/logs/logger';

const testCases = [
    { awb: '886520976940', provider: 'FedEx' },
    { awb: '99195357', provider: 'DHL' },
    { awb: '30363525', provider: 'ICL' },
    { awb: '6002844640', provider: 'United Express' },
    { awb: '99194198', provider: 'Courier Wala' },
    { awb: '8086567683', provider: 'Atlantic' },
];

async function testTracking() {
    console.log('🚀 Starting Tracking Provider Tests\n');
    console.log('='.repeat(60));

    for (const testCase of testCases) {
        console.log(`\n📦 Testing ${testCase.provider} - AWB: ${testCase.awb}`);
        console.log('-'.repeat(60));

        try {
            const result = await trackShipment(testCase.awb, testCase.provider);

            console.log('✅ Success!');
            console.log(`   Provider: ${result.provider}`);
            console.log(`   Status: ${result.status}`);
            console.log(`   Location: ${result.last_location || 'N/A'}`);
            console.log(`   Delivered: ${result.delivered ? 'Yes' : 'No'}`);
            console.log(`   Events: ${result.events.length}`);

            if (result.events.length > 0) {
                console.log('\n   Latest Events:');
                result.events.slice(0, 3).forEach((event, i) => {
                    console.log(`   ${i + 1}. ${event.description}`);
                    if (event.location) console.log(`      Location: ${event.location}`);
                    if (event.time) console.log(`      Time: ${event.time}`);
                });
            }

        } catch (error: any) {
            console.log(`❌ Failed: ${error.message}`);
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Testing Complete\n');

    // Show logs
    const errors = logger.getLogs().filter((log) => log.level === 'ERROR');
    if (errors.length > 0) {
        console.log('\n⚠️  Errors encountered:');
        errors.forEach((err) => {
            console.log(`   - ${err.message}`);
        });
    }
}

// Run tests
testTracking().catch(console.error);
