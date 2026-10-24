'use client';

// src/components/common/ErrorBoundary.tsx
import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // In production, log to monitoring system
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-2xl border border-red-500/30 bg-red-950/40 p-6 text-white my-4 shadow-lg flex flex-col items-center text-center gap-3"
          data-testid="error-boundary-fallback"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Something went wrong in the shield</h3>
            <p className="text-xs text-stone-300 mt-1 max-w-md">
              Kavach encountered an unexpected error rendering this component. You can reload the call session safely.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-700 transition active:scale-[0.98]"
            data-testid="error-boundary-retry-button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
