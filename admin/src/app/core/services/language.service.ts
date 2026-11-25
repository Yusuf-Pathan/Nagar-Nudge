import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { DEFAULT_LANG, LANG_KEY, LANGUAGE_OPTIONS } from '../constants/app.constants';
import { Language } from '../enums/language.enum';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly langSubject = new BehaviorSubject<Language>(DEFAULT_LANG);
  readonly lang$ = this.langSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.addLangs(LANGUAGE_OPTIONS.map((l) => l.code));
    this.translate.setDefaultLang(DEFAULT_LANG);
  }

  init(): void {
    const saved = localStorage.getItem(LANG_KEY) as Language | null;
    const isValid = saved !== null && Object.values(Language).includes(saved);
    this.use(isValid ? saved! : DEFAULT_LANG);
  }

  use(lang: Language): void {
    this.translate.use(lang);
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    this.langSubject.next(lang);
  }

  get currentLang(): Language {
    return this.langSubject.value;
  }
}
