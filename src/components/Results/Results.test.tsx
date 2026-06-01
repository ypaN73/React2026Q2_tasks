import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import Results from './Results';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';

const mockItems = [
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

function renderResults(props: {
  items: typeof mockItems;
  loading: boolean;
  error: string | null;
}) {
  return render(
    <BrowserRouter>
      <Results {...props} />
    </BrowserRouter>
  );
}

describe('Results', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ selectedItems: [] });
  });

  it('renders loading indicator when loading is true', () => {
    renderResults({ items: [], loading: true, error: null });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    renderResults({ items: [], loading: false, error: 'Pokémon not found' });
    expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
  });

  it('renders "no results" message when items array is empty', () => {
    renderResults({ items: [], loading: false, error: null });
    expect(screen.getByText('No Pokémon found.')).toBeInTheDocument();
  });

  it('renders correct number of items', () => {
    renderResults({ items: mockItems, loading: false, error: null });
    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(2);
  });

  it('displays item names and descriptions', () => {
    renderResults({ items: mockItems, loading: false, error: null });
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(
      screen.getByText('A strange seed was planted on its back at birth.')
    ).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(
      screen.getByText('Obviously prefers hot places.')
    ).toBeInTheDocument();
  });

  it('does not show loading when loading is false', () => {
    renderResults({ items: mockItems, loading: false, error: null });
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('prioritizes loading over error', () => {
    renderResults({ items: [], loading: true, error: 'Some error' });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Some error')).not.toBeInTheDocument();
  });

  it('renders checkbox for each item', () => {
    renderResults({ items: mockItems, loading: false, error: null });
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
  });

  it('checkbox is unchecked by default', () => {
    renderResults({ items: mockItems, loading: false, error: null });
    const checkbox = screen.getAllByRole('checkbox')[0];
    expect(checkbox).not.toBeChecked();
  });

  it('selects item when checkbox clicked', async () => {
    renderResults({ items: mockItems, loading: false, error: null });
    const checkbox = screen.getAllByRole('checkbox')[0];

    await userEvent.click(checkbox);

    const selectedItems = useSelectedItemsStore.getState().selectedItems;
    expect(selectedItems.some((item) => item.name === 'bulbasaur')).toBe(true);
  });

  it('unselects item when checkbox clicked again', async () => {
    useSelectedItemsStore.setState({
      selectedItems: [
        {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/1/',
          description: 'A strange seed was planted on its back at birth.',
        },
      ],
    });
    renderResults({ items: mockItems, loading: false, error: null });
    const checkbox = screen.getAllByRole('checkbox')[0];

    await userEvent.click(checkbox);

    const selectedItems = useSelectedItemsStore.getState().selectedItems;
    expect(selectedItems.some((item) => item.name === 'bulbasaur')).toBe(false);
  });

  it('checkbox reflects selected state from store', () => {
    useSelectedItemsStore.setState({
      selectedItems: [
        {
          name: 'charmander',
          url: 'https://pokeapi.co/api/v2/pokemon/4/',
          description: 'Obviously prefers hot places.',
        },
      ],
    });
    renderResults({ items: mockItems, loading: false, error: null });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });
});