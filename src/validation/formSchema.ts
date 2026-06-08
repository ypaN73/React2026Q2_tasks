import { z } from 'zod';

const validateEmail = (email: string): boolean => {
  if (!email || !email.includes('@')) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [localPart, domain] = parts;
  if (localPart.length === 0) return false;
  if (!domain.includes('.')) return false;
  const domainParts = domain.split('.');
  const topLevel = domainParts[domainParts.length - 1];
  if (topLevel.length < 2) return false;
  return true;
};

const hasUpperCase = (str: string): boolean => {
  if (!str) return false;
  for (const char of str) {
    if (char >= 'A' && char <= 'Z') return true;
  }
  return false;
};

const hasLowerCase = (str: string): boolean => {
  if (!str) return false;
  for (const char of str) {
    if (char >= 'a' && char <= 'z') return true;
  }
  return false;
};

const hasDigit = (str: string): boolean => {
  if (!str) return false;
  for (const char of str) {
    if (char >= '0' && char <= '9') return true;
  }
  return false;
};

const hasSpecialChar = (str: string): boolean => {
  if (!str) return false;
  const allowed = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`"\'\\';
  for (const char of str) {
    if (allowed.includes(char)) return true;
  }
  return false;
};

const validateName = (val: string): boolean => {
  if (!val || val.length === 0) return false;
  return val[0] === val[0].toUpperCase();
};

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .refine(validateName, 'First letter must be uppercase'),
    age: z
      .number({ message: 'Age must be a number' })
      .int('Age must be a whole number')
      .nonnegative('Age cannot be negative')
      .max(150, 'Age must be realistic'),
    email: z
      .string()
      .min(1, 'Email is required')
      .refine(validateEmail, {
        message:
          'Email must contain one @, non-empty local part, and domain with a dot',
      }),
    gender: z.enum(['male', 'female', 'other'], {
      message: 'Please select a gender',
    }),
    terms: z.literal(true, {
      message: 'You must accept the terms and conditions',
    }),
    image: z
      .instanceof(File, { message: 'Image is required' })
      .refine(
        (file) => file.type === 'image/png' || file.type === 'image/jpeg',
        'Only .png and .jpg files are allowed'
      )
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        'File size must be less than 5MB'
      )
      .refine((file) => file.size > 0, 'Image file cannot be empty'),
    country: z.string().min(1, 'Country is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine(hasUpperCase, 'Password must contain at least 1 uppercase letter')
      .refine(hasLowerCase, 'Password must contain at least 1 lowercase letter')
      .refine(hasDigit, 'Password must contain at least 1 number')
      .refine(hasSpecialChar, 'Password must contain at least 1 special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type FormSchemaType = z.infer<typeof formSchema>;