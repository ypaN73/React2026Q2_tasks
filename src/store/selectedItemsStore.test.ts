import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectedItemsStore } from './selectedItemsStore';
import type { PokemonItem } from '../types/pokemon';

const mockItem1: PokemonItem = {
  name: 'pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/25/',
  description: 'Electric mouse Pokémon',
};

const mockItem2: PokemonItem = {
  name: 'bulbasaur',
  url: 'https://pokeapi.co/api/v2/pokemon/1/',
  description: 'A strange seed was planted on its back at birth.',
};

const mockItem3: PokemonItem = {
  name: 'charmander',
  url: 'https://pokeapi.co/api/v2/pokemon/4/',
  description: 'Obviously prefers hot places.',
};

describe('selectedItemsStore', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ selectedItems: [] });
  });

  it('starts with empty selected items array', () => {
    const state = useSelectedItemsStore.getState();
    expect(state.selectedItems).toEqual([]);
  });

  it('adds item when toggleItem called with unselected item', () => {
    const { toggleItem } = useSelectedItemsStore.getState();

    toggleItem(mockItem1);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([mockItem1]);
  });

  it('removes item when toggleItem called with already selected item', () => {
    const { toggleItem } = useSelectedItemsStore.getState();

    toggleItem(mockItem1);
    toggleItem(mockItem1);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it('supports multiple selected items', () => {
    const { toggleItem } = useSelectedItemsStore.getState();

    toggleItem(mockItem1);
    toggleItem(mockItem2);
    toggleItem(mockItem3);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([
      mockItem1,
      mockItem2,
      mockItem3,
    ]);
  });

  it('removes only the unselected item from multiple', () => {
    const { toggleItem } = useSelectedItemsStore.getState();

    toggleItem(mockItem1);
    toggleItem(mockItem2);
    toggleItem(mockItem3);
    toggleItem(mockItem2);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([
      mockItem1,
      mockItem3,
    ]);
  });

  it('unselectAll clears all selected items', () => {
    const { toggleItem, unselectAll } = useSelectedItemsStore.getState();

    toggleItem(mockItem1);
    toggleItem(mockItem2);
    unselectAll();

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it('unselectAll on empty array does nothing', () => {
    const { unselectAll } = useSelectedItemsStore.getState();

    unselectAll();

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it('stores complete item data including description', () => {
    const { toggleItem } = useSelectedItemsStore.getState();

    toggleItem(mockItem1);

    const selected = useSelectedItemsStore.getState().selectedItems[0];
    expect(selected.name).toBe('pikachu');
    expect(selected.url).toBe('https://pokeapi.co/api/v2/pokemon/25/');
    expect(selected.description).toBe('Electric mouse Pokémon');
  });
});