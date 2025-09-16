import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const homeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(response => {
      if (response) {
        return true;
      }
      
      router.navigate(['login'], {replaceUrl: true});
      return false;
    }),

    catchError((err) => {
      router.navigate(['login'], {replaceUrl: true});
      return of(false);
    })
  )
};

