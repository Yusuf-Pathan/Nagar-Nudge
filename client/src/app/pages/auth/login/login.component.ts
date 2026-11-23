import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  activeTab = 'login';
  prefillIdentifier = '';
  showSignupSuccess = false;

  readonly bannerPoints = [
    'AUTH.BANNER.POINT_1',
    'AUTH.BANNER.POINT_2',
    'AUTH.BANNER.POINT_3'
  ];

  onRegistered(email: string): void {
    this.prefillIdentifier = email;
    this.showSignupSuccess = true;
    this.activeTab = 'login';
  }

  onTabChange(): void {
    this.showSignupSuccess = false;
  }
}
