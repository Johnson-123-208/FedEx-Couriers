// FedEx Web Scraper

import { TrackingResult } from '../tracking/types';
import { withBrowser } from './playwrightClient';
import { waitForSelector, extractText, fillInput, clickElement, cleanText } from './scrapeUtils';

export async function scrapeFedEx(awb: string): Promise<TrackingResult> {
    return withBrowser(async (page) => {
        try {
            // Navigate to FedEx tracking page
            await page.goto('https://www.fedex.com/fedextrack/', {
                waitUntil: 'networkidle',
            });

            // Fill tracking number
            const inputSelector = 'input[name="trackingnumber"]';
            await waitForSelector(page, inputSelector);
            await fillInput(page, inputSelector, awb);

            // Submit form
            const submitSelector = 'button[type="submit"]';
            await clickElement(page, submitSelector);

            // Wait for results
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // Extract status
            const statusSelector = '.shipment-status';
            const status = await extractText(page, statusSelector, 'Status not found');

            // Extract location
            const locationSelector = '.location-details';
            const location = await extractText(page, locationSelector);

            // Extract timestamp
            const timeSelector = '.timestamp';
            const timestamp = await extractText(page, timeSelector);

            // Extract events
            const eventRows = await page.$$('.tracking-event-row');
            const events = await Promise.all(
                eventRows.map(async (row) => {
                    const desc = await row.$eval('.event-description', el => el.textContent?.trim() || '');
                    const loc = await row.$eval('.event-location', el => el.textContent?.trim() || '').catch(() => '');
                    const time = await row.$eval('.event-time', el => el.textContent?.trim() || '').catch(() => '');

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
                provider: 'FedEx',
                status: cleanText(status),
                raw_status_text: status,
                last_location: location || null,
                last_event_time: timestamp || null,
                events,
                delivered,
                scraped_at: new Date().toISOString(),
            };

        } catch (error: any) {
            throw new Error(`FedEx scraping failed: ${error.message}`);
        }
    });
}
