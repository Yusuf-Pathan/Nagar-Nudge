import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html'
})
export class UserMenuComponent {
  constructor(private auth: AuthService, private router: Router) {}

  get initial(): string {
    const name = this.auth.getUser()?.name?.trim() ?? '';
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
