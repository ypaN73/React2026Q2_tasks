'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from '@/components/Search/Search';
import { Results } from '@/components/Results/Results';
import { Pagination } from '@/components/Pagination/Pagination';
import { ErrorButton } from '@/components/ErrorButton/ErrorButton';
import { Flyout } from '@/components/Flyout/Flyout';
import { RefreshButton } from '@/components/RefreshButton/RefreshButton';
import { DetailsPage } from '@/components/DetailsPage/DetailsPage';
import { usePokemonList } from '@/hooks/api/usePokemonList';
import '@/App.css';

const ITEMS_PER_PAGE = 20;

interface SearchPageContentProps {
  page: string;
  detailsId?: string;
  query: string;
}

export function SearchPageContent({ page, detailsId, query }: SearchPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [previousTerm, setPreviousTerm] = useState(query);

  const currentPage = Number(page) || 1;

  const { data, isLoading, error } = usePokemonList(previousTerm, currentPage);

  const items = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const loading = isLoading;
  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  const handleSearch = useCallback(
    (term: string) => {
      setPreviousTerm(term);
      const params = new URLSearchParams();
      params.set('page', '1');
      if (term) params.set('q', term);
      router.push(`?${params.toString()}`);
    },
    [router]
  );

  const handleInitialSearch = useCallback((term: string) => {
    setPreviousTerm(term);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(newPage));
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleCloseDetails = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('details');
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

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
        {detailsId && <DetailsPage detailsId={detailsId} onClose={handleCloseDetails} />}
      </div>
      <Flyout />
      <ErrorButton />
    </div>
  );
}