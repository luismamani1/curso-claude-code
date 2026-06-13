const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) return false;
  const domain = trimmed.split('@')[1];
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  return true;
}

function getEmailError(email) {
  if (!email || email.trim() === '') return 'El email es requerido.';
  if (!isValidEmail(email)) return 'El formato del email no es válido. Ejemplo: usuario@dominio.com';
  return null;
}

module.exports = { isValidEmail, getEmailError };
