import { FireAuthService } from '@firebase';
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap, take } from 'rxjs';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (
  route,
  state,
) => {
  const router: Router = inject(Router);

  // Check the authentication status
  return inject(FireAuthService)
    .user$()
    .pipe(
      take(1),
      switchMap((authenticated) => {
        // If the user is authenticated...
        if (authenticated) {
          return of(router.parseUrl(''));
        }

        // Allow the access
        return of(true);
      }),
    );
};
