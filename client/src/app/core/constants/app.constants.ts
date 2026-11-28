import { Language } from '../enums/language.enum';
import { StepItem } from '../models/index';

// Change this to your backend URL
// export const API_BASE_URL = 'http://localhost:3000/api/v1';
export const API_BASE_URL = 'https://nagar-nudge.onrender.com/api/v1';

export const TOKEN_KEY = 'nn_access_token';
export const LANG_KEY = 'nn_lang';
export const DEFAULT_LANG = Language.EN;

export const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: Language.EN, label: 'English' },
  { code: Language.HI, label: 'हिन्दी' }
];

export const HOW_IT_WORKS_STEPS: StepItem[] = [
  {
    number: 1,
    titleKey: 'HOW_IT_WORKS.STEPS.REPORT.TITLE',
    descKey: 'HOW_IT_WORKS.STEPS.REPORT.DESC',
    icon: 'bi-camera-fill'
  },
  {
    number: 2,
    titleKey: 'HOW_IT_WORKS.STEPS.TRACK.TITLE',
    descKey: 'HOW_IT_WORKS.STEPS.TRACK.DESC',
    icon: 'bi-search'
  },
  {
    number: 3,
    titleKey: 'HOW_IT_WORKS.STEPS.RESOLVE.TITLE',
    descKey: 'HOW_IT_WORKS.STEPS.RESOLVE.DESC',
    icon: 'bi-check-circle-fill'
  }
];

export const USER_KEY = 'nn_user';
