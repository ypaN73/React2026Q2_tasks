import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Component } from 'react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { ErrorBoundary } from './ErrorBoundary';
import enMessages from '../../messages/en.json';

class FaultyComponent extends Component {
  render(): ReactNode {
    throw new Error('Test crash');
    return null;
  }
}

class StableComponent extends Component {
  render() {
    return <div>All good</div>;
  }
}

class FaultyNoMessage extends Component {
  render(): ReactNode {
    throw new Error();
    return null;
  }
}

function renderWithProviders(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <StableComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('displays fallback UI when child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    renderWithProviders(
      <ErrorBoundary>
        <FaultyComponent />
      </ErrorBoundary>
    );
    expect(
      screen.getByText('Oops! Something went wrong.')
    ).toBeInTheDocument();
    expect(screen.getByText('Test crash')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('logs error to console when child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    renderWithProviders(
      <ErrorBoundary>
        <FaultyComponent />
      </ErrorBoundary>
    );
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('shows default error message if error has no message', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    renderWithProviders(
      <ErrorBoundary>
        <FaultyNoMessage />
      </ErrorBoundary>
    );
    expect(
      screen.getByText('An unexpected error occurred.')
    ).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('calls handleReset and recovers when Try Again clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    let shouldFail = true;

    class ResettableComponent extends Component<
      object,
      { fail: boolean }
    > {
      constructor(props: object) {
        super(props);
        this.state = { fail: shouldFail };
      }

      render() {
        if (this.state.fail) {
          throw new Error('Boom');
        }
        return <div>Recovered!</div>;
      }
    }

    renderWithProviders(
      <ErrorBoundary>
        <ResettableComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByText('Oops! Something went wrong.')
    ).toBeInTheDocument();

    shouldFail = false;

    const tryAgainButton = screen.getByRole('button', {
      name: 'Try Again',
    });
    await userEvent.click(tryAgainButton);

    expect(screen.getByText('Recovered!')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});