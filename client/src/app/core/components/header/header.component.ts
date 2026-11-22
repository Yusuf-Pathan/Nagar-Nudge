import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LANGUAGE_OPTIONS } from '../../constants/app.constants';
import { Language } from '../../enums/language.enum';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  readonly languages = LANGUAGE_OPTIONS;
  isMenuCollapsed = true;

  constructor(
    public readonly languageService: LanguageService,
    public readonly authService: AuthService,
    private router: Router
  ) {}

  get currentLang(): Language {
    return this.languageService.currentLang;
  }

  get currentLabel(): string {
    return this.languages.find(l => l.code === this.currentLang)?.label ?? '';
  }

  changeLanguage(lang: Language): void {
    this.languageService.use(lang);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
