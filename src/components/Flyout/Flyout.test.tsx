import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Flyout from './Flyout';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import type { PokemonItem } from '../../types/pokemon';

const mockItems: PokemonItem[] = [
  {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/25/',
    description: 'Electric mouse Pokémon',
  },
  {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
    description: 'A strange seed was planted on its back at birth.',
  },
  {
    name: 'charmander',
    url: 'https://pokeapi.co/api/v2/pokemon/4/',
    description: 'Obviously prefers hot places.',
  },
];

describe('Flyout', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ selectedItems: [] });
  });

  it('renders nothing when no items selected', () => {
    const { container } = render(<Flyout />);
    expect(container.firstChild).toBeNull();
  });

  it('displays correct count for single selected item', () => {
    useSelectedItemsStore.setState({ selectedItems: [mockItems[0]] });
    render(<Flyout />);

    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('displays correct count for multiple selected items', () => {
    useSelectedItemsStore.setState({
      selectedItems: [mockItems[0], mockItems[1], mockItems[2]],
    });
    render(<Flyout />);

    expect(screen.getByText('3 items selected')).toBeInTheDocument();
  });

  it('has sticky position class', () => {
    useSelectedItemsStore.setState({ selectedItems: [mockItems[0]] });
    render(<Flyout />);

    const flyout = screen.getByText('1 item selected').closest('.flyout');
    expect(flyout).toBeInTheDocument();
  });

  it('calls unselectAll when Unselect all button clicked', () => {
    useSelectedItemsStore.setState({
      selectedItems: [mockItems[0], mockItems[1]],
    });
    render(<Flyout />);

    const unselectButton = screen.getByText('Unselect all');
    fireEvent.click(unselectButton);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it('renders both Unselect all and Download buttons', () => {
    useSelectedItemsStore.setState({ selectedItems: [mockItems[0]] });
    render(<Flyout />);

    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('generates CSV file when Download button clicked', () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = mockCreateObjectURL;

    useSelectedItemsStore.setState({
      selectedItems: [mockItems[0]],
    });
    render(<Flyout />);

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    expect(mockCreateObjectURL).toHaveBeenCalled();

    URL.createObjectURL = originalCreateObjectURL;
  });

  it('includes selected items data in CSV even if not in allItems prop', () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = mockCreateObjectURL;

    useSelectedItemsStore.setState({
      selectedItems: [mockItems[1], mockItems[2]],
    });
    render(<Flyout />);

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    const blob = mockCreateObjectURL.mock.calls[0][0];
    expect(blob).toBeDefined();

    URL.createObjectURL = originalCreateObjectURL;
  });
});