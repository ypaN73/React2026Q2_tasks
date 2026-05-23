import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Flyout from './Flyout';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';

const mockItems = [
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
    const { container } = render(<Flyout allItems={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays correct count for single selected item', () => {
    useSelectedItemsStore.setState({ selectedItems: ['pikachu'] });
    render(<Flyout allItems={mockItems} />);

    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('displays correct count for multiple selected items', () => {
    useSelectedItemsStore.setState({
      selectedItems: ['pikachu', 'bulbasaur', 'charmander'],
    });
    render(<Flyout allItems={mockItems} />);

    expect(screen.getByText('3 items selected')).toBeInTheDocument();
  });

  it('has sticky position class', () => {
    useSelectedItemsStore.setState({ selectedItems: ['pikachu'] });
    render(<Flyout allItems={mockItems} />);

    const flyout = screen.getByText('1 item selected').closest('.flyout');
    expect(flyout).toBeInTheDocument();
  });

  it('calls unselectAll when Unselect all button clicked', () => {
    useSelectedItemsStore.setState({
      selectedItems: ['pikachu', 'bulbasaur'],
    });
    render(<Flyout allItems={mockItems} />);

    const unselectButton = screen.getByText('Unselect all');
    fireEvent.click(unselectButton);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it('renders both Unselect all and Download buttons', () => {
    useSelectedItemsStore.setState({ selectedItems: ['pikachu'] });
    render(<Flyout allItems={mockItems} />);

    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('generates CSV file with correct filename on Download click', () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
    const mockRevokeObjectURL = vi.fn();
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;

    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const anchor = originalCreateElement('a');
        anchor.click = clickSpy;
        return anchor;
      }
      return originalCreateElement(tagName);
    });

    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    useSelectedItemsStore.setState({
      selectedItems: ['pikachu', 'bulbasaur'],
    });
    render(<Flyout allItems={mockItems} />);

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});