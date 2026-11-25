import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  readonly bannerPoints = [
    'AUTH.BANNER.POINT_1',
    'AUTH.BANNER.POINT_2',
    'AUTH.BANNER.POINT_3'
  ];
}
