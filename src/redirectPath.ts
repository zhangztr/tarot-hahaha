/**
 * Shared sessionStorage key for the GitHub Pages 404 SPA fallback.
 *
 * Kept in its own module so the 404 entry (`redirect.ts`) and the SPA
 * (`App.tsx`) agree on the key without importing each other.
 */
export const REDIRECT_KEY = "tarot-redirect-path";
