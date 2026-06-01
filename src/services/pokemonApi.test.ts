import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPokemonList } from './pokemonApi';

const mockPokemonList = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

const mockPokemonDetail = {
  id: 25,
  name: 'pikachu',
  species: {
    url: 'https://pokeapi.co/api/v2/pokemon-species/25/',
  },
};

const mockSpecies = {
  flavor_text_entries: [
    {
      flavor_text:
        'When several of these\nPokémon gather, their\felectricity could build\nand cause lightning storms.',
      language: { name: 'en' },
    },
    {
      flavor_text: 'Un pokémon électrique.',
      language: { name: 'fr' },
    },
  ],
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('fetchPokemonList', () => {
  it('fetches paginated list when search is empty', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonList),
    });

    const result = await fetchPokemonList('');

    expect(result.count).toBe(1302);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].name).toBe('bulbasaur');
    expect(result.results[0].description).toBe('No description available.');
  });

  it('fetches single pokemon when search term provided', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetail),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSpecies),
      });

    const result = await fetchPokemonList('pikachu');

    expect(result.count).toBe(1);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].name).toBe('pikachu');
    expect(result.results[0].description).toContain(
      'When several of these'
    );
  });

  it('removes extra whitespace from search term', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetail),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSpecies),
      });

    const result = await fetchPokemonList('  pikachu  ');

    expect(result.results[0].name).toBe('pikachu');
  });

  it('throws error when single pokemon not found', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchPokemonList('zzzz')).rejects.toThrow(
      'Pokémon "zzzz" not found'
    );
  });

  it('throws error when pokemon list fetch fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchPokemonList('')).rejects.toThrow(
      'Failed to fetch Pokémon list'
    );
  });

  it('returns description from species when available', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetail),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSpecies),
      });

    const result = await fetchPokemonList('pikachu');

    expect(result.results[0].description).toBe(
      'When several of these Pokémon gather, their electricity could build and cause lightning storms.'
    );
  });

  it('returns fallback description when species fetch fails', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetail),
      })
      .mockResolvedValueOnce({
        ok: false,
      });

    const result = await fetchPokemonList('pikachu');

    expect(result.results[0].description).toBe(
      'No description available.'
    );
  });

  it('returns fallback description when no english entry exists', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetail),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            flavor_text_entries: [
              {
                flavor_text: 'Un pokémon électrique.',
                language: { name: 'fr' },
              },
            ],
          }),
      });

    const result = await fetchPokemonList('pikachu');

    expect(result.results[0].description).toBe(
      'No description available.'
    );
  });
});