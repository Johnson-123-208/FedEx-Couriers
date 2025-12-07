"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface TrackingFormProps {
    onTrack: (awb: string, provider?: string) => void;
    loading?: boolean;
}

export function TrackingForm({ onTrack, loading = false }: TrackingFormProps) {
    const [awb, setAwb] = useState('');
    const [provider, setProvider] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (awb.trim()) {
            onTrack(awb.trim(), provider || undefined);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="awb" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AWB / Tracking Number
                </label>
                <Input
                    id="awb"
                    type="text"
                    placeholder="Enter tracking number"
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Courier Provider (Optional)
                </label>
                <select
                    id="provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                    <option value="">Auto-detect</option>
                    <option value="fedex">FedEx</option>
                    <option value="dhl">DHL</option>
                    <option value="icl">ICL</option>
                    <option value="unitedexpress">United Express</option>
                    <option value="courierwala">Courier Wala</option>
                    <option value="atlantic">Atlantic</option>
                </select>
            </div>

            <Button type="submit" isLoading={loading} className="w-full">
                Track Shipment
            </Button>
        </form>
    );
}
