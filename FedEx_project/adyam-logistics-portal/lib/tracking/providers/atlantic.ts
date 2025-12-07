// Atlantic Tracking Provider (Scraper-based)

import { TrackingProvider, TrackingResult } from '../types';

export class AtlanticProvider implements TrackingProvider {
    name = 'Atlantic';

    async track(awb: string): Promise<TrackingResult> {
        try {
            const { scrapeAtlantic } = await import('../../scraper/atlanticScraper');
            return scrapeAtlantic(awb);
        } catch (error: any) {
            throw new Error(`Atlantic tracking failed: ${error.message}`);
        }
    }
}
