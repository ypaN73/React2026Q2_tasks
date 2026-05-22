import { create } from 'zustand';

interface SelectedItemsState {
  selectedItems: string[];
  toggleItem: (name: string) => void;
  unselectAll: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
  selectedItems: [],
  toggleItem: (name: string) =>
    set((state) => ({
      selectedItems: state.selectedItems.includes(name)
        ? state.selectedItems.filter((item) => item !== name)
        : [...state.selectedItems, name],
    })),
  unselectAll: () => set({ selectedItems: [] }),
}));