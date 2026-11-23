import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/core.module';
import { ComplaintsRoutingModule } from './complaints-routing.module';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';
import { RaiseComplaintComponent } from './raise-complaint/raise-complaint.component';

@NgModule({
  declarations: [RaiseComplaintComponent, MyComplaintsComponent],
  imports: [CoreModule, ReactiveFormsModule, ComplaintsRoutingModule],
})
export class ComplaintsModule {}
