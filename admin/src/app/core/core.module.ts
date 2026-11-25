import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AppShellComponent } from './components/app-shell/app-shell.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { TruncatePipe } from './pipes/truncate.pipe';

const SHARED = [
  AppShellComponent,
  FooterComponent,
  HeaderComponent,
  LanguageSwitcherComponent,
  PublicLayoutComponent,
  StatusBadgeComponent,
  UserMenuComponent,
  TruncatePipe,
];

@NgModule({
  declarations: [...SHARED],
  imports: [CommonModule, RouterModule, NgbModule, TranslateModule],
  exports: [...SHARED, CommonModule, RouterModule, NgbModule, TranslateModule],
})
export class CoreModule {}
