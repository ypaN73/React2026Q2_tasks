import { Link } from 'react-router';

function AboutPage() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>About</h1>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
        This is a Pokémon search application built with React and TypeScript.
      </p>
      <p style={{ fontSize: '18px', lineHeight: '1.6', marginTop: '16px' }}>
        Author: Polina
      </p>
      <p style={{ fontSize: '18px', lineHeight: '1.6', marginTop: '8px' }}>
        <a
          href="https://github.com/ypaN73"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Profile
        </a>
      </p>
      <p style={{ fontSize: '18px', lineHeight: '1.6', marginTop: '24px' }}>
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School React Course
        </a>
      </p>
      <Link to="/" style={{ display: 'inline-block', marginTop: '32px' }}>
        ← Back to Search
      </Link>
    </div>
  );
}

export default AboutPage;