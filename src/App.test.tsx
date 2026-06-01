import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import App from './App';
import { ThemeProvider } from './context/ThemeProvider';

const STORAGE_KEY = 'pokemon-search-term';

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

function renderApp() {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const bulbasaurDescription = 'A strange seed was planted on its back at birth.';
const ivysaurDescription =
  'When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders search and results sections', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          count: 0,
          next: null,
          previous: null,
          results: [],
        }),
    });

    await act(async () => {
      renderApp();
    });

    expect(
      screen.getByPlaceholderText('Search Pokémon...')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Search' })
    ).toBeInTheDocument();
  });

  it('fetches all pokemon on initial load with empty search', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 2,
            next: null,
            previous: null,
            results: [
              { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
              { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            flavor_text_entries: [
              { flavor_text: bulbasaurDescription, language: { name: 'en' } },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            flavor_text_entries: [
              { flavor_text: ivysaurDescription, language: { name: 'en' } },
            ],
          }),
      });

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('fetches pokemon with saved term from localStorage', async () => {
    localStorage.setItem(STORAGE_KEY, 'pikachu');

    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 0,
            next: null,
            previous: null,
            results: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 25,
            name: 'pikachu',
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            flavor_text_entries: [
              {
                flavor_text:
                  'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
                language: { name: 'en' },
              },
            ],
          }),
      });

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
  });

  it('displays pokemon names after successful fetch', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 2,
            next: null,
            previous: null,
            results: [
              { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
              { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            flavor_text_entries: [
              { flavor_text: bulbasaurDescription, language: { name: 'en' } },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            flavor_text_entries: [
              { flavor_text: ivysaurDescription, language: { name: 'en' } },
            ],
          }),
      });

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('displays pokemon descriptions after successful fetch', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 2,
            next: null,
            previous: null,
            results: [
              { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
              { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            flavor_text_entries: [
              { flavor_text: bulbasaurDescription, language: { name: 'en' } },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            flavor_text_entries: [
              { flavor_text: ivysaurDescription, language: { name: 'en' } },
            ],
          }),
      });

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText(bulbasaurDescription)).toBeInTheDocument();
    });
    expect(screen.getByText(ivysaurDescription)).toBeInTheDocument();
  });

  it('shows loading indicator while fetching', async () => {
    globalThis.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () =>
                  Promise.resolve({
                    count: 0,
                    next: null,
                    previous: null,
                    results: [],
                  }),
              }),
            100
          )
        )
    );

    await act(async () => {
      renderApp();
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('shows error message on failed API call', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 0,
            next: null,
            previous: null,
            results: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

    await act(async () => {
      renderApp();
    });

    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.clear(input);
    await userEvent.type(input, 'zzzz');
    await userEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText('Pokémon "zzzz" not found')
      ).toBeInTheDocument();
    });
  });

  it('searches for specific pokemon when search button clicked', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 0,
            next: null,
            previous: null,
            results: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 25,
            name: 'pikachu',
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            flavor_text_entries: [
              {
                flavor_text:
                  'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
                language: { name: 'en' },
              },
            ],
          }),
      });

    await act(async () => {
      renderApp();
    });

    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.clear(input);
    await userEvent.type(input, 'pikachu');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
  });

  it('saves search term to localStorage on search', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 0,
            next: null,
            previous: null,
            results: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 25,
            name: 'pikachu',
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            flavor_text_entries: [
              {
                flavor_text:
                  'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
                language: { name: 'en' },
              },
            ],
          }),
      });

    await act(async () => {
      renderApp();
    });

    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.clear(input);
    await userEvent.type(input, 'pikachu');
    await userEvent.click(button);

    expect(localStorage.getItem(STORAGE_KEY)).toBe('pikachu');
  });

  it('renders ErrorButton', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          count: 0,
          next: null,
          previous: null,
          results: [],
        }),
    });

    await act(async () => {
      renderApp();
    });

    expect(
      screen.getByRole('button', { name: 'Throw Error' })
    ).toBeInTheDocument();
  });

  it('shows error boundary fallback when ErrorButton clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          count: 0,
          next: null,
          previous: null,
          results: [],
        }),
    });

    await act(async () => {
      renderApp();
    });

    const errorButton = screen.getByRole('button', { name: 'Throw Error' });
    await userEvent.click(errorButton);

    expect(
      screen.getByText('Oops! Something went wrong.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Test error triggered by Error Button')
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('navigates to About page', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          count: 0,
          next: null,
          previous: null,
          results: [],
        }),
    });

    await act(async () => {
      renderApp();
    });

    const aboutLink = screen.getByText('About');
    await userEvent.click(aboutLink);

    expect(screen.getByText('Author: Polina')).toBeInTheDocument();
  });

  it('shows 404 page for unknown route', () => {
    const queryClient = createQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/non/existing/path']}>
            <App />
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByText('← Back to Home')).toBeInTheDocument();
  });
});