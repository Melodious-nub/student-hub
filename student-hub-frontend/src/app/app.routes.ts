import { Routes } from '@angular/router';
import { AuthGuard, TeacherGuard, StudentGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Landing page
  { path: '', loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent) },
  
  // Teacher routes
  { path: 'teacher/login', loadComponent: () => import('./components/auth/teacher-login/teacher-login.component').then(m => m.TeacherLoginComponent) },
  { path: 'teacher/register', loadComponent: () => import('./components/auth/teacher-register/teacher-register.component').then(m => m.TeacherRegisterComponent) },
  { path: 'teacher/dashboard', loadComponent: () => import('./components/dashboard/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent), canActivate: [TeacherGuard] },
  
  // Student routes
  { path: 'student/login', loadComponent: () => import('./components/auth/student-login/student-login.component').then(m => m.StudentLoginComponent) },
  { path: 'student/register', loadComponent: () => import('./components/auth/student-register/student-register.component').then(m => m.StudentRegisterComponent) },
  { path: 'student/dashboard', loadComponent: () => import('./components/dashboard/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent), canActivate: [StudentGuard] },
  { path: 'student/teacher/:id', loadComponent: () => import('./components/dashboard/teacher-profile/teacher-profile.component').then(m => m.TeacherProfileComponent), canActivate: [StudentGuard] },
  
  // Redirect to landing page for any other route
  { path: '**', redirectTo: '' }
];
