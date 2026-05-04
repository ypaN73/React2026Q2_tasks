import { Component } from 'react';
import './Results.css';

class Results extends Component {
  render() {
    return (
      <section className="results-section">
        <p className="results-placeholder">
          Enter a search term to find Pokémon.
        </p>
      </section>
    );
  }
}

export default Results;