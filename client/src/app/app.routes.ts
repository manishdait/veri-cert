import { Routes } from '@angular/router';
import { homeGuard } from './home.guard';
import { userGuard } from './user.guard';
import { issuerGuard } from './issuer.guard';

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
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent), 
    canActivate: [homeGuard]
  },
  {
    path: 'view/:uuid',
    loadComponent: () => import('./view/view.component').then(c => c.ViewComponent)
  },
  {
    path: 'certificates',
    loadComponent: () => import('./certificates/certificates.component').then(c => c.CertificatesComponent), 
    canActivate: [homeGuard,userGuard]
  },
  {
    path: 'verify',
    loadComponent: () => import('./verify/verify.component').then(c => c.VerifyFormComponent)
  },
  {
    path: 'issue',
    loadComponent: () => import('./issue/issue.component').then(c => c.IssueComponent),
    canActivate: [homeGuard,issuerGuard]
  },
  {
    path: 'revoke',
    loadComponent: () => import('./revoke/revoke.component').then(c => c.RevokeComponent),
    canActivate: [homeGuard,issuerGuard]
  }
];
