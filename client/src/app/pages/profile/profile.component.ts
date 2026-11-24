import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  constructor(private auth: AuthService) {}

  get user() {
    return this.auth.getUser();
  }

  get initial(): string {
    const name = this.user?.name?.trim() ?? '';
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}
