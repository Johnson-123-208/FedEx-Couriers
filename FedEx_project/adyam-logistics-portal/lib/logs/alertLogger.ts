// Alert Logger - Structured logging to Supabase

import { supabaseAdmin } from '@/lib/supabase';

interface AlertLog {
    awb_no: string;
    phone_number: string | null;
    status: 'success' | 'failed' | 'pending';
    medium: 'whatsapp' | 'email' | 'sms';
    message_snippet: string;
    error_message?: string;
}

interface JobLog {
    job_name: string;
    status: 'running' | 'success' | 'failed';
    details?: Record<string, any>;
    error_message?: string;
}

/**
 * Log alert attempt
 */
export async function logAlert(log: AlertLog): Promise<void> {
    try {
        await supabaseAdmin.from('alerts').insert({
            awb_no: log.awb_no,
            phone_number: log.phone_number,
            status: log.status,
            medium: log.medium,
            message_snippet: log.message_snippet,
            error_message: log.error_message,
        });
    } catch (error: any) {
        console.error('Failed to log alert:', error.message);
    }
}

/**
 * Start job log
 */
export async function startJobLog(jobName: string): Promise<string> {
    try {
        const { data, error } = await supabaseAdmin
            .from('job_logs')
            .insert({
                job_name: jobName,
                status: 'running',
            })
            .select('id')
            .single();

        if (error) throw error;
        return data.id;
    } catch (error: any) {
        console.error('Failed to start job log:', error.message);
        return '';
    }
}

/**
 * Finish job log
 */
export async function finishJobLog(
    jobId: string,
    status: 'success' | 'failed',
    details?: Record<string, any>,
    errorMessage?: string
): Promise<void> {
    try {
        await supabaseAdmin
            .from('job_logs')
            .update({
                finished_at: new Date().toISOString(),
                status,
                details,
                error_message: errorMessage,
            })
            .eq('id', jobId);
    } catch (error: any) {
        console.error('Failed to finish job log:', error.message);
    }
}

/**
 * Record metric
 */
export async function recordMetric(
    metricName: string,
    value: number,
    metadata?: Record<string, any>
): Promise<void> {
    try {
        await supabaseAdmin.from('metrics').insert({
            metric_name: metricName,
            metric_value: value,
            metadata,
        });
    } catch (error: any) {
        console.error('Failed to record metric:', error.message);
    }
}
