// WhatsApp Client using Playwright (Free-first approach)

import { chromium, Browser, BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const SESSION_PATH = path.join(process.cwd(), '.whatsapp', 'session.json');
const RATE_LIMIT_PER_MIN = parseInt(process.env.WA_RATE_LIMIT_PER_MIN || '20');

interface SendResult {
    ok: boolean;
    reason?: string;
}

interface Message {
    id: string;
    phone: string;
    text: string;
}

class WhatsAppClient {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    private messageQueue: Message[] = [];
    private lastSentTime: number = 0;

    /**
     * Initialize WhatsApp Web session
     */
    async initialize(headless: boolean = true): Promise<void> {
        try {
            this.browser = await chromium.launch({
                headless,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });

            // Load session if exists
            if (fs.existsSync(SESSION_PATH)) {
                const sessionData = JSON.parse(fs.readFileSync(SESSION_PATH, 'utf-8'));
                this.context = await this.browser.newContext({
                    storageState: sessionData,
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                });
            } else {
                this.context = await this.browser.newContext({
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                });
            }

            console.log('WhatsApp client initialized');
        } catch (error: any) {
            throw new Error(`Failed to initialize WhatsApp client: ${error.message}`);
        }
    }

    /**
     * Save session for persistence
     */
    async saveSession(): Promise<void> {
        if (!this.context) {
            throw new Error('Context not initialized');
        }

        const sessionData = await this.context.storageState();
        const sessionDir = path.dirname(SESSION_PATH);

        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }

        fs.writeFileSync(SESSION_PATH, JSON.stringify(sessionData, null, 2));
        console.log(`Session saved to ${SESSION_PATH}`);
    }

    /**
     * Open WhatsApp Web and wait for QR scan
     */
    async initializeSession(): Promise<void> {
        if (!this.context) {
            throw new Error('Context not initialized');
        }

        const page = await this.context.newPage();
        await page.goto('https://web.whatsapp.com', { waitUntil: 'networkidle' });

        console.log('Waiting for QR code scan...');
        console.log('Please scan the QR code in the browser window');

        // Wait for main chat interface to load (indicates successful login)
        await page.waitForSelector('div[data-testid="conversation-panel-wrapper"]', {
            timeout: 120000, // 2 minutes
        });

        console.log('✓ Successfully logged in to WhatsApp Web');

        // Save session
        await this.saveSession();
        await page.close();
    }

    /**
     * Send a single message
     */
    async sendMessage(phone: string, text: string): Promise<SendResult> {
        if (!this.context) {
            return { ok: false, reason: 'Context not initialized' };
        }

        try {
            // Rate limiting
            await this.enforceRateLimit();

            const page = await this.context.newPage();

            // Format phone number (remove non-digits)
            const cleanPhone = phone.replace(/\D/g, '');

            // Navigate to chat
            const chatUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}`;
            await page.goto(chatUrl, { waitUntil: 'networkidle', timeout: 30000 });

            // Wait for chat to load
            await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', {
                timeout: 15000,
            });

            // Type message
            const inputSelector = 'div[contenteditable="true"][data-tab="10"]';
            await page.fill(inputSelector, text);

            // Wait a bit for WhatsApp to process
            await page.waitForTimeout(1000);

            // Send message
            const sendButton = 'button[data-testid="compose-btn-send"]';
            await page.click(sendButton);

            // Wait for message to be sent
            await page.waitForTimeout(2000);

            await page.close();

            this.lastSentTime = Date.now();
            return { ok: true };

        } catch (error: any) {
            console.error(`Failed to send message to ${phone}:`, error.message);
            return { ok: false, reason: error.message };
        }
    }

    /**
     * Send bulk messages with rate limiting
     */
    async sendBulk(messages: Message[]): Promise<Map<string, SendResult>> {
        const results = new Map<string, SendResult>();

        for (const message of messages) {
            const result = await this.sendMessage(message.phone, message.text);
            results.set(message.id, result);

            // Log result
            console.log(`[${message.id}] ${message.phone}: ${result.ok ? '✓' : '✗'} ${result.reason || ''}`);
        }

        return results;
    }

    /**
     * Enforce rate limiting
     */
    private async enforceRateLimit(): Promise<void> {
        const minInterval = (60 * 1000) / RATE_LIMIT_PER_MIN; // ms per message
        const timeSinceLastSent = Date.now() - this.lastSentTime;

        if (timeSinceLastSent < minInterval) {
            const waitTime = minInterval - timeSinceLastSent;
            console.log(`Rate limiting: waiting ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    /**
     * Close browser
     */
    async close(): Promise<void> {
        if (this.context) await this.context.close();
        if (this.browser) await this.browser.close();
        console.log('WhatsApp client closed');
    }
}

// Singleton instance
let whatsappClient: WhatsAppClient | null = null;

export async function getWhatsAppClient(): Promise<WhatsAppClient> {
    if (!whatsappClient) {
        whatsappClient = new WhatsAppClient();
        await whatsappClient.initialize(process.env.NODE_ENV === 'production');
    }
    return whatsappClient;
}

export { WhatsAppClient };
