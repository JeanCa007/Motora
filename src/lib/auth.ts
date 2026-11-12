const BASE_PATH = __BASE_PATH__.split('/').filter(Boolean).join('/');

export const PATH_PREFIX = BASE_PATH ? `/${BASE_PATH}` : '';

export const AUTH_ROUTES = {
  login: '/ingresar',
  register: '/registro',
  forgot: '/recuperar-contrasena',
  reset: '/auth/reset-password',
  callback: '/auth/callback',
  account: '/mi-cuenta',
} as const;

const AUTH_SEGMENTS = ['/auth', '/ingresar', '/registro', '/recuperar-contrasena', '/restablecer'];

/** Convierte una ruta interna en una URL absoluta válida para redirectTo de Supabase. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = `${window.location.origin}${PATH_PREFIX}`;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export function authCallbackUrl(next?: string): string {
  const base = absoluteUrl(AUTH_ROUTES.callback);
  if (!next) return base;
  return `${base}?next=${encodeURIComponent(next)}`;
}

/**
 * Sólo acepta destinos internos de la misma aplicación y descarta
 * cualquier ruta del propio flujo de autenticación (evita bucles).
 */
export function validateOrdinaryPostAuthNext(
  raw: string | null | undefined,
  fallback: string = AUTH_ROUTES.account,
): string {
  if (!raw) return fallback;
  const value = raw.trim();
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;

  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return fallback;

    const path = url.pathname.toLowerCase();
    const prefix = PATH_PREFIX.toLowerCase();
    const relativePath = prefix && path.startsWith(prefix) ? path.slice(prefix.length) || '/' : path;

    if (AUTH_SEGMENTS.some((segment) => relativePath === segment || relativePath.startsWith(`${segment}/`))) {
      return fallback;
    }

    const target = `${url.pathname}${url.search}${url.hash}`;
    return target || fallback;
  } catch {
    return fallback;
  }
}

const GENERIC_ERROR = 'No pudimos completar la operación. Intentá de nuevo en un momento.';

export function authErrorMessage(message: string | undefined | null): string {
  if (!message) return GENERIC_ERROR;
  const value = message.toLowerCase();

  if (value.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos. Verificá tus datos e intentá de nuevo.';
  }
  if (value.includes('email not confirmed')) {
    return 'Tu correo todavía no está confirmado. Revisá tu bandeja de entrada o pedí un código nuevo.';
  }
  if (value.includes('user already registered') || value.includes('already been registered')) {
    return 'Ese correo ya tiene una cuenta. Probá ingresando o recuperá tu contraseña.';
  }
  if (value.includes('password should be at least')) {
    return 'La contraseña es demasiado corta. Usá al menos 6 caracteres.';
  }
  if (value.includes('signups not allowed') || value.includes('signup disabled')) {
    return 'El registro con correo está desactivado por el momento. Contactá al equipo de Motora.';
  }
  if (value.includes('rate limit') || value.includes('too many') || value.includes('for security purposes')) {
    return 'Hicimos demasiados intentos seguidos. Esperá unos minutos y volvé a probar.';
  }
  if (value.includes('expired') || value.includes('invalid token') || value.includes('token has expired')) {
    return 'El código no es válido o ya venció. Pedí uno nuevo e intentá otra vez.';
  }
  if (value.includes('user not found')) {
    return 'No encontramos una cuenta con ese correo. Podés crear una cuenta nueva.';
  }
  if (value.includes('unable to validate email') || value.includes('invalid email')) {
    return 'El correo no es válido. Revisá cómo lo escribiste.';
  }
  if (value.includes('same password')) {
    return 'La contraseña nueva debe ser diferente a la anterior.';
  }
  if (value.includes('network') || value.includes('failed to fetch')) {
    return 'No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.';
  }

  return GENERIC_ERROR;
}