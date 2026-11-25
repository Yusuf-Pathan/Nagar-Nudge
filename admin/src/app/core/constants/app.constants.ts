import { Language } from '../enums/language.enum';

// Change this to your backend URL
export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const TOKEN_KEY = 'nn_admin_token';
export const USER_KEY = 'nn_admin_user';
export const LANG_KEY = 'nn_admin_lang';
export const DEFAULT_LANG = Language.EN;

export const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: Language.EN, label: 'English' },
  { code: Language.HI, label: 'हिन्दी' },
];
