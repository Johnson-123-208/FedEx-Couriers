// Production-grade logging system

enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: any;
}

class Logger {
    private logs: LogEntry[] = [];
    private maxLogs = 1000;

    private log(level: LogLevel, message: string, data?: any): void {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
        };

        this.logs.push(entry);

        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Console output
        const logMethod = level === LogLevel.ERROR ? console.error : console.log;
        const prefix = `[${entry.timestamp}] [${level}]`;

        if (data) {
            logMethod(prefix, message, data);
        } else {
            logMethod(prefix, message);
        }

        // In production, send to external logging service
        // e.g., Sentry, LogRocket, Datadog
        if (level === LogLevel.ERROR && typeof window !== 'undefined') {
            // Client-side error tracking
            // Sentry.captureException(new Error(message), { extra: data });
        }
    }

    debug(message: string, data?: any): void {
        this.log(LogLevel.DEBUG, message, data);
    }

    info(message: string, data?: any): void {
        this.log(LogLevel.INFO, message, data);
    }

    warn(message: string, data?: any): void {
        this.log(LogLevel.WARN, message, data);
    }

    error(message: string, data?: any): void {
        this.log(LogLevel.ERROR, message, data);
    }

    getLogs(level?: LogLevel): LogEntry[] {
        if (level) {
            return this.logs.filter((log) => log.level === level);
        }
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }
}

export const logger = new Logger();
export { LogLevel };
