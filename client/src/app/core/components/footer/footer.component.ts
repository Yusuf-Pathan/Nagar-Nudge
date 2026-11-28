import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly instagramUrl =
    'https://www.instagram.com/nagar_nudge?gwpx=MTZkMWkyajZibHI3MA%3D%3D&utm_source=qr';
}
