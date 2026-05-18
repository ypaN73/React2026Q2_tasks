import { useState, useCallback } from 'react';
import { Routes, Route, Link, useSearchParams, Outlet } from 'react-router';
import Search from './components/Search/Search';
import Results from './components/Results/Results';
import Pagination from './components/Pagination/Pagination';
import ErrorButton from './components/ErrorButton/ErrorButton';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import DetailsPage from './pages/DetailsPage';
import type { PokemonItem } from './types/pokemon';
import { fetchPokemonList } from './services/pokemonApi';
import './App.css';

const ITEMS_PER_PAGE = 20;

function HomeLayout() {
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
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', String(newPage));
      setSearchParams(newParams);
      await loadData(previousTerm, newPage);
    },
    [setSearchParams, loadData, previousTerm, searchParams]
  );

  return (
    <div className="app">
      <Search
        onSearch={handleSearch}
        previousTerm={previousTerm}
        onInitialSearch={handleInitialSearch}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Results items={items} loading={loading} error={error} />
          {!loading && !error && items.length > 0 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        <Outlet />
      </div>
      <ErrorButton />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={null} />
          <Route path="/:detailsId" element={<DetailsPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;