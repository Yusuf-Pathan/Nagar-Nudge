import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent implements OnDestroy {
  @ViewChild('main') main?: ElementRef<HTMLElement>;

  private navSub: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    this.navSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.resetScroll());
  }

  ngOnDestroy(): void {
    this.navSub.unsubscribe();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }

  goSearch(term: string): void {
    const q = term.trim();
    this.router.navigate(['/complaints/all'], {
      queryParams: q ? { search: q } : {},
    });
  }

  private resetScroll(): void {
    if (this.main) {
      this.main.nativeElement.scrollTop = 0;
    }
  }
}
