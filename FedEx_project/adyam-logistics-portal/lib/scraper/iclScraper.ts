// ICL Web Scraper (India Cargo Logistics)

import { TrackingResult } from '../tracking/types';
import { withBrowser } from './playwrightClient';
import { waitForSelector, extractText, fillInput, clickElement, cleanText } from './scrapeUtils';

export async function scrapeICL(awb: string): Promise<TrackingResult> {
    return withBrowser(async (page) => {
        try {
            // ICL tracking URL (adjust based on actual website)
            await page.goto('https://www.iclnet.in/tracking', {
                waitUntil: 'networkidle',
            });

            const inputSelector = 'input[name="awb"]';
            await waitForSelector(page, inputSelector, 15000);
            await fillInput(page, inputSelector, awb);

            const submitSelector = 'button[type="submit"], input[type="submit"]';
            await clickElement(page, submitSelector);

            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);

            // Extract tracking info
            const status = await extractText(page, '.status, .tracking-status', 'Status not found');
            const location = await extractText(page, '.location, .current-location');
            const timestamp = await extractText(page, '.timestamp, .last-update');

            // Extract event history
            const eventRows = await page.$$('.event-row, .tracking-event, tr');
            const events = await Promise.all(
                eventRows.slice(0, 10).map(async (row) => {
                    const desc = await row.textContent();
                    return {
                        description: cleanText(desc || ''),
                        location: null,
                        time: null,
                    };
                })
            );

            const delivered = status.toLowerCase().includes('delivered');

            return {
                awb_no: awb,
                provider: 'ICL',
                status: cleanText(status),
                raw_status_text: status,
                last_location: location || null,
                last_event_time: timestamp || null,
                events: events.filter(e => e.description),
                delivered,
                scraped_at: new Date().toISOString(),
            };

        } catch (error: any) {
            throw new Error(`ICL scraping failed: ${error.message}`);
        }
    });
}
