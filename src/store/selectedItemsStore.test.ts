import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectedItemsStore } from './selectedItemsStore';

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

    toggleItem('pikachu');

    expect(useSelectedItemsStore.getState().selectedItems).toEqual(['pikachu']);
  });

  it('removes item when toggleItem called with already selected item', () => {
    const { toggleItem } = useSelectedItemsStore.getState();

    toggleItem('pikachu');
    toggleItem('pikachu');

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it('supports multiple selected items', () => {
    const { toggleItem } = useSelectedItemsStore.getState();

    toggleItem('bulbasaur');
    toggleItem('charmander');
    toggleItem('squirtle');

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([
      'bulbasaur',
      'charmander',
      'squirtle',
    ]);
  });

  it('unselectAll clears all selected items', () => {
    const { toggleItem, unselectAll } = useSelectedItemsStore.getState();

    toggleItem('bulbasaur');
    toggleItem('charmander');
    unselectAll();

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it('unselectAll on empty array does nothing', () => {
    const { unselectAll } = useSelectedItemsStore.getState();

    unselectAll();

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });
});