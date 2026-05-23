import { create } from 'zustand';
import type { PokemonItem } from '../types/pokemon';

interface SelectedItemsState {
  selectedItems: PokemonItem[];
  toggleItem: (item: PokemonItem) => void;
  unselectAll: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
  selectedItems: [],
  toggleItem: (item: PokemonItem) =>
    set((state) => {
      const isSelected = state.selectedItems.some(
        (selected) => selected.name === item.name
      );
      return {
        selectedItems: isSelected
          ? state.selectedItems.filter((selected) => selected.name !== item.name)
          : [...state.selectedItems, item],
      };
    }),
  unselectAll: () => set({ selectedItems: [] }),
}));