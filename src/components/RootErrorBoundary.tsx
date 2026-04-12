import { Component, type ErrorInfo, type ReactNode } from 'react';

type RootErrorBoundaryProps = {
  children: ReactNode;
};

type RootErrorBoundaryState = {
  hasError: boolean;
};

export class RootErrorBoundary extends Component<
  RootErrorBoundaryProps,
  RootErrorBoundaryState
> {
  declare props: Readonly<RootErrorBoundaryProps>;

  state: RootErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled application error', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="min-h-screen bg-surface text-stone-900 px-6 py-16 flex items-center justify-center">
        <section className="w-full max-w-2xl bg-white border border-outline-variant/20 shadow-sm p-10">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-primary mb-4">
            WeDesign+
          </p>
          <h1 className="text-4xl md:text-5xl mb-5">
            The app hit an unexpected error.
          </h1>
          <p className="font-sans text-sm leading-relaxed text-stone-600 max-w-xl">
            Reload the page to restore the experience. If the issue persists,
            check the deployment logs before promoting this build.
          </p>
          <button
            className="mt-8 bg-primary text-white px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-opacity"
            onClick={() => window.location.reload()}
            type="button"
          >
            Reload App
          </button>
        </section>
      </main>
    );
  }
}
