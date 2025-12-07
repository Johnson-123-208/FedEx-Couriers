// ICL Tracking Provider (Scraper-based)

import { TrackingProvider, TrackingResult } from '../types';

export class ICLProvider implements TrackingProvider {
    name = 'ICL';

    async track(awb: string): Promise<TrackingResult> {
        try {
            const { scrapeICL } = await import('../../scraper/iclScraper');
            return scrapeICL(awb);
        } catch (error: any) {
            throw new Error(`ICL tracking failed: ${error.message}`);
        }
    }
}
