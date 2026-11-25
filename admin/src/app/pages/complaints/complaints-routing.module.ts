import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllComplaintsComponent } from './all-complaints/all-complaints.component';
import { AssignComplaintsComponent } from './assign-complaints/assign-complaints.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'all' },
      { path: 'all', component: AllComplaintsComponent },
      { path: 'assign', component: AssignComplaintsComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplaintsRoutingModule {}
