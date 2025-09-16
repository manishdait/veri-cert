import { Routes } from '@angular/router';
import { homeGuard } from './home.guard';

export const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'home', 
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent), canActivate: [homeGuard]
  },
];
