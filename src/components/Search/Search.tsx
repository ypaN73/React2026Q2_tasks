import { Component } from 'react';
import './Search.css';

const STORAGE_KEY = 'pokemon-search-term';

interface SearchProps {
  onSearch: (term: string) => void;
  previousTerm: string;
}

interface SearchState {
  term: string;
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    const savedTerm = localStorage.getItem(STORAGE_KEY) || '';
    this.state = { term: savedTerm };
  }

  componentDidMount() {
    const { term } = this.state;
    this.props.onSearch(term);
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ term: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.term.trim();

    if (trimmed === this.props.previousTerm) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, trimmed);
    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <section className="search-section">
        <div className="search-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search Pokémon..."
            value={this.state.term}
            onChange={this.handleInputChange}
          />
          <button className="search-button" onClick={this.handleSearch}>
            Search
          </button>
        </div>
      </section>
    );
  }
}

export default Search;
