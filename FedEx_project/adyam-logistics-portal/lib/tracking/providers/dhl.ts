// DHL Tracking Provider (API-based)

import { TrackingProvider, TrackingResult } from '../types';

export class DHLProvider implements TrackingProvider {
    name = 'DHL';

    private apiKey = process.env.DHL_API_KEY || '';
    private baseUrl = 'https://api-eu.dhl.com/track/shipments';

    async track(awb: string): Promise<TrackingResult> {
        try {
            if (!this.apiKey) {
                return this.trackViaScraper(awb);
            }

            return this.trackViaAPI(awb);
        } catch (error: any) {
            throw new Error(`DHL tracking failed: ${error.message}`);
        }
    }

    private async trackViaAPI(awb: string): Promise<TrackingResult> {
        const url = `${this.baseUrl}?trackingNumber=${awb}`;

        const response = await fetch(url, {
            headers: {
                'DHL-API-Key': this.apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`DHL API error: ${response.statusText}`);
        }

        const data = await response.json();
        return this.parseAPIResponse(awb, data);
    }

    private parseAPIResponse(awb: string, data: any): TrackingResult {
        const shipment = data.shipments?.[0];
        const status = shipment?.status?.statusCode || 'Unknown';
        const statusDesc = shipment?.status?.description || status;
        const location = shipment?.status?.location?.address?.addressLocality || null;
        const timestamp = shipment?.status?.timestamp || null;

        const events = (shipment?.events || []).map((event: any) => ({
            description: event.description || '',
            location: event.location?.address?.addressLocality || null,
            time: event.timestamp || null,
        }));

        const delivered = statusDesc.toLowerCase().includes('delivered');

        return {
            awb_no: awb,
            provider: 'DHL',
            status: statusDesc,
            raw_status_text: JSON.stringify(shipment?.status || {}),
            last_location: location,
            last_event_time: timestamp,
            events,
            delivered,
            scraped_at: new Date().toISOString(),
        };
    }

    private async trackViaScraper(awb: string): Promise<TrackingResult> {
        const { scrapeDHL } = await import('../../scraper/dhlScraper');
        return scrapeDHL(awb);
    }
}
