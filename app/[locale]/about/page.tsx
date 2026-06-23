import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{t('title')}</h1>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{t('description')}</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6', marginTop: '16px' }}>{t('author')}</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6', marginTop: '8px' }}>
        <a href="https://github.com/ypaN73" target="_blank" rel="noopener noreferrer">
          {t('githubProfile')}
        </a>
      </p>
      <p style={{ fontSize: '18px', lineHeight: '1.6', marginTop: '24px' }}>
        <a href="https://rs.school/courses/reactjs" target="_blank" rel="noopener noreferrer">
          {t('rsSchoolCourse')}
        </a>
      </p>
      <Link href="/" style={{ display: 'inline-block', marginTop: '32px' }}>
        {t('backToSearch')}
      </Link>
    </div>
  );
}