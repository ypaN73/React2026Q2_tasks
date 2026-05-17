import { useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import './Search.css';

const STORAGE_KEY = 'pokemon-search-term';

interface SearchProps {
  onSearch: (term: string) => void;
  previousTerm: string;
  onInitialSearch?: (term: string) => void;
}

function Search({ onSearch, previousTerm, onInitialSearch }: SearchProps) {
  const [savedTerm, setSavedTerm] = useLocalStorage(STORAGE_KEY, '');
  const [term, setTerm] = useState<string>(savedTerm);
  const initialCallDone = useRef(false);

  useEffect(() => {
    if (!initialCallDone.current && onInitialSearch) {
      initialCallDone.current = true;
      onInitialSearch(savedTerm);
    }
  }, [savedTerm, onInitialSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleSearch = useCallback(() => {
    const trimmed = term.trim();

    if (trimmed === previousTerm) {
      return;
    }

    setSavedTerm(trimmed);
    onSearch(trimmed);
  }, [term, previousTerm, onSearch, setSavedTerm]);

  return (
    <section className="search-section">
      <div className="search-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search Pokémon..."
          value={term}
          onChange={handleInputChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </section>
  );
}

export default Search;