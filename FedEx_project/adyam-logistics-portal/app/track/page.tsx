"use client";

import { useState } from 'react';
import { TrackingForm } from '@/components/tracking/TrackingForm';
import { TrackingDetails } from '@/components/tracking/TrackingDetails';
import { TrackingResult } from '@/lib/tracking/types';

export default function TrackingPage() {
    const [result, setResult] = useState<TrackingResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTrack = async (awb: string, provider?: string) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/tracking/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ awb, provider }),
            });

            if (!response.ok) {
                throw new Error('Tracking failed');
            }

            const data = await response.json();
            setResult(data.result);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Track Shipment
                </h1>
                <p className="text-gray-500 mt-2">
                    Enter your tracking number to get real-time updates
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <TrackingForm onTrack={handleTrack} loading={loading} />
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-900 dark:text-red-200">{error}</p>
                </div>
            )}

            {result && <TrackingDetails result={result} />}
        </div>
    );
}
