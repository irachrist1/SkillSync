'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
  _errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SkillSync Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          _errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-800">Something went wrong</CardTitle>
          <CardDescription>
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isDev && error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <details className="text-xs">
                <summary className="cursor-pointer font-medium text-red-800 mb-2">
                  Error Details (Development)
                </summary>
                <div className="text-red-700 font-mono whitespace-pre-wrap">
                  {error.message}
                  {error.stack && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      {error.stack}
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={resetError}
              className="flex-1"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack: string }) => {
    console.error('SkillSync Error:', error, errorInfo);
    
    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendErrorToService(error, errorInfo);
    }
  };
}

// Custom error types for better error handling
export class SkillSyncError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'SkillSyncError';
  }
}

export class AIServiceError extends SkillSyncError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'AI_SERVICE_ERROR', context);
    this.name = 'AIServiceError';
  }
}

export class DataValidationError extends SkillSyncError {
  constructor(message: string, field: string) {
    super(message, 'DATA_VALIDATION_ERROR', { field });
    this.name = 'DataValidationError';
  }
}

export default ErrorBoundary;
