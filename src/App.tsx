import { useState, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router';
import Search from './components/Search/Search';
import Results from './components/Results/Results';
import ErrorButton from './components/ErrorButton/ErrorButton';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import type { PokemonItem } from './types/pokemon';
import { fetchPokemonList } from './services/pokemonApi';
import './App.css';

function HomePage() {
  const [items, setItems] = useState<PokemonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousTerm, setPreviousTerm] = useState('');

  const handleSearch = useCallback(async (term: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPokemonList(term);
      setItems(data.results);
      setPreviousTerm(term);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setItems([]);
      setPreviousTerm(term);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="app">
      <Search onSearch={handleSearch} previousTerm={previousTerm} />
      <Results items={items} loading={loading} error={error} />
      <ErrorButton />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <nav style={{ padding: '12px 16px', borderBottom: '1px solid #e5e4e7' }}>
        <Link to="/" style={{ marginRight: '16px' }}>
          Home
        </Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;