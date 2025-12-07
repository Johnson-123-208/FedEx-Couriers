// Alert Manager - Idempotent alerting with 6-hour cadence

import { supabaseAdmin } from '@/lib/supabase';
import { getWhatsAppClient } from '@/lib/whatsapp/whatsappClient';
import { logger } from '@/lib/logs/logger';
import { logAlert } from '@/lib/logs/alertLogger';

interface AlertCandidate {
    id: string;
    awb_no: string;
    receiver: string;
    status: string;
    last_location: string | null;
    last_checked_at: string;
    service_provider: string;
    alert_phone: string | null;
    alert_attempts: number;
}

const MAX_ATTEMPTS = 4;
const ALERT_INTERVAL_HOURS = 6;

/**
 * Build WhatsApp message from tracking data
 */
function buildMessage(candidate: AlertCandidate): string {
    const lastChecked = new Date(candidate.last_checked_at).toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

    return `📦 Shipment Update

AWB: ${candidate.awb_no}
Customer: ${candidate.receiver || 'N/A'}
Status: ${candidate.status}
Location: ${candidate.last_location || 'Unknown'}
Last checked: ${lastChecked}
Provider: ${candidate.service_provider}

Track: ${process.env.NEXT_PUBLIC_APP_URL || 'https://adyam-logistics.vercel.app'}/track?awb=${candidate.awb_no}`;
}

/**
 * Get candidates for alerting (atomic claim with FOR UPDATE SKIP LOCKED)
 */
async function getAlertCandidates(): Promise<AlertCandidate[]> {
    const { data, error } = await supabaseAdmin.rpc('claim_alert_candidates', {
        batch_size: 50,
        claim_duration_minutes: 15
    });

    if (error) {
        throw new Error(`Failed to claim alert candidates: ${error.message}`);
    }

    return (data || []) as AlertCandidate[];
}

/**
 * Send alert via WhatsApp with exponential backoff retry
 */
async function sendAlertWithRetry(candidate: AlertCandidate): Promise<{ success: boolean; error?: string }> {
    const delays = [0, 2000, 4000, 8000]; // 0s, 2s, 4s, 8s

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        // Wait before retry (except first attempt)
        if (delays[attempt] > 0) {
            logger.info(`Retry attempt ${attempt + 1} for ${candidate.awb_no} after ${delays[attempt]}ms`);
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        }

        const result = await sendAlert(candidate, attempt);

        if (result.success) {
            return result;
        }

        // If last attempt, return failure
        if (attempt === MAX_ATTEMPTS - 1) {
            return result;
        }
    }

    return { success: false, error: 'Max retries exceeded' };
}

/**
 * Send alert via WhatsApp (single attempt)
 */
async function sendAlert(candidate: AlertCandidate, attemptNumber: number = 0): Promise<{ success: boolean; error?: string }> {
    if (!candidate.alert_phone) {
        return { success: false, error: 'No phone number' };
    }

    try {
        const message = buildMessage(candidate);
        const waClient = await getWhatsAppClient();
        const result = await waClient.sendMessage(candidate.alert_phone, message);

        if (result.ok) {
            // Update tracking record
            const nextAlertAt = new Date();
            nextAlertAt.setHours(nextAlertAt.getHours() + ALERT_INTERVAL_HOURS);

            await supabaseAdmin
                .from('adyam_tracking')
                .update({
                    last_alerted_at: new Date().toISOString(),
                    next_alert_at: nextAlertAt.toISOString(),
                    alert_attempts: 0, // Reset on success
                })
                .eq('id', candidate.id);

            // Log success
            await logAlert({
                awb_no: candidate.awb_no,
                phone_number: candidate.alert_phone,
                status: 'success',
                medium: 'whatsapp',
                message_snippet: message.substring(0, 100),
            });

            return { success: true };
        } else {
            throw new Error(result.reason || 'Unknown error');
        }

    } catch (error: any) {
        // Increment attempt counter only on last retry
        if (attemptNumber === MAX_ATTEMPTS - 1) {
            await supabaseAdmin
                .from('adyam_tracking')
                .update({
                    alert_attempts: candidate.alert_attempts + 1,
                })
                .eq('id', candidate.id);
        }

        // Log failure
        await logAlert({
            awb_no: candidate.awb_no,
            phone_number: candidate.alert_phone,
            status: 'failed',
            medium: 'whatsapp',
            message_snippet: buildMessage(candidate).substring(0, 100),
            error_message: `Attempt ${attemptNumber + 1}: ${error.message}`,
        });

        return { success: false, error: error.message };
    }
}

/**
 * Send email fallback (admin escalation)
 */
async function sendEmailFallback(candidate: AlertCandidate, error: string): Promise<void> {
    // TODO: Implement email sending (SendGrid, Resend, etc.)
    logger.error(`Email fallback for ${candidate.awb_no}`, { error });

    await logAlert({
        awb_no: candidate.awb_no,
        phone_number: process.env.ADMIN_EMAIL || 'admin@adyam.com',
        status: 'failed',
        medium: 'email',
        message_snippet: `WhatsApp failed after ${candidate.alert_attempts} attempts`,
        error_message: error,
    });
}

/**
 * Process all pending alerts
 */
export async function processAlerts(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    errors: string[];
}> {
    const summary = {
        processed: 0,
        succeeded: 0,
        failed: 0,
        errors: [] as string[],
    };

    try {
        const candidates = await getAlertCandidates();
        logger.info(`Found ${candidates.length} alert candidates`);

        for (const candidate of candidates) {
            summary.processed++;

            const result = await sendAlertWithRetry(candidate);

            if (result.success) {
                summary.succeeded++;
                logger.info(`✓ Alert sent for ${candidate.awb_no}`);
            } else {
                summary.failed++;
                summary.errors.push(`${candidate.awb_no}: ${result.error}`);
                logger.error(`✗ Alert failed for ${candidate.awb_no}: ${result.error}`);

                // Escalate to email if max attempts reached
                if (candidate.alert_attempts + 1 >= MAX_ATTEMPTS) {
                    await sendEmailFallback(candidate, result.error || 'Unknown error');
                }
            }

            // Rate limiting between messages
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

    } catch (error: any) {
        logger.error('Alert processing failed', error);
        summary.errors.push(error.message);
    }

    return summary;
}
