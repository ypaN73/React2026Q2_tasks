import { Link } from 'react-router';

function AboutPage() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>About</h1>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
        This is a Pokémon search application built with React and TypeScript.
      </p>
      <p style={{ fontSize: '18px', lineHeight: '1.6', marginTop: '16px' }}>
        Author: Your Name
      </p>
      <p style={{ fontSize: '18px', lineHeight: '1.6', marginTop: '16px' }}>
        <a
          href="https://rs.school/react/"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School React Course
        </a>
      </p>
      <Link to="/" style={{ display: 'inline-block', marginTop: '24px' }}>
        ← Back to Search
      </Link>
    </div>
  );
}

export default AboutPage;