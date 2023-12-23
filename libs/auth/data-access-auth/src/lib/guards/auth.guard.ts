import { FireAuthService } from '@firebase';
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap, take } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router: Router = inject(Router);

  // Check the authentication status
  return inject(FireAuthService)
    .user$()
    .pipe(
      take(1),
      switchMap((authenticated) => {
        // If the user is authenticated...
        if (!authenticated) {
          const redirectURL =
            state.url === '/logout' ? '' : `redirectURL=${state.url}`;
          const urlTree = router.parseUrl(`login?${redirectURL}`);

          return of(urlTree);
        }

        // Allow the access
        return of(true);
      }),
    );
};
