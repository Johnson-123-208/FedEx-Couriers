// Initialize WhatsApp session - Run locally to generate session.json

const { WhatsAppClient } = require('../lib/whatsapp/whatsappClient');

async function initSession() {
    console.log('🔐 WhatsApp Session Initialization');
    console.log('===================================\n');

    const client = new WhatsAppClient();

    try {
        console.log('1. Launching browser...');
        await client.initialize(false); // headless = false to show browser

        console.log('2. Opening WhatsApp Web...');
        await client.initializeSession();

        console.log('\n✅ Session initialized successfully!');
        console.log('📁 Session saved to: .whatsapp/session.json');
        console.log('\n⚠️  IMPORTANT:');
        console.log('  - Keep session.json secure (never commit to public repo)');
        console.log('  - Upload as GitHub Actions artifact or use self-hosted runner');
        console.log('  - Session expires after ~2 weeks of inactivity\n');

        await client.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Initialization failed:', error.message);
        await client.close();
        process.exit(1);
    }
}

initSession();
