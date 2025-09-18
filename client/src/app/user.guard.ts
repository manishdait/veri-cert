import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (!user() || user() === null) {
    router.navigate(['/home'], {replaceUrl: true});
    return false;
  }

  if (user()!.role === 'USER') {
    return true;
  }

  router.navigate(['/home'], {replaceUrl: true});
  return false;
};
