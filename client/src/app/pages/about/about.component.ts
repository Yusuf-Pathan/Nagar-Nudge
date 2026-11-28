import { Component } from '@angular/core';

interface AboutStep {
  titleKey: string;
  descKey: string;
}

interface WebsiteFact {
  labelKey: string;
  valueKey: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  readonly instagramUrl =
    'https://www.instagram.com/nagar_nudge?gwpx=MTZkMWkyajZibHI3MA%3D%3D&utm_source=qr';
  readonly year = new Date().getFullYear();

  readonly steps: AboutStep[] = [
    { titleKey: 'HOW_IT_WORKS.STEPS.REPORT.TITLE', descKey: 'HOW_IT_WORKS.STEPS.REPORT.DESC' },
    { titleKey: 'HOW_IT_WORKS.STEPS.TRACK.TITLE', descKey: 'HOW_IT_WORKS.STEPS.TRACK.DESC' },
    { titleKey: 'HOW_IT_WORKS.STEPS.RESOLVE.TITLE', descKey: 'HOW_IT_WORKS.STEPS.RESOLVE.DESC' }
  ];

  readonly websiteDetails: WebsiteFact[] = [
    { labelKey: 'ABOUT.WEBSITE.NAME', valueKey: 'ABOUT.WEBSITE.NAME_VALUE' },
    { labelKey: 'ABOUT.WEBSITE.PLATFORM', valueKey: 'ABOUT.WEBSITE.PLATFORM_VALUE' },
    { labelKey: 'ABOUT.WEBSITE.FOCUS', valueKey: 'ABOUT.WEBSITE.FOCUS_VALUE' },
    { labelKey: 'ABOUT.WEBSITE.USERS', valueKey: 'ABOUT.WEBSITE.USERS_VALUE' }
  ];
}
