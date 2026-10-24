// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

function BrokenComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Simulated test crash');
  }
  return <div>Component loaded normally</div>;
}

describe('ErrorBoundary Component', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal Child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Child')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws an error and allows reset', () => {
    // Suppress console.error in test output for expected error boundary log
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function TestApp() {
      const [crash, setCrash] = useState(true);
      return (
        <ErrorBoundary onReset={() => setCrash(false)}>
          <BrokenComponent shouldThrow={crash} />
        </ErrorBoundary>
      );
    }

    render(<TestApp />);

    expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong in the shield/i)).toBeInTheDocument();

    // Click retry button to reset
    fireEvent.click(screen.getByTestId('error-boundary-retry-button'));
    expect(screen.getByText('Component loaded normally')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
