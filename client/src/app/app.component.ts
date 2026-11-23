import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isAppArea = false;

  constructor(
    private languageService: LanguageService,
    private router: Router,
  ) {
    this.languageService.init();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.isAppArea =
          e.urlAfterRedirects.startsWith('/complaints') ||
          e.urlAfterRedirects.startsWith('/profile');
      });
  }
}
