'use client';

import { useTranslations } from 'next-intl';
import './Pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations('pagination');

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {t('previous')}
      </button>
      <span className="pagination-info">
        {t('page', { page, total: totalPages })}
      </span>
      <button
        className="pagination-button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {t('next')}
      </button>
    </div>
  );
}