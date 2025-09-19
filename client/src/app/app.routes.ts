import { Routes } from '@angular/router';
import { issuerGuard } from './core/guards/issuer.guard';
import { homeGuard } from './core/guards/home.guard';
import { userGuard } from './core/guards/user.guard';

export const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./features/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'login', 
    loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'home', 
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent), 
    canActivate: [homeGuard]
  },
  {
    path: 'view/:uuid',
    loadComponent: () => import('./features/view/view.component').then(c => c.ViewComponent)
  },
  {
    path: 'certificates',
    loadComponent: () => import('./features/certificates/certificates.component').then(c => c.CertificatesComponent), 
    canActivate: [homeGuard,userGuard]
  },
  {
    path: 'verify',
    loadComponent: () => import('./features/verify/verify.component').then(c => c.VerifyFormComponent)
  },
  {
    path: 'issue',
    loadComponent: () => import('./features/issue/issue.component').then(c => c.IssueComponent),
    canActivate: [homeGuard,issuerGuard]
  },
  {
    path: 'revoke',
    loadComponent: () => import('./features/revoke/revoke.component').then(c => c.RevokeComponent),
    canActivate: [homeGuard,issuerGuard]
  }
];
