import { Component } from 'react';
import Search from './components/Search/Search';
import Results from './components/Results/Results';
import ErrorButton from './components/ErrorButton/ErrorButton';
import type { PokemonItem } from './types/pokemon';
import { fetchPokemonList } from './services/pokemonApi';
import './App.css';

interface AppState {
  items: PokemonItem[];
  loading: boolean;
  error: string | null;
  previousTerm: string;
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      items: [],
      loading: false,
      error: null,
      previousTerm: '',
    };
  }

  handleSearch = async (term: string) => {
    this.setState({ loading: true, error: null });

    try {
      const data = await fetchPokemonList(term);
      this.setState({
        items: data.results,
        loading: false,
        previousTerm: term,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      this.setState({
        error: message,
        loading: false,
        items: [],
        previousTerm: term,
      });
    }
  };

  render() {
    return (
      <div className="app">
        <Search
          onSearch={this.handleSearch}
          previousTerm={this.state.previousTerm}
        />
        <Results
          items={this.state.items}
          loading={this.state.loading}
          error={this.state.error}
        />
        <ErrorButton />
      </div>
    );
  }
}

export default App;