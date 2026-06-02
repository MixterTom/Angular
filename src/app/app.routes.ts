import { Routes } from '@angular/router'; 
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'builder',
        loadComponent: () => import('./features/builder/builder.component').then(m => m.BuilderComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
