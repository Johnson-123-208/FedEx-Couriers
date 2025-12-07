// Unified tracking types for all providers

export interface TrackingEvent {
    description: string;
    location: string | null;
    time: string | null;
    status_code?: string;
}

export interface TrackingResult {
    awb_no: string;
    provider: string;
    status: string;
    raw_status_text: string;
    last_location: string | null;
    last_event_time: string | null;
    events: TrackingEvent[];
    delivered: boolean;
    error?: string;
    scraped_at: string;
}

export interface TrackingProvider {
    name: string;
    track(awb: string): Promise<TrackingResult>;
}

export enum ProviderType {
    FEDEX = 'fedex',
    DHL = 'dhl',
    ICL = 'icl',
    UNITED_EXPRESS = 'unitedexpress',
    COURIER_WALA = 'courierwala',
    ATLANTIC = 'atlantic',
}

export interface ProviderConfig {
    name: string;
    type: 'api' | 'scraper';
    apiKey?: string;
    baseUrl?: string;
    trackingUrl?: string;
}
