// Playwright Client - Production-ready browser automation

import { chromium, Browser, BrowserContext, Page } from 'playwright';

let browser: Browser | null = null;

export interface ScraperConfig {
    headless?: boolean;
    timeout?: number;
    userAgent?: string;
    viewport?: { width: number; height: number };
}

const defaultConfig: ScraperConfig = {
    headless: true,
    timeout: 30000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 },
};

/**
 * Initialize browser instance (singleton pattern)
 */
export async function getBrowser(config: ScraperConfig = {}): Promise<Browser> {
    if (browser && browser.isConnected()) {
        return browser;
    }

    const mergedConfig = { ...defaultConfig, ...config };

    browser = await chromium.launch({
        headless: mergedConfig.headless,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
        ],
    });

    return browser;
}

/**
 * Create a new browser context with anti-detection measures
 */
export async function createContext(
    browser: Browser,
    config: ScraperConfig = {}
): Promise<BrowserContext> {
    const mergedConfig = { ...defaultConfig, ...config };

    const context = await browser.newContext({
        userAgent: mergedConfig.userAgent,
        viewport: mergedConfig.viewport,
        locale: 'en-US',
        timezoneId: 'America/New_York',
    });

    return context;
}

/**
 * Create a new page with timeout and error handling
 */
export async function createPage(
    context: BrowserContext,
    timeout: number = 30000
): Promise<Page> {
    const page = await context.newPage();
    page.setDefaultTimeout(timeout);
    page.setDefaultNavigationTimeout(timeout);

    return page;
}

/**
 * Close browser instance
 */
export async function closeBrowser(): Promise<void> {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

/**
 * Execute scraping with automatic retry and cleanup
 */
export async function withBrowser<T>(
    scraper: (page: Page) => Promise<T>,
    config: ScraperConfig = {},
    retries: number = 3
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
        let context: BrowserContext | null = null;
        let page: Page | null = null;

        try {
            const browserInstance = await getBrowser(config);
            context = await createContext(browserInstance, config);
            page = await createPage(context, config.timeout);

            const result = await scraper(page);
            return result;

        } catch (error: any) {
            lastError = error;
            console.error(`Scraping attempt ${attempt} failed:`, error.message);

            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
            }

        } finally {
            if (page) await page.close().catch(() => { });
            if (context) await context.close().catch(() => { });
        }
    }

    throw new Error(`Scraping failed after ${retries} attempts: ${lastError?.message}`);
}
