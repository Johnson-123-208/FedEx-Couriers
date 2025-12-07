// DHL Web Scraper

import { TrackingResult } from '../tracking/types';
import { withBrowser } from './playwrightClient';
import { waitForSelector, extractText, fillInput, clickElement, cleanText } from './scrapeUtils';

export async function scrapeDHL(awb: string): Promise<TrackingResult> {
    return withBrowser(async (page) => {
        try {
            await page.goto('https://www.dhl.com/en/express/tracking.html', {
                waitUntil: 'networkidle',
            });

            const inputSelector = '#tracking-id-input';
            await waitForSelector(page, inputSelector);
            await fillInput(page, inputSelector, awb);

            const submitSelector = 'button[type="submit"]';
            await clickElement(page, submitSelector);

            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const statusSelector = '.delivery-status-text';
            const status = await extractText(page, statusSelector, 'Status not found');

            const locationSelector = '.location-name';
            const location = await extractText(page, locationSelector);

            const timeSelector = '.delivery-date';
            const timestamp = await extractText(page, timeSelector);

            const eventRows = await page.$$('.checkpoint-item');
            const events = await Promise.all(
                eventRows.map(async (row) => {
                    const desc = await row.$eval('.checkpoint-status', el => el.textContent?.trim() || '');
                    const loc = await row.$eval('.checkpoint-location', el => el.textContent?.trim() || '').catch(() => '');
                    const time = await row.$eval('.checkpoint-time', el => el.textContent?.trim() || '').catch(() => '');

                    return {
                        description: cleanText(desc),
                        location: loc || null,
                        time: time || null,
                    };
                })
            );

            const delivered = status.toLowerCase().includes('delivered');

            return {
                awb_no: awb,
                provider: 'DHL',
                status: cleanText(status),
                raw_status_text: status,
                last_location: location || null,
                last_event_time: timestamp || null,
                events,
                delivered,
                scraped_at: new Date().toISOString(),
            };

        } catch (error: any) {
            throw new Error(`DHL scraping failed: ${error.message}`);
        }
    });
}
