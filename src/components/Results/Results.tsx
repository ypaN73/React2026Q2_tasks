import { Link, useSearchParams } from 'react-router';
import type { PokemonItem } from '../../types/pokemon';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import './Results.css';

interface ResultsProps {
  items: PokemonItem[];
  loading: boolean;
  error: string | null;
}

function Results({ items, loading, error }: ResultsProps) {
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('page') || '1';
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, item: PokemonItem) => {
    event.stopPropagation();
    toggleItem(item);
  };

  if (loading) {
    return (
      <section className="results-section">
        <div className="results-status">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="results-section">
        <div className="results-status results-status--error">{error}</div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="results-section">
        <div className="results-status">No Pokémon found.</div>
      </section>
    );
  }

  return (
    <section className="results-section">
      <ul className="results-list">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              to={`/${item.name}?page=${currentPage}`}
              className="result-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <input
                type="checkbox"
                className="result-checkbox"
                checked={selectedItems.some((selected) => selected.name === item.name)}
                onChange={(e) => handleCheckboxChange(e, item)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="result-name">{item.name}</span>
              <span className="result-description">{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Results;