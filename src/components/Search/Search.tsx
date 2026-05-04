import { Component } from 'react';
import './Search.css';

class Search extends Component {
  render() {
    return (
      <section className="search-section">
        <div className="search-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search Pokémon..."
          />
          <button className="search-button">Search</button>
        </div>
      </section>
    );
  }
}

export default Search;