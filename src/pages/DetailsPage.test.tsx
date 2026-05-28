import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import DetailsPage from './DetailsPage';
import NotFoundPage from './NotFoundPage';

const mockPokemonDetails = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    front_default: 'https://example.com/pikachu.png',
  },
  types: [
    { type: { name: 'electric' } },
  ],
};

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function renderDetailsPage(initialEntries: string[]) {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/:detailsId" element={<DetailsPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('DetailsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when no detailsId', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<DetailsPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows loading indicator while fetching', () => {
    globalThis.fetch = vi.fn().mockImplementation(
      () => new Promise(() => { })
    );

    renderDetailsPage(['/pikachu']);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message on failed fetch', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });

    renderDetailsPage(['/pikachu']);

    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Page not found')).toBeInTheDocument();
    });
  });

  it('shows error message on network error', async () => {
    globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    renderDetailsPage(['/pikachu']);

    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Page not found')).toBeInTheDocument();
    });
  });

  it('displays pokemon details after successful fetch', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonDetails),
    });

    renderDetailsPage(['/pikachu']);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
    expect(screen.getByText('Height:')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Weight:')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  it('has close button that navigates back', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonDetails),
    });

    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter initialEntries={['/pikachu?page=2']}>
          <Routes>
            <Route path="/:detailsId" element={<DetailsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('✕');
    await userEvent.click(closeButton);
  });
});