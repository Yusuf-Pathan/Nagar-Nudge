import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/core.module';
import { ComplaintsRoutingModule } from './complaints-routing.module';
import { RaiseComplaintComponent } from './raise-complaint/raise-complaint.component';

@NgModule({
  declarations: [RaiseComplaintComponent],
  imports: [CoreModule, ReactiveFormsModule, ComplaintsRoutingModule]
})
export class ComplaintsModule {}
