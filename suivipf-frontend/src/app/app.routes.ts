import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/auth.model';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Authentication routes
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  // Protected routes
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'interventions',
    loadComponent: () => import('./components/interventions/intervention-list/intervention-list.component').then(m => m.InterventionListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.ACCOUNTING_POST, UserRole.IT_PROFESSIONAL, UserRole.FOCAL_POINT] }
  },
  {
    path: 'interventions/new',
    loadComponent: () => import('./components/interventions/intervention-form/intervention-form.component').then(m => m.InterventionFormComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.ACCOUNTING_POST, UserRole.IT_PROFESSIONAL, UserRole.FOCAL_POINT] }
  },
  {
    path: 'interventions/:id',
    loadComponent: () => import('./components/interventions/intervention-detail/intervention-detail.component').then(m => m.InterventionDetailComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.ACCOUNTING_POST, UserRole.IT_PROFESSIONAL, UserRole.FOCAL_POINT] }
  },
  {
    path: 'intervention-sheets',
    loadComponent: () => import('./components/intervention-sheets/intervention-sheet-list/intervention-sheet-list.component').then(m => m.InterventionSheetListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.FOCAL_POINT, UserRole.IT_PROFESSIONAL] }
  },
  {
    path: 'users',
    loadComponent: () => import('./components/users/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'comptable-posts',
    loadComponent: () => import('./components/comptable-posts/comptable-post-list/comptable-post-list.component').then(m => m.ComptablePostListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.SERVICE] }
  },
  {
    path: 'focal-points',
    loadComponent: () => import('./components/focal-points/focal-point-list/focal-point-list.component').then(m => m.FocalPointListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.SERVICE] }
  },

  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports-dashboard/reports-dashboard.component').then(m => m.ReportsDashboardComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];
