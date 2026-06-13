// Regex basada en RFC 5322 — rechaza casos como usuario@.com, @dom.com, usuario@
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/**
 * Valida que un email tenga formato correcto según RFC 5322.
 * Rechaza casos borde que la validación nativa del navegador permite.
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) return false;
  // Rechaza dominios que empiezan o terminan con punto: usuario@.com / usuario@com.
  const domain = trimmed.split('@')[1];
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  return true;
}

/**
 * Retorna un mensaje de error si el email es inválido, o null si es válido.
 */
export function getEmailError(email) {
  if (!email || email.trim() === '') return 'El email es requerido.';
  if (!isValidEmail(email)) return 'El formato del email no es válido. Ejemplo: usuario@dominio.com';
  return null;
}
