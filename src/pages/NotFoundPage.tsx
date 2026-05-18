import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '40px 20px',
      }}
    >
      <h1 style={{ fontSize: '72px', margin: '0 0 16px' }}>404</h1>
      <p style={{ fontSize: '20px', marginBottom: '32px' }}>
        Page not found
      </p>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

export default NotFoundPage;