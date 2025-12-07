// United Express Tracking Provider (Scraper-based)

import { TrackingProvider, TrackingResult } from '../types';

export class UnitedExpressProvider implements TrackingProvider {
    name = 'United Express';

    async track(awb: string): Promise<TrackingResult> {
        try {
            const { scrapeUnitedExpress } = await import('../../scraper/unitedexpressScraper');
            return scrapeUnitedExpress(awb);
        } catch (error: any) {
            throw new Error(`United Express tracking failed: ${error.message}`);
        }
    }
}
