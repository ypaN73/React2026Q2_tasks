'use server';

import type { PokemonItem, PokemonApiResponse } from '@/types/pokemon';
import { fetchPokemonList } from '@/services/pokemonApi';

export async function searchPokemon(
  prevState: { data: PokemonApiResponse | null; error: string | null } | null,
  formData: FormData
): Promise<{ data: PokemonApiResponse | null; error: string | null }> {
  const query = formData.get('q') as string;
  const page = formData.get('page') as string;

  if (!query?.trim()) {
    try {
      const data = await fetchPokemonList('', Number(page) || 1);
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'Unknown error' };
    }
  }

  try {
    const data = await fetchPokemonList(query, Number(page) || 1);
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function downloadCsv(items: PokemonItem[]): Promise<string> {
  const csvHeader = 'Name,Description,Details URL';
  const csvRows = items.map(
    (item) => `"${item.name}","${item.description}","${item.url}"`
  );
  return [csvHeader, ...csvRows].join('\n');
}