// FedEx Tracking Provider (API-based)

import { TrackingProvider, TrackingResult } from '../types';

export class FedExProvider implements TrackingProvider {
    name = 'FedEx';

    private apiKey = process.env.FEDEX_API_KEY || '';
    private apiSecret = process.env.FEDEX_API_SECRET || '';
    private baseUrl = 'https://apis.fedex.com/track/v1/trackingnumbers';

    async track(awb: string): Promise<TrackingResult> {
        try {
            // If no API credentials, fall back to scraper
            if (!this.apiKey || !this.apiSecret) {
                return this.trackViaScraper(awb);
            }

            return this.trackViaAPI(awb);
        } catch (error: any) {
            throw new Error(`FedEx tracking failed: ${error.message}`);
        }
    }

    private async trackViaAPI(awb: string): Promise<TrackingResult> {
        // FedEx API implementation
        // Step 1: Get OAuth token
        const token = await this.getAuthToken();

        // Step 2: Call tracking API
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                trackingInfo: [
                    {
                        trackingNumberInfo: {
                            trackingNumber: awb,
                        },
                    },
                ],
                includeDetailedScans: true,
            }),
        });

        if (!response.ok) {
            throw new Error(`FedEx API error: ${response.statusText}`);
        }

        const data = await response.json();
        return this.parseAPIResponse(awb, data);
    }

    private async getAuthToken(): Promise<string> {
        // OAuth token endpoint
        const tokenUrl = 'https://apis.fedex.com/oauth/token';

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: this.apiKey,
                client_secret: this.apiSecret,
            }),
        });

        const data = await response.json();
        return data.access_token;
    }

    private parseAPIResponse(awb: string, data: any): TrackingResult {
        const output = data.output?.completeTrackResults?.[0];
        const trackResult = output?.trackResults?.[0];

        const status = trackResult?.latestStatusDetail?.description || 'Unknown';
        const location = trackResult?.latestStatusDetail?.scanLocation?.city || null;
        const timestamp = trackResult?.latestStatusDetail?.scanLocation?.dateTime || null;

        const events = (trackResult?.scanEvents || []).map((event: any) => ({
            description: event.eventDescription || '',
            location: event.scanLocation?.city || null,
            time: event.date || null,
        }));

        const delivered = status.toLowerCase().includes('delivered');

        return {
            awb_no: awb,
            provider: 'FedEx',
            status,
            raw_status_text: JSON.stringify(trackResult?.latestStatusDetail || {}),
            last_location: location,
            last_event_time: timestamp,
            events,
            delivered,
            scraped_at: new Date().toISOString(),
        };
    }

    private async trackViaScraper(awb: string): Promise<TrackingResult> {
        // Fallback to Playwright scraper
        const { scrapeFedEx } = await import('../../scraper/fedexScraper');
        return scrapeFedEx(awb);
    }
}
