// Test WhatsApp send - Send single message for testing

const { getWhatsAppClient } = require('../lib/whatsapp/whatsappClient');

async function testSend() {
    const phone = process.argv[2];
    const message = process.argv[3] || 'Test message from Adyam Logistics';

    if (!phone) {
        console.error('Usage: node wa-test-send.js <phone_number> [message]');
        console.error('Example: node wa-test-send.js +919876543210 "Hello World"');
        process.exit(1);
    }

    console.log('📱 WhatsApp Test Send');
    console.log('=====================\n');
    console.log(`Phone: ${phone}`);
    console.log(`Message: ${message}\n`);

    try {
        const client = await getWhatsAppClient();
        console.log('Sending message...');

        const result = await client.sendMessage(phone, message);

        if (result.ok) {
            console.log('\n✅ Message sent successfully!');
        } else {
            console.error('\n❌ Failed to send message:', result.reason);
            process.exit(1);
        }

        await client.close();

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

testSend();
