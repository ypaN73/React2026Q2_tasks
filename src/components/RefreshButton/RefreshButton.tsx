'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import './RefreshButton.css';

export function RefreshButton() {
  const t = useTranslations('refresh');
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['pokemonList'] });
    queryClient.invalidateQueries({ queryKey: ['pokemonDetail'] });
  };

  return (
    <button className="refresh-button" onClick={handleRefresh}>
      {t('button')}
    </button>
  );
}