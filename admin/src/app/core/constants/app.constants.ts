import { Language } from '../enums/language.enum';

// Change this to your backend URL
// export const API_BASE_URL = 'http://localhost:3000/api/v1';
export const API_BASE_URL = 'https://nagar-nudge.onrender.com/api/v1';

export const TOKEN_KEY = 'nn_admin_token';
export const USER_KEY = 'nn_admin_user';
export const LANG_KEY = 'nn_admin_lang';
export const DEFAULT_LANG = Language.EN;

export const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: Language.EN, label: 'English' },
  { code: Language.HI, label: 'हिन्दी' },
];

/**
 * Mapbox public token (pk....).
 * Create one at https://account.mapbox.com/access-tokens/
 * Do not commit real tokens — use an env override or local uncommitted edit.
 */
export const MAPBOX_TOKEN = '';

/** Default map view (Ahmedabad) */
export const MAP_CENTER: [number, number] = [72.5714, 23.0225];
export const MAP_ZOOM = 11;
export const MAP_PITCH = 50;
export const MAP_BEARING = -17;
