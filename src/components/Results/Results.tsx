import { Component } from 'react';
import type { PokemonItem } from '../../types/pokemon';
import './Results.css';

interface ResultsProps {
  items: PokemonItem[];
  loading: boolean;
  error: string | null;
}

class Results extends Component<ResultsProps> {
  render() {
    const { items, loading, error } = this.props;

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
            <li key={item.name} className="result-card">
              <span className="result-name">{item.name}</span>
              <span className="result-description">{item.description}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

export default Results;
