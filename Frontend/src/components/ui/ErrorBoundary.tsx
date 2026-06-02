import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <main className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-6 py-6 min-h-[60vh]">
          <div className="bg-white border border-red-200 rounded-xl shadow-sm p-8 max-w-md text-center">
            <p className="text-red-600 font-bold text-lg mb-2">Something went wrong</p>
            <p className="text-gray-500 text-sm mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Try again
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
