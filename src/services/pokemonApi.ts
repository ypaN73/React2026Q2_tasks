import type { PokemonApiResponse } from '../types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2/pokemon';
const LIMIT = 20;

export async function fetchPokemonList(
  search: string
): Promise<PokemonApiResponse> {
  if (search.trim()) {
    const response = await fetch(
      `${API_BASE}/${search.trim().toLowerCase()}`
    );
    if (!response.ok) {
      throw new Error(`Pokémon "${search.trim()}" not found`);
    }
    const data = await response.json();
    return {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          name: data.name,
          url: `${API_BASE}/${data.id}/`,
        },
      ],
    };
  }

  const response = await fetch(`${API_BASE}?offset=0&limit=${LIMIT}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon list`);
  }
  return response.json();
}