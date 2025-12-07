// Courier Wala Tracking Provider (Scraper-based)

import { TrackingProvider, TrackingResult } from '../types';

export class CourierWalaProvider implements TrackingProvider {
    name = 'Courier Wala';

    async track(awb: string): Promise<TrackingResult> {
        try {
            const { scrapeCourierWala } = await import('../../scraper/courierwalaScraper');
            return scrapeCourierWala(awb);
        } catch (error: any) {
            throw new Error(`Courier Wala tracking failed: ${error.message}`);
        }
    }
}
