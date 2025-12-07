"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { geocodeLocation } from '@/lib/geo/geocode';

// Dynamically import map to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

interface MapMarker {
    id: string;
    position: [number, number];
    label: string;
    status: string;
}

interface TrackingMapProps {
    locations?: Array<{
        id: string;
        location: string;
        status: string;
        awb: string;
    }>;
}

export function TrackingMap({ locations = [] }: TrackingMapProps) {
    const [markers, setMarkers] = useState<MapMarker[]>([]);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // India center

    useEffect(() => {
        async function loadMarkers() {
            if (locations.length === 0) {
                setLoading(false);
                return;
            }

            const newMarkers: MapMarker[] = [];

            for (const loc of locations) {
                if (!loc.location) continue;

                const coords = await geocodeLocation(loc.location);
                if (coords) {
                    newMarkers.push({
                        id: loc.id,
                        position: [coords.lat, coords.lng],
                        label: `${loc.awb} - ${loc.location}`,
                        status: loc.status,
                    });
                }
            }

            setMarkers(newMarkers);

            // Center on first marker if available
            if (newMarkers.length > 0) {
                setCenter(newMarkers[0].position);
            }

            setLoading(false);
        }

        loadMarkers();
    }, [locations]);

    if (loading) {
        return (
            <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <MapContainer
                center={center}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker) => (
                    <Marker key={marker.id} position={marker.position}>
                        <Popup>
                            <div className="text-sm">
                                <p className="font-semibold">{marker.label}</p>
                                <p className="text-gray-600">{marker.status}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
