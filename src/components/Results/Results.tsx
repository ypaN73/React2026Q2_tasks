'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import type { PokemonItem } from '@/types/pokemon';
import { useSelectedItemsStore } from '@/store/selectedItemsStore';
import { useTranslations } from 'next-intl';
import './Results.css';

interface ResultsProps {
  items: PokemonItem[];
  loading: boolean;
  error: string | null;
}

export function Results({ items, loading, error }: ResultsProps) {
  const t = useTranslations('results');
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = searchParams.get('page') || '1';
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);

  const handleCardClick = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('details', name);
    router.push(`?${params.toString()}`);
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: PokemonItem
  ) => {
    event.stopPropagation();
    toggleItem(item);
  };

  if (loading) {
    return (
      <section className="results-section">
        <div className="results-status">{t('loading')}</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="results-section">
        <div className="results-status results-status--error">{error}</div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="results-section">
        <div className="results-status">{t('noResults')}</div>
      </section>
    );
  }

  return (
    <section className="results-section">
      <ul className="results-list">
        {items.map((item) => (
          <li key={item.name}>
            <div
              className="result-card"
              onClick={() => handleCardClick(item.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCardClick(item.name);
              }}
              style={{ cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                className="result-checkbox"
                checked={selectedItems.some(
                  (selected) => selected.name === item.name
                )}
                onChange={(e) => handleCheckboxChange(e, item)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="result-name">{item.name}</span>
              <span className="result-description">{item.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}