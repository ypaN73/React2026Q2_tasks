'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import './ErrorButton.css';

export function ErrorButton() {
  const t = useTranslations('errorButton');
  const [shouldThrow, setShouldThrow] = useState(false);

  const handleClick = () => {
    setShouldThrow(true);
  };

  if (shouldThrow) {
    throw new Error('Test error triggered by Error Button');
  }

  return (
    <button className="error-button" onClick={handleClick}>
      {t('label')}
    </button>
  );
}