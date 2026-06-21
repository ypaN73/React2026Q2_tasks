'use client';

import { useTheme } from '@/hooks/useTheme';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();

  return (
    <nav className="app-nav">
      <Link href="/">{t('nav.home')}</Link>
      <Link href="/about">{t('nav.about')}</Link>
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label={
          theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')
        }
      >
        {theme === 'light' ? t('theme.dark') : t('theme.light')}
      </button>
    </nav>
  );
}