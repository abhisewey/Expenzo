export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(password);
};

export const getPasswordStrengthMessage = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain a lowercase letter.';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain an uppercase letter.';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain a number.';
  return '';
};
