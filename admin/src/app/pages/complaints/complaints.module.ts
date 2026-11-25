import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/core.module';
import { ComplaintsRoutingModule } from './complaints-routing.module';
import { AllComplaintsComponent } from './all-complaints/all-complaints.component';
import { AssignComplaintsComponent } from './assign-complaints/assign-complaints.component';

@NgModule({
  declarations: [AllComplaintsComponent, AssignComplaintsComponent],
  imports: [CoreModule, FormsModule, ReactiveFormsModule, ComplaintsRoutingModule],
})
export class ComplaintsModule {}
