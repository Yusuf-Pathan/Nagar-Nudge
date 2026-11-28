import { NgModule } from '@angular/core';

import { CoreModule } from '../../core/core.module';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';

@NgModule({
  declarations: [MapComponent],
  imports: [CoreModule, MapRoutingModule],
})
export class MapModule {}
