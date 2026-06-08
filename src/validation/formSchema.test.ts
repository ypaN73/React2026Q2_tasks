import { describe, it, expect } from 'vitest';
import { formSchema } from './formSchema';

function createFile(name: string, type: string, size: number): File {
  const blob = new Blob(['x'.repeat(size)], { type });
  return new File([blob], name, { type });
}

describe('formSchema', () => {
  describe('name validation', () => {
    it('accepts name starting with uppercase', () => {
      const result = formSchema.safeParse({
        name: 'Alice',
        age: 25,
        email: 'alice@example.com',
        gender: 'female',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects name starting with lowercase', () => {
      const result = formSchema.safeParse({
        name: 'alice',
        age: 25,
        email: 'alice@example.com',
        gender: 'female',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First letter must be uppercase');
      }
    });

    it('rejects empty name', () => {
      const result = formSchema.safeParse({
        name: '',
        age: 25,
        email: 'alice@example.com',
        gender: 'female',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('age validation', () => {
    it('accepts valid age', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative age', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: -5,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-integer age', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 25.5,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('email validation', () => {
    it('accepts valid email', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects email without @', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bobexample.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects email with empty local part', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: '@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects email without dot in domain', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@examplecom',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('gender validation', () => {
    it('accepts valid gender values', () => {
      ['male', 'female', 'other'].forEach((gender) => {
        const result = formSchema.safeParse({
          name: 'Bob',
          age: 30,
          email: 'bob@example.com',
          gender,
          terms: true,
          image: createFile('test.png', 'image/png', 1024),
          country: 'Belarus',
          password: 'Abcdef1!',
          confirmPassword: 'Abcdef1!',
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid gender value', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'invalid',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('terms validation', () => {
    it('accepts terms when true', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects terms when false', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: false,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('image validation', () => {
    it('accepts valid PNG image', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid JPEG image', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.jpg', 'image/jpeg', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects non-image file type', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.txt', 'text/plain', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects file larger than 5MB', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 6 * 1024 * 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty file', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 0),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('password validation', () => {
    it('accepts valid password', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects password shorter than 8 characters', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Ab1!',
        confirmPassword: 'Ab1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without uppercase letter', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'abcdef1!',
        confirmPassword: 'abcdef1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without lowercase letter', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'ABCDEF1!',
        confirmPassword: 'ABCDEF1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without digit', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdefg!',
        confirmPassword: 'Abcdefg!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without special character', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef12',
        confirmPassword: 'Abcdef12',
      });
      expect(result.success).toBe(false);
    });

    it('rejects when passwords do not match', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef2@',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('country validation', () => {
    it('accepts non-empty country', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: 'Belarus',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty country', () => {
      const result = formSchema.safeParse({
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
        gender: 'male',
        terms: true,
        image: createFile('test.png', 'image/png', 1024),
        country: '',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      });
      expect(result.success).toBe(false);
    });
  });
});