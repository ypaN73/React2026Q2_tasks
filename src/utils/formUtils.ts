export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to convert file'));
    reader.readAsDataURL(file);
  });
};

export const getPasswordStrength = (password: string): string => {
  if (password.length === 0) return '';

  let score = 0;
  if (password.length >= 8) score++;

  let hasUpper = false;
  let hasLower = false;
  let hasDigit = false;
  let hasSpecial = false;

  for (const char of password) {
    if (char >= 'A' && char <= 'Z') hasUpper = true;
    else if (char >= 'a' && char <= 'z') hasLower = true;
    else if (char >= '0' && char <= '9') hasDigit = true;
    else hasSpecial = true;
  }

  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasDigit) score++;
  if (hasSpecial) score++;

  if (score <= 2) return 'Weak';
  if (score <= 4) return 'Medium';
  return 'Strong';
};