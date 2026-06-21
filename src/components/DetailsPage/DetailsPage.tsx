'use client';

import { usePokemonDetails } from '@/hooks/api/usePokemonDetails';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import './DetailsPage.css';

interface DetailsPageProps {
  detailsId: string;
  onClose: () => void;
}

export function DetailsPage({ detailsId, onClose }: DetailsPageProps) {
  const t = useTranslations('details');
  const { data: details, isLoading, error } = usePokemonDetails(detailsId);

  if (!detailsId) {
    return null;
  }

  return (
    <div className="details-panel">
      <button className="details-close-btn" onClick={onClose} aria-label={t('close')}>
        ✕
      </button>

      {isLoading && <div className="details-loading">{t('loading')}</div>}

      {error && (
        <div className="details-loading" style={{ color: 'var(--error)' }}>
          {error instanceof Error ? error.message : String(error)}
        </div>
      )}

      {details && !isLoading && (
        <div>
          <h2 className="details-name">{details.name}</h2>
          {details.sprites.front_default && (
            <Image
              src={details.sprites.front_default}
              alt={details.name}
              width={200}
              height={200}
              className="details-image"
            />
          )}
          <p className="details-info">
            <strong>{t('height')}:</strong> {details.height}
          </p>
          <p className="details-info">
            <strong>{t('weight')}:</strong> {details.weight}
          </p>
          <p className="details-info">
            <strong>{t('types')}:</strong>{' '}
            {details.types.map((type) => type.type.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}