import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('Error caught by boundary:', {
      error,
      timestamp: new Date().toISOString()
    });
    return { 
      hasError: true, 
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    console.log('Attempting error recovery...', {
      timestamp: new Date().toISOString()
    });
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">{this.state.error?.message}</p>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <pre className="text-xs bg-gray-800 text-white p-4 rounded mt-4 overflow-auto">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={this.handleReset}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;