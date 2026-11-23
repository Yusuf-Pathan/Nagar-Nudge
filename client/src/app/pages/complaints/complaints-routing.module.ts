import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RaiseComplaintComponent } from './raise-complaint/raise-complaint.component';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'new-complaint' },
      { path: 'new-complaint', component: RaiseComplaintComponent },
      { path: 'my-complaint', component: MyComplaintsComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplaintsRoutingModule {}
