import { Link } from '@/i18n/routing';
import '@/index.css';

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px 20px',
        fontFamily: 'system-ui, sans-serif',
        background: '#f9fafb',
        color: '#374151',
      }}
    >
      <h1 style={{ fontSize: '72px', margin: '0 0 16px', color: '#111827' }}>404</h1>
      <p style={{ fontSize: '20px', marginBottom: '32px' }}>Page not found</p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '10px 24px',
          fontSize: '16px',
          fontWeight: 600,
          color: '#fff',
          background: '#6366f1',
          border: 'none',
          borderRadius: '6px',
          textDecoration: 'none',
        }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}