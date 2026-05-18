import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('renders author information', () => {
    render(
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Author: Polina')).toBeInTheDocument();
  });

  it('renders link to GitHub profile', () => {
    render(
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>
    );
    const link = screen.getByText('GitHub Profile');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/ypaN73');
  });

  it('renders link to RS School React course', () => {
    render(
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>
    );
    const link = screen.getByText('RS School React Course');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });

  it('renders back to search link', () => {
    render(
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>
    );
    expect(screen.getByText('← Back to Search')).toBeInTheDocument();
  });
});