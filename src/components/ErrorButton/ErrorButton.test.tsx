import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Component } from 'react';
import type { ReactNode } from 'react';
import ErrorButton from './ErrorButton';

class TestErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error caught</div>;
    }
    return this.props.children;
  }
}

describe('ErrorButton', () => {
  it('renders the error button', () => {
    render(<ErrorButton />);
    expect(
      screen.getByRole('button', { name: 'Throw Error' })
    ).toBeInTheDocument();
  });

  it('throws error and triggers error boundary fallback', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    render(
      <TestErrorBoundary>
        <ErrorButton />
      </TestErrorBoundary>
    );

    const button = screen.getByRole('button', { name: 'Throw Error' });
    await userEvent.click(button);

    expect(screen.getByText('Error caught')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});