import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import RefreshButton from './RefreshButton';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

describe('RefreshButton', () => {
  it('renders refresh button', () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <RefreshButton />
      </QueryClientProvider>
    );

    expect(
      screen.getByRole('button', { name: '🔄 Refresh' })
    ).toBeInTheDocument();
  });

  it('invalidates pokemonList and pokemonDetail queries on click', async () => {
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    render(
      <QueryClientProvider client={queryClient}>
        <RefreshButton />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button', { name: '🔄 Refresh' });
    await userEvent.click(button);

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pokemonList'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pokemonDetail'] });
  });
});