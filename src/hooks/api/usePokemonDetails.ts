import { useQuery } from '@tanstack/react-query';

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

async function fetchPokemonDetails(
  detailsId: string
): Promise<PokemonDetails> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${detailsId}`
  );
  if (!response.ok) {
    throw new Error(`Pokémon "${detailsId}" not found`);
  }
  return response.json();
}

export function usePokemonDetails(detailsId: string | undefined) {
  return useQuery({
    queryKey: ['pokemonDetail', detailsId],
    queryFn: () => fetchPokemonDetails(detailsId!),
    enabled: !!detailsId,
    staleTime: 300000,
  });
}