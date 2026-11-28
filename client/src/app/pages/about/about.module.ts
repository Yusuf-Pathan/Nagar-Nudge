import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';

@NgModule({
  declarations: [AboutComponent],
  imports: [CoreModule, AboutRoutingModule]
})
export class AboutModule {}
