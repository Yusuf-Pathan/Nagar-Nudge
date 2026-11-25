import { Language } from '../enums/language.enum';
import { CategoryItem, StepItem } from '../models/index';

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

export const POPULAR_CATEGORIES: CategoryItem[] = [
  { key: 'ROADS', icon: 'bi-cone-striped', colorClass: 'cat-roads' },
  { key: 'STREETLIGHTS', icon: 'bi-lightbulb-fill', colorClass: 'cat-light' },
  { key: 'GARBAGE', icon: 'bi-trash3-fill', colorClass: 'cat-garbage' },
  { key: 'WATER', icon: 'bi-droplet-fill', colorClass: 'cat-water' },
  { key: 'DRAINAGE', icon: 'bi-water', colorClass: 'cat-drain' },
  // { key: 'OTHERS', icon: 'bi-three-dots', colorClass: 'cat-others' }
];

export const USER_KEY = 'nn_user';
