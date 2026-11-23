import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppShellComponent } from '../../core/components/app-shell/app-shell.component';
import { RaiseComplaintComponent } from './raise-complaint/raise-complaint.component';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'new' },
      { path: 'new', component: RaiseComplaintComponent },
      // { path: 'my', component: MyComplaintsComponent }  // add when built
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplaintsRoutingModule {}
