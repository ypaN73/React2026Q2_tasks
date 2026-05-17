import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import App from './App';

const mockPokemonList = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      description: 'A strange seed was planted on its back at birth.',
    },
    {
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
      description:
        'When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.',
    },
  ],
};

const mockSinglePokemon = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
      description:
        'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
    },
  ],
};

vi.mock('./services/pokemonApi', () => ({
  fetchPokemonList: vi.fn(),
}));

import { fetchPokemonList } from './services/pokemonApi';

const STORAGE_KEY = 'pokemon-search-term';

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders search and results sections', async () => {
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPokemonList
    );
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
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPokemonList
    );
    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(fetchPokemonList).toHaveBeenCalledWith('', 1);
    });
  });

  it('fetches pokemon with saved term from localStorage', async () => {
    localStorage.setItem(STORAGE_KEY, 'pikachu');
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockSinglePokemon
    );
    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(fetchPokemonList).toHaveBeenCalledWith('pikachu', 1);
    });
  });

  it('displays pokemon names after successful fetch', async () => {
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPokemonList
    );
    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('displays pokemon descriptions after successful fetch', async () => {
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPokemonList
    );
    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'A strange seed was planted on its back at birth.'
        )
      ).toBeInTheDocument();
    });
  });

  it('shows loading indicator while fetching', async () => {
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockPokemonList), 100)
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
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Pokémon "zzzz" not found')
    );
    await act(async () => {
      renderApp();
    });

    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.type(input, 'zzzz');
    await userEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText('Pokémon "zzzz" not found')
      ).toBeInTheDocument();
    });
  });

  it('searches for specific pokemon when search button clicked', async () => {
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockSinglePokemon
    );
    await act(async () => {
      renderApp();
    });

    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.type(input, 'pikachu');
    await userEvent.click(button);

    await waitFor(() => {
      expect(fetchPokemonList).toHaveBeenCalledWith('pikachu', 1);
    });
  });

  it('saves search term to localStorage on search', async () => {
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockSinglePokemon
    );
    await act(async () => {
      renderApp();
    });

    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.type(input, 'pikachu');
    await userEvent.click(button);

    expect(localStorage.getItem(STORAGE_KEY)).toBe('pikachu');
  });

  it('renders ErrorButton', async () => {
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPokemonList
    );
    await act(async () => {
      renderApp();
    });
    expect(
      screen.getByRole('button', { name: 'Throw Error' })
    ).toBeInTheDocument();
  });

  it('shows error boundary fallback when ErrorButton clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPokemonList
    );
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
});