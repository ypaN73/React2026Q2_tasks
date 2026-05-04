import type {
  PokemonApiResponse,
  PokemonSpeciesData,
  PokemonListResult,
  PokemonItem,
} from '../types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';
const LIMIT = 20;

function extractEnglishDescription(species: PokemonSpeciesData): string {
  const entry = species.flavor_text_entries.find(
    (e) => e.language.name === 'en'
  );
  if (!entry) return 'No description available.';
  return entry.flavor_text.replace(/[\f\n\r]/g, ' ');
}

async function fetchSinglePokemon(search: string): Promise<PokemonItem> {
  const response = await fetch(
    `${API_BASE}/pokemon/${search.trim().toLowerCase()}`
  );
  if (!response.ok) {
    throw new Error(`Pokémon "${search.trim()}" not found`);
  }
  const data = await response.json();

  const speciesResponse = await fetch(data.species.url);
  if (!speciesResponse.ok) {
    return {
      name: data.name,
      url: `${API_BASE}/pokemon/${data.id}/`,
      description: 'No description available.',
    };
  }
  const species: PokemonSpeciesData = await speciesResponse.json();
  return {
    name: data.name,
    url: `${API_BASE}/pokemon/${data.id}/`,
    description: extractEnglishDescription(species),
  };
}

export async function fetchPokemonList(
  search: string
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

  const response = await fetch(`${API_BASE}/pokemon?offset=0&limit=${LIMIT}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon list`);
  }
  const data = await response.json();

  const resultsWithDescriptions = await Promise.all(
    data.results.map(async (result: PokemonListResult) => {
      try {
        const speciesResponse = await fetch(
          `${API_BASE}/pokemon-species/${result.name}`
        );
        if (!speciesResponse.ok) {
          return {
            name: result.name,
            url: result.url,
            description: 'No description available.',
          };
        }
        const species: PokemonSpeciesData = await speciesResponse.json();
        return {
          name: result.name,
          url: result.url,
          description: extractEnglishDescription(species),
        };
      } catch {
        return {
          name: result.name,
          url: result.url,
          description: 'No description available.',
        };
      }
    })
  );

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: resultsWithDescriptions,
  };
}
