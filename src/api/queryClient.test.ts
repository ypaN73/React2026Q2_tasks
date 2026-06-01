import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('queryClient', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('uses default cache TTL when env variable is not set', async () => {
    vi.stubEnv('VITE_CACHE_TTL', '');
    const { queryClient } = await import('./queryClient');

    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions.queries?.staleTime).toBe(300000);
  });

  it('uses cache TTL from environment variable', async () => {
    vi.stubEnv('VITE_CACHE_TTL', '60000');
    const { queryClient } = await import('./queryClient');

    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions.queries?.staleTime).toBe(60000);
  });
});