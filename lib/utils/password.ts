export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
  errorMessage: string | null;
}

export function validateStrongPassword(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const isValid =
    hasMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;

  let errorMessage: string | null = null;
  if (!hasMinLength) {
    errorMessage = "Password must be at least 8 characters long.";
  } else if (!hasUppercase) {
    errorMessage = "Password must contain at least one uppercase letter (A-Z).";
  } else if (!hasLowercase) {
    errorMessage = "Password must contain at least one lowercase letter (a-z).";
  } else if (!hasDigit) {
    errorMessage = "Password must contain at least one digit (0-9).";
  } else if (!hasSpecialChar) {
    errorMessage = "Password must contain at least one special character (@$!%*?&#...).";
  }

  return {
    isValid,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasDigit,
    hasSpecialChar,
    errorMessage,
  };
}
