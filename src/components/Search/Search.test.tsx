import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Search from './Search';

const STORAGE_KEY = 'pokemon-search-term';

describe('Search', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders search input and search button', () => {
    render(<Search onSearch={vi.fn()} previousTerm="" />);
    expect(
      screen.getByPlaceholderText('Search Pokémon...')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Search' })
    ).toBeInTheDocument();
  });

  it('displays previously saved search term from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, 'pikachu');
    render(<Search onSearch={vi.fn()} previousTerm="" />);
    const input = screen.getByPlaceholderText('Search Pokémon...');
    expect(input).toHaveValue('pikachu');
  });

  it('shows empty input when no saved term exists', () => {
    render(<Search onSearch={vi.fn()} previousTerm="" />);
    const input = screen.getByPlaceholderText('Search Pokémon...');
    expect(input).toHaveValue('');
  });

  it('updates input value when user types', async () => {
    render(<Search onSearch={vi.fn()} previousTerm="" />);
    const input = screen.getByPlaceholderText('Search Pokémon...');
    await userEvent.type(input, 'charizard');
    expect(input).toHaveValue('charizard');
  });

  it('calls onSearch on mount with saved term', () => {
    localStorage.setItem(STORAGE_KEY, 'bulbasaur');
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} previousTerm="" />);
    expect(onSearch).toHaveBeenCalledWith('bulbasaur');
  });

  it('calls onSearch with trimmed value when button clicked', async () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} previousTerm="" />);
    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.type(input, '  mewtwo  ');
    await userEvent.click(button);

    expect(onSearch).toHaveBeenCalledWith('mewtwo');
  });

  it('saves trimmed term to localStorage on search', async () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} previousTerm="" />);
    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.type(input, '  eevee  ');
    await userEvent.click(button);

    expect(localStorage.getItem(STORAGE_KEY)).toBe('eevee');
  });

  it('does not call onSearch if term has not changed', async () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} previousTerm="pikachu" />);
    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.clear(input);
    await userEvent.type(input, 'pikachu');
    await userEvent.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('overwrites existing localStorage value when new search', async () => {
    localStorage.setItem(STORAGE_KEY, 'old-term');
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} previousTerm="old-term" />);
    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.clear(input);
    await userEvent.type(input, 'new-term');
    await userEvent.click(button);

    expect(localStorage.getItem(STORAGE_KEY)).toBe('new-term');
  });
});