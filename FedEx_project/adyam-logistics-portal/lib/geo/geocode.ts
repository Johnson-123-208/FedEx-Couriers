// Geocoding service using OpenStreetMap Nominatim

interface GeoLocation {
    lat: number;
    lng: number;
    display_name: string;
}

interface GeoCache {
    [location: string]: GeoLocation | null;
}

// In-memory cache (in production, use Redis or Supabase)
const cache: GeoCache = {};

/**
 * Geocode a location string to lat/lng coordinates
 */
export async function geocodeLocation(
    location: string
): Promise<GeoLocation | null> {
    if (!location || location.trim() === '') {
        return null;
    }

    const normalized = location.trim().toLowerCase();

    // Check cache first
    if (cache[normalized] !== undefined) {
        return cache[normalized];
    }

    try {
        // Use Nominatim API (OpenStreetMap)
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location
        )}&limit=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Adyam-Logistics-Portal/1.0',
            },
        });

        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            cache[normalized] = null;
            return null;
        }

        const result: GeoLocation = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            display_name: data[0].display_name,
        };

        cache[normalized] = result;
        return result;

    } catch (error: any) {
        console.error(`Geocoding failed for "${location}":`, error.message);
        cache[normalized] = null;
        return null;
    }
}

/**
 * Geocode multiple locations in batch
 */
export async function geocodeMultiple(
    locations: string[]
): Promise<Array<GeoLocation | null>> {
    const promises = locations.map((loc) => geocodeLocation(loc));
    return Promise.all(promises);
}

/**
 * Get cached geocode result
 */
export function getCachedGeocode(location: string): GeoLocation | null | undefined {
    const normalized = location.trim().toLowerCase();
    return cache[normalized];
}

/**
 * Clear geocode cache
 */
export function clearGeocodeCache(): void {
    Object.keys(cache).forEach((key) => delete cache[key]);
}
