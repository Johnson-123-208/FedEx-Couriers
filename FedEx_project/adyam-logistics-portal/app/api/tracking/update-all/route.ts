// Auto-update all tracking records

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { trackShipment } from '@/lib/tracking';
import { logger } from '@/lib/logs/logger';

interface UpdateSummary {
    checked: number;
    delivered_now: number;
    failed: number;
    logs: string[];
}

export async function POST(request: Request) {
    const startTime = Date.now();
    const summary: UpdateSummary = {
        checked: 0,
        delivered_now: 0,
        failed: 0,
        logs: [],
    };

    try {
        logger.info('Starting auto-update process');

        // Fetch all undelivered shipments
        const { data: shipments, error } = await supabaseAdmin
            .from('adyam_tracking')
            .select('*')
            .eq('delivered', false);

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        if (!shipments || shipments.length === 0) {
            summary.logs.push('No undelivered shipments found');
            return NextResponse.json(summary);
        }

        logger.info(`Found ${shipments.length} undelivered shipments`);

        // Process each shipment
        for (const shipment of shipments) {
            try {
                summary.checked++;

                logger.info(`Tracking ${shipment.awb_no} (${shipment.service_provider})`);

                // Track shipment
                const result = await trackShipment(
                    shipment.awb_no,
                    shipment.service_provider
                );

                // Prepare update data
                const updateData: any = {
                    status: result.status,
                    last_location: result.last_location,
                    last_event_time: result.last_event_time,
                    last_checked_at: new Date().toISOString(),
                };

                // Merge events (avoid duplicates)
                const existingEvents = shipment.web_events || [];
                const newEvents = result.events || [];
                const mergedEvents = [...existingEvents, ...newEvents];

                // Simple deduplication by description + time
                const uniqueEvents = mergedEvents.filter(
                    (event, index, self) =>
                        index ===
                        self.findIndex(
                            (e) =>
                                e.description === event.description &&
                                e.time === event.time
                        )
                );

                updateData.web_events = uniqueEvents;

                // Check if delivered
                if (result.delivered && !shipment.delivered) {
                    updateData.delivered = true;
                    updateData.delivered_at = new Date().toISOString();
                    summary.delivered_now++;
                    summary.logs.push(`✓ ${shipment.awb_no} marked as delivered`);
                }

                // Update database
                const { error: updateError } = await supabaseAdmin
                    .from('adyam_tracking')
                    .update(updateData)
                    .eq('id', shipment.id);

                if (updateError) {
                    throw new Error(`Update failed: ${updateError.message}`);
                }

                summary.logs.push(`✓ ${shipment.awb_no}: ${result.status}`);

            } catch (error: any) {
                summary.failed++;
                const errorMsg = `✗ ${shipment.awb_no}: ${error.message}`;
                summary.logs.push(errorMsg);
                logger.error(errorMsg);
            }

            // Rate limiting - wait between requests
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        summary.logs.push(`\nCompleted in ${duration}s`);

        logger.info('Auto-update completed', summary);

        return NextResponse.json(summary);

    } catch (error: any) {
        logger.error('Auto-update failed', error);
        return NextResponse.json(
            { error: error.message, summary },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Auto-update endpoint',
        usage: 'POST to this endpoint to update all undelivered shipments',
    });
}
