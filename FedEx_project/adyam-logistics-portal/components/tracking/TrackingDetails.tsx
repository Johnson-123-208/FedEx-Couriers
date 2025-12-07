"use client";

import { TrackingResult } from '@/lib/tracking/types';
import { Package, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

interface TrackingDetailsProps {
    result: TrackingResult;
}

export function TrackingDetails({ result }: TrackingDetailsProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {result.awb_no}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">{result.provider}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {result.delivered ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                            <Package className="h-6 w-6 text-blue-500" />
                        )}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {result.status}
                        </p>
                    </div>
                    {result.last_location && (
                        <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> Location
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {result.last_location}
                            </p>
                        </div>
                    )}
                    {result.last_event_time && (
                        <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="h-4 w-4" /> Last Update
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {new Date(result.last_event_time).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Events Timeline */}
            {result.events && result.events.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Tracking History
                    </h3>
                    <div className="space-y-4">
                        {result.events.map((event, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <div className="h-3 w-3 rounded-full bg-blue-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {event.description}
                                    </p>
                                    {event.location && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            <MapPin className="h-3 w-3 inline mr-1" />
                                            {event.location}
                                        </p>
                                    )}
                                    {event.time && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(event.time).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Display */}
            {result.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-red-900 dark:text-red-200">
                                Tracking Error
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                {result.error}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
