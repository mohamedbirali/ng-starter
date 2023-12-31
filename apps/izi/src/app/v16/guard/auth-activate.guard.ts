import { CanActivateFn } from '@angular/router';

export const authActivateGuard: CanActivateFn = (route, state) => {
  return true;
};
