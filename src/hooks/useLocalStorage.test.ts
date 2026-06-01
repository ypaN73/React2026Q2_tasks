import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default')
    );
    expect(result.current[0]).toBe('default');
  });

  it('returns stored value when localStorage has data', () => {
    localStorage.setItem('test-key', 'stored-value');
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default')
    );
    expect(result.current[0]).toBe('stored-value');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default')
    );

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem('test-key')).toBe('new-value');
  });

  it('handles localStorage.getItem throwing error', () => {
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = vi.fn().mockImplementation(() => {
      throw new Error('Storage unavailable');
    });

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback')
    );

    expect(result.current[0]).toBe('fallback');

    localStorage.getItem = originalGetItem;
  });

  it('handles localStorage.setItem throwing error and still updates state', () => {
    const originalSetItem = localStorage.setItem;

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default')
    );

    localStorage.setItem = vi.fn().mockImplementation(() => {
      throw new Error('Storage full');
    });

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');

    localStorage.setItem = originalSetItem;
  });
});