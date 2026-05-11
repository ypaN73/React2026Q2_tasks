import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Results from './Results';

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

describe('Results', () => {
  it('renders loading indicator when loading is true', () => {
    render(<Results items={[]} loading={true} error={null} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    render(<Results items={[]} loading={false} error="Pokémon not found" />);
    expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
  });

  it('renders "no results" message when items array is empty', () => {
    render(<Results items={[]} loading={false} error={null} />);
    expect(screen.getByText('No Pokémon found.')).toBeInTheDocument();
  });

  it('renders correct number of items', () => {
    render(<Results items={mockItems} loading={false} error={null} />);
    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(2);
  });

  it('displays item names and descriptions', () => {
    render(<Results items={mockItems} loading={false} error={null} />);
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
    render(<Results items={mockItems} loading={false} error={null} />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('prioritizes loading over error', () => {
    render(<Results items={[]} loading={true} error="Some error" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Some error')).not.toBeInTheDocument();
  });
});