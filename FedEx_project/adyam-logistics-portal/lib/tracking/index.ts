// Master tracking router - selects appropriate provider

import { TrackingResult, ProviderType } from './types';
import { FedExProvider } from './providers/fedex';
import { DHLProvider } from './providers/dhl';
import { ICLProvider } from './providers/icl';
import { UnitedExpressProvider } from './providers/unitedexpress';
import { CourierWalaProvider } from './providers/courierwala';
import { AtlanticProvider } from './providers/atlantic';

const providers = {
    [ProviderType.FEDEX]: new FedExProvider(),
    [ProviderType.DHL]: new DHLProvider(),
    [ProviderType.ICL]: new ICLProvider(),
    [ProviderType.UNITED_EXPRESS]: new UnitedExpressProvider(),
    [ProviderType.COURIER_WALA]: new CourierWalaProvider(),
    [ProviderType.ATLANTIC]: new AtlanticProvider(),
};

/**
 * Detect provider from AWB number or service name
 */
export function detectProvider(awbOrService: string): ProviderType | null {
    const normalized = awbOrService.toLowerCase().trim();

    // Service name detection
    if (normalized.includes('fedex')) return ProviderType.FEDEX;
    if (normalized.includes('dhl')) return ProviderType.DHL;
    if (normalized.includes('icl')) return ProviderType.ICL;
    if (normalized.includes('united') || normalized.includes('express')) return ProviderType.UNITED_EXPRESS;
    if (normalized.includes('courier') || normalized.includes('wala')) return ProviderType.COURIER_WALA;
    if (normalized.includes('atlantic')) return ProviderType.ATLANTIC;

    // AWB pattern detection (can be enhanced)
    if (/^\d{12}$/.test(awbOrService)) return ProviderType.FEDEX; // FedEx 12-digit
    if (/^\d{10}$/.test(awbOrService)) return ProviderType.DHL; // DHL 10-digit

    return null;
}

/**
 * Track shipment using appropriate provider
 */
export async function trackShipment(
    awb: string,
    providerHint?: string
): Promise<TrackingResult> {
    try {
        // Determine provider
        const providerType = providerHint
            ? detectProvider(providerHint)
            : detectProvider(awb);

        if (!providerType) {
            throw new Error(`Unable to detect provider for AWB: ${awb}`);
        }

        const provider = providers[providerType];
        if (!provider) {
            throw new Error(`Provider ${providerType} not implemented`);
        }

        // Execute tracking
        const result = await provider.track(awb);
        return result;

    } catch (error: any) {
        return {
            awb_no: awb,
            provider: providerHint || 'unknown',
            status: 'Error',
            raw_status_text: error.message,
            last_location: null,
            last_event_time: null,
            events: [],
            delivered: false,
            error: error.message,
            scraped_at: new Date().toISOString(),
        };
    }
}

/**
 * Track multiple shipments in parallel
 */
export async function trackMultiple(
    shipments: Array<{ awb: string; provider?: string }>
): Promise<TrackingResult[]> {
    const promises = shipments.map(({ awb, provider }) =>
        trackShipment(awb, provider)
    );

    return Promise.all(promises);
}
