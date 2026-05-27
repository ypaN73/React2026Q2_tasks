import { useQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../../services/pokemonApi';

export function usePokemonList(term: string, page: number) {
  return useQuery({
    queryKey: ['pokemonList', term, page],
    queryFn: () => fetchPokemonList(term, page),
    placeholderData: (previousData) => previousData,
  });
}