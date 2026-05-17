import { useState, useCallback } from 'react';
import { Routes, Route, Link, useSearchParams } from 'react-router';
import Search from './components/Search/Search';
import Results from './components/Results/Results';
import Pagination from './components/Pagination/Pagination';
import ErrorButton from './components/ErrorButton/ErrorButton';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import type { PokemonItem } from './types/pokemon';
import { fetchPokemonList } from './services/pokemonApi';
import './App.css';

const ITEMS_PER_PAGE = 20;

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<PokemonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousTerm, setPreviousTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const loadData = useCallback(
    async (term: string, page: number) => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPokemonList(term, page);
        setItems(data.results);
        setTotalCount(data.count);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        setItems([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(
    async (term: string) => {
      setPreviousTerm(term);
      const newParams = new URLSearchParams();
      newParams.set('page', '1');
      setSearchParams(newParams);
      await loadData(term, 1);
    },
    [setSearchParams, loadData]
  );

  const handleInitialSearch = useCallback(
    async (term: string) => {
      setPreviousTerm(term);
      await loadData(term, currentPage);
    },
    [currentPage, loadData]
  );

  const handlePageChange = useCallback(
    async (newPage: number) => {
      const newParams = new URLSearchParams();
      newParams.set('page', String(newPage));
      setSearchParams(newParams);
      await loadData(previousTerm, newPage);
    },
    [setSearchParams, loadData, previousTerm]
  );

  return (
    <div className="app">
      <Search
        onSearch={handleSearch}
        previousTerm={previousTerm}
        onInitialSearch={handleInitialSearch}
      />
      <Results items={items} loading={loading} error={error} />
      {!loading && !error && items.length > 0 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <ErrorButton />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <nav
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e4e7',
        }}
      >
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