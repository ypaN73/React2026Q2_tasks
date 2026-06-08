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
import './App.css';
import Flyout from './components/Flyout/Flyout';
import { useTheme } from './hooks/useTheme';
import { usePokemonList } from './hooks/api/usePokemonList';
import RefreshButton from './components/RefreshButton/RefreshButton';
import UncontrolledForm from './components/UncontrolledForm/UncontrolledForm';
import HookForm from './components/HookForm/HookForm';
import { useFormStore } from './store/formStore';

const ITEMS_PER_PAGE = 20;

function HomeLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [previousTerm, setPreviousTerm] = useState('');
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, isLoading, error } = usePokemonList(previousTerm, currentPage);

  const items = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const loading = isLoading;
  const errorMessage = error instanceof Error
    ? error.message
    : error
      ? String(error)
      : null;

  const handleSearch = useCallback(
    (term: string) => {
      setPreviousTerm(term);
      const newParams = new URLSearchParams();
      newParams.set('page', '1');
      setSearchParams(newParams);
    },
    [setSearchParams]
  );

  const handleInitialSearch = useCallback(
    (term: string) => {
      setPreviousTerm(term);
    },
    []
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', String(newPage));
      setSearchParams(newParams);
    },
    [setSearchParams, searchParams]
  );

  return (
    <div className="app">
      <Search
        onSearch={handleSearch}
        previousTerm={previousTerm}
        onInitialSearch={handleInitialSearch}
      />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 24px 0' }}>
        <RefreshButton />
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Results items={items} loading={loading} error={errorMessage} />
          {!loading && !errorMessage && items.length > 0 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        <Outlet />
      </div>
      <Flyout />
      <ErrorButton />
    </div>
  );
}

function SubmissionsDisplay() {
  const submissions = useFormStore((s) => s.submissions);
  const markAsSeen = useFormStore((s) => s.markAsSeen);

  if (submissions.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>No form submissions yet.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '16px' }}>Form Submissions ({submissions.length})</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {submissions.map((submission) => (
          <div
            key={submission.id}
            style={{
              border: submission.isNew
                ? '2px solid #22c55e'
                : '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              backgroundColor: submission.isNew
                ? 'rgba(34, 197, 94, 0.08)'
                : 'var(--surface)',
              transition: 'border-color 0.5s, background-color 0.5s',
            }}
            onTransitionEnd={() => {
              if (submission.isNew) {
                markAsSeen(submission.id);
              }
            }}
          >
            {submission.image && (
              <img
                src={submission.image}
                alt={submission.name}
                style={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
              />
            )}
            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>
              {submission.name}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '4px' }}>
              Age: {submission.age}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '4px' }}>
              Email: {submission.email}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '4px' }}>
              Gender: {submission.gender}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '4px' }}>
              Country: {submission.country}
            </p>
            {submission.isNew && (
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: '#22c55e',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginTop: '8px',
                }}
              >
                New
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [isUncontrolledOpen, setIsUncontrolledOpen] = useState(false);
  const [isHookFormOpen, setIsHookFormOpen] = useState(false);

  return (
    <ErrorBoundary>
      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <button
          onClick={() => setIsUncontrolledOpen(true)}
          style={{
            padding: '6px 16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            color: 'var(--text)',
            background: 'var(--bg)',
            border: '1.5px solid var(--border)',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Uncontrolled Form
        </button>
        <button
          onClick={() => setIsHookFormOpen(true)}
          style={{
            padding: '6px 16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            color: 'var(--text)',
            background: 'var(--bg)',
            border: '1.5px solid var(--border)',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          React Hook Form
        </button>
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </nav>

      <UncontrolledForm
        isOpen={isUncontrolledOpen}
        onClose={() => setIsUncontrolledOpen(false)}
      />
      <HookForm
        isOpen={isHookFormOpen}
        onClose={() => setIsHookFormOpen(false)}
      />

      <SubmissionsDisplay />

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