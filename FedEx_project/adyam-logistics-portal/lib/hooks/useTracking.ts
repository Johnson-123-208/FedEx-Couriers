// React Query hooks for tracking data

"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrackingResult } from '@/lib/tracking/types';

/**
 * Hook to track a single shipment
 */
export function useTrackShipment() {
    return useMutation({
        mutationFn: async ({ awb, provider }: { awb: string; provider?: string }) => {
            const response = await fetch('/api/tracking/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ awb, provider }),
            });

            if (!response.ok) {
                throw new Error('Tracking failed');
            }

            const data = await response.json();
            return data.result as TrackingResult;
        },
    });
}

/**
 * Hook to fetch all tracking records
 */
export function useTrackingList(options?: { refetchInterval?: number }) {
    return useQuery({
        queryKey: ['tracking', 'list'],
        queryFn: async () => {
            const response = await fetch('/api/tracking/list');
            if (!response.ok) throw new Error('Failed to fetch tracking list');
            const data = await response.json();
            return data.data as TrackingResult[];
        },
        refetchInterval: options?.refetchInterval || false,
    });
}

/**
 * Hook to trigger auto-update
 */
export function useAutoUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/tracking/update-all', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Auto-update failed');
            }

            return response.json();
        },
        onSuccess: () => {
            // Invalidate tracking list to refetch
            queryClient.invalidateQueries({ queryKey: ['tracking', 'list'] });
        },
    });
}

/**
 * Hook to get single tracking record with polling
 */
export function useTrackingRecord(awb: string, options?: { pollInterval?: number }) {
    return useQuery({
        queryKey: ['tracking', 'record', awb],
        queryFn: async () => {
            const response = await fetch(`/api/tracking/get?awb=${awb}`);
            if (!response.ok) throw new Error('Failed to fetch tracking record');
            const data = await response.json();
            return data.data as TrackingResult;
        },
        enabled: !!awb,
        refetchInterval: options?.pollInterval || false,
    });
}
