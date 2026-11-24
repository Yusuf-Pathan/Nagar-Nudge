import { Component } from '@angular/core';

import { LANGUAGE_OPTIONS } from '../../constants/app.constants';
import { Language } from '../../enums/language.enum';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html'
})
export class LanguageSwitcherComponent {
  readonly languages = LANGUAGE_OPTIONS;

  constructor(public readonly languageService: LanguageService) {}

  get currentLang(): Language {
    return this.languageService.currentLang;
  }

  get currentLabel(): string {
    return this.languages.find(l => l.code === this.currentLang)?.label ?? '';
  }

  change(lang: Language): void {
    this.languageService.use(lang);
  }
}
