import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createElement, useState } from 'react';
import { useTheme } from './useTheme';
import { ThemeContext } from '../context/ThemeContext';
import type { ReactNode } from 'react';
import type { ThemeContextType } from '../context/ThemeContext';

function createWrapper(initialTheme: 'light' | 'dark' = 'light') {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

    const value: ThemeContextType = {
      theme,
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    };

    return createElement(
      ThemeContext.Provider,
      { value },
      children
    );
  };

  Wrapper.displayName = 'ThemeWrapper';

  return Wrapper;
}

describe('useTheme', () => {
  it('throws error when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('returns theme object when used inside ThemeContext', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
    expect(result.current.theme).toBe('light');
    expect(typeof result.current.toggleTheme).toBe('function');
  });
});