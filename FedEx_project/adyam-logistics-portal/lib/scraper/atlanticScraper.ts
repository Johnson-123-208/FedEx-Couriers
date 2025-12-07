// Atlantic Web Scraper

import { TrackingResult } from '../tracking/types';
import { withBrowser } from './playwrightClient';
import { waitForSelector, extractText, fillInput, clickElement, cleanText } from './scrapeUtils';

export async function scrapeAtlantic(awb: string): Promise<TrackingResult> {
    return withBrowser(async (page) => {
        try {
            await page.goto('https://www.atlanticcourier.com/tracking', {
                waitUntil: 'networkidle',
            });

            const inputSelector = 'input[name="trackingNo"], input#tracking';
            await waitForSelector(page, inputSelector, 15000);
            await fillInput(page, inputSelector, awb);

            const submitSelector = 'button.submit, input[type="submit"]';
            await clickElement(page, submitSelector);

            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const status = await extractText(page, '.status-text, .shipment-status', 'Status not found');
            const location = await extractText(page, '.location-text, .current-loc');
            const timestamp = await extractText(page, '.update-time, .timestamp');

            const eventRows = await page.$$('.event-list tr, .tracking-row');
            const events = await Promise.all(
                eventRows.map(async (row) => {
                    const text = await row.textContent();
                    return {
                        description: cleanText(text || ''),
                        location: null,
                        time: null,
                    };
                })
            );

            const delivered = status.toLowerCase().includes('delivered');

            return {
                awb_no: awb,
                provider: 'Atlantic',
                status: cleanText(status),
                raw_status_text: status,
                last_location: location || null,
                last_event_time: timestamp || null,
                events: events.filter(e => e.description),
                delivered,
                scraped_at: new Date().toISOString(),
            };

        } catch (error: any) {
            throw new Error(`Atlantic scraping failed: ${error.message}`);
        }
    });
}
