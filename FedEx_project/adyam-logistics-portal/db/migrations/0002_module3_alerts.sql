-- Module 3: Alerts, Job Logs, and Metrics Tables

-- Alerts tracking table
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  awb_no TEXT NOT NULL,
  phone_number TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL, -- 'success', 'failed', 'pending'
  medium TEXT NOT NULL, -- 'whatsapp', 'email', 'sms'
  message_snippet TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alerts_awb ON public.alerts(awb_no);
CREATE INDEX idx_alerts_attempted_at ON public.alerts(attempted_at DESC);

-- Job execution logs
CREATE TABLE IF NOT EXISTS public.job_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_name TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL, -- 'running', 'success', 'failed'
  details JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_job_logs_job_name ON public.job_logs(job_name);
CREATE INDEX idx_job_logs_started_at ON public.job_logs(started_at DESC);

-- Metrics tracking
CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_metrics_name_timestamp ON public.metrics(metric_name, timestamp DESC);

-- Note: alert_phone, last_alerted_at, and alert_attempts are now in base schema (0000_initial_schema.sql)

-- RLS policies for new tables
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins have full access to alerts" ON public.alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to job_logs" ON public.job_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to metrics" ON public.metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Employees can view
CREATE POLICY "Employees can view alerts" ON public.alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'employee'
    )
  );

CREATE POLICY "Employees can view job_logs" ON public.job_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'employee'
    )
  );
