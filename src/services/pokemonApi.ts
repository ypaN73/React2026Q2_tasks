import type {
  PokemonApiResponse,
  PokemonSpeciesData,
  PokemonListResult,
  PokemonItem,
} from '../types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';
const LIMIT = 20;

function extractEnglishDescription(species: PokemonSpeciesData): string {
  if (!species.flavor_text_entries || species.flavor_text_entries.length === 0) {
    return 'No description available.';
  }
  const entry = species.flavor_text_entries.find(
    (e) => e.language.name === 'en'
  );
  if (!entry) return 'No description available.';
  return entry.flavor_text.replace(/[\f\n\r]/g, ' ');
}

async function fetchPokemonDescription(name: string): Promise<string> {
  try {
    const speciesResponse = await fetch(
      `${API_BASE}/pokemon-species/${name}`
    );
    if (!speciesResponse.ok) {
      return 'No description available.';
    }
    const species: PokemonSpeciesData = await speciesResponse.json();
    return extractEnglishDescription(species);
  } catch {
    return 'No description available.';
  }
}

async function fetchSinglePokemon(search: string): Promise<PokemonItem> {
  const response = await fetch(
    `${API_BASE}/pokemon/${search.trim().toLowerCase()}`
  );
  if (!response.ok) {
    throw new Error(`Pokémon "${search.trim()}" not found`);
  }
  const data = await response.json();

  const description = await fetchPokemonDescription(data.name);

  return {
    name: data.name,
    url: `${API_BASE}/pokemon/${data.id}/`,
    description,
  };
}

export async function fetchPokemonList(
  search: string,
  page: number = 1
): Promise<PokemonApiResponse> {
  if (search.trim()) {
    const item = await fetchSinglePokemon(search);
    return {
      count: 1,
      next: null,
      previous: null,
      results: [item],
    };
  }

  const offset = (page - 1) * LIMIT;
  const response = await fetch(
    `${API_BASE}/pokemon?offset=${offset}&limit=${LIMIT}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon list`);
  }
  const data = await response.json();

  const resultsWithDescriptions = await Promise.all(
    data.results.map(async (result: PokemonListResult) => {
      const description = await fetchPokemonDescription(result.name);
      return {
        name: result.name,
        url: result.url,
        description,
      };
    })
  );

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: resultsWithDescriptions,
  };
}