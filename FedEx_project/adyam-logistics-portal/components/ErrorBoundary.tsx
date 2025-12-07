// Error Boundary Component

"use client";

import React from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-3">
                            <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Something went wrong
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    {this.state.error?.message || 'An unexpected error occurred'}
                                </p>
                                <Button
                                    onClick={() => this.setState({ hasError: false })}
                                    className="mt-4"
                                    variant="secondary"
                                >
                                    Try again
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
