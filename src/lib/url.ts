/**
 * Builds an internal link that respects `base` from astro.config.mjs.
 * url('/about') → '/about' (user site) or '/portfolio/about' (project site).
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}

/** True for strings that still contain a TODO marker (used to hide/disable unfinished links). */
export function isTodo(value?: string | null): boolean {
  return !value || /\[?TODO/i.test(value);
}
