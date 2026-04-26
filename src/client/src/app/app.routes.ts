import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./auth/feature/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./auth/feature/callback/callback.component').then(m => m.CallbackComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./urls/feature/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'dashboard/analytics/:shortCode',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./urls/feature/analytics/analytics.component').then(m => m.AnalyticsComponent),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/ui/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  { path: '**', redirectTo: 'not-found' },
];
