'use client';

import { useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSelectedItemsStore } from '@/store/selectedItemsStore';
import { downloadCsv } from '@/app/actions';
import './Flyout.css';

export function Flyout() {
  const t = useTranslations('flyout');
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const unselectAll = useSelectedItemsStore((state) => state.unselectAll);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const selectedCount = selectedItems.length;

  const handleDownload = useCallback(async () => {
    const csvContent = await downloadCsv(selectedItems);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.click();
      URL.revokeObjectURL(url);
    }
  }, [selectedItems]);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flyout">
      <span className="flyout-count">
        {t('itemsSelected', { count: selectedCount })}
      </span>
      <div className="flyout-actions">
        <button className="flyout-button" onClick={unselectAll}>
          {t('unselectAll')}
        </button>
        <button className="flyout-button flyout-button--primary" onClick={handleDownload}>
          {t('download')}
        </button>
      </div>
      <a
        ref={downloadLinkRef}
        style={{ display: 'none' }}
        download={`${selectedCount}_items.csv`}
        aria-hidden="true"
      />
    </div>
  );
}