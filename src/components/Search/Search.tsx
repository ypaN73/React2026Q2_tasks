'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import './Search.css';

const STORAGE_KEY = 'pokemon-search-term';

interface SearchProps {
  onSearch: (term: string) => void;
  previousTerm: string;
  onInitialSearch?: (term: string) => void;
}

export function Search({ onSearch, previousTerm, onInitialSearch }: SearchProps) {
  const t = useTranslations('search');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [savedTerm, setSavedTerm] = useLocalStorage(STORAGE_KEY, '');
  const [term, setTerm] = useState<string>(savedTerm);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (onInitialSearch) {
      onInitialSearch(savedTerm);
    } else {
      onSearch(savedTerm);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = term.trim();

      if (trimmed === previousTerm) {
        return;
      }

      setSavedTerm(trimmed);

      const params = new URLSearchParams(searchParams.toString());
      params.set('q', trimmed);
      params.set('page', '1');
      router.push(`?${params.toString()}`);
      onSearch(trimmed);
    },
    [term, previousTerm, onSearch, setSavedTerm, router, searchParams]
  );

  return (
    <section className="search-section">
      <form ref={formRef} className="search-controls" onSubmit={handleSubmit}>
        <input
          type="text"
          name="q"
          className="search-input"
          placeholder={t('placeholder')}
          value={term}
          onChange={handleInputChange}
        />
        <button type="submit" className="search-button">
          {t('button')}
        </button>
      </form>
    </section>
  );
}