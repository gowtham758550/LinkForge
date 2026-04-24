import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthStore } from '../../auth/data-access/auth.store';

export const noAuthGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.token()) return true;
  if (authStore.isAuthenticated()) return router.createUrlTree(['/dashboard']);

  return authStore.initializeFromToken().pipe(
    map(ok => (ok ? router.createUrlTree(['/dashboard']) : true)),
  );
};
