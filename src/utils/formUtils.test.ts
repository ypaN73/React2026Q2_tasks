import { describe, it, expect, vi } from 'vitest';
import { convertToBase64, getPasswordStrength } from './formUtils';

describe('convertToBase64', () => {
  it('converts a File to a base64 string', async () => {
    const content = 'Hello World';
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });

    const result = await convertToBase64(file);

    expect(result).toContain('data:text/plain;base64,');
    expect(typeof result).toBe('string');
  });

  it('rejects when FileReader fails', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function (this: FileReader) {
      if (this.onerror) {
        this.onerror(new ProgressEvent('error') as ProgressEvent<FileReader>);
      }
    });

    await expect(convertToBase64(file)).rejects.toThrow('Failed to convert file');

    vi.restoreAllMocks();
  });
});

describe('getPasswordStrength', () => {
  it('returns empty string for empty password', () => {
    expect(getPasswordStrength('')).toBe('');
  });

  it('returns Weak for password meeting 1-2 criteria', () => {
    expect(getPasswordStrength('abcdefgh')).toBe('Weak');
    expect(getPasswordStrength('ABCDEFGH')).toBe('Weak');
  });

  it('returns Medium for password meeting 3-4 criteria', () => {
    expect(getPasswordStrength('Abcdefgh')).toBe('Medium');
    expect(getPasswordStrength('Abcdefg1')).toBe('Medium');
  });

  it('returns Strong for password meeting all 5 criteria', () => {
    expect(getPasswordStrength('Abcdef1!')).toBe('Strong');
  });

  it('handles password with only digits', () => {
    expect(getPasswordStrength('12345678')).toBe('Weak');
  });

  it('handles password with only special characters', () => {
    expect(getPasswordStrength('!@#$%^&*()')).toBe('Weak');
  });
});