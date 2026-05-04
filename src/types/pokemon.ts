export interface PokemonItem {
  name: string;
  url: string;
  description: string;
}

export interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonItem[];
}

export interface PokemonSpeciesData {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

export interface PokemonListResult {
  name: string;
  url: string;
}