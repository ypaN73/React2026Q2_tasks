import { describe, it, expect, vi, beforeEach } from 'vitest';

const DEFAULT_CACHE_TTL = 300000;

describe('queryClient', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('uses default cache TTL when env variable is not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_CACHE_TTL', '');
    const { queryClient } = await import('../queryClient');

    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions.queries?.staleTime).toBe(DEFAULT_CACHE_TTL);
  });

  it('uses cache TTL from environment variable', async () => {
    vi.stubEnv('NEXT_PUBLIC_CACHE_TTL', '60000');
    const { queryClient } = await import('../queryClient');

    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions.queries?.staleTime).toBe(60000);
  });
});