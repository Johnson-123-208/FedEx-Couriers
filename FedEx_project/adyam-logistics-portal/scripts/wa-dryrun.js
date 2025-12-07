// Dry-run WhatsApp alerts - Test without sending

const { supabaseAdmin } = require('../lib/supabase');

async function dryRun() {
    console.log('🧪 WhatsApp Alert Dry Run');
    console.log('=========================\n');

    try {
        // Fetch candidates
        const { data: candidates, error } = await supabaseAdmin
            .from('adyam_tracking')
            .select('awb_no, receiver, status, last_location, alert_phone')
            .eq('delivered', false)
            .not('alert_phone', 'is', null)
            .limit(5);

        if (error) throw error;

        if (!candidates || candidates.length === 0) {
            console.log('No alert candidates found');
            return;
        }

        console.log(`Found ${candidates.length} candidates:\n`);

        candidates.forEach((c, i) => {
            console.log(`${i + 1}. AWB: ${c.awb_no}`);
            console.log(`   Customer: ${c.receiver || 'N/A'}`);
            console.log(`   Phone: ${c.alert_phone}`);
            console.log(`   Status: ${c.status}`);
            console.log(`   Location: ${c.last_location || 'Unknown'}`);
            console.log('');
        });

        console.log('✓ Dry run completed (no messages sent)');

    } catch (error) {
        console.error('❌ Dry run failed:', error.message);
        process.exit(1);
    }
}

dryRun();
