import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const issuerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (!user() || user() === null) {
    router.navigate(['/home'], {replaceUrl: true});
    return false;
  }

  if (user()!.role === 'ISSUER') {
    return true;
  }

  router.navigate(['/home'], {replaceUrl: true});
  return false;
};
