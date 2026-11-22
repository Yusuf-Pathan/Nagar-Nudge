import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImageFallbackDirective } from './directives/image-fallback.directive';
import { TruncatePipe } from './pipes/truncate.pipe';

const SHARED = [HeaderComponent, FooterComponent, ImageFallbackDirective, TruncatePipe];

@NgModule({
  declarations: [...SHARED],
  imports: [CommonModule, RouterModule, NgbModule, TranslateModule],
  exports: [...SHARED, CommonModule, RouterModule, NgbModule, TranslateModule]
})
export class CoreModule {}
