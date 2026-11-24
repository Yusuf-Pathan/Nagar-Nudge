import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CoreModule, ProfileRoutingModule],
})
export class ProfileModule {}
