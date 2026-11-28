import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppShellComponent } from './core/components/app-shell/app-shell.component';
import { PublicLayoutComponent } from './core/components/public-layout/public-layout.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth/login',
      },
    ],
  },

  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule,
          ),
      },
      {
        path: 'map',
        loadChildren: () =>
          import('./pages/map/map.module').then((m) => m.MapModule),
      },
      {
        path: 'complaints',
        loadChildren: () =>
          import('./pages/complaints/complaints.module').then(
            (m) => m.ComplaintsModule,
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./pages/categories/categories.module').then(
            (m) => m.CategoriesModule,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
